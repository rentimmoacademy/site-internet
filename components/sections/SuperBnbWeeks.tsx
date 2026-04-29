"use client";

import { motion } from "framer-motion";

const weeks = [
  {
    n: "01",
    title: "Audit & optimisation de l'annonce",
    desc: "On reprend ton annonce de zéro : titre, photos, description, équipements, règles, prix de base. Objectif : taux de conversion x2.",
    deliverable: "Annonce refondue + checklist photo pro",
  },
  {
    n: "02",
    title: "Automatisation complète",
    desc: "Setup Superhote, séquences de messages voyageurs, intégration Stripe pour les acomptes et cautions, calendrier multi-plateformes.",
    deliverable: "PMS configuré + 12 messages auto activés",
  },
  {
    n: "03",
    title: "Revenue management & cockpit",
    desc: "Mise en place de PriceLabs, règles de pricing dynamique, tableau de bord de pilotage. On suit la rentabilité semaine par semaine.",
    deliverable: "PriceLabs paramétré + cockpit perso",
  },
  {
    n: "04",
    title: "Site direct + outils IA",
    desc: "Site de réservation directe (économise 15% de commissions), GPTs personnalisés pour gérer les voyageurs, kit SmartLife (serrure connectée + plan 3D).",
    deliverable: "Site live + GPTs + kit smart livré",
  },
];

export default function SuperBnbWeeks() {
  return (
    <section id="programme" className="relative bg-auto-navy-soft py-28 font-poppins text-white">
      <div className="dot-grid-mint pointer-events-none absolute inset-0 [background-size:32px_32px]" />
      <div className="container-x relative">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint">
          Le programme
        </p>
        <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
          4 semaines.{" "}
          <span className="bg-auto-mint bg-clip-text text-transparent">Un Airbnb autopiloté.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-white/70">
          Chaque semaine, un objectif clair, un livrable concret, et un coach qui exécute avec toi.
        </p>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {weeks.map((w, i) => (
            <motion.article
              key={w.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-white/10 bg-auto-navy/50 p-8 backdrop-blur transition-all hover:-translate-y-1 hover:border-auto-mint/40"
            >
              <div className="flex items-start gap-5">
                <span className="text-5xl font-extrabold tracking-tight text-auto-mint">{w.n}</span>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest text-auto-mint/80">
                    Semaine {parseInt(w.n)}
                  </p>
                  <h3 className="mt-1 text-2xl font-extrabold tracking-tight">{w.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{w.desc}</p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-auto-mint/10 px-3 py-1.5 text-xs font-bold text-auto-mint">
                    <span className="h-1.5 w-1.5 rounded-full bg-auto-mint" /> Livrable : {w.deliverable}
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
