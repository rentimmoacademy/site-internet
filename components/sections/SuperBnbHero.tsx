"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import CallGate from "@/components/CallGate";
import Highlight from "@/components/ui/Highlight";

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
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 text-ink">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-green/[0.12] blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-brand-green/[0.08] blur-[140px]" />

      <div className="container-x relative z-10 py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-light"
        >
          <Sparkles size={12} /> Programme, pas une formation
        </motion.div>

        <h1 className="mt-8 max-w-5xl text-[clamp(2.5rem,6.5vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
          Automatise ton Airbnb en <Highlight>30 jours.</Highlight> On le fait avec toi.
        </h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70 md:text-xl"
        >
          Un accompagnement sur mesure pour les hôtes Airbnb actifs qui veulent{" "}
          <span className="font-semibold text-ink">reprendre leur temps</span>.
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
            variant="mint"
          >
            Réserver mon audit gratuit <ArrowRight size={16} />
          </CallGate>
          <Link
            href="#programme"
            className="btn-ghost-dark"
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
          className="mt-14 inline-flex items-center gap-3 rounded-2xl bg-ink px-5 py-4 text-white shadow-[0_6px_0_#1A6B33]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green/15 text-brand-green">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-light">Propulsé par Superhote</p>
            <p className="text-sm font-bold text-white">
              Le channel manager qui centralise <span className="text-brand-green">tous tes calendriers et messages</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
