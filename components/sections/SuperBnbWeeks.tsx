"use client";

import { motion } from "framer-motion";
import Highlight from "@/components/ui/Highlight";

const weeks = [
  {
    n: "S1",
    week: "Semaine 1",
    title: "Restitution du diagnostic",
    desc: "Diagnostic complet de ta situation réelle : annonce, positionnement, protocole photo professionnel, refonte de ton annonce Airbnb de zéro. Bilan avant toute action.",
    deliverable: "Diagnostic 360 + annonce Airbnb refondue",
  },
  {
    n: "S2",
    week: "Semaine 1",
    title: "Stratégie annonces",
    desc: "Création de ta fiche Booking, plan 3D de ton logement, ajustements de ton positionnement pour maximiser ta visibilité.",
    deliverable: "Fiche Booking créée + plan 3D",
  },
  {
    n: "S3",
    week: "Semaine 2",
    title: "Architecture de l'automatisation",
    desc: "Setup Superhote, séquences de messages voyageurs, mode autopilote, cautions automatiques et Kit Autonomie (serrure connectée TTLock).",
    deliverable: "PMS configuré + Kit Autonomie installé",
  },
  {
    n: "S4",
    week: "Semaine 3",
    title: "Revenue management",
    desc: "Mise en place de PriceLabs, stratégie tarifaire dynamique et cockpit de pilotage personnalisé pour suivre ta rentabilité semaine par semaine.",
    deliverable: "Stratégie tarifaire + Cockpit personnalisé",
  },
  {
    n: "S5",
    week: "Semaine 4",
    title: "Indépendance et acquisition",
    desc: "Site de réservation directe avec paiement Stripe intégré, fiche Google optimisée pour renforcer ta visibilité locale.",
    deliverable: "Site de réservation directe live",
  },
  {
    n: "S6",
    week: "Semaine 4",
    title: "Pilotage et plan 12 mois",
    desc: "Accès à la bibliothèque de ressources et construction de ton plan d'action sur 12 mois pour piloter ton activité en autonomie.",
    deliverable: "Bibliothèque + plan 12 mois",
  },
];

export default function SuperBnbWeeks() {
  return (
    <section id="programme" className="relative border-y border-white/10 bg-ink py-28 text-white">
      <div className="container-x relative">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-lime">
          Le programme
        </p>
        <h2 className="isolate mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          4 semaines · 6 sessions.{" "}
          <Highlight color="lime">Un Airbnb autopiloté.</Highlight>
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-white/70">
          Chaque semaine, un objectif clair, un livrable concret, et ton coach dédié qui exécute avec toi. Entre les sessions, un groupe d&apos;accompagnement dédié pour ne jamais rester bloqué.
        </p>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {weeks.map((w, i) => (
            <motion.article
              key={w.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="h-full rounded-3xl border border-white/10 bg-[#262626] p-8 text-white shadow-[0_8px_0_#5E8A0A] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_0_#B6F23A] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <div className="flex items-start gap-5">
                  <span className="text-5xl font-extrabold tracking-tight text-lime">{w.n}</span>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-lime/80">
                      {w.week}
                    </p>
                    <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-white">{w.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">{w.desc}</p>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-lime px-3 py-1.5 text-xs font-bold text-ink">
                      <span className="h-1.5 w-1.5 rounded-full bg-ink" /> Livrable : {w.deliverable}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
