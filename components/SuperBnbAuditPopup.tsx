"use client";

import { useEffect, useState } from "react";
import { X, TrendingUp, ArrowRight } from "lucide-react";

const STORAGE_KEY = "rentimmo_sba_popup_seen";
const COOLDOWN_DAYS = 7;
const SCROLL_THRESHOLD = 0.70;

function wasRecentlySeen(): boolean {
  if (typeof window === "undefined") return false;
  const ts = window.localStorage.getItem(STORAGE_KEY);
  if (!ts) return false;
  return Date.now() - Number(ts) < COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
}

function markSeen() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

export default function SuperBnbAuditPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (wasRecentlySeen()) return;

    let triggered = false;

    function trigger() {
      if (triggered) return;
      triggered = true;
      setVisible(true);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    }

    // Scroll trigger (mobile + desktop)
    function onScroll() {
      const scrolled =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= SCROLL_THRESHOLD) trigger();
    }

    // Exit-intent trigger (desktop only)
    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) trigger();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  function close() {
    markSeen();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0F1113] p-7 text-white shadow-2xl sm:p-9"
      >
        {/* Close */}
        <button
          onClick={close}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={14} />
        </button>

        {/* Icon */}
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-green/15 text-brand-green ring-1 ring-brand-green/30">
          <TrendingUp size={20} strokeWidth={2.2} />
        </span>

        {/* Label */}
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] text-brand-green">
          Audit gratuit — 30 min
        </p>

        {/* Headline */}
        <h3 className="mt-2 text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">
          Ton annonce perd probablement des réservations chaque semaine.
        </h3>

        {/* Body */}
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          On analyse ton annonce Airbnb en 30 min : pricing, texte, photos, positionnement.
          Tu repars avec un plan d&apos;action concret. C&apos;est gratuit.
        </p>

        {/* CTA */}
        <a
          href="https://cal.com/rentimmoacademy/superbnbacademy"
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3.5 font-bold text-ink transition-transform hover:scale-[1.02]"
        >
          Réserver mon audit gratuit <ArrowRight size={14} />
        </a>

        <button
          onClick={close}
          className="mt-3 block w-full text-center text-xs text-white/35 hover:text-white/60"
        >
          Pas maintenant
        </button>
      </div>
    </div>
  );
}
