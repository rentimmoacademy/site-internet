"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import CallGate from "@/components/CallGate";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SuperBnbHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-32 text-white">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-lime/[0.12] blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-lime/[0.07] blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-32 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="container-x relative z-10 py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-ink"
        >
          <Sparkles size={12} /> Programme, pas une formation
        </motion.div>

        <h1 className="isolate mt-8 max-w-5xl text-white text-[clamp(2.5rem,6.5vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
          Automatise ton Airbnb en <span className="text-lime">30 jours.</span> On le fait avec toi.
        </h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
        >
          Un accompagnement sur mesure pour les hôtes Airbnb actifs qui veulent{" "}
          <span className="font-semibold text-white">reprendre leur temps</span>.
          Annonce, messages, pricing, domotique, outils IA : on configure tout avec ton coach dédié.
          Un format encore rare sur le marché francophone de la location courte durée.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <CallGate
            href="https://cal.com/rentimmoacademy/superbnbacademy?overlayCalendar=true"
            className="inline-flex items-center gap-2 rounded-full bg-lime px-7 py-4 font-bold text-ink shadow-[0_6px_0_#5E8A0A] transition-all hover:-translate-y-0.5 hover:bg-lime-dark hover:shadow-[0_8px_0_#5E8A0A] motion-reduce:hover:translate-y-0"
          >
            Réserver mon audit gratuit <ArrowRight size={16} />
          </CallGate>
          <Link
            href="#programme"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-4 font-bold text-white transition-colors duration-300 hover:border-lime hover:text-lime"
          >
            Voir le programme
          </Link>
        </motion.div>

        {/* Trust badge */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="mt-14 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-[#262626] px-5 py-4 text-white shadow-[0_6px_0_#5E8A0A]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime/15 text-lime">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-lime">Propulsé par Superhote</p>
            <p className="text-sm font-bold text-white">
              Le channel manager qui centralise <span className="text-lime">tous tes calendriers et messages</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
