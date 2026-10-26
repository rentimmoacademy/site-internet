"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "@/components/layout/Logo";
import { trackEvent, trackMeta } from "@/lib/gtag";

const BULLETS = [
  "La méthode pour trouver et négocier un bail commercial en moins de 14 jours",
  "Le calcul de rentabilité que j'utilise en 90 secondes pour valider un appart",
  "Le modèle 100% halal que j'applique depuis 7 ans — zéro riba",
  "Ma stack tech pour gérer plusieurs logements sans répondre aux clients à 3h du matin",
  "Pas le budget pour te lancer en sous-location ? La conciergerie permet de démarrer à 0€ d'apport, avec un objectif réaliste d'un SMIC/mois dès ton 1er client",
];

const TESTIMONIALS = [
  { name: "Khadija", meta: "Maman de 7 enfants · lancée en sous-location", videoId: "7Dz1QpJ1Cvg" },
  { name: "Yassine", meta: "Son 1er logement loué en 30 jours", videoId: "GhY7Sna98l4" },
  { name: "Aïcha", meta: "Reconversion e-commerce → sous-location halal", videoId: "2zvz4WngAtU" },
];

const FAQ = [
  { q: "C'est vraiment gratuit ?", a: "Oui, 100%. Aucune carte bancaire demandée. Tu accèdes à la masterclass immédiatement après ton inscription." },
  { q: "Pourquoi tu me demandes mon WhatsApp ?", a: "Pour t'envoyer la masterclass et les bonus directement en privé, et répondre à tes questions si tu en as pendant le visionnage." },
  { q: "C'est fait pour moi si je n'ai pas d'expérience ?", a: "Oui. Beaucoup de nos apprenants partent de zéro. On évalue ta situation précisément lors de l'appel stratégique pour te recommander le modèle le plus adapté — sous-location ou conciergerie." },
];

const G = "#2DB84B";
const GD = "#1A6B33";
const INK = "#1A1A1A";
const MUTED = "#6B6B6B";
const CREAM = "#F7F6F2";

/* ── motion: scroll-reveal wrapper (respects prefers-reduced-motion) ── */
function Reveal({ children, delay = 0, style = {}, className = "" }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string }) {
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

/* ── motion: count-up stat (respects prefers-reduced-motion) ── */
function CountUp({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    let started = false;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const duration = 1100;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

export default function MasterclassPage() {
  const [step, setStep] = useState<"form" | "video">("form");
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [showSticky, setShowSticky] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const formCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step !== "form") return;
    const onScroll = () => setShowSticky(window.scrollY > 520);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [step]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const firstName = (fd.get("firstName") as string || "").trim();
    const email = (fd.get("email") as string || "").trim();
    const phone = (fd.get("phone") as string || "").trim();

    const next: Record<string, string> = {};
    if (!firstName) next.firstName = "Prénom requis pour personnaliser ton accès";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Format invalide. Vérifie ex : prenom@email.com";
    if ((phone.match(/\d/g) || []).length < 8) next.phone = "Numéro incomplet. Vérifie ton numéro WhatsApp (ex : +33 6 12 34 56 78)";
    if (Object.keys(next).length) {
      setErrs(next);
      const order = ["firstName", "email", "phone"];
      const firstKey = order.find((k) => next[k]);
      if (firstKey) inputRefs.current[firstKey]?.focus();
      return;
    }
    setErrs({});
    setLoading(true);

    const source = new URLSearchParams(window.location.search).get("src") || "direct";
    try {
      const r = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, phone, source }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErrs({ global: data.message || "Une erreur est survenue. Réessaie dans une minute." });
        setLoading(false);
        return;
      }
      sessionStorage.setItem("rentimmo_lead_email", email);
      sessionStorage.setItem("rentimmo_lead_firstName", firstName);
      trackEvent("masterclass_optin", { source });
      trackMeta("Lead", { content_name: "masterclass", source });
      setStep("video");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrs({ global: "Erreur réseau. Vérifie ta connexion et réessaie." });
      setLoading(false);
    }
  }

  /* ── shared topbar ── */
  const Topbar = () => (
    <header style={{ background: "rgba(26,26,26,.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,.08)", padding: "13px 24px", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo />
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.08)", padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, border: "1px solid rgba(255,255,255,.14)", color: "rgba(255,255,255,.8)" }}>
          <span style={{ color: G }}>✓</span> Organisme QUALIOPI
        </div>
      </div>
    </header>
  );

  if (step === "video") return (
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
        @keyframes ctaPulse { 0%,100% { box-shadow: 0 12px 28px rgba(45,184,75,.35); } 50% { box-shadow: 0 12px 28px rgba(45,184,75,.35), 0 0 0 10px rgba(45,184,75,.14); } }
        .cta-pulse { animation: ctaPulse 2.6s ease-in-out infinite; }
        .btn-lift { transition: transform .35s cubic-bezier(.23,1,.32,1), box-shadow .35s cubic-bezier(.23,1,.32,1); }
        .btn-lift:hover { transform: translateY(-3px); box-shadow: 0 18px 36px rgba(45,184,75,.4); }
        @media (prefers-reduced-motion: reduce) { .cta-pulse, .btn-lift { animation: none !important; transition: none !important; } .btn-lift:hover { transform: none !important; } }
        @media (max-width: 767px) {
          .mc-video-section { padding: 28px 16px 56px !important; }
          .mc-video-section h1 { font-size: 22px !important; }
          .mc-video-section p { font-size: 15px !important; }
          .mc-video-cta { padding: 20px 16px !important; }
          .mc-video-cta a { font-size: 15px !important; padding: 16px 18px !important; }
        }
      `}</style>
      <Topbar />
      <section className="mc-video-section" style={{ padding: "56px 24px 80px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,184,75,.12)", color: G, padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 24 }}>
            ▶ Accès débloqué — Masterclass offerte
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-.025em", marginBottom: 12 }}>
            Génère tes premiers revenus Airbnb <span style={{ color: G }}>avec la méthode qui a généré +697K€ sur Airbnb.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 17, marginBottom: 32 }}>Lance la vidéo et prends des notes — chaque minute compte.</p>
        </div>

        <div style={{ maxWidth: 980, margin: "0 auto 48px", borderRadius: 24, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.55)", aspectRatio: "16/9" }}>
          <iframe src="https://www.youtube.com/embed/Hku4kW4_ijY?rel=0&modestbranding=1&controls=1&playsinline=1&autoplay=1" title="Masterclass Rentimmo Academy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
        </div>

        <div className="mc-video-cta" style={{ maxWidth: 640, margin: "0 auto", background: `rgba(45,184,75,.08)`, border: `1px solid rgba(45,184,75,.25)`, borderRadius: 24, padding: "clamp(24px,5vw,40px) clamp(18px,5vw,32px)", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📞</div>
          <h2 style={{ color: "#fff", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, marginBottom: 12, letterSpacing: "-.02em" }}>Tu veux passer à l'action ?</h2>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 16, marginBottom: 28 }}>Réserve 45 min avec Marwan. On analyse ta situation et on voit si la formation peut t'accompagner.</p>
          <a href="https://cal.com/rentimmoacademy/appel-strategique" target="_blank" rel="noopener noreferrer" className="cta-pulse btn-lift" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "18px 28px", background: `linear-gradient(135deg,${GD},${G})`, color: "#fff", borderRadius: 14, fontWeight: 800, fontSize: "clamp(15px,2.5vw,17px)", textDecoration: "none", boxShadow: "0 12px 28px rgba(45,184,75,.35)", textAlign: "center" as const }}>
            Réserver mon appel stratégique offert →
          </a>
          <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, marginTop: 14 }}>45 min · 0€ · Sans engagement</p>
        </div>
      </section>
      <footer style={{ padding: "28px 24px", background: "#111", color: "rgba(255,255,255,.45)", textAlign: "center", fontSize: 13 }}>
        <strong style={{ color: "#fff" }}>Rentimmo Academy</strong> · Marwan AFASSI · Organisme certifié QUALIOPI · © 2026
      </footer>
    </div>
  );

  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", color: INK }}>
      <style>{`
        @keyframes ctaPulse { 0%,100% { box-shadow: 0 12px 28px rgba(45,184,75,.3); } 50% { box-shadow: 0 12px 28px rgba(45,184,75,.3), 0 0 0 10px rgba(45,184,75,.12); } }
        @keyframes shakeX { 10%,90% { transform: translateX(-1px); } 20%,80% { transform: translateX(2px); } 30%,50%,70% { transform: translateX(-4px); } 40%,60% { transform: translateX(4px); } }
        @keyframes heroIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .cta-pulse { animation: ctaPulse 2.6s ease-in-out infinite; }
        .input-error { animation: shakeX .4s; }
        .hero-in { animation: heroIn .7s cubic-bezier(.23,1,.32,1) both; }
        .btn-lift { transition: transform .35s cubic-bezier(.23,1,.32,1), box-shadow .35s cubic-bezier(.23,1,.32,1); }
        .btn-lift:hover { transform: translateY(-3px); box-shadow: 0 18px 36px rgba(45,184,75,.4); }
        @media (prefers-reduced-motion: reduce) {
          .cta-pulse, .input-error, .hero-in, .btn-lift { animation: none !important; transition: none !important; }
          .btn-lift:hover { transform: none !important; }
        }
        .sticky-cta-mobile { display: none; }
        @media (max-width: 767px) {
          .mc-hero-section { padding: 28px 16px 48px !important; }
          .mc-hero-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .mc-hero-grid > div:first-child h1 { font-size: 26px !important; }
          .mc-form-card { padding: 20px 16px !important; border-radius: 18px !important; }
          .mc-form-card h2 { font-size: 20px !important; }
          .mc-form-card button { font-size: 15px !important; padding: 16px 18px !important; }
          .mc-trust-bar { padding: 18px 16px !important; gap: 16px !important; }
          .mc-testimonials-section { padding: 48px 16px !important; }
          .mc-second-cta { padding: 44px 16px !important; }
          .mc-faq-section { padding: 48px 16px !important; }
          .sticky-cta-mobile { display: flex !important; }
          body { padding-bottom: 72px; }
        }
      `}</style>
      <Topbar />

      {/* HERO + FORM */}
      <section
        className="mc-hero-section hero-in"
        style={{
          padding: "56px 24px 72px",
          position: "relative",
          overflow: "hidden",
          backgroundColor: INK,
          backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px, 40px 40px",
        }}
      >
        <div style={{ pointerEvents: "none", position: "absolute", left: "50%", top: -140, transform: "translateX(-50%)", width: 640, height: 640, borderRadius: "50%", background: "rgba(45,184,75,.15)", filter: "blur(140px)" }} />
        <div className="mc-hero-grid" style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center", position: "relative" }}>

          {/* LEFT */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,184,75,.14)", color: G, padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 22 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: G, boxShadow: `0 0 0 4px rgba(45,184,75,.2)`, display: "inline-block" }} />
              Masterclass offerte · accès immédiat
            </div>
            <h1 style={{ fontSize: "clamp(28px,4.2vw,48px)", lineHeight: 1.06, letterSpacing: "-.025em", fontWeight: 800, marginBottom: 18, color: "#fff" }}>
              Sous-location &amp; conciergerie Airbnb :{" "}
              <span style={{ background: "linear-gradient(180deg,transparent 58%,rgba(45,184,75,.5) 58%)", padding: "0 4px" }}>
                la méthode que j'applique depuis 7 ans
              </span>
            </h1>
            <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: "rgba(255,255,255,.65)", marginBottom: 26, lineHeight: 1.6 }}>
              Une méthode terrain, halal-friendly, testée sur +697K€ générés sur Airbnb, en France et à l'étranger.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 11 }}>
              {BULLETS.map((b) => (
                <li key={b} style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 15, color: "rgba(255,255,255,.85)", fontWeight: 500 }}>
                  <span style={{ flexShrink: 0, width: 22, height: 22, background: G, color: "#fff", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, marginTop: 1 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Social proof mini */}
            <div style={{ display: "flex", gap: 20, marginTop: 28, padding: "18px 0", borderTop: "1px solid rgba(255,255,255,.12)", flexWrap: "wrap" as const }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: G }}><CountUp to={7} prefix="+" suffix=" ans" /></div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>d'expérience</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: G }}><CountUp to={697} prefix="+" suffix="K€" /></div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>générés sur Airbnb</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: G }}>QUALIOPI</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>certifié</div>
              </div>
            </div>
          </div>

          {/* FORM CARD */}
          <div ref={formCardRef} className="mc-form-card" style={{ background: "#fff", borderRadius: 24, padding: "36px 32px", boxShadow: "0 40px 80px rgba(26,107,51,.18)", border: "1px solid rgba(26,107,51,.07)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg,${GD},${G})` }} />
            <div style={{ display: "inline-block", background: "rgba(45,184,75,.12)", color: GD, padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 14 }}>
              Accès offert · 0€
            </div>
            <h2 style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 6, lineHeight: 1.2, color: INK }}>Reçois ta masterclass maintenant</h2>
            <p style={{ color: MUTED, fontSize: 14, marginBottom: 22 }}>Renseigne tes infos. Tu accèdes à la vidéo dans 10 secondes.</p>

            <form onSubmit={handleSubmit} noValidate>
              {[
                { name: "firstName", label: "Prénom", type: "text", placeholder: "Ton prénom", ac: "given-name" },
                { name: "email", label: "Email", type: "email", placeholder: "ton@email.com", ac: "email" },
              ].map(({ name, label, type, placeholder, ac }) => (
                <div key={name} style={{ marginBottom: 13 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#2D2D2D", marginBottom: 5 }}>{label}</label>
                  <input
                    ref={(el) => { inputRefs.current[name] = el; }}
                    name={name} type={type} placeholder={placeholder} autoComplete={ac}
                    className={errs[name] ? "input-error" : ""}
                    aria-invalid={!!errs[name]}
                    style={{ width: "100%", padding: "13px 15px", border: `1.5px solid ${errs[name] ? "#DC2626" : "rgba(26,26,26,.13)"}`, borderRadius: 12, fontFamily: "inherit", fontSize: 15, color: INK, background: CREAM, boxSizing: "border-box" as const }} />
                  {errs[name] && <p role="alert" aria-live="polite" style={{ color: "#DC2626", fontSize: 11, marginTop: 3, fontWeight: 600 }}>{errs[name]}</p>}
                </div>
              ))}

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#2D2D2D", marginBottom: 5 }}>
                  📱 WhatsApp <span style={{ color: MUTED, fontWeight: 400, fontSize: 11 }}>(je t'envoie la masterclass + bonus en privé)</span>
                </label>
                <input
                  ref={(el) => { inputRefs.current.phone = el; }}
                  name="phone" type="tel" placeholder="+33 6 12 34 56 78" autoComplete="tel"
                  className={errs.phone ? "input-error" : ""}
                  aria-invalid={!!errs.phone}
                  style={{ width: "100%", padding: "13px 15px", border: `1.5px solid ${errs.phone ? "#DC2626" : "rgba(26,26,26,.13)"}`, borderRadius: 12, fontFamily: "inherit", fontSize: 15, color: INK, background: CREAM, boxSizing: "border-box" as const }} />
                {errs.phone && <p role="alert" aria-live="polite" style={{ color: "#DC2626", fontSize: 11, marginTop: 3, fontWeight: 600 }}>{errs.phone}</p>}
              </div>

              {errs.global && (
                <div role="alert" style={{ background: "rgba(220,38,38,.07)", border: "1px solid rgba(220,38,38,.22)", borderRadius: 11, padding: "11px 15px", color: "#DC2626", fontSize: 13, marginBottom: 14 }}>{errs.global}</div>
              )}

              <button type="submit" disabled={loading} className={loading ? "" : "cta-pulse btn-lift"} style={{ width: "100%", padding: "19px 24px", background: `linear-gradient(135deg,${GD},${G})`, color: "#fff", border: 0, borderRadius: 13, fontFamily: "inherit", fontWeight: 800, fontSize: 17, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .7 : 1, boxShadow: "0 12px 28px rgba(45,184,75,.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {loading ? "⏳ Préparation de ton accès…" : "🎁 J'accède à la masterclass maintenant →"}
              </button>

              <div style={{ display: "flex", gap: 12, marginTop: 14, justifyContent: "center", fontSize: 12, color: MUTED, flexWrap: "wrap" as const }}>
                {["0€ · gratuit", "Infos protégées", "Désinscription en 1 clic"].map((t) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ color: G, fontWeight: 900 }}>✓</span> {t}</span>
                ))}
              </div>
              <p style={{ fontSize: 11, color: MUTED, textAlign: "center" as const, marginTop: 10, lineHeight: 1.5 }}>
                En validant, tu acceptes de recevoir la masterclass et des messages de Rentimmo Academy par email et WhatsApp. Désinscription possible à tout moment.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <Reveal>
        <div className="mc-trust-bar" style={{ background: "#fff", padding: "22px 24px", borderTop: "1px solid rgba(26,26,26,.06)", borderBottom: "1px solid rgba(26,26,26,.06)" }}>
          <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: 32 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: GD, letterSpacing: "-.02em" }}><CountUp to={7} prefix="+" suffix=" ans" /></div>
              <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600, marginTop: 2 }}>d'expérience terrain</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: GD, letterSpacing: "-.02em" }}><CountUp to={697} prefix="+" suffix="K€" /></div>
              <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600, marginTop: 2 }}>générés sur Airbnb</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: GD, letterSpacing: "-.02em" }}>FR + 🌍</div>
              <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600, marginTop: 2 }}>France et étranger</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: GD, letterSpacing: "-.02em" }}>QUALIOPI</div>
              <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600, marginTop: 2 }}>organisme certifié</div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* TESTIMONIALS */}
      <section className="mc-testimonials-section" style={{ padding: "64px 24px", background: CREAM }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, letterSpacing: "-.025em", textAlign: "center", marginBottom: 10 }}>Ils sont passés à l'action</h2>
          </Reveal>
          <Reveal delay={80}>
            <p style={{ textAlign: "center", color: MUTED, fontSize: 16, marginBottom: 44 }}>Témoignages vidéo réels de la communauté Rentimmo Academy — clique pour regarder</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t, idx) => (
              <Reveal key={t.name} delay={idx * 100}>
                <a
                  href={`https://www.youtube.com/watch?v=${t.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "inherit", display: "block", background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 24px rgba(26,107,51,.08)" }}
                >
                  <div style={{ position: "relative", aspectRatio: "16/9", background: INK }}>
                    <img
                      src={`https://img.youtube.com/vi/${t.videoId}/hqdefault.jpg`}
                      alt={`Témoignage vidéo de ${t.name}`}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.25)" }}>
                      <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,.92)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: GD }}>▶</div>
                    </div>
                  </div>
                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ color: G, marginBottom: 6, fontSize: 13 }}>★ ★ ★ ★ ★</div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{t.meta}</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MICRO-FAQ / OBJECTIONS */}
      <section className="mc-faq-section" style={{ padding: "60px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(20px,2.6vw,28px)", fontWeight: 800, letterSpacing: "-.02em", textAlign: "center", marginBottom: 32 }}>Tes questions, nos réponses</h2>
          </Reveal>
          <div style={{ display: "grid", gap: 14 }}>
            {FAQ.map((f, idx) => (
              <Reveal key={f.q} delay={idx * 90}>
                <div style={{ background: CREAM, border: "1px solid rgba(26,26,26,.06)", borderRadius: 16, padding: "20px 22px" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: INK }}>{f.q}</div>
                  <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{f.a}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECOND CTA */}
      <Reveal>
        <section className="mc-second-cta" style={{ padding: "56px 24px", background: INK, textAlign: "center" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 style={{ color: "#fff", fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, marginBottom: 12, letterSpacing: "-.02em" }}>Tu hésites encore ?<br />Inscris-toi, c'est gratuit.</h2>
            <p style={{ color: "rgba(255,255,255,.6)", marginBottom: 28, fontSize: 16 }}>
              0€ · aucun engagement · tu peux accéder à la masterclass maintenant et décider ensuite.
            </p>
            <button onClick={() => formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} className="cta-pulse btn-lift" style={{ padding: "18px 36px", background: "#fff", color: GD, border: 0, borderRadius: 13, fontFamily: "inherit", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 12px 32px rgba(0,0,0,.18)" }}>
              ↑ Accéder à la masterclass gratuite
            </button>
          </div>
        </section>
      </Reveal>

      <footer style={{ padding: "28px 24px", background: "#111", color: "rgba(255,255,255,.45)", textAlign: "center", fontSize: 13 }}>
        <strong style={{ color: "#fff" }}>Rentimmo Academy</strong> · Marwan AFASSI · Organisme certifié QUALIOPI · © 2026
      </footer>

      {/* STICKY MOBILE CTA */}
      <div
        className="sticky-cta-mobile"
        style={{
          position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 60,
          padding: "12px 16px",
          background: "#fff",
          borderTop: "1px solid rgba(26,26,26,.08)",
          boxShadow: "0 -8px 24px rgba(0,0,0,.1)",
          transform: showSticky ? "translateY(0)" : "translateY(100%)",
          transition: "transform .3s ease",
        }}
      >
        <button
          onClick={() => formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
          className="btn-lift"
          style={{ width: "100%", padding: "15px 18px", background: `linear-gradient(135deg,${GD},${G})`, color: "#fff", border: 0, borderRadius: 12, fontFamily: "inherit", fontWeight: 800, fontSize: 15, cursor: "pointer" }}
        >
          🎁 Accéder à la masterclass gratuite →
        </button>
      </div>
    </div>
  );
}
