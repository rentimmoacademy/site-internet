export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", name, params);
}

/** Événement Meta Pixel (ne fait rien si le pixel n'est pas chargé : pas de consentement). */
export function trackMeta(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { fbq?: (...args: unknown[]) => void };
  w.fbq?.("track", name, params);
}
