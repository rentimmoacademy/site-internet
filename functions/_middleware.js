/**
 * Cloudflare Pages middleware — 301 redirect des anciens domaines vers le canonique.
 *
 * Tous les hits sur rentimmo-academy.fr (avec tiret, ancien domaine) sont redirigés
 * vers rentimmoacademy.fr (sans tiret, nouveau brand-aligned canonique) en
 * conservant le path et la query string, ce qui transfère le SEO juice et préserve
 * tous les liens externes/sociaux existants.
 *
 * Aussi : www.rentimmoacademy.fr → 301 → rentimmoacademy.fr (canonical no-www).
 */

const LEGACY_HOSTS = new Set([
  "rentimmo-academy.fr",
  "www.rentimmo-academy.fr",
  "www.rentimmoacademy.fr",
]);

export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();

  if (LEGACY_HOSTS.has(host)) {
    const target = `https://rentimmoacademy.fr${url.pathname}${url.search}`;
    return Response.redirect(target, 301);
  }

  return next();
};
