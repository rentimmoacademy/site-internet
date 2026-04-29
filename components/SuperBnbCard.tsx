"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Sparkles, Zap } from "lucide-react";

const bullets = [
  "Audit + optimisation complète de ton annonce",
  "Automatisation messages, pricing, check-in",
  "Site de réservation directe + outils IA",
];

export default function SuperBnbCard() {
  return (
    <section className="relative overflow-hidden bg-auto-navy py-24 font-poppins text-white">
      {/* Mint dot grid + glow */}
      <div className="dot-grid-mint pointer-events-none absolute inset-0 [background-size:32px_32px]" />
      <div className="pointer-events-none absolute -left-20 top-10 h-[400px] w-[400px] rounded-full bg-auto-mint/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-[400px] w-[400px] rounded-full bg-auto-mint/15 blur-[120px]" />

      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint">
            Programme accompagnement — 30 jours
          </p>
          <h2 className="mx-auto mt-6 max-w-2xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Tu as déjà un bien Airbnb ?{" "}
            <span className="bg-auto-mint bg-clip-text text-transparent">
              Ce programme est fait pour toi.
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-14 max-w-5xl"
        >
          <div className="grid gap-0 overflow-hidden rounded-3xl border border-white/10 bg-auto-navy-soft/70 backdrop-blur md:grid-cols-[1.2fr_1fr]">
            {/* Left content */}
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-auto-mint text-auto-navy">
                  <Cpu size={22} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-auto-mint">
                    Super BnB Academy
                  </p>
                  <p className="text-2xl font-extrabold tracking-tight">On le fait avec toi.</p>
                </div>
              </div>

              <p className="mt-7 text-base leading-relaxed text-white/75 md:text-lg">
                Pas une formation vidéo. Un{" "}
                <span className="text-white">accompagnement sur mesure de 30 jours</span> avec un coach
                dédié pour automatiser ton Airbnb : annonce, messages, pricing, réservation directe,
                outils IA.
              </p>

              <ul className="mt-7 space-y-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-white/85">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-auto-mint/15 text-auto-mint">
                      <Sparkles size={12} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/super-bnb-academy"
                  className="inline-flex items-center gap-2 rounded-full bg-auto-mint px-7 py-3.5 text-sm font-bold text-auto-navy transition-all hover:scale-[1.02] hover:shadow-glow-mint"
                >
                  Découvrir le programme <ArrowRight size={14} />
                </Link>
                <Link
                  href="/super-bnb-academy#programme"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
                >
                  Voir les 4 semaines
                </Link>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative flex flex-col justify-between gap-4 border-l border-white/5 bg-auto-navy/60 p-8 md:p-10">
              {/* Floating cockpit-style cards */}
              <div className="rounded-2xl border border-auto-mint/30 bg-auto-mint/10 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-auto-mint">Pricing live</span>
                  <Zap size={12} className="text-auto-mint" />
                </div>
                <p className="mt-2 text-3xl font-extrabold tracking-tight">+38%</p>
                <p className="text-xs text-white/60">de revenus moyens / nuit</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="text-[10px] uppercase tracking-widest text-white/60">Messages auto</span>
                <p className="mt-2 text-3xl font-extrabold tracking-tight">98%</p>
                <p className="text-xs text-white/60">des messages sans intervention</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <span className="text-[10px] uppercase tracking-widest text-white/60">Temps gagné</span>
                <p className="mt-2 text-3xl font-extrabold tracking-tight">8h / sem</p>
                <p className="text-xs text-white/60">en moyenne sur la gestion</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
