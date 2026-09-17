/**
 * Cloudflare Pages Function — POST /api/contact
 * Formulaire Contact (page /contact) — remplace l'ancien action="mailto:" (non fiable, surtout mobile).
 * Pipeline : Systeme.io (CRM) + Google Sheets (log, même Apps Script que l'optin masterclass).
 */

const SIO = 'https://api.systeme.io/api';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

async function sio(path, method, body, key, userIP) {
  const r = await fetch(SIO + path, {
    method,
    headers: {
      'X-API-Key': key,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Forwarded-For': userIP,
      'X-Real-IP': userIP,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { ok: r.ok, status: r.status, data: await r.json().catch(() => ({})) };
}

export async function onRequestOptions() {
  return new Response('', { status: 200, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }

  const { name, email, phone, formation, message } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'invalid_email' }, 400);
  if (!name?.trim()) return json({ error: 'missing_name' }, 400);

  const userIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || '1.1.1.1';
  const key = env.SYSTEMEIO_API_KEY;

  // 1. Google Sheets log (fire-and-forget, même Apps Script que l'optin — source distingue le type)
  if (env.APPS_SCRIPT_URL) {
    fetch(env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: name.trim(),
        email,
        phone: phone || '',
        source: 'contact-form',
        formation: formation || '',
        message: message || '',
      }),
    }).catch(() => {});
  }

  // 2. Systeme.io CRM
  if (key) {
    const search = await sio(`/contacts?email=${encodeURIComponent(email)}`, 'GET', null, key, userIP);
    let contact = (search.data?.items || search.data?.['hydra:member'] || [])[0] || null;

    const fields = [{ slug: 'first_name', value: name.trim() }];
    if (phone) fields.push({ slug: 'phone_number', value: phone });

    if (!contact && search.ok) {
      await sio('/contacts', 'POST', { email, fields }, key, userIP);
    }
    // Note : mise à jour des champs sur contact existant omise volontairement
    // (évite d'écraser des données déjà qualifiées par un autre pipeline).
  }

  return json({ ok: true });
}
