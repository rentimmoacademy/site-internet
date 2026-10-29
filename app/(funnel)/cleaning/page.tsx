"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BadgeCheck, Check, Handshake, House, Play, Sparkles, Wallet } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { Accordion, Marquee, Motion, StickyCta, Words, delay } from "@/components/motion";
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

const STRIP = ["Premier client", "Premier encaissement", "Sans local", "Sans capital", "De « je fais le ménage » à « je dirige une équipe »", "Présentation offerte"];

const FIELDS = [
  { name: "firstName", label: "Prénom", type: "text", ph: "Ton prénom", ac: "given-name", mode: undefined },
  { name: "email", label: "Email", type: "email", ph: "ton@email.com", ac: "email", mode: "email" as const },
  { name: "phone", label: "WhatsApp", type: "tel", ph: "+33 6 12 34 56 78", ac: "tel", mode: "tel" as const },
];

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- briques de page ---------- */

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
            <span className="cl-dot">
              {st === "done" ? <Check size={13} strokeWidth={3.5} aria-hidden /> : n}
            </span>
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
    <header className="cl-head">
      <div className="cl-wrap cl-head-row">
        <Logo />
        <Stepper step={step} callSeen={callSeen} />
        <div className="cl-qualiopi">
          <BadgeCheck size={16} aria-hidden /> <span><span className="cl-q-long">Organisme </span>QUALIOPI</span>
        </div>
      </div>
      <div className="cl-wrap cl-steps-wrap--mobile">
        <Stepper step={step} callSeen={callSeen} />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="cl-foot">
      <strong>Rentimmo Academy</strong> · Marwan AFASSI · Organisme certifié QUALIOPI · © 2026
      <br />
      <a href="/mentions-legales/">Mentions légales</a> · <a href="/cgv/">CGV</a> · <a href="/politique-confidentialite/">Confidentialité</a>
    </footer>
  );
}

function Aurora() {
  return (
    <div className="mo-aurora" aria-hidden>
      <span className="mo-blob mo-blob--a" />
      <span className="mo-blob mo-blob--b" />
    </div>
  );
}

/* ---------- page ---------- */

export default function CleaningPage() {
  const [step, setStep] = useState<Step>("form");
  const [leaving, setLeaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [callSeen, setCallSeen] = useState(false);
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

  // Changement d'étape : on met le focus sur le titre pour les lecteurs d'écran / le clavier.
  useEffect(() => {
    if (step === "video") h1Ref.current?.focus({ preventScroll: true });
  }, [step]);

  function goToForm() {
    const card = document.getElementById("cl-form");
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
      // Transition : la carte et le héros sortent en douceur, puis l'étape vidéo entre en scène.
      const quick = reducedMotion();
      setLeaving(true);
      window.setTimeout(() => {
        setStep("video");
        setLeaving(false);
        window.scrollTo({ top: 0, behavior: quick ? "auto" : "smooth" });
      }, quick ? 0 : 420);
    } catch {
      setErrs({ global: "Erreur réseau. Vérifie ta connexion et réessaie." });
      setLoading(false);
    }
  }

  /* ===== ÉTAPE 2 : vidéo ===== */
  if (step === "video") {
    return (
      <div className="cl-root cl-step-in">
        <Motion deps="video" />
        <div className="mo-progress" data-mo-progress aria-hidden />
        <Topbar step={step} callSeen={callSeen} />
        <section className="cl-dark cl-vid-hero" aria-labelledby="cl-vid-title">
          <Aurora />
          <div className="cl-wrap">
            <div className="cl-badge mo-enter-pop">
              <span className="cl-ok">
                <svg className="mo-check" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M2.5 6.5l2.4 2.4 4.6-5" />
                </svg>
              </span>
              Accès débloqué · Présentation Cleaning BnB Academy
            </div>
            <h1 id="cl-vid-title" className="cl-vid-h1" ref={h1Ref} tabIndex={-1} style={{ outline: "none" }}>
              <Words text="Du premier client au" start={0} /> <span className="cl-hl"><Words text="premier encaissement" start={4} /></span>
            </h1>
          </div>
          <div className="cl-frame-wrap mo-enter-pop" style={delay(250)}>
            <div className="mo-halo">
              <div className="cl-frame mo-skeleton" id="cl-video">
                <div className="cl-frame-inner">
                  {CLEANING_VIDEO_ID ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${CLEANING_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
                      title="Présentation Cleaning BnB Academy"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.7)", padding: 24, textAlign: "center" }}>
                      La présentation arrive très bientôt. Réserve ton appel ci-dessous, on te l&apos;envoie avant.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="cl-call" id="cl-call" data-reveal="up">
            <div className="cl-call-card">
              <h2>Tu veux savoir si c&apos;est fait pour toi ?</h2>
              <p className="cl-lead">Réserve un appel avec Marwan. On regarde ta situation et on voit si la formation peut t&apos;accompagner.</p>
              <a
                className="cl-btn mo-shine"
                data-magnetic
                href={CLEANING_CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackEvent("cleaning_call_click");
                  trackMeta("Schedule", { content_name: "cleaning" });
                }}
              >
                Réserver mon appel offert <ArrowRight size={20} aria-hidden />
              </a>
              <p className="cl-fine">Gratuit · Sans engagement</p>
            </div>
          </div>
        </section>
        <section className="cl-vid-faq" aria-labelledby="cl-faq2">
          <div className="cl-wrap">
            <div className="cl-vid-faq-head" data-reveal="up">
              <h2 id="cl-faq2" className="cl-h2">Tes questions, nos réponses</h2>
            </div>
            <div className="cl-faq">
              <Accordion items={FAQ} />
            </div>
          </div>
        </section>
        <Footer />
        <StickyCta
          watch={["#cl-video", "#cl-call"]}
          rescan={step}
          href={CLEANING_CAL_URL}
          external
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
    <div className={`cl-root${leaving ? " cl-leave" : ""}`}>
      <Motion deps="form" />
      <div className="mo-progress" data-mo-progress aria-hidden />
      <Topbar step={step} callSeen={false} />

      <section className="cl-dark cl-hero" aria-labelledby="cl-title">
        <Aurora />
        <div className="cl-wrap cl-hero-grid">
          <div>
            <div className="cl-badge mo-enter" style={delay(0)}>
              <span className="mo-pulse-dot" aria-hidden /> Présentation offerte · accès immédiat
            </div>
            <h1 id="cl-title" className="cl-h1">
              <Words text="Monte ton activité de ménage Airbnb de A à Z :" /> <span className="cl-hl"><Words text="signe ton premier client et encaisse" start={11} /></span>
            </h1>
            <p className="cl-sub mo-enter" style={delay(250)}>
              Une présentation vidéo par Marwan AFASSI : plus de 7 ans en location courte durée, du ménage Airbnb au premier client, puis au premier encaissement.
            </p>
            <ul className="cl-chips mo-enter" style={delay(380)}>
              {["Gratuit", "Sans carte bancaire", "Accès immédiat"].map((c) => (
                <li key={c} className="cl-chip"><Check size={14} strokeWidth={3} aria-hidden /> {c}</li>
              ))}
            </ul>
          </div>

          <div className="mo-enter-pop" style={delay(150)}>
            <div className="cl-card mo-borderspin" id="cl-form">
              <div className="cl-card-in">
                <h2>Reçois la présentation maintenant</h2>
                <p className="cl-note">Renseigne tes infos. Tu accèdes à la vidéo dans 10 secondes.</p>
                <form onSubmit={handleSubmit} noValidate aria-busy={loading}>
                  {FIELDS.map((f) => (
                    <div key={f.name} className="cl-field">
                      <label htmlFor={`cl-${f.name}`}>{f.label}</label>
                      <input
                        id={`cl-${f.name}`}
                        className="cl-input"
                        name={f.name}
                        type={f.type}
                        placeholder={f.ph}
                        autoComplete={f.ac}
                        inputMode={f.mode}
                        enterKeyHint={f.name === "phone" ? "go" : "next"}
                        aria-invalid={!!errs[f.name]}
                        aria-describedby={errs[f.name] ? `cl-${f.name}-err` : undefined}
                        disabled={loading}
                      />
                      {errs[f.name] && <p id={`cl-${f.name}-err`} role="alert" className="cl-err">{errs[f.name]}</p>}
                    </div>
                  ))}
                  {errs.global && <div role="alert" className="cl-gerr">{errs.global}</div>}
                  <button type="submit" disabled={loading} className="cl-btn mo-shine" data-magnetic>
                    {loading ? (
                      <>
                        <span className="cl-spin" aria-hidden /> Préparation de ton accès…
                      </>
                    ) : (
                      <>
                        J&apos;accède à la présentation <ArrowRight size={20} aria-hidden />
                      </>
                    )}
                  </button>
                  <p className="cl-fine">
                    En validant, tu acceptes de recevoir la présentation et des messages de Rentimmo Academy par email et WhatsApp. Désinscription possible à tout moment.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cl-strip" aria-label="Au programme">
        <Marquee items={STRIP} itemClassName="cl-strip-item" />
      </div>

      <section className="cl-sec" aria-labelledby="cl-prog">
        <div className="cl-wrap">
          <div className="cl-sec-head" data-reveal="up">
            <span className="cl-eyebrow">Au programme</span>
            <h2 id="cl-prog" className="cl-h2">Ce que tu vas découvrir dans la présentation</h2>
          </div>
          <div className="cl-bento" data-stagger="110">
            {BULLETS.map(({ Icon, t }, i) => {
              const k = ["a", "b", "c", "d"][i];
              return (
                <div key={t} className={`cl-cell cl-cell--${k}`} data-reveal={i % 2 ? "left" : "up"}>
                  <div className={`cl-tile cl-tile--${k}`} data-tilt>
                    <div className="cl-tile-top">
                      <span className="cl-ico"><Icon size={22} aria-hidden /></span>
                      <span className="cl-num" aria-hidden>0{i + 1}</span>
                    </div>
                    <p>{t}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cl-center-cta" data-reveal="up">
            <button type="button" className="cl-btn cl-btn--inline" data-magnetic onClick={goToForm}>
              Recevoir la présentation <ArrowRight size={20} aria-hidden />
            </button>
          </div>
        </div>
      </section>

      <section className="cl-sec cl-how" aria-labelledby="cl-how">
        <div className="cl-wrap">
          <div className="cl-sec-head" data-reveal="up">
            <span className="cl-eyebrow">Comment ça marche</span>
            <h2 id="cl-how" className="cl-h2">3 étapes, de l&apos;inscription à l&apos;appel</h2>
          </div>
          <ol className="cl-how-grid" data-stagger="140">
            <li className="mo-fill mo-fill--x" data-scrollfill aria-hidden="true" />
            {[
              ["Tu t'inscris", "Prénom, email et WhatsApp. Aucune carte bancaire demandée."],
              ["Tu regardes la présentation", "Accès immédiat, juste après ton inscription."],
              ["Tu réserves ton appel offert", "Si ça te parle, tu choisis un créneau avec Marwan. Gratuit, sans engagement."],
            ].map(([h, p], i) => (
              <li key={h} className="cl-step" data-reveal="up">
                <span className="cl-step-n" aria-hidden>{i + 1}</span>
                <h3>{h}</h3>
                <p>{p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cl-sec cl-dark" aria-labelledby="cl-who" style={{ position: "relative", overflow: "hidden" }}>
        <Aurora />
        <div className="cl-wrap cl-pres" style={{ position: "relative", zIndex: 1 }}>
          <div className="cl-photo" data-reveal="scale">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marwan.webp" alt="Marwan AFASSI, fondateur de Rentimmo Academy" width={500} height={606} loading="lazy" decoding="async" />
            <div className="cl-photo-tag"><BadgeCheck size={18} aria-hidden /> Organisme certifié QUALIOPI</div>
          </div>
          <div data-reveal="up">
            <span className="cl-eyebrow">Qui te présente la méthode</span>
            <h2 id="cl-who" className="cl-h2">Marwan AFASSI, fondateur de Rentimmo Academy</h2>
            <p className="cl-lead">Plus de 7 ans en location courte durée. Dans cette présentation, il te montre comment partir de zéro dans le ménage Airbnb et construire une vraie activité.</p>
            <div className="cl-stats" data-stagger="120">
              <div className="cl-stat" data-reveal="up"><strong><span data-count="7" data-suffix="+">7+</span></strong><span>ans en location courte durée</span></div>
              <div className="cl-stat" data-reveal="up"><strong><span data-count="3">3</span></strong><span>étapes jusqu&apos;à l&apos;appel</span></div>
              <div className="cl-stat" data-reveal="up"><strong><span data-count="10" data-suffix=" s">10 s</span></strong><span>pour t&apos;inscrire</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="cl-sec" aria-labelledby="cl-faq">
        <div className="cl-wrap">
          <div className="cl-sec-head" data-reveal="up">
            <span className="cl-eyebrow">FAQ</span>
            <h2 id="cl-faq" className="cl-h2">Tes questions, nos réponses</h2>
          </div>
          <div className="cl-faq" data-stagger="90">
            <Accordion items={FAQ} />
          </div>
        </div>
      </section>

      <section className="cl-final" id="cl-final-sec" aria-labelledby="cl-final">
        <Aurora />
        <div className="cl-wrap" style={{ position: "relative", zIndex: 1 }} data-reveal="up">
          <h2 id="cl-final">Prêt à voir la présentation ?</h2>
          <p>Gratuit, sans carte bancaire, accès immédiat.</p>
          <button type="button" className="cl-btn cl-btn--light cl-btn--inline mo-shine" data-magnetic onClick={goToForm}>
            <Play size={18} aria-hidden /> Je m&apos;inscris maintenant
          </button>
        </div>
      </section>

      <Footer />

      <StickyCta watch={["#cl-form", "#cl-final-sec"]} rescan={step} onClick={goToForm}>
        Recevoir la présentation <ArrowRight size={18} aria-hidden />
      </StickyCta>
    </div>
  );
}
