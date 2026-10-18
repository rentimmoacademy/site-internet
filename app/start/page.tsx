"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "@/components/layout/Logo";
import { trackEvent } from "@/lib/gtag";

const G = "#2DB84B";
const GD = "#1A6B33";
const INK = "#1A1A1A";
const MUTED = "#6B6B6B";
const CREAM = "#F7F6F2";

/* ── motion: scroll-reveal wrapper (respects prefers-reduced-motion) ── */
function Reveal({
  children,
  delay = 0,
  style = {},
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity .6s cubic-bezier(.23,1,.32,1) ${delay}ms, transform .6s cubic-bezier(.23,1,.32,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

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
    title: "Génère +700€/mois par bien, sans être propriétaire",
    sub: "Masterclass gratuite · Sous-location pro & conciergerie Airbnb",
    cta: "Voir la masterclass gratuite",
    href: "/masterclass",
  },
  {
    id: "super-bnb",
    emoji: "📈",
    eyebrow: "J'ai déjà des biens Airbnb",
    title: "Découvre ce que tu laisses sur la table chaque mois",
    sub: "Audit gratuit de ton annonce en 90 secondes, sans inscription",
    cta: "Auditer mon annonce gratuitement",
    href: "/super-bnb-academy/audit",
  },
  {
    id: "cleaning",
    emoji: "🧹",
    eyebrow: "Je veux monter mon activité ménage",
    title: "Facture tes premiers clients ménage Airbnb en moins de 30 jours",
    sub: "Cleaning BNB Academy · Formation complète, bonus Maroc inclus",
    cta: "Découvrir la formation",
    href: "/formations/cleaning-bnb",
  },
];

export default function StartPage() {
  return (
    <div
      style={{
        background: `
          linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px),
          ${INK}
        `,
        backgroundSize: "40px 40px, 40px 40px, auto",
        minHeight: "100vh",
        fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)",
      }}
    >
      <style>{`
        .hub-card { transition: transform .35s cubic-bezier(.23,1,.32,1), box-shadow .35s cubic-bezier(.23,1,.32,1), border-color .35s; }
        .hub-card:hover { transform: translateY(-4px); box-shadow: 0 18px 36px rgba(45,184,75,.22); border-color: rgba(45,184,75,.5) !important; }
        @keyframes ctaPulse { 0%,100% { box-shadow: 0 10px 24px rgba(45,184,75,.3); } 50% { box-shadow: 0 10px 24px rgba(45,184,75,.3), 0 0 0 8px rgba(45,184,75,.12); } }
        .cta-pulse { animation: ctaPulse 2.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .hub-card, .cta-pulse { animation: none !important; transition: none !important; } .hub-card:hover { transform: none !important; } }
      `}</style>

      {/* ── Header ── */}
      <header style={{ padding: "24px 20px 8px", display: "flex", justifyContent: "center" }}>
        <Logo />
      </header>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px 64px" }}>
        {/* ── Identity block ── */}
        <Reveal>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: "50%",
                margin: "0 auto 18px",
                background: `linear-gradient(135deg, ${G}, ${GD})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "3px solid rgba(255,255,255,.12)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/marwan.jpg"
                alt="Marwan AFASSI"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 800, lineHeight: 1.35, letterSpacing: "-0.01em", margin: "0 0 10px" }}>
              Leader francophone de la sous-location professionnelle et de la conciergerie Airbnb depuis plus de 7 ans
            </h1>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: 15, lineHeight: 1.6, margin: "0 0 14px" }}>
              +697 000€ générés en partant de zéro. Sans riba, sans crédit, sans apport. 🇫🇷 🇲🇦
            </p>
            <p style={{ color: "rgba(255,255,255,.45)", fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>
              Ingénieur de formation, aujourd&apos;hui coach Airbnb · Biens en gestion en France et au Maroc
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(45,184,75,.12)",
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                color: G,
                border: "1px solid rgba(45,184,75,.25)",
                marginTop: 16,
              }}
            >
              ✓ Organisme QUALIOPI
            </div>
          </div>
        </Reveal>

        {/* ── Choix du chemin ── */}
        <Reveal delay={100}>
          <p
            style={{
              color: "rgba(255,255,255,.4)",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              textAlign: "center",
              margin: "40px 0 16px",
            }}
          >
            Choisis ta situation
          </p>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {PATHS.map((p, i) => (
            <Reveal key={p.id} delay={150 + i * 90}>
              <a
                href={p.href}
                onClick={() => trackEvent("hub_card_click", { card: p.id })}
                className="hub-card"
                style={{
                  display: "block",
                  background: "#fff",
                  borderRadius: 18,
                  padding: "22px 22px",
                  border: "1px solid rgba(255,255,255,.08)",
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div
                    style={{
                      fontSize: 26,
                      width: 48,
                      height: 48,
                      flexShrink: 0,
                      borderRadius: 12,
                      background: CREAM,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {p.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: G, fontSize: 11.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>
                      {p.eyebrow}
                    </p>
                    <h2 style={{ color: INK, fontSize: 16.5, fontWeight: 800, lineHeight: 1.35, margin: "0 0 6px" }}>{p.title}</h2>
                    <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.5, margin: "0 0 12px" }}>{p.sub}</p>
                    <span
                      className={i === 0 ? "cta-pulse" : ""}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: G,
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        padding: "9px 16px",
                        borderRadius: 999,
                      }}
                    >
                      {p.cta} →
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* ── Trust bar ── */}
        <Reveal delay={500}>
          <div
            style={{
              marginTop: 40,
              padding: "18px 20px",
              borderRadius: 16,
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)",
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
            }}
          >
            <div>
              <p style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 2px" }}>+7 ans</p>
              <p style={{ color: "rgba(255,255,255,.45)", fontSize: 11, margin: 0 }}>d&apos;expérience</p>
            </div>
            <div>
              <p style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 2px" }}>+697K€</p>
              <p style={{ color: "rgba(255,255,255,.45)", fontSize: 11, margin: 0 }}>générés</p>
            </div>
            <div>
              <p style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 2px" }}>4</p>
              <p style={{ color: "rgba(255,255,255,.45)", fontSize: 11, margin: 0 }}>formations</p>
            </div>
          </div>
        </Reveal>

        {/* ── Réseaux ── */}
        <Reveal delay={580}>
          <div style={{ marginTop: 36, textAlign: "center" }}>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>
              Suis-nous
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
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
                  style={{
                    color: "rgba(255,255,255,.7)",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "9px 16px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,.15)",
                    textDecoration: "none",
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,.25)", fontSize: 11, marginTop: 40 }}>
          © {new Date().getFullYear()} Rentimmo Academy
        </p>
      </main>
    </div>
  );
}
