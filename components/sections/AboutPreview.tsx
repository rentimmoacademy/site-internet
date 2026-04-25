"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function AboutPreview() {
  return (
    <section className="relative overflow-hidden bg-ink py-28">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        {/* Portrait block */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm lg:mx-0"
        >
          {/* Airbnb-style host card */}
          <div className="rounded-3xl border border-white/10 bg-[#1f1f1f] p-6">
            <div className="flex items-start gap-5">
              <div className="relative flex-shrink-0">
                <div
                  className="h-20 w-20 rounded-full bg-brand-green bg-cover bg-center ring-2 ring-brand-green/40"
                  style={{ backgroundImage: "url(/marwan.jpg)" }}
                  aria-label="Portrait de Marwan Afassi"
                />
                <span className="absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-ink text-[12px] font-bold">
                  ✓
                </span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-widest text-brand-green">Fondateur · Hôte vérifié</p>
                <p className="mt-1 text-xl font-extrabold tracking-tight text-white">Marwan Afassi</p>
                <p className="text-sm text-white/55">Ingénieur industriel · Papa</p>
              </div>
            </div>

            {/* Airbnb-style stats triple */}
            <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-5">
              <div className="pr-3">
                <p className="text-2xl font-extrabold tracking-tight text-white">1 196</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-widest text-white/50">
                  évaluations
                </p>
              </div>
              <div className="px-3">
                <p className="flex items-baseline gap-0.5 text-2xl font-extrabold tracking-tight text-white">
                  4,93<span className="text-base text-warning">★</span>
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-widest text-white/50">
                  note globale
                </p>
              </div>
              <div className="pl-3">
                <p className="text-2xl font-extrabold tracking-tight text-white">6</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-widest text-white/50">
                  ans hôte
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="tag mb-5 text-brand-green">Le fondateur</p>
          <h2 className="text-h2 font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
            Marwan Afassi —{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              ingénieur, papa, praticien LCD.
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            Ingénieur industriel, papa, lancé avec <span className="text-white">1 000 € de budget</span>.
            J'ai fait <span className="text-white">+500 000 € de chiffre d'affaires</span> sans jamais
            être propriétaire — juste en maîtrisant la sous-location et la conciergerie.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            <span className="text-white">6 ans hôte Airbnb</span>, plus de{" "}
            <span className="text-white">1 196 évaluations</span> et une moyenne de{" "}
            <span className="text-white">4,93/5</span>. Aujourd'hui, je mets toute cette expertise — et
            celle de nos équipes consultants — à ta disposition.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              ["1 000 €", "Budget de départ"],
              ["+500 K€", "Générés sans être proprio"],
              ["2 pays", "France & Maroc"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-3xl font-extrabold tracking-tight text-white">{v}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-white/50">{l}</p>
              </div>
            ))}
          </div>

          <Link href="/a-propos" className="btn-ghost mt-10">
            Lire mon parcours <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
