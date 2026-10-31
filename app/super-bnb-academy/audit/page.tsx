"use client";

import { useState, useRef, useEffect } from "react";
import Logo from "@/components/layout/Logo";
import { trackEvent, trackMeta } from "@/lib/gtag";

const API_BASE = "/api";
const POLL_MS = 4000;
const CAL_URL = "https://cal.com/rentimmoacademy/superbnbacademy";

type Platform = "airbnb" | "booking";
type Step = "form" | "quiz" | "loading" | "optin" | "result" | "error";

interface QuizQuestion {
  key: "gestion" | "caMensuel" | "heuresOp" | "defi" | "perteEstimee";
  title: string;
  options: string[];
  multi?: boolean;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  { key: "gestion", title: "Combien de logements gères-tu actuellement ?", options: ["1", "2–5", "6–15", "15+"] },
  { key: "caMensuel", title: "Quel est le chiffre d'affaires mensuel moyen de ton parc ?", options: ["< 3 000 €", "3 000 € – 8 000 €", "8 000 € – 25 000 €", "25 000 €+"] },
  { key: "heuresOp", title: "Combien d'heures par semaine passes-tu sur l'opérationnel (ménage, messages, urgences) ?", options: ["20h+", "10–20h", "< 10h"] },
  { key: "defi", title: "Quel est ton plus gros frein pour doubler ton activité d'ici 6 mois ?", options: ["Taux d'occupation trop bas", "Annonce peu visible", "Prix non optimisé", "Je n'ai pas le temps de tout gérer"], multi: true },
  { key: "perteEstimee", title: "Combien penses-tu perdre chaque mois à cause de ce frein ?", options: ["< 1 000 €", "1 000 € – 3 000 €", "3 000 € – 10 000 €", "10 000 €+"] },
];

interface ScalabilityResult { score: number; stageLabel: string; stageColor: string }

function computeScalabilityScore(a: { gestion: string; caMensuel: string; heuresOp: string; defi: string[]; perteEstimee: string }): ScalabilityResult {
  const logementsPts: Record<string, number> = { "1": 3, "2–5": 8, "6–15": 12, "15+": 15 };
  const caPts: Record<string, number> = { "< 3 000 €": 2, "3 000 € – 8 000 €": 5, "8 000 € – 25 000 €": 8, "25 000 €+": 10 };
  const heuresPts: Record<string, number> = { "20h+": 5, "10–20h": 15, "< 10h": 25 };
  const pertePts: Record<string, number> = { "< 1 000 €": 25, "1 000 € – 3 000 €": 18, "3 000 € – 10 000 €": 10, "10 000 €+": 5 };
  const defiCount = a.defi.length;
  const defiPts = defiCount === 0 ? 25 : defiCount === 1 ? 18 : defiCount === 2 ? 10 : 5;
  const score = (logementsPts[a.gestion] ?? 0) + (caPts[a.caMensuel] ?? 0) + (heuresPts[a.heuresOp] ?? 0) + defiPts + (pertePts[a.perteEstimee] ?? 0);
  if (score < 40) return { score, stageLabel: "Artisan dépendant", stageColor: "#EF4444" };
  if (score < 70) return { score, stageLabel: "Gestionnaire débordé", stageColor: "#F59E0B" };
  return { score, stageLabel: "CEO scalable", stageColor: "#B6F23A" };
}

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
    currentOccupancy: number; targetOccupancy: number;
    currentADR: number; marketADR: number;
    currentMonthlyRevenue: number; optimizedMonthlyRevenue: number;
    annualGain: number; occupancySource: string; insight: string;
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

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: "700ms",
        transitionTimingFunction: "cubic-bezier(.23,1,.32,1)",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
      }}
    >
      {children}
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

  // Scorecard (quiz)
  const [quizIndex, setQuizIndex] = useState(0);
  const [caMensuel, setCaMensuel] = useState("");
  const [heuresOp, setHeuresOp] = useState("");
  const [perteEstimee, setPerteEstimee] = useState("");
  const quizCompletedRef = useRef(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const run = useRef({ listing: "", competitor: "" });
  const pendingAudit = useRef<Audit | null>(null);

  const quizValues: Record<QuizQuestion["key"], string | string[]> = { gestion, caMensuel, heuresOp, defi, perteEstimee };
  const quizSetters: Record<QuizQuestion["key"], (v: string) => void> = {
    gestion: setGestion, caMensuel: setCaMensuel, heuresOp: setHeuresOp, perteEstimee: setPerteEstimee,
    defi: (v: string) => setDefi((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v])),
  };
  const isQuizAnswered = (key: QuizQuestion["key"]) => {
    const v = quizValues[key];
    return Array.isArray(v) ? v.length > 0 : v !== "";
  };
  const scalability = computeScalabilityScore({ gestion, caMensuel, heuresOp, defi, perteEstimee });
  const qualifiesHighValue = gestion !== "" && gestion !== "1";

  const advanceQuiz = () => {
    if (quizIndex < QUIZ_QUESTIONS.length - 1) { setQuizIndex((i) => i + 1); return; }
    quizCompletedRef.current = true;
    setStep(pendingAudit.current ? "optin" : "loading");
  };

  const launch = async () => {
    if (!url.trim()) return;
    setStep("quiz"); setQuizIndex(0); quizCompletedRef.current = false; setMsg("Lancement de l'analyse…");
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
        if (quizCompletedRef.current) setStep("optin");
        return;
      }
      if (d.status === "ERROR") { clearInterval(pollRef.current!); setErrMsg(d.message || "Erreur"); setStep("error"); }
    } catch { /* continue */ }
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submitOptin = async () => {
    if (!email || !firstName || !emailValid) return;
    setOptinLoading(true);
    const a = pendingAudit.current!;
    try {
      await fetch(`${API_BASE}/audit-optin`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, email, phone, gestion, defi, caMensuel, heuresOp, perteEstimee,
          scalabilityScore: scalability.score, listingUrl: url, listingScore: a.globalScore, platform,
        }),
      });
    } catch { /* silently pass */ }
    trackEvent("audit_optin", { score: a.globalScore });
    trackMeta("Lead", { content_name: "super-bnb-audit" });
    setAudit(a); setStep("result"); setOptinLoading(false);
  };

  const reset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setStep("form"); setUrl(""); setAudit(null); setErrMsg("");
    setGestion(""); setDefi([]); setCaMensuel(""); setHeuresOp(""); setPerteEstimee(""); setQuizIndex(0);
    quizCompletedRef.current = false;
    run.current = { listing: "", competitor: "" };
  };

  /* ── FORM ── */
  if (step === "form") return (
    <div className="min-h-screen bg-ink relative overflow-hidden" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "40px 40px, 40px 40px" }}>
      <div className="pointer-events-none absolute -z-10 left-1/2 top-[-120px] -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-lime/10 blur-[140px]" />

      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-2xl mx-auto">
        <Logo className="scale-90 origin-left" />
        <span className="text-white/50 text-sm font-semibold">Audit Annonce LCD</span>
      </header>

      <div className="max-w-xl mx-auto px-4 pt-16 pb-20 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 bg-lime/10 border border-lime/25 rounded-full px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
            <span className="text-xs text-lime font-bold">Gratuit · Résultat en 90 secondes</span>
          </div>

          <h1 className="text-h1 text-white mb-4 tracking-tight">
            Ton annonce est-elle{" "}
            <span className="text-lime">optimisée ?</span>
          </h1>
          <p className="text-white/45 text-base mb-6 leading-relaxed">
            Analyse IA de ton annonce Airbnb ou Booking.com · Score /100 · Benchmark concurrents · Plan d&apos;action personnalisé
          </p>

          <p className="flex items-center justify-center gap-2 text-white/50 text-xs font-semibold mb-10">
            <span>7 ans d&apos;expérience</span>
            <span className="text-white/35">·</span>
            <span>+697K€ générés sur Airbnb</span>
          </p>
        </Reveal>

        <Reveal delay={120}>
        <div className="bg-white/8 border border-white/10 rounded-2xl p-6 text-left">
          <div className="flex gap-3 mb-5">
            {(["airbnb", "booking"] as Platform[]).map((p) => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-all ${
                  platform === p
                    ? "border-lime bg-lime/10 text-lime"
                    : "border-white/10 bg-white/8 text-white/50 hover:border-white/20"
                }`}>
                {p === "airbnb" ? "🏠 Airbnb" : "🌐 Booking.com"}
              </button>
            ))}
          </div>

          <div className="flex gap-2 bg-white/8 border border-white/10 rounded-xl p-1.5 focus-within:border-lime/50 transition-colors mb-4">
            <input
              type="url" value={url} onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && launch()}
              placeholder={platform === "airbnb" ? "airbnb.fr/rooms/12345678" : "booking.com/hotel/..."}
              className="flex-1 bg-transparent text-white text-sm placeholder-white/20 px-3 py-2 focus:outline-none min-w-0"
            />
            <button onClick={launch} disabled={!url.trim()}
              className="bg-lime hover:bg-lime-dark disabled:opacity-40 disabled:hover:-translate-y-0 text-ink font-bold text-sm px-5 py-2.5 rounded-lg transition-all hover:-translate-y-0.5 shrink-0">
              Analyser →
            </button>
          </div>

          <p className="text-white/40 text-xs text-center">Gratuit · Sans carte bancaire · Sans engagement</p>
        </div>
        </Reveal>

        {/* Proof */}
        <div className="mt-10 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: "📊", label: "Score /100", sub: "par catégorie" },
            { icon: "🏆", label: "Benchmark", sub: "5 concurrents" },
            { icon: "✨", label: "Contenu IA", sub: "titre + description" },
          ].map((f, i) => (
            <Reveal key={f.label} delay={i * 80}>
              <div className="bg-white/8 border border-white/14 rounded-xl p-4 h-full">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-lime/10 border border-lime/25 flex items-center justify-center text-lg">{f.icon}</div>
                <div className="text-white/75 text-xs font-bold">{f.label}</div>
                <div className="text-white/45 text-xs">{f.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Objectifs du programme */}
        <div className="mt-14 grid grid-cols-3 gap-3 text-center">
          {[
            { value: "+30%", label: "de CA visé" },
            { value: "15 min", label: "de gestion / jour visées" },
            { value: "38 pts", label: "checklist de réception" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="bg-white/8 border border-white/14 rounded-xl p-4 h-full">
                <p className="text-2xl font-extrabold text-lime tracking-tight">{s.value}</p>
                <p className="text-white/50 text-[11px] mt-1 leading-snug">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="text-white/35 text-[11px] text-center mt-3">Objectifs visés avec les hôtes accompagnés en Super BNB Academy</p>

        {/* FAQ */}
        <Reveal className="mt-14 text-left">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest text-center mb-5">Questions fréquentes</p>
          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/8">
            {[
              { q: "Comment fonctionne cet audit gratuit ?", a: "Notre IA analyse les données publiques de ton annonce (titre, photos, description, prix, avis) et les compare aux standards et aux annonces concurrentes de ta zone. Tu obtiens un score par catégorie et un plan d'action en 90 secondes." },
              { q: "Est-ce vraiment gratuit et sans engagement ?", a: "Oui. Aucune carte bancaire, aucun abonnement. Tu renseignes juste tes coordonnées pour recevoir le rapport complet." },
              { q: "Que deviennent mes données ?", a: "Elles servent uniquement à générer ton rapport et, si tu le souhaites, à te recontacter pour un audit stratégique gratuit. Aucune revente à des tiers." },
              { q: "Et après l'audit ?", a: "Tu peux réserver un appel stratégique gratuit avec un coach Super BNB Academy pour aller plus loin sur ton annonce." },
            ].map((item) => (
              <details key={item.q} className="group p-4">
                <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold text-white/80">
                  {item.q}
                  <span className="text-white/50 group-open:rotate-45 transition-transform ml-3">+</span>
                </summary>
                <p className="text-white/40 text-sm mt-2 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );

  /* ── QUIZ (Scorecard) ── */
  if (step === "quiz") {
    const q = QUIZ_QUESTIONS[quizIndex];
    const current = quizValues[q.key];
    const answered = isQuizAnswered(q.key);
    return (
      <div className="min-h-screen bg-ink relative overflow-hidden flex flex-col items-center justify-center px-4" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "40px 40px, 40px 40px" }}>
        <div className="pointer-events-none absolute -z-10 left-1/2 top-[-120px] -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-lime/10 blur-[140px]" />
        <div className="max-w-md w-full">
          <Reveal>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Diagnostic de ton activité</span>
              <span className="text-white/40 text-xs font-bold">{quizIndex + 1}/{QUIZ_QUESTIONS.length}</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-8">
              <div className="h-full bg-lime rounded-full transition-all duration-500" style={{ width: `${((quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
            </div>
          </Reveal>
          <Reveal key={q.key} delay={60}>
            <h2 className="text-white font-extrabold text-xl mb-6 leading-snug">{q.title}</h2>
            <div className="space-y-2.5 mb-8">
              {q.options.map((opt) => {
                const selected = q.multi ? (current as string[]).includes(opt) : current === opt;
                return (
                  <button key={opt} onClick={() => quizSetters[q.key](opt)}
                    className={`w-full text-left py-3.5 px-4 rounded-xl text-sm font-semibold border transition-all ${
                      selected ? "border-lime bg-lime/10 text-lime" : "border-white/10 bg-white/8 text-white/70 hover:border-white/20"
                    }`}>
                    {selected ? "✓ " : ""}{opt}
                  </button>
                );
              })}
            </div>
            <button onClick={advanceQuiz} disabled={!answered}
              className="w-full bg-lime hover:bg-lime-dark disabled:opacity-40 disabled:hover:-translate-y-0 text-ink font-extrabold py-3.5 rounded-xl text-base transition-all hover:-translate-y-0.5">
              {quizIndex < QUIZ_QUESTIONS.length - 1 ? "Suivant →" : "Voir mon diagnostic →"}
            </button>
          </Reveal>
          <p className="text-white/35 text-xs text-center mt-4">Ton annonce est analysée en parallèle · ~90 secondes</p>
        </div>
      </div>
    );
  }

  /* ── LOADING ── */
  if (step === "loading") {
    const steps = [
      { label: "Scraping annonce", done: msg.includes("concurrent") || msg.includes("IA") },
      { label: "Benchmark concurrents", done: false, active: msg.includes("concurrent") },
      { label: "Analyse IA", done: false, active: msg.includes("IA") || msg.includes("nal") },
    ];
    return (
      <div className="min-h-screen bg-ink relative overflow-hidden flex flex-col items-center justify-center px-4 text-center" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "40px 40px, 40px 40px" }}>
        <div className="pointer-events-none absolute -z-10 left-1/2 top-[-120px] -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-lime/10 blur-[140px]" />
        <Reveal>
          <div className="relative w-20 h-20 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-white/5" />
            <div className="absolute inset-0 rounded-full border-4 border-t-lime border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-white font-extrabold text-xl mb-2">{msg}</p>
          <p className="text-white/45 text-sm mb-10">Ne ferme pas cette page · ~90 secondes</p>
        </Reveal>
        <Reveal delay={200}>
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                {i > 0 && <div className="w-5 h-px bg-white/10" />}
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                  s.done ? "bg-lime/20 text-lime" :
                  s.active ? "bg-lime/15 text-lime border border-lime/30" :
                  "bg-white/8 text-white/40"
                }`}>
                  {s.done ? "✓ " : ""}{s.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    );
  }

  /* ── OPTIN ── */
  if (step === "optin" && pendingAudit.current) {
    const a = pendingAudit.current;
    return (
      <div className="min-h-screen bg-ink relative overflow-hidden py-10 px-4" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "40px 40px, 40px 40px" }}>
        <div className="pointer-events-none absolute -z-10 left-1/2 top-[-120px] -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-lime/10 blur-[140px]" />
        <div className="max-w-lg mx-auto">
          {/* Preview floutée */}
          <Reveal>
          <div className="relative bg-white/8 border border-white/10 rounded-2xl p-5 mb-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Analyse terminée</p>
                <p className="text-white font-extrabold text-base leading-tight">{a.listing.title || "Ton annonce"}</p>
                <p className="text-white/50 text-xs mt-0.5">{a.listing.location}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="filter blur-sm pointer-events-none opacity-60">
                    <GaugeScore score={a.globalScore} color={a.gradeColor} size="sm" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">🔒</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="filter blur-sm pointer-events-none opacity-60">
                    <GaugeScore score={scalability.score} color={scalability.stageColor} size="sm" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">🔒</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-white/40 text-[10px] text-center mt-3">Score annonce + Score de scalabilité business</p>
            {/* Barres floutées */}
            <div className="mt-4 grid grid-cols-4 gap-2 filter blur-sm opacity-40 pointer-events-none">
              {a.categories.slice(0, 4).map((c) => (
                <div key={c.id} className="bg-white/8 rounded-lg p-2 text-center">
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
          </Reveal>

          {/* Formulaire */}
          <Reveal delay={120}>
          <div className="bg-white/8 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-extrabold text-xl mb-1">Voir mon rapport complet</h2>
            <p className="text-white/50 text-sm mb-6">Score /100 · Benchmark · Plan d&apos;action · Contenu optimisé</p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input type="text" placeholder="Prénom *" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                className="bg-white/8 border border-white/10 text-white placeholder-white/25 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-lime/50 transition-colors" />
              <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)}
                className={`bg-white/8 border text-white placeholder-white/25 rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors ${
                  email && !emailValid ? "border-red-500/50 focus:border-red-500/50" : "border-white/10 focus:border-lime/50"
                }`} />
            </div>
            {email && !emailValid && (
              <p className="text-red-400 text-xs mb-3">Format invalide. Vérifie ex : prenom@email.com</p>
            )}
            <input type="tel" placeholder="WhatsApp (recommandé)" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/8 border border-white/10 text-white placeholder-white/25 rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-lime/50 transition-colors" />

            <p className="text-white/40 text-xs text-center mb-5">Ton diagnostic d&apos;activité (Scorecard) est déjà enregistré ✓</p>

            <button onClick={submitOptin} disabled={!email || !firstName || !emailValid || optinLoading}
              className="w-full bg-lime hover:bg-lime-dark disabled:opacity-40 disabled:hover:-translate-y-0 text-ink font-extrabold py-3.5 rounded-xl text-base transition-all hover:-translate-y-0.5">
              {optinLoading ? "Chargement…" : "Voir mon rapport complet →"}
            </button>
            <p className="text-white/35 text-xs text-center mt-3">Pas de spam · Données confidentielles</p>
          </div>
          </Reveal>
        </div>
      </div>
    );
  }

  /* ── RESULT ── */
  if (step === "result" && audit) return (
    <div className="min-h-screen bg-ink relative overflow-hidden" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "40px 40px, 40px 40px" }}>
      <div className="pointer-events-none absolute -z-10 left-1/2 top-[-120px] -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-lime/10 blur-[140px]" />
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between max-w-2xl mx-auto">
        <Logo className="scale-90 origin-left" />
        <button onClick={reset} className="text-white/50 hover:text-white text-sm font-semibold transition-colors">← Nouvelle analyse</button>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* Score hero */}
        <Reveal>
        <div className="bg-white/8 border border-white/14 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            {audit.listing.coverPhotoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={audit.listing.coverPhotoUrl} alt={audit.listing.title}
                className="w-20 h-20 object-cover rounded-xl shrink-0 border border-white/10"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">
                {platform === "airbnb" ? "Airbnb" : "Booking.com"}
              </p>
              <h2 className="text-white font-extrabold text-base leading-tight mb-0.5 truncate">{audit.listing.title}</h2>
              <p className="text-white/50 text-xs mb-2">{audit.listing.location}</p>
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
        </Reveal>

        {/* Diagnostic Business (Scorecard) */}
        <Reveal delay={30}>
        <div className="bg-white/8 border border-white/14 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <GaugeScore score={scalability.score} color={scalability.stageColor} size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">Score de scalabilité business</p>
              <h3 className="text-white font-extrabold text-base leading-tight mb-1" style={{ color: scalability.stageColor }}>{scalability.stageLabel}</h3>
              <p className="text-white/55 text-sm leading-relaxed">
                {defi.length > 0 ? `Frein principal : ${defi.join(", ")}.` : ""}{" "}
                {perteEstimee && `Perte estimée : ${perteEstimee} / mois à cause de ce frein.`}
              </p>
            </div>
          </div>
        </div>
        </Reveal>

        {/* Category scores */}
        <Reveal delay={60}>
        <div className="bg-white/8 border border-white/14 rounded-2xl p-5">
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
                <p className="text-white/50 text-xs mt-1 ml-6 leading-tight">{c.recommendation.action}</p>
              </div>
            ))}
          </div>
        </div>
        </Reveal>

        {/* Top actions */}
        <Reveal delay={120}>
        <div className="bg-white/8 border border-white/14 rounded-2xl p-5">
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
                    <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">{a.category}</span>
                  </div>
                  <p className="text-white/75 text-sm leading-snug">{a.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </Reveal>

        {/* Optimized title preview */}
        <Reveal delay={180}>
        <div className="bg-white/8 border border-white/14 rounded-2xl p-5">
          <h3 className="text-white font-extrabold text-sm mb-3">Titre optimisé suggéré</h3>
          <div className="bg-lime/10 border border-lime/25 rounded-xl p-4 text-sm font-semibold text-lime leading-relaxed">
            &ldquo;{audit.generatedContent.optimizedTitle}&rdquo;
          </div>
          <p className="text-white/40 text-xs mt-2">Conçu pour l&apos;algorithme 2026 · données concrètes, zéro marketing flou</p>
        </div>
        </Reveal>

        {/* Revenue */}
        <Reveal delay={240}>
        <div className="bg-white/8 border border-white/14 rounded-2xl p-5">
          <h3 className="text-white font-extrabold text-sm mb-4">Potentiel de revenus</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {[
              { label: "Revenu/mois actuel", value: `${(audit.revenueProjection.currentMonthlyRevenue||0).toLocaleString("fr-FR")} €`, accent: false },
              { label: "Revenu/mois optimisé", value: `${(audit.revenueProjection.optimizedMonthlyRevenue||0).toLocaleString("fr-FR")} €`, accent: true },
              { label: "Occupation actuelle", value: `${audit.revenueProjection.currentOccupancy||0} %`, accent: false },
              { label: "Objectif réaliste", value: `${audit.revenueProjection.targetOccupancy||0} %`, accent: true },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl p-3.5 text-center border ${s.accent ? "bg-lime/10 border-lime/25" : "bg-white/8 border-white/14"}`}>
                <div className="font-extrabold text-lg mb-0.5" style={{ color: s.accent ? "#B6F23A" : "rgba(255,255,255,0.65)" }}>{s.value}</div>
                <div className="text-[10px] text-white/45 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between bg-lime/5 border border-lime/20 rounded-xl px-4 py-3">
            <span className="text-white/50 text-xs">Gain annuel potentiel</span>
            <span className="text-lime font-extrabold text-base">+{(audit.revenueProjection.annualGain||0).toLocaleString("fr-FR")} €</span>
          </div>
          {audit.revenueProjection.insight && (
            <p className="text-white/45 text-xs mt-2">{audit.revenueProjection.insight} · {audit.revenueProjection.occupancySource === "calendar_data" ? "Données calendrier" : "Estimation marché"}</p>
          )}
        </div>
        </Reveal>

        {/* CTA — routage selon le Scorecard */}
        <Reveal delay={300}>
        {qualifiesHighValue ? (
          <div className="rounded-2xl overflow-hidden bg-lime shadow-[0_8px_0_#5E8A0A]">
            <div className="px-6 py-8 text-center">
              <div className="inline-flex items-center gap-2 bg-ink rounded-full px-3 py-1.5 mb-5">
                <span className="text-[10px] font-bold text-lime uppercase tracking-widest">Super BNB Academy</span>
              </div>
              <h3 className="text-ink font-extrabold text-xl mb-2 tracking-tight">
                {perteEstimee
                  ? `Tu perds environ ${perteEstimee} par mois`
                  : `Ton annonce score ${audit.globalScore}/100, on peut largement faire mieux`}
              </h3>
              <p className="text-ink/75 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
                Tu gères déjà {gestion} logement{gestion === "1" ? "" : "s"} mais tu es freiné dans ta croissance. Réserve ton audit stratégique gratuit : on analyse ton parc complet et tu repars avec le plan exact pour débloquer la suite.
              </p>
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent("audit_call_click"); trackMeta("Schedule", { content_name: "super-bnb-audit" }); }}
                className="inline-block bg-ink text-white font-extrabold text-base px-8 py-3.5 rounded-xl hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all">
                Réserver mon audit gratuit →
              </a>
              <p className="text-ink/70 text-xs mt-4">Gratuit · Sans engagement</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1A6B33 0%, #2DB84B 60%, #5FD87A 100%)" }}>
            <div className="px-6 py-8 text-center">
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1.5 mb-5">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Rentimmo Academy</span>
              </div>
              <h3 className="text-white font-extrabold text-xl mb-2 tracking-tight">Tu démarres avec ton 1er logement ?</h3>
              <p className="text-white/75 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
                Pose les bonnes bases dès ton premier bien pour scaler 2x plus vite ensuite. Nos formations Sous-Location &amp; Conciergerie t&apos;emmènent de 0 à ton 1er logement rentable.
              </p>
              <a href="/formations/" className="inline-block bg-white text-brand-dark font-extrabold text-base px-8 py-3.5 rounded-xl hover:bg-cream hover:-translate-y-0.5 transition-all">
                Choisir ma formation de démarrage →
              </a>
              <p className="text-white/40 text-xs mt-4">
                Tu gères déjà plusieurs biens ?{" "}
                <a href={CAL_URL} target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent("audit_call_click"); trackMeta("Schedule", { content_name: "super-bnb-audit" }); }} className="underline hover:text-white">Réserve quand même un audit</a>
              </p>
            </div>
          </div>
        )}
        </Reveal>
      </div>
    </div>
  );

  /* ── ERROR ── */
  if (step === "error") return (
    <div className="min-h-screen bg-ink relative overflow-hidden flex flex-col items-center justify-center px-4 text-center" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "40px 40px, 40px 40px" }}>
      <div className="pointer-events-none absolute -z-10 left-1/2 top-[-120px] -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-lime/10 blur-[140px]" />
      <Reveal>
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 text-3xl mx-auto">⚠️</div>
      </Reveal>
      <Reveal delay={100}>
        <p className="text-white font-extrabold text-xl mb-2">Analyse échouée</p>
        <p className="text-white/50 text-sm mb-7 max-w-sm">{errMsg}</p>
      </Reveal>
      <Reveal delay={200}>
        <button onClick={reset} className="bg-white/10 hover:bg-white/15 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
          ← Réessayer
        </button>
      </Reveal>
    </div>
  );

  return null;
}
