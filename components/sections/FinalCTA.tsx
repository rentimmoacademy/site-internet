"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Users } from "lucide-react";

const badges = [
  { icon: Shield, label: "Garantie 14 jours" },
  { icon: Clock, label: "Accès à vie" },
  { icon: Users, label: "Experts terrain dédiés" },
];

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand-gradient py-28 text-white">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
      {/* Soft orbs */}
      <div className="pointer-events-none absolute -left-20 top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-brand-light/30 blur-3xl" />

      <div className="container-x relative text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.03em]"
        >
          Prêt à générer tes premiers revenus Airbnb ?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-6 max-w-xl text-lg text-white/85"
        >
          Choisis ta formation, applique dès le premier module, encaisse dans les 30 jours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/formations"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 font-bold text-white transition-transform hover:scale-[1.03]"
          >
            Voir les formations <ArrowRight size={16} />
          </Link>
          <a
            href="https://cal.com/rentimmo-academy/appel-strategique"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            Réserver un appel stratégique
          </a>
        </motion.div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
          {badges.map((b) => (
            <div key={b.label} className="flex items-center gap-2 text-sm font-semibold text-white/85">
              <b.icon size={16} /> {b.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
