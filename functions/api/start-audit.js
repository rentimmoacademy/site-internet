/**
 * CF Pages Function — POST /api/start-audit
 * Lance le scraping Apify de l'annonce (Airbnb ou Booking.com)
 * Env requis : APIFY_API_TOKEN
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

const ACTORS = {
  airbnb: 'apify~airbnb-scraper',
  booking: 'dtrungtin~booking-scraper',
};

function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

const buildInput = (platform, url) => {
  if (platform === 'airbnb') {
    return {
      startUrls: [{ url }],
      maxListings: 1,
      includeReviews: true,
      maxReviews: 30,
      currency: 'EUR',
      checkIn: futureDate(14),
      checkOut: futureDate(15),
      calendarMonths: 3,
    };
  }
  return {
    startUrls: [{ url }],
    maxReviews: 30,
  };
};

export async function onRequestOptions() {
  return new Response('', { status: 200, headers: CORS });
}

export async function onRequestPost({ request, env }) {
  const { APIFY_API_TOKEN } = env;

  let body;
  try { body = await request.json(); }
  catch { return json({ error: 'bad_json' }, 400); }

  const { url, platform } = body;

  if (!url || !platform) return json({ error: 'URL et plateforme requis' }, 400);
  if (!ACTORS[platform]) return json({ error: 'Plateforme invalide (airbnb ou booking)' }, 400);
  if (!APIFY_API_TOKEN) return json({ error: 'APIFY_API_TOKEN non configuré' }, 500);

  // Validation basique de l'URL
  const isAirbnb = url.includes('airbnb.');
  const isBooking = url.includes('booking.com');
  if (platform === 'airbnb' && !isAirbnb) return json({ error: 'URL Airbnb invalide' }, 400);
  if (platform === 'booking' && !isBooking) return json({ error: 'URL Booking.com invalide' }, 400);

  try {
    const res = await fetch(
      `https://api.apify.com/v2/acts/${ACTORS[platform]}/runs?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildInput(platform, url)),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return json({ error: 'Apify error', detail: err }, 500);
    }

    const { data } = await res.json();

    return json({ listingRunId: data.id, status: 'STARTED', platform, url });

  } catch (e) {
    return json({ error: e.message }, 500);
  }
}
