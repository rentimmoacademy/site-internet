"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, PlayCircle } from "lucide-react";

const BULLETS = [
  "La méthode pour trouver et négocier un bail commercial en moins de 14 jours",
  "Le calcul de rentabilité que j'utilise en moins de 90 secondes pour valider un appart",
  "Le modèle 100% halal qui démarre avec moins de 4 000€ (zéro crédit conventionnel)",
  "Ma stack tech pour gérer plusieurs logements sans répondre aux clients à 3h du matin",
];

export default function MasterclassPage() {
  const [step, setStep] = useState<"form" | "video">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const source = new URLSearchParams(window.location.search).get("src") || undefined;

    try {
      const resp = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: fd.get("firstName"),
          email: fd.get("email"),
          phone: fd.get("phone") || undefined,
          source,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.message || "Une erreur est survenue. Réessaie dans une minute.");
        setLoading(false);
        return;
      }
      setStep("video");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Connexion impossible. Vérifie ta connexion et réessaie.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      {/* ── Topbar ── */}
      <header className="border-b border-white/8 bg-ink/95 backdrop-blur sticky top-0 z-30">
        <div className="container-x flex items-center justify-between py-4">
          <span className="font-extrabold text-white tracking-tight">
            Rentimmo <span className="text-brand-green">Academy</span>
          </span>
          <span className="rounded-full border border-brand-green/30 bg-brand-green/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-green">
            ✓ Organisme QUALIOPI
          </span>
        </div>
      </header>

      {step === "form" ? (
        /* ══════════════ OPTIN STEP ══════════════ */
        <section className="dot-grid relative overflow-hidden py-16 md:py-24">
          <div className="container-x relative">
            <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:items-center">

              {/* LEFT — copy */}
              <div>
                <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-green">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
                  Masterclass offerte · accès immédiat
                </span>
                <h1 className="mt-2 text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-white">
                  Sous-location &amp; conciergerie Airbnb :{" "}
                  <span className="text-brand-green">la méthode que j'applique depuis 6 ans</span>
                </h1>
                <p className="mt-5 text-lg text-white/65">
                  Sans crédit conventionnel · sans apport · halal-friendly · validée sur des dizaines de logements
                </p>

                <ul className="mt-8 space-y-3">
                  {BULLETS.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-white/80">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-green/20 text-brand-green">
                        <ShieldCheck size={12} strokeWidth={2.5} />
                      </span>
                      <span className="text-[15px] leading-snug">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6 text-center">
                  {[
                    { num: "+6 ans", label: "d'expérience terrain" },
                    { num: "Dizaines", label: "de logements gérés" },
                    { num: "QUALIOPI", label: "organisme certifié" },
                  ].map(({ num, label }) => (
                    <div key={label}>
                      <div className="text-xl font-extrabold text-brand-green">{num}</div>
                      <div className="text-xs text-white/50">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — form */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:p-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-green">
                  Accès offert · 0€
                </p>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                  Reçois ta masterclass maintenant
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  Renseigne tes infos. Tu accèdes à la vidéo en 10 secondes.
                </p>

                <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-white/80">Prénom</label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      placeholder="Yassine"
                      className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-brand-green/60 focus:ring-1 focus:ring-brand-green/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-white/80">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="toi@exemple.com"
                      className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-brand-green/60 focus:ring-1 focus:ring-brand-green/40"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-white/80">
                      WhatsApp{" "}
                      <span className="font-normal text-white/40">(je t'envoie la masterclass + bonus en privé)</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                      className="w-full rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-brand-green/60 focus:ring-1 focus:ring-brand-green/40"
                    />
                  </div>

                  {error && (
                    <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-6 py-4 font-bold text-ink shadow-glow transition-all hover:scale-[1.02] disabled:opacity-60"
                  >
                    <PlayCircle size={18} />
                    {loading ? "Préparation de ton accès…" : "J'accède à la masterclass maintenant"}
                  </button>

                  <p className="text-center text-[12px] text-white/35">
                    0€ · gratuit &nbsp;·&nbsp; Tes infos sont protégées &nbsp;·&nbsp; Désinscription en 1 clic
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* ══════════════ VIDEO STEP ══════════════ */
        <section className="dot-grid relative overflow-hidden py-16 md:py-20">
          <div className="container-x relative">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-green">
                <PlayCircle size={14} /> Masterclass offerte — accès débloqué
              </span>
              <h1 className="mt-6 text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-white">
                Génère tes premiers revenus Airbnb{" "}
                <span className="text-brand-green">sans crédit, sans apport.</span>
              </h1>
            </div>

            {/* Video */}
            <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl shadow-2xl" style={{ aspectRatio: "16/9" }}>
              <iframe
                src="https://www.youtube.com/embed/QyzwMPk_4yY?rel=0&modestbranding=1&controls=1&playsinline=1&autoplay=1"
                title="Masterclass Sous-Location Airbnb — Rentimmo Academy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>

            {/* CTA appel */}
            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-brand-green/30 bg-brand-green/10 p-8 text-center">
              <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                Tu veux passer à l'action ?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-white/65">
                Réserve 45 min avec Marwan. On analyse ta situation et on voit si la formation peut t'accompagner.
              </p>
              <Link
                href="https://cal.com/rentimmoacademy/appel-strategique"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-4 font-bold text-ink shadow-glow transition-transform hover:scale-[1.03]"
              >
                Réserver mon appel stratégique offert <ArrowRight size={16} />
              </Link>
              <p className="mt-3 text-[12px] text-white/40">45 min · 0€ · Sans engagement</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
