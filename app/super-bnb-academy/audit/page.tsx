"use client";

import { useState, useRef } from "react";

const API_BASE = "/api";
const POLL_INTERVAL = 4000;
const CAL_URL = "https://cal.com/rentimmoacademy/superbnbacademy";

type Platform = "airbnb" | "booking";
type Step = "form" | "loading" | "optin" | "result" | "error";

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
  topActions: Array<{
    impact: string;
    category: string;
    action: string;
    icon: string;
  }>;
  revenueProjection: {
    currentOccupancy: string;
    targetOccupancy: string;
    potentialGain: string;
    basis: string;
  };
  generatedContent: {
    optimizedTitle: string;
    keyImprovements: string[];
  };
}

function ScoreGauge({ score, color }: { score: number; color: string }) {
  return (
    <div className="relative flex items-center justify-center w-36 h-20">
      <svg width="144" height="84" viewBox="0 0 144 84">
        <path d={`M 8 76 A 64 64 0 0 1 136 76`} fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
        <path
          d={`M 8 76 A 64 64 0 0 1 136 76`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(score / 100) * 201} 201`}
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
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
      <div className="h-1.5 rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
    </div>
  );
}

export default function AuditPublicPage() {
  const [step, setStep] = useState<Step>("form");
  const [platform, setPlatform] = useState<Platform>("airbnb");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Optin form
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gestion, setGestion] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [defi, setDefi] = useState<string[]>([]);
  const [optinLoading, setOptinLoading] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef({ listingRunId: "", competitorRunId: "" });
  const pendingAuditRef = useRef<AuditResult | null>(null);

  const startAudit = async () => {
    if (!url.trim()) return;
    setStep("loading");
    setMessage("Lancement de l'analyse…");

    try {
      const r = await fetch(`${API_BASE}/start-audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), platform }),
      });
      const d = await r.json();
      if (!r.ok || d.error) { setErrorMsg(d.error || "Erreur démarrage"); setStep("error"); return; }
      stateRef.current = { listingRunId: d.listingRunId, competitorRunId: "" };
      pollRef.current = setInterval(poll, POLL_INTERVAL);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Erreur réseau");
      setStep("error");
    }
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
      if (d.status === "RUNNING") { setMessage(d.message || "Analyse en cours…"); return; }
      if (d.status === "COMPETITORS_STARTED") {
        stateRef.current.competitorRunId = d.competitorRunId;
        setMessage("Benchmarking concurrents…");
        return;
      }
      if (d.status === "DONE") {
        clearInterval(pollRef.current!);
        pendingAuditRef.current = d.audit;
        setStep("optin");
        return;
      }
      if (d.status === "ERROR") {
        clearInterval(pollRef.current!);
        setErrorMsg(d.message || "Erreur analyse");
        setStep("error");
      }
    } catch { /* réseau temporaire */ }
  };

  const toggleDefi = (v: string) =>
    setDefi((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);

  const submitOptin = async () => {
    if (!email || !firstName) return;
    setOptinLoading(true);
    const a = pendingAuditRef.current!;
    try {
      await fetch(`${API_BASE}/audit-optin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, email, phone, gestion, portfolio, defi,
          listingUrl: url,
          listingScore: a.globalScore,
          platform,
        }),
      });
    } catch { /* silently pass */ }
    setAudit(a);
    setStep("result");
    setOptinLoading(false);
  };

  const reset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStep("form"); setUrl(""); setAudit(null); setErrorMsg("");
    stateRef.current = { listingRunId: "", competitorRunId: "" };
  };

  return (
    <div className="min-h-screen bg-[#f9f8f4]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-gray-900">Rentimmo Academy</span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-sm text-gray-500">Audit Annonce LCD</span>
          </div>
          {(step === "result" || step === "optin") && (
            <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600">← Nouvelle analyse</button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* STEP 1: Form */}
        {step === "form" && (
          <div className="text-center">
            <div className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-4">
              GRATUIT · RÉSULTAT EN 90 SEC
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-3">
              Ton annonce mérite-t-elle<br />plus de réservations ?
            </h1>
            <p className="text-gray-500 mb-8 text-base">
              Analyse instantanée par IA · Score /100 · Benchmark concurrents · Contenu optimisé généré
            </p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left">
              <div className="flex gap-3 mb-5">
                {(["airbnb", "booking"] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                      platform === p
                        ? p === "airbnb" ? "border-rose-500 bg-rose-50 text-rose-700" : "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    {p === "airbnb" ? "🏠 Airbnb" : "🌐 Booking.com"}
                  </button>
                ))}
              </div>

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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={startAudit}
                disabled={!url.trim()}
                className="w-full bg-[#2DB84B] hover:bg-[#25a040] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-base transition-colors"
              >
                Analyser mon annonce gratuitement →
              </button>
            </div>

            {/* Social proof */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
              <span>✓ Gratuit, sans engagement</span>
              <span>✓ Résultat en ~90 secondes</span>
              <span>✓ IA spécialisée LCD</span>
            </div>
          </div>
        )}

        {/* STEP 2: Loading */}
        {step === "loading" && (
          <div className="text-center py-16">
            <div className="w-14 h-14 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-6" />
            <p className="text-gray-700 font-semibold text-lg mb-2">{message}</p>
            <p className="text-gray-400 text-sm mb-8">L&apos;analyse prend ~90 secondes, ne ferme pas cette page</p>
            <div className="flex items-center justify-center gap-3 text-xs">
              {["Scraping annonce", "Benchmark concurrents", "Analyse IA"].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-gray-200">→</span>}
                  <span className={`px-2.5 py-1 rounded-full font-semibold ${
                    message.includes("concurr") && i === 1 ? "bg-green-100 text-green-700" :
                    message.includes("IA") && i === 2 ? "bg-green-100 text-green-700" :
                    i === 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                  }`}>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Optin form — before showing results */}
        {step === "optin" && pendingAuditRef.current && (
          <div>
            {/* Score preview blurred */}
            <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Analyse terminée</div>
                  <div className="text-lg font-black text-gray-900">{pendingAuditRef.current.listing.title || "Ton annonce"}</div>
                  <div className="text-sm text-gray-400">{pendingAuditRef.current.listing.location}</div>
                </div>
                <div className="relative">
                  <div className="filter blur-sm pointer-events-none">
                    <ScoreGauge score={pendingAuditRef.current.globalScore} color={pendingAuditRef.current.gradeColor} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                </div>
              </div>
              {/* Category bars blurred */}
              <div className="mt-4 space-y-2 filter blur-sm pointer-events-none">
                {pendingAuditRef.current.categories.slice(0, 4).map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-28">{c.label}</span>
                    <div className="flex-1">
                      <ScoreBar score={c.score} color={c.gradeColor} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <p className="text-sm font-bold text-gray-700 bg-white px-4 py-2 rounded-xl shadow border border-gray-100">
                  Remplis le formulaire pour voir ton rapport complet
                </p>
              </div>
            </div>

            {/* Optin form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-black text-gray-900 mb-1">Voir mon rapport complet</h2>
              <p className="text-sm text-gray-400 mb-6">Gratuit · Score /100 · Benchmark · Contenu réoptimisé</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Prénom *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <input
                type="tel"
                placeholder="Téléphone (WhatsApp)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Tu gères combien de logements ?</label>
                <div className="grid grid-cols-4 gap-2">
                  {["1", "2-5", "6-15", "15+"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setGestion(v)}
                      className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                        gestion === v ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Ton défi principal ?</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Taux d'occupation trop bas", "Prix non optimisé", "Mauvaises reviews", "Annonce peu visible", "Trop de gestion manuelle", "Autre"].map((v) => (
                    <button
                      key={v}
                      onClick={() => toggleDefi(v)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-left ${
                        defi.includes(v) ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-500"
                      }`}
                    >
                      {defi.includes(v) ? "✓ " : ""}{v}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={submitOptin}
                disabled={!email || !firstName || optinLoading}
                className="w-full bg-[#2DB84B] hover:bg-[#25a040] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-base transition-colors"
              >
                {optinLoading ? "Chargement…" : "Voir mon rapport complet →"}
              </button>
              <p className="text-xs text-center text-gray-300 mt-3">
                Pas de spam. Tes données restent confidentielles.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Results */}
        {step === "result" && audit && (
          <div className="space-y-5">
            {/* Score hero */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                {audit.listing.coverPhotoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={audit.listing.coverPhotoUrl}
                    alt={audit.listing.title}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div className="flex-1">
                  <h2 className="font-black text-gray-900 text-base leading-tight mb-0.5">{audit.listing.title}</h2>
                  <p className="text-xs text-gray-400 mb-2">{audit.listing.location}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{audit.summary}</p>
                </div>
                <div className="flex-shrink-0 text-center">
                  <ScoreGauge score={audit.globalScore} color={audit.gradeColor} />
                  <div className="text-xs font-bold mt-1" style={{ color: audit.gradeColor }}>{audit.gradeFr.toUpperCase()}</div>
                </div>
              </div>
            </div>

            {/* Category scores */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 mb-4 text-sm">Diagnostic par catégorie</h3>
              <div className="space-y-3">
                {audit.categories.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-xs text-gray-700 font-semibold flex-1">{cat.label}</span>
                      <span className="text-xs font-black" style={{ color: cat.gradeColor }}>{cat.score}/100</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: cat.gradeColor + "20", color: cat.gradeColor }}>
                        {cat.gradeLabel}
                      </span>
                    </div>
                    <ScoreBar score={cat.score} color={cat.gradeColor} />
                    <p className="text-xs text-gray-500 mt-1 ml-6">{cat.recommendation.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 mb-4 text-sm">Actions prioritaires</h3>
              <div className="space-y-3">
                {audit.topActions.map((a, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl flex items-start gap-3 ${
                      a.impact === "HIGH" ? "bg-red-50 border border-red-100" : "bg-amber-50 border border-amber-100"
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{a.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-bold ${a.impact === "HIGH" ? "text-red-600" : "text-amber-600"}`}>
                          {a.impact === "HIGH" ? "IMPACT FORT" : "IMPACT MOYEN"}
                        </span>
                        <span className="text-xs text-gray-400">· {a.category}</span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium">{a.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue projection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 mb-4 text-sm">Potentiel de revenus</h3>
              <div className="grid grid-cols-3 gap-3 text-center mb-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">Occupation actuelle</div>
                  <div className="text-xl font-black text-gray-700">{audit.revenueProjection.currentOccupancy}</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">Objectif réaliste</div>
                  <div className="text-xl font-black text-green-600">{audit.revenueProjection.targetOccupancy}</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-1">Gain potentiel</div>
                  <div className="text-xl font-black text-green-600">{audit.revenueProjection.potentialGain}</div>
                </div>
              </div>
              <p className="text-xs text-gray-400">{audit.revenueProjection.basis}</p>
            </div>

            {/* Optimized title preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 mb-2 text-sm">Titre optimisé suggéré</h3>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm font-semibold text-green-800">
                &ldquo;{audit.generatedContent.optimizedTitle}&rdquo;
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Conçu pour l&apos;algorithme {platform === "airbnb" ? "Airbnb" : "Booking.com"} 2026 · données brutes + atouts réels du logement
              </p>
            </div>

            {/* CTA Super BnB Academy */}
            <div className="bg-gradient-to-br from-[#1A6B33] to-[#2DB84B] rounded-2xl p-6 text-white text-center">
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="text-xl font-black mb-2">
                {audit.globalScore < 70
                  ? `Ton annonce score ${audit.globalScore}/100 — on peut faire beaucoup mieux`
                  : `Bonne base ! Passe de ${audit.globalScore} à 90+ /100`}
              </h3>
              <p className="text-white/80 text-sm mb-5">
                Réserve un audit stratégique gratuit avec l&apos;équipe Super BnB Academy.
                On analyse ton portfolio complet et on te donne le plan exact pour maximiser tes revenus LCD.
              </p>
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-[#1A6B33] font-black px-8 py-3.5 rounded-xl text-base hover:bg-gray-50 transition-colors"
              >
                Réserver mon audit gratuit →
              </a>
              <p className="text-white/50 text-xs mt-3">30 minutes · Sans engagement · Places limitées</p>
            </div>
          </div>
        )}

        {/* Error */}
        {step === "error" && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold mb-4">{errorMsg}</p>
            <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-2.5 rounded-xl text-sm">
              Réessayer
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
