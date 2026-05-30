/**
 * Cloudflare Pages Function
 * POST /api/stripe-webhook
 *
 * Reçoit les webhooks Stripe invoice.paid :
 *   → Annule automatiquement l'abonnement après le 3e paiement (plan 3x)
 *
 * Variables d'environnement (CF Pages dashboard → Settings → Environment variables) :
 *   STRIPE_SECRET_KEY      — clé secrète Stripe (sk_live_...)
 *   STRIPE_WEBHOOK_SECRET  — secret de signature webhook Stripe (whsec_...)
 */

const STRIPE_BASE = 'https://api.stripe.com/v1';

async function stripeCall(path, method = 'GET', body, key) {
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  if (body) {
    opts.body = new URLSearchParams(body).toString();
  }
  const r = await fetch(`${STRIPE_BASE}/${path}`, opts);
  return r.json().catch(() => ({}));
}

// Vérification HMAC-SHA256 de la signature Stripe
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

  // Reject replays older than 5 minutes
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 300) return false;

  const payload = `${timestamp}.${body}`;
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(payload);

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const computedSig = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return computedSig === sig;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const STRIPE_KEY    = env.STRIPE_SECRET_KEY;
  const WEBHOOK_SEC   = env.STRIPE_WEBHOOK_SECRET;

  const rawBody = await request.text();
  const sigHeader = request.headers.get('stripe-signature');

  // Vérifier la signature
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

  // On ne traite que invoice.paid
  if (event.type !== 'invoice.paid') {
    return new Response(JSON.stringify({ ignored: event.type }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const invoice        = event.data?.object;
  const subscriptionId = invoice?.subscription;
  const customerId     = invoice?.customer;

  if (!subscriptionId) {
    return new Response(JSON.stringify({ skipped: 'no_subscription' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Compter les factures payées pour cet abonnement
  const invoices = await stripeCall(
    `invoices?subscription=${subscriptionId}&status=paid&limit=10`,
    'GET', null, STRIPE_KEY
  );

  const paidCount = invoices?.data?.length || 0;

  let cancelled = false;
  let cancelError = null;

  if (paidCount >= 3) {
    // Annuler immédiatement (pas en fin de période)
    const result = await stripeCall(
      `subscriptions/${subscriptionId}`,
      'DELETE',
      { invoice_now: 'false', prorate: 'false' },
      STRIPE_KEY
    );
    if (result?.status === 'canceled') {
      cancelled = true;
    } else {
      cancelError = result?.error?.message || 'unknown';
    }
  }

  return new Response(JSON.stringify({
    ok: true,
    subscriptionId,
    customerId,
    paidCount,
    cancelled,
    ...(cancelError ? { cancelError } : {}),
  }), { headers: { 'Content-Type': 'application/json' } });
}

// Répondre 405 aux autres méthodes
export async function onRequest(context) {
  if (context.request.method === 'POST') return onRequestPost(context);
  return new Response('Method not allowed', { status: 405 });
}
