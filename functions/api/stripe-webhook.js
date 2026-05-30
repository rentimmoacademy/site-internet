/**
 * Cloudflare Pages Function
 * POST /api/stripe-webhook
 *
 * Gère deux événements Stripe :
 *
 *  1. checkout.session.completed
 *     → Crée/met à jour le contact dans Systeme.io
 *     → Inscrit automatiquement l'acheteur dans la bonne formation
 *     → Ajoute le tag BUYER correspondant + CLOSED ✅
 *
 *  2. invoice.paid
 *     → Annule automatiquement l'abonnement 3x après le 3e paiement
 *
 * Variables d'environnement (CF Pages → Settings → Environment variables) :
 *   STRIPE_SECRET_KEY      — clé secrète Stripe (sk_live_...)
 *   STRIPE_WEBHOOK_SECRET  — secret de signature webhook Stripe (whsec_...)
 *   SYSTEMEIO_API_KEY      — clé API Systeme.io
 */

const STRIPE_BASE = 'https://api.stripe.com/v1';
const SIO_BASE    = 'https://api.systeme.io/api';

// ── Mapping Stripe price_id → Formation Systeme.io ────────────────────────────
// courseId + tagId buyer + nom pour logs
const PRICE_MAP = {
  // Sous-Location Professionnelle
  'price_1Tcq13ITr4wxVrm8inHmPxGx': { courseId: 627425, tagId: 2033057, label: 'Sous-Loc Bronze (1x)'    },
  'price_1Tcq14ITr4wxVrm8OovJ4JFm': { courseId: 627425, tagId: 2033057, label: 'Sous-Loc Bronze (3x)'    },
  'price_1Tcq17ITr4wxVrm8mUiJ723z': { courseId: 627425, tagId: 2033058, label: 'Sous-Loc Gold (1x)'      },
  'price_1Tcq17ITr4wxVrm8ADvAPr4w': { courseId: 627425, tagId: 2033058, label: 'Sous-Loc Gold (3x)'      },
  'price_1Tcq1AITr4wxVrm8CGsOzsvi': { courseId: 627425, tagId: 2033059, label: 'Sous-Loc Platinum (1x)'  },
  'price_1Tcq1BITr4wxVrm8aBIbMPOJ': { courseId: 627425, tagId: 2033059, label: 'Sous-Loc Platinum (3x)'  },
  // Conciergerie BnB Academy
  'price_1Tcq1EITr4wxVrm8v6y1g4EO': { courseId: 620179, tagId: 2008129, label: 'Conciergerie Bronze (1x)' },
  'price_1Tcq1FITr4wxVrm8TSM58lD8': { courseId: 620179, tagId: 2008129, label: 'Conciergerie Bronze (3x)' },
  'price_1Tcq1IITr4wxVrm8k0hTeAPN': { courseId: 620179, tagId: 2008130, label: 'Conciergerie Gold (1x)'   },
  'price_1Tcq1IITr4wxVrm8xan0eQA3': { courseId: 620179, tagId: 2008130, label: 'Conciergerie Gold (3x)'   },
  'price_1Tcq1LITr4wxVrm8x9Eerih4': { courseId: 620179, tagId: 2008131, label: 'Conciergerie Platinum (1x)'},
  'price_1Tcq1MITr4wxVrm8h602PjQG': { courseId: 620179, tagId: 2008131, label: 'Conciergerie Platinum (3x)'},
  // Cleaning BnB Academy
  'price_1Tcq1OITr4wxVrm8wuXx6VhG': { courseId: 620182, tagId: 2008132, label: 'Cleaning Bronze (1x)'    },
  'price_1Tcq1PITr4wxVrm8tcnCfwBd': { courseId: 620182, tagId: 2008132, label: 'Cleaning Bronze (3x)'    },
  'price_1Tcq1SITr4wxVrm8HL8Xac7N': { courseId: 620182, tagId: 2008133, label: 'Cleaning Gold (1x)'      },
  'price_1Tcq1SITr4wxVrm8F6zDqnOH': { courseId: 620182, tagId: 2008133, label: 'Cleaning Gold (3x)'      },
  'price_1Tcq1VITr4wxVrm85ZzQeQcz': { courseId: 620182, tagId: 2008134, label: 'Cleaning Platinum (1x)'  },
  'price_1Tcq1WITr4wxVrm8CKkxHlYQ': { courseId: 620182, tagId: 2008134, label: 'Cleaning Platinum (3x)'  },
};

const TAG_CLOSED = 1027337; // CLOSED ✅

// ── Helpers ───────────────────────────────────────────────────────────────────
async function stripeCall(path, method = 'GET', body, key) {
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  if (body) opts.body = new URLSearchParams(body).toString();
  const r = await fetch(`${STRIPE_BASE}/${path}`, opts);
  return r.json().catch(() => ({}));
}

async function sioCall(path, method = 'GET', body, key) {
  const opts = {
    method,
    headers: {
      'X-API-Key': key,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(`${SIO_BASE}${path}`, opts);
  return { ok: r.ok, status: r.status, data: await r.json().catch(() => ({})) };
}

async function sioFindOrCreateContact(email, name, sioKey) {
  // Search existing contact
  const search = await sioCall(`/contacts?email=${encodeURIComponent(email)}&limit=10`, 'GET', null, sioKey);
  const existing = search.data?.items?.[0];
  if (existing) return existing.id;

  // Create new
  const firstName = name?.split(' ')?.[0] || '';
  const lastName  = name?.split(' ')?.slice(1)?.join(' ') || '';
  const created   = await sioCall('/contacts', 'POST', {
    email,
    fields: [
      { slug: 'first_name', value: firstName },
      { slug: 'surname',    value: lastName  },
    ],
  }, sioKey);
  return created.data?.id || null;
}

async function sioEnrollInCourse(courseId, contactId, sioKey) {
  return sioCall(`/school/courses/${courseId}/enrollments`, 'POST', {
    contactId,
    accessType: 'full_access',
  }, sioKey);
}

async function sioAddTag(contactId, tagId, sioKey) {
  return sioCall(`/contacts/${contactId}/tags`, 'POST', { tagId }, sioKey);
}

// ── Stripe signature verification ─────────────────────────────────────────────
async function verifyStripeSignature(body, sigHeader, secret) {
  if (!sigHeader || !secret) return false;

  const parts = sigHeader.split(',').reduce((acc, part) => {
    const [k, v] = part.split('=');
    acc[k] = v;
    return acc;
  }, {});

  const timestamp = parts['t'];
  const sig = parts['v1'];
  if (!timestamp || !sig) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) return false;

  const payload   = `${timestamp}.${body}`;
  const encoder   = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig_buf = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payload));
  const computed = Array.from(new Uint8Array(sig_buf))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  return computed === sig;
}

// ── Event handlers ────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session, STRIPE_KEY, SIO_KEY) {
  const email    = session.customer_details?.email || session.customer_email;
  const name     = session.customer_details?.name  || '';
  const priceId  = session.line_items?.data?.[0]?.price?.id
                || (await stripeCall(`checkout/sessions/${session.id}/line_items?limit=1`, 'GET', null, STRIPE_KEY))
                    ?.data?.[0]?.price?.id;

  if (!email || !priceId) {
    return { skipped: 'missing_email_or_price', email, priceId };
  }

  const mapping = PRICE_MAP[priceId];
  if (!mapping) {
    return { skipped: 'unknown_price_id', priceId };
  }

  if (!SIO_KEY) {
    return { skipped: 'no_sio_key', label: mapping.label };
  }

  // 1. Find or create contact
  const contactId = await sioFindOrCreateContact(email, name, SIO_KEY);
  if (!contactId) {
    return { error: 'sio_contact_creation_failed', email };
  }

  // 2. Enroll in course
  const enrollment = await sioEnrollInCourse(mapping.courseId, contactId, SIO_KEY);

  // 3. Add buyer tag + CLOSED ✅
  await sioAddTag(contactId, mapping.tagId, SIO_KEY);
  await sioAddTag(contactId, TAG_CLOSED, SIO_KEY);

  return {
    ok: true,
    email,
    label: mapping.label,
    courseId: mapping.courseId,
    contactId,
    enrollmentStatus: enrollment.status,
    tagsAdded: [mapping.tagId, TAG_CLOSED],
  };
}

async function handleInvoicePaid(invoice, STRIPE_KEY) {
  const subscriptionId = invoice?.subscription;
  if (!subscriptionId) return { skipped: 'no_subscription' };

  const invoices  = await stripeCall(
    `invoices?subscription=${subscriptionId}&status=paid&limit=10`,
    'GET', null, STRIPE_KEY
  );
  const paidCount = invoices?.data?.length || 0;

  if (paidCount < 3) {
    return { ok: true, subscriptionId, paidCount, cancelled: false };
  }

  const result    = await stripeCall(
    `subscriptions/${subscriptionId}`,
    'DELETE',
    { invoice_now: 'false', prorate: 'false' },
    STRIPE_KEY
  );
  const cancelled = result?.status === 'canceled';

  return {
    ok: true,
    subscriptionId,
    paidCount,
    cancelled,
    ...(cancelled ? {} : { cancelError: result?.error?.message || 'unknown' }),
  };
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function onRequestPost(context) {
  const { request, env } = context;
  const STRIPE_KEY  = env.STRIPE_SECRET_KEY;
  const WEBHOOK_SEC = env.STRIPE_WEBHOOK_SECRET;
  const SIO_KEY     = env.SYSTEMEIO_API_KEY;

  const rawBody   = await request.text();
  const sigHeader = request.headers.get('stripe-signature');

  const valid = await verifyStripeSignature(rawBody, sigHeader, WEBHOOK_SEC);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'invalid_signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let event;
  try { event = JSON.parse(rawBody); }
  catch { return new Response('bad json', { status: 400 }); }

  let result;

  switch (event.type) {
    case 'checkout.session.completed':
      result = await handleCheckoutCompleted(event.data.object, STRIPE_KEY, SIO_KEY);
      break;
    case 'invoice.paid':
      result = await handleInvoicePaid(event.data.object, STRIPE_KEY);
      break;
    default:
      result = { ignored: event.type };
  }

  return new Response(JSON.stringify({ event: event.type, ...result }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method not allowed', { status: 405 });
}
