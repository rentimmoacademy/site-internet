/**
 * Audit d'annonce Super BNB Academy.
 * 1. Grille de règles fixes (toujours calculée, sert de repli) : 6 critères notés sur 10.
 * 2. Si l'analyse IA (functions/api/listing-ai.js, Gemini gratuit, texte + photos) répond,
 *    ses notes et recommandations personnalisées sont fusionnées avec la grille.
 * Entrées : données publiques de l'annonce (functions/api/listing-audit.js) ou auto-évaluation.
 * Aucun revenu inventé : les seuls montants affichés viennent des comparables ou des réponses du visiteur.
 */

export type Source = "airbnb" | "declared";
export type Impact = "HIGH" | "MEDIUM" | "LOW";
export type CriterionId = "photos" | "title" | "description" | "price" | "reviews" | "amenities";

export interface Comparable { id: string; title: string; rating: number | null; reviewCount: number; nightlyPrice: number | null }
export interface Comparables {
  count: number; dates: string;
  medianNightlyPrice: number | null; medianRating: number | null; medianReviews: number | null; medianTitleLength: number | null;
  items: Comparable[];
}

/** Données renvoyées par /api/listing-audit */
export interface ExtractedListing {
  id: string;
  url: string;
  title: string;
  titleLength: number;
  city: string;
  propertyType: string | null;
  capacity: number | null;
  overview: string[];
  coverPhotoUrl: string;
  photoUrls: string[];
  photoCount: number | null;
  descriptionLength: number;
  descriptionSections: string[];
  descriptionText: string;
  rating: number | null;
  reviewCount: number;
  categoryRatings: Record<string, number | null>;
  isGuestFavorite: boolean;
  isNewListing: boolean;
  isSuperhost: boolean | null;
  responseRate: number | null;
  responseTimeText: string | null;
  amenitiesCount: number | null;
  missingEssentials: string[];
  comparables: Comparables | null;
}

export interface AiCriterion { score: number; verdict: string; recommendations: string[] }
export interface AiResult { ok: true; model: string; summary: string; suggestedTitle?: string; criteria: Partial<Record<CriterionId, AiCriterion>> }

/** Questions de check-up (non lisibles publiquement) */
export interface CheckupAnswers {
  pricing: "fixed" | "manual" | "tool" | "";
  response: "hour" | "hours" | "day" | "";
  price: string; // prix moyen par nuit déclaré (facultatif)
}

/** Auto-évaluation (si l'annonce n'a pas pu être lue) */
export interface DeclaredAnswers {
  title: string;
  photos: "lt15" | "15-24" | "25-40" | "gt40" | "";
  rating: "none" | "lt46" | "46-479" | "gte48" | "";
  reviews: "0" | "1-9" | "10-49" | "gte50" | "";
  description: "short" | "paragraph" | "detailed" | "";
  superhost: "yes" | "no" | "";
}

export interface Fix { category: string; icon: string; impact: Impact; lost: number; action: string }
export interface Category { id: CriterionId; label: string; icon: string; score: number; max: number; note: string; verdict?: string }
export interface AuditResult {
  source: Source;
  ai: boolean;
  score: number;
  grade: string;
  gradeColor: string;
  summary: string | null;
  suggestedTitle: string | null;
  categories: Category[];
  fixes: Fix[];
  comparables: Comparables | null;
  declaredPrice: number | null;
}

const ATOUTS = /terrasse|balcon|jardin|piscine|jacuzzi|spa|sauna|hammam|parking|garage|clim|chemin[ée]e|rooftop|loft|duplex|design|lumineu|calme|cosy|cocon|neuf|r[ée]nov|standing|luxe|wifi|fibre|netflix|cin[ée]ma|famil|patio|vue|panoram|charme|atypique|cabanon|chalet|plage|mer\b|lac\b|baignoire|baln[ée]o|barbecue|plancha|t[ée]l[ée]travail|bureau/i;
const EMPLACEMENT = /centre|hyper|gare|m[ée]tro|tram|a[ée]roport|plage|mer\b|port\b|vieux|quartier|calanque|montagne|ski|pistes|lac\b|\d+\s?min|à pied|proche|pr[èe]s de|face|bord|c[œo]eur|\b\d{5}\b/i;
const CORE_ESSENTIALS = ["Wifi", "Cuisine équipée", "Lave-linge", "Arrivée autonome", "Espace de travail dédié"];

const META: Record<CriterionId, { label: string; icon: string }> = {
  photos: { label: "Photos", icon: "📸" },
  title: { label: "Titre & référencement", icon: "✍️" },
  description: { label: "Description", icon: "📝" },
  price: { label: "Prix face aux comparables", icon: "💶" },
  reviews: { label: "Avis & note", icon: "⭐" },
  amenities: { label: "Équipements", icon: "🧰" },
};
const ORDER: CriterionId[] = ["photos", "title", "description", "price", "reviews", "amenities"];

function grade(score: number) {
  if (score >= 80) return { grade: "Très bonne annonce", gradeColor: "#B6F23A" };
  if (score >= 60) return { grade: "Bonne base, à optimiser", gradeColor: "#F59E0B" };
  return { grade: "Annonce sous-exploitée", gradeColor: "#EF4444" };
}

const impactOf = (lost: number): Impact => (lost >= 5 ? "HIGH" : lost >= 3 ? "MEDIUM" : "LOW");
const fr = (n: number) => n.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
const r1 = (n: number) => Math.round(n * 10) / 10;

interface Norm {
  title: string | null;
  photoCount: number | null;
  descriptionLength: number | null;
  descriptionSections: number;
  descriptionLevel: DeclaredAnswers["description"] | null;
  rating: number | null;
  reviewCount: number | null;
  isSuperhost: boolean | null;
  responseFast: boolean | null;
  missingEssentials: string[] | null;
  amenitiesCount: number | null;
  weakestCategory: string | null;
}

function normalize(source: Source, ex: ExtractedListing | null, d: DeclaredAnswers | null, c: CheckupAnswers): Norm {
  const respDeclared = c.response === "hour" ? true : c.response ? false : null;
  if (source === "airbnb" && ex) {
    const cats = Object.entries(ex.categoryRatings || {}).filter(([, v]) => typeof v === "number") as [string, number][];
    cats.sort((a, b) => a[1] - b[1]);
    const fast = ex.responseTimeText ? /heure/i.test(ex.responseTimeText) && !/quelques/i.test(ex.responseTimeText) : respDeclared;
    return {
      title: ex.title || null,
      photoCount: ex.photoCount,
      descriptionLength: ex.descriptionLength,
      descriptionSections: ex.descriptionSections?.length || 0,
      descriptionLevel: null,
      rating: ex.reviewCount > 0 ? ex.rating : null,
      reviewCount: ex.reviewCount,
      isSuperhost: ex.isSuperhost,
      responseFast: fast,
      missingEssentials: ex.amenitiesCount != null ? ex.missingEssentials : null,
      amenitiesCount: ex.amenitiesCount,
      weakestCategory: cats.length && cats[0][1] < 4.8 ? `${cats[0][0]} : ${fr(cats[0][1])}` : null,
    };
  }
  const a = d || ({} as DeclaredAnswers);
  const photos = { lt15: 10, "15-24": 20, "25-40": 30, gt40: 45 }[a.photos as string] ?? null;
  const rating = { none: null, lt46: 4.4, "46-479": 4.7, gte48: 4.9 }[a.rating as string] ?? null;
  const reviews = { "0": 0, "1-9": 5, "10-49": 25, gte50: 60 }[a.reviews as string] ?? null;
  return {
    title: a.title?.trim() || null,
    photoCount: photos,
    descriptionLength: null,
    descriptionSections: 0,
    descriptionLevel: a.description || null,
    rating,
    reviewCount: a.rating === "none" ? 0 : reviews,
    isSuperhost: a.superhost === "yes" ? true : a.superhost === "no" ? false : null,
    responseFast: respDeclared,
    missingEssentials: null,
    amenitiesCount: null,
    weakestCategory: null,
  };
}

type RuleOut = { score: number; note: string; fixes: Omit<Fix, "impact">[] };

export function computeAudit(source: Source, ex: ExtractedListing | null, declared: DeclaredAnswers | null, checkup: CheckupAnswers, ai?: AiResult | null): AuditResult {
  const n = normalize(source, ex, declared, checkup);
  const comp = ex?.comparables || null;
  const declaredPrice = Number(String(checkup.price).replace(",", ".")) > 0 ? Math.round(Number(String(checkup.price).replace(",", "."))) : null;
  const declaredPhotosLabel = { lt15: "moins de 15", "15-24": "15 à 24", "25-40": "25 à 40", gt40: "plus de 40" }[declared?.photos as string];
  const rules: Record<CriterionId, RuleOut> = {} as Record<CriterionId, RuleOut>;

  /* Photos */
  {
    const p = n.photoCount;
    const s = p == null ? 5 : p >= 25 ? 10 : p >= 18 ? 7 : p >= 12 ? 4.5 : 2;
    const f: RuleOut["fixes"] = [];
    if (p == null || p < 25) {
      const missing = p != null && source === "airbnb" ? ` (tu en as ${p}, il en manque ${25 - p})` : "";
      f.push({ category: "Photos", icon: "📸", lost: 10 - s, action: `Passe à 25 photos minimum${missing} : chaque pièce sous 2 angles, les détails (literie, coin café, salle de bain), l'extérieur et le quartier. En 1re photo, ta pièce la plus forte, en lumière du jour.` });
    }
    rules.photos = { score: s, note: p == null ? "Nombre de photos non renseigné" : source === "airbnb" ? `${p} photos` : `${declaredPhotosLabel} photos`, fixes: f };
  }

  /* Titre */
  {
    const f: RuleOut["fixes"] = [];
    if (!n.title) {
      rules.title = { score: 5, note: "Titre non renseigné", fixes: [{ category: "Titre", icon: "✍️", lost: 4, action: "Vérifie ton titre : Airbnb t'autorise 50 caractères. Structure gagnante : type de logement + atout n°1 + repère d'emplacement (ex. « Studio climatisé · terrasse · 3 min de la gare »)." }] };
    } else {
      const len = n.title.length;
      const lenPts = len >= 35 ? 5 : len >= 25 ? 3 : 1;
      const atout = ATOUTS.test(n.title);
      const lieu = EMPLACEMENT.test(n.title);
      const s = lenPts + (atout ? 3 : 0) + (lieu ? 2 : 0);
      if (len < 35) f.push({ category: "Titre", icon: "✍️", lost: 10 - s, action: `Ton titre fait ${len} caractères sur les 50 autorisés par Airbnb${comp?.medianTitleLength ? ` (les annonces comparables en utilisent ${Math.round(comp.medianTitleLength)} en médiane)` : ""}. Type de logement + atout n°1 + repère d'emplacement (ex. « Studio climatisé · terrasse · 3 min de la gare »).` });
      else if (!atout) f.push({ category: "Titre", icon: "✍️", lost: 3, action: "Ton titre ne met en avant aucun atout concret. Remplace les mots vagues par ce qui fait cliquer : terrasse, parking, vue, clim, arrivée autonome, wifi fibre…" });
      else if (!lieu) f.push({ category: "Titre", icon: "✍️", lost: 2, action: "Ajoute un repère d'emplacement (quartier, « 5 min de la gare », « bord de mer ») : le voyageur doit savoir où il dort sans ouvrir l'annonce." });
      rules.title = { score: s, note: `${len} caractères${atout ? " · atout mis en avant" : " · aucun atout"}${lieu ? " · repère d'emplacement" : ""}`, fixes: f };
    }
  }

  /* Description */
  {
    const f: RuleOut["fixes"] = [];
    let s: number; let note: string;
    if (source === "airbnb" && n.descriptionLength != null) {
      const L = n.descriptionLength;
      s = (L >= 1000 ? 6 : L >= 500 ? 4 : L >= 250 ? 2 : 1) + (n.descriptionSections >= 2 ? 4 : n.descriptionSections === 1 ? 2 : 0);
      note = `${L.toLocaleString("fr-FR")} caractères · ${n.descriptionSections} rubrique${n.descriptionSections > 1 ? "s" : ""}`;
      if (s < 8) f.push({ category: "Description", icon: "📝", lost: 10 - s, action: `Ta description fait ${L.toLocaleString("fr-FR")} caractères${n.descriptionSections < 2 ? " et n'est pas découpée en rubriques" : ""}. Remplis « Le logement », « Accès des voyageurs » et « Autres remarques », et réponds d'avance aux questions qu'on te pose en message (parking, check-in, literie).` });
    } else {
      const lvl = n.descriptionLevel;
      s = lvl === "detailed" ? 9 : lvl === "paragraph" ? 5 : lvl === "short" ? 2 : 5;
      note = lvl === "detailed" ? "Détaillée, par rubriques" : lvl === "paragraph" ? "Un paragraphe" : lvl === "short" ? "Quelques lignes" : "Non renseignée";
      if (s < 8) f.push({ category: "Description", icon: "📝", lost: 10 - s, action: "Étoffe ta description : remplis « Le logement », « Accès des voyageurs » et « Autres remarques », et réponds d'avance aux questions qu'on te pose en message (parking, check-in, literie)." });
    }
    rules.description = { score: s, note, fixes: f };
  }

  /* Prix : méthode de tarification + positionnement face aux comparables */
  {
    const f: RuleOut["fixes"] = [];
    let s = checkup.pricing === "tool" ? 6 : checkup.pricing === "manual" ? 3.5 : checkup.pricing === "fixed" ? 1 : 3;
    const med = comp?.medianNightlyPrice ?? null;
    let note = { tool: "Tarification dynamique (outil)", manual: "Prix ajustés à la main", fixed: "Prix fixe" }[checkup.pricing as string] || "Méthode non renseignée";
    if (med && declaredPrice) {
      const ratio = declaredPrice / med;
      const quality = n.rating != null && n.rating >= 4.85;
      note += ` · ${declaredPrice} €/nuit vs médiane ${Math.round(med)} € (${comp!.count} comparables)`;
      if (ratio < 0.8 && quality) {
        s += 1;
        f.push({ category: "Prix", icon: "💶", lost: 4, action: `Tu es à ${declaredPrice} €/nuit quand la médiane des ${comp!.count} annonces comparables de ${ex?.city || "ta ville"} est à ${Math.round(med)} €, alors que ta note est au-dessus du lot. Teste une hausse progressive (par paliers de 5 %) sur les dates à forte demande.` });
      } else if (ratio > 1.25 && !quality) {
        s += 1.5;
        f.push({ category: "Prix", icon: "💶", lost: 3, action: `À ${declaredPrice} €/nuit, tu es au-dessus de la médiane des comparables (${Math.round(med)} €) sans avoir la note qui le justifie. Soit tu baisses sur les dates creuses, soit tu montes en gamme (photos, équipements) pour défendre ce prix.` });
      } else s += 4;
    } else if (med) {
      s += 2;
      note += ` · médiane des comparables : ${Math.round(med)} €/nuit`;
    } else s += 2;
    s = Math.min(10, s);
    if (checkup.pricing === "fixed") f.push({ category: "Prix", icon: "💶", lost: 6, action: "Un prix fixe toute l'année, c'est trop bas les week-ends et événements, trop cher les jours creux. Passe à une tarification dynamique : outil (PriceLabs, Beyond…) ou au minimum des règles par saison, jour de la semaine et délai de réservation." });
    else if (checkup.pricing === "manual") f.push({ category: "Prix", icon: "💶", lost: 3, action: "Tu ajustes tes prix à la main : un outil de tarification dynamique réagit chaque jour à la demande locale (événements, remplissage du quartier) sans que tu y passes tes soirées." });
    rules.price = { score: s, note, fixes: f };
  }

  /* Avis & note (+ statut, réactivité) */
  {
    const f: RuleOut["fixes"] = [];
    const r = n.rating; const c = n.reviewCount;
    const rPts = r == null ? 3 : r >= 4.85 ? 5 : r >= 4.7 ? 3.5 : r >= 4.5 ? 2 : 1;
    const cPts = c == null ? 1.5 : c >= 50 ? 2.5 : c >= 10 ? 2 : c >= 1 ? 1 : 0.5;
    const shPts = n.isSuperhost ? 1.5 : n.isSuperhost === false ? 0 : 0.75;
    const rtPts = n.responseFast ? 1 : n.responseFast === false ? 0.3 : 0.5;
    const s = Math.min(10, rPts + cPts + shPts + rtPts);
    const note = c === 0 ? "Pas encore d'avis" : `${r != null ? `${fr(r)}/5` : "note ?"} · ${source === "airbnb" ? `${c} avis` : `${{ "1-9": "1 à 9", "10-49": "10 à 49", gte50: "50+" }[declared?.reviews as string] || "?"} avis`}${n.isSuperhost ? " · Superhôte" : ""}`;
    if (r != null && r < 4.8) f.push({ category: "Avis", icon: "⭐", lost: 5 - rPts + 1, action: `Ta note (${fr(r)}) est sous 4,8, le seuil du statut Superhôte.${n.weakestCategory ? ` Ta catégorie la plus faible : ${n.weakestCategory}.` : ""} Relis tes 10 derniers avis, repère le reproche qui revient et corrige-le avant tout le reste.` });
    if (c != null && c < 10) f.push({ category: "Avis", icon: "⭐", lost: c === 0 ? 5 : 3, action: c === 0 ? "Aucun avis pour l'instant : un prix d'appel sur les premières réservations et un message de remerciement à chaque départ pour obtenir tes 3 premiers avis vite." : "Moins de 10 avis : envoie un message de remerciement après chaque départ et laisse toi-même un avis au voyageur, ça déclenche souvent le sien." });
    if (n.isSuperhost === false) f.push({ category: "Statut", icon: "🏅", lost: 2.5, action: "Pas encore Superhôte. Critères Airbnb, vérifiés chaque trimestre : note globale ≥ 4,8, taux de réponse ≥ 90 %, annulations < 1 %, et au moins 10 séjours (ou 3 séjours totalisant 100 nuits) sur 12 mois." });
    if (n.responseFast === false) f.push({ category: "Réactivité", icon: "⚡", lost: 1.5, action: "Vise une réponse en moins d'une heure : messages programmés et réponses enregistrées dans Airbnb (ou ton channel manager) pour les questions qui reviennent." });
    rules.reviews = { score: s, note, fixes: f };
  }

  /* Équipements */
  {
    const f: RuleOut["fixes"] = [];
    if (n.amenitiesCount != null && n.missingEssentials) {
      const countPts = n.amenitiesCount >= 40 ? 6 : n.amenitiesCount >= 30 ? 5 : n.amenitiesCount >= 20 ? 3 : 1;
      const core = n.missingEssentials.filter((m) => CORE_ESSENTIALS.includes(m));
      const essPts = Math.max(0, 4 - core.length);
      if (core.length) f.push({ category: "Équipements", icon: "🧰", lost: 4 - essPts + 1, action: `Absents de ton annonce : ${core.join(", ")}. Si tu les as, coche-les dans ton espace hôte ; sinon, ce sont les premiers à ajouter : les voyageurs les filtrent dans la recherche.` });
      else if (n.amenitiesCount < 30) f.push({ category: "Équipements", icon: "🧰", lost: 6 - countPts, action: `Seulement ${n.amenitiesCount} équipements cochés : repasse toute la liste dans ton espace hôte, chaque équipement oublié est un filtre de recherche où tu n'apparais pas.` });
      rules.amenities = { score: countPts + essPts, note: `${n.amenitiesCount} équipements${core.length ? ` · manque : ${core.join(", ")}` : ""}`, fixes: f };
    } else {
      rules.amenities = { score: 6, note: "Non vérifié (annonce non lue)", fixes: [] };
    }
  }

  /* Fusion avec l'IA : photos / titre / description = moyenne règles + IA (l'IA voit les photos et le texte) ;
     prix / avis / équipements = règles (faits chiffrés), l'IA n'apporte que ses recommandations. */
  const useAi = !!ai?.ok && source === "airbnb";
  const categories: Category[] = ORDER.map((id) => {
    const rule = rules[id];
    const a = useAi ? ai!.criteria[id] : undefined;
    let score = rule.score;
    if (a && (id === "photos" || id === "title" || id === "description")) score = (rule.score + a.score) / 2;
    return { id, ...META[id], score: r1(score), max: 10, note: rule.note, verdict: a?.verdict };
  });

  const score = Math.round((categories.reduce((t, c) => t + c.score, 0) / 60) * 100);

  let fixes: Fix[];
  if (useAi) {
    // Recommandations personnalisées de l'IA, en commençant par les critères les plus faibles
    const weakest = [...categories].sort((a, b) => a.score - b.score);
    fixes = [];
    // 1re passe : une recommandation par critère faible ; 2e passe : les suivantes
    for (let pass = 0; pass < 2 && fixes.length < 5; pass++) {
      for (const c of weakest) {
        if (pass === 0 && c.score >= 9) continue;
        if (pass === 1 && c.score >= 6) continue;
        const action = (ai!.criteria[c.id]?.recommendations || [])[pass];
        if (action) fixes.push({ category: c.label, icon: c.icon, impact: impactOf(10 - c.score), lost: 10 - c.score, action });
        if (fixes.length >= 5) break;
      }
    }
    // Faits chiffrés indispensables (photos manquantes, prix fixe) si l'IA ne les a pas couverts
    for (const id of ["photos", "price"] as CriterionId[]) {
      const ruleFix = rules[id].fixes[0];
      if (ruleFix && ruleFix.lost >= 5 && !fixes.some((f) => f.category === META[id].label && /\d/.test(f.action))) {
        fixes.unshift({ ...ruleFix, category: META[id].label, impact: impactOf(ruleFix.lost) });
      }
    }
    fixes = fixes.slice(0, 5);
  } else {
    fixes = ORDER.flatMap((id) => rules[id].fixes).sort((a, b) => b.lost - a.lost).slice(0, 5).map((f) => ({ ...f, impact: impactOf(f.lost) }));
  }
  if (fixes.length < 3) {
    const extras: Fix[] = [
      { category: "Visibilité", icon: "📅", impact: "LOW", lost: 0, action: "Ouvre ton calendrier sur au moins 6 mois et accepte les séjours courts en semaine : plus de dates disponibles, plus d'apparitions dans les recherches." },
      { category: "Réservation directe", icon: "🔁", impact: "LOW", lost: 0, action: "Ton annonce tourne bien : construis ta base de voyageurs fidèles (livret d'accueil, contact pour le prochain séjour) pour dépendre moins d'Airbnb." },
      { category: "Couverture", icon: "🖼️", impact: "LOW", lost: 0, action: "Change ta photo de couverture selon la saison (terrasse l'été, cocooning l'hiver) et vérifie qu'elle reste lisible en vignette sur mobile." },
    ];
    fixes = [...fixes, ...extras.filter((e) => !fixes.some((t) => t.category === e.category))].slice(0, 3);
  }

  return {
    source, ai: useAi, score, ...grade(score),
    summary: useAi ? ai!.summary || null : null,
    suggestedTitle: useAi ? ai!.suggestedTitle || null : null,
    categories, fixes, comparables: comp, declaredPrice,
  };
}

/* ══════════════ Diagnostic « docteur » (questions à branchements) ══════════════ */

export type Profile = "start" | "one" | "multi";
export type PainId = "temps" | "rentabilite" | "occupation" | "scale" | "delegation" | "process" | "avis";

export interface DocQuestion {
  id: string;
  title: string;
  hint?: string;
  options: string[];
  multi?: boolean;
  scale?: boolean; // échelle 1-10
}

export type DocAnswers = Record<string, string | string[]>;

const PROFILE_OPTIONS: { label: string; profile: Profile }[] = [
  { label: "Je me lance, pas encore de logement", profile: "start" },
  { label: "1 logement en location courte durée", profile: "one" },
  { label: "2 à 5 logements (en propre, sous-location ou conciergerie)", profile: "multi" },
  { label: "6 à 15 logements", profile: "multi" },
  { label: "Plus de 15 logements", profile: "multi" },
];

export function profileOf(a: DocAnswers): Profile | null {
  return PROFILE_OPTIONS.find((o) => o.label === a.profil)?.profile ?? null;
}

const PAINS: Record<Profile, { label: string; pain: PainId }[]> = {
  start: [
    { label: "Trouver mon premier logement", pain: "scale" },
    { label: "La peur que ce ne soit pas rentable", pain: "rentabilite" },
    { label: "Le manque de temps à côté de mon travail", pain: "temps" },
    { label: "Ne pas savoir m'organiser (ménage, accès, messages)", pain: "process" },
  ],
  one: [
    { label: "Je manque de temps, je gère tout seul", pain: "temps" },
    { label: "Ce n'est pas assez rentable, je ne m'y retrouve pas", pain: "rentabilite" },
    { label: "Pas assez de réservations ou des prix trop bas", pain: "occupation" },
    { label: "Je n'arrive pas à passer au logement suivant", pain: "scale" },
    { label: "Je n'arrive pas à déléguer le ménage et les check-in", pain: "delegation" },
    { label: "Rien n'est automatisé (messages, prix, accès)", pain: "process" },
    { label: "Mes avis baissent, des problèmes avec les voyageurs", pain: "avis" },
  ],
  multi: [
    { label: "Je suis débordé, tout repose sur moi", pain: "temps" },
    { label: "Ma marge est trop faible, pas assez de cash-flow", pain: "rentabilite" },
    { label: "Taux d'occupation ou prix trop bas", pain: "occupation" },
    { label: "Je n'arrive pas à grossir (nouveaux logements, propriétaires)", pain: "scale" },
    { label: "Trouver ou gérer mon équipe (ménage, check-in)", pain: "delegation" },
    { label: "Pas de process ni d'automatisation", pain: "process" },
    { label: "Mes avis baissent, des problèmes avec les voyageurs", pain: "avis" },
  ],
};

export function painsOf(a: DocAnswers): PainId[] {
  const p = profileOf(a);
  if (!p) return [];
  const sel = (a.douleurs as string[]) || [];
  return sel.map((l) => PAINS[p].find((x) => x.label === l)?.pain).filter(Boolean) as PainId[];
}

const HOURS = ["Moins de 5 h", "5 à 10 h", "10 à 20 h", "20 à 35 h", "Plus de 35 h"];
const HOURS_MID: Record<string, number> = { "Moins de 5 h": 3, "5 à 10 h": 7.5, "10 à 20 h": 15, "20 à 35 h": 27, "Plus de 35 h": 40 };
const HOURS_TARGET = ["Moins de 2 h", "2 à 5 h", "5 à 10 h", "10 h ou plus"];
const HOURS_TARGET_MID: Record<string, number> = { "Moins de 2 h": 1.5, "2 à 5 h": 3.5, "5 à 10 h": 7.5, "10 h ou plus": 12 };

const REVENU: Record<Exclude<Profile, "start">, { options: string[]; mid: number[] }> = {
  one: { options: ["Je perds de l'argent", "Moins de 300 €", "300 à 700 €", "700 à 1 200 €", "1 200 à 2 000 €", "Plus de 2 000 €"], mid: [0, 150, 500, 950, 1600, 2500] },
  multi: { options: ["Moins de 1 000 €", "1 000 à 3 000 €", "3 000 à 6 000 €", "6 000 à 12 000 €", "12 000 à 25 000 €", "Plus de 25 000 €"], mid: [500, 2000, 4500, 9000, 18500, 30000] },
};
const OBJECTIF: Record<Profile, { options: string[]; val: number[] }> = {
  start: { options: ["500 €", "1 000 €", "2 000 €", "3 000 €", "5 000 € et plus"], val: [500, 1000, 2000, 3000, 5000] },
  one: { options: ["1 000 €", "2 000 €", "3 000 €", "5 000 €", "8 000 € et plus"], val: [1000, 2000, 3000, 5000, 8000] },
  multi: { options: ["3 000 €", "6 000 €", "10 000 €", "20 000 €", "35 000 € et plus"], val: [3000, 6000, 10000, 20000, 35000] },
};

/** 2 questions qui font chiffrer la douleur principale (vocabulaire adapté au profil). */
function painQuestions(pain: PainId, profile: Profile, a: DocAnswers, knownRating: number | null): DocQuestion[] {
  const logement = profile === "multi" ? "tes logements" : "ton logement";
  switch (pain) {
    case "temps":
      return profile === "start"
        ? [
            { id: "p_heures_dispo", title: "Combien d'heures par semaine peux-tu consacrer à ce projet ?", options: ["Moins de 3 h", "3 à 6 h", "6 à 10 h", "Plus de 10 h"] },
            { id: "p_emploi", title: "Tu as un emploi à côté ?", options: ["Oui, à temps plein", "Oui, à temps partiel", "Non, je suis disponible"] },
          ]
        : [
            { id: "p_heures", title: `Combien d'heures par semaine passes-tu sur ${logement} ?`, hint: "Messages, ménage, check-in, imprévus, prix…", options: HOURS },
            { id: "p_heures_cible", title: "Et combien d'heures voudrais-tu y passer, au maximum ?", options: HOURS_TARGET },
          ];
    case "rentabilite":
      return profile === "start"
        ? [
            { id: "p_budget", title: "Quel budget de départ peux-tu mobiliser ?", hint: "Caution, ameublement, premiers frais.", options: ["Moins de 2 000 €", "2 000 à 5 000 €", "5 000 à 10 000 €", "Plus de 10 000 €"] },
            { id: "p_calcul", title: "Sais-tu calculer la rentabilité d'un logement avant de te lancer ?", options: ["Oui, précisément", "À peu près", "Non, pas vraiment"] },
          ]
        : [
            { id: "p_marge", title: "Après toutes les charges, combien il te reste par logement et par mois ?", options: ["Je perds de l'argent", "Moins de 200 €", "200 à 500 €", "500 à 1 000 €", "Plus de 1 000 €"] },
            { id: "p_suivi", title: "Tu connais ta marge exacte, logement par logement ?", options: ["Oui, au centime", "À peu près", "Non, je regarde surtout le chiffre d'affaires"] },
          ];
    case "occupation":
      return [
        { id: "p_occupation", title: "Ton taux d'occupation sur les 3 derniers mois ?", hint: "Nuits réservées / nuits ouvertes à la réservation.", options: ["Moins de 40 %", "40 à 60 %", "60 à 75 %", "Plus de 75 %", "Je ne sais pas"] },
        { id: "p_prix_nuit", title: "Ton prix moyen par nuit ?", options: ["Moins de 60 €", "60 à 90 €", "90 à 130 €", "130 à 200 €", "Plus de 200 €"] },
      ];
    case "scale":
      return profile === "start"
        ? [
            { id: "p_cible_logements", title: "Combien de logements veux-tu lancer d'ici 6 mois ?", options: ["1", "2 ou 3", "4 ou 5", "Plus de 5"] },
            { id: "p_frein_scale", title: "Qu'est-ce qui bloque ton premier logement ?", options: ["Trouver le bon bien", "Convaincre un propriétaire", "Le budget de départ", "Le cadre légal", "Je ne sais pas comment m'y prendre"] },
          ]
        : [
            profile === "one"
              ? { id: "p_cible_logements", title: "Combien de logements veux-tu gérer dans 6 mois ?", options: ["2 ou 3", "4 à 5", "6 à 10", "Plus de 10"] }
              : { id: "p_cible_logements", title: "Combien de logements en plus veux-tu gérer dans 6 mois ?", options: ["1 ou 2 de plus", "3 à 5 de plus", "6 à 10 de plus", "Plus de 10 de plus"] },
            { id: "p_frein_scale", title: "Qu'est-ce qui bloque le prochain logement ?", options: ["Trouver des biens ou des propriétaires", "Le financement ou les cautions", "Le temps pour en gérer plus", "Convaincre les propriétaires", "Le cadre légal"] },
          ];
    case "delegation":
      return [
        { id: "p_qui", title: "Qui fait le ménage et les check-in aujourd'hui ?", options: ["Moi", "Un proche", "Un ou des freelances", "Une société de ménage ou une conciergerie"] },
        { id: "p_heures", title: "Combien d'heures par semaine y passes-tu toi-même ?", hint: "Ménage, check-in, remplacements de dernière minute, contrôle.", options: HOURS },
      ];
    case "process":
      return [
        { id: "p_manuel", title: profile === "start" ? "Qu'est-ce qui te paraît le plus flou dans l'organisation ?" : "Qu'est-ce qui se fait encore à la main ?", hint: "Plusieurs réponses possibles.", options: ["Messages voyageurs", "Prix", "Planning ménage", "Accès / remise des clés", "Demandes d'avis"], multi: true },
        profile === "start"
          ? { id: "p_mode", title: "Tu comptes tout gérer toi-même ou déléguer ?", options: ["Tout gérer moi-même", "Déléguer le ménage", "Tout déléguer", "Je ne sais pas encore"] }
          : { id: "p_heures", title: "Combien d'heures par semaine ça te prend ?", options: HOURS },
      ];
    case "avis": {
      const qs: DocQuestion[] = [];
      if (knownRating == null) qs.push({ id: "p_note", title: "Ta note moyenne aujourd'hui ?", options: ["Moins de 4,5", "4,5 à 4,69", "4,7 à 4,79", "4,8 et plus"] });
      qs.push({ id: "p_reproche", title: "Le reproche qui revient le plus dans tes avis ?", options: ["La propreté", "Un check-in compliqué", "Pas conforme aux photos", "Bruit ou équipements", "La communication"] });
      if (qs.length < 2) qs.push({ id: "p_reponse_avis", title: "Tu réponds à tes avis négatifs ?", options: ["Toujours", "Parfois", "Jamais"] });
      return qs;
    }
  }
  void a;
}

/** Liste des questions applicables, recalculée à chaque réponse (branchements). */
export function buildDocQuestions(a: DocAnswers, knownRating: number | null): DocQuestion[] {
  const qs: DocQuestion[] = [
    { id: "profil", title: "Où en es-tu aujourd'hui ?", options: PROFILE_OPTIONS.map((o) => o.label) },
  ];
  const profile = profileOf(a);
  if (!profile) return qs;

  qs.push({
    id: "douleurs",
    title: profile === "start" ? "Qu'est-ce qui te freine le plus pour te lancer ?" : "Aujourd'hui, qu'est-ce qui te pèse le plus ?",
    hint: "Coche dans l'ordre d'importance (3 maximum) : la 1re sera ta priorité.",
    options: PAINS[profile].map((p) => p.label),
    multi: true,
  });
  const main = painsOf(a)[0];
  if (!main) return qs;

  if (profile !== "start") {
    qs.push({ id: "revenu", title: profile === "one" ? "Combien ce logement te rapporte net par mois, en moyenne ?" : "Combien ton activité te rapporte net par mois, en moyenne ?", hint: "Ce qui te reste après loyer, ménage, commissions et charges.", options: REVENU[profile].options });
  }
  qs.push(...painQuestions(main, profile, a, knownRating));
  qs.push({ id: "objectif", title: profile === "start" ? "Dans 6 mois, combien veux-tu que ce projet te rapporte net par mois ?" : "Dans 6 mois, combien veux-tu gagner net par mois ?", options: OBJECTIF[profile].options });
  qs.push({ id: "essaye", title: "Qu'as-tu déjà essayé ces 6 derniers mois ?", hint: "Plusieurs réponses possibles.", options: ["Rien de concret", "Vidéos et contenus gratuits", "Un outil (prix, channel manager, serrure…)", profile === "start" ? "Contacter des propriétaires ou des agences" : "Déléguer à un prestataire ou une conciergerie", "Une formation ou un coaching"], multi: true });
  qs.push({ id: "bloque", title: "Qu'est-ce qui t'empêche d'y arriver seul ?", options: ["Je ne sais pas exactement quoi faire, ni dans quel ordre", "Je sais quoi faire mais je n'ai pas le temps", "J'ai essayé, ça n'a pas donné de résultat", "La peur de me tromper et de perdre de l'argent", "Il me manque un regard extérieur, quelqu'un qui me suit"] });
  qs.push({ id: "motivation", title: "De 1 à 10, à quel point c'est important pour toi de régler ça dans les 6 prochains mois ?", options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], scale: true });
  qs.push({ id: "pret", title: "Si l'audit valide un plan clair pour toi, es-tu prêt à l'appliquer ?", options: ["Oui, dès maintenant", "Oui, d'ici 1 à 3 mois", "Je ne sais pas encore"] });
  return qs;
}

/* ── Diagnostic chiffré ── */

export interface Diagnostic {
  profile: Profile;
  pain: PainId;
  otherPains: string[];
  current: number;
  target: number | null;
  gapMonthly: number | null;
  inaction6m: number | null; // (objectif − revenu actuel) × 6
  painMetric: { value: string; label: string } | null;
  painTitle: string;
  painLine: string;
  callPoints: string[];
  blockers: string[];
  motivation: number | null;
  hook: string;
}

const PAIN_TITLES: Record<PainId, string> = {
  temps: "Le temps", rentabilite: "La rentabilité", occupation: "Le remplissage et les prix",
  scale: "Passer à l'échelle", delegation: "La délégation", process: "Les process", avis: "Les avis",
};

const CALL_POINTS: Record<PainId, string[]> = {
  temps: ["Tout ce que tu fais encore toi-même, tâche par tâche, et ce qui peut sortir de ton agenda en premier", "Les automatisations à brancher (messages, accès, planning ménage)", "Ton organisation cible pour tenir ton objectif d'heures"],
  rentabilite: ["Ta marge réelle logement par logement (ce qui coûte, ce qui rapporte)", "Les leviers prix et charges à actionner en premier", "Le seuil à viser par logement avant d'en ajouter un"],
  occupation: ["Ton annonce face aux comparables de ta ville (photos, titre, prix)", "Ta stratégie de prix : saisons, jours creux, délai de réservation", "Les réglages de calendrier et de visibilité à corriger tout de suite"],
  scale: ["Ce qui doit être en place avant le logement suivant (process, équipe, marge)", "Où et comment trouver les prochains biens ou propriétaires", "Ton plan logement par logement sur 6 mois"],
  delegation: ["Qui recruter en premier et comment (ménage, check-in, remplaçants)", "Les checklists et le contrôle qualité pour ne plus repasser derrière", "Comment payer l'équipe sans tuer ta marge"],
  process: ["Les outils à brancher et dans quel ordre (messages, prix, serrures, ménage)", "Les modèles de messages et checklists à copier", "Ce qui reste à toi, ce qui part en automatique"],
  avis: ["Le reproche n°1 de tes avis et sa cause réelle", "Le parcours voyageur à corriger (arrivée, propreté, communication)", "Comment répondre aux avis et remonter ta note"],
};

const BLOCKER_REFORMULATION: Record<string, string> = {
  "Je ne sais pas exactement quoi faire, ni dans quel ordre": "Il te manque un plan clair, étape par étape.",
  "Je sais quoi faire mais je n'ai pas le temps": "Tu sais quoi faire, mais ton temps est déjà pris par l'opérationnel.",
  "J'ai essayé, ça n'a pas donné de résultat": "Tu as déjà essayé sans résultat : le problème est dans la méthode, pas dans l'effort.",
  "La peur de me tromper et de perdre de l'argent": "Tu as peur de te tromper et de perdre de l'argent.",
  "Il me manque un regard extérieur, quelqu'un qui me suit": "Tu avances seul, sans regard extérieur pour te recadrer.",
};
const TRIED_REFORMULATION: Record<string, string> = {
  "Vidéos et contenus gratuits": "Les contenus gratuits t'ont donné des idées, pas un plan adapté à ta situation.",
  "Un outil (prix, channel manager, serrure…)": "Un outil seul n'a pas suffi : il faut la méthode qui va autour.",
  "Déléguer à un prestataire ou une conciergerie": "Déléguer ne t'a pas libéré comme prévu.",
  "Contacter des propriétaires ou des agences": "Tes premières prises de contact n'ont pas abouti.",
  "Une formation ou un coaching": "Une première formation ne t'a pas suffi à passer à l'action.",
};

const eur = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;

export function computeDiagnostic(a: DocAnswers, auditScore: number | null): Diagnostic | null {
  const profile = profileOf(a);
  const pains = painsOf(a);
  if (!profile || !pains.length) return null;
  const pain = pains[0];
  const labels = (a.douleurs as string[]) || [];

  const current = profile === "start" ? 0 : REVENU[profile].mid[REVENU[profile].options.indexOf(a.revenu as string)] ?? 0;
  const oi = OBJECTIF[profile].options.indexOf(a.objectif as string);
  const target = oi >= 0 ? OBJECTIF[profile].val[oi] : null;
  const gapMonthly = target != null ? Math.max(0, target - current) : null;
  const inaction6m = gapMonthly != null ? gapMonthly * 6 : null;

  let painMetric: Diagnostic["painMetric"] = null;
  let painLine = "";
  const h = HOURS_MID[a.p_heures as string];
  if (pain === "temps" && profile === "start") {
    painLine = `Tu peux y consacrer ${String(a.p_heures_dispo || "?").toLowerCase()} par semaine (${String(a.p_emploi || "situation à préciser").toLowerCase()}) : ton modèle doit tenir dans ce temps-là dès le premier logement.`;
  } else if ((pain === "temps" || pain === "delegation" || pain === "process") && h != null) {
    const ht = pain === "temps" ? HOURS_TARGET_MID[a.p_heures_cible as string] ?? 3.5 : 3.5;
    const lost = Math.max(0, h - ht);
    painMetric = { value: `≈ ${Math.round(lost * 26)} h`, label: "de ton temps sur 6 mois, au-delà de ce que tu veux y passer" };
    painLine = lost > 0
      ? `Tu passes environ ${fr(h)} h par semaine sur la gestion${pain === "temps" ? `, pour un objectif de ${fr(ht)} h` : ""} : près de ${fr(Math.round(lost))} h de trop chaque semaine.`
      : `Tu passes environ ${fr(h)} h par semaine sur la gestion.`;
    if (lost <= 0) painMetric = { value: `≈ ${fr(Math.round(h * 26))} h`, label: "de gestion sur les 6 prochains mois" };
  } else if (pain === "occupation") {
    const occ = { "Moins de 40 %": 0.35, "40 à 60 %": 0.5, "60 à 75 %": 0.68, "Plus de 75 %": 0.8 }[a.p_occupation as string];
    const price = { "Moins de 60 €": 50, "60 à 90 €": 75, "90 à 130 €": 110, "130 à 200 €": 165, "Plus de 200 €": 220 }[a.p_prix_nuit as string];
    if (occ != null && price != null && occ < 0.75) {
      const nights = Math.round((0.75 - occ) * 30);
      painMetric = { value: `≈ ${eur(nights * price)}`, label: `de nuits vides par mois et par logement (${nights} nuits sous un objectif de 75 % d'occupation)` };
      painLine = `Avec un remplissage autour de ${Math.round(occ * 100)} % à environ ${price} € la nuit, il te manque près de ${nights} nuits par mois pour atteindre 75 %.`;
    } else painLine = "Ton remplissage et tes prix sont à reprendre ensemble, chiffres en main.";
  } else if (pain === "scale") {
    const cible = String(a.p_cible_logements || "");
    const plus = /de plus/.test(cible);
    painLine = `Tu vises ${plus ? cible.replace(" de plus", " logements de plus") : `${cible} logement${cible === "1" ? "" : "s"}`} dans 6 mois. Ce qui bloque : ${String(a.p_frein_scale || "à préciser").toLowerCase()}.`;
    painMetric = cible ? { value: plus ? `+${cible.replace(" de plus", "").replace("Plus de ", "")}` : cible, label: plus ? "logements de plus visés dans 6 mois" : "logements visés dans 6 mois" } : null;
  } else if (pain === "rentabilite") {
    painLine = profile === "start"
      ? `Budget de départ : ${String(a.p_budget || "?").toLowerCase()}. Calcul de rentabilité : ${String(a.p_calcul || "?").toLowerCase()}.`
      : `Marge par logement : ${String(a.p_marge || "?").toLowerCase()} par mois. Suivi de la marge : ${String(a.p_suivi || "?").toLowerCase()}.`;
  } else if (pain === "avis") {
    painLine = `Le reproche qui revient : ${String(a.p_reproche || "?").toLowerCase()}.`;
  } else if (pain === "process" && profile === "start") {
    painLine = `Ce qui te paraît flou : ${((a.p_manuel as string[]) || []).join(", ").toLowerCase() || "à préciser"}. Ton choix : ${String(a.p_mode || "à préciser").toLowerCase()}.`;
  } else if (pain === "process") {
    painLine = `Encore fait à la main : ${((a.p_manuel as string[]) || []).join(", ").toLowerCase() || "à préciser"}.`;
  }

  const blockers: string[] = [];
  if (a.bloque && BLOCKER_REFORMULATION[a.bloque as string]) blockers.push(BLOCKER_REFORMULATION[a.bloque as string]);
  for (const t of (a.essaye as string[]) || []) if (TRIED_REFORMULATION[t] && blockers.length < 3) blockers.push(TRIED_REFORMULATION[t]);

  const callPoints = [...CALL_POINTS[pain]];
  if (auditScore != null && auditScore < 80 && pain !== "occupation") callPoints.push(`Les corrections prioritaires de ton annonce (score actuel : ${auditScore}/100)`);

  const motivation = Number(a.motivation) || null;
  const hook = profile === "start"
    ? "On vérifie ensemble ton projet avant que tu engages le moindre euro."
    : profile === "one"
      ? "On repart de ton logement actuel pour en tirer le maximum, puis on prépare la suite."
      : "On regarde ton activité comme un associé : où part ton temps, où part ta marge.";

  return {
    profile, pain, otherPains: labels.slice(1), current, target, gapMonthly, inaction6m, painMetric,
    painTitle: PAIN_TITLES[pain], painLine, callPoints: callPoints.slice(0, 4), blockers: blockers.slice(0, 3), motivation, hook,
  };
}

/** Résumé texte (Systeme.io + notes Cal.com) : réponses + coût de l'inaction calculé. */
export function summarizeAnswers(a: DocAnswers, d: Diagnostic | null): string {
  const pairs = Object.entries(a)
    .filter(([, v]) => (Array.isArray(v) ? v.length : v))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(" + ") : v}`);
  const head = d ? [`Douleur n°1 : ${PAIN_TITLES[d.pain]}`, d.inaction6m != null ? `Coût de l'inaction (6 mois) : ${eur(d.inaction6m)}` : ""] : [];
  return [...head, ...pairs].filter(Boolean).join(" | ");
}
