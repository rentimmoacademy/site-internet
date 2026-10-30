"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Check, MessageCircle, Video, ClipboardCheck, Flag } from "lucide-react";
import { useReducedMotionAfterMount } from "@/lib/useReducedMotionAfterMount";

// Parcours type d'un élève, construit sur les modules réels des formations (lib/formations.ts).
// Aucun chiffre de résultat : on montre la progression des compétences et le suivi, pas une promesse de revenu.
const stages = [
  {
    when: "Point de départ",
    title: "Tu pars de zéro",
    desc: "Pas de logement, pas d'apport, pas de réseau. Juste l'envie de construire une activité qui tient.",
    status: "Débutant",
    skills: [] as string[],
    follow: { icon: MessageCircle, text: "Accueil dans la communauté Discord" },
  },
  {
    when: "Les bases",
    title: "Tu comprends le cadre",
    desc: "Statut, cadre légal, fiscalité, modèle économique : tu sais ce que tu as le droit de faire, et comment.",
    status: "En formation",
    skills: ["Cadre légal", "Statut & fiscalité"],
    follow: { icon: Video, text: "Modules vidéo + modèles prêts à l'emploi" },
  },
  {
    when: "Premiers contacts",
    title: "Tu prospectes avec méthode",
    desc: "Scripts, canaux qui marchent, réponses aux objections : tu contactes propriétaires ou clients sans improviser.",
    status: "Sur le terrain",
    skills: ["Prospection", "Gestion des objections"],
    follow: { icon: MessageCircle, text: "Tes questions traitées par l'équipe" },
  },
  {
    when: "Premier accord",
    title: "Tu signes ton premier dossier",
    desc: "Bail, mandat ou contrat client : tu sécurises l'accord avec les bonnes clauses, pas à pas.",
    status: "Premier dossier",
    skills: ["Négociation", "Contrats & clauses"],
    follow: { icon: ClipboardCheck, text: "Relecture de ton dossier avant signature" },
  },
  {
    when: "Lancement",
    title: "Tu lances l'activité",
    desc: "Annonce, photos, prix, protocole ménage : ton premier logement ou ton premier client tourne pour de vrai.",
    status: "En activité",
    skills: ["Annonce & photos", "Pricing", "Protocoles terrain"],
    follow: { icon: Video, text: "Coaching selon ta formule" },
  },
  {
    when: "Autonomie",
    title: "Tu deviens autonome",
    desc: "Automatisation, délégation, process : tu sais reproduire et passer à plusieurs logements.",
    status: "Autonome",
    skills: ["Automatisation", "Délégation & process"],
    follow: { icon: Flag, text: "Plan pour passer à l'échelle" },
  },
];

function skillsUpTo(i: number) {
  return stages.slice(0, i + 1).flatMap((s) => s.skills);
}

function Intro({ dark = false }: { dark?: boolean }) {
  return (
    <div className="max-w-xl">
      <p className="tag mb-5 text-brand-dark">L&apos;accompagnement</p>
      <h2 className={`text-h2 font-extrabold leading-[1.05] tracking-[-0.02em] ${dark ? "text-white" : "text-ink"}`}>
        De zéro à autonome,{" "}
        <span className="bg-brand-gradient bg-clip-text text-transparent">on avance avec toi.</span>
      </h2>
    </div>
  );
}

function StudentCard({ index }: { index: number }) {
  const stage = stages[index];
  const skills = skillsUpTo(index);
  const done = index === stages.length - 1;
  const progress = (index + 1) / stages.length;

  return (
    <div
      className={`relative w-full max-w-md rounded-[2rem] border bg-white p-7 shadow-[0_30px_80px_-30px_rgba(26,26,26,0.35)] transition-colors duration-700 ${
        done ? "border-brand-green/60" : "border-ink/10"
      }`}
    >
      {done && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute -inset-px -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(45,184,75,0.35),transparent)] blur-2xl"
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
            Toi
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50">Ton parcours</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={stage.status}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="text-lg font-extrabold tracking-tight text-ink"
              >
                {stage.status}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold transition-colors duration-500 ${
            done ? "bg-brand-green text-white" : "bg-cream text-ink/70"
          }`}
        >
          Étape {index + 1} sur {stages.length}
        </span>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-cream">
        <motion.div
          className="h-full origin-left rounded-full bg-brand-gradient"
          animate={{ scaleX: progress }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
        />
      </div>

      <p className="mt-7 text-xs font-bold uppercase tracking-widest text-ink/50">Compétences acquises</p>
      <div className="mt-3 flex min-h-[5.5rem] flex-wrap content-start gap-2">
        {skills.length === 0 && <span className="text-sm text-ink/40">Tout commence ici.</span>}
        <AnimatePresence>
          {skills.map((s) => (
            <motion.span
              key={s}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/10 px-3 py-1.5 text-sm font-semibold text-brand-dark ring-1 ring-brand-green/25"
            >
              <Check size={14} strokeWidth={3} /> {s}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <p className="mt-6 text-xs font-bold uppercase tracking-widest text-ink/50">Suivi</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.follow.text}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.35 }}
          className="mt-3 flex items-center gap-3 rounded-2xl bg-cream px-4 py-3"
        >
          <stage.follow.icon size={18} className="flex-shrink-0 text-brand-green" />
          <span className="text-sm font-medium text-ink">{stage.follow.text}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Cta() {
  return (
    <Link href="/formations" className="btn-primary mt-10">
      Voir les formations <ArrowRight size={18} />
    </Link>
  );
}

// Version sans pin : mobile et préférence « réduire les animations ».
function StaticJourney({ always = false }: { always?: boolean }) {
  return (
    <section className={`dot-grid-light bg-cream py-24 ${always ? "" : "lg:hidden"}`}>
      <div className="container-x">
        <Intro />
        <ol className="relative mt-12 space-y-8 border-l-2 border-brand-green/25 pl-7">
          {stages.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <span
                className={`absolute -left-[2.15rem] top-1 h-4 w-4 rounded-full border-2 border-cream ${
                  i === stages.length - 1 ? "bg-brand-green" : "bg-ink"
                }`}
              />
              <p className="text-xs font-bold uppercase tracking-widest text-brand-dark">{s.when}</p>
              <h3 className="mt-1 text-xl font-extrabold tracking-tight text-ink">{s.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink/70">{s.desc}</p>
            </motion.li>
          ))}
        </ol>
        <Cta />
      </div>
    </section>
  );
}

function PinnedJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rail = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const glowY = useTransform(scrollYProgress, [0, 1], ["10%", "80%"]);
  const [index, setIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Pas de comparaison avec `index` ici : la closure peut être périmée, React ignore déjà les valeurs identiques.
    setIndex(Math.min(stages.length - 1, Math.floor(p * stages.length)));
  });

  return (
    <section ref={ref} className="dot-grid-light relative hidden bg-cream lg:block" style={{ height: `${stages.length * 75}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          style={{ top: glowY }}
          className="pointer-events-none absolute right-[8%] h-[520px] w-[520px] -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(45,184,75,0.16),transparent)]"
        />
        <div className="container-x relative grid w-full grid-cols-2 items-center gap-16">
          <div>
            <Intro />
            <div className="relative mt-12 pl-8">
              <div className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[2px] bg-ink/10" />
              <motion.div
                style={{ scaleY: rail }}
                className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-[2px] origin-top bg-brand-green"
              />
              <ol className="space-y-4">
                {stages.map((s, i) => {
                  const active = i === index;
                  const passed = i < index;
                  return (
                    <li key={s.title} className="relative">
                      <span
                        className={`absolute -left-[2.4rem] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-cream transition-colors duration-300 ${
                          active || passed ? "bg-brand-green" : "bg-ink/20"
                        }`}
                      />
                      <p
                        className={`text-lg font-extrabold tracking-tight transition-colors duration-300 ${
                          active ? "text-ink" : passed ? "text-ink/45" : "text-ink/25"
                        }`}
                      >
                        {s.title}
                      </p>
                      <AnimatePresence initial={false}>
                        {active && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-md overflow-hidden pt-1 text-base leading-relaxed text-ink/70"
                          >
                            {s.desc}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ol>
            </div>
            <Cta />
          </div>
          <div className="flex justify-center">
            <StudentCard index={index} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function StudentJourney() {
  const reduce = useReducedMotionAfterMount();
  return (
    <>
      {!reduce && <PinnedJourney />}
      <StaticJourney always={!!reduce} />
    </>
  );
}
