"use client";

import { motion } from "framer-motion";

const weeks = [
  {
    n: "01",
    title: "Diagnostic & Annonces",
    desc: "On reprend ton annonce de zéro : titre, photos, description, équipements, règles, prix de base. Bilan complet de ta situation réelle avant toute action. Objectif : taux de conversion x2.",
    deliverable: "Annonce refondue + checklist photo pro",
  },
  {
    n: "02",
    title: "Automatisation",
    desc: "Setup Superhote, séquences de messages voyageurs, intégration Stripe pour les acomptes et cautions, calendrier multi-plateformes. Ton Airbnb tourne sans toi.",
    deliverable: "PMS configuré + 12 messages auto activés",
  },
  {
    n: "03",
    title: "Revenus & Indépendance",
    desc: "Mise en place de PriceLabs, règles de pricing dynamique, site de réservation directe (0% de commission), tableau de bord de pilotage. On suit la rentabilité semaine par semaine.",
    deliverable: "PriceLabs paramétré + site direct live",
  },
  {
    n: "04",
    title: "Domotique, Pilotage & Scale",
    desc: "Kit domotique offert et installé : serrure connectée, détecteur fumée, détecteur nuisance sonore, kit radiateur économie énergie. GPTs personnalisés, cockpit Notion et outils IA pour piloter plusieurs biens.",
    deliverable: "Kit domotique livré + GPTs + cockpit perso",
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
          4 semaines · 6 sessions.{" "}
          <span className="bg-auto-mint bg-clip-text text-transparent">Un Airbnb autopiloté.</span>
        </h2>
        <p className="mt-5 max-w-2xl text-lg text-white/70">
          Chaque semaine, un objectif clair, un livrable concret, et ton coach dédié qui exécute avec toi. Entre les sessions, un groupe d&apos;accompagnement dédié pour ne jamais rester bloqué.
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
