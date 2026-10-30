"use client";

import { motion } from "framer-motion";
import { Target, Zap, Globe2, Users } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const values = [
  {
    icon: Target,
    title: "Formation terrain, pas théorique",
    desc: "Chaque module vient de 6 ans de pratique réelle. Pas de blabla marketing.",
  },
  {
    icon: Zap,
    title: "Applicable immédiatement",
    desc: "Scripts, bails, checklists, outils : tu utilises tout dès la première semaine.",
  },
  {
    icon: Globe2,
    title: "France & Maroc — deux marchés couverts",
    desc: "Chaque formation inclut un module Bonus Maroc : cadre légal, fiscalité, villes, plateformes.",
  },
  {
    icon: Users,
    title: "Une équipe d'experts à tes côtés",
    desc: "Marwan + ses consultants terrain — tu n'apprends pas seul, tu avances avec une équipe opérationnelle.",
  },
];

export default function WhyRentimmo() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="container-x relative">
        <SectionHeader
          tag="Pourquoi Rentimmo Academy"
          title="On forme des pros, pas des"
          underline="rêveurs."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={
                i % 2 === 0
                  ? "group rounded-3xl bg-ink p-8 text-white shadow-[0_8px_0_#1A6B33] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_0_#2DB84B]"
                  : "group rounded-3xl border border-ink/10 bg-white p-8 text-ink shadow-[0_6px_0_rgba(26,26,26,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_0_#2DB84B]"
              }
            >
              <div
                className={
                  i % 2 === 0
                    ? "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/15 text-brand-green ring-1 ring-brand-green/30"
                    : "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-dark ring-1 ring-brand-green/20"
                }
              >
                <v.icon size={22} strokeWidth={2.2} />
              </div>
              <h3 className="mt-6 text-xl font-extrabold leading-snug tracking-tight">{v.title}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${i % 2 === 0 ? "text-white/65" : "text-ink/65"}`}>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
