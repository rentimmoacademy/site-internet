export const CONSENT_KEY = "rentimmo-cookie-consent";
export const CONSENT_EVENT = "rentimmo-consent-change";
// Réouverture du bandeau depuis « Gérer mes cookies » (pied de page)
export const CONSENT_OPEN_EVENT = "rentimmo-consent-open";
// Ensemble de données Meta « Rentimmo Academy Site » (portefeuille rentimmoacademy)
export const META_PIXEL_ID = "2465443193982864";
// Flux de données GA4
export const GA_MEASUREMENT_ID = "G-WY1G6J0NTL";

/** Supprime les cookies de mesure (GA4, Meta) posés avant un refus. */
export function clearTrackingCookies() {
  if (typeof document === "undefined") return;
  const host = window.location.hostname;
  const parts = host.split(".");
  const domains = [host, `.${host}`];
  if (parts.length >= 2) domains.push(`.${parts.slice(-2).join(".")}`);
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)) {
      domains.forEach((d) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
      });
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  });
}
