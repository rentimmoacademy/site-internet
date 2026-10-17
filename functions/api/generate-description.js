/**
 * CF Pages Function — POST /api/generate-description
 * Génère une annonce Airbnb optimisée (titre + description + points forts) via Gemini,
 * à partir des infos saisies par l'utilisateur. Pas de scraping, pas de gating.
 *
 * Env requis : GEMINI_API_KEY
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

function extractJSON(text) {
  try { return JSON.parse(text); } catch {}
  const m = text.match(/\{[\s\S]+\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  throw new Error('Impossible de parser la réponse en JSON');
}

const TONES = {
  chaleureux: 'chaleureux et accueillant, comme un hôte qui reçoit des amis',
  pro: 'professionnel et rassurant, orienté voyageurs d’affaires',
  familial: 'familial et pratique, orienté familles avec enfants',
};

async function generate({ propertyType, city, neighborhood, capacity, bedrooms, amenities, highlights, tone }, apiKey) {
  const toneDesc = TONES[tone] || TONES.chaleureux;

  const prompt = `Tu es un copywriter spécialisé en annonces Airbnb qui performent (algorithme Airbnb 2026 :
privilégie les données factuelles précises plutôt que le marketing flou, "Wifi 500 Mbps" bat "bel appart cosy").

Logement à décrire :
- Type : ${propertyType}
- Ville : ${city}${neighborhood ? `, quartier ${neighborhood}` : ''}
- Capacité : ${capacity} voyageurs, ${bedrooms} chambre(s)
- Équipements clés : ${amenities || 'non précisé'}
- Points forts à mettre en avant : ${highlights || 'non précisé'}
- Ton souhaité : ${toneDesc}

Génère une annonce optimisée. Règles strictes :
- Titre : 50 caractères max, concret, pas de superlatifs vides ("magnifique", "incroyable")
- Description : 4 paragraphes courts (espace de vie, chambres/couchages, quartier/accès, règles essentielles)
- Phrases courtes, données concrètes, pas de promesse de résultat ou de revenu
- Français correct, pas de fautes, pas d'emoji dans le titre

Réponds UNIQUEMENT en JSON valide, sans texte autour, sans markdown :
{
  "title": "<titre optimisé, max 50 caractères>",
  "titleVariants": ["<variante 1>", "<variante 2>"],
  "description": "<description complète en 4 paragraphes, séparés par \\n\\n>",
  "highlights": ["<point fort 1 reformulé>", "<point fort 2>", "<point fort 3>", "<point fort 4>"]
}`;

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.6 },
      }),
    }
  );

  if (!r.ok) throw new Error(`Gemini API error: ${r.status} ${await r.text()}`);
  const d = await r.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Réponse Gemini vide');
  return extractJSON(text);
}

export async function onRequestOptions() {
  return new Response('', { status: 200, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const { GEMINI_API_KEY } = env;
  if (!GEMINI_API_KEY) return json({ error: 'GEMINI_API_KEY non configuré' }, 500);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }

  const { propertyType, city, capacity, bedrooms } = body;
  if (!propertyType || !city || !capacity || !bedrooms) {
    return json({ error: 'missing_fields' }, 400);
  }

  try {
    const result = await generate(body, GEMINI_API_KEY);
    return json({ ok: true, result });
  } catch (e) {
    return json({ error: 'generation_failed', message: String(e.message || e) }, 500);
  }
}
