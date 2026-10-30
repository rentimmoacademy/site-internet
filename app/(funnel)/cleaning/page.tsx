"use client";

import { useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { ArrowRight, BadgeCheck, Check, Play } from "lucide-react";
import Logo from "@/components/layout/Logo";
import Highlight from "@/components/ui/Highlight";
import Underline from "@/components/ui/Underline";
import Reveal from "@/components/ui/Reveal";
import { useReducedMotionAfterMount } from "@/lib/useReducedMotionAfterMount";
import { trackEvent, trackMeta } from "@/lib/gtag";
import { CLEANING_CAL_URL, CLEANING_VIDEO_ID } from "@/lib/cleaning";

const BULLETS = [
  "Monter ton activité de ménage Airbnb de A à Z, sans local et sans capital",
  "Trouver et signer ton premier client (hôte, conciergerie ou propriétaire)",
  "Encaisser ton premier revenu, puis passer de « je fais le ménage » à « je dirige une équipe »",
  "Ce qu'un hôte Airbnb attend vraiment de la personne qui s'occupe de son logement",
];

const FAQ = [
  { q: "C'est vraiment gratuit ?", a: "Oui. Aucune carte bancaire demandée. Tu accèdes à la présentation juste après ton inscription." },
  { q: "Pourquoi mon WhatsApp ?", a: "Pour t'envoyer la présentation en privé et répondre à tes questions pendant ou après le visionnage." },
  { q: "Je n'ai jamais travaillé dans le ménage, c'est pour moi ?", a: "Oui, si tu es prêt à te former sérieusement et à aller chercher tes clients. Ce n'est pas pour toi si tu cherches de l'argent facile et immédiat." },
];

const PAGE_CSS = `
  @keyframes ctaPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(45,184,75,.35); } 50% { box-shadow: 0 0 0 10px rgba(45,184,75,0); } }
  .cta-pulse { animation: ctaPulse 2.6s ease-in-out infinite; }
  @media (prefers-reduced-motion: reduce) { .cta-pulse { animation: none !important; } }
`;

const inputCls = (err?: string) =>
  `w-full rounded-xl border-[1.5px] bg-cream px-4 py-3.5 text-base text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-brand-green focus:bg-white ${
    err ? "border-[#DC2626]" : "border-ink/15"
  }`;

export default function CleaningPage() {
  const reduce = useReducedMotionAfterMount();
  const [step, setStep] = useState<"form" | "video">("form");
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);

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
    if (Object.keys(next).length) { setErrs(next); return; }
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
      setStep("video");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrs({ global: "Erreur réseau. Vérifie ta connexion et réessaie." });
      setLoading(false);
    }
  }

  const Topbar = (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo dark />
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink/75">
          <BadgeCheck size={14} className="text-brand-dark" /> <span className="hidden sm:inline">Organisme</span> QUALIOPI
        </span>
      </div>
    </header>
  );
  const Footer = (
    <footer className="bg-ink px-6 py-7 text-center text-[13px] text-white/55">
      <strong className="text-white">Rentimmo Academy</strong> · Marwan AFASSI · Organisme certifié QUALIOPI · © 2026
    </footer>
  );

  if (step === "video") {
    return (
      <MotionConfig reducedMotion={reduce ? "always" : "never"}>
        <div className="min-h-screen overflow-x-hidden text-ink">
          <style>{PAGE_CSS}</style>
          {Topbar}
          <section className="px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-14">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-[13px] font-bold text-brand-dark">
                <Play size={13} className="fill-current" /> Accès débloqué — Présentation Cleaning BnB Academy
              </span>
              <h1 className="mt-6 text-[clamp(1.6rem,4.2vw,2.8rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink">
                Du premier client au <Highlight>premier encaissement</Highlight>
              </h1>
            </div>
            <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-[1.5rem] border border-ink/10 bg-ink shadow-[0_10px_0_-2px_#1A6B33] md:rounded-[2rem]">
              <div className="aspect-video">
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
            <Reveal className="mx-auto mt-12 max-w-2xl">
              <div className="rounded-3xl bg-ink px-5 py-8 text-center text-white shadow-[0_8px_0_#1A6B33] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_0_#2DB84B] sm:px-10 sm:py-10">
                <h2 className="text-[clamp(1.3rem,3vw,1.75rem)] font-extrabold tracking-[-0.02em]">
                  Tu veux savoir si c&apos;est <Underline>fait pour toi</Underline> ?
                </h2>
                <p className="mt-3 text-base text-white/65">Réserve un appel avec Marwan. On regarde ta situation et on voit si la formation peut t&apos;accompagner.</p>
                <a
                  href={CLEANING_CAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackEvent("cleaning_call_click"); trackMeta("Schedule", { content_name: "cleaning" }); }}
                  className="btn-primary cta-pulse mt-7 w-full text-base hover:gap-3 sm:text-[17px]"
                >
                  Réserver mon appel offert <ArrowRight size={18} />
                </a>
                <p className="mt-3 text-[13px] text-white/50">Gratuit · Sans engagement</p>
              </div>
            </Reveal>
          </section>
          {Footer}
        </div>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion={reduce ? "always" : "never"}>
      <div className="min-h-screen overflow-x-hidden text-ink">
        <style>{PAGE_CSS}</style>
        {Topbar}

        {/* HERO + FORM (crème quadrillé) */}
        <section className="relative px-4 pb-14 pt-8 sm:px-6 md:pb-20 md:pt-14">
          <div className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(45,184,75,0.12),transparent)]" />
          <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-14 lg:gap-y-8">
            {/* Accroche (LCP : jamais en opacité 0) */}
            <div className="lg:col-start-1 lg:row-start-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-[13px] font-bold text-brand-dark">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-green shadow-[0_0_0_4px_rgba(45,184,75,0.2)]" />
                Présentation offerte · accès immédiat
              </span>
              <h1 className="mt-5 text-[clamp(1.75rem,4.3vw,3rem)] font-extrabold leading-[1.07] tracking-[-0.03em] text-ink">
                Monte ton activité de ménage Airbnb de A à Z : signe ton <Highlight>premier client</Highlight> et encaisse
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/70 md:text-base">
                Une présentation de 9 minutes par Marwan AFASSI : plus de 7 ans en location courte durée, jusqu&apos;à 24 logements gérés entre la France et le Maroc.
              </p>
            </div>

            {/* FORMULAIRE (carte blanche) */}
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <div
                ref={formRef}
                className="relative overflow-hidden rounded-3xl border border-ink/10 bg-white px-5 py-6 shadow-[0_8px_0_#1A6B33] sm:px-8 sm:py-9 lg:sticky lg:top-24"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-gradient" />
                <h2 className="text-[1.35rem] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[1.5rem]">Reçois la présentation maintenant</h2>
                <p className="mt-1.5 text-sm text-ink/60">Renseigne tes infos. Tu accèdes à la vidéo dans 10 secondes.</p>
                <form onSubmit={handleSubmit} noValidate className="mt-5">
                  {[
                    { name: "firstName", label: "Prénom", type: "text", ph: "Ton prénom", ac: "given-name" },
                    { name: "email", label: "Email", type: "email", ph: "ton@email.com", ac: "email" },
                    { name: "phone", label: "📱 WhatsApp", type: "tel", ph: "+33 6 12 34 56 78", ac: "tel" },
                  ].map((f) => (
                    <div key={f.name} className="mb-3.5">
                      <label htmlFor={`cl-${f.name}`} className="mb-1.5 block text-[13px] font-bold text-ink/85">{f.label}</label>
                      <input id={`cl-${f.name}`} name={f.name} type={f.type} placeholder={f.ph} autoComplete={f.ac} aria-invalid={!!errs[f.name]} className={inputCls(errs[f.name])} />
                      {errs[f.name] && <p role="alert" className="mt-1 text-xs font-semibold text-[#DC2626]">{errs[f.name]}</p>}
                    </div>
                  ))}
                  {errs.global && <div role="alert" className="mb-4 rounded-xl bg-[#DC2626]/[0.07] px-4 py-3 text-[13px] text-[#DC2626]">{errs.global}</div>}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary mt-1.5 w-full px-5 text-base hover:gap-3 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 ${loading ? "" : "cta-pulse"}`}
                  >
                    {loading ? "⏳ Préparation de ton accès…" : "🎁 J'accède à la présentation →"}
                  </button>
                  <p className="mt-3 text-center text-[11px] leading-relaxed text-ink/55">
                    En validant, tu acceptes de recevoir la présentation et des messages de Rentimmo Academy par email et WhatsApp. Désinscription possible à tout moment.
                  </p>
                </form>
              </div>
            </div>

            {/* Bénéfices (carte noire « contenu fort ») */}
            <div className="lg:col-start-1 lg:row-start-2">
              <Reveal>
                <ul className="grid gap-3.5 rounded-3xl bg-ink p-6 text-white shadow-[0_8px_0_#1A6B33] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_0_#2DB84B] sm:p-8">
                  {BULLETS.map((b, i) => (
                    <Reveal as="li" key={b} index={i + 1} y={10} className="flex items-start gap-3 text-[15px] text-white/85">
                      <span className="mt-0.5 inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-brand-green text-ink">
                        <Check size={13} strokeWidth={3.5} />
                      </span>
                      {b}
                    </Reveal>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ (fond blanc) */}
        <section className="border-y border-ink/10 bg-white px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h2 className="text-center text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold tracking-[-0.02em] text-ink">
                Tes questions, nos <span className="text-brand-dark">réponses</span>
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-4">
              {FAQ.map((f, i) => (
                <Reveal key={f.q} index={i}>
                  <div className="rounded-3xl border border-ink/10 bg-cream px-5 py-5 shadow-[0_6px_0_rgba(26,26,26,0.06)] transition-colors hover:border-brand-green/40 sm:px-6">
                    <div className="text-[15px] font-bold text-ink">{f.q}</div>
                    <div className="mt-1.5 text-sm leading-relaxed text-ink/65">{f.a}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        {Footer}
      </div>
    </MotionConfig>
  );
}
