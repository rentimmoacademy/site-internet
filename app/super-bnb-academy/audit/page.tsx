"use client";

import { useState, useRef } from "react";

const API_BASE = "/api";
const POLL_MS = 4000;
const CAL_URL = "https://cal.com/rentimmoacademy/superbnbacademy";

type Platform = "airbnb" | "booking";
type Step = "form" | "loading" | "optin" | "result" | "error";

interface Category {
  id: string; label: string; icon: string; score: number;
  gradeLabel: string; gradeColor: string; findings: string[];
  recommendation: { impact: string; action: string };
}
interface Audit {
  globalScore: number; grade: string; gradeFr: string; gradeColor: string; summary: string;
  listing: {
    title: string; location: string; coverPhotoUrl: string; photosCount: number;
    rating: number | null; reviewsCount: number; pricePerNight: number | null;
    currency: string; url: string;
  };
  categories: Category[];
  topActions: Array<{ impact: string; category: string; action: string; icon: string }>;
  revenueProjection: {
    currentOccupancy: string; targetOccupancy: string; potentialGain: string; basis: string;
  };
  generatedContent: {
    optimizedTitle: string; keyImprovements: string[];
  };
}

function GaugeScore({ score, color, size = "lg" }: { score: number; color: string; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  const w = isLg ? 160 : 120; const h = isLg ? 92 : 70;
  const r = isLg ? 70 : 52;
  const cx = w / 2; const cy = h - 8;
  const circumference = Math.PI * r;
  return (
    <div className="relative flex flex-col items-center">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} stroke="#ffffff08" strokeWidth={isLg ? 12 : 9} strokeLinecap="round" />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke={color} strokeWidth={isLg ? 12 : 9} strokeLinecap="round"
          strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <div className="absolute bottom-0 text-center">
        <div className={`font-extrabold text-white leading-none tracking-tight ${isLg ? "text-4xl" : "text-2xl"}`}>{score}</div>
        <div className={`text-white/40 font-semibold mt-0.5 ${isLg ? "text-xs" : "text-[10px]"}`}>/100</div>
      </div>
    </div>
  );
}

function BarScore({ score, color }: { score: number; color: string }) {
  return (
    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
    </div>
  );
}

function ImpactPill({ impact }: { impact: string }) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    HIGH:   { bg: "bg-red-500/15",   text: "text-red-400",   label: "Impact fort" },
    MEDIUM: { bg: "bg-amber-500/15", text: "text-amber-400", label: "Impact moyen" },
    LOW:    { bg: "bg-blue-500/15",  text: "text-blue-400",  label: "Impact faible" },
  };
  const s = map[impact] ?? map.LOW;
  return <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>;
}

export default function AuditPublicPage() {
  const [step, setStep] = useState<Step>("form");
  const [platform, setPlatform] = useState<Platform>("airbnb");
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [audit, setAudit] = useState<Audit | null>(null);

  // Optin
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gestion, setGestion] = useState("");
  const [defi, setDefi] = useState<string[]>([]);
  const [optinLoading, setOptinLoading] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const run = useRef({ listing: "", competitor: "" });
  const pendingAudit = useRef<Audit | null>(null);

  const launch = async () => {
    if (!url.trim()) return;
    setStep("loading"); setMsg("Lancement de l'analyse…");
    try {
      const r = await fetch(`${API_BASE}/start-audit`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), platform }),
      });
      const d = await r.json();
      if (!r.ok || d.error) { setErrMsg(d.error || "Erreur"); setStep("error"); return; }
      run.current = { listing: d.listingRunId, competitor: "" };
      pollRef.current = setInterval(doPoll, POLL_MS);
    } catch (e: unknown) { setErrMsg(e instanceof Error ? e.message : "Erreur réseau"); setStep("error"); }
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
      if (d.status === "DONE") {
        clearInterval(pollRef.current!);
        pendingAudit.current = d.audit;
        setStep("optin");
        return;
      }
      if (d.status === "ERROR") { clearInterval(pollRef.current!); setErrMsg(d.message || "Erreur"); setStep("error"); }
    } catch { /* continue */ }
  };

  const toggleDefi = (v: string) =>
    setDefi((p) => p.includes(v) ? p.filter((x) => x !== v) : [...p, v]);

  const submitOptin = async () => {
    if (!email || !firstName) return;
    setOptinLoading(true);
    const a = pendingAudit.current!;
    try {
      await fetch(`${API_BASE}/audit-optin`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, phone, gestion, defi, listingUrl: url, listingScore: a.globalScore, platform }),
      });
    } catch { /* silently pass */ }
    setAudit(a); setStep("result"); setOptinLoading(false);
  };

  const reset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStep("form"); setUrl(""); setAudit(null); setErrMsg("");
    run.current = { listing: "", competitor: "" };
  };

  /* ── FORM ── */
  if (step === "form") return (
    <div className="min-h-screen bg-ink" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px" }}>
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-2xl mx-auto">
        <span className="text-white font-extrabold text-base tracking-tight">Rentimmo Academy</span>
        <span className="text-white/30 text-sm font-semibold">Audit Annonce LCD</span>
      </header>

      <div className="max-w-xl mx-auto px-4 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 rounded-full px-4 py-2 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse-soft" />
          <span className="text-xs text-brand-green font-bold">Gratuit · Résultat en 90 secondes</span>
        </div>

        <h1 className="text-h1 text-white mb-4 tracking-tight">
          Ton annonce est-elle{" "}
          <span className="bg-brand-gradient bg-clip-text text-transparent">optimisée ?</span>
        </h1>
        <p className="text-white/45 text-base mb-12 leading-relaxed">
          Analyse IA de ton annonce Airbnb ou Booking.com · Score /100 · Benchmark concurrents · Plan d&apos;action personnalisé
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
          <div className="flex gap-3 mb-5">
            {(["airbnb", "booking"] as Platform[]).map((p) => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-all ${
                  platform === p
                    ? "border-brand-green bg-brand-green/10 text-brand-green"
                    : "border-white/10 bg-white/5 text-white/35 hover:border-white/20"
                }`}>
                {p === "airbnb" ? "🏠 Airbnb" : "🌐 Booking.com"}
              </button>
            ))}
          </div>

          <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 focus-within:border-brand-green/40 transition-colors mb-4">
            <input
              type="url" value={url} onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && launch()}
              placeholder={platform === "airbnb" ? "airbnb.fr/rooms/12345678" : "booking.com/hotel/..."}
              className="flex-1 bg-transparent text-white text-sm placeholder-white/20 px-3 py-2 focus:outline-none min-w-0"
            />
            <button onClick={launch} disabled={!url.trim()}
              className="bg-brand-green hover:bg-brand-light disabled:opacity-40 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0">
              Analyser →
            </button>
          </div>

          <p className="text-white/20 text-xs text-center">Gratuit · Sans inscription · Sans engagement</p>
        </div>

        {/* Proof */}
        <div className="mt-10 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: "📊", label: "Score /100", sub: "par catégorie" },
            { icon: "🏆", label: "Benchmark", sub: "5 concurrents" },
            { icon: "✨", label: "Contenu IA", sub: "titre + description" },
          ].map((f) => (
            <div key={f.label} className="bg-white/5 border border-white/8 rounded-xl p-4">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-white/75 text-xs font-bold">{f.label}</div>
              <div className="text-white/25 text-xs">{f.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ── LOADING ── */
  if (step === "loading") {
    const steps = [
      { label: "Scraping annonce", done: msg.includes("concurrent") || msg.includes("IA") },
      { label: "Benchmark concurrents", done: false, active: msg.includes("concurrent") },
      { label: "Analyse IA", done: false, active: msg.includes("IA") || msg.includes("nal") },
    ];
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 text-center">
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-white/5" />
          <div className="absolute inset-0 rounded-full border-4 border-t-brand-green border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <p className="text-white font-extrabold text-xl mb-2">{msg}</p>
        <p className="text-white/25 text-sm mb-10">Ne ferme pas cette page · ~90 secondes</p>
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              {i > 0 && <div className="w-5 h-px bg-white/10" />}
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                s.done ? "bg-brand-green/20 text-brand-green" :
                s.active ? "bg-brand-green/15 text-brand-green border border-brand-green/30" :
                "bg-white/5 text-white/20"
              }`}>
                {s.done ? "✓ " : ""}{s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── OPTIN ── */
  if (step === "optin" && pendingAudit.current) {
    const a = pendingAudit.current;
    return (
      <div className="min-h-screen bg-ink py-10 px-4">
        <div className="max-w-lg mx-auto">
          {/* Preview floutée */}
          <div className="relative bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">Analyse terminée</p>
                <p className="text-white font-extrabold text-base leading-tight">{a.listing.title || "Ton annonce"}</p>
                <p className="text-white/30 text-xs mt-0.5">{a.listing.location}</p>
              </div>
              <div className="relative">
                <div className="filter blur-sm pointer-events-none opacity-60">
                  <GaugeScore score={a.globalScore} color={a.gradeColor} size="sm" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl">🔒</span>
                </div>
              </div>
            </div>
            {/* Barres floutées */}
            <div className="mt-4 grid grid-cols-4 gap-2 filter blur-sm opacity-40 pointer-events-none">
              {a.categories.slice(0, 4).map((c) => (
                <div key={c.id} className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-sm">{c.icon}</div>
                  <div className="h-1 bg-white/20 rounded-full mt-1">
                    <div className="h-full rounded-full" style={{ width: `${c.score}%`, backgroundColor: c.gradeColor }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink/0 via-ink/60 to-ink/90 flex items-end justify-center pb-5">
              <p className="text-white/60 text-sm font-semibold bg-white/8 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
                Renseigne tes infos pour accéder au rapport complet
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-extrabold text-xl mb-1">Voir mon rapport complet</h2>
            <p className="text-white/30 text-sm mb-6">Score /100 · Benchmark · Plan d&apos;action · Contenu optimisé</p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input type="text" placeholder="Prénom *" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                className="bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green/50 transition-colors" />
              <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-green/50 transition-colors" />
            </div>
            <input type="tel" placeholder="WhatsApp (recommandé)" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white placeholder-white/25 rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-brand-green/50 transition-colors" />

            <div className="mb-4">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">Logements gérés</p>
              <div className="grid grid-cols-4 gap-2">
                {["1", "2–5", "6–15", "15+"].map((v) => (
                  <button key={v} onClick={() => setGestion(v)}
                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${
                      gestion === v ? "border-brand-green bg-brand-green/10 text-brand-green" : "border-white/10 bg-white/5 text-white/35 hover:border-white/20"
                    }`}>{v}</button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">Ton défi principal</p>
              <div className="grid grid-cols-2 gap-2">
                {["Taux d'occupation trop bas", "Annonce peu visible", "Prix non optimisé", "Mauvaises reviews"].map((v) => (
                  <button key={v} onClick={() => toggleDefi(v)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left transition-all ${
                      defi.includes(v) ? "border-brand-green bg-brand-green/10 text-brand-green" : "border-white/10 bg-white/5 text-white/35 hover:border-white/20"
                    }`}>
                    {defi.includes(v) ? "✓ " : ""}{v}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={submitOptin} disabled={!email || !firstName || optinLoading}
              className="w-full bg-brand-green hover:bg-brand-light disabled:opacity-40 text-white font-extrabold py-3.5 rounded-xl text-base transition-colors">
              {optinLoading ? "Chargement…" : "Voir mon rapport complet →"}
            </button>
            <p className="text-white/15 text-xs text-center mt-3">Pas de spam · Données confidentielles</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── RESULT ── */
  if (step === "result" && audit) return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-2xl mx-auto">
        <span className="text-white font-extrabold text-base tracking-tight">Rentimmo Academy</span>
        <button onClick={reset} className="text-white/30 hover:text-white text-sm font-semibold transition-colors">← Nouvelle analyse</button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* Score hero */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            {audit.listing.coverPhotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={audit.listing.coverPhotoUrl} alt={audit.listing.title}
                className="w-20 h-20 object-cover rounded-xl shrink-0 border border-white/10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1">
                {platform === "airbnb" ? "Airbnb" : "Booking.com"}
              </p>
              <h2 className="text-white font-extrabold text-base leading-tight mb-0.5 truncate">{audit.listing.title}</h2>
              <p className="text-white/30 text-xs mb-2">{audit.listing.location}</p>
              <p className="text-white/55 text-sm leading-relaxed line-clamp-2">{audit.summary}</p>
            </div>
            <div className="shrink-0 text-center">
              <GaugeScore score={audit.globalScore} color={audit.gradeColor} size="sm" />
              <div className="mt-1.5 text-xs font-bold px-2.5 py-1 rounded-full inline-block"
                style={{ backgroundColor: audit.gradeColor + "20", color: audit.gradeColor }}>
                {audit.gradeFr.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Category scores */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <h3 className="text-white font-extrabold text-sm mb-4">Scores par catégorie</h3>
          <div className="space-y-3">
            {audit.categories.map((c) => (
              <div key={c.id}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span>{c.icon}</span>
                  <span className="text-white/65 text-xs font-semibold flex-1">{c.label}</span>
                  <span className="text-xs font-extrabold" style={{ color: c.gradeColor }}>{c.score}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: c.gradeColor + "20", color: c.gradeColor }}>{c.gradeLabel}</span>
                </div>
                <BarScore score={c.score} color={c.gradeColor} />
                <p className="text-white/30 text-xs mt-1 ml-6 leading-tight">{c.recommendation.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top actions */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <h3 className="text-white font-extrabold text-sm mb-4">Actions prioritaires</h3>
          <div className="space-y-2.5">
            {audit.topActions.map((a, i) => (
              <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                a.impact === "HIGH" ? "bg-red-500/8 border-red-500/15" : "bg-amber-500/8 border-amber-500/15"
              }`}>
                <span className="text-lg shrink-0 mt-0.5">{a.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ImpactPill impact={a.impact} />
                    <span className="text-[10px] text-white/20 uppercase tracking-wider font-bold">{a.category}</span>
                  </div>
                  <p className="text-white/75 text-sm leading-snug">{a.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimized title preview */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <h3 className="text-white font-extrabold text-sm mb-3">Titre optimisé suggéré</h3>
          <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-4 text-sm font-semibold text-brand-green leading-relaxed">
            &ldquo;{audit.generatedContent.optimizedTitle}&rdquo;
          </div>
          <p className="text-white/20 text-xs mt-2">Conçu pour l&apos;algorithme 2026 · données concrètes, zéro marketing flou</p>
        </div>

        {/* Revenue */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <h3 className="text-white font-extrabold text-sm mb-4">Potentiel de revenus</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Occupation actuelle", value: audit.revenueProjection.currentOccupancy, accent: false },
              { label: "Objectif réaliste", value: audit.revenueProjection.targetOccupancy, accent: true },
              { label: "Gain potentiel", value: audit.revenueProjection.potentialGain, accent: true },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-3.5 text-center border ${s.accent ? "bg-brand-green/10 border-brand-green/20" : "bg-white/5 border-white/8"}`}>
                <div className="font-extrabold text-lg mb-0.5" style={{ color: s.accent ? "#2DB84B" : "rgba(255,255,255,0.65)" }}>{s.value}</div>
                <div className="text-[10px] text-white/25 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Super BnB Academy */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1A6B33 0%, #2DB84B 60%, #5FD87A 100%)" }}>
          <div className="px-6 py-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 mb-5">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Super BnB Academy</span>
            </div>
            <h3 className="text-white font-extrabold text-xl mb-2 tracking-tight">
              {audit.globalScore < 70
                ? `Ton annonce score ${audit.globalScore}/100 — on peut largement faire mieux`
                : `Bonne base ! Passe de ${audit.globalScore} → 90+ /100`}
            </h3>
            <p className="text-white/75 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
              Réserve ton audit stratégique gratuit. On analyse ton portfolio complet et tu repars avec le plan exact pour maximiser tes revenus LCD.
            </p>
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
              className="inline-block bg-white text-brand-dark font-extrabold text-base px-8 py-3.5 rounded-xl hover:bg-cream transition-colors shadow-glow">
              Réserver mon audit gratuit →
            </a>
            <p className="text-white/40 text-xs mt-4">30 min · Gratuit · Places limitées</p>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── ERROR ── */
  if (step === "error") return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 text-3xl">⚠️</div>
      <p className="text-white font-extrabold text-xl mb-2">Analyse échouée</p>
      <p className="text-white/35 text-sm mb-7 max-w-sm">{errMsg}</p>
      <button onClick={reset} className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
        ← Réessayer
      </button>
    </div>
  );

  return null;
}
