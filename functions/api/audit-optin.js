/**
 * CF Pages Function — POST /api/audit-optin
 * Tunnel « Audit annonce » Super BNB Academy → Systeme.io.
 * Env requis : SYSTEMEIO_API_KEY
 *
 * Appelé en 3 temps (même contact, retrouvé par email) :
 *   stage "optin"      : dès le formulaire (prénom, email, WhatsApp, lien annonce) → contact créé
 *                        ou mis à jour (téléphone), tag « Audit Annonce LCD ».
 *   stage "audit"      : score /100 + priorités de l'audit.
 *   stage "diagnostic" : réponses aux questions « docteur » + écart calculé.
 * Les données vont dans des champs personnalisés (slugs audit_*), créés le 13/11/2026 ;
 * « audit_reponses » contient le résumé complet (réponses + coût de l'inaction calculé)
 * (l'API Systeme.io n'a pas d'endpoint « notes » : l'ancienne note n'était jamais enregistrée).
 *
 * Les erreurs sont renvoyées (le front propose de réessayer).
 * En-tête « X-Test: 1 » : validation seule, aucun appel à Systeme.io (tests locaux).
 */

const SIO = 'https://api.systeme.io/api';
const TAG_AUDIT_LCD = 2239365; // « Audit Annonce LCD »

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Test',
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clip = (v, n = 250) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, n);
const list = (v) => (Array.isArray(v) ? v.join(', ') : v || '');

async function sio(path, method, body, key, contentType = 'application/json') {
  const r = await fetch(SIO + path, {
    method,
    headers: { 'X-API-Key': key, 'Content-Type': contentType, Accept: 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { ok: r.ok, status: r.status, data: await r.json().catch(() => ({})) };
}

/** Champs Systeme.io à écrire selon l'étape. */
function fieldsFor(stage, b) {
  const f = [];
  const add = (slug, value) => { if (value !== undefined && value !== null && String(value).trim() !== '') f.push({ slug, value: clip(value) }); };
  if (stage === 'optin') {
    add('first_name', clip(b.firstName, 80));
    add('phone_number', clip(b.phone, 40));
    add('audit_url', b.listingUrl);
  }
  if (stage === 'audit') {
    add('audit_url', b.listingUrl);
    add('audit_score', b.listingScore != null ? `${b.listingScore}/100 (${b.source === 'airbnb' ? 'données Airbnb' : 'auto-évaluation'})` : '');
    add('audit_priorites', list(b.priorities));
  }
  if (stage === 'diagnostic') {
    const a = b.answers || {};
    const d = b.diagnostic || {};
    add('audit_logements', a.profil);
    add('audit_ca', a.revenu || (a.profil && /lance/i.test(a.profil) ? 'Pas encore de revenus' : ''));
    add('audit_objectif', a.objectif);
    add('audit_essaye', list(a.essaye));
    add('audit_douleurs', list(a.douleurs));
    add('audit_douleur_detail', d.painLine);
    add('audit_bloque', a.bloque);
    add('audit_motivation', a.motivation ? `${a.motivation}/10` : '');
    add('audit_pret', a.pret);
    add('audit_ecart', d.gapMonthly != null ? `${d.gapMonthly} €/mois` : '');
    add('audit_cout_inaction', d.inaction6m != null ? `${d.inaction6m} € sur 6 mois` : '');
    if (b.summary) f.push({ slug: 'audit_reponses', value: clip(b.summary, 1000) });
    if (b.listingScore != null) add('audit_score', `${b.listingScore}/100`);
  }
  return f;
}

export async function onRequestOptions() {
  return new Response('', { status: 204, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }

  const stage = ['optin', 'audit', 'diagnostic'].includes(body.stage) ? body.stage : 'optin';
  const email = String(body.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'invalid_email' }, 400);
  if (stage === 'optin' && !String(body.firstName || '').trim()) return json({ ok: false, error: 'missing_first_name' }, 400);

  const fields = fieldsFor(stage, body);

  if (request.headers.get('X-Test') === '1') return json({ ok: true, test: true, stage, fields });

  const key = env.SYSTEMEIO_API_KEY;
  if (!key) return json({ ok: false, error: 'not_configured' }, 503);

  try {
    // Contact existant ?
    const search = await sio(`/contacts?email=${encodeURIComponent(email)}`, 'GET', null, key);
    if (!search.ok) return json({ ok: false, error: 'sio_search_failed', status: search.status }, 502);
    let contact = (search.data?.items || search.data?.['hydra:member'] || [])[0] || null;

    // Repli si Systeme.io refuse une valeur trop longue : champs coupés à 250 caractères
    const shortFields = fields.map((x) => ({ ...x, value: clip(x.value, 250) }));
    if (!contact) {
      let create = await sio('/contacts', 'POST', { email, fields }, key);
      if (!create.ok && create.status >= 400 && create.status < 500 && create.status !== 409) create = await sio('/contacts', 'POST', { email, fields: shortFields }, key);
      if (!create.ok) return json({ ok: false, error: 'sio_create_failed', status: create.status, detail: create.data?.detail || null }, 502);
      contact = create.data;
    } else if (fields.length) {
      // Mise à jour (téléphone, champs audit…). On n'écrase pas un prénom déjà présent.
      const existingFirst = (contact.fields || []).find((x) => x.slug === 'first_name')?.value;
      const keep = (arr) => (existingFirst ? arr.filter((x) => x.slug !== 'first_name') : arr);
      const upd = keep(fields);
      if (upd.length) {
        let patch = await sio(`/contacts/${contact.id}`, 'PATCH', { fields: upd }, key, 'application/merge-patch+json');
        if (!patch.ok && patch.status >= 400 && patch.status < 500) patch = await sio(`/contacts/${contact.id}`, 'PATCH', { fields: keep(shortFields) }, key, 'application/merge-patch+json');
        if (!patch.ok) return json({ ok: false, error: 'sio_update_failed', status: patch.status, contactId: contact.id }, 502);
      }
    }

    const warnings = [];
    if (stage === 'optin') {
      const already = (contact.tags || []).some((t) => t.id === TAG_AUDIT_LCD);
      if (!already) {
        const tag = await sio(`/contacts/${contact.id}/tags`, 'POST', { tagId: TAG_AUDIT_LCD }, key);
        if (!tag.ok && tag.status !== 422) warnings.push(`tag_${tag.status}`);
      }
    }

    return json({ ok: true, stage, contactId: contact.id, ...(warnings.length ? { warnings } : {}) });
  } catch (e) {
    return json({ ok: false, error: 'network', detail: String(e?.message || e) }, 502);
  }
}
