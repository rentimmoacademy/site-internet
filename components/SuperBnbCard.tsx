"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Sparkles, Zap, MessageCircle, Timer } from "lucide-react";
import Underline from "@/components/ui/Underline";

const bullets = [
  "Audit + optimisation complète de ton annonce",
  "Automatisation messages, pricing, check-in",
  "Site de réservation directe + outils IA",
];

const stats = [
  { label: "Objectif visé", value: "+30%", sub: "de chiffre d'affaires visé", icon: Zap },
  { label: "Messages auto", value: "24/7", sub: "réponses automatiques aux voyageurs", icon: MessageCircle },
  { label: "Temps visé", value: "15 min", sub: "de gestion quotidienne visée", icon: Timer },
];

export default function SuperBnbCard() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-white">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-lime/[0.08] blur-[140px]" />
      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink">
            <Timer size={12} strokeWidth={2.6} /> Accompagnement 30 jours
          </p>
          <h2 className="isolate mx-auto mt-6 max-w-2xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
            Tu as déjà un bien Airbnb ? Ce programme est fait{" "}
            <Underline color="lime">pour toi.</Underline>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-14 max-w-5xl"
        >
          <div className="grid overflow-hidden rounded-3xl border border-lime/30 bg-[#262626] text-white shadow-[0_8px_0_#5E8A0A] transition-all duration-500 hover:-translate-y-1.5 hover:border-lime/60 hover:shadow-[0_12px_0_#B6F23A] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:grid-cols-[1.2fr_1fr]">
            {/* Left content */}
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime text-ink">
                  <Cpu size={22} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-lime">
                    Super BNB Academy
                  </p>
                  <p className="text-2xl font-extrabold tracking-tight text-white">On le fait avec toi.</p>
                </div>
              </div>

              <p className="mt-7 text-base leading-relaxed text-white/65 md:text-lg">
                Pas une formation vidéo. Un{" "}
                <span className="font-semibold text-white">accompagnement sur mesure de 30 jours</span> avec un coach
                dédié pour automatiser ton Airbnb : annonce, messages, pricing, réservation directe,
                outils IA.
              </p>

              <ul className="mt-7 space-y-3">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-lime/15 text-lime">
                      <Sparkles size={12} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/super-bnb-academy"
                  className="group inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 text-sm font-bold text-ink transition-all hover:gap-3 hover:bg-lime-dark"
                >
                  Découvrir le programme <ArrowRight size={14} />
                </Link>
                <Link
                  href="/super-bnb-academy#programme"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:border-lime hover:text-lime"
                >
                  Voir les 4 semaines
                </Link>
              </div>
            </div>

            {/* Right visual : chiffres clés */}
            <div className="flex flex-col justify-between gap-4 border-t border-white/10 bg-black/20 p-8 md:border-l md:border-t-0 md:p-10">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-lime/80">{s.label}</span>
                    <s.icon size={13} className="text-lime" />
                  </div>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-lime">{s.value}</p>
                  <p className="text-xs text-white/60">{s.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
