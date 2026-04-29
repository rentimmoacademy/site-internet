import type { Metadata } from "next";
import Link from "next/link";
import FormationCard from "@/components/FormationCard";
import SectionHeader from "@/components/SectionHeader";
import FinalCTA from "@/components/sections/FinalCTA";
import { formations } from "@/lib/formations";
import { Check, X, ArrowRight, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Nos formations LCD — Sous-location, Conciergerie, Cleaning",
  description:
    "Trois formations terrain pour lancer ton activité de location courte durée en France et au Maroc. Sans banque, sans crédit.",
};

const compareRows = [
  {
    label: "Capital requis",
    values: ["2 500 – 5 000 €", "0 € (auto-entrepreneur)", "< 500 € matériel"],
  },
  {
    label: "Revenus potentiels",
    values: ["700 – 1 500 €/mois par logement", "15-25% × CA géré", "1 500 – 6 000 €/mois"],
  },
  {
    label: "Complexité",
    values: ["Moyenne (juridique + ops)", "Haute (commercial + ops)", "Faible (ops uniquement)"],
  },
  {
    label: "Marché Maroc",
    values: [true, true, true],
  },
  {
    label: "Pour qui",
    values: ["Salarié qui veut sortir du 9-5", "Entrepreneur sans capital", "Débutant business"],
  },
];

export default function FormationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink pt-40 pb-20">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-x relative">
          <p className="tag mb-5 text-brand-green">Nos formations</p>
          <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
            3 formations.{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Un seul objectif : ta liberté financière.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Choisis le modèle qui te correspond. Chaque formation inclut un module Bonus Maroc et un accès
            à la communauté privée.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-ink-soft py-20">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-3">
            {formations.map((f, i) => (
              <FormationCard key={f.slug} formation={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-cream py-28 text-ink">
        <div className="container-x">
          <SectionHeader
            tag="Comparatif"
            title={
              <>
                Sous-location, conciergerie, cleaning :{" "}
                <span className="bg-brand-gradient bg-clip-text text-transparent">
                  laquelle est faite pour toi ?
                </span>
              </>
            }
          />

          <div className="mt-14 overflow-x-auto rounded-3xl border border-ink/10 bg-white">
            <table className="w-full min-w-[780px] text-sm">
              <thead>
                <tr className="border-b border-ink/10 bg-ink text-white">
                  <th className="p-5 text-left text-xs uppercase tracking-widest">Critère</th>
                  {formations.map((f) => (
                    <th key={f.slug} className="p-5 text-left">
                      <div className="text-[10px] uppercase tracking-widest text-white/60">
                        Formation
                      </div>
                      <div className="mt-1 text-base font-extrabold">
                        {f.name.replace(" Academy", "")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label} className="border-b border-ink/5 last:border-0">
                    <td className="p-5 font-bold text-ink">{row.label}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="p-5 text-ink/75">
                        {v === true ? (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                            <Check size={16} />
                          </span>
                        ) : v === false ? (
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-alert/10 text-alert">
                            <X size={16} />
                          </span>
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Super BnB Academy banner */}
      <section className="relative overflow-hidden bg-auto-navy py-16 font-poppins">
        <div className="dot-grid-mint pointer-events-none absolute inset-0 [background-size:32px_32px]" />
        <div className="pointer-events-none absolute -right-20 top-0 h-[300px] w-[300px] rounded-full bg-auto-mint/20 blur-[100px]" />
        <div className="container-x relative">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-auto-navy-soft/50 p-8 backdrop-blur md:flex-row md:items-center md:p-10">
            <div className="flex items-start gap-5 md:items-center">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-auto-mint text-auto-navy">
                <Cpu size={24} strokeWidth={2.4} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-auto-mint">
                  Programme accompagnement
                </p>
                <p className="mt-1 text-xl font-extrabold tracking-tight text-white md:text-2xl">
                  Tu as déjà un logement Airbnb actif ?
                </p>
                <p className="mt-1 text-sm text-white/65">
                  Découvre <span className="text-white">Super BnB Academy</span> — le programme
                  30 jours pour automatiser ton Airbnb.
                </p>
              </div>
            </div>
            <Link
              href="/super-bnb-academy"
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-auto-mint px-6 py-3.5 text-sm font-bold text-auto-navy transition-all hover:scale-[1.03] hover:shadow-glow-mint"
            >
              Découvrir le programme <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
