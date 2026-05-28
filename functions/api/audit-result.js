/**
 * CF Pages Function — GET /api/audit-result
 * Orchestre : polling Apify → benchmark concurrents → analyse Claude
 *
 * Env requis : APIFY_API_TOKEN, ANTHROPIC_API_KEY
 *
 * Flow (piloté par le frontend via polling) :
 *   1. ?listingRunId=xxx&platform=xxx&url=xxx
 *      → RUNNING | COMPETITORS_STARTED {competitorRunId}
 *   2. ?listingRunId=xxx&competitorRunId=yyy&platform=xxx&url=xxx
 *      → RUNNING | DONE {audit}
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const RUNNING = new Set(['RUNNING', 'READY', 'CREATED']);

// ── Apify helpers ──────────────────────────────────────────────────────────

async function apifyGet(path, token) {
  const sep = path.includes('?') ? '&' : '?';
  const r = await fetch(`https://api.apify.com/v2${path}${sep}token=${token}`);
  if (!r.ok) throw new Error(`Apify GET ${path}: ${r.status}`);
  return r.json();
}

async function apifyPost(path, token, body) {
  const r = await fetch(`https://api.apify.com/v2${path}?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Apify POST ${path}: ${r.status} ${await r.text()}`);
  return r.json();
}

async function getRunStatus(runId, token) {
  const d = await apifyGet(`/actor-runs/${runId}`, token);
  return d.data.status;
}

async function getDataset(runId, token) {
  const d = await apifyGet(`/actor-runs/${runId}/dataset/items?format=json`, token);
  return Array.isArray(d) ? d : (d.items || d.data?.items || []);
}

async function startRun(actorId, input, token) {
  const d = await apifyPost(`/acts/${actorId}/runs`, token, input);
  return d.data.id;
}

// ── Data extractors ────────────────────────────────────────────────────────

function extractCity(l) {
  return l.city || l.address?.city || l.location?.city ||
    l.neighborhood || l.primaryLocationName || l.locationTitle || null;
}

function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function normalizeListing(l, platform) {
  if (platform === 'airbnb') {
    const photos = l.photos || l.images || [];
    return {
      url: l.url,
      title: l.name || l.title || '',
      description: (l.description || l.htmlDescription?.htmlText || l.longDescription || '').replace(/<[^>]+>/g, '').slice(0, 4000),
      photosCount: photos.length,
      photoCaptions: photos.slice(0, 15).map(p => p.caption || p.alt || '').filter(Boolean),
      coverPhotoUrl: photos[0]?.pictureUrl || photos[0]?.url || '',
      amenities: (l.amenities || []).map(a => typeof a === 'string' ? a : (a.name || a.title || '')).filter(Boolean),
      rating: l.rating || l.stars || null,
      reviewsCount: l.reviewsCount || l.numberOfReviews || 0,
      pricePerNight: l.price?.rate || l.price?.amount || l.pricing?.rate || null,
      currency: l.price?.currency || 'EUR',
      location: `${l.city || l.neighborhood || ''}${l.country ? ', ' + l.country : ''}`,
      minNights: l.minNights || l.minNightStay || 1,
      instantBook: l.instantBook || false,
      isSuperhost: l.primaryHost?.isSuperhost || l.host?.isSuperhost || false,
      responseRate: l.primaryHost?.responseRate || l.host?.responseRate || null,
      responseTime: l.primaryHost?.responseTime || l.host?.responseTime || null,
      hostJoined: l.primaryHost?.memberSince || null,
      reviews: (l.reviews || []).slice(0, 20).map(r => ({
        rating: r.rating || r.score || 5,
        text: (r.comments || r.text || '').slice(0, 400),
        date: r.createdAt || r.localizedDate || '',
      })),
      calendarOccupancy: l.calendarMonths ? estimateOccupancy(l.calendarMonths) : null,
      checkInTime: l.checkInTime || null,
      checkOutTime: l.checkOutTime || null,
      bedroomsCount: l.bedroomsLabel || l.bedrooms || null,
      bathroomsCount: l.bathroomsLabel || l.bathrooms || null,
      personCapacity: l.personCapacity || null,
    };
  }
  // Booking.com
  const photos = l.images || l.photos || [];
  return {
    url: l.url,
    title: l.name || l.title || '',
    description: (l.description || l.longDescription || '').slice(0, 4000),
    photosCount: photos.length,
    photoCaptions: photos.slice(0, 15).map(p => p.caption || p.alt || '').filter(Boolean),
    coverPhotoUrl: photos[0]?.url || photos[0]?.src || '',
    amenities: (l.facilityHighlights || l.amenities || l.facilities || [])
      .map(a => typeof a === 'string' ? a : (a.name || '')).filter(Boolean),
    rating: l.rating ? l.rating / 2 : (l.score ? l.score / 2 : null), // Booking 0-10 → 0-5
    reviewsCount: l.reviews || l.numberOfReviews || l.reviewsCount || 0,
    pricePerNight: l.price?.value || l.lowestPricePerNight || l.price || null,
    currency: l.currency || 'EUR',
    location: `${l.city || ''}${l.country ? ', ' + l.country : ''}`,
    geniusLevel: l.geniusLevel || null,
    mobileDiscount: l.mobileDiscount || false,
    preferredPartner: l.preferredPartner || false,
    reviews: (l.reviewsList || l.reviewsDetails || []).slice(0, 20).map(r => ({
      rating: r.score || r.rating || 8,
      text: (r.text || r.content || r.comment || '').slice(0, 400),
      date: r.date || '',
    })),
  };
}

function normalizeCompetitor(c, platform) {
  if (platform === 'airbnb') {
    return {
      title: c.name || c.title || '',
      pricePerNight: c.price?.rate || c.price?.amount || null,
      rating: c.rating || null,
      reviewsCount: c.reviewsCount || c.numberOfReviews || 0,
      photosCount: (c.photos || c.images || []).length,
      instantBook: c.instantBook || false,
      amenities: (c.amenities || []).slice(0, 8).map(a => typeof a === 'string' ? a : (a.name || '')).filter(Boolean),
      url: c.url || '',
    };
  }
  return {
    title: c.name || c.title || '',
    pricePerNight: c.price?.value || c.lowestPricePerNight || null,
    rating: c.rating ? c.rating / 2 : null,
    reviewsCount: c.reviews || c.numberOfReviews || 0,
    photosCount: (c.images || c.photos || []).length,
    url: c.url || '',
  };
}

function estimateOccupancy(calendarMonths) {
  if (!calendarMonths?.length) return null;
  let booked = 0, total = 0;
  for (const month of calendarMonths) {
    for (const day of (month.days || [])) {
      if (day.available === false || day.booked) booked++;
      total++;
    }
  }
  return total ? Math.round((booked / total) * 100) : null;
}

// ── Claude Analysis ────────────────────────────────────────────────────────

function extractJSON(text) {
  try { return JSON.parse(text); } catch {}
  const m = text.match(/\{[\s\S]+\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  throw new Error('Impossible de parser la réponse Claude en JSON');
}

async function analyzeWithClaude(listing, competitors, platform, apiKey) {
  const platformLabel = platform === 'airbnb' ? 'Airbnb' : 'Booking.com';
  const platformCriteria = platform === 'airbnb'
    ? `CRITERES AIRBNB 2026 :
- Algorithme : qualité, popularité, prix, emplacement (4 piliers)
- "AI Legibility" 2026 : descriptions données brutes ("Wifi 500 Mbps") > marketing flou ("bel appart cosy")
- 25+ photos recommandées avec légendes descriptives = boost visibilité
- Instant Book activé = boost classement
- Durée min séjour courte = plus de résultats de recherche
- Chaque étoile de plus = +3,2% de revenu l'année suivante en moyenne
- 50% des signalements viennent d'équipements manquants ou cassés
- Les favoris (wishlists) et clics influencent le score popularité
- Badge "Guest Favorite" nécessite réservations et note élevée`
    : `CRITERES BOOKING.COM 2026 :
- Algorithme centré sur performance statistique et programme Genius
- "Note résultats de recherche" = % de fois visible quand dispo
- Tarifs enfants configurés = +15% réservations familles
- Réduction mobile -10% = badge prioritaire (appli = 1er canal vente 2026)
- Genius Niveau 2/3 = accès "SuperGuests" qui annulent moins
- Programme Preferred Partner (+3% commission) = boost classement + badge confiance
- Tagging précis des photos dans l'extranet = boost IA
- Travel Proud badge = filtre de recherche dédié, portée accrue`;

  const prompt = `Tu es un expert en optimisation d'annonces ${platformLabel} avec 10 ans d'expérience en location courte durée (LCD). Tu connais parfaitement l'algorithme ${platformLabel} 2026 dans les moindres détails.

ANNONCE A ANALYSER :
${JSON.stringify(listing, null, 2)}

CONCURRENTS DE LA MEME ZONE (${competitors.length} annonces) :
${JSON.stringify(competitors, null, 2)}

${platformCriteria}

INSTRUCTIONS :
- Analyse chaque critère de façon SPECIFIQUE à cette annonce (pas de conseils génériques)
- Base tes findings sur les vraies données extraites ci-dessus
- Pour le titre et la description générés : adapte au VRAI logement, pas un template
- Les scores doivent refléter objectivement l'état réel (ne pas gonfler)
- Comparaison concurrents : utilise les vraies données pour benchmarker

Réponds UNIQUEMENT avec le JSON ci-dessous, sans texte avant ni après, sans markdown ni backticks.

{
  "globalScore": <0-100, nombre entier>,
  "grade": "<A|B|C|D|F>",
  "gradeFr": "<Excellent|Bien|Correct|À améliorer|Critique>",
  "gradeColor": "<#22C55E pour A, #84CC16 pour B, #F59E0B pour C, #F97316 pour D, #EF4444 pour F>",
  "summary": "<phrase honnête 1-2 lignes résumant l'état de l'annonce>",
  "listing": {
    "title": "<titre exact de l'annonce>",
    "location": "<ville, pays>",
    "coverPhotoUrl": "<url photo couverture>",
    "photosCount": <nombre entier>,
    "rating": <note 0-5 ou null>,
    "reviewsCount": <nombre entier>,
    "pricePerNight": <prix numérique ou null>,
    "currency": "<EUR>",
    "url": "<url originale>"
  },
  "categories": [
    {
      "id": "photos",
      "label": "Qualité Photos",
      "icon": "📸",
      "score": <0-100>,
      "gradeLabel": "<Excellent|Bien|Correct|À améliorer|Critique>",
      "gradeColor": "<hex selon score>",
      "findings": ["<observation concrète 1>", "<observation 2>", "<observation 3>"],
      "recommendation": { "impact": "<HIGH|MEDIUM|LOW>", "action": "<action très spécifique à cette annonce>" }
    },
    {
      "id": "titre",
      "label": "Titre & Mots-clés",
      "icon": "✏️",
      "score": <0-100>,
      "gradeLabel": "<...>",
      "gradeColor": "<hex>",
      "findings": ["...", "...", "..."],
      "recommendation": { "impact": "<HIGH|MEDIUM|LOW>", "action": "<...>" }
    },
    {
      "id": "description",
      "label": "Description",
      "icon": "📝",
      "score": <0-100>,
      "gradeLabel": "<...>",
      "gradeColor": "<hex>",
      "findings": ["...", "...", "..."],
      "recommendation": { "impact": "<HIGH|MEDIUM|LOW>", "action": "<...>" }
    },
    {
      "id": "equipements",
      "label": "Équipements",
      "icon": "🏡",
      "score": <0-100>,
      "gradeLabel": "<...>",
      "gradeColor": "<hex>",
      "findings": ["...", "...", "..."],
      "recommendation": { "impact": "<HIGH|MEDIUM|LOW>", "action": "<...>" }
    },
    {
      "id": "pricing",
      "label": "Prix & Visibilité",
      "icon": "💰",
      "score": <0-100>,
      "gradeLabel": "<...>",
      "gradeColor": "<hex>",
      "findings": ["...", "...", "..."],
      "recommendation": { "impact": "<HIGH|MEDIUM|LOW>", "action": "<...>" }
    },
    {
      "id": "reviews",
      "label": "Avis & Réputation",
      "icon": "⭐",
      "score": <0-100>,
      "gradeLabel": "<...>",
      "gradeColor": "<hex>",
      "findings": ["...", "...", "..."],
      "recommendation": { "impact": "<HIGH|MEDIUM|LOW>", "action": "<...>" }
    },
    {
      "id": "host",
      "label": "${platform === 'airbnb' ? 'Signaux Hôte' : 'Programme Partenaire'}",
      "icon": "${platform === 'airbnb' ? '👤' : '🏅'}",
      "score": <0-100>,
      "gradeLabel": "<...>",
      "gradeColor": "<hex>",
      "findings": ["...", "...", "..."],
      "recommendation": { "impact": "<HIGH|MEDIUM|LOW>", "action": "<...>" }
    }
  ],
  "competitors": [
    {
      "title": "<titre>",
      "pricePerNight": <prix ou null>,
      "rating": <note ou null>,
      "reviewsCount": <nombre>,
      "photosCount": <nombre>,
      "url": "<url>"
    }
  ],
  "generatedContent": {
    "optimizedTitle": "<nouveau titre 50-70 chars MAXIMUM, inclut les vrais atouts, zéro mot vague ('cosy', 'magnifique', 'charmant')>",
    "optimizedTitleVariants": ["<variante A>", "<variante B>"],
    "optimizedDescriptionOpening": "<premiers 500 chars de description réécrite style fiche technique Airbnb 2026 : données brutes, chiffres précis, équipements avec specs, pas d'adjectifs creux>",
    "keyImprovements": [
      "<action prioritaire 1 très précise et actionnable>",
      "<action 2>",
      "<action 3>",
      "<action 4>",
      "<action 5>"
    ]
  },
  "revenueProjection": {
    "currentOccupancy": "<estimation % basée sur données calendrier si dispo, sinon estimation marché>",
    "targetOccupancy": "<% réaliste après implémentation des recommandations>",
    "potentialGain": "<+X€/mois estimé ou 'Non calculable sans données pricing'>",
    "basis": "<explication courte de l'estimation>"
  },
  "topActions": [
    { "impact": "HIGH", "category": "<catégorie>", "action": "<action courte et spécifique>", "icon": "<emoji>" },
    { "impact": "HIGH", "category": "<catégorie>", "action": "<action>", "icon": "<emoji>" },
    { "impact": "MEDIUM", "category": "<catégorie>", "action": "<action>", "icon": "<emoji>" },
    { "impact": "MEDIUM", "category": "<catégorie>", "action": "<action>", "icon": "<emoji>" }
  ]
}`;

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 8192, temperature: 0.2 },
      }),
    }
  );

  if (!r.ok) throw new Error(`Gemini API error: ${r.status} ${await r.text()}`);
  const d = await r.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Réponse Gemini vide');
  return extractJSON(text);
}

// ── Main handler ───────────────────────────────────────────────────────────

export async function onRequestOptions() {
  return new Response('', { status: 200, headers: CORS });
}

export async function onRequestGet({ request, env }) {
  const { APIFY_API_TOKEN, GEMINI_API_KEY } = env;
  const p = new URL(request.url).searchParams;

  const listingRunId = p.get('listingRunId');
  const competitorRunId = p.get('competitorRunId');
  const platform = p.get('platform');
  const url = p.get('url');

  if (!listingRunId) return json({ error: 'listingRunId requis' }, 400);

  try {
    // ── Phase 1 : Vérifier le run listing ──
    const listingStatus = await getRunStatus(listingRunId, APIFY_API_TOKEN);

    if (RUNNING.has(listingStatus)) {
      return json({ status: 'RUNNING', phase: 'listing', message: "Extraction de l'annonce en cours…" });
    }

    if (listingStatus !== 'SUCCEEDED') {
      return json({
        status: 'ERROR',
        message: "Le scraping a échoué. Vérifiez que l'URL est valide, publique et accessible.",
      }, 400);
    }

    const listingItems = await getDataset(listingRunId, APIFY_API_TOKEN);
    if (!listingItems.length) {
      return json({
        status: 'ERROR',
        message: "Aucune donnée extraite. L'annonce est peut-être privée ou l'URL est incorrecte.",
      }, 400);
    }

    const listing = normalizeListing(listingItems[0], platform);

    // ── Phase 2 : Démarrer le run concurrents ──
    if (!competitorRunId) {
      const city = extractCity(listingItems[0]);
      let compRunId = 'SKIP';

      if (city) {
        try {
          if (platform === 'airbnb') {
            compRunId = await startRun('apify~airbnb-scraper', {
              locationQuery: city,
              maxListings: 6,
              currency: 'EUR',
              checkIn: futureDate(30),
              checkOut: futureDate(31),
            }, APIFY_API_TOKEN);
          } else {
            compRunId = await startRun('dtrungtin~booking-scraper', {
              search: city,
              maxItems: 6,
            }, APIFY_API_TOKEN);
          }
        } catch {
          compRunId = 'SKIP';
        }
      }

      return json({
        status: 'COMPETITORS_STARTED',
        competitorRunId: compRunId,
        message: 'Benchmarking des annonces concurrentes…',
      });
    }

    // ── Phase 3 : Vérifier le run concurrents ──
    let competitors = [];

    if (competitorRunId !== 'SKIP') {
      const compStatus = await getRunStatus(competitorRunId, APIFY_API_TOKEN);

      if (RUNNING.has(compStatus)) {
        return json({ status: 'RUNNING', phase: 'competitors', message: 'Analyse des concurrents en cours…' });
      }

      if (compStatus === 'SUCCEEDED') {
        const compItems = await getDataset(competitorRunId, APIFY_API_TOKEN);
        competitors = compItems
          .filter(c => c.url !== url)
          .slice(0, 5)
          .map(c => normalizeCompetitor(c, platform));
      }
      // Si FAILED : on continue sans benchmark (dégradé)
    }

    // ── Phase 4 : Analyse Gemini ──
    const audit = await analyzeWithClaude(listing, competitors, platform, GEMINI_API_KEY);

    // Injecter la coverPhotoUrl depuis listing si manquante dans audit
    if (!audit.listing.coverPhotoUrl) audit.listing.coverPhotoUrl = listing.coverPhotoUrl;
    if (!audit.listing.url) audit.listing.url = url;

    return json({ status: 'DONE', audit });

  } catch (e) {
    return json({ status: 'ERROR', message: e.message }, 500);
  }
}
