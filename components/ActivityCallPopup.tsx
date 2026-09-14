"use client";

import { useEffect, useState } from "react";
import { X, Compass } from "lucide-react";

const COOLDOWN_DAYS = 7;
const SCROLL_THRESHOLD = 0.6;
const CAL_LINK = "https://cal.com/rentimmoacademy/appel-strategique?overlayCalendar=true";

type Activity = "sous-location" | "conciergerie" | "cleaning";

const CONTENT: Record<
  Activity,
  { label: string; headline: string; body: string; question: string; options: string[] }
> = {
  "sous-location": {
    label: "Diagnostic gratuit — 20 min",
    headline: "Tu hésites encore à te lancer en sous-location ?",
    body: "Réponds en 1 clic, on regarde ensemble si c'est fait pour toi. Gratuit, sans engagement.",
    question: "Où en es-tu aujourd'hui ?",
    options: ["Je n'ai pas encore de bien", "J'ai un bien mais ça galère", "Je veux scaler sur plusieurs biens"],
  },
  conciergerie: {
    label: "Diagnostic gratuit — 20 min",
    headline: "La conciergerie Airbnb, c'est fait pour toi ?",
    body: "Réponds en 1 clic, on regarde ensemble si c'est rentable pour toi. Gratuit, sans engagement.",
    question: "Ta situation aujourd'hui ?",
    options: ["Je n'ai pas encore de client", "J'ai 1 à 3 logements en gestion", "Je veux structurer et scaler"],
  },
  cleaning: {
    label: "Diagnostic gratuit — 20 min",
    headline: "Le ménage Airbnb pro, c'est fait pour toi ?",
    body: "Réponds en 1 clic, on regarde ensemble si c'est fait pour toi. Gratuit, sans engagement.",
    question: "Ta situation aujourd'hui ?",
    options: ["Je débute, aucun client", "J'ai déjà quelques clients", "Je veux en faire mon activité principale"],
  },
};

export default function ActivityCallPopup({ activity }: { activity: Activity }) {
  const [visible, setVisible] = useState(false);
  const storageKey = `rentimmo_call_popup_seen_${activity}`;
  const content = CONTENT[activity];

  useEffect(() => {
    function wasRecentlySeen(): boolean {
      const ts = window.localStorage.getItem(storageKey);
      if (!ts) return false;
      return Date.now() - Number(ts) < COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    }

    if (wasRecentlySeen()) return;

    let triggered = false;

    function trigger() {
      if (triggered) return;
      triggered = true;
      setVisible(true);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    }

    function onScroll() {
      const scrolled =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= SCROLL_THRESHOLD) trigger();
    }

    function onMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) trigger();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [storageKey]);

  function markSeen() {
    window.localStorage.setItem(storageKey, String(Date.now()));
  }

  function close() {
    markSeen();
    setVisible(false);
  }

  function selectOption() {
    markSeen();
    setVisible(false);
    window.open(CAL_LINK, "_blank", "noopener,noreferrer");
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
        <button
          onClick={close}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={14} />
        </button>

        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-green/15 text-brand-green ring-1 ring-brand-green/30">
          <Compass size={20} strokeWidth={2.2} />
        </span>

        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] text-brand-green">
          {content.label}
        </p>

        <h3 className="mt-2 text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">
          {content.headline}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-white/65">{content.body}</p>

        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-white/40">
          {content.question}
        </p>

        <div className="mt-3 flex flex-col gap-2">
          {content.options.map((opt) => (
            <button
              key={opt}
              onClick={selectOption}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white/85 transition-colors hover:border-brand-green/40 hover:bg-brand-green/10 hover:text-white"
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          onClick={close}
          className="mt-5 block w-full text-center text-xs text-white/35 hover:text-white/60"
        >
          Pas maintenant
        </button>
      </div>
    </div>
  );
}
