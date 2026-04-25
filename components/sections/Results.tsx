"use client";

import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const results = [
  {
    name: "Karim B.",
    city: "Paris 17e",
    formation: "Sous-Location Academy",
    result: "+1 200 €/mois net sur le premier logement en 45 jours",
    quote:
      "Je bossais en restauration à 1 800 €/mois. Aujourd'hui j'ai 3 logements en sous-location, je dépasse mon salaire et je dors la nuit.",
    accent: "bg-brand-green",
  },
  {
    name: "Sophie L.",
    city: "Lyon",
    formation: "Conciergerie BnB Academy",
    result: "8 mandats signés, 3 200 €/mois de commissions",
    quote:
      "J'ai lancé ma conciergerie en sortant de la formation. 3 mandats le premier mois, 8 au 6e. Et pas un euro d'emprunt.",
    accent: "bg-brand-dark",
  },
  {
    name: "Fatima E.",
    city: "Marrakech",
    formation: "Sous-Location Academy",
    result: "2 riads en sous-location, rentabilité dès le 2e mois",
    quote:
      "Le module Bonus Maroc m'a donné exactement les bons contacts, les bonnes clauses et les bonnes plateformes. Tanger puis Marrakech.",
    accent: "bg-morocco",
  },
];

export default function Results() {
  return (
    <section id="resultats" className="relative overflow-hidden bg-cream py-28 text-ink">
      <div className="dot-grid-light pointer-events-none absolute inset-0 opacity-60" />
      <div className="container-x relative">
        <SectionHeader
          tag="Ils se sont lancés"
          title={
            <>
              Des résultats réels,{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">pas des promesses.</span>
            </>
          }
          subtitle="Des entrepreneurs qui partaient sans capital et qui génèrent aujourd'hui des revenus récurrents, en France comme au Maroc."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {results.map((r, i) => (
            <motion.article
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col rounded-3xl border border-ink/10 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Photo placeholder */}
              <div className={`h-40 rounded-2xl ${r.accent} relative overflow-hidden`}>
                <div className="dot-grid absolute inset-0 opacity-40" />
                <div className="absolute bottom-4 left-4 text-4xl font-extrabold text-white/90">
                  {r.name.charAt(0)}
                </div>
              </div>

              <div className="mt-6 flex items-center gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>

              <p className="mt-4 text-lg font-extrabold leading-snug tracking-tight">{r.result}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">« {r.quote} »</p>

              <div className="mt-6 flex items-end justify-between border-t border-ink/10 pt-4">
                <div>
                  <p className="font-bold">{r.name}</p>
                  <p className="flex items-center gap-1 text-xs text-ink/60">
                    <MapPin size={11} /> {r.city}
                  </p>
                </div>
                <span className="rounded-full bg-ink/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink/60">
                  {r.formation.split(" ")[0]}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
