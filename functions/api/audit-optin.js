/**
 * CF Pages Function — POST /api/audit-optin
 * Capture lead depuis l'outil audit public (Super BnB Academy)
 * Env requis : SYSTEMEIO_API_KEY
 *
 * ⚠️  Créer manuellement dans Systeme.io le tag "Audit Annonce LCD"
 *     et mettre à jour TAG_AUDIT_LCD ci-dessous.
 */

const SIO = 'https://api.systeme.io/api';
const TAG_AUDIT_LCD = 1988673; // TODO: créer dans Systeme.io et remplacer cet ID

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

async function sio(path, method, body, key) {
  const r = await fetch(SIO + path, {
    method,
    headers: { 'X-API-Key': key, 'Content-Type': 'application/json', Accept: 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { ok: r.ok, status: r.status, data: await r.json().catch(() => ({})) };
}

export async function onRequestOptions() {
  return new Response('', { status: 200, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const key = env.SYSTEMEIO_API_KEY;

  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }

  const { firstName, email, phone, gestion, portfolio, defi, listingUrl, listingScore, platform } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'invalid_email' }, 400);
  if (!firstName?.trim()) return json({ error: 'missing_first_name' }, 400);

  if (!key) return json({ ok: true, contactId: null }); // pas de clé = silently pass

  // Cherche ou crée le contact
  const search = await sio(`/contacts?email=${encodeURIComponent(email)}`, 'GET', null, key);
  let contact = (search.data?.items || search.data?.['hydra:member'] || [])[0] || null;

  if (!contact) {
    const fields = [
      { slug: 'first_name', value: firstName.trim() },
      ...(phone ? [{ slug: 'phone_number', value: phone }] : []),
    ];
    const create = await sio('/contacts', 'POST', { email, fields }, key);
    if (!create.ok) return json({ error: 'sio_error' }, 422);
    contact = create.data;
  }

  // Tag "Audit Annonce LCD"
  await sio(`/contacts/${contact.id}/tags`, 'POST', { tagId: TAG_AUDIT_LCD }, key).catch(() => {});

  // Note de qualification
  const defiStr = Array.isArray(defi) ? defi.join(', ') : (defi || 'Non renseigné');
  const note = [
    `[Audit Annonce LCD — ${new Date().toLocaleDateString('fr-FR')}]`,
    `Plateforme : ${platform === 'booking' ? 'Booking.com' : 'Airbnb'}`,
    `URL analysée : ${listingUrl || 'N/A'}`,
    `Score obtenu : ${listingScore != null ? listingScore + '/100' : 'N/A'}`,
    `Gestion : ${gestion || 'Non renseigné'}`,
    `Portfolio : ${portfolio || 'Non renseigné'}`,
    `Défi principal : ${defiStr}`,
  ].join('\n');

  await sio(`/contacts/${contact.id}/notes`, 'POST', { content: note }, key).catch(() => {});

  return json({ ok: true, contactId: contact.id });
}
