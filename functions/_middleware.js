/**
 * Cloudflare Pages middleware — 301 redirect anti-squat + canonical normalization.
 *
 * Le canonique principal du site est rentimmo-academy.fr (avec tiret) car les
 * tunnels de vente Systeme.io, les emails déjà envoyés et les liens externes
 * existants pointent vers cette URL. Le domaine rentimmoacademy.fr (sans tiret)
 * a été acheté pour bloquer le squatting et est redirigé vers le canonique.
 *
 * Aussi : www → no-www pour avoir un seul canonique unique.
 */

const REDIRECTS_TO_CANONICAL = new Set([
  // Anti-squat : tout hit sur le sans-tiret (acheté pour bloquer) repart vers le canonique
  "rentimmoacademy.fr",
  "www.rentimmoacademy.fr",
  // Canonical no-www : on uniformise vers rentimmo-academy.fr (sans www)
  "www.rentimmo-academy.fr",
]);

export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();

  if (REDIRECTS_TO_CANONICAL.has(host)) {
    const target = `https://rentimmo-academy.fr${url.pathname}${url.search}`;
    return Response.redirect(target, 301);
  }

  return next();
};
