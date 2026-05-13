/**
 * Cloudflare Pages Function
 * POST /api/setsmart-webhook
 *
 * Reçoit les événements SetSmart et met à jour HubSpot en temps réel :
 *   - message / conversation_started → statut_setting = "Contacté"
 *   - qualified                      → statut_setting = "Qualifié"
 *   - booked / appointment_scheduled → statut_setting = "Call booké" + crée deal
 *
 * Variables d'environnement :
 *   HUBSPOT_KEY  — Service Key HubSpot (pat-eu1-xxx)
 */

const HS_BASE = 'https://api.hubapi.com';

// Stage IDs pipeline "Closing Rentimmo Academy" (id: default)
const STAGE_ID = {
  contacte:         '5350052045',  // Contacté SetSmart
  qualifie:         '5350553800',  // Qualifié
  call_booke:       '5350553801',  // Call booké
};

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
  if (!email) return null;
  const search = await hsCall('/crm/v3/objects/contacts/search', 'POST', {
    filterGroups: [{ filters: [{ propertyName: 'email', operator: 'EQ', value: email }] }],
    properties: ['email', 'statut_setting'],
  }, hsKey);

  if (search.ok && search.data?.results?.length > 0) {
    const id = search.data.results[0].id;
    await hsCall(`/crm/v3/objects/contacts/${id}`, 'PATCH', { properties: props }, hsKey);
    return id;
  }
  // Créer si inexistant
  const create = await hsCall('/crm/v3/objects/contacts', 'POST', {
    properties: { email, ...props }
  }, hsKey);
  return create.data?.id || null;
}

async function hsCreateDeal(contactId, dealName, stageId, hsKey) {
  const deal = await hsCall('/crm/v3/objects/deals', 'POST', {
    properties: { dealname: dealName, pipeline: 'default', dealstage: stageId },
  }, hsKey);
  if (!deal.ok || !deal.data?.id) return null;
  // Associer deal ↔ contact
  await hsCall(
    `/crm/v4/objects/deals/${deal.data.id}/associations/default/contacts/${contactId}`,
    'PUT', null, hsKey
  );
  return deal.data.id;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const HS_KEY = env.HUBSPOT_KEY;

  if (!HS_KEY) {
    return new Response(JSON.stringify({ error: 'HUBSPOT_KEY missing' }), { status: 500 });
  }

  let payload;
  try { payload = await request.json(); }
  catch { return new Response('bad json', { status: 400 }); }

  // SetSmart envoie : { event, contact: { email, name, phone }, ... }
  const event   = payload.event || payload.type || payload.triggerEvent || '';
  const contact = payload.contact || payload.lead || {};
  const email   = contact.email || payload.email;
  const name    = contact.name  || payload.name || '';

  if (!email) {
    return new Response(JSON.stringify({ ignored: 'no_email', event }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const eventLow = String(event).toLowerCase();
  let statut = null;
  let stageId = null;
  let createDeal = false;

  if (eventLow.includes('book') || eventLow.includes('appointment') || eventLow.includes('scheduled')) {
    statut    = 'call_booké';    // valeur interne HubSpot
    stageId   = STAGE_ID.call_booke;
    createDeal = true;
  } else if (eventLow.includes('qualif')) {
    statut  = 'qualifié';        // valeur interne HubSpot
    stageId = STAGE_ID.qualifie;
  } else if (eventLow.includes('message') || eventLow.includes('conversation') || eventLow.includes('contact')) {
    statut  = 'contacté';        // valeur interne HubSpot
    stageId = STAGE_ID.contacte;
  }

  if (!statut) {
    return new Response(JSON.stringify({ ignored: true, event, note: 'event non mappé' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const hsProps = {
    statut_setting: statut,  // valeur interne HubSpot ex: 'contacté'
    lifecyclestage: 'lead',
    ...(name ? {
      firstname: name.split(' ')[0] || '',
      lastname:  name.split(' ').slice(1).join(' ') || '',
    } : {}),
  };

  const contactId = await hsUpsertContact(email, hsProps, HS_KEY);
  let dealId = null;

  if (createDeal && contactId) {
    const dealName = `Call — ${name || email} · ${new Date().toLocaleDateString('fr-FR')}`;
    dealId = await hsCreateDeal(contactId, dealName, STAGE_ID.call_booke, HS_KEY);
  }

  return new Response(JSON.stringify({
    ok: true,
    event,
    statut,
    hubspot: { contactId, dealId },
  }), { headers: { 'Content-Type': 'application/json' } });
}

export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method not allowed', { status: 405 });
}
