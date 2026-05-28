"use client";

import { useState, useEffect, useRef } from "react";

const API_BASE = "/api";
const POLL_MS = 4000;

type Platform = "airbnb" | "booking";
type Status = "idle" | "loading" | "running" | "done" | "error";
type Tab = "summary" | "diagnostic" | "content" | "benchmark";

interface Category {
  id: string; label: string; icon: string; score: number;
  gradeLabel: string; gradeColor: string; findings: string[];
  recommendation: { impact: string; action: string };
}
interface Competitor {
  title: string; pricePerNight: number | null; rating: number | null;
  reviewsCount: number; photosCount: number; url: string;
}
interface Audit {
  globalScore: number; grade: string; gradeFr: string; gradeColor: string; summary: string;
  listing: {
    title: string; location: string; coverPhotoUrl: string; photosCount: number;
    rating: number | null; reviewsCount: number; pricePerNight: number | null;
    currency: string; url: string;
  };
  categories: Category[];
  competitors: Competitor[];
  generatedContent: {
    optimizedTitle: string; optimizedTitleVariants: string[];
    optimizedDescriptionOpening: string; keyImprovements: string[];
  };
  revenueProjection: {
    currentOccupancy: string; targetOccupancy: string;
    potentialGain: string; basis: string;
  };
  topActions: Array<{ impact: string; category: string; action: string; icon: string }>;
}

/* ── Composants réutilisables ── */

function GaugeScore({ score, color }: { score: number; color: string }) {
  const pct = score / 100;
  const circumference = Math.PI * 70; // demi-cercle r=70
  return (
    <div className="relative flex flex-col items-center">
      <svg width="160" height="92" viewBox="0 0 160 92" fill="none">
        {/* Track */}
        <path d="M 10 84 A 70 70 0 0 1 150 84" stroke="#ffffff10" strokeWidth="12" strokeLinecap="round" />
        {/* Fill */}
        <path
          d="M 10 84 A 70 70 0 0 1 150 84"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${pct * circumference} ${circumference}`}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute bottom-0 text-center">
        <div className="text-4xl font-extrabold text-white leading-none tracking-tight">{score}</div>
        <div className="text-xs text-white/40 font-semibold mt-0.5">/100</div>
      </div>
    </div>
  );
}

function BarScore({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  );
}

function ImpactPill({ impact }: { impact: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    HIGH:   { bg: "bg-red-500/15",    text: "text-red-400",    label: "Impact fort" },
    MEDIUM: { bg: "bg-amber-500/15",  text: "text-amber-400",  label: "Impact moyen" },
    LOW:    { bg: "bg-blue-500/15",   text: "text-blue-400",   label: "Impact faible" },
  };
  const s = map[impact] ?? map.LOW;
  return (
    <span className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function scoreColor(s: number) {
  if (s >= 80) return "#22C55E";
  if (s >= 65) return "#84CC16";
  if (s >= 50) return "#F59E0B";
  if (s >= 35) return "#F97316";
  return "#EF4444";
}

/* ── Page principale ── */

export default function AuditPage() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<Platform>("airbnb");
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");
  const [audit, setAudit] = useState<Audit | null>(null);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<Tab>("summary");
  const [catIdx, setCatIdx] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const poll = useRef<ReturnType<typeof setInterval> | null>(null);
  const run = useRef({ listing: "", competitor: "" });

  useEffect(() => () => { if (poll.current) clearInterval(poll.current); }, []);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const launch = async () => {
    if (!url.trim()) return;
    setStatus("loading"); setErr(""); setAudit(null); setMsg("Lancement…");
    try {
      const r = await fetch(`${API_BASE}/start-audit`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), platform }),
      });
      const d = await r.json();
      if (!r.ok || d.error) { setErr(d.error || "Erreur démarrage"); setStatus("error"); return; }
      run.current = { listing: d.listingRunId, competitor: "" };
      setStatus("running"); setMsg("Extraction de l'annonce…");
      poll.current = setInterval(doPoll, POLL_MS);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erreur réseau"); setStatus("error");
    }
  };

  const doPoll = async () => {
    const { listing, competitor } = run.current;
    if (!listing) return;
    try {
      const p = new URLSearchParams({ listingRunId: listing, platform, url: url.trim(), ...(competitor ? { competitorRunId: competitor } : {}) });
      const r = await fetch(`${API_BASE}/audit-result?${p}`);
      const d = await r.json();
      if (d.status === "RUNNING") { setMsg(d.message || "Analyse en cours…"); return; }
      if (d.status === "COMPETITORS_STARTED") { run.current.competitor = d.competitorRunId; setMsg("Benchmark concurrents…"); return; }
      if (d.status === "DONE") { clearInterval(poll.current!); setAudit(d.audit); setStatus("done"); return; }
      if (d.status === "ERROR") { clearInterval(poll.current!); setErr(d.message || "Erreur"); setStatus("error"); }
    } catch { /* réseau temporaire */ }
  };

  const reset = () => {
    if (poll.current) clearInterval(poll.current);
    setStatus("idle"); setAudit(null); setErr(""); setUrl(""); setTab("summary");
    run.current = { listing: "", competitor: "" };
  };

  /* ── IDLE ── */
  if (status === "idle") return (
    <div className="min-h-screen bg-ink" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
      {/* Nav */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-extrabold text-base tracking-tight">Rentimmo Academy</span>
          <span className="h-4 w-px bg-white/15" />
          <span className="text-white/40 text-sm">Audit Annonce LCD</span>
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20">
          Outil Privé
        </span>
      </header>

      {/* Hero */}
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-soft" />
          <span className="text-xs text-white/60 font-semibold">IA spécialisée location courte durée · Algorithme 2026</span>
        </div>

        <h1 className="text-h1 text-white mb-4 tracking-tight">
          Audit annonce{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">Airbnb & Booking</span>
        </h1>
        <p className="text-white/50 text-lg mb-12 leading-relaxed">
          Score /100 · Benchmark concurrents · Contenu optimisé généré par IA
        </p>

        {/* Plateforme */}
        <div className="flex gap-3 mb-5 max-w-md mx-auto">
          {(["airbnb", "booking"] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-all duration-200 ${
                platform === p
                  ? "border-brand-green bg-brand-green/10 text-brand-green"
                  : "border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/60"
              }`}
            >
              {p === "airbnb" ? "🏠 Airbnb" : "🌐 Booking.com"}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="max-w-md mx-auto">
          <div className="flex gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-brand-green/50 transition-colors">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && launch()}
              placeholder={platform === "airbnb" ? "airbnb.fr/rooms/12345678" : "booking.com/hotel/..."}
              className="flex-1 bg-transparent text-white text-sm placeholder-white/25 px-3 py-2 focus:outline-none min-w-0"
            />
            <button
              onClick={launch}
              disabled={!url.trim()}
              className="bg-brand-green hover:bg-brand-light disabled:opacity-40 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shrink-0"
            >
              Analyser →
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-12 text-xs text-white/30 font-semibold">
          {["Score /100 précis", "Benchmark 5 concurrents", "Contenu réécrit par IA"].map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className="text-brand-green">✓</span> {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── LOADING / RUNNING ── */
  if (status === "loading" || status === "running") {
    const steps = [
      { label: "Scraping annonce", active: status === "loading" || msg.includes("Extraction") },
      { label: "Benchmark concurrents", active: msg.includes("concurrent") },
      { label: "Analyse IA", active: msg.includes("IA") || msg.includes("Gemini") || msg.includes("nal") },
    ];
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-white/5" />
          <div className="absolute inset-0 rounded-full border-4 border-t-brand-green border-r-brand-green/30 border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full bg-brand-green/5 flex items-center justify-center">
            <span className="text-brand-green text-xl">🔍</span>
          </div>
        </div>
        <p className="text-white font-extrabold text-xl mb-2 tracking-tight">{msg}</p>
        <p className="text-white/30 text-sm mb-10">L&apos;analyse complète prend ~90 secondes</p>
        <div className="flex items-center gap-3">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              {i > 0 && <div className="w-6 h-px bg-white/10" />}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                s.active ? "bg-brand-green/15 text-brand-green border border-brand-green/30" : "bg-white/5 text-white/25 border border-transparent"
              }`}>
                {s.active && <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />}
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── ERROR ── */
  if (status === "error") return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 text-3xl">⚠️</div>
      <p className="text-white font-extrabold text-xl mb-2">Analyse échouée</p>
      <p className="text-white/40 text-sm mb-8 max-w-sm">{err}</p>
      <button onClick={reset} className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
        ← Réessayer
      </button>
    </div>
  );

  /* ── DONE ── */
  if (status === "done" && audit) {
    const tabs: { id: Tab; label: string }[] = [
      { id: "summary", label: "Résumé" },
      { id: "diagnostic", label: "Diagnostic" },
      { id: "content", label: "Contenu optimisé" },
      { id: "benchmark", label: "Benchmark" },
    ];

    return (
      <div className="min-h-screen bg-ink">
        {/* Nav */}
        <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-20 bg-ink/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="text-white font-extrabold text-base tracking-tight">Rentimmo Academy</span>
            <span className="h-4 w-px bg-white/15" />
            <span className="text-white/40 text-sm truncate max-w-xs">{audit.listing.title}</span>
          </div>
          <button onClick={reset} className="text-white/40 hover:text-white text-sm font-semibold transition-colors flex items-center gap-1.5">
            ← Nouvelle analyse
          </button>
        </header>

        {/* Hero résultat */}
        <div className="bg-ink-soft border-b border-white/5">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex gap-6 items-center">
              {audit.listing.coverPhotoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={audit.listing.coverPhotoUrl}
                  alt={audit.listing.title}
                  className="w-28 h-24 object-cover rounded-2xl shrink-0 border border-white/10"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/30">
                    {platform === "airbnb" ? "Airbnb" : "Booking.com"}
                  </span>
                  {audit.listing.rating && (
                    <span className="text-[10px] font-bold text-amber-400/80">⭐ {audit.listing.rating.toFixed(1)}</span>
                  )}
                </div>
                <h1 className="text-white font-extrabold text-xl leading-tight mb-1 truncate">{audit.listing.title}</h1>
                <p className="text-white/40 text-sm mb-3">{audit.listing.location}</p>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-2">{audit.summary}</p>
                {audit.listing.url && (
                  <a href={audit.listing.url} target="_blank" rel="noopener noreferrer"
                    className="text-brand-green text-xs font-semibold hover:text-brand-light mt-2 inline-block transition-colors">
                    Voir l&apos;annonce →
                  </a>
                )}
              </div>
              <div className="shrink-0 text-center">
                <GaugeScore score={audit.globalScore} color={audit.gradeColor} />
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: audit.gradeColor + "20", color: audit.gradeColor, border: `1px solid ${audit.gradeColor}30` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: audit.gradeColor }} />
                  {audit.gradeFr.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/5 sticky top-[61px] z-10 bg-ink/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-5 py-4 text-sm font-semibold border-b-2 transition-all ${
                    tab === t.id
                      ? "border-brand-green text-brand-green"
                      : "border-transparent text-white/35 hover:text-white/60"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="max-w-4xl mx-auto px-4 py-8">

          {/* ── SUMMARY ── */}
          {tab === "summary" && (
            <div className="space-y-5">
              {/* Scores rapides */}
              <div className="grid grid-cols-4 gap-3">
                {audit.categories.map((c) => (
                  <div key={c.id} className="bg-white/5 border border-white/8 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-base">{c.icon}</span>
                      <span className="text-xs font-bold" style={{ color: c.gradeColor }}>{c.score}</span>
                    </div>
                    <BarScore score={c.score} color={c.gradeColor} />
                    <p className="text-white/40 text-xs mt-2 leading-tight">{c.label}</p>
                  </div>
                ))}
              </div>

              {/* Top actions */}
              <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
                <h2 className="text-white font-extrabold text-base mb-4">Actions prioritaires</h2>
                <div className="grid grid-cols-2 gap-3">
                  {audit.topActions.map((a, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${
                      a.impact === "HIGH"
                        ? "bg-red-500/8 border-red-500/15"
                        : "bg-amber-500/8 border-amber-500/15"
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <ImpactPill impact={a.impact} />
                        <span className="text-[10px] font-bold text-white/25 uppercase tracking-wider">{a.category}</span>
                      </div>
                      <p className="text-white/80 text-sm leading-snug">{a.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue projection */}
              <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
                <h2 className="text-white font-extrabold text-base mb-4">Projection revenus</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: "Occupation actuelle", value: audit.revenueProjection.currentOccupancy, accent: false },
                    { label: "Objectif réaliste", value: audit.revenueProjection.targetOccupancy, accent: true },
                    { label: "Gain potentiel", value: audit.revenueProjection.potentialGain, accent: true },
                  ].map((s) => (
                    <div key={s.label} className={`rounded-xl p-4 text-center border ${s.accent ? "bg-brand-green/10 border-brand-green/20" : "bg-white/5 border-white/8"}`}>
                      <div className="text-2xl font-extrabold mb-1" style={{ color: s.accent ? "#2DB84B" : "rgba(255,255,255,0.7)" }}>{s.value}</div>
                      <div className="text-[11px] text-white/35 font-semibold">{s.label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-white/25 text-xs">{audit.revenueProjection.basis}</p>
              </div>
            </div>
          )}

          {/* ── DIAGNOSTIC ── */}
          {tab === "diagnostic" && (
            <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
              {/* Category tabs */}
              <div className="flex overflow-x-auto border-b border-white/8 scrollbar-none">
                {audit.categories.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setCatIdx(i)}
                    className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold whitespace-nowrap shrink-0 border-b-2 transition-all ${
                      catIdx === i
                        ? "border-brand-green text-white bg-brand-green/5"
                        : "border-transparent text-white/35 hover:text-white/60"
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                    <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: c.gradeColor + "20", color: c.gradeColor }}>
                      {c.score}
                    </span>
                  </button>
                ))}
              </div>

              {(() => {
                const c = audit.categories[catIdx];
                return (
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{c.icon}</span>
                          <div>
                            <h3 className="text-white font-extrabold text-lg">{c.label}</h3>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ backgroundColor: c.gradeColor + "20", color: c.gradeColor }}>
                              {c.gradeLabel}
                            </span>
                          </div>
                        </div>
                        <div className="w-48 mt-3">
                          <BarScore score={c.score} color={c.gradeColor} />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-5xl font-extrabold tracking-tight" style={{ color: c.gradeColor }}>{c.score}</div>
                        <div className="text-white/25 text-xs">/100</div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-white/25 mb-3">Observations</h4>
                      <ul className="space-y-2">
                        {c.findings.map((f, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-white/65">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-white/20 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl border" style={{ borderColor: c.gradeColor + "25", backgroundColor: c.gradeColor + "0a" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <ImpactPill impact={c.recommendation.impact} />
                        <span className="text-[10px] font-bold text-white/25 uppercase tracking-wider">Recommandation</span>
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">{c.recommendation.action}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── CONTENT ── */}
          {tab === "content" && (
            <div className="space-y-5">
              {/* Titres */}
              <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
                <h2 className="text-white font-extrabold text-base mb-4">Titres optimisés</h2>
                <div className="space-y-2">
                  {[audit.generatedContent.optimizedTitle, ...audit.generatedContent.optimizedTitleVariants].map((t, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 hover:bg-white/8 border border-white/8 rounded-xl px-4 py-3.5 transition-colors group">
                      <span className="text-[10px] font-bold text-white/25 w-12 shrink-0">
                        {i === 0 ? "⭐ Best" : `Var. ${i}`}
                      </span>
                      <span className="flex-1 text-white/80 text-sm font-medium">{t}</span>
                      <button
                        onClick={() => copy(t, `t${i}`)}
                        className="text-[11px] text-brand-green hover:text-brand-light font-bold shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copied === `t${i}` ? "✓ Copié" : "Copier"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-white font-extrabold text-base">Début de description réécrite</h2>
                    <p className="text-white/30 text-xs mt-0.5">Style fiche technique · algorithme 2026</p>
                  </div>
                  <button onClick={() => copy(audit.generatedContent.optimizedDescriptionOpening, "desc")}
                    className="text-xs text-brand-green hover:text-brand-light font-bold transition-colors">
                    {copied === "desc" ? "✓ Copié" : "Copier"}
                  </button>
                </div>
                <pre className="bg-white/5 border border-white/8 rounded-xl p-4 text-sm text-white/65 leading-relaxed whitespace-pre-wrap font-sans">
                  {audit.generatedContent.optimizedDescriptionOpening}
                </pre>
              </div>

              {/* Key improvements */}
              <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
                <h2 className="text-white font-extrabold text-base mb-4">Plan d&apos;action priorisé</h2>
                <ol className="space-y-3">
                  {audit.generatedContent.keyImprovements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="w-6 h-6 rounded-full bg-brand-green/15 text-brand-green text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-white/70 text-sm leading-relaxed">{imp}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* ── BENCHMARK ── */}
          {tab === "benchmark" && (
            <div className="space-y-5">
              <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
                <h2 className="text-white font-extrabold text-base mb-1">Benchmark concurrents</h2>
                <p className="text-white/30 text-sm mb-6">Annonces similaires dans la même zone géographique</p>

                {audit.competitors.length === 0 ? (
                  <p className="text-white/25 text-sm text-center py-10">Pas de données de benchmark disponibles</p>
                ) : (
                  <div className="space-y-2">
                    {audit.competitors.map((c, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/8 border border-white/8 rounded-xl transition-colors">
                        <span className="text-white/15 font-extrabold text-lg w-6 text-center shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/75 text-sm font-semibold truncate">{c.title}</p>
                          {c.url && (
                            <a href={c.url} target="_blank" rel="noopener noreferrer"
                              className="text-brand-green/60 text-xs hover:text-brand-green transition-colors">Voir l&apos;annonce →</a>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs shrink-0">
                          {c.rating && <span className="text-amber-400 font-bold">⭐ {c.rating.toFixed(1)}</span>}
                          {c.reviewsCount > 0 && <span className="text-white/30">{c.reviewsCount} avis</span>}
                          {c.photosCount > 0 && <span className="text-white/30">📸 {c.photosCount}</span>}
                          {c.pricePerNight && <span className="text-white/70 font-bold">{c.pricePerNight}€/nuit</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comparaison vs ton annonce */}
              {audit.competitors.length > 0 && (() => {
                const withPrice = audit.competitors.filter(c => c.pricePerNight);
                const withRating = audit.competitors.filter(c => c.rating);
                const avgPrice = withPrice.length ? withPrice.reduce((s, c) => s + (c.pricePerNight || 0), 0) / withPrice.length : 0;
                const avgRating = withRating.length ? withRating.reduce((s, c) => s + (c.rating || 0), 0) / withRating.length : 0;
                const avgPhotos = audit.competitors.reduce((s, c) => s + c.photosCount, 0) / audit.competitors.length;

                const stats = [
                  { label: "Prix / nuit", mine: audit.listing.pricePerNight ? `${audit.listing.pricePerNight}€` : "—", avg: avgPrice ? `${Math.round(avgPrice)}€` : "—", better: audit.listing.pricePerNight ? audit.listing.pricePerNight <= avgPrice : null },
                  { label: "Note moyenne", mine: audit.listing.rating ? audit.listing.rating.toFixed(1) : "—", avg: avgRating ? avgRating.toFixed(1) : "—", better: audit.listing.rating ? audit.listing.rating >= avgRating : null },
                  { label: "Nb photos", mine: `${audit.listing.photosCount}`, avg: `${Math.round(avgPhotos)}`, better: audit.listing.photosCount >= avgPhotos },
                ];

                return (
                  <div className="bg-white/5 border border-white/8 rounded-2xl p-6">
                    <h3 className="text-white font-extrabold text-base mb-4">Ton annonce vs la concurrence</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {stats.map((s) => (
                        <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-4 text-center">
                          <div className="text-white/30 text-xs font-semibold mb-3">{s.label}</div>
                          <div className="text-white font-extrabold text-xl mb-1">{s.mine}</div>
                          <div className={`text-xs font-bold ${s.better === null ? "text-white/25" : s.better ? "text-brand-green" : "text-amber-400"}`}>
                            {s.better === null ? "—" : s.better ? "↑" : "↓"} moy. {s.avg}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
