"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Users } from "lucide-react";
import CallGate from "@/components/CallGate";

const badges = [
  { icon: Shield, label: "Garantie 60 jours" },
  { icon: Clock, label: "Accès à vie" },
  { icon: Users, label: "Experts terrain dédiés" },
];

/**
 * Bloc CTA final : grande carte noire (ombre posée verte) sur fond clair.
 * Volontairement pas une bande pleine largeur : la section précède souvent
 * directement le footer noir, on évite ainsi deux bandes sombres collées.
 */
export default function FinalCTA() {
  return (
    <section className="relative py-20 md:py-24">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-white shadow-[0_10px_0_#1A6B33] md:px-12 md:py-20"
        >
          <div className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-20" />
          <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-80 w-80 rounded-full bg-brand-green/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 -z-10 h-80 w-80 rounded-full bg-brand-light/10 blur-3xl" />

          <h2 className="mx-auto max-w-4xl text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
            Chaque semaine d&apos;attente ={" "}
            <span className="text-brand-light">700 à 1 500 €</span> qui n&apos;entrent pas.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/65">
            Choisis ta formation, applique dès le premier module. Les premiers revenus arrivent dans les 60 jours — ou on te rembourse.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/formations"
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-8 py-4 font-bold text-ink transition-all hover:gap-3 hover:bg-brand-light"
            >
              Voir les formations <ArrowRight size={16} />
            </Link>
            <CallGate
              href="https://cal.com/rentimmoacademy/appel-strategique?overlayCalendar=true"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-4 font-bold text-white transition-colors hover:border-white/60 hover:bg-white/10"
            >
              Réserver un appel stratégique
            </CallGate>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {badges.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-sm font-semibold text-white/75">
                <b.icon size={16} className="text-brand-green" /> {b.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
