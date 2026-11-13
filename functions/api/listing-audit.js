/**
 * CF Pages Function — GET /api/listing-audit?url=<lien de l'annonce>
 *
 * Extraction GRATUITE des données publiques d'une annonce Airbnb (sans Apify ni API payante) :
 * on récupère la page publique de l'annonce côté serveur et on lit le JSON embarqué
 * (<script id="data-deferred-state-0">, données « niobeClientData ») + les balises meta.
 *
 * Réponse :
 *   { ok: true, source: "airbnb", listing: {...} }
 *   { ok: false, reason: "unsupported" | "invalid_url" | "blocked" | "parse_failed" | "not_found" }
 * Le front bascule alors sur l'auto-évaluation : le tunnel ne s'arrête jamais.
 *
 * Booking.com protège ses pages par un challenge anti-robot : non pris en charge (auto-évaluation).
 * Aucune donnée personnelle de lead ne transite ici, seulement le lien public de l'annonce.
 */

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

const BROWSER_HEADERS = {
  'User-Agent': UA,
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.6',
  'Cache-Control': 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json; charset=utf-8', ...extra },
  });

// Équipements que les voyageurs filtrent le plus souvent : leur absence est signalée.
const ESSENTIALS = [
  { label: 'Wifi', re: /wifi|wi-fi/i },
  { label: 'Cuisine équipée', re: /^cuisine$|tout le nécessaire pour cuisiner/i },
  { label: 'Lave-linge', re: /lave-linge/i },
  { label: 'Climatisation', re: /climatisation/i },
  { label: 'Chauffage', re: /chauffage/i },
  { label: 'Arrivée autonome', re: /arrivée autonome/i },
  { label: 'Espace de travail dédié', re: /espace de travail/i },
  { label: 'Parking', re: /parking|stationnement/i },
  { label: 'Fer à repasser', re: /fer à repasser/i },
  { label: 'Sèche-cheveux', re: /sèche-cheveux/i },
];

const decodeEntities = (s) =>
  String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');

const stripHtml = (s) =>
  decodeEntities(String(s || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ''))
    .replace(/[ \t]+/g, ' ')
    .trim();

function meta(html, prop) {
  const re = new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`, 'i');
  const m = html.match(re);
  return m ? decodeEntities(m[1]) : null;
}

/** Parcours en profondeur : renvoie le premier objet pour lequel test(obj) est vrai. */
function findDeep(root, test, max = 200000) {
  const stack = [root];
  let n = 0;
  while (stack.length && n++ < max) {
    const o = stack.pop();
    if (!o || typeof o !== 'object') continue;
    if (!Array.isArray(o) && test(o)) return o;
    for (const k in o) {
      const v = o[k];
      if (v && typeof v === 'object') stack.push(v);
    }
  }
  return null;
}

const num = (v) => {
  if (v == null) return null;
  const n = Number(String(v).replace(',', '.').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : null;
};

/** Identifiant numérique d'annonce Airbnb dans une URL (rooms/123, rooms/plus/123). */
export function airbnbIdFromUrl(u) {
  const m = String(u || '').match(/\/rooms\/(?:plus\/|luxury\/)?(\d{5,})/);
  return m ? m[1] : null;
}

export function detectPlatform(u) {
  const s = String(u || '').toLowerCase();
  if (/airbnb\.|abnb\.me/.test(s)) return 'airbnb';
  if (/booking\.com/.test(s)) return 'booking';
  return null;
}

/**
 * Lit le HTML d'une page d'annonce Airbnb et renvoie les données utiles à l'audit,
 * ou null si la page ne contient pas les données attendues.
 */
export function parseAirbnbHtml(html, id) {
  if (!html || html.length < 5000) return null;

  let state = null;
  const m = html.match(/<script[^>]+id="data-deferred-state-0"[^>]*>([\s\S]*?)<\/script>/);
  if (m) {
    try { state = JSON.parse(m[1]); } catch { state = null; }
  }

  const ogTitle = meta(html, 'og:title') || '';
  const ogDesc = meta(html, 'og:description') || '';
  const ogImage = meta(html, 'og:image') || '';

  const pdp = state ? findDeep(state, (o) => o.__typename === 'StayPDPSections' || (o.sections && o.metadata && o.metadata.__typename === 'StayPDPMetadata')) : null;
  const pres = state ? findDeep(state, (o) => o.amenities && o.localizedLocation !== undefined && o.overview !== undefined) : null;

  if (!pdp && !pres && !ogTitle) return null;

  const sections = Array.isArray(pdp?.sections) ? pdp.sections : [];
  const sec = (type) => sections.find((s) => s?.sectionComponentType === type)?.section || null;
  const logging = pdp?.metadata?.loggingContext?.eventDataLogging || {};
  const sharing = pdp?.metadata?.sharingConfig || pres?.sharingConfig || {};

  // Titre rédigé par l'hôte
  const title =
    pres?.title?.content?.localizedString ||
    pres?.title?.content?.source ||
    ogDesc ||
    (pdp?.metadata?.seoFeatures?.title || '').split(' - ')[0] ||
    '';

  // Photos
  const photoSection = sec('PHOTO_TOUR_SCROLLABLE') || sec('PHOTO_TOUR_DEFAULT');
  let photos = Array.isArray(photoSection?.mediaItems) ? photoSection.mediaItems : null;
  if (!photos && Array.isArray(pres?.mediaTour?.stops)) {
    photos = pres.mediaTour.stops.flatMap((s) => s.items || []);
  }
  const photoCount = photos ? photos.length : null;
  const photoUrls = (photos || [])
    .map((x) => x?.baseUrl || x?.image?.uri || x?.uri || '')
    .filter(Boolean)
    .slice(0, 8)
    .map((u) => `${u.split('?')[0]}?im_w=720`);
  const roomTourRooms = Array.isArray(photoSection?.roomTourLayoutInfos?.[0]?.roomTourItems)
    ? photoSection.roomTourLayoutInfos[0].roomTourItems.length
    : null;

  // Description : texte long de l'hôte en priorité (l'ordre des modales varie d'une page à l'autre ;
  // l'une d'elles est la mention légale « hôte particulier », à ignorer)
  let descriptionText = '';
  const descriptionSections = [];
  const longHtml = pres?.descriptions?.longDescriptionHtml;
  const rawLong = longHtml ? longHtml.localizedString || longHtml.localizedStringWithTranslationPreference || longHtml.source || '' : '';
  const descModal = sections
    .filter((s) => s?.sectionComponentType === 'PDP_DESCRIPTION_MODAL' && Array.isArray(s.section?.items))
    .map((s) => s.section)
    .find((s) => !/particulier|professionnel/i.test(s.title || '') && s.items.some((i) => i?.html?.htmlText));
  if (rawLong) {
    const cut = rawLong.split(/<b>\s*Détails de l'enregistrement/i)[0];
    descriptionText = stripHtml(cut);
    for (const t of cut.matchAll(/<b>([^<]+)<\/b>/g)) descriptionSections.push(stripHtml(t[1]));
  } else if (descModal) {
    for (const it of descModal.items) {
      if (/enregistrement/i.test(it?.title || '')) continue;
      if (it?.title) descriptionSections.push(it.title);
      descriptionText += stripHtml(it?.html?.htmlText) + '\n';
    }
  }
  descriptionText = descriptionText.trim();
  const hasRegistration = /Détails de l'enregistrement/i.test(rawLong) || !!descModal?.items?.some((i) => /enregistrement/i.test(i?.title || ''));

  // Avis
  const rating =
    num(pres?.quality?.listingRatingStats?.overallRatingStats?.ratingAverage) ??
    num(logging.guestSatisfactionOverall) ??
    num(sharing.starRating) ??
    num((ogTitle.match(/★\s*([\d,.]+)/) || [])[1]);
  const reviewCount =
    num(pres?.quality?.listingRatingStats?.overallRatingStats?.ratingCount) ??
    num(logging.visibleReviewCount) ??
    num(sharing.reviewCount) ??
    0;
  const categoryRatings = {};
  for (const c of pres?.quality?.categoryRatings || []) {
    if (c?.label) categoryRatings[c.label] = num(c.localizedRating);
  }
  const isGuestFavorite = !!pres?.quality?.isGuestFavorite;
  const isNewListing = !!pres?.quality?.isNewListing;

  // Hôte (aucune donnée nominative conservée)
  const host = pres?.hostInfo || {};
  const isSuperhost = logging.isSuperhost ?? host?.passportData?.isSuperhost ?? null;
  const responseRate = num((host.responseRateText || '').match(/(\d+)\s*%/)?.[1]);
  const responseTimeText = host.responseTimeText || null;

  // Équipements
  const groups = pres?.amenities?.seeAllAmenitiesGroups || [];
  const available = [];
  const unavailable = [];
  for (const g of groups) for (const a of g?.amenities || []) (a?.available === false ? unavailable : available).push(a?.title || '');
  const amenitiesCount = groups.length ? available.length : null;
  const missingEssentials = groups.length
    ? ESSENTIALS.filter((e) => !available.some((t) => e.re.test(t))).map((e) => e.label)
    : [];

  const city =
    pres?.localizedLocation ||
    (pres?.location?.subtitle || '').split(',')[0] ||
    (ogTitle.split(' · ')[1] || '') ||
    '';

  const listing = {
    id,
    url: `https://www.airbnb.fr/rooms/${id}`,
    title: String(title).trim(),
    titleLength: String(title).trim().length,
    city: String(city).trim(),
    propertyType: sharing.propertyType || pres?.overview?.title?.split(' - ')[0] || null,
    capacity: num(sharing.personCapacity ?? logging.personCapacity),
    overview: Array.isArray(pres?.overview?.items) ? pres.overview.items : [],
    coverPhotoUrl: (ogImage || sharing.imageUrl || '').replace(/&amp;/g, '&'),
    photoUrls,
    roomType: logging.roomType || null,
    lat: num(logging.listingLat),
    lng: num(logging.listingLng),
    photoCount,
    roomTourRooms,
    descriptionLength: descriptionText.length,
    descriptionSections,
    descriptionText: descriptionText.slice(0, 4000),
    hasRegistration,
    rating,
    reviewCount,
    categoryRatings,
    isGuestFavorite,
    isNewListing,
    isSuperhost: isSuperhost == null ? null : !!isSuperhost,
    responseRate,
    responseTimeText,
    amenitiesCount,
    missingEssentials,
    pricePerNight: null, // Airbnb n'affiche pas de prix sans dates : on ne l'invente pas
  };

  // Garde-fou : sans titre ni photos, l'extraction n'est pas exploitable
  if (!listing.title && listing.photoCount == null) return null;
  return listing;
}

async function fetchHtml(url) {
  const r = await fetch(url, { headers: BROWSER_HEADERS, redirect: 'follow', cf: { cacheTtl: 0 } });
  const text = await r.text();
  return { status: r.status, url: r.url || url, text };
}

/** Résout un lien court (abnb.me, airbnb.fr/slink/…, /h/…) vers l'identifiant de l'annonce. */
async function resolveAirbnbId(raw) {
  const direct = airbnbIdFromUrl(raw);
  if (direct) return direct;
  try {
    const r = await fetchHtml(raw);
    return airbnbIdFromUrl(r.url) || airbnbIdFromUrl(meta(r.text, 'og:url')) || airbnbIdFromUrl((r.text.match(/airbnb\.[a-z.]+\/rooms\/\d+/) || [])[0]);
  } catch {
    return null;
  }
}

const median = (arr) => {
  const a = arr.filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((x, y) => x - y);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};

const isoDate = (d) => d.toISOString().slice(0, 10);

/** Prix par nuit lisible dans un résultat de recherche (« 5 nuits x 86,36 € » ou total / nuits). */
function nightlyPrice(r, nights) {
  const sdp = r?.structuredDisplayPrice;
  const s = JSON.stringify(sdp || {});
  const per = s.match(/(\d+)\s*nuits?\s*x\s*([\d\s\u202f.,]+)\s*€/);
  if (per) return num(per[2].replace(/[\s\u202f]/g, '').replace(',', '.'));
  const tot = s.match(/"accessibilityLabel":"([\d\s\u202f.,]+)\s*€\s*(au total|pour)/);
  if (tot) {
    const t = num(tot[1].replace(/[\s\u202f]/g, '').replace(',', '.'));
    return t ? Math.round((t / nights) * 100) / 100 : null;
  }
  return null;
}

/**
 * 5 à 10 annonces comparables (même ville, capacité, type de logement) via la page de recherche
 * publique Airbnb, même technique que github.com/openbnb-org/mcp-server-airbnb (JSON embarqué).
 * Dates fixes : 2 nuits en semaine dans ~3 semaines, pour comparer des prix par nuit.
 */
async function fetchComparables(listing) {
  if (!listing.city) return null;
  const start = new Date(Date.now() + 21 * 864e5);
  while (start.getUTCDay() !== 2) start.setUTCDate(start.getUTCDate() + 1); // mardi
  const end = new Date(start.getTime() + 2 * 864e5);
  const nights = 2;
  const q = new URLSearchParams({
    adults: String(Math.max(1, Math.min(listing.capacity || 2, 8))),
    checkin: isoDate(start),
    checkout: isoDate(end),
  });
  if (listing.roomType === 'Entire home/apt') q.append('room_types[]', 'Entire home/apt');
  const url = `https://www.airbnb.fr/s/${encodeURIComponent(listing.city)}/homes?${q}`;
  const r = await fetchHtml(url);
  if (r.status !== 200) return null;
  const m = r.text.match(/<script[^>]+id="data-deferred-state-0"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  let state;
  try { state = JSON.parse(m[1]); } catch { return null; }
  const holder = findDeep(state, (o) => Array.isArray(o.searchResults));
  const results = holder?.searchResults || [];
  const items = [];
  for (const it of results) {
    let id = null;
    try { id = atob(it?.demandStayListing?.id || '').split(':')[1] || null; } catch { id = null; }
    if (!id || id === listing.id) continue;
    const rl = String(it.avgRatingLocalized || '').match(/([\d,]+)\s*\((\d+)\)/);
    items.push({
      id,
      title: it.nameLocalized?.localizedStringWithTranslationPreference || it.title || '',
      subtitle: it.subtitle || '',
      rating: rl ? num(rl[1]) : null,
      reviewCount: rl ? Number(rl[2]) : 0,
      nightlyPrice: nightlyPrice(it, nights),
    });
    if (items.length >= 10) break;
  }
  if (items.length < 3) return null;
  return {
    count: items.length,
    dates: `du ${isoDate(start).slice(8, 10)}/${isoDate(start).slice(5, 7)} au ${isoDate(end).slice(8, 10)}/${isoDate(end).slice(5, 7)}, ${nights} nuits`,
    medianNightlyPrice: median(items.map((i) => i.nightlyPrice)),
    medianRating: median(items.map((i) => i.rating)),
    medianReviews: median(items.map((i) => i.reviewCount)),
    medianTitleLength: median(items.map((i) => i.title.length)),
    items,
  };
}

export async function onRequestOptions() {
  return new Response('', { status: 204, headers: CORS });
}

export async function onRequestGet({ request }) {
  const params = new URL(request.url).searchParams;
  let raw = (params.get('url') || '').trim();
  if (!raw) return json({ ok: false, reason: 'invalid_url' }, 400);
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;

  let parsed;
  try { parsed = new URL(raw); } catch { return json({ ok: false, reason: 'invalid_url' }, 400); }

  const platform = detectPlatform(parsed.hostname);
  if (platform === 'booking') return json({ ok: false, reason: 'unsupported', platform: 'booking' });
  if (platform !== 'airbnb') return json({ ok: false, reason: 'invalid_url' }, 400);

  const id = await resolveAirbnbId(parsed.toString());
  if (!id) return json({ ok: false, reason: 'not_found', platform });

  // Cache edge 6 h par annonce (évite de re-solliciter Airbnb à chaque rechargement)
  const cacheKey = new Request(`https://cache.rentimmoacademy.fr/listing-audit/v2/${id}`);
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  if (cache && !params.has('nocache')) {
    const hit = await cache.match(cacheKey);
    if (hit) return new Response(hit.body, hit);
  }

  // Ordre d'essai : domaine français, puis .com (redirection géographique possible)
  const candidates = [`https://www.airbnb.fr/rooms/${id}`, `https://www.airbnb.com/rooms/${id}?locale=fr`];
  let lastStatus = 0;
  for (const u of candidates) {
    try {
      const r = await fetchHtml(u);
      lastStatus = r.status;
      if (r.status === 404 || r.status === 410) return json({ ok: false, reason: 'not_found', platform });
      if (r.status !== 200) continue;
      const listing = parseAirbnbHtml(r.text, id);
      if (listing) {
        listing.comparables = await fetchComparables(listing).catch(() => null);
        const res = json({ ok: true, source: 'airbnb', platform, listing }, 200, { 'Cache-Control': 'public, max-age=21600' });
        if (cache) await cache.put(cacheKey, res.clone()).catch(() => {});
        return res;
      }
    } catch {
      /* essai suivant */
    }
  }
  return json({ ok: false, reason: lastStatus && lastStatus !== 200 ? 'blocked' : 'parse_failed', status: lastStatus, platform });
}
