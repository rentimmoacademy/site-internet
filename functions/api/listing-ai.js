/**
 * CF Pages Function — POST /api/listing-ai
 * Analyse IA multimodale (texte + 4 photos) d'une annonce, sur le palier GRATUIT de Google AI Studio.
 * Env : GEMINI_API_KEY (déjà présente en production).
 *
 * Entrée : { listing, comparables, declaredPrice } — UNIQUEMENT le contenu public de l'annonce.
 * Aucune donnée personnelle du lead (prénom, email, téléphone) n'est acceptée ni transmise.
 * Sortie : { ok: true, model, criteria: { photos|title|description|price|reviews|amenities: { score, verdict, recommendations[] } }, summary }
 *          { ok: false, reason } → le front garde la grille de règles fixes (l'audit ne tombe jamais en panne).
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8' } });

// Modèles flash gratuits (liste vérifiée le 13/11/2026 via /v1beta/models). Le « lite » passe en premier :
// ~4 s de réponse, alors que gemini-3.5-flash dépassait 14 s (forte demande) sur tous les tests du 13/11.
const MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-flash-lite-latest'];
const TIMEOUT_MS = [12000, 15000, 10000];
const CRITERIA = ['photos', 'title', 'description', 'price', 'reviews', 'amenities'];

const clip = (s, n) => String(s ?? '').slice(0, n);

function buildPrompt(l, comp, declaredPrice) {
  const compLines = (comp?.items || []).slice(0, 10).map((c, i) =>
    `${i + 1}. « ${clip(c.title, 80)} » · ${c.rating ?? '?'}★ (${c.reviewCount} avis) · ${c.nightlyPrice != null ? c.nightlyPrice + ' €/nuit' : 'prix ?'}`
  );
  return `Tu es un expert en optimisation d'annonces Airbnb (location courte durée, marché français).
Analyse l'annonce ci-dessous et les photos jointes (les ${'premières'} photos de l'annonce, dans l'ordre), avec la grille suivante.
Note chaque critère de 0 à 10 (entier) et donne 1 à 3 recommandations CONCRÈTES et PERSONNALISÉES par critère (cite ce que tu vois : pièce, objet, mot du titre…).

GRILLE
- photos : qualité (lumière, netteté, cadrage, horizon droit), ordre (la 1re photo doit être la plus forte), variété (chaque pièce, détails, extérieur), nombre (${l.photoCount ?? '?'} photos ; repère : 25 et plus).
- title : clarté, atout n°1 visible, repère d'emplacement, mots recherchés par les voyageurs, longueur (${l.titleLength} car. sur 50 autorisés). Propose un titre réécrit de 50 caractères maximum, sans inventer d'équipement absent.
- description : accroche des premières lignes, structure en rubriques, réponses aux questions pratiques, ton.
- price : positionnement face aux comparables, cohérent avec la note et la qualité perçue. ${declaredPrice ? `Prix moyen déclaré par l'hôte : ${declaredPrice} €/nuit.` : 'Prix de l\'annonce inconnu : juge seulement le positionnement possible face aux comparables.'}
- reviews : note globale et sous-notes, volume d'avis, statut Superhôte, réactivité.
- amenities : équipements présents / manquants importants pour ce type de logement.

RÈGLES STRICTES
- Écris en français, en tutoyant l'hôte, phrases courtes.
- N'invente AUCUN chiffre de revenu, de taux d'occupation ou de gain : n'utilise que les chiffres fournis ci-dessous.
- Ne cite aucun nom de personne.

ANNONCE
Titre : « ${clip(l.title, 120)} »
Type : ${clip(l.propertyType, 80)} · ${l.capacity ?? '?'} voyageurs · ${clip((l.overview || []).join(', '), 120)}
Ville : ${clip(l.city, 60)}
Note : ${l.rating ?? 'aucune'} (${l.reviewCount ?? 0} avis) · Sous-notes : ${clip(JSON.stringify(l.categoryRatings || {}), 300)}
Superhôte : ${l.isSuperhost ? 'oui' : 'non'} · Coup de cœur voyageurs : ${l.isGuestFavorite ? 'oui' : 'non'} · Réactivité : ${clip(l.responseTimeText, 60) || '?'} (${l.responseRate ?? '?'} %)
Équipements cochés : ${l.amenitiesCount ?? '?'} · Essentiels absents : ${clip((l.missingEssentials || []).join(', '), 200) || 'aucun'}
Description (${l.descriptionLength} car., rubriques : ${clip((l.descriptionSections || []).join(', '), 200) || 'aucune'}) :
"""${clip(l.descriptionText, 2500)}"""

COMPARABLES (${comp?.count ?? 0} annonces de la même ville, mêmes dates ${comp?.dates || ''}) : prix médian ${comp?.medianNightlyPrice ?? '?'} €/nuit, note médiane ${comp?.medianRating ?? '?'}, avis médians ${comp?.medianReviews ?? '?'}
${compLines.join('\n')}`;
}

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    summary: { type: 'STRING' },
    suggestedTitle: { type: 'STRING' },
    criteria: {
      type: 'OBJECT',
      properties: Object.fromEntries(
        CRITERIA.map((c) => [c, {
          type: 'OBJECT',
          properties: { score: { type: 'INTEGER' }, verdict: { type: 'STRING' }, recommendations: { type: 'ARRAY', items: { type: 'STRING' } } },
          required: ['score', 'verdict', 'recommendations'],
        }])
      ),
      required: CRITERIA,
    },
  },
  required: ['summary', 'criteria'],
};

async function imagePart(url) {
  try {
    const r = await fetch(url, { cf: { cacheTtl: 86400 } });
    if (!r.ok) return null;
    const type = (r.headers.get('content-type') || 'image/jpeg').split(';')[0];
    if (!type.startsWith('image/')) return null;
    const buf = new Uint8Array(await r.arrayBuffer());
    if (buf.length > 1_500_000) return null;
    let bin = '';
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    return { inline_data: { mime_type: type, data: btoa(bin) } };
  } catch {
    return null;
  }
}

async function callGemini(model, key, parts, timeoutMs) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.3, responseMimeType: 'application/json', responseSchema: SCHEMA, maxOutputTokens: 4096 },
      }),
    });
    if (!r.ok) return { ok: false, reason: `http_${r.status}` };
    const d = await r.json();
    const text = d?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
    return { ok: true, data: JSON.parse(text) };
  } catch (e) {
    return { ok: false, reason: e?.name === 'AbortError' ? 'timeout' : 'error' };
  } finally {
    clearTimeout(t);
  }
}

// Garde-fou : aucun montant en € autre que ceux fournis, scores bornés
function sanitize(data, allowedNumbers) {
  const out = { summary: clip(data.summary, 400), suggestedTitle: clip(data.suggestedTitle, 60), criteria: {} };
  const scrub = (s) => clip(s, 320).replace(/(\d[\d\s.,]*)\s?€/g, (m, n) => (allowedNumbers.has(Math.round(Number(String(n).replace(/[\s]/g, '').replace(',', '.')))) ? m : 'un montant'));
  for (const c of CRITERIA) {
    const v = data.criteria?.[c];
    if (!v) continue;
    const score = Math.max(0, Math.min(10, Math.round(Number(v.score))));
    if (!Number.isFinite(score)) continue;
    out.criteria[c] = { score, verdict: scrub(v.verdict), recommendations: (v.recommendations || []).slice(0, 3).map(scrub).filter(Boolean) };
  }
  out.summary = scrub(out.summary);
  return out;
}

export async function onRequestOptions() {
  return new Response('', { status: 204, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const key = env.GEMINI_API_KEY;
  if (!key) return json({ ok: false, reason: 'not_configured' });

  let body;
  try { body = await request.json(); } catch { return json({ ok: false, reason: 'bad_json' }, 400); }
  const l = body?.listing;
  if (!l || !l.title) return json({ ok: false, reason: 'missing_listing' }, 400);
  // Refus explicite de toute donnée de lead
  if (body.email || body.firstName || body.phone) return json({ ok: false, reason: 'pii_refused' }, 400);

  const photos = (Array.isArray(l.photoUrls) ? l.photoUrls : [])
    .filter((u) => /^https:\/\/a0\.muscache\.com\//.test(u))
    .slice(0, 4);
  const images = (await Promise.all(photos.map(imagePart))).filter(Boolean);
  const declaredPrice = Number(body.declaredPrice) > 0 ? Math.round(Number(body.declaredPrice)) : null;
  const parts = [{ text: buildPrompt(l, body.comparables, declaredPrice) }, ...images];

  const allowed = new Set(
    [declaredPrice, body.comparables?.medianNightlyPrice, ...(body.comparables?.items || []).map((c) => c.nightlyPrice)]
      .filter((x) => x != null).map((x) => Math.round(Number(x)))
  );

  const tried = [];
  for (let i = 0; i < MODELS.length; i++) {
    const res = await callGemini(MODELS[i], key, parts, TIMEOUT_MS[i]);
    tried.push(`${MODELS[i]}:${res.ok ? 'ok' : res.reason}`);
    if (res.ok && res.data?.criteria) {
      const clean = sanitize(res.data, allowed);
      if (Object.keys(clean.criteria).length >= 4) return json({ ok: true, model: MODELS[i], images: images.length, ...clean });
    }
  }
  return json({ ok: false, reason: 'ai_unavailable', tried });
}
