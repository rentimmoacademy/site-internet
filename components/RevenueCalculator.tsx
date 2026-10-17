"use client";

import { useMemo, useState } from "react";

type CityTier = "grande" | "moyenne" | "petite";
type PropertyType = "studio" | "t2" | "t3plus";

const CITY_TIERS: { id: CityTier; label: string; examples: string; mult: number }[] = [
  { id: "grande", label: "Grande ville", examples: "Paris, Lyon, Marseille, Bordeaux, Nice…", mult: 1 },
  { id: "moyenne", label: "Ville moyenne", examples: "Dijon, Reims, Rennes, Montpellier…", mult: 0.75 },
  { id: "petite", label: "Petite ville / périphérie", examples: "Communes secondaires, zones touristiques", mult: 0.55 },
];

const PROPERTY_TYPES: { id: PropertyType; label: string; mult: number }[] = [
  { id: "studio", label: "Studio / T1", mult: 0.7 },
  { id: "t2", label: "T2", mult: 1 },
  { id: "t3plus", label: "T3 et plus", mult: 1.4 },
];

// Fourchettes de référence par logement/mois, T2 en grande ville (cf. retours terrain Rentimmo Academy)
const BASE_SOUS_LOCATION: [number, number] = [500, 700];
const BASE_CONCIERGERIE: [number, number] = [200, 300];

function round10(n: number) {
  return Math.round(n / 10) * 10;
}

export default function RevenueCalculator() {
  const [city, setCity] = useState<CityTier>("grande");
  const [type, setType] = useState<PropertyType>("t2");
  const [nbLogements, setNbLogements] = useState(1);

  const result = useMemo(() => {
    const cityMult = CITY_TIERS.find((c) => c.id === city)!.mult;
    const typeMult = PROPERTY_TYPES.find((t) => t.id === type)!.mult;
    const factor = cityMult * typeMult;

    const sousLocation: [number, number] = [
      round10(BASE_SOUS_LOCATION[0] * factor),
      round10(BASE_SOUS_LOCATION[1] * factor),
    ];
    const conciergerie: [number, number] = [
      round10(BASE_CONCIERGERIE[0] * factor),
      round10(BASE_CONCIERGERIE[1] * factor),
    ];

    return {
      sousLocation,
      conciergerie,
      sousLocationTotal: [sousLocation[0] * nbLogements, sousLocation[1] * nbLogements] as [number, number],
      conciergerieTotal: [conciergerie[0] * nbLogements, conciergerie[1] * nbLogements] as [number, number],
    };
  }, [city, type, nbLogements]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
      {/* Formulaire */}
      <div className="rounded-3xl border border-ink/10 bg-white p-6 md:p-8">
        <h2 className="text-xl font-extrabold text-ink">Ta situation</h2>

        <div className="mt-6 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-ink">Ta ville</label>
            <div className="space-y-2">
              {CITY_TIERS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCity(c.id)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-all ${
                    city === c.id
                      ? "border-brand-green bg-brand-green/10"
                      : "border-ink/10 bg-cream hover:border-ink/30"
                  }`}
                >
                  <div className="font-bold text-ink">{c.label}</div>
                  <div className="text-xs text-ink/50">{c.examples}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-ink">Type de logement</label>
            <div className="flex gap-2">
              {PROPERTY_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={`flex-1 rounded-2xl border px-3 py-3 text-center text-sm font-bold transition-all ${
                    type === t.id
                      ? "border-brand-green bg-brand-green/10 text-ink"
                      : "border-ink/10 bg-cream text-ink/60 hover:border-ink/30"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-ink">
              Nombre de logements visés
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setNbLogements((n) => Math.max(1, n - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink/15 text-xl font-bold text-ink hover:border-ink/40"
              >
                −
              </button>
              <div className="flex-1 rounded-xl bg-cream py-2.5 text-center text-lg font-extrabold text-ink">
                {nbLogements}
              </div>
              <button
                type="button"
                onClick={() => setNbLogements((n) => Math.min(20, n + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink/15 text-xl font-bold text-ink hover:border-ink/40"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Résultat */}
      <div className="rounded-3xl border border-ink/10 bg-ink p-6 text-white md:p-8">
        <p className="tag text-brand-light">Estimation illustrative</p>
        <h2 className="mt-3 text-xl font-extrabold">Ce que ça pourrait donner</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-white/50">
              Sous-location
            </div>
            <div className="mt-2 text-2xl font-extrabold text-brand-light">
              {result.sousLocationTotal[0]} – {result.sousLocationTotal[1]} €
            </div>
            <div className="text-xs text-white/40">par mois, marge nette estimée</div>
          </div>
          <div className="rounded-2xl bg-white/5 p-5">
            <div className="text-xs font-bold uppercase tracking-widest text-white/50">
              Conciergerie
            </div>
            <div className="mt-2 text-2xl font-extrabold text-brand-light">
              {result.conciergerieTotal[0]} – {result.conciergerieTotal[1]} €
            </div>
            <div className="text-xs text-white/40">par mois, commission estimée</div>
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-white/40">
          Exemple illustratif basé sur les fourchettes moyennes constatées par Rentimmo Academy
          selon la ville et le type de bien. Ce n'est pas une garantie de résultat : le revenu
          réel dépend de ton bien, de ta gestion et du marché local. On affine ton estimation
          précisément lors de l'appel stratégique.
        </p>

        <a
          href="https://cal.com/rentimmoacademy/appel-strategique?overlayCalendar=true"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02]"
        >
          Réserver mon appel stratégique →
        </a>
      </div>
    </div>
  );
}
