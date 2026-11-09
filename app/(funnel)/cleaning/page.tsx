"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, Check, Handshake, House, Play, Sparkles, Wallet } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { Mark, Marquee, Motion, StickyCta, Words, delay } from "@/components/motion";
import { trackEvent, trackMeta } from "@/lib/gtag";
import { CLEANING_CAL_URL, CLEANING_VIDEO_ID } from "@/lib/cleaning";
import "./cleaning.css";

type Step = "form" | "video";

const BULLETS = [
  { Icon: Sparkles, t: "Monter ton activité de ménage Airbnb de A à Z, sans local et sans capital" },
  { Icon: Handshake, t: "Trouver et signer ton premier client (hôte, conciergerie ou propriétaire)" },
  { Icon: Wallet, t: "Encaisser ton premier revenu, puis passer de « je fais le ménage » à « je dirige une équipe »" },
  { Icon: House, t: "Ce qu'un hôte Airbnb attend vraiment de la personne qui s'occupe de son logement" },
];

const FAQ = [
  { q: "C'est vraiment gratuit ?", a: "Oui. Aucune carte bancaire demandée. Tu accèdes à la présentation juste après ton inscription." },
  { q: "Pourquoi mon WhatsApp ?", a: "Pour t'envoyer la présentation en privé et répondre à tes questions pendant ou après le visionnage." },
  { q: "Je n'ai jamais travaillé dans le ménage, c'est pour moi ?", a: "Oui, si tu es prêt à te former sérieusement et à aller chercher tes clients. Ce n'est pas pour toi si tu cherches de l'argent facile et immédiat." },
];

// Bandeau : fragments repris tels quels du titre, des bénéfices et du badge.
const STRIP = ["Premier client", "Premier encaissement", "Sans local", "Sans capital", "De « je fais le ménage » à « je dirige une équipe »", "Présentation offerte · accès immédiat"];

const FIELDS = [
  { name: "firstName", label: "Prénom", type: "text", ph: "Ton prénom", ac: "given-name", mode: undefined },
  { name: "email", label: "Email", type: "email", ph: "ton@email.com", ac: "email", mode: "email" as const },
  { name: "phone", label: "📱 WhatsApp", type: "tel", ph: "+33 6 12 34 56 78", ac: "tel", mode: "tel" as const },
];

const PAGE_CSS = `
  @keyframes ctaPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(45,184,75,.35); } 50% { box-shadow: 0 0 0 10px rgba(45,184,75,0); } }
  .cta-pulse { animation: ctaPulse 2.6s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { .cta-pulse { animation: ctaPulse 3.4s ease-in-out infinite; } }
`;

const inputCls = (err?: string) =>
  `w-full rounded-xl border-[1.5px] bg-cream px-4 py-3.5 text-base text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-brand-green focus:bg-white ${
    err ? "border-[#DC2626]" : "border-ink/15"
  }`;

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Stepper({ step, callSeen }: { step: Step; callSeen: boolean }) {
  const state = (n: 1 | 2 | 3) => {
    if (step === "form") return n === 1 ? "active" : "todo";
    if (n === 1) return "done";
    if (n === 2) return callSeen ? "done" : "active";
    return callSeen ? "active" : "todo";
  };
  const items = ["Inscription", "Présentation", "Appel offert"];
  return (
    <ol className="cl-steps" aria-label="Étapes">
      {items.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const st = state(n);
        return (
          <li key={label} data-state={st} aria-current={st === "active" ? "step" : undefined}>
            <span className="cl-dot">{st === "done" ? <Check size={13} strokeWidth={3.5} aria-hidden /> : n}</span>
            <span className="cl-lbl">{label}</span>
            {i < items.length - 1 && <span className="cl-line" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function Topbar({ step, callSeen }: { step: Step; callSeen: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo dark />
        <div className="cl-steps-desk">
          <Stepper step={step} callSeen={callSeen} />
        </div>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink/75">
          <BadgeCheck size={14} className="text-brand-dark" /> <span className="hidden sm:inline">Organisme</span> QUALIOPI
        </span>
      </div>
      <div className="cl-steps-mob px-4 pb-2.5">
        <Stepper step={step} callSeen={callSeen} />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-ink px-6 py-7 text-center text-[13px] text-white/55">
      <strong className="text-white">Rentimmo Academy</strong> · Marwan AFASSI · Organisme certifié QUALIOPI · © 2026
    </footer>
  );
}

function Aurora() {
  return (
    <div className="mo-aurora mo-aurora--light" aria-hidden>
      <span className="mo-blob mo-blob--a" />
      <span className="mo-blob mo-blob--b" />
    </div>
  );
}

export default function CleaningPage() {
  const [step, setStep] = useState<Step>("form");
  const [leaving, setLeaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [callSeen, setCallSeen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  // Étape 3 du stepper : s'allume quand le bloc « Réserver mon appel » entre à l'écran.
  useEffect(() => {
    setCallSeen(false);
    if (step !== "video" || !("IntersectionObserver" in window)) return;
    const el = document.getElementById("cl-call");
    if (!el) return;
    const io = new IntersectionObserver(([en]) => en.isIntersecting && setCallSeen(true), { threshold: 0, rootMargin: "-40% 0px -15% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [step]);

  // Changement d'étape : focus sur le titre (lecteurs d'écran / clavier).
  useEffect(() => {
    if (step === "video") h1Ref.current?.focus({ preventScroll: true });
  }, [step]);

  function goToForm() {
    const card = formRef.current;
    if (!card) return;
    card.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
    window.setTimeout(() => (document.getElementById("cl-firstName") as HTMLInputElement | null)?.focus({ preventScroll: true }), reducedMotion() ? 0 : 450);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const firstName = ((fd.get("firstName") as string) || "").trim();
    const email = ((fd.get("email") as string) || "").trim();
    const phone = ((fd.get("phone") as string) || "").trim();
    const next: Record<string, string> = {};
    if (!firstName) next.firstName = "Prénom requis";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Format invalide. Ex : prenom@email.com";
    if ((phone.match(/\d/g) || []).length < 8) next.phone = "Numéro incomplet (ex : +33 6 12 34 56 78)";
    if (Object.keys(next).length) {
      setErrs(next);
      const first = FIELDS.find((f) => next[f.name]);
      if (first) (document.getElementById(`cl-${first.name}`) as HTMLInputElement | null)?.focus();
      return;
    }
    setErrs({});
    setLoading(true);
    const source = new URLSearchParams(window.location.search).get("src") || "direct";
    try {
      const r = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, phone, source, funnel: "cleaning" }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErrs({ global: data.message || "Une erreur est survenue. Réessaie dans une minute." });
        setLoading(false);
        return;
      }
      sessionStorage.setItem("rentimmo_lead_email", email);
      trackEvent("cleaning_optin", { source });
      trackMeta("Lead", { content_name: "cleaning", source });
      // Transition : le héros sort en douceur, puis l'étape vidéo entre en scène.
      const quick = reducedMotion();
      setLeaving(true);
      window.setTimeout(() => {
        setStep("video");
        setLeaving(false);
        window.scrollTo({ top: 0, behavior: quick ? "auto" : "smooth" });
      }, quick ? 150 : 420);
    } catch {
      setErrs({ global: "Erreur réseau. Vérifie ta connexion et réessaie." });
      setLoading(false);
    }
  }

  /* ===== ÉTAPE 2 : vidéo ===== */
  if (step === "video") {
    return (
      <div className="cl-root mo-gentle cl-step-in min-h-screen overflow-x-hidden text-ink">
        <Motion gentle deps="video" revealAfter={2600} />
        <div className="mo-progress" data-mo-progress aria-hidden />
        <style>{PAGE_CSS}</style>
        <Topbar step={step} callSeen={callSeen} />
        <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-14">
          <Aurora />
          <div className="relative z-[1] mx-auto max-w-4xl text-center">
            <span className="mo-enter-pop inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-[13px] font-bold text-brand-dark">
              <Play size={13} className="fill-current" /> Accès débloqué — Présentation Cleaning BnB Academy
            </span>
            <h1
              ref={h1Ref}
              tabIndex={-1}
              className="mt-6 text-[clamp(1.6rem,4.2vw,2.8rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink outline-none"
            >
              <Words text="Du premier client au" />{" "}
              <Mark enter delay={450}>
                <Words text="premier encaissement" start={4} />
              </Mark>
            </h1>
          </div>
          <div className="mo-halo mo-enter-pop relative z-[1] mx-auto mt-8 max-w-4xl" style={delay(250)}>
            <div id="cl-video" className="overflow-hidden rounded-[1.5rem] border border-ink/10 bg-ink shadow-[0_10px_0_-2px_#1A6B33] md:rounded-[2rem]">
              <div className="mo-skeleton aspect-video">
                {CLEANING_VIDEO_ID ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${CLEANING_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
                    title="Présentation Cleaning BnB Academy"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="block h-full w-full border-0"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-white/75">
                    La présentation arrive très bientôt. Réserve ton appel ci-dessous, on te l&apos;envoie avant.
                  </div>
                )}
              </div>
            </div>
          </div>
          <div id="cl-call" className="relative z-[1] mx-auto mt-12 max-w-2xl" data-reveal="up">
            <div className="cl-lift mo-borderspin rounded-3xl bg-ink px-5 py-8 text-center text-white sm:px-10 sm:py-10" style={{ "--mo-card-bg": "#1A1A1A" } as React.CSSProperties}>
              <div className="relative">
                <h2 className="text-[clamp(1.3rem,3vw,1.75rem)] font-extrabold tracking-[-0.02em]">
                  Tu veux savoir si c&apos;est <Mark variant="underline">fait pour toi</Mark> ?
                </h2>
                <p className="mt-3 text-base text-white/65">Réserve un appel avec Marwan. On regarde ta situation et on voit si la formation peut t&apos;accompagner.</p>
                <a
                  href={CLEANING_CAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic
                  onClick={() => { trackEvent("cleaning_call_click"); trackMeta("Schedule", { content_name: "cleaning" }); }}
                  className="btn-primary cta-pulse mo-shine mt-7 w-full text-base hover:gap-3 sm:text-[17px]"
                >
                  Réserver mon appel offert <ArrowRight size={18} />
                </a>
                <p className="mt-3 text-[13px] text-white/50">Gratuit · Sans engagement</p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
        <div aria-hidden className="h-[76px] bg-ink md:hidden" />
        <StickyCta
          watch={["#cl-video", "#cl-call"]}
          rescan={step}
          href={CLEANING_CAL_URL}
          external
          className="btn-primary w-full py-3.5 text-[15px]"
          onClick={() => {
            trackEvent("cleaning_call_click", { placement: "sticky" });
            trackMeta("Schedule", { content_name: "cleaning" });
          }}
        >
          Réserver mon appel offert <ArrowRight size={18} aria-hidden />
        </StickyCta>
      </div>
    );
  }

  /* ===== ÉTAPE 1 : inscription ===== */
  return (
    <div className={`cl-root mo-gentle min-h-screen overflow-x-hidden text-ink${leaving ? " cl-leave" : ""}`}>
      <Motion gentle deps="form" revealAfter={2600} />
      <div className="mo-progress" data-mo-progress aria-hidden />
      <style>{PAGE_CSS}</style>
      <Topbar step={step} callSeen={false} />

      {/* HERO + FORM (crème quadrillé) */}
      <section className="relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 md:pb-20 md:pt-14">
        <Aurora />
        <div className="cl-hero-grid relative z-[1] mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-14 lg:gap-y-8">
          {/* Accroche */}
          <div id="cl-hero" className="lg:col-start-1 lg:row-start-1">
            <span className="mo-enter-pop inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-[13px] font-bold text-brand-dark">
              <span className="mo-pulse-dot" style={{ width: 6, height: 6 }} aria-hidden />
              Présentation offerte · accès immédiat
            </span>
            <h1 className="mt-5 text-[clamp(1.75rem,4.3vw,3rem)] font-extrabold leading-[1.07] tracking-[-0.03em] text-ink">
              <Words text="Monte ton activité de ménage Airbnb de A à Z : signe ton" />{" "}
              <Mark enter delay={700}>
                <Words text="premier client" start={13} />
              </Mark>{" "}
              <Words text="et encaisse" start={15} />
            </h1>
            <p className="mo-enter mt-4 text-[15px] leading-relaxed text-ink/70 md:text-base" style={delay(380)}>
              Une présentation de 9 minutes par Marwan AFASSI : plus de 7 ans en location courte durée, jusqu&apos;à 24 logements gérés entre la France et le Maroc.
            </p>
          </div>

          {/* FORMULAIRE (carte blanche, bordure lumineuse) */}
          <div className="mo-enter lg:col-start-2 lg:row-span-2 lg:row-start-1" style={delay(200)}>
            <div
              ref={formRef}
              id="cl-form"
              className="cl-form mo-borderspin relative overflow-hidden rounded-3xl bg-white px-5 py-6 sm:px-8 sm:py-9 lg:sticky lg:top-28"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-gradient" />
              <div className="relative">
                <h2 className="text-[1.35rem] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[1.5rem]">Reçois la présentation maintenant</h2>
                <p className="mt-1.5 text-sm text-ink/60">Renseigne tes infos. Tu accèdes à la vidéo dans 10 secondes.</p>
                <form onSubmit={handleSubmit} noValidate aria-busy={loading} className="mt-5">
                  {FIELDS.map((f) => (
                    <div key={f.name} className="mb-3.5">
                      <label htmlFor={`cl-${f.name}`} className="mb-1.5 block text-[13px] font-bold text-ink/85">{f.label}</label>
                      <input
                        id={`cl-${f.name}`}
                        name={f.name}
                        type={f.type}
                        placeholder={f.ph}
                        autoComplete={f.ac}
                        inputMode={f.mode}
                        aria-invalid={!!errs[f.name]}
                        aria-describedby={errs[f.name] ? `cl-${f.name}-err` : undefined}
                        className={inputCls(errs[f.name])}
                      />
                      {errs[f.name] && <p id={`cl-${f.name}-err`} role="alert" className="mt-1 text-xs font-semibold text-[#DC2626]">{errs[f.name]}</p>}
                    </div>
                  ))}
                  {errs.global && <div role="alert" className="mb-4 rounded-xl bg-[#DC2626]/[0.07] px-4 py-3 text-[13px] text-[#DC2626]">{errs.global}</div>}
                  <button
                    type="submit"
                    disabled={loading}
                    data-magnetic
                    className={`btn-primary mo-shine mt-1.5 w-full px-5 text-base hover:gap-3 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 ${loading ? "" : "cta-pulse"}`}
                  >
                    {loading ? "⏳ Préparation de ton accès…" : "🎁 J'accède à la présentation →"}
                  </button>
                  <p className="mt-3 text-center text-[11px] leading-relaxed text-ink/55">
                    En validant, tu acceptes de recevoir la présentation et des messages de Rentimmo Academy par email et WhatsApp. Désinscription possible à tout moment.
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* Bénéfices : tuiles en cascade, inclinables */}
          <div className="lg:col-start-1 lg:row-start-2">
            <ul className="grid gap-3 sm:grid-cols-2" data-stagger="110">
              {BULLETS.map(({ Icon, t }, i) => {
                const dark = i === 0 || i === 3;
                return (
                  <li key={t} data-reveal={i % 2 ? "left" : "up"}>
                    <div
                      data-tilt
                      className={`cl-tile cl-lift h-full rounded-3xl p-5 ${
                        dark ? "cl-tile--dark bg-ink text-white shadow-[0_8px_0_#1A6B33]" : "border border-ink/10 bg-white text-ink shadow-[0_8px_0_rgba(26,26,26,0.08)]"
                      }`}
                    >
                      <div className="relative flex items-center justify-between">
                        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${dark ? "bg-brand-green text-ink" : "bg-cream text-brand-dark"}`}>
                          <Icon size={20} aria-hidden />
                        </span>
                        <span className={`text-sm font-extrabold ${dark ? "text-white/35" : "text-ink/25"}`} aria-hidden>0{i + 1}</span>
                      </div>
                      <p className={`relative mt-3 text-[15px] font-medium leading-snug ${dark ? "text-white/90" : "text-ink/85"}`}>{t}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Bandeau défilant */}
      <div className="border-y-4 border-brand-green bg-ink py-4 text-white">
        <Marquee items={STRIP} speed={34} itemClassName="cl-strip-item" />
      </div>

      {/* FAQ (fond blanc) */}
      <section className="border-b border-ink/10 bg-white px-4 py-14 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold tracking-[-0.02em] text-ink" data-reveal="up">
            Tes questions, nos <span className="text-brand-dark">réponses</span>
          </h2>
          <div className="mt-8 grid gap-4" data-stagger="90">
            {FAQ.map((f) => (
              <div key={f.q} data-reveal="up">
                <div className="rounded-3xl border border-ink/10 bg-cream px-5 py-5 shadow-[0_6px_0_rgba(26,26,26,0.06)] transition-colors hover:border-brand-green/40 sm:px-6">
                  <div className="text-[15px] font-bold text-ink">{f.q}</div>
                  <div className="mt-1.5 text-sm leading-relaxed text-ink/65">{f.a}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center" data-reveal="up">
            <button type="button" onClick={goToForm} data-magnetic className="btn-primary mo-shine hover:gap-3">
              🎁 J&apos;accède à la présentation →
            </button>
          </div>
        </div>
      </section>
      <Footer />
      <div aria-hidden className="h-[76px] bg-ink md:hidden" />

      <StickyCta watch={["#cl-hero", "#cl-form"]} rescan={step} onClick={goToForm} className="btn-primary w-full py-3.5 text-[15px]">
        🎁 J&apos;accède à la présentation →
      </StickyCta>
    </div>
  );
}
