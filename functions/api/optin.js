/**
 * Cloudflare Pages Function — POST /api/optin
 * Crée contact Systeme.io + tag "optin masterclass"
 * Variable requise : SYSTEMEIO_API_KEY (déjà présente dans CF Pages)
 */

const SIO = 'https://api.systeme.io/api';
const TAGS = {
  optinMasterclass: 1721885,
  sourceInsta:      1054256,
  sourceTiktok:     1057171,
  sourceYoutube:    1057170,
};

function sourceTagId(src) {
  if (!src) return null;
  const s = src.toLowerCase();
  if (s.includes('tiktok') || s.startsWith('tt')) return TAGS.sourceTiktok;
  if (s.includes('youtube') || s.startsWith('yt')) return TAGS.sourceYoutube;
  if (s.includes('insta') || s.startsWith('ig')) return TAGS.sourceInsta;
  return null;
}

async function sio(path, method, body, key) {
  const r = await fetch(SIO + path, {
    method,
    headers: { 'X-API-Key': key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { ok: r.ok, status: r.status, data: await r.json().catch(() => ({})) };
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response('', { status: 200, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const key = env.SYSTEMEIO_API_KEY;
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }

  const { firstName, email, phone, source } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'invalid_email' }, 400);
  if (!firstName?.trim()) return json({ error: 'missing_first_name' }, 400);

  if (!key) return json({ ok: true, contactId: null }); // pas de clé = on laisse passer quand même

  // Cherche ou crée le contact
  const search = await sio(`/contacts?email=${encodeURIComponent(email)}`, 'GET', null, key);
  let contact = (search.data?.items || search.data?.['hydra:member'] || [])[0] || null;

  if (!contact) {
    const fields = [{ slug: 'first_name', value: firstName.trim() }];
    if (phone) fields.push({ slug: 'phone_number', value: phone });
    const create = await sio('/contacts', 'POST', { email, fields }, key);
    if (!create.ok) {
      const violations = create.data?.violations || [];
      const allText = JSON.stringify(create.data).toLowerCase();
      const badEmail = violations.some(v => v.propertyPath === 'email') ||
        allText.includes('existe pas') || allText.includes('invalide') ||
        allText.includes('mx') || allText.includes('dns');
      return json({
        error: badEmail ? 'email_invalid' : 'sio_error',
        message: badEmail ? 'Adresse email invalide. Vérifie et réessaie.' : 'Erreur technique. Réessaie dans une minute.',
      }, badEmail ? 400 : 422);
    }
    contact = create.data;
  }

  // Tags
  const toAdd = [TAGS.optinMasterclass, sourceTagId(source)].filter(Boolean);
  await Promise.all(toAdd.map(tagId => sio(`/contacts/${contact.id}/tags`, 'POST', { tagId }, key)));

  return json({ ok: true, contactId: contact.id });
}
