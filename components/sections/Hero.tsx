"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MousePointer2 } from "lucide-react";
import StatCounter from "@/components/StatCounter";
import CallGate from "@/components/CallGate";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-24">
      {/* Dot grid */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-80" />
      {/* Green glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-green/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-brand-dark/30 blur-[120px]" />

      <div className="container-x relative z-10 py-20">
        {/* Floating badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur"
        >
          <span className="flex items-center gap-1">
            <span>🇫🇷</span>
            <span>🇲🇦</span>
          </span>
          Formation disponible en France & Maroc
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="max-w-5xl text-[clamp(2.5rem,6.5vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-white"
        >
          Génère <span className="bg-brand-gradient bg-clip-text text-transparent">+700 €/mois</span>{" "}
          avec ton premier logement Airbnb.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
        >
          La formation terrain pour lancer ta sous-location, ta conciergerie Airbnb ou ton activité
          de ménage pro. <span className="text-white">Sans banque, sans crédit, sans apport.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link href="/formations" className="btn-primary">
            Découvrir les formations <ArrowRight size={18} />
          </Link>
          <CallGate
            href="https://cal.com/rentimmo-academy/appel-strategique?overlayCalendar=true"
            className="btn-ghost"
          >
            Réserver un appel stratégique
          </CallGate>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="mt-20 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-4"
        >
          {[
            { label: "ans d'expérience terrain", value: 6 },
            { label: "€ générés sans être propriétaire", value: 500, prefix: "+", suffix: "K" },
            { label: "formations complètes", value: 3 },
            { label: "marchés couverts", value: 2, labelExtra: "France & Maroc" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm uppercase tracking-widest text-white/50">
                {s.labelExtra ?? s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-white/40"
        >
          <MousePointer2 size={14} />
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
