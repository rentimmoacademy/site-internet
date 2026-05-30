"use client";

import { useState, useRef, useEffect } from "react";
import { X, CalendarCheck, Sparkles } from "lucide-react";

const API_BASE = "/api";
const POLL_MS = 4000;

type Platform = "airbnb" | "booking";
type Step = "form" | "loading" | "result" | "booking" | "error";

interface Audit {
  globalScore: number; grade: string; gradeFr: string; gradeColor: string;
  listing: { title: string; location: string; coverPhotoUrl: string };
  topActions: Array<{ impact: string; category: string; action: string; icon: string }>;
  revenueProjection: {
    currentMonthlyRevenue: number; optimizedMonthlyRevenue: number;
    annualGain: number; insight: string;
  };
}

function GaugeScore({ score, color }: { score: number; color: string }) {
  const r = 52; const cx = 60; const cy = 62;
  const circumference = Math.PI * r;
  return (
    <div className="relative flex flex-col items-center">
      <svg width={120} height={70} viewBox="0 0 120 70" fill="none">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke="#ffffff08" strokeWidth={9} strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke={color} strokeWidth={9} strokeLinecap="round"
          strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div className="absolute bottom-0 text-center">
        <div className="text-2xl font-extrabold text-white leading-none tracking-tight">{score}</div>
        <div className="text-[10px] text-white/40 font-semibold mt-0.5">/100</div>
      </div>
    </div>
  );
}

export default function SuperBnbAuditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<Step>("form");
  const [platform, setPlatform] = useState<Platform>("airbnb");
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [audit, setAudit] = useState<Audit | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runRef = useRef({ listing: "", competitor: "" });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleClose = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStep("form"); setUrl(""); setAudit(null); setErrMsg(""); setMsg("");
    runRef.current = { listing: "", competitor: "" };
    onClose();
  };

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
      runRef.current = { listing: d.listingRunId, competitor: "" };
      pollRef.current = setInterval(doPoll, POLL_MS);
    } catch (e: unknown) {
      setErrMsg(e instanceof Error ? e.message : "Erreur réseau");
      setStep("error");
    }
  };

  const doPoll = async () => {
    const { listing, competitor } = runRef.current;
    if (!listing) return;
    try {
      const p = new URLSearchParams({
        listingRunId: listing, platform, url: url.trim(),
        ...(competitor ? { competitorRunId: competitor } : {}),
      });
      const r = await fetch(`${API_BASE}/audit-result?${p}`);
      const d = await r.json();
      if (d.status === "RUNNING") { setMsg(d.message || "Analyse en cours…"); return; }
      if (d.status === "COMPETITORS_STARTED") { runRef.current.competitor = d.competitorRunId; setMsg("Benchmark concurrents…"); return; }
      if (d.status === "DONE") { clearInterval(pollRef.current!); setAudit(d.audit); setStep("result"); return; }
      if (d.status === "ERROR") { clearInterval(pollRef.current!); setErrMsg(d.message || "Erreur"); setStep("error"); }
    } catch { /* continue polling */ }
  };

  if (!open) return null;

  const topActions = audit?.topActions.filter((a) => a.impact === "HIGH").slice(0, 3) ?? [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="relative w-full sm:max-w-lg bg-auto-navy border border-white/10 sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-glow-mint font-poppins"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(0,196,154,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />

        {/* Sticky close */}
        <div className="sticky top-0 z-10 flex justify-end p-4 bg-auto-navy/90 backdrop-blur-sm">
          <button
            onClick={handleClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="relative overflow-y-auto px-6 pb-8 md:px-8" style={{ maxHeight: "calc(92vh - 56px)" }}>

          {/* ── FORM ── */}
          {step === "form" && (
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-auto-mint/30 bg-auto-mint/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-auto-mint mb-5">
                <Sparkles size={10} /> Gratuit · Résultat en 60 sec
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight mb-2">
                Où en est ton annonce ?
              </h2>
              <p className="text-sm text-white/50 mb-7 leading-relaxed">
                Score /100 · Benchmark concurrents · Gain de revenus estimé
              </p>

              <div className="flex gap-2 mb-4">
                {(["airbnb", "booking"] as Platform[]).map((p) => (
                  <button key={p} onClick={() => setPlatform(p)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm border transition-all ${
                      platform === p
                        ? "border-auto-mint/60 bg-auto-mint/15 text-auto-mint"
                        : "border-white/10 bg-white/5 text-white/35 hover:border-white/20"
                    }`}>
                    {p === "airbnb" ? "🏠 Airbnb" : "🌐 Booking.com"}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl p-1.5 focus-within:border-auto-mint/40 transition-colors mb-3">
                <input
                  type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && launch()}
                  placeholder={platform === "airbnb" ? "airbnb.fr/rooms/12345678" : "booking.com/hotel/..."}
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/20 px-3 py-2 focus:outline-none min-w-0"
                  autoFocus
                />
                <button onClick={launch} disabled={!url.trim()}
                  className="bg-auto-mint hover:brightness-110 disabled:opacity-40 text-auto-navy font-bold text-sm px-5 py-2.5 rounded-lg transition-all shrink-0">
                  Analyser →
                </button>
              </div>
              <p className="text-white/25 text-xs text-center">Sans inscription · Sans engagement</p>
            </div>
          )}

          {/* ── LOADING ── */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                <div className="absolute inset-0 rounded-full border-4 border-t-auto-mint border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>
              <p className="text-white font-extrabold text-lg mb-1">{msg || "Analyse en cours…"}</p>
              <p className="text-white/40 text-sm">~60 secondes</p>
              <div className="mt-7 flex flex-col gap-2.5 text-left w-full max-w-xs mx-auto">
                {[
                  { label: "Scraping annonce", done: msg.includes("concurrent") || msg.includes("IA"), active: !msg.includes("concurrent") && !msg.includes("IA") },
                  { label: "Benchmark concurrents", done: false, active: msg.includes("concurrent") },
                  { label: "Analyse IA", done: false, active: msg.includes("IA") || msg.includes("nal") },
                ].map((s) => (
                  <div key={s.label} className={`flex items-center gap-2.5 text-sm transition-colors ${s.active ? "text-auto-mint" : s.done ? "text-white/30 line-through" : "text-white/25"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.active ? "bg-auto-mint animate-pulse" : s.done ? "bg-white/20" : "bg-white/15"}`} />
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {step === "result" && audit && (
            <div>
              {/* Listing header */}
              <div className="flex items-center gap-4 mb-5">
                {audit.listing.coverPhotoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={audit.listing.coverPhotoUrl} alt={audit.listing.title}
                    className="w-16 h-14 object-cover rounded-xl shrink-0 border border-white/10"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-extrabold text-sm leading-tight truncate">{audit.listing.title}</p>
                  <p className="text-white/40 text-xs mt-0.5 truncate">{audit.listing.location}</p>
                </div>
                <div className="shrink-0">
                  <GaugeScore score={audit.globalScore} color={audit.gradeColor} />
                </div>
              </div>

              {/* Grade pill */}
              <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-5"
                style={{ backgroundColor: audit.gradeColor + "20", color: audit.gradeColor, border: `1px solid ${audit.gradeColor}30` }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: audit.gradeColor }} />
                {audit.gradeFr.toUpperCase()} — {audit.globalScore}/100
              </div>

              {/* Top actions */}
              {topActions.length > 0 && (
                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-auto-mint mb-3">Points critiques</p>
                  <div className="space-y-2">
                    {topActions.map((a, i) => (
                      <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/8 rounded-xl p-3">
                        <span className="text-base shrink-0 mt-0.5">{a.icon}</span>
                        <p className="text-sm text-white/80 leading-snug">{a.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gain banner */}
              {(audit.revenueProjection?.annualGain ?? 0) > 0 && (
                <div className="bg-auto-mint/10 border border-auto-mint/25 rounded-2xl p-4 mb-6 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-auto-mint mb-1">Gain potentiel estimé</p>
                  <p className="text-3xl font-extrabold text-white tracking-tight">
                    +{audit.revenueProjection.annualGain.toLocaleString("fr-FR")} €/an
                  </p>
                  {audit.revenueProjection.insight && (
                    <p className="text-white/45 text-xs mt-1 leading-relaxed">{audit.revenueProjection.insight}</p>
                  )}
                </div>
              )}

              {/* CTA */}
              <button
                onClick={() => setStep("booking")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-auto-mint px-6 py-4 font-bold text-auto-navy hover:brightness-110 transition-all hover:shadow-glow-mint text-sm"
              >
                <CalendarCheck size={16} /> Réserve ton audit gratuit — on corrige ça ensemble
              </button>
              <p className="text-white/30 text-xs text-center mt-3">30 min · Sans engagement · Avec Marwan</p>
            </div>
          )}

          {/* ── BOOKING ── */}
          {step === "booking" && (
            <div>
              <button onClick={() => setStep("result")}
                className="text-white/40 hover:text-white text-sm font-semibold mb-4 flex items-center gap-1 transition-colors">
                ← Retour aux résultats
              </button>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-auto-mint mb-4">Choisis ton créneau</p>
              <iframe
                src="https://cal.com/rentimmoacademy/superbnbacademy?embed=true"
                className="w-full rounded-2xl border border-white/10 bg-white/5"
                style={{ height: "520px" }}
                title="Réserver un audit Super BnB Academy"
              />
            </div>
          )}

          {/* ── ERROR ── */}
          {step === "error" && (
            <div className="text-center py-10">
              <p className="text-4xl mb-4">⚠️</p>
              <p className="text-white font-extrabold text-lg mb-2">Analyse impossible</p>
              <p className="text-white/50 text-sm mb-7 max-w-xs mx-auto">{errMsg || "URL invalide ou annonce inaccessible."}</p>
              <button
                onClick={() => { setStep("form"); setErrMsg(""); }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white/80 hover:bg-white/5 transition-colors"
              >
                ← Réessayer
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
