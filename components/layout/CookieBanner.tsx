"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  CONSENT_EVENT,
  CONSENT_KEY as STORAGE_KEY,
  CONSENT_OPEN_EVENT,
  clearTrackingCookies,
} from "@/lib/consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
      } catch {
        setVisible(true);
      }
    }, 600);
    // « Gérer mes cookies » (pied de page) rouvre le bandeau pour modifier le choix.
    const reopen = () => setVisible(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      clearTimeout(t);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  const choose = (v: "accept" | "decline") => {
    let previous: string | null = null;
    try {
      previous = localStorage.getItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* stockage indisponible */
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setVisible(false);
    // Retrait du consentement : on purge les cookies de mesure et on recharge
    // pour décharger GA4 et le pixel déjà actifs dans la page.
    if (v === "decline" && previous === "accept") {
      clearTrackingCookies();
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#0f0f0f]/95 p-5 backdrop-blur-xl md:inset-x-auto md:right-6 md:left-auto md:bottom-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-white/80">
              On utilise des cookies pour mesurer l'audience et améliorer l'expérience.{" "}
              <Link href="/politique-confidentialite" className="underline hover:text-brand-green">
                En savoir plus
              </Link>
              .
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => choose("decline")}
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/70 hover:text-white"
              >
                Refuser
              </button>
              <button
                onClick={() => choose("accept")}
                className="rounded-full bg-brand-gradient px-4 py-2 text-xs font-bold text-white"
              >
                Accepter
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
