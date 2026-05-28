"use client";

import { useState, useEffect, useRef } from "react";

const API_BASE = "/api";
const POLL_INTERVAL = 4000;

type Platform = "airbnb" | "booking";
type AuditStatus = "idle" | "loading" | "running" | "done" | "error";

interface AuditResult {
  globalScore: number;
  grade: string;
  gradeFr: string;
  gradeColor: string;
  summary: string;
  listing: {
    title: string;
    location: string;
    coverPhotoUrl: string;
    photosCount: number;
    rating: number | null;
    reviewsCount: number;
    pricePerNight: number | null;
    currency: string;
    url: string;
  };
  categories: Array<{
    id: string;
    label: string;
    icon: string;
    score: number;
    gradeLabel: string;
    gradeColor: string;
    findings: string[];
    recommendation: { impact: string; action: string };
  }>;
  competitors: Array<{
    title: string;
    pricePerNight: number | null;
    rating: number | null;
    reviewsCount: number;
    photosCount: number;
    url: string;
  }>;
  generatedContent: {
    optimizedTitle: string;
    optimizedTitleVariants: string[];
    optimizedDescriptionOpening: string;
    keyImprovements: string[];
  };
  revenueProjection: {
    currentOccupancy: string;
    targetOccupancy: string;
    potentialGain: string;
    basis: string;
  };
  topActions: Array<{
    impact: string;
    category: string;
    action: string;
    icon: string;
  }>;
}

function ScoreGauge({ score, color }: { score: number; color: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const half = circ / 2;
  const offset = half - (score / 100) * half;

  return (
    <div className="relative flex items-center justify-center w-40 h-20">
      <svg width="160" height="90" viewBox="0 0 160 90">
        <path
          d={`M 10 80 A 70 70 0 0 1 150 80`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M 10 80 A 70 70 0 0 1 150 80`}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 220} 220`}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute bottom-0 flex flex-col items-center">
        <span className="text-3xl font-black" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-400 -mt-1">/100</span>
      </div>
    </div>
  );
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
      <div
        className="h-2 rounded-full transition-all duration-700"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  );
}

function ImpactBadge({ impact }: { impact: string }) {
  const styles: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700 border border-red-200",
    MEDIUM: "bg-amber-100 text-amber-700 border border-amber-200",
    LOW: "bg-blue-100 text-blue-700 border border-blue-200",
  };
  const labels: Record<string, string> = { HIGH: "Impact fort", MEDIUM: "Impact moyen", LOW: "Impact faible" };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${styles[impact] || styles.LOW}`}>
      {labels[impact] || impact}
    </span>
  );
}

function scoreColor(score: number) {
  if (score >= 80) return "#22C55E";
  if (score >= 65) return "#84CC16";
  if (score >= 50) return "#F59E0B";
  if (score >= 35) return "#F97316";
  return "#EF4444";
}

export default function AuditPrivatePage() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<Platform>("airbnb");
  const [status, setStatus] = useState<AuditStatus>("idle");
  const [message, setMessage] = useState("");
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"summary" | "diagnostic" | "contenu" | "concurrents">("summary");
  const [activeCat, setActiveCat] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef<{ listingRunId: string; competitorRunId: string | null }>({
    listingRunId: "",
    competitorRunId: null,
  });

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const startAudit = async () => {
    if (!url.trim()) return;
    setStatus("loading");
    setError("");
    setAudit(null);
    setMessage("Démarrage du scraping…");

    try {
      const r = await fetch(`${API_BASE}/start-audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), platform }),
      });
      const d = await r.json();
      if (!r.ok || d.error) { setError(d.error || "Erreur démarrage"); setStatus("error"); return; }

      stateRef.current = { listingRunId: d.listingRunId, competitorRunId: null };
      setStatus("running");
      setMessage("Extraction de l'annonce en cours…");
      startPolling();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
      setStatus("error");
    }
  };

  const startPolling = () => {
    pollRef.current = setInterval(poll, POLL_INTERVAL);
  };

  const poll = async () => {
    const { listingRunId, competitorRunId } = stateRef.current;
    if (!listingRunId) return;

    try {
      const params = new URLSearchParams({
        listingRunId,
        platform,
        url: url.trim(),
        ...(competitorRunId ? { competitorRunId } : {}),
      });
      const r = await fetch(`${API_BASE}/audit-result?${params}`);
      const d = await r.json();

      if (d.status === "RUNNING") {
        setMessage(d.message || "Analyse en cours…");
        return;
      }
      if (d.status === "COMPETITORS_STARTED") {
        stateRef.current.competitorRunId = d.competitorRunId;
        setMessage("Benchmarking concurrents…");
        return;
      }
      if (d.status === "DONE") {
        clearInterval(pollRef.current!);
        setAudit(d.audit);
        setStatus("done");
        return;
      }
      if (d.status === "ERROR") {
        clearInterval(pollRef.current!);
        setError(d.message || "Erreur analyse");
        setStatus("error");
      }
    } catch {
      // réseau temporaire, on continue le polling
    }
  };

  const reset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStatus("idle");
    setAudit(null);
    setError("");
    setUrl("");
    stateRef.current = { listingRunId: "", competitorRunId: null };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black text-gray-900">Audit Annonce LCD</span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">PRIVÉ</span>
        </div>
        {audit && (
          <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1">
            ← Nouvelle analyse
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Form */}
        {status === "idle" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">Analyser une annonce</h1>
            <p className="text-gray-500 mb-8">Airbnb ou Booking.com · Score + benchmark + contenu optimisé généré</p>

            {/* Platform selector */}
            <div className="flex gap-3 mb-6">
              {(["airbnb", "booking"] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
                    platform === p
                      ? p === "airbnb"
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {p === "airbnb" ? "🏠 Airbnb" : "🌐 Booking.com"}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startAudit()}
                placeholder={
                  platform === "airbnb"
                    ? "https://www.airbnb.fr/rooms/12345678"
                    : "https://www.booking.com/hotel/..."
                }
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={startAudit}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                Analyser →
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {(status === "loading" || status === "running") && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-gray-700 font-semibold text-lg mb-2">{message}</p>
            <p className="text-gray-400 text-sm">L&apos;analyse prend environ 60–90 secondes</p>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <span className={status === "loading" ? "text-green-500 font-semibold" : "line-through"}>Scraping</span>
              <span>→</span>
              <span className={message.includes("concurrent") ? "text-green-500 font-semibold" : ""}>Benchmark</span>
              <span>→</span>
              <span className={message.includes("Gemini") || message.includes("IA") ? "text-green-500 font-semibold" : ""}>Analyse IA</span>
            </div>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold mb-2">{error}</p>
            <button onClick={reset} className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl text-sm">
              Réessayer
            </button>
          </div>
        )}

        {/* Results */}
        {status === "done" && audit && (
          <div className="space-y-6">
            {/* Hero card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex gap-0">
                {audit.listing.coverPhotoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={audit.listing.coverPhotoUrl}
                    alt={audit.listing.title}
                    className="w-56 object-cover flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div className="flex-1 p-6 flex items-center gap-6">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {platform === "airbnb" ? "Airbnb" : "Booking.com"}
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mb-1">{audit.listing.title}</h2>
                    <p className="text-gray-400 text-sm mb-3">{audit.listing.location}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{audit.summary}</p>
                    {audit.listing.url && (
                      <a
                        href={audit.listing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 hover:underline mt-2 inline-block"
                      >
                        Voir l&apos;annonce originale →
                      </a>
                    )}
                  </div>
                  <div className="text-center flex-shrink-0">
                    <ScoreGauge score={audit.globalScore} color={audit.gradeColor} />
                    <div
                      className="mt-2 text-xs font-bold px-3 py-1 rounded-full"
                      style={{ backgroundColor: audit.gradeColor + "20", color: audit.gradeColor }}
                    >
                      {audit.gradeFr.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {(["summary", "diagnostic", "contenu", "concurrents"] as const).map((tab) => {
                const labels = { summary: "Résumé", diagnostic: "Diagnostic", contenu: "Contenu optimisé", concurrents: "Concurrents" };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                      activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* Summary tab */}
            {activeTab === "summary" && (
              <div className="space-y-4">
                {/* Top actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-black text-gray-900 mb-4">Actions prioritaires</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {audit.topActions.map((a, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-xl border ${
                          a.impact === "HIGH"
                            ? "bg-red-50 border-red-100"
                            : a.impact === "MEDIUM"
                            ? "bg-amber-50 border-amber-100"
                            : "bg-blue-50 border-blue-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <ImpactBadge impact={a.impact} />
                          <span className="text-xs text-gray-400 font-semibold uppercase">{a.category}</span>
                        </div>
                        <p className="text-sm text-gray-800 font-medium leading-snug">{a.action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category scores overview */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-black text-gray-900 mb-4">Scores par catégorie</h3>
                  <div className="space-y-3">
                    {audit.categories.map((cat) => (
                      <div key={cat.id} className="flex items-center gap-3">
                        <span className="w-6 text-center">{cat.icon}</span>
                        <span className="text-sm text-gray-700 w-32 flex-shrink-0">{cat.label}</span>
                        <div className="flex-1">
                          <ScoreBar score={cat.score} color={cat.gradeColor} />
                        </div>
                        <span className="text-sm font-bold w-8 text-right" style={{ color: cat.gradeColor }}>
                          {cat.score}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold w-24 text-center"
                          style={{ backgroundColor: cat.gradeColor + "20", color: cat.gradeColor }}
                        >
                          {cat.gradeLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue projection */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-black text-gray-900 mb-4">Projection revenus</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="text-xs text-gray-400 font-semibold mb-1">Occupation actuelle</div>
                      <div className="text-2xl font-black text-gray-700">{audit.revenueProjection.currentOccupancy}</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-xs text-gray-400 font-semibold mb-1">Objectif atteignable</div>
                      <div className="text-2xl font-black text-green-600">{audit.revenueProjection.targetOccupancy}</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-xs text-gray-400 font-semibold mb-1">Gain potentiel</div>
                      <div className="text-2xl font-black text-green-600">{audit.revenueProjection.potentialGain}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{audit.revenueProjection.basis}</p>
                </div>
              </div>
            )}

            {/* Diagnostic tab */}
            {activeTab === "diagnostic" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Category tabs */}
                <div className="flex overflow-x-auto border-b border-gray-100">
                  {audit.categories.map((cat, i) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCat(i)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex-shrink-0 ${
                        activeCat === i ? "border-green-500 text-green-700 bg-green-50" : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                      <span
                        className="text-xs font-black px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: cat.gradeColor + "20", color: cat.gradeColor }}
                      >
                        {cat.score}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Category detail */}
                {(() => {
                  const cat = audit.categories[activeCat];
                  return (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{cat.icon}</span>
                            <h3 className="text-lg font-black text-gray-900">{cat.label}</h3>
                          </div>
                          <span
                            className="text-sm font-bold px-3 py-1 rounded-full"
                            style={{ backgroundColor: cat.gradeColor + "20", color: cat.gradeColor }}
                          >
                            {cat.gradeLabel}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-black" style={{ color: cat.gradeColor }}>{cat.score}</div>
                          <div className="text-xs text-gray-400">/100</div>
                        </div>
                      </div>
                      <ScoreBar score={cat.score} color={cat.gradeColor} />

                      <div className="mt-6">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Observations</h4>
                        <ul className="space-y-2">
                          {cat.findings.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="text-gray-300 mt-0.5">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 p-4 rounded-xl border" style={{ borderColor: cat.gradeColor + "40", backgroundColor: cat.gradeColor + "08" }}>
                        <div className="flex items-center gap-2 mb-2">
                          <ImpactBadge impact={cat.recommendation.impact} />
                          <span className="text-xs text-gray-400 font-semibold">Recommandation</span>
                        </div>
                        <p className="text-sm text-gray-800 font-medium">{cat.recommendation.action}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Contenu optimisé tab */}
            {activeTab === "contenu" && (
              <div className="space-y-4">
                {/* Titres */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-black text-gray-900 mb-4">Titres optimisés</h3>
                  <div className="space-y-3">
                    {[audit.generatedContent.optimizedTitle, ...audit.generatedContent.optimizedTitleVariants].map((t, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                        <span className="text-xs text-gray-400 font-semibold w-12 flex-shrink-0">
                          {i === 0 ? "⭐ Best" : `Option ${i + 1}`}
                        </span>
                        <span className="flex-1 text-sm text-gray-800 font-medium">{t}</span>
                        <button
                          onClick={() => copyText(t, `title-${i}`)}
                          className="text-xs text-green-600 hover:text-green-700 font-semibold flex-shrink-0"
                        >
                          {copied === `title-${i}` ? "Copié ✓" : "Copier"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-gray-900">Début de description réécrite</h3>
                    <button
                      onClick={() => copyText(audit.generatedContent.optimizedDescriptionOpening, "desc")}
                      className="text-sm text-green-600 hover:text-green-700 font-semibold"
                    >
                      {copied === "desc" ? "Copié ✓" : "Copier"}
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {audit.generatedContent.optimizedDescriptionOpening}
                  </div>
                </div>

                {/* Key improvements */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-black text-gray-900 mb-4">5 actions clés priorisées</h3>
                  <ol className="space-y-3">
                    {audit.generatedContent.keyImprovements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700">{imp}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Concurrents tab */}
            {activeTab === "concurrents" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-black text-gray-900 mb-2">Benchmark concurrents</h3>
                <p className="text-sm text-gray-400 mb-6">Annonces similaires analysées dans la même zone</p>
                {audit.competitors.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">Pas de données de benchmark disponibles</p>
                ) : (
                  <div className="space-y-3">
                    {audit.competitors.map((c, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <span className="text-lg font-black text-gray-300 w-6">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{c.title}</p>
                          {c.url && (
                            <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-500 hover:underline">
                              Voir →
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm flex-shrink-0">
                          {c.rating && (
                            <span className="flex items-center gap-1 text-amber-500 font-semibold">
                              ⭐ {c.rating.toFixed(1)}
                            </span>
                          )}
                          {c.reviewsCount > 0 && (
                            <span className="text-gray-400">{c.reviewsCount} avis</span>
                          )}
                          {c.photosCount > 0 && (
                            <span className="text-gray-400">📸 {c.photosCount}</span>
                          )}
                          {c.pricePerNight && (
                            <span className="font-bold text-gray-700">{c.pricePerNight}€/nuit</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Your listing vs avg */}
                {audit.competitors.length > 0 && (() => {
                  const avgPrice = audit.competitors.filter(c => c.pricePerNight).reduce((s, c) => s + (c.pricePerNight || 0), 0) / audit.competitors.filter(c => c.pricePerNight).length;
                  const avgRating = audit.competitors.filter(c => c.rating).reduce((s, c) => s + (c.rating || 0), 0) / audit.competitors.filter(c => c.rating).length;
                  const avgPhotos = audit.competitors.reduce((s, c) => s + c.photosCount, 0) / audit.competitors.length;
                  return (
                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                      <h4 className="text-sm font-black text-green-800 mb-3">Ton annonce vs la concurrence</h4>
                      <div className="grid grid-cols-3 gap-3 text-center text-xs">
                        {audit.listing.pricePerNight && avgPrice > 0 && (
                          <div>
                            <div className="text-gray-400 mb-1">Prix/nuit</div>
                            <div className="font-black text-gray-800">{audit.listing.pricePerNight}€</div>
                            <div className={`font-semibold ${audit.listing.pricePerNight > avgPrice ? "text-amber-600" : "text-green-600"}`}>
                              moy. concurrents {Math.round(avgPrice)}€
                            </div>
                          </div>
                        )}
                        {audit.listing.rating && avgRating > 0 && (
                          <div>
                            <div className="text-gray-400 mb-1">Note</div>
                            <div className="font-black text-gray-800">{audit.listing.rating.toFixed(1)}</div>
                            <div className={`font-semibold ${audit.listing.rating >= avgRating ? "text-green-600" : "text-amber-600"}`}>
                              moy. {avgRating.toFixed(1)}
                            </div>
                          </div>
                        )}
                        {avgPhotos > 0 && (
                          <div>
                            <div className="text-gray-400 mb-1">Photos</div>
                            <div className="font-black text-gray-800">{audit.listing.photosCount}</div>
                            <div className={`font-semibold ${audit.listing.photosCount >= avgPhotos ? "text-green-600" : "text-amber-600"}`}>
                              moy. {Math.round(avgPhotos)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
