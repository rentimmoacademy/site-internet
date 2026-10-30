"use client";

import { MotionConfig } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import Logo from "@/components/layout/Logo";
import Highlight from "@/components/ui/Highlight";
import Reveal from "@/components/ui/Reveal";
import { useReducedMotionAfterMount } from "@/lib/useReducedMotionAfterMount";
import { trackEvent } from "@/lib/gtag";

type Path = {
  id: string;
  emoji: string;
  eyebrow: string;
  title: string;
  sub: string;
  cta: string;
  href: string;
};

const PATHS: Path[] = [
  {
    id: "sous-location",
    emoji: "🏘️",
    eyebrow: "Je pars de zéro",
    title: "Lance ta sous-location ou ta conciergerie Airbnb, sans être propriétaire",
    sub: "Masterclass gratuite · Sous-location pro & conciergerie Airbnb",
    cta: "Voir la masterclass gratuite",
    href: "/masterclass",
  },
  {
    id: "super-bnb",
    emoji: "📈",
    eyebrow: "J'ai déjà des biens Airbnb",
    title: "Découvre ce que tu laisses sur la table chaque mois",
    sub: "Audit gratuit de ton annonce en 90 secondes, sans carte bancaire",
    cta: "Auditer mon annonce gratuitement",
    href: "/super-bnb-academy/audit",
  },
  {
    id: "cleaning",
    emoji: "🧹",
    eyebrow: "Je veux monter mon activité ménage",
    title: "Monte ton activité de ménage Airbnb et décroche tes premiers clients",
    sub: "Cleaning BNB Academy · Formation complète, bonus Maroc inclus",
    cta: "Voir la présentation gratuite",
    href: "/cleaning",
  },
];

// Bandeau défilant : noms des programmes (repris de la description de la page).
const MARQUEE = ["Sous-location professionnelle", "Conciergerie Airbnb", "Ménage BNB", "Super BNB Academy", "Organisme QUALIOPI", "🇫🇷 🇲🇦"];

export default function StartPage() {
  const reduce = useReducedMotionAfterMount();

  return (
    <MotionConfig reducedMotion={reduce ? "always" : "never"}>
      <div className="min-h-screen overflow-x-hidden text-ink">
        {/* ── Header ── */}
        <header className="flex justify-center px-5 pb-2 pt-6">
          <Logo dark />
        </header>

        {/* ── Identité (LCP : jamais en opacité 0) ── */}
        <section className="mx-auto max-w-xl px-5 pb-8 pt-6 text-center">
          <div className="mx-auto mb-5 h-[92px] w-[92px] overflow-hidden rounded-full bg-brand-gradient ring-4 ring-white shadow-[0_6px_0_#1A6B33]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marwan.jpg" alt="Marwan AFASSI" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-[1.4rem] font-extrabold leading-[1.3] tracking-[-0.015em] text-ink sm:text-[1.6rem]">
            Leader francophone de la sous-location professionnelle et de la conciergerie Airbnb depuis <Highlight>plus de 7 ans</Highlight>
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
            +697 000€ générés en partant de zéro. Sans riba, sans crédit, sans apport. 🇫🇷 🇲🇦
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink/55">
            Ingénieur de formation, aujourd&apos;hui coach Airbnb · Biens en gestion en France et au Maroc
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-xs font-bold text-ink/75">
            <BadgeCheck size={14} className="text-brand-dark" /> Organisme QUALIOPI
          </span>
        </section>

        {/* ── Bandeau noir défilant ── */}
        <div className="overflow-hidden bg-ink py-3 text-white" aria-hidden>
          <div className="flex w-max animate-marquee motion-reduce:animate-none">
            {[0, 1].map((k) => (
              <div key={k} className="flex shrink-0 items-center">
                {[...MARQUEE, ...MARQUEE].map((m, i) => (
                  <span key={i} className="flex items-center whitespace-nowrap px-4 text-[13px] font-bold uppercase tracking-[0.12em] text-white/85">
                    {m}
                    <span className="ml-8 h-1.5 w-1.5 rounded-full bg-brand-green" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <main className="mx-auto max-w-xl px-5 pb-14 pt-10">
          {/* ── Choix du chemin ── */}
          <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.14em] text-ink/55">Choisis ta situation</p>

          <div className="flex flex-col gap-5">
            {PATHS.map((p, i) => {
              const dark = i !== 1;
              return (
                <Reveal key={p.id} index={i}>
                  <a
                    href={p.href}
                    onClick={() => trackEvent("hub_card_click", { card: p.id })}
                    className={`group block rounded-3xl p-5 transition-all duration-500 hover:-translate-y-1.5 sm:p-6 ${
                      dark
                        ? "bg-ink text-white shadow-[0_8px_0_#1A6B33] hover:shadow-[0_12px_0_#2DB84B]"
                        : "border border-ink/10 bg-white text-ink shadow-[0_8px_0_rgba(26,26,26,0.1)] hover:border-brand-green/40 hover:shadow-[0_12px_0_#2DB84B]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-[26px] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${
                          dark ? "bg-white/10" : "bg-cream"
                        }`}
                      >
                        {p.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[11.5px] font-extrabold uppercase tracking-[0.06em] ${dark ? "text-brand-light" : "text-brand-dark"}`}>
                          {p.eyebrow}
                        </p>
                        <h2 className="mt-1 text-[1.05rem] font-extrabold leading-snug">{p.title}</h2>
                        <p className={`mt-1.5 text-[13px] leading-relaxed ${dark ? "text-white/65" : "text-ink/60"}`}>{p.sub}</p>
                        <span
                          className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-bold transition-all duration-300 group-hover:gap-2.5 ${
                            dark ? "bg-brand-green text-ink" : "bg-ink text-white"
                          }`}
                        >
                          {p.cta} <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </a>
                </Reveal>
              );
            })}
          </div>

          {/* ── Trust bar ── */}
          <Reveal className="mt-10">
            <div className="flex justify-around rounded-3xl border border-ink/10 bg-white px-5 py-5 text-center shadow-[0_6px_0_rgba(26,26,26,0.06)]">
              {[
                { v: "+7 ans", l: "d'expérience" },
                { v: "+697K€", l: "générés" },
                { v: "4", l: "formations" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-lg font-extrabold text-ink">{s.v}</p>
                  <p className="text-[11px] text-ink/55">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* ── Réseaux ── */}
          <Reveal className="mt-9 text-center">
            <p className="mb-3.5 text-xs font-bold uppercase tracking-[0.1em] text-ink/55">Suis-nous</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {[
                { label: "Instagram", href: "https://instagram.com/rentimmo_academy" },
                { label: "TikTok", href: "https://tiktok.com/@rentimmoacademy" },
                { label: "YouTube", href: "https://youtube.com/@rentimmoacademy" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("hub_social_click", { network: s.label })}
                  className="rounded-full border border-ink/15 bg-white px-4 py-2.5 text-[13px] font-semibold text-ink/80 transition-all hover:-translate-y-0.5 hover:border-ink hover:text-ink"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>

          <p className="mt-10 text-center text-[11px] text-ink/50">© {new Date().getFullYear()} Rentimmo Academy</p>
        </main>
      </div>
    </MotionConfig>
  );
}
