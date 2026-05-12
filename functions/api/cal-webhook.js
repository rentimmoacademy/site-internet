/**
 * Cloudflare Pages Function
 * POST /api/cal-webhook
 *
 * Reçoit webhook Cal.com BOOKING_CREATED :
 *   1. Tague le contact "CALL CLOSING BOOKED" dans Systeme.io
 *   2. Upsert contact + crée deal "Call booké" dans HubSpot
 *
 * Variables d'environnement (CF Pages dashboard → Settings → Environment variables) :
 *   SYSTEMEIO_API_KEY  — clé API Systeme.io
 *   HUBSPOT_KEY        — Private App token HubSpot (eu1-xxx)
 */

const SIO_BASE = 'https://api.systeme.io/api';
const HS_BASE  = 'https://api.hubapi.com';

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
  if (s.includes('insta')) return 'insta';
  if (s.includes('tiktok') || s.includes('tt')) return 'tiktok';
  if (s.includes('youtube') || s.includes('yt')) return 'youtube';
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

async function hsCall(path, method = 'GET', body, hsKey) {
  const r = await fetch(HS_BASE + path, {
    method,
    headers: { 'Authorization': `Bearer ${hsKey}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
}

async function hsUpsertContact(email, props, hsKey) {
  const search = await hsCall('/crm/v3/objects/contacts/search', 'POST', {
    filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
    properties: ['email'],
  }, hsKey);
  if (search.ok && search.data?.results?.length > 0) {
    const id = search.data.results[0].id;
    await hsCall(`/crm/v3/objects/contacts/${id}`, 'PATCH', { properties: props }, hsKey);
    return id;
  }
  const create = await hsCall('/crm/v3/objects/contacts', 'POST', { properties: { email, ...props } }, hsKey);
  return create.data?.id || null;
}

async function hsCreateDeal(contactId, name, hsKey) {
  // Trouver le pipeline "Closing Rentimmo Academy"
  const pipelines = await hsCall('/crm/v3/pipelines/deals', 'GET', null, hsKey);
  const pipeline  = pipelines.data?.results?.find(p => p.label === 'Closing Rentimmo Academy');
  const stage     = pipeline?.stages?.find(s => s.label === 'Call booké') || pipeline?.stages?.[3];
  if (!pipeline || !stage) return null;

  const deal = await hsCall('/crm/v3/objects/deals', 'POST', {
    properties: { dealname: name, pipeline: pipeline.id, dealstage: stage.id },
  }, hsKey);
  if (!deal.ok || !deal.data?.id) return null;

  // Associer deal → contact
  await hsCall(
    `/crm/v4/objects/deals/${deal.data.id}/associations/default/contacts/${contactId}`,
    'PUT', null, hsKey
  );
  return deal.data.id;
}

// ─── Handler ─────────────────────────────────────────────────────────────────
export async function onRequestPost(context) {
  const { request, env } = context;
  const SIO_KEY = env.SYSTEMEIO_API_KEY;
  const HS_KEY  = env.HUBSPOT_KEY;

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
  let hsContactId  = null;
  let hsDealId     = null;

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

  // ── 2. HubSpot : upsert contact + deal ───────────────────────────────────
  if (HS_KEY) {
    try {
      const firstName = name.split(' ')[0] || '';
      const lastName  = name.split(' ').slice(1).join(' ') || '';
      const hsProps   = {
        firstname: firstName, lastname: lastName,
        statut_setting: 'Call booké',
        lifecyclestage: 'lead',
        ...(source ? { source_rentimmo: source } : {}),
      };
      hsContactId = await hsUpsertContact(email, hsProps, HS_KEY);
      if (hsContactId) {
        const dealName = `Call — ${name || email} · ${new Date().toLocaleDateString('fr-FR')}`;
        hsDealId = await hsCreateDeal(hsContactId, dealName, HS_KEY);
      }
    } catch { /* HubSpot non-bloquant */ }
  }

  return new Response(JSON.stringify({
    ok: true,
    sioContactId,
    tagsAdded,
    source,
    hubspot: { contactId: hsContactId, dealId: hsDealId },
  }), { headers: { 'Content-Type': 'application/json' } });
}

// Répondre 405 aux autres méthodes
export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method not allowed', { status: 405 });
}
