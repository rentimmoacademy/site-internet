"use client";

import { useEffect } from "react";
import { CONSENT_EVENT, CONSENT_KEY, GA_MEASUREMENT_ID } from "@/lib/consent";

function loadGa() {
  const w = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __gaLoaded?: boolean;
  };
  if (w.__gaLoaded) return;
  w.__gaLoaded = true;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  };
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
  w.gtag("js", new Date());
  w.gtag("config", GA_MEASUREMENT_ID);
}

/** Charge GA4 uniquement après un « Accepter » explicite (même règle que le Meta Pixel).
 *  Tant que le consentement n'est pas donné, window.gtag n'existe pas : trackEvent() ne fait rien. */
export default function GoogleAnalytics() {
  useEffect(() => {
    const check = () => {
      try {
        if (localStorage.getItem(CONSENT_KEY) === "accept") loadGa();
      } catch {
        /* stockage indisponible : pas de mesure */
      }
    };
    check();
    window.addEventListener(CONSENT_EVENT, check);
    return () => window.removeEventListener(CONSENT_EVENT, check);
  }, []);
  return null;
}
