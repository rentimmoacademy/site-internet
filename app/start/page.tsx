"use client";

import { ArrowDown, ArrowRight, BadgeCheck, Star } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { Marquee, Motion, StickyCta, Words, delay } from "@/components/motion";
import { trackEvent } from "@/lib/gtag";
import "./start.css";

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

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/rentimmo_academy" },
  { label: "TikTok", href: "https://tiktok.com/@rentimmoacademy" },
  { label: "YouTube", href: "https://youtube.com/@rentimmoacademy" },
];

function CardBody({ p, dark, main }: { p: Path; dark: boolean; main?: boolean }) {
  // Carte Super BNB Academy : identité propre (noir + vert lime), comme la page d'audit.
  const sb = p.id === "super-bnb";
  return (
    <div className="relative flex items-start gap-4">
      <div
        className={`st-emoji flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-[26px] ${dark ? "bg-white/10" : "bg-cream"}`}
        aria-hidden
      >
        {p.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[11.5px] font-extrabold uppercase tracking-[0.06em] ${sb ? "text-lime" : dark ? "text-brand-light" : "text-brand-dark"}`}>{p.eyebrow}</p>
        <h2 className="mt-1 text-[1.05rem] font-extrabold leading-snug">{p.title}</h2>
        <p className={`mt-1.5 text-[13px] leading-relaxed ${dark ? "text-white/65" : "text-ink/60"}`}>{p.sub}</p>
        <span
          className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-bold ${
            sb ? "bg-lime text-ink" : dark ? "bg-brand-green text-ink" : "bg-ink text-white"
          } ${main ? "st-cta-main mo-shine px-5 py-3 text-[14px]" : ""}`}
          {...(main ? { "data-magnetic": "" } : {})}
        >
          {p.cta} <ArrowRight size={14} className="st-arrow" aria-hidden />
        </span>
      </div>
    </div>
  );
}

export default function StartPage() {
  const [main, ...others] = PATHS;

  return (
    <div className="st-root mo-gentle min-h-screen overflow-x-hidden pb-24 text-ink md:pb-0">
      <Motion gentle revealAfter={2600} />

      {/* ── Hero : aurore + portrait + titre mot par mot + preuves (au-dessus de la ligne de flottaison : entrées CSS courtes) ── */}
      <section id="hero" className="relative overflow-hidden">
        <div className="mo-aurora mo-aurora--light" aria-hidden>
          <span className="mo-blob mo-blob--a" />
          <span className="mo-blob mo-blob--b" />
        </div>

        <div className="relative z-[1] mx-auto max-w-xl px-5 pb-7 pt-5 text-center sm:max-w-2xl">
          <header className="mo-enter-fade flex justify-center pb-5">
            <Logo dark />
          </header>

          <div className="st-portrait mo-enter-pop" style={delay(60)}>
            <span className="st-portrait-halo" aria-hidden />
            <span className="st-portrait-ring" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marwan.webp" alt="Marwan AFASSI" width={108} height={108} fetchPriority="high" decoding="async" />
            <span className="st-live">
              <span className="mo-pulse-dot" style={{ width: 6, height: 6 }} aria-hidden /> 🇫🇷 🇲🇦
            </span>
          </div>

          <h1 className="mx-auto mt-5 max-w-xl text-[1.42rem] font-extrabold leading-[1.28] tracking-[-0.015em] text-ink sm:text-[1.65rem]">
            <Words text="Leader francophone de la sous-location professionnelle et de la conciergerie Airbnb depuis" />{" "}
            <span className="st-hl">
              <Words text="plus de 7 ans" start={12} />
            </span>
          </h1>

          <p className="mo-enter mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink/70" style={delay(380)}>
            +697 000€ générés en partant de zéro. Sans riba, sans crédit, sans apport. 🇫🇷 🇲🇦
          </p>
          <p className="mo-enter mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-ink/55" style={delay(450)}>
            Ingénieur de formation, aujourd&apos;hui coach Airbnb · Biens en gestion en France et au Maroc
          </p>

          {/* Preuves : valeurs finales dans le HTML (sans JS / SEO), compteurs animés au chargement */}
          <ul className="mt-5 grid grid-cols-2 gap-2.5 text-left sm:grid-cols-4" aria-label="Chiffres clés">
            <li className="st-proof st-proof--dark mo-enter" style={delay(520)}>
              <span className="st-proof-v">
                <span data-count="697000" data-prefix="+" data-suffix=" €">+697 000 €</span>
              </span>
              <span className="st-proof-l">générés en partant de zéro</span>
            </li>
            <li className="st-proof mo-enter" style={delay(580)}>
              <span className="st-proof-v">
                <span data-count="7" data-prefix="+" data-suffix=" ans">+7 ans</span>
              </span>
              <span className="st-proof-l">d&apos;expérience Airbnb</span>
            </li>
            <li className="st-proof mo-enter" style={delay(640)}>
              <span className="st-proof-v">
                <span data-count="4.93" data-decimals="2" data-suffix="/5">4,93/5</span>
              </span>
              <span className="st-proof-l">
                <Star size={10} className="-mt-0.5 mr-0.5 inline fill-brand-green text-brand-green" aria-hidden />
                sur 1 196 avis Airbnb
              </span>
            </li>
            <li className="st-proof mo-enter" style={delay(700)}>
              <span className="st-proof-v text-brand-dark">
                <BadgeCheck size={22} className="-mt-1 inline" aria-hidden /> QUALIOPI
              </span>
              <span className="st-proof-l">Organisme certifié</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Bandeau noir défilant ── */}
      <div className="bg-ink py-3 text-white">
        <Marquee
          items={MARQUEE}
          speed={32}
          itemClassName="st-marquee-item"
          separator={<span className="mo-pulse-dot" style={{ width: 6, height: 6, margin: "0 22px" }} aria-hidden />}
        />
      </div>

      <main className="mx-auto max-w-xl px-5 pb-14 pt-7">
        {/* ── Choix du chemin ── */}
        <p className="mb-4 flex items-center justify-center gap-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-ink/55" data-reveal="fade">
          Choisis ta situation <ArrowDown size={14} className="st-nudge text-brand-green" aria-hidden />
        </p>

        <div id="situations" className="flex flex-col gap-6" data-stagger="110">
          {/* Carte recommandée : bordure lumineuse qui tourne + bouton magnétique */}
          <div data-reveal="up">
            <div className="st-reco" data-tilt>
              <a
                href={main.href}
                data-card={main.id}
                onClick={() => trackEvent("hub_card_click", { card: main.id })}
                className="mo-borderspin relative p-5 pt-7 sm:p-6 sm:pt-8"
              >
                <span className="st-badge">
                  <span className="mo-pulse-dot" aria-hidden /> Recommandé
                </span>
                <CardBody p={main} dark main />
              </a>
            </div>
          </div>

          {others.map((p) => {
            const dark = true;
            const sb = p.id === "super-bnb";
            return (
              <div key={p.id} data-reveal="up">
                <a
                  href={p.href}
                  data-card={p.id}
                  data-tilt
                  onClick={() => trackEvent("hub_card_click", { card: p.id })}
                  className={`st-card group block rounded-3xl p-5 sm:p-6 ${
                    sb
                      ? "st-card--sb bg-ink text-white shadow-[0_8px_0_#5E8A0A]"
                      : dark
                      ? "st-card--dark bg-ink text-white shadow-[0_8px_0_#1A6B33]"
                      : "st-card--light border border-ink/10 bg-white text-ink shadow-[0_8px_0_rgba(26,26,26,0.1)]"
                  }`}
                >
                  <CardBody p={p} dark={dark} />
                </a>
              </div>
            );
          })}
        </div>

        {/* ── Réseaux ── */}
        <div className="mt-12 text-center" data-reveal="up">
          <p className="mb-3.5 text-xs font-bold uppercase tracking-[0.1em] text-ink/55">Suis-nous</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {SOCIALS.map((s) => (
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
        </div>

        <p className="mt-10 text-center text-[11px] text-ink/50">© {new Date().getFullYear()} Rentimmo Academy</p>
      </main>

      {/* CTA collant mobile : apparaît quand ni le hero ni les cartes ne sont à l'écran */}
      <StickyCta
        watch={["#hero", "#situations"]}
        href={main.href}
        className="st-sticky-btn"
        onClick={() => trackEvent("hub_card_click", { card: main.id, from: "sticky" })}
      >
        {main.cta} <ArrowRight size={16} aria-hidden />
      </StickyCta>
    </div>
  );
}
