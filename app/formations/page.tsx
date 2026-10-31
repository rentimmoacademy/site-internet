import type { Metadata } from "next";
import Link from "next/link";
import FormationCard from "@/components/FormationCard";
import SectionHeader from "@/components/SectionHeader";
import FinalCTA from "@/components/sections/FinalCTA";
import { formations } from "@/lib/formations";
import { AGGREGATE_RATING } from "@/lib/testimonials";
import { Check, X, ArrowRight, Cpu } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Highlight from "@/components/ui/Highlight";
import Underline from "@/components/ui/Underline";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.rentimmoacademy.fr/formations" },
  title: "Formations — Sous-Location Academy · Conciergerie BNB Academy · Cleaning BNB Academy",
  description:
    "Sous-Location Academy, Conciergerie BNB Academy, Cleaning BNB Academy — 3 formations terrain pour lancer ton activité de location courte durée en France et au Maroc. Sans banque, sans crédit.",
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
      <section className="relative pt-40 pb-20">
        <div className="container-x relative">
          <p className="tag mb-5 text-brand-dark">Nos formations</p>
          <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink">
            3 formations.{" "}
            <span className="text-brand-dark">Un seul objectif : ta liberté financière.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/70">
            Choisis le modèle qui te correspond.{" "}
            Chaque formation inclut <Highlight>un module Bonus Maroc</Highlight> et un accès à la communauté
            privée.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-20">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-3">
            {formations.map((f, i) => (
              <FormationCard key={f.slug} formation={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="border-t border-ink/10 bg-white py-28 text-ink">
        <div className="container-x">
          <SectionHeader
            tag="Comparatif"
            title={
              <>
                Sous-location, conciergerie, cleaning : laquelle est faite <Highlight>pour toi</Highlight> ?
              </>
            }
          />

          <Reveal className="mt-14 overflow-x-auto rounded-3xl border border-ink/10 bg-white shadow-[0_6px_0_rgba(26,26,26,0.06)]">
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
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/15 text-brand-dark">
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
          </Reveal>
        </div>
      </section>

      {/* Super BNB Academy : carte claire (le FinalCTA qui suit est déjà une carte noire) */}
      <section className="py-20">
        <div className="container-x">
          <Reveal>
            <div className="group relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl border border-brand-green/30 bg-white p-8 text-ink shadow-[0_6px_0_rgba(26,26,26,0.06)] transition-all duration-500 hover:-translate-y-1.5 md:flex-row md:items-center md:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full bg-brand-green/10 blur-[100px]" />
              <div className="relative flex items-start gap-5 md:items-center">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-ink text-brand-green">
                  <Cpu size={24} strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-dark">
                    Programme accompagnement
                  </p>
                  <p className="mt-1 text-xl font-extrabold tracking-tight text-ink md:text-2xl">
                    Tu as déjà un <Underline>logement Airbnb actif</Underline> ?
                  </p>
                  <p className="mt-1 text-sm text-ink/65">
                    Découvre <span className="font-bold text-ink">Super BNB Academy</span> — le programme
                    30 jours pour automatiser ton Airbnb.
                  </p>
                </div>
              </div>
              <Link
                href="/super-bnb-academy"
                className="relative inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white shadow-[0_6px_0_#1A6B33] transition-all hover:gap-3 hover:shadow-[0_8px_0_#2DB84B]"
              >
                Découvrir le programme <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "@id": "https://www.rentimmoacademy.fr/#organization",
            name: "Rentimmo Academy",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: AGGREGATE_RATING.ratingValue,
              reviewCount: AGGREGATE_RATING.reviewCount,
              bestRating: AGGREGATE_RATING.bestRating,
              worstRating: AGGREGATE_RATING.worstRating,
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Formations Rentimmo Academy",
            description: "Sous-Location Academy, Conciergerie BNB Academy, Cleaning BNB Academy",
            itemListElement: formations.map((f, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `https://www.rentimmoacademy.fr/formations/${f.slug}`,
              name: f.name,
            })),
          }),
        }}
      />
    </>
  );
}
