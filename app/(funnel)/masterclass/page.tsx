"use client";

import { useRef, useState } from "react";
import { ArrowRight, BadgeCheck, Check, Play } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { Mark, Marquee, Motion, StickyCta, Words, delay } from "@/components/motion";
import { trackEvent, trackMeta } from "@/lib/gtag";
import "./masterclass.css";

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

const STATS = [
  { v: "+7 ans", l: "d'expérience terrain" },
  { v: "+697K€", l: "générés sur Airbnb" },
  { v: "FR + 🌍", l: "France et étranger" },
  { v: "QUALIOPI", l: "organisme certifié" },
  { v: "100 % halal", l: "zéro riba" },
];

const FAQ = [
  { q: "C'est vraiment gratuit ?", a: "Oui, 100%. Aucune carte bancaire demandée. Tu accèdes à la masterclass immédiatement après ton inscription." },
  { q: "Pourquoi tu me demandes mon WhatsApp ?", a: "Pour t'envoyer la masterclass et les bonus directement en privé, et répondre à tes questions si tu en as pendant le visionnage." },
  { q: "C'est fait pour moi si je n'ai pas d'expérience ?", a: "Oui. Beaucoup de nos apprenants partent de zéro. On évalue ta situation précisément lors de l'appel stratégique pour te recommander le modèle le plus adapté — sous-location ou conciergerie." },
];

const PAGE_CSS = `
  @keyframes ctaPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(45,184,75,.35); } 50% { box-shadow: 0 0 0 10px rgba(45,184,75,0); } }
  @keyframes shakeX { 10%,90% { transform: translateX(-1px); } 20%,80% { transform: translateX(2px); } 30%,50%,70% { transform: translateX(-4px); } 40%,60% { transform: translateX(4px); } }
  .cta-pulse { animation: ctaPulse 2.6s ease-in-out infinite; }
  .input-error { animation: shakeX .4s; }
  @media (prefers-reduced-motion: reduce) { .cta-pulse { animation: ctaPulse 3.4s ease-in-out infinite; } .input-error { animation: none !important; } }
`;

function Topbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo dark />
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-ink/75">
          <BadgeCheck size={14} className="text-brand-dark" /> <span className="hidden sm:inline">Organisme</span> QUALIOPI
        </span>
      </div>
    </header>
  );
}

function FunnelFooter() {
  return (
    <footer className="bg-ink px-6 py-7 text-center text-[13px] text-white/55">
      <strong className="text-white">Rentimmo Academy</strong> · Marwan AFASSI · Organisme certifié QUALIOPI · © 2026
    </footer>
  );
}

const inputCls = (err?: string) =>
  `w-full rounded-xl border-[1.5px] bg-cream px-4 py-3.5 text-base text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-brand-green focus:bg-white ${
    err ? "input-error border-[#DC2626]" : "border-ink/15"
  }`;

export default function MasterclassPage() {
  const [step, setStep] = useState<"form" | "video">("form");
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const formCardRef = useRef<HTMLDivElement>(null);

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

  const scrollToForm = () => formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  if (step === "video")
    return (
      <div className="mc-root mo-gentle min-h-screen overflow-x-hidden text-ink">
          <Motion gentle deps="video" revealAfter={2600} />
          <div className="mo-progress" data-mo-progress aria-hidden />
          <style>{PAGE_CSS}</style>
          <Topbar />
          <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-14">
            <div className="mo-aurora mo-aurora--light" aria-hidden>
              <span className="mo-blob mo-blob--a" />
              <span className="mo-blob mo-blob--b" />
            </div>
            <div className="relative z-[1] mx-auto max-w-4xl text-center">
              <span className="mo-enter-pop inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-[13px] font-bold text-brand-dark">
                <Play size={13} className="fill-current" /> Accès débloqué — Masterclass offerte
              </span>
              <h1 className="mt-6 text-[clamp(1.6rem,4.2vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink">
                <Words text="Génère tes" />{" "}
                <Mark enter delay={500}>
                  <Words text="premiers revenus" start={2} />
                </Mark>{" "}
                <Words text="Airbnb avec la méthode qui a généré +697K€ sur Airbnb." start={4} />
              </h1>
              <p className="mo-enter mt-4 text-base text-ink/65 md:text-lg" style={delay(350)}>Lance la vidéo et prends des notes — chaque minute compte.</p>
            </div>

            <div className="mo-halo mo-enter relative z-[1] mx-auto mt-8 max-w-4xl" style={delay(250)}>
            <div className="overflow-hidden rounded-[1.5rem] border border-ink/10 bg-ink shadow-[0_10px_0_-2px_#1A6B33] md:rounded-[2rem]">
              <div className="mo-skeleton aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/Hku4kW4_ijY?rel=0&modestbranding=1&controls=1&playsinline=1&autoplay=1"
                  title="Masterclass Rentimmo Academy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="block h-full w-full border-0"
                />
              </div>
            </div>
            </div>

            <div className="relative z-[1] mx-auto mt-12 max-w-2xl" data-reveal="up">
              <div className="mc-lift mo-borderspin rounded-3xl bg-ink px-5 py-8 text-center text-white sm:px-10 sm:py-10" style={{ "--mo-card-bg": "#1A1A1A" } as React.CSSProperties}>
                <div className="relative">
                <div className="text-3xl" aria-hidden>📞</div>
                <h2 className="mt-3 text-[clamp(1.35rem,3vw,1.9rem)] font-extrabold tracking-[-0.02em]">
                  Tu veux passer à l&apos;<Mark variant="underline">action</Mark> ?
                </h2>
                <p className="mt-3 text-base text-white/65">Réserve un appel avec Marwan. On analyse ta situation et on voit si la formation peut t&apos;accompagner.</p>
                <a
                  href="https://cal.com/rentimmoacademy/appel-strategique"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackEvent("masterclass_call_click"); trackMeta("Schedule", { content_name: "masterclass" }); }}
                  data-magnetic
                  className="btn-primary cta-pulse mo-shine mt-7 w-full text-[15px] hover:gap-3 sm:text-[17px]"
                >
                  Réserver mon appel stratégique offert <ArrowRight size={18} />
                </a>
                <p className="mt-3 text-[13px] text-white/50">Gratuit · Sans engagement</p>
                </div>
              </div>
            </div>
          </section>
          <FunnelFooter />
        </div>
    );

  return (
      <div className="mc-root mo-gentle min-h-screen overflow-x-hidden text-ink">
        <Motion gentle deps="form" revealAfter={2600} />
        <style>{PAGE_CSS}</style>
        <Topbar />

        {/* HERO + FORM (crème quadrillé) */}
        <section className="relative overflow-hidden px-4 pb-14 pt-8 sm:px-6 md:pb-20 md:pt-14">
          <div className="mo-aurora mo-aurora--light" aria-hidden>
            <span className="mo-blob mo-blob--a" />
            <span className="mo-blob mo-blob--b" />
          </div>
          <div className="relative z-[1] mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-14 lg:gap-y-6">
            {/* Accroche (LCP : jamais en opacité 0) */}
            <div id="mc-hero" className="lg:col-start-1 lg:row-start-1">
              <span className="mo-enter-pop inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-[13px] font-bold text-brand-dark">
                <span className="mo-pulse-dot" style={{ width: 6, height: 6 }} aria-hidden />
                Masterclass offerte · accès immédiat
              </span>
              <h1 className="mt-5 text-[clamp(1.75rem,4.4vw,3.1rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink">
                <Words text="Sous-location & conciergerie Airbnb : la méthode que j'applique" />{" "}
                <Mark enter delay={650}>
                  <Words text="depuis 7 ans" start={9} />
                </Mark>
              </h1>
              <p className="mo-enter mt-4 text-[15px] leading-relaxed text-ink/70 md:text-[17px]" style={delay(380)}>
                Une méthode terrain, halal-friendly, testée sur +697K€ générés sur Airbnb, en France et à l&apos;étranger.
              </p>
            </div>

            {/* FORMULAIRE (carte blanche) */}
            <div className="mo-enter lg:col-start-2 lg:row-span-2 lg:row-start-1" style={delay(200)}>
              <div
                ref={formCardRef}
                id="mc-form"
                className="mc-form mo-borderspin relative overflow-hidden rounded-3xl bg-white px-5 py-6 sm:px-8 sm:py-9 lg:sticky lg:top-24"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-gradient" />
                <div className="relative">
                <span className="inline-block rounded-full bg-brand-green/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-dark">
                  Accès offert · 0€
                </span>
                <h2 className="mt-3 text-[1.35rem] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[1.5rem]">
                  Reçois ta masterclass maintenant
                </h2>
                <p className="mt-1.5 text-sm text-ink/60">Renseigne tes infos. Tu accèdes à la vidéo dans 10 secondes.</p>

                <form onSubmit={handleSubmit} noValidate className="mt-5">
                  {[
                    { name: "firstName", label: "Prénom", type: "text", placeholder: "Ton prénom", ac: "given-name" },
                    { name: "email", label: "Email", type: "email", placeholder: "ton@email.com", ac: "email" },
                  ].map(({ name, label, type, placeholder, ac }) => (
                    <div key={name} className="mb-3.5">
                      <label htmlFor={`mc-${name}`} className="mb-1.5 block text-[13px] font-bold text-ink/85">{label}</label>
                      <input
                        id={`mc-${name}`}
                        ref={(el) => { inputRefs.current[name] = el; }}
                        name={name} type={type} placeholder={placeholder} autoComplete={ac}
                        aria-invalid={!!errs[name]}
                        className={inputCls(errs[name])}
                      />
                      {errs[name] && <p role="alert" aria-live="polite" className="mt-1 text-xs font-semibold text-[#DC2626]">{errs[name]}</p>}
                    </div>
                  ))}

                  <div className="mb-5">
                    <label htmlFor="mc-phone" className="mb-1.5 block text-[13px] font-bold text-ink/85">
                      📱 WhatsApp <span className="text-xs font-normal text-ink/55">(je t&apos;envoie la masterclass + bonus en privé)</span>
                    </label>
                    <input
                      id="mc-phone"
                      ref={(el) => { inputRefs.current.phone = el; }}
                      name="phone" type="tel" placeholder="+33 6 12 34 56 78" autoComplete="tel"
                      aria-invalid={!!errs.phone}
                      className={inputCls(errs.phone)}
                    />
                    {errs.phone && <p role="alert" aria-live="polite" className="mt-1 text-xs font-semibold text-[#DC2626]">{errs.phone}</p>}
                  </div>

                  {errs.global && (
                    <div role="alert" className="mb-4 rounded-xl border border-[#DC2626]/25 bg-[#DC2626]/[0.07] px-4 py-3 text-[13px] text-[#DC2626]">{errs.global}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    data-magnetic
                    className={`btn-primary mo-shine w-full px-5 text-[15px] hover:gap-3 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 sm:text-[17px] ${loading ? "" : "cta-pulse"}`}
                  >
                    {loading ? "⏳ Préparation de ton accès…" : "🎁 J'accède à la masterclass maintenant →"}
                  </button>

                  <div className="mt-3.5 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-ink/60">
                    {["0€ · gratuit", "Infos protégées", "Désinscription en 1 clic"].map((t) => (
                      <span key={t} className="inline-flex items-center gap-1"><Check size={13} strokeWidth={3} className="text-brand-dark" /> {t}</span>
                    ))}
                  </div>
                  <p className="mt-2.5 text-center text-[11px] leading-relaxed text-ink/55">
                    En validant, tu acceptes de recevoir la masterclass et des messages de Rentimmo Academy par email et WhatsApp. Désinscription possible à tout moment.
                  </p>
                </form>
                </div>
              </div>
            </div>

            {/* Bénéfices + mini-preuves */}
            <div className="lg:col-start-1 lg:row-start-2">
              <ul className="grid gap-3" data-stagger="90">
                {BULLETS.map((b) => (
                  <li key={b} data-reveal="left" className="flex items-start gap-3 text-[15px] font-medium text-ink/85">
                    <span className="mt-0.5 inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full bg-ink text-brand-green">
                      <Check size={13} strokeWidth={3.5} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-ink/10 pt-5" data-stagger="100">
                {[
                  { v: <span data-count="7" data-prefix="+" data-suffix=" ans">+7 ans</span>, l: "d'expérience" },
                  { v: <span data-count="697" data-prefix="+" data-suffix="K€">+697K€</span>, l: "générés sur Airbnb" },
                  { v: "QUALIOPI", l: "certifié" },
                ].map((s) => (
                  <div key={s.l} data-reveal="up">
                    <div className="text-xl font-extrabold tracking-tight text-brand-dark">{s.v}</div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink/55">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BANDE NOIRE : chiffres clés */}
        <section className="overflow-hidden border-b-4 border-brand-green bg-ink py-8 text-white md:py-10">
          <Marquee
            speed={30}
            separator={<span className="mo-pulse-dot mx-10 md:mx-16" style={{ width: 8, height: 8 }} aria-hidden />}
            items={STATS.map((s) => (
              <div key={s.l} className="text-center">
                <div className="whitespace-nowrap text-[1.6rem] font-extrabold tracking-[-0.02em] text-brand-green md:text-3xl">{s.v}</div>
                <div className="mt-1 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-white/60">{s.l}</div>
              </div>
            ))}
          />
        </section>

        {/* TÉMOIGNAGES (fond blanc, cartes noires) */}
        <section className="bg-white px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold tracking-[-0.025em] text-ink" data-reveal="up">
              Ils sont passés à l&apos;<Mark variant="underline">action</Mark>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-base text-ink/65" data-reveal="up" data-delay="80">
              Témoignages vidéo réels de la communauté Rentimmo Academy — clique pour regarder
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-stagger="110">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} data-reveal="up">
                  <a
                    data-tilt
                    href={`https://www.youtube.com/watch?v=${t.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mc-lift group block overflow-hidden rounded-3xl bg-ink text-white shadow-[0_8px_0_#1A6B33]"
                  >
                    <div className="relative aspect-video bg-ink">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://img.youtube.com/vi/${t.videoId}/hqdefault.jpg`}
                        alt={`Témoignage vidéo de ${t.name}`}
                        loading="lazy"
                        className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-ink/25">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-brand-dark transition-transform duration-300 group-hover:scale-110">
                          <Play size={20} className="ml-0.5 fill-current" />
                        </span>
                      </div>
                    </div>
                    <div className="px-5 py-5">
                      <div className="text-base font-bold">{t.name}</div>
                      <div className="mt-0.5 text-[13px] text-white/65">{t.meta}</div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ (crème quadrillé, cartes blanches) */}
        <section className="px-4 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold tracking-[-0.02em] text-ink" data-reveal="up">
              Tes questions, nos <span className="text-brand-dark">réponses</span>
            </h2>
            <div className="mt-8 grid gap-4" data-stagger="90">
              {FAQ.map((f) => (
                <div key={f.q} data-reveal="up">
                  <div className="rounded-3xl border border-ink/10 bg-white px-5 py-5 shadow-[0_6px_0_rgba(26,26,26,0.06)] transition-colors hover:border-brand-green/40 sm:px-6">
                    <div className="text-[15px] font-bold text-ink">{f.q}</div>
                    <div className="mt-1.5 text-sm leading-relaxed text-ink/65">{f.a}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* SECOND CTA (carte noire) */}
            <div className="mt-14" data-reveal="scale">
              <div className="mc-lift isolate rounded-3xl bg-ink px-5 py-10 text-center text-white shadow-[0_8px_0_#1A6B33] sm:px-10">
                <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-extrabold leading-tight tracking-[-0.02em]">
                  Tu hésites encore ?<br />Inscris-toi, <Mark>c&apos;est gratuit.</Mark>
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-base text-white/65">
                  0€ · aucun engagement · tu peux accéder à la masterclass maintenant et décider ensuite.
                </p>
                <button type="button" onClick={scrollToForm} data-magnetic className="btn-primary cta-pulse mo-shine mt-7 hover:gap-3">
                  ↑ Accéder à la masterclass gratuite
                </button>
              </div>
            </div>
          </div>
        </section>

        <FunnelFooter />
        {/* Réserve la place de la barre CTA mobile sous le footer */}
        <div aria-hidden className="h-[76px] bg-ink md:hidden" />

        {/* STICKY MOBILE CTA : visible quand ni l'accroche ni le formulaire ne sont à l'écran */}
        <StickyCta watch={["#mc-hero", "#mc-form"]} onClick={scrollToForm} className="btn-primary w-full py-3.5 text-[15px]">
          🎁 Accéder à la masterclass gratuite →
        </StickyCta>
      </div>
  );
}