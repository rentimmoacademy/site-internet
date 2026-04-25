import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Trophy, MapPin, Users, BookOpen } from "lucide-react";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "À propos — Marwan Afassi, fondateur de Rentimmo Academy",
  description:
    "Ingénieur, papa, praticien LCD. Lancé avec 1 000 €, +500K€ générés sans être propriétaire, dizaines de biens gérés entre France et Maroc.",
};

const timeline = [
  {
    year: "2019",
    title: "1 000 € en poche, le premier bail",
    text: "Ingénieur de formation, papa, je signe mon premier bail de sous-location à Paris avec 1 000 € de budget. +700 €/mois dès le 2e mois. Le déclic.",
  },
  {
    year: "2020-2022",
    title: "Scale entre Paris, Lyon, Marseille",
    text: "Je systématise les process : scripts de prospection, bails types, automatisation. Je passe de 1 à 10 logements sous gestion.",
  },
  {
    year: "2023",
    title: "Ouverture du marché Maroc",
    text: "J'explore Tanger et Marrakech. Premiers riads, premiers appartements touristiques signés. Le marché explose sous mes yeux.",
  },
  {
    year: "2024",
    title: "Lancement de la conciergerie multi-pays",
    text: "Je passe de sous-locataire à conciergerie multi-mandats. Dizaines de biens gérés entre France et Maroc. Une équipe de consultants se structure.",
  },
  {
    year: "2025-2026",
    title: "+500 000 € générés sans être propriétaire",
    text: "Rentimmo Academy naît pour transmettre toute cette méthodologie. Pas d'apport, pas de crédit, juste du process et de l'exécution. Et l'expertise d'une équipe.",
  },
];

const values = [
  { icon: Trophy, title: "Terrain avant tout", text: "On enseigne ce qu'on pratique. Si un process marche, c'est qu'on l'a testé sur des dizaines de biens." },
  { icon: Users, title: "Équipe > solo", text: "Marwan + ses consultants. Tu n'apprends jamais seul, tu es épaulé par des experts opérationnels." },
  { icon: MapPin, title: "France & Maroc", text: "Deux marchés, deux cultures, une même méthode terrain adaptée localement." },
  { icon: BookOpen, title: "Honnêteté absolue", text: "Pas de promesse de « 10K€/mois en 30 jours ». Des chiffres vrais, des process vrais." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink pt-40 pb-24">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -top-20 left-0 h-[500px] w-[500px] rounded-full bg-brand-green/15 blur-[120px]" />
        <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <p className="tag mb-5 text-brand-green">À propos</p>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
              Marwan Afassi.
            </h1>
            <p className="mt-5 text-xl font-semibold text-brand-green">
              Ingénieur industriel, papa, hôte Airbnb depuis 6 ans.
            </p>
          </div>
          <p className="text-lg leading-relaxed text-white/75">
            Je suis ingénieur industriel et papa. J'ai démarré avec{" "}
            <span className="text-white">1 000 € en poche</span> et j'ai fait{" "}
            <span className="text-white">+500 000 €</span> sans jamais être propriétaire.{" "}
            <span className="text-white">+1 196 évaluations</span> et{" "}
            <span className="text-white">4,93/5</span> sur Airbnb. Une méthode terrain systématisée —
            entre la France et le Maroc.
          </p>
        </div>
      </section>

      {/* Photo + intro */}
      <section className="bg-ink-soft py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div
            className="mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-full bg-brand-green bg-cover bg-center ring-4 ring-white/5 lg:mx-0"
            style={{ backgroundImage: "url(/marwan.jpg)" }}
            aria-label="Portrait de Marwan Afassi"
          />
          <div>
            <h2 className="text-h2 font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
              De salarié ingénieur à{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                entrepreneur LCD.
              </span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              J'avais un bon job d'ingénieur industriel et une famille à nourrir. Pas 50 000 € à mettre
              dans l'immo. Juste 1 000 € et l'envie de construire autre chose. La sous-location
              professionnelle m'a ouvert la porte — et je n'ai jamais eu besoin d'une banque.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Aujourd'hui, je partage tout ce que j'ai appris — avec mes équipes de consultants qui
              accompagnent chaque apprenant. Rentimmo Academy, c'est la méthode que j'aurais voulu avoir en
              2019.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-ink py-24">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="container-x relative">
          <p className="tag mb-5 text-brand-green">Parcours</p>
          <h2 className="max-w-3xl text-h2 font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
            De 1 000 € à +500 K€ générés.
          </h2>

          <div className="mt-16 border-l border-white/10 pl-8 md:pl-12">
            {timeline.map((t, i) => (
              <div key={t.year} className="relative pb-14 last:pb-0">
                <div className="absolute -left-[45px] top-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-black text-white md:-left-[57px]">
                  {i + 1}
                </div>
                <p className="text-brand-green text-xs uppercase tracking-widest font-bold">{t.year}</p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-white">{t.title}</h3>
                <p className="mt-3 max-w-2xl text-white/65">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink py-20">
        <div className="container-x grid gap-6 md:grid-cols-4">
          {[
            ["+500 K€", "Générés sans être proprio"],
            ["1 196", "Évaluations Airbnb"],
            ["4,93★", "Note globale"],
            ["6 ans", "Hôte Airbnb"],
          ].map(([v, l]) => (
            <div key={l} className="rounded-3xl border border-white/10 bg-[#1f1f1f] p-8">
              <p className="text-4xl font-extrabold tracking-[-0.02em] text-white md:text-5xl">{v}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-white/50">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream py-24 text-ink">
        <div className="container-x">
          <p className="tag mb-5 text-brand-dark">Valeurs</p>
          <h2 className="max-w-3xl text-h2 font-extrabold leading-[1.05] tracking-[-0.02em]">
            Les 4 principes qui guident Rentimmo Academy.
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-3xl border border-ink/10 bg-white p-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-dark ring-1 ring-brand-green/20">
                  <v.icon size={22} strokeWidth={2.2} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold tracking-tight">{v.title}</h3>
                <p className="mt-3 text-sm text-ink/70">{v.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/formations" className="btn-ghost-dark">
              Découvrir les formations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
