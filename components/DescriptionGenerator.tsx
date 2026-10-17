"use client";

import { useState } from "react";
import { Loader2, Copy, Check, Sparkles } from "lucide-react";

type PropertyType = "Studio / T1" | "T2" | "T3 et plus" | "Maison";
type Tone = "chaleureux" | "pro" | "familial";

const PROPERTY_TYPES: PropertyType[] = ["Studio / T1", "T2", "T3 et plus", "Maison"];
const TONES: { id: Tone; label: string }[] = [
  { id: "chaleureux", label: "Chaleureux" },
  { id: "pro", label: "Pro / Affaires" },
  { id: "familial", label: "Familial" },
];

type Result = {
  title: string;
  titleVariants: string[];
  description: string;
  highlights: string[];
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white/80 transition-colors hover:bg-white/20"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copié" : "Copier"}
    </button>
  );
}

export default function DescriptionGenerator() {
  const [propertyType, setPropertyType] = useState<PropertyType>("T2");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [bedrooms, setBedrooms] = useState(1);
  const [amenities, setAmenities] = useState("");
  const [highlights, setHighlights] = useState("");
  const [tone, setTone] = useState<Tone>("chaleureux");

  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;
    setStatus("loading");
    setError("");
    try {
      const r = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType,
          city: city.trim(),
          neighborhood: neighborhood.trim(),
          capacity,
          bedrooms,
          amenities: amenities.trim(),
          highlights: highlights.trim(),
          tone,
        }),
      });
      const d = await r.json();
      if (!r.ok || d.error) throw new Error(d.message || "Erreur de génération");
      setResult(d.result);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="rounded-3xl border border-ink/10 bg-white p-6 md:p-8">
        <h2 className="text-xl font-extrabold text-ink">Ton logement</h2>

        <div className="mt-6 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-bold text-ink">Type de logement</label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPropertyType(t)}
                  className={`rounded-2xl border px-3 py-2.5 text-sm font-bold transition-all ${
                    propertyType === t
                      ? "border-brand-green bg-brand-green/10 text-ink"
                      : "border-ink/10 bg-cream text-ink/60 hover:border-ink/30"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">Ville</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Dijon"
                required
                className="w-full rounded-2xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">Quartier (optionnel)</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Centre-ville"
                className="w-full rounded-2xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-brand-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">Capacité (voyageurs)</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCapacity((n) => Math.max(1, n - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/15 text-lg font-bold text-ink hover:border-ink/40"
                >
                  −
                </button>
                <div className="flex-1 rounded-xl bg-cream py-2 text-center text-base font-extrabold text-ink">
                  {capacity}
                </div>
                <button
                  type="button"
                  onClick={() => setCapacity((n) => Math.min(16, n + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/15 text-lg font-bold text-ink hover:border-ink/40"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">Chambres</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBedrooms((n) => Math.max(0, n - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/15 text-lg font-bold text-ink hover:border-ink/40"
                >
                  −
                </button>
                <div className="flex-1 rounded-xl bg-cream py-2 text-center text-base font-extrabold text-ink">
                  {bedrooms}
                </div>
                <button
                  type="button"
                  onClick={() => setBedrooms((n) => Math.min(10, n + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink/15 text-lg font-bold text-ink hover:border-ink/40"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-ink">
              Équipements clés <span className="text-ink/40">(séparés par des virgules)</span>
            </label>
            <input
              type="text"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              placeholder="Wifi fibre, lave-linge, parking privé, climatisation"
              className="w-full rounded-2xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-brand-green"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-ink">Points forts à mettre en avant</label>
            <textarea
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              placeholder="Proche gare, vue dégagée, terrasse privative…"
              rows={2}
              className="w-full rounded-2xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-brand-green"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-ink">Ton de l&apos;annonce</label>
            <div className="flex gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`flex-1 rounded-2xl border px-3 py-2.5 text-center text-sm font-bold transition-all ${
                    tone === t.id
                      ? "border-brand-green bg-brand-green/10 text-ink"
                      : "border-ink/10 bg-cream text-ink/60 hover:border-ink/30"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading" || !city.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Génération en cours…
              </>
            ) : (
              <>
                <Sparkles size={16} /> Générer mon annonce
              </>
            )}
          </button>
        </div>
      </form>

      {/* Résultat */}
      <div className="rounded-3xl border border-ink/10 bg-ink p-6 text-white md:p-8">
        <p className="tag text-brand-light">Annonce générée par IA</p>

        {status === "idle" && (
          <p className="mt-6 text-sm text-white/50">
            Remplis le formulaire à gauche pour obtenir un titre et une description optimisés pour
            l&apos;algorithme Airbnb.
          </p>
        )}

        {status === "error" && (
          <p className="mt-6 text-sm text-red-300">
            Une erreur est survenue : {error}. Réessaie dans quelques instants.
          </p>
        )}

        {status === "done" && result && (
          <div className="mt-6 space-y-5">
            <div className="rounded-2xl bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-bold uppercase tracking-widest text-white/50">Titre</div>
                <CopyButton text={result.title} />
              </div>
              <div className="mt-2 text-lg font-extrabold text-brand-light">{result.title}</div>
              {result.titleVariants?.length > 0 && (
                <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
                  {result.titleVariants.map((v, i) => (
                    <div key={i} className="text-sm text-white/60">
                      {v}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-bold uppercase tracking-widest text-white/50">Description</div>
                <CopyButton text={result.description} />
              </div>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-white/80">
                {result.description.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            {result.highlights?.length > 0 && (
              <div className="rounded-2xl bg-white/5 p-5">
                <div className="text-xs font-bold uppercase tracking-widest text-white/50">
                  Points forts reformulés
                </div>
                <ul className="mt-2 space-y-1.5 text-sm text-white/80">
                  {result.highlights.map((h, i) => (
                    <li key={i}>• {h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-white/40">
          Contenu généré par IA à partir des infos que tu renseignes — relis et adapte avant de
          publier ton annonce. Rentimmo Academy ne garantit pas de résultat de réservation.
        </p>
      </div>
    </div>
  );
}
