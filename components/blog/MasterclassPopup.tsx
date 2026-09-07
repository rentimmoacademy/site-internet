"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, PlayCircle, ArrowRight } from "lucide-react";
import { isMasterclassWatched } from "@/lib/masterclass";

const STORAGE_KEY = "rentimmo_mc_popup_seen";
const COOLDOWN_DAYS = 7;
const SCROLL_THRESHOLD = 0.55; // show after 55% scroll

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

export default function MasterclassPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if masterclass already watched or popup recently dismissed
    if (isMasterclassWatched() || wasRecentlySeen()) return;

    const onScroll = () => {
      const scrolled =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= SCROLL_THRESHOLD) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          <PlayCircle size={20} strokeWidth={2.2} />
        </span>

        {/* Label */}
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] text-brand-green">
          Masterclass gratuite
        </p>

        {/* Headline */}
        <h3 className="mt-2 text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">
          Tu lis ça pour te lancer. La masterclass te donne le système complet.
        </h3>

        {/* Body */}
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          30 min pour comprendre comment lancer ta sous-location professionnelle — de la
          prospection au premier virement. Gratuit, sans inscription.
        </p>

        {/* CTA */}
        <Link
          href="/masterclass"
          onClick={close}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3.5 font-bold text-ink transition-transform hover:scale-[1.02]"
        >
          Visionner la masterclass <ArrowRight size={14} />
        </Link>

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
