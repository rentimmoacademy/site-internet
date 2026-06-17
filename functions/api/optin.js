/**
 * Cloudflare Pages Function — POST /api/optin
 * Capture lead masterclass → SetSmart WA + Systeme.io via webhook natif
 * Note: Systeme.io API bloque les requêtes CF Pages (WAF). Pipeline : CF Pages → SetSmart → Sio via automation native.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function formatPhone(phone) {
  if (!phone) return null;
  const d = phone.replace(/\D/g, '');
  if (d.startsWith('33') && d.length === 11) return '+' + d;
  if (d.startsWith('0') && d.length === 10) return '+33' + d.slice(1);
  if (d.length >= 10) return '+' + d;
  return null;
}

export async function onRequestOptions() {
  return new Response('', { status: 200, headers: CORS });
}

export async function onRequestPost({ request }) {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }

  const { firstName, email, phone, source } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'invalid_email' }, 400);
  if (!firstName?.trim()) return json({ error: 'missing_first_name' }, 400);

  const wa = formatPhone(phone);
  if (!wa) return json({ error: 'missing_phone', message: 'Numéro de téléphone requis.' }, 400);

  // Déclenche SetSmart → séquence WA + automation Sio native
  const ss = await fetch('https://setsmart.io/api/optin?client=rentimmoacademy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipient_number: wa, name: firstName.trim(), email }),
  }).catch(() => null);

  return json({ ok: true });
}
