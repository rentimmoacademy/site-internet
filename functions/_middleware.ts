/**
 * Cloudflare Pages middleware — 301 redirect des anciens domaines vers le canonique.
 *
 * Tous les hits sur rentimmo-academy.fr (avec tiret, ancien domaine) sont redirigés
 * vers rentimmoacademy.fr (sans tiret, nouveau brand-aligned canonique) en
 * conservant le path et la query string, ce qui transfère le SEO juice et préserve
 * tous les liens externes/sociaux existants.
 */
export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();

  // Hosts à rediriger vers le canonique
  const LEGACY_HOSTS = new Set([
    "rentimmo-academy.fr",
    "www.rentimmo-academy.fr",
  ]);

  if (LEGACY_HOSTS.has(host)) {
    const target = `https://rentimmoacademy.fr${url.pathname}${url.search}`;
    return Response.redirect(target, 301);
  }

  // Sur le canonique : si quelqu'un arrive sur www.rentimmoacademy.fr, on redirige aussi
  // vers la version sans www (canonique unique = rentimmoacademy.fr)
  if (host === "www.rentimmoacademy.fr") {
    const target = `https://rentimmoacademy.fr${url.pathname}${url.search}`;
    return Response.redirect(target, 301);
  }

  // Tout le reste : on sert le static asset normal
  return next();
};
