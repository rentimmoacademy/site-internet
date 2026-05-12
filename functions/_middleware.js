/**
 * Cloudflare Pages middleware — 301 redirect + canonical normalization.
 *
 * Nouveau canonique : www.rentimmoacademy.fr (sans tiret, avec www).
 * Tous les anciens domaines (rentimmo-academy.fr, www.rentimmo-academy.fr,
 * rentimmoacademy.fr sans www) redirigent en 301 vers le canonique.
 * Les liens et emails existants continuent de fonctionner via la redirection.
 */

const REDIRECTS_TO_CANONICAL = new Set([
  // Ancien canonique (avec tiret) — liens existants Systeme.io, emails, etc.
  "rentimmo-academy.fr",
  "www.rentimmo-academy.fr",
  // Non-www du nouveau domaine → on uniformise vers www
  "rentimmoacademy.fr",
]);

export const onRequest = async ({ request, next }) => {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();

  if (REDIRECTS_TO_CANONICAL.has(host)) {
    const target = `https://www.rentimmoacademy.fr${url.pathname}${url.search}`;
    return Response.redirect(target, 301);
  }

  return next();
};
