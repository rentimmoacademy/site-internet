/**
 * Cloudflare Pages Function
 * POST /api/cal-webhook
 *
 * Reçoit webhook Cal.com BOOKING_CREATED :
 *   1. Tague le contact "CALL CLOSING BOOKED" dans Systeme.io
 *
 * Variables d'environnement (CF Pages dashboard → Settings → Environment variables) :
 *   SYSTEMEIO_API_KEY  — clé API Systeme.io
 *
 * ⚠️ HubSpot abandonné (sept 2026, plan Free limité) — intégration retirée oct 2026
 * pour arrêter les appels morts à chaque booking. Ne pas réintroduire sans decision explicite.
 */

const SIO_BASE = 'https://api.systeme.io/api';

const TAG_CALL_BOOKED = 985114;
const SOURCE_TAGS = {
  insta:   1054256,
  tiktok:  1057171,
  youtube: 1057170,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function detectSource(text) {
  if (!text) return null;
  const s = String(text).toLowerCase();
  // Mots entiers uniquement : l'ancien test includes('tt') / includes('yt') attribuait
  // « tiktok » à tout texte contenant « tt » (« attendre », « http »...).
  if (/\binsta(gram)?\b/.test(s)) return 'insta';
  if (/\btik ?tok\b|\btt\b/.test(s)) return 'tiktok';
  if (/\byoutube\b|\byt\b/.test(s)) return 'youtube';
  return null;
}

function extractSource(payload) {
  const candidates = [
    payload?.responses,
    payload?.customInputs,
    payload?.attendees?.[0]?.responses,
    payload?.bookingFieldsResponses,
  ];
  for (const c of candidates) {
    if (!c) continue;
    for (const key of ['discovery_source','source','comment-tu-mas-decouvert','reseau_social','how_did_you_find_us']) {
      const v = c[key];
      if (v) {
        const txt = typeof v === 'string' ? v : (v.value || v.label || '');
        const d = detectSource(txt);
        if (d) return d;
      }
    }
    for (const v of Object.values(c)) {
      const txt = typeof v === 'string' ? v : (v?.value || v?.label || '');
      const d = detectSource(txt);
      if (d) return d;
    }
  }
  return null;
}

async function sioCall(path, method = 'GET', body, sioKey) {
  const r = await fetch(SIO_BASE + path, {
    method,
    headers: { 'X-API-Key': sioKey, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
}

// ─── Handler ─────────────────────────────────────────────────────────────────
export async function onRequestPost(context) {
  const { request, env } = context;
  const SIO_KEY = env.SYSTEMEIO_API_KEY;

  let payload;
  try { payload = await request.json(); }
  catch { return new Response('bad json', { status: 400 }); }

  const eventType = payload.triggerEvent || payload.event;
  if (eventType && !['BOOKING_CREATED','booking.created'].includes(eventType)) {
    return new Response(JSON.stringify({ ignored: eventType }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data       = payload.payload || payload;
  const attendees  = data.attendees || data.attendee || [];
  const attendee   = Array.isArray(attendees) ? attendees[0] : attendees;
  const email      = attendee?.email;
  const name       = attendee?.name || '';

  if (!email) {
    return new Response(JSON.stringify({ error: 'no_email' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const source     = extractSource(data);
  const tagsAdded  = [];
  let sioContactId = null;

  // ── 1. Systeme.io : find or create contact + tag ──────────────────────────
  if (SIO_KEY) {
    const search = await sioCall(`/contacts?email=${encodeURIComponent(email)}`, 'GET', null, SIO_KEY);
    let contact  = (search.data?.items || [])[0] || null;

    if (!contact) {
      const firstName = name.split(' ')[0] || 'Lead';
      const created   = await sioCall('/contacts', 'POST', {
        email, fields: [{ slug: 'first_name', value: firstName }]
      }, SIO_KEY);
      contact = created.ok ? created.data : null;
    }

    if (contact?.id) {
      sioContactId = contact.id;
      await sioCall(`/contacts/${contact.id}/tags`, 'POST', { tagId: TAG_CALL_BOOKED }, SIO_KEY);
      tagsAdded.push('CALL CLOSING BOOKED');
      if (source && SOURCE_TAGS[source]) {
        await sioCall(`/contacts/${contact.id}/tags`, 'POST', { tagId: SOURCE_TAGS[source] }, SIO_KEY);
        tagsAdded.push(`source:${source}`);
      }
    }
  }

  return new Response(JSON.stringify({
    ok: true,
    sioContactId,
    tagsAdded,
    source,
  }), { headers: { 'Content-Type': 'application/json' } });
}

// Répondre 405 aux autres méthodes
export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method not allowed', { status: 405 });
}
