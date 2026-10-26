"use client";

import { useEffect } from "react";
import { CONSENT_EVENT, CONSENT_KEY, META_PIXEL_ID } from "@/lib/consent";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: unknown;
};

function loadPixel() {
  const w = window as typeof window & { fbq?: Fbq; _fbq?: Fbq };
  if (w.fbq) return;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  w.fbq = fbq;
  w._fbq = fbq;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");
}

/** Charge le Meta Pixel uniquement après un « Accepter » explicite. */
export default function MetaPixel() {
  useEffect(() => {
    const check = () => {
      try {
        if (localStorage.getItem(CONSENT_KEY) === "accept") loadPixel();
      } catch {
        /* stockage indisponible : pas de pixel */
      }
    };
    check();
    window.addEventListener(CONSENT_EVENT, check);
    return () => window.removeEventListener(CONSENT_EVENT, check);
  }, []);
  return null;
}
