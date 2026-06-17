/**
 * Cloudflare Pages Function — POST /api/optin
 * Double pipeline : Systeme.io (CRM) + SetSmart (WA)
 */

const SIO = 'https://api.systeme.io/api';
const TAGS = { optinMasterclass: 1721885, sourceInsta: 1054256, sourceTiktok: 1057171, sourceYoutube: 1057170 };

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

function sourceTagId(src) {
  const s = (src || '').toLowerCase();
  if (s.includes('insta') || s.startsWith('ig')) return TAGS.sourceInsta;
  if (s.includes('tiktok') || s.startsWith('tt')) return TAGS.sourceTiktok;
  if (s.includes('youtube') || s.startsWith('yt')) return TAGS.sourceYoutube;
  return null;
}

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

  const { firstName, email, phone, source } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'invalid_email' }, 400);
  if (!firstName?.trim()) return json({ error: 'missing_first_name' }, 400);

  const wa = formatPhone(phone);
  const userIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || '1.1.1.1';
  const key = env.SYSTEMEIO_API_KEY;

  // 1. SetSmart WA (toujours, indépendant)
  if (wa) {
    fetch('https://setsmart.io/api/optin?client=rentimmoacademy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient_number: wa, name: firstName.trim(), email }),
    }).catch(() => {});
  }

  // 2. Systeme.io CRM (avec IP réelle du lead)
  if (key) {
    const search = await sio(`/contacts?email=${encodeURIComponent(email)}`, 'GET', null, key, userIP);
    let contact = (search.data?.items || search.data?.['hydra:member'] || [])[0] || null;

    if (!contact && search.ok) {
      const fields = [{ slug: 'first_name', value: firstName.trim() }];
      if (phone) fields.push({ slug: 'phone_number', value: phone });
      const create = await sio('/contacts', 'POST', { email, fields }, key, userIP);
      if (create.ok) {
        contact = create.data;
        const tags = [TAGS.optinMasterclass, sourceTagId(source)].filter(Boolean);
        await Promise.all(tags.map(tagId => sio(`/contacts/${contact.id}/tags`, 'POST', { tagId }, key, userIP)));
      }
    } else if (contact) {
      const tags = [TAGS.optinMasterclass, sourceTagId(source)].filter(Boolean);
      await Promise.all(tags.map(tagId => sio(`/contacts/${contact.id}/tags`, 'POST', { tagId }, key, userIP)));
    }
  }

  return json({ ok: true });
}
