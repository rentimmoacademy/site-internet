"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users } from "lucide-react";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AutomaticBnbHero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-auto-navy pt-32 font-poppins text-white">
      <div className="dot-grid-mint pointer-events-none absolute inset-0 [background-size:32px_32px]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-auto-mint/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-auto-mint/10 blur-[140px]" />

      <div className="container-x relative z-10 py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 rounded-full border border-auto-mint/40 bg-auto-mint/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-auto-mint"
        >
          <Sparkles size={12} /> Programme — Pas une formation
        </motion.div>

        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-5xl text-[clamp(2.5rem,6.5vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em]"
        >
          Automatise ton Airbnb en{" "}
          <span className="bg-auto-mint bg-clip-text text-transparent">30 jours.</span>{" "}
          On le fait avec toi.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl"
        >
          Un accompagnement sur mesure pour les hôtes Airbnb actifs qui veulent reprendre leur temps.
          Annonce, messages, pricing, réservation directe — on configure tout avec toi.
        </motion.p>

        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="https://cal.com/rentimmo-academy/appel-strategique"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-auto-mint px-7 py-4 font-bold text-auto-navy transition-all hover:scale-[1.02] hover:shadow-glow-mint"
          >
            Rejoindre le programme <ArrowRight size={16} />
          </a>
          <Link
            href="#programme"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            Voir le programme
          </Link>
        </motion.div>

        {/* Available seats */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="mt-14 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-auto-mint/15 text-auto-mint">
            <Users size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/60">Cohorte avril-mai 2026</p>
            <p className="text-sm font-bold">
              <span className="text-auto-mint">3 places</span> sur 8 disponibles
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
