"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Logo from "@/components/layout/Logo";
import { Marquee, Mark, Motion, StickyCta, Words, delay as moDelay } from "@/components/motion";
import { trackEvent, trackMeta } from "@/lib/gtag";
import {
  computeAudit, buildDocQuestions, computeDiagnostic, summarizeAnswers, ONLY_AIRBNB,
  type AiResult, type AuditResult, type CheckupAnswers, type DeclaredAnswers, type DocAnswers, type DocQuestion, type ExtractedListing, type Impact,
} from "@/lib/listingAudit";
import "./audit.css";

const API_BASE = "/api";
const CAL_LINK = "rentimmoacademy/superbnbacademy";
const CAL_URL = `https://cal.com/${CAL_LINK}`;
const EXTRACT_TIMEOUT_MS = 15000;
const AI_TIMEOUT_MS = 40000; // la Function essaie jusqu'à 3 modèles gratuits
const AI_WAIT_MS = 12000;   // attente max après « Voir mon score » avant repli sur les règles fixes

type Step = "form" | "optin" | "checkup" | "analyse" | "result" | "doc" | "booking";
type Extract = { state: "idle" | "loading" | "ok" | "failed"; listing: ExtractedListing | null; reason?: string };
type SaveState = "idle" | "saving" | "ok" | "error";
type AiState = { state: "idle" | "loading" | "ok" | "failed"; result: AiResult | null };


const detectPlatform = (u: string) => (/booking\.com/i.test(u) ? "booking" : /airbnb\.|abnb\.me/i.test(u) ? "airbnb" : null);
// L'audit n'accepte que les annonces Airbnb ; Booking et le site direct sont abordés dans le diagnostic.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const eur = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} €`;

// ?xtest=1 : parcours de test, rien n'est écrit dans Systeme.io (en-tête X-Test lu par audit-optin)
const isTestMode = () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("xtest");

async function postOptin(payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  try {
    const r = await fetch(`${API_BASE}/audit-optin`, {
      method: "POST", headers: { "Content-Type": "application/json", ...(isTestMode() ? { "X-Test": "1" } : {}) }, body: JSON.stringify(payload),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.ok) return { ok: false, error: d.error || `http_${r.status}` };
    return { ok: true };
  } catch {
    return { ok: false, error: "network" };
  }
}

function GaugeScore({ score, color, size = "lg" }: { score: number; color: string; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  const w = isLg ? 160 : 120; const h = isLg ? 92 : 70;
  const r = isLg ? 70 : 52;
  const cx = w / 2; const cy = h - 8;
  const circumference = Math.PI * r;
  return (
    <div className="relative flex flex-col items-center">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} stroke="#ffffff14" strokeWidth={isLg ? 12 : 9} strokeLinecap="round" />
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          stroke={color} strokeWidth={isLg ? 12 : 9} strokeLinecap="round"
          strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
          className="sb-gauge-arc" style={{ filter: `drop-shadow(0 0 10px ${color}66)` }}
        />
      </svg>
      <div className="absolute bottom-0 text-center">
        <div className={`font-extrabold text-white leading-none tracking-tight ${isLg ? "text-5xl" : "text-2xl"}`}><span data-count={score}>{score}</span></div>
        <div className={`text-white/45 font-semibold mt-0.5 ${isLg ? "text-xs" : "text-[10px]"}`}>/100</div>
      </div>
    </div>
  );
}

function BarScore({ score, max, color, index = 0 }: { score: number; max: number; color: string; index?: number }) {
  return (
    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
      <div className="sb-bar h-full rounded-full" style={{ width: `${Math.round((score / max) * 100)}%`, backgroundColor: color, ["--i" as string]: index } as React.CSSProperties} />
    </div>
  );
}

/** Texte « ≈ 299 h » / « 66 000 € » : la partie numérique compte jusqu'à sa valeur (kit motion). */
function CountText({ text }: { text: string }) {
  const m = text.match(/^([^\d]*)([\d\s\u202f]+)(.*)$/);
  if (!m) return <>{text}</>;
  const n = Number(m[2].replace(/[\s\u202f]/g, ""));
  if (!Number.isFinite(n)) return <>{text}</>;
  return <span data-count={n} data-prefix={m[1]} data-suffix={m[3]}>{text}</span>;
}

// Apparition au scroll pilotée par le kit motion (<Motion /> par étape) : contenu visible sans JS.
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div className={className} data-reveal="up" data-delay={delay ? String(delay) : undefined}>
      {children}
    </div>
  );
}

// Fond « aurore » lime (identité Super BNB Academy)
function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <span className="sb-halo sb-halo--a" />
      <span className="sb-halo sb-halo--b" />
      <span className="absolute inset-0 bg-dot-grid bg-dot-32 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]" />
    </div>
  );
}

function ImpactPill({ impact }: { impact: Impact }) {
  const map: Record<Impact, { bg: string; text: string; label: string }> = {
    HIGH: { bg: "bg-red-500/15", text: "text-red-400", label: "Priorité 1" },
    MEDIUM: { bg: "bg-amber-500/15", text: "text-amber-400", label: "Priorité 2" },
    LOW: { bg: "bg-lime/15", text: "text-lime", label: "Bonus" },
  };
  const s = map[impact];
  return <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>;
}

function Chips<T extends string>({ value, options, onChange, label }: { value: T | ""; options: { v: T; l: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <fieldset className="mb-5">
      <legend className="text-white font-bold text-sm mb-2.5">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o.v} type="button" onClick={() => onChange(o.v)} aria-pressed={value === o.v}
            className={`sb-opt py-2.5 px-4 rounded-full text-sm font-semibold border ${
              value === o.v ? "border-lime bg-lime/10 text-lime" : "border-white/10 bg-white/[0.06] text-white/70 hover:border-white/25"
            }`}>
            {o.l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Shell({ children, center = false, motion, right }: { children: React.ReactNode; center?: boolean; motion: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="sb-root mo-gentle isolate min-h-screen bg-ink relative overflow-hidden flex flex-col">
      <Aurora />
      {motion}
      <header className="relative z-10 w-full border-b border-white/[0.06]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1.5">
            <Logo className="scale-90 origin-left" />
            <span className="sb-kicker">Super BnB Academy</span>
          </div>
          {right}
        </div>
      </header>
      {center ? <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">{children}</main> : <main className="relative z-10 flex-1">{children}</main>}
    </div>
  );
}

function ErrorBox({ text, onRetry, busy }: { text: string; onRetry?: () => void; busy?: boolean }) {
  return (
    <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200">
      <span className="flex-1 leading-snug">{text}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} disabled={busy} className="shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 disabled:opacity-50">
          {busy ? "…" : "Réessayer"}
        </button>
      )}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type CalFn = ((...args: unknown[]) => void) & { ns?: Record<string, (...args: unknown[]) => void> };
const getCal = () => (window as any).Cal as CalFn | undefined;

/** Charge l'embed officiel Cal.com (inline) une seule fois. */
function loadCal() {
  const C = window as any;
  if (C.Cal) return;
  /* Snippet officiel Cal.com, réécrit lisiblement */
  const A = "https://app.cal.com/embed/embed.js";
  const push = (a: any, ar: any) => a.q.push(ar);
  C.Cal = function (...ar: unknown[]) {
    const cal = C.Cal;
    if (!cal.loaded) {
      cal.ns = {}; cal.q = cal.q || [];
      const s = document.createElement("script"); s.src = A; s.async = true; document.head.appendChild(s);
      cal.loaded = true;
    }
    if (ar[0] === "init") {
      const api = function (...a: unknown[]) { push(api, a); } as any;
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        cal.ns[namespace] = cal.ns[namespace] || api;
        push(cal.ns[namespace], ar);
        push(cal, ["initNamespace", namespace]);
      } else push(cal, ar);
      return;
    }
    push(cal, ar);
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */


export default function AuditPublicPage() {
  const [step, setStep] = useState<Step>("form");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [extract, setExtract] = useState<Extract>({ state: "idle", listing: null });
  const [ai, setAi] = useState<AiState>({ state: "idle", result: null });

  // Opt-in
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [optinState, setOptinState] = useState<SaveState>("idle");
  const [optinFails, setOptinFails] = useState(0);
  const optinSaved = useRef(false);

  // Check-up
  const [checkup, setCheckup] = useState<CheckupAnswers>({ pricing: "", response: "", price: "" });
  const [declared, setDeclared] = useState<DeclaredAnswers>({ title: "", photos: "", rating: "", reviews: "", description: "", superhost: "" });
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [auditSave, setAuditSave] = useState<SaveState>("idle");
  const [tick, setTick] = useState(0); // écran d'analyse : étapes cochées une à une
  const aiRef = useRef<AiState>({ state: "idle", result: null });
  const [dir, setDir] = useState<"fwd" | "back">("fwd");

  // Diagnostic
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<DocAnswers>({});
  const [docSave, setDocSave] = useState<SaveState>("idle");
  const [calFailed, setCalFailed] = useState(false);
  const booked = useRef(false);

  const platform = detectPlatform(url) || "airbnb";
  const emailValid = EMAIL_RE.test(email.trim());

  /* ── Analyse IA (texte + photos de l'annonce, jamais les données du lead) ── */
  const startAi = useCallback((listing: ExtractedListing, price?: string) => {
    setAi({ state: "loading", result: null });
    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), AI_TIMEOUT_MS);
    const declaredPrice = Number(String(price || "").replace(",", ".")) || undefined;
    fetch(`${API_BASE}/listing-ai`, {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl.signal,
      body: JSON.stringify({ listing, comparables: listing.comparables, declaredPrice }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok) setAi({ state: "ok", result: d as AiResult });
        else { setAi({ state: "failed", result: null }); trackEvent("audit_error", { stage: "ai", reason: d?.reason || "unknown" }); }
      })
      .catch(() => { setAi({ state: "failed", result: null }); trackEvent("audit_error", { stage: "ai", reason: "timeout" }); })
      .finally(() => window.clearTimeout(t));
  }, []);

  /* ── Extraction (lancée dès le lien collé, en parallèle de l'opt-in) ── */
  const startExtraction = useCallback((u: string) => {
    setExtract({ state: "loading", listing: null });
    setAi({ state: "idle", result: null });
    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), EXTRACT_TIMEOUT_MS);
    fetch(`${API_BASE}/listing-audit?url=${encodeURIComponent(u)}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && d.listing) {
          setExtract({ state: "ok", listing: d.listing });
          startAi(d.listing);
        } else {
          setExtract({ state: "failed", listing: null, reason: d?.reason || "unknown" });
          trackEvent("audit_error", { stage: "extraction", reason: d?.reason || "unknown" });
        }
      })
      .catch(() => {
        setExtract({ state: "failed", listing: null, reason: "timeout" });
        trackEvent("audit_error", { stage: "extraction", reason: "timeout" });
      })
      .finally(() => window.clearTimeout(t));
  }, [startAi]);

  const launch = useCallback((raw?: string) => {
    const u = (raw ?? url).trim();
    if (!u) return;
    const pf = detectPlatform(u);
    if (pf !== "airbnb") {
      // Audit réservé aux annonces Airbnb : message clair et champ vidé pour coller le bon lien
      setUrlError(pf === "booking"
        ? "L'audit fonctionne avec une annonce Airbnb. Colle ici le lien de ton annonce Airbnb (ex. airbnb.fr/rooms/12345678) : on parlera de Booking dans le diagnostic."
        : "L'audit fonctionne avec une annonce Airbnb. Colle le lien de ton annonce Airbnb (ex. airbnb.fr/rooms/12345678).");
      trackEvent("audit_error", { stage: "url", reason: pf || "invalid" });
      setUrl("");
      setStep("form");
      window.setTimeout(() => document.getElementById("sb-url")?.focus(), 50);
      return;
    }
    setUrlError("");
    trackEvent("audit_start", { platform: detectPlatform(u) });
    startExtraction(u);
    setStep("optin");
  }, [url, startExtraction]);

  // Lien prérempli (?url=…) depuis la modale de la page Super BNB Academy
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("url");
    if (q) { setUrl(q); launch(q); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [step, qi]);

  /* ── Opt-in : enregistré tout de suite, même si l'analyse échoue ensuite ── */
  const submitOptin = async () => {
    if (!firstName.trim() || !emailValid || optinState === "saving") return;
    setOptinState("saving");
    const res = await postOptin({ stage: "optin", firstName: firstName.trim(), email: email.trim(), phone: phone.trim(), listingUrl: url.trim(), platform });
    if (res.ok) {
      optinSaved.current = true;
      setOptinState("ok");
      trackEvent("audit_optin", { platform });
      trackMeta("Lead", { content_name: "super-bnb-audit" });
      setStep("checkup");
    } else {
      setOptinState("error");
      setOptinFails((n) => n + 1);
      trackEvent("audit_error", { stage: "optin", reason: res.error });
    }
  };
  const skipOptinError = () => { setStep("checkup"); };

  /* ── Résultat ── */
  const needDeclared = extract.state === "failed";
  const needResponse = needDeclared || (extract.state === "ok" && !extract.listing?.responseTimeText);
  const declaredComplete = !!(declared.photos && declared.rating && (declared.rating === "none" || declared.reviews) && declared.description && declared.superhost);
  const checkupComplete = !!(checkup.pricing && (!needResponse || checkup.response));
  const canShowResult = checkupComplete && extract.state !== "loading" && (!needDeclared || declaredComplete);

  const saveAudit = useCallback(async (a: AuditResult) => {
    setAuditSave("saving");
    if (!optinSaved.current) {
      const o = await postOptin({ stage: "optin", firstName: firstName.trim(), email: email.trim(), phone: phone.trim(), listingUrl: url.trim(), platform });
      if (o.ok) optinSaved.current = true;
    }
    const res = await postOptin({
      stage: "audit", email: email.trim(), listingUrl: extract.listing?.url || url.trim(), listingScore: a.score, source: a.source,
      priorities: a.fixes.map((f) => f.category),
    });
    setAuditSave(res.ok ? "ok" : "error");
    if (!res.ok) trackEvent("audit_error", { stage: "save_audit", reason: res.error });
  }, [email, firstName, phone, url, platform, extract.listing]);

  const finalizeResult = useCallback((aiRes: AiResult | null) => {
    const source = extract.state === "ok" ? "airbnb" : "declared";
    const a = computeAudit(source, extract.listing, source === "declared" ? declared : null, checkup, aiRes);
    setAudit(a);
    setStep("result");
    trackEvent("audit_result_view", { score: a.score, source, ai: a.ai });
    saveAudit(a);
  }, [extract, declared, checkup, saveAudit]);

  useEffect(() => { aiRef.current = ai; }, [ai]);

  // L'analyse IA tourne depuis le collage du lien. Écran d'analyse : chaque étape se coche ;
  // l'étape « photos » attend la fin de l'IA (AI_WAIT_MS max), sinon la grille de règles fixes prend le relais.
  const showResult = () => {
    if (!canShowResult) return;
    setTick(0);
    setStep("analyse");
  };
  useEffect(() => {
    if (step !== "analyse") return;
    const t0 = Date.now();
    const id = window.setInterval(() => {
      setTick((n) => {
        const aiDone = aiRef.current.state !== "loading" || Date.now() - t0 > AI_WAIT_MS;
        if (n === 2 && !aiDone) return n;
        return Math.min(n + 1, 4);
      });
    }, 650);
    return () => window.clearInterval(id);
  }, [step]);
  useEffect(() => {
    if (step !== "analyse" || tick < 4) return;
    const t = window.setTimeout(() => {
      const cur = aiRef.current;
      finalizeResult(cur.state === "ok" ? cur.result : null);
    }, 500);
    return () => window.clearTimeout(t);
  }, [step, tick, finalizeResult]);

  /* ── Diagnostic « docteur » : questions à branchements, recalculées à chaque réponse ── */
  const knownRating = extract.listing?.reviewCount ? extract.listing.rating : null;
  const questions = buildDocQuestions(answers, knownRating);
  const nightlyPrice = Number(String(checkup.price).replace(",", ".")) || extract.listing?.comparables?.medianNightlyPrice || null;
  const diag = computeDiagnostic(answers, audit?.score ?? null, { nightlyPrice });

  const saveDiagnostic = useCallback(async (final: DocAnswers) => {
    setDocSave("saving");
    const d = computeDiagnostic(final, audit?.score ?? null, { nightlyPrice });
    const res = await postOptin({
      stage: "diagnostic", email: email.trim(), answers: final, listingScore: audit?.score,
      diagnostic: d ? { painLine: [d.painLine, ...d.extraLines].filter(Boolean).join(" "), gapMonthly: d.gapMonthly, inaction6m: d.inaction6m } : null,
      summary: summarizeAnswers(final, d),
    });
    setDocSave(res.ok ? "ok" : "error");
    if (!res.ok) trackEvent("audit_error", { stage: "save_diagnostic", reason: res.error });
  }, [email, audit, nightlyPrice]);

  const advance = (next: DocAnswers) => {
    const list = buildDocQuestions(next, knownRating);
    trackEvent(`audit_question_${qi + 1}`, { question: list[qi]?.id });
    if (qi < list.length - 1) { setDir("fwd"); setQi(qi + 1); return; }
    saveDiagnostic(next);
    trackEvent("audit_diagnostic_view", { pain: computeDiagnostic(next, null)?.pain });
    setStep("booking");
  };

  const answer = (q: DocQuestion, v: string) => {
    if (q.multi) {
      setAnswers((p) => {
        const cur = (p[q.id] as string[]) || [];
        let next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
        if (q.id === "douleurs" && next.length > 3) next = next.slice(0, 3);
        const EXCLUSIVE = ["Rien de concret", ONLY_AIRBNB];
        if (EXCLUSIVE.includes(v)) next = cur.includes(v) ? [] : [v];
        else next = next.filter((x) => !EXCLUSIVE.includes(x));
        // Changer de douleur ou de profil efface les réponses du sous-parcours
        const out: DocAnswers = { ...p, [q.id]: next };
        if (q.id === "douleurs" && next[0] !== cur[0]) for (const k of Object.keys(out)) if (k.startsWith("p_")) delete out[k];
        return out;
      });
      return;
    }
    let next: DocAnswers = { ...answers, [q.id]: v };
    if (q.id === "profil" && answers.profil !== v) next = { profil: v };
    setAnswers(next);
    advance(next);
  };

  /* ── Cal.com (embed inline prérempli) ── */
  const calNotes = useCallback(() => {
    const lines = [
      `Audit annonce : ${audit?.score ?? "?"}/100 (${audit?.source === "airbnb" ? (audit.ai ? "données Airbnb + analyse IA" : "données Airbnb") : "auto-évaluation"})`,
      `Annonce : ${extract.listing?.url || url.trim()}`,
      audit ? `Priorités annonce : ${Array.from(new Set(audit.fixes.map((f) => f.category))).join(", ")}` : "",
      diag ? `Douleur n°1 : ${diag.painTitle}${diag.otherPains.length ? ` (+ ${diag.otherPains.join(" ; ")})` : ""}` : "",
      [diag?.painLine, ...(diag?.extraLines || [])].filter(Boolean).join(" "),
      diag?.inaction6m != null ? `Coût de l'inaction calculé : ${eur(diag.inaction6m)} sur 6 mois (écart ${eur(diag.gapMonthly || 0)}/mois)` : "",
      summarizeAnswers(answers, null),
    ].filter(Boolean);
    return lines.join("\n").slice(0, 1800);
  }, [audit, extract.listing, url, answers, diag]);

  useEffect(() => {
    if (step !== "booking") return;
    let cancelled = false;
    try {
      loadCal();
      getCal()!("init", "sbaudit", { origin: "https://cal.com" });
      const ns = () => getCal()?.ns?.sbaudit;
      ns()?.("inline", {
        elementOrSelector: "#sb-cal-inline",
        calLink: CAL_LINK,
        config: { layout: "month_view", theme: "dark", name: firstName.trim(), email: email.trim(), notes: calNotes() },
      });
      ns()?.("ui", { theme: "dark", hideEventTypeDetails: false, layout: "month_view", cssVarsPerTheme: { dark: { "cal-brand": "#B6F23A" } } });
      const onBooked = () => {
        if (booked.current) return;
        booked.current = true;
        trackEvent("audit_booked");
        trackMeta("Schedule", { content_name: "super-bnb-audit" });
      };
      ns()?.("on", { action: "bookingSuccessfulV2", callback: onBooked });
      ns()?.("on", { action: "bookingSuccessful", callback: onBooked });
    } catch {
      setCalFailed(true);
    }
    // Si l'agenda ne s'affiche pas (bloqueur, réseau), on propose le lien direct
    const t = window.setTimeout(() => {
      if (cancelled) return;
      const el = document.querySelector("#sb-cal-inline iframe");
      if (!el) { setCalFailed(true); trackEvent("audit_error", { stage: "cal_embed" }); }
    }, 9000);
    return () => { cancelled = true; window.clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const calHref = `${CAL_URL}?${new URLSearchParams({ name: firstName.trim(), email: email.trim(), notes: calNotes() }).toString()}`;
  const onCallClick = (where: string) => { trackEvent("audit_call_click", { where }); };

  const reset = () => {
    setStep("form"); setUrl(""); setAudit(null); setExtract({ state: "idle", listing: null }); setAi({ state: "idle", result: null });
    setCheckup({ pricing: "", response: "", price: "" });
    setDeclared({ title: "", photos: "", rating: "", reviews: "", description: "", superhost: "" });
    setQi(0); setAnswers({}); setAuditSave("idle"); setDocSave("idle");
  };

  // Kit motion : re-scanné à chaque étape / question (apparitions, compteurs, tilt, aimant)
  const motionEl = <Motion gentle deps={`${step}-${qi}`} revealAfter={2600} />;
  const focusUrl = () => {
    const el = document.getElementById("sb-url") as HTMLInputElement | null;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    window.setTimeout(() => el.focus({ preventScroll: true }), reduce ? 0 : 450);
  };

  const inputCls = "w-full bg-ink border border-white/10 text-white placeholder-white/35 rounded-2xl px-3.5 py-3 text-base focus:outline-none focus:border-lime/50 transition-colors";
  const primaryBtn = "sb-btn mo-shine w-full";

  /* ── 1. LIEN DE L'ANNONCE ── */
  if (step === "form") return (
    <Shell motion={motionEl} right={<span className="text-white/60 text-xs font-semibold">Audit gratuit</span>}>

      <div className="max-w-xl mx-auto px-4 pt-12 sm:pt-16 pb-24 text-center">
        <div id="sb-hero">
          <div className="mo-enter-pop inline-flex items-center gap-2 bg-lime/10 border border-lime/25 rounded-full px-4 py-2 mb-8">
            <span className="mo-pulse-dot sb-dot" style={{ width: 6, height: 6 }} aria-hidden />
            <span className="text-xs text-lime font-bold">Gratuit · Sans engagement</span>
          </div>

          <h1 className="text-h1 text-white mb-4 tracking-tight">
            <Words text="Ton annonce est-elle" />{" "}
            <span className="text-lime sb-glow">
              <Mark variant="underline" color="lime" enter delay={900}><Words text={"optimisée ?"} start={4} /></Mark>
            </span>
          </h1>
          <p className="mo-enter text-white/55 text-base mb-6 leading-relaxed" style={moDelay(320)}>
            Colle le lien de ton annonce : note par critère, comparaison avec les annonces de ta ville, les corrections qui comptent le plus, puis un diagnostic de ton activité.
          </p>

          <p className="mo-enter flex items-center justify-center gap-2 text-white/50 text-xs font-semibold mb-10" style={moDelay(400)}>
            <span>7 ans d&apos;expérience</span>
            <span className="text-white/35">·</span>
            <span>+697K€ générés sur Airbnb</span>
          </p>
        </div>

        <div className="mo-enter-pop" style={moDelay(220)}>
          <div id="sb-form-card" className="sb-card mo-borderspin rounded-2xl p-5 sm:p-6 text-left">
            <div className="relative">
              <label htmlFor="sb-url" className="block text-white font-bold text-sm mb-2.5">Lien de ton annonce Airbnb</label>
              <form onSubmit={(e) => { e.preventDefault(); launch(); }} className="flex flex-col sm:flex-row gap-2 sm:bg-white/[0.06] sm:border sm:border-white/10 rounded-xl sm:p-1.5 sm:focus-within:border-lime/50 transition-colors mb-3">
                <input
                  id="sb-url" type="url" inputMode="url" autoComplete="url" value={url}
                  onChange={(e) => { setUrl(e.target.value); setUrlError(""); }}
                  placeholder="airbnb.fr/rooms/12345678"
                  className="flex-1 bg-[#2a2a2a] sm:bg-transparent border border-white/10 sm:border-0 rounded-xl sm:rounded-none text-white text-base placeholder-white/30 px-3.5 py-3 sm:py-2 focus:outline-none min-w-0"
                />
                <button type="submit" disabled={!url.trim()} data-magnetic
                  className="sb-btn mo-shine shrink-0 sm:!py-2.5 sm:!px-5 sm:!text-sm">
                  Auditer mon annonce →
                </button>
              </form>
              {urlError && <p className="text-red-300 text-xs mb-2" role="alert">{urlError}</p>}
              <p className="text-white/45 text-xs text-center">Gratuit · Sans carte bancaire · Sans engagement</p>
            </div>
          </div>
        </div>

        {/* Bandeau défilant */}
        <div className="sb-strip -mx-4 mt-10 border-y border-lime/20 py-3" aria-hidden>
          <Marquee
            items={["Score /100", "Analyse de tes photos", "Comparables de ta ville", "Corrections prioritaires", "Diagnostic de ton activité", "7 ans d'expérience", "+697K€ générés sur Airbnb"]}
            speed={30}
            itemClassName="sb-strip-item"
            separator={<span className="mo-pulse-dot sb-dot" style={{ width: 6, height: 6, margin: "0 20px" }} aria-hidden />}
          />
        </div>

        {/* Ce que tu obtiens */}
        <div className="mt-10 grid grid-cols-3 gap-3 text-center" data-stagger="90">
          {[
            { icon: "📊", label: "Score /100", sub: "6 critères notés /10" },
            { icon: "🎯", label: "Comparables", sub: "annonces de ta ville" },
            { icon: "🩺", label: "Diagnostic", sub: "de ton activité" },
          ].map((f) => (
            <div key={f.label} data-reveal="up">
              <div data-tilt className="sb-tile bg-white/[0.06] border border-white/10 rounded-xl p-3 sm:p-4 h-full">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-lime/10 border border-lime/25 flex items-center justify-center text-lg">{f.icon}</div>
                <div className="text-white/80 text-xs font-bold">{f.label}</div>
                <div className="text-white/50 text-xs">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Objectifs du programme */}
        <div className="mt-14 grid grid-cols-3 gap-3 text-center" data-stagger="90">
          {[
            { value: "+30%", n: 30, pre: "+", suf: "%", label: "de CA visé" },
            { value: "15 min", n: 15, pre: "", suf: " min", label: "de gestion / jour visées" },
            { value: "38 pts", n: 38, pre: "", suf: " pts", label: "checklist de réception" },
          ].map((s) => (
            <div key={s.label} data-reveal="up">
              <div className="bg-white/[0.06] border border-white/10 rounded-xl p-4 h-full">
                <p className="text-2xl font-extrabold text-lime tracking-tight">
                  <span data-count={s.n} data-prefix={s.pre} data-suffix={s.suf}>{s.value}</span>
                </p>
                <p className="text-white/50 text-[11px] mt-1 leading-snug">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-white/40 text-[11px] text-center mt-3">Objectifs visés avec les hôtes accompagnés en Super BNB Academy</p>

        {/* FAQ */}
        <Reveal className="mt-14 text-left">
          <p className="sb-kicker text-center mb-5">Questions fréquentes</p>
          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.06]">
            {[
              { q: "Comment fonctionne cet audit gratuit ?", a: "On lit les informations publiques de ton annonce Airbnb (titre, description, photos, avis, équipements), on la compare aux annonces similaires de ta ville, puis une IA analyse ton texte et tes photos selon notre grille. Tu obtiens une note sur 10 par critère, un score /100 et les corrections à faire en premier. Si ton annonce ne peut pas être lue (lien privé, annonce désactivée), tu réponds à quelques questions rapides à la place." },
              { q: "Et si je suis aussi sur Booking ou sur mon propre site ?", a: "L'audit porte sur ton annonce Airbnb. Tes autres canaux (Booking, réservation directe) sont pris en compte dans le diagnostic qui suit." },
              { q: "Est-ce vraiment gratuit et sans engagement ?", a: "Oui. Aucune carte bancaire, aucun abonnement. Tu renseignes juste tes coordonnées pour débloquer ton rapport." },
              { q: "Que deviennent mes données ?", a: "Elles servent uniquement à te transmettre ton audit et, si tu le souhaites, à préparer ton appel avec un coach Super BNB Academy. Aucune revente à des tiers." },
              { q: "Et après l'audit ?", a: "Quelques questions sur ton activité pour mesurer l'écart avec ton objectif, puis tu peux réserver un appel stratégique offert avec un coach Super BNB Academy." },
            ].map((item) => (
              <details key={item.q} className="sb-faq group p-4">
                <summary className="cursor-pointer list-none flex items-center justify-between text-sm font-semibold text-white/85">
                  {item.q}
                  <span className="text-white/50 group-open:rotate-45 transition-transform ml-3">+</span>
                </summary>
                <p className="text-white/55 text-sm mt-2 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
      <StickyCta watch={["#sb-hero", "#sb-form-card"]} onClick={focusUrl} className="sb-sticky-btn">
        Auditer mon annonce gratuitement →
      </StickyCta>
    </Shell>
  );

  /* ── 2. OPT-IN (débloque l'audit) ── */
  if (step === "optin") return (
    <Shell motion={motionEl} center>
      <div className="max-w-md w-full">
        <Reveal>
          <div className="flex items-center gap-3 sb-panel p-4 mb-4">
            {extract.state === "ok" && extract.listing?.coverPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={extract.listing.coverPhotoUrl} alt="" className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-lime/10 border border-lime/25 flex items-center justify-center shrink-0">
                {extract.state === "loading" ? <span className="w-5 h-5 rounded-full border-2 border-lime border-t-transparent animate-spin" aria-hidden /> : <span className="text-xl" aria-hidden>🏠</span>}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="sb-kicker mb-0.5">
                {extract.state === "loading" ? "Lecture de ton annonce…" : extract.state === "ok" ? "Annonce trouvée ✓" : "Annonce enregistrée"}
              </p>
              <p className="text-white font-bold text-sm truncate">{extract.listing?.title || url}</p>
              {extract.state === "ok" && extract.listing && (
                <p className="text-white/50 text-xs">{[extract.listing.city, extract.listing.photoCount != null ? `${extract.listing.photoCount} photos` : null, extract.listing.reviewCount ? `${extract.listing.reviewCount} avis` : null].filter(Boolean).join(" · ")}</p>
              )}
            </div>
            <span className="text-xl" aria-hidden>🔒</span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={(e) => { e.preventDefault(); submitOptin(); }} className="sb-panel p-5 sm:p-6">
            <h2 className="text-white font-extrabold text-xl mb-1">Débloque ton audit</h2>
            <p className="text-white/55 text-sm mb-5">Ton score /100 et tes corrections prioritaires s&apos;affichent juste après.</p>

            <label className="block text-white/70 text-xs font-bold mb-1.5" htmlFor="sb-first">Prénom</label>
            <input id="sb-first" type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`${inputCls} mb-3`} />

            <label className="block text-white/70 text-xs font-bold mb-1.5" htmlFor="sb-email">Email</label>
            <input id="sb-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className={`${inputCls} mb-1 ${email && !emailValid ? "!border-red-500/60" : ""}`} />
            {email && !emailValid ? <p className="text-red-300 text-xs mb-3">Vérifie ton email (ex. prenom@email.com).</p> : <div className="mb-3" />}

            <label className="block text-white/70 text-xs font-bold mb-1.5" htmlFor="sb-phone">WhatsApp <span className="font-normal text-white/45">(recommandé, pour ton appel)</span></label>
            <input id="sb-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78" value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputCls} mb-5`} />

            {optinState === "error" && (
              <div className="mb-4 space-y-2">
                <ErrorBox text="L'enregistrement n'a pas fonctionné (connexion ?). Réessaie, tes réponses sont conservées." onRetry={submitOptin} busy={false} />
                {optinFails >= 2 && (
                  <button type="button" onClick={skipOptinError} className="w-full text-white/60 hover:text-white text-xs underline underline-offset-4">Voir mon audit quand même →</button>
                )}
              </div>
            )}

            <button type="submit" disabled={!firstName.trim() || !emailValid || optinState === "saving"} data-magnetic className={primaryBtn}>
              {optinState === "saving" ? "Enregistrement…" : "Voir mon audit →"}
            </button>
            <p className="text-white/45 text-xs text-center mt-3">Pas de spam · Données confidentielles</p>
          </form>
        </Reveal>
        <button type="button" onClick={reset} className="block mx-auto mt-4 text-white/45 hover:text-white text-xs">← Changer de lien</button>
      </div>
    </Shell>
  );


  /* ── 3. CHECK-UP (prix + auto-évaluation si l'annonce n'a pas pu être lue) ── */
  if (step === "checkup") return (
    <Shell motion={motionEl} center>
      <div className="max-w-md w-full">
        <Reveal>
          <p className="sb-kicker mb-2">Dernière étape avant ton score</p>
          <h2 className="text-white font-extrabold text-xl mb-5 leading-snug">
            {needDeclared ? "Ton annonce n'a pas pu être lue automatiquement : décris-la en 30 secondes." : "Ce que ton annonce ne montre pas publiquement."}
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div className="sb-panel p-5">
            {needDeclared && (
              <>
                <label className="block text-white font-bold text-sm mb-2" htmlFor="sb-title">Le titre de ton annonce <span className="font-normal text-white/45">(copie-colle)</span></label>
                <input id="sb-title" type="text" maxLength={80} value={declared.title} onChange={(e) => setDeclared({ ...declared, title: e.target.value })} className={`${inputCls} mb-5`} />
                <Chips label="Combien de photos ?" value={declared.photos} onChange={(v) => setDeclared({ ...declared, photos: v })}
                  options={[{ v: "lt15", l: "Moins de 15" }, { v: "15-24", l: "15 à 24" }, { v: "25-40", l: "25 à 40" }, { v: "gt40", l: "Plus de 40" }]} />
                <Chips label="Ta note moyenne ?" value={declared.rating} onChange={(v) => setDeclared({ ...declared, rating: v })}
                  options={[{ v: "none", l: "Pas encore d'avis" }, { v: "lt46", l: "Moins de 4,6" }, { v: "46-479", l: "4,6 à 4,79" }, { v: "gte48", l: "4,8 et plus" }]} />
                {declared.rating !== "none" && (
                  <Chips label="Combien d'avis ?" value={declared.reviews} onChange={(v) => setDeclared({ ...declared, reviews: v })}
                    options={[{ v: "1-9", l: "1 à 9" }, { v: "10-49", l: "10 à 49" }, { v: "gte50", l: "50 et plus" }]} />
                )}
                <Chips label="Ta description ?" value={declared.description} onChange={(v) => setDeclared({ ...declared, description: v })}
                  options={[{ v: "short", l: "Quelques lignes" }, { v: "paragraph", l: "Un paragraphe" }, { v: "detailed", l: "Détaillée, par rubriques" }]} />
                <Chips label="Tu es Superhôte ?" value={declared.superhost} onChange={(v) => setDeclared({ ...declared, superhost: v })}
                  options={[{ v: "yes", l: "Oui" }, { v: "no", l: "Non" }]} />
                <div className="border-t border-white/10 my-5" />
              </>
            )}
            <Chips label="Comment fixes-tu tes prix ?" value={checkup.pricing} onChange={(v) => setCheckup({ ...checkup, pricing: v })}
              options={[{ v: "fixed", l: "Même prix toute l'année" }, { v: "manual", l: "Je les ajuste à la main" }, { v: "tool", l: "Avec un outil (PriceLabs…)" }]} />
            <label className="block text-white font-bold text-sm mb-2" htmlFor="sb-price">Ton prix moyen par nuit <span className="font-normal text-white/45">(facultatif)</span></label>
            <div className="relative mb-5">
              <input id="sb-price" type="number" inputMode="decimal" min={10} max={5000} placeholder="ex. 85" value={checkup.price}
                onChange={(e) => setCheckup({ ...checkup, price: e.target.value })} className={`${inputCls} pr-16`} />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/45 text-sm">€ / nuit</span>
            </div>
            {needResponse && (
              <Chips label="En combien de temps réponds-tu aux voyageurs ?" value={checkup.response} onChange={(v) => setCheckup({ ...checkup, response: v })}
                options={[{ v: "hour", l: "Moins d'1 h" }, { v: "hours", l: "Quelques heures" }, { v: "day", l: "1 jour ou plus" }]} />
            )}

            <button type="button" onClick={showResult} disabled={!canShowResult} data-magnetic className={`${primaryBtn} mt-2`}>
              {extract.state === "loading" ? "Lecture de ton annonce…" : "Lancer l'analyse →"}
            </button>
          </div>
        </Reveal>
      </div>
    </Shell>
  );

  /* ── 3 bis. ANALYSE (écran vivant : les étapes se cochent) ── */
  if (step === "analyse") {
    const comp = extract.listing?.comparables;
    const rows = extract.state === "ok"
      ? [
          { l: "Annonce lue", s: `${extract.listing?.photoCount ?? "?"} photos · ${extract.listing?.reviewCount ?? 0} avis` },
          { l: "Comparables trouvés", s: comp ? `${comp.count} annonces à ${extract.listing?.city}` : "Pas assez d'annonces comparables" },
          { l: "Photos et texte analysés", s: ai.state === "ok" ? "Analyse IA terminée" : ai.state === "loading" ? "Lecture de tes photos…" : "Grille Super BnB appliquée" },
          { l: "Score calculé", s: "6 critères notés sur 10" },
        ]
      : [
          { l: "Réponses enregistrées", s: "Auto-évaluation de ton annonce" },
          { l: "Grille Super BnB appliquée", s: "Titre, photos, description, avis, prix" },
          { l: "Corrections classées", s: "Par ordre d'impact" },
          { l: "Score calculé", s: "6 critères notés sur 10" },
        ];
    return (
      <Shell motion={motionEl} center>
        <div className="max-w-md w-full">
          <div className="sb-panel p-6 sm:p-7">
            <div className="flex items-center gap-4 mb-6">
              <div className="sb-radar relative w-14 h-14 shrink-0" aria-hidden><span /><span /></div>
              <div>
                <p className="sb-kicker mb-1">Analyse en cours</p>
                <h2 className="text-white font-extrabold text-xl leading-tight tracking-tight">On passe ton annonce au <Mark color="lime" enter delay={300}>scanner</Mark></h2>
              </div>
            </div>
            <ol className="space-y-3" aria-live="polite">
              {rows.map((r, i) => {
                const done = tick > i;
                const active = tick === i;
                return (
                  <li key={r.l} className={`sb-step flex items-center gap-3 rounded-2xl border px-4 py-3 ${done ? "border-lime/40 bg-lime/[0.07]" : active ? "border-white/20 bg-white/[0.04]" : "border-white/10 opacity-60"}`} data-done={done ? "1" : undefined}>
                    <span className={`sb-check shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${done ? "bg-lime text-ink" : "border border-white/25"}`}>
                      {done ? (
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12l5 5 9-10" pathLength={1} /></svg>
                      ) : active ? <span className="w-3 h-3 rounded-full border-2 border-lime border-t-transparent animate-spin" aria-hidden /> : null}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-sm font-bold ${done ? "text-white" : "text-white/80"}`}>{r.l}</span>
                      <span className="block text-xs text-white/55 truncate">{r.s}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="sb-progress h-full bg-lime rounded-full" style={{ width: `${Math.min(100, tick * 25)}%` }} />
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  /* ── 4. RÉSULTAT ── */
  if (step === "result" && audit) {
    const l = extract.listing;
    const comp = audit.comparables;
    return (
      <Shell motion={motionEl} right={<button onClick={reset} className="text-white/60 hover:text-lime text-xs font-semibold transition-colors">← Autre annonce</button>}>

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
          <Reveal>
            <div className="sb-panel p-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className="shrink-0">
                  <GaugeScore score={audit.score} color={audit.gradeColor} size="lg" />
                  <div className="mt-2 text-xs font-bold px-2.5 py-1 rounded-full inline-block" style={{ backgroundColor: audit.gradeColor + "22", color: audit.gradeColor }}>
                    {audit.grade}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="sb-kicker mb-1">
                    {audit.source === "airbnb"
                      ? audit.ai ? "Annonce, photos et comparables analysés" : "Audit des données publiques de ton annonce"
                      : "Audit Airbnb · d'après tes réponses"}
                  </p>
                  <h2 className="text-white font-extrabold text-lg leading-tight mb-1">{l?.title || declared.title || "Ton annonce"}</h2>
                  {l && <p className="text-white/50 text-xs mb-2">{[l.city, l.propertyType, l.rating != null && l.reviewCount ? `★ ${l.rating.toLocaleString("fr-FR")} (${l.reviewCount} avis)` : null].filter(Boolean).join(" · ")}</p>}
                  <p className="text-white/70 text-sm leading-relaxed">
                    {audit.summary || `${firstName.trim() ? `${firstName.trim()}, v` : "V"}oici les corrections qui feront le plus bouger ton annonce, par ordre d'impact.`}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="sb-panel p-5">
              <p className="sb-kicker mb-2">Plan d&apos;action</p>
              <h3 className="text-white font-extrabold text-xl tracking-tight mb-4">Tes corrections <Mark color="lime">prioritaires</Mark></h3>
              <ol className="space-y-2.5" data-stagger="110">
                {audit.fixes.map((f, i) => (
                  <li key={i} data-reveal="up" className={`flex items-start gap-3 p-4 rounded-2xl border ${f.impact === "HIGH" ? "bg-red-500/8 border-red-500/20" : f.impact === "MEDIUM" ? "bg-amber-500/8 border-amber-500/20" : "bg-lime/5 border-lime/20"}`}>
                    <span className="text-lg shrink-0 mt-0.5" aria-hidden>{f.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ImpactPill impact={f.impact} />
                        <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold">{f.category}</span>
                      </div>
                      <p className="text-white/80 text-sm leading-snug">{f.action}</p>
                    </div>
                  </li>
                ))}
              </ol>
              {audit.suggestedTitle && (
                <div className="mt-4 rounded-xl border border-lime/25 bg-lime/10 p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-lime mb-1">Titre proposé</p>
                  <p className="text-white font-semibold text-sm">« {audit.suggestedTitle} »</p>
                  <p className="text-white/45 text-[11px] mt-1">Vérifie que chaque atout cité est bien dans ton logement avant de le publier.</p>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="sb-panel p-5">
              <h3 className="text-white font-extrabold text-sm mb-4">Note par critère</h3>
              <div className="space-y-3.5">
                {audit.categories.map((c) => {
                  const pct = c.score / c.max;
                  const color = pct >= 0.8 ? "#B6F23A" : pct >= 0.5 ? "#F59E0B" : "#EF4444";
                  return (
                    <div key={c.id}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span aria-hidden>{c.icon}</span>
                        <span className="text-white/80 text-xs font-semibold flex-1">{c.label}</span>
                        <span className="text-xs font-extrabold" style={{ color }}>{c.score.toLocaleString("fr-FR")}/10</span>
                      </div>
                      <BarScore score={c.score} max={c.max} color={color} index={audit.categories.indexOf(c)} />
                      <p className="text-white/50 text-xs mt-1 ml-6 leading-snug">{c.verdict || c.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {comp && (
            <Reveal delay={150}>
              <div className="sb-panel p-5">
                <h3 className="text-white font-extrabold text-sm mb-1">Face aux annonces comparables</h3>
                <p className="text-white/45 text-xs mb-4">{comp.count} annonces similaires à {l?.city}, relevées sur Airbnb pour les mêmes dates ({comp.dates}).</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { v: comp.medianNightlyPrice != null ? `${Math.round(comp.medianNightlyPrice)} €` : "–", l: "prix médian / nuit", mine: audit.declaredPrice != null ? `toi : ${audit.declaredPrice} €` : null },
                    { v: comp.medianRating != null ? comp.medianRating.toLocaleString("fr-FR", { maximumFractionDigits: 2 }) : "–", l: "note médiane", mine: l?.rating != null && l.reviewCount ? `toi : ${l.rating.toLocaleString("fr-FR")}` : null },
                    { v: comp.medianReviews != null ? String(Math.round(comp.medianReviews)) : "–", l: "avis (médiane)", mine: l ? `toi : ${l.reviewCount}` : null },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl bg-white/[0.06] border border-white/10 p-3">
                      <div className="text-white font-extrabold text-base">{s.v}</div>
                      <div className="text-white/50 text-[10px] font-semibold leading-tight">{s.l}</div>
                      {s.mine && <div className="text-lime text-[11px] font-bold mt-1">{s.mine}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {auditSave === "error" && <ErrorBox text="Ton audit n'a pas pu être enregistré de notre côté." onRetry={() => saveAudit(audit)} />}

          <Reveal delay={180}>
            <div className="sb-lime-block rounded-3xl overflow-hidden bg-lime shadow-[0_8px_0_#5E8A0A]">
              <div className="px-6 py-8 text-center">
                <div className="inline-flex items-center gap-2 bg-ink rounded-full px-3 py-1.5 mb-5">
                  <span className="text-[10px] font-bold text-lime uppercase tracking-widest">Étape suivante · 2 minutes</span>
                </div>
                <h3 className="text-ink font-extrabold text-xl mb-2 tracking-tight">L&apos;annonce, c&apos;est le symptôme. Voyons le reste.</h3>
                <p className="text-ink/75 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
                  Quelques questions sur ton activité, une par écran, pour chiffrer ce qui te bloque vraiment et ce que ça te coûte.
                </p>
                <button type="button" onClick={() => { setQi(0); setStep("doc"); }} data-magnetic
                  className="mo-shine inline-flex items-center gap-2 rounded-full bg-ink text-white font-extrabold text-base px-8 py-4 shadow-[0_6px_0_#5E8A0A] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all">
                  Faire mon diagnostic →
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </Shell>
    );
  }

  /* ── 5. DIAGNOSTIC « DOCTEUR » (une question par écran, branchements selon profil et douleur) ── */
  if (step === "doc") {
    const q = questions[Math.min(qi, questions.length - 1)];
    const cur = answers[q.id];
    const sel = (cur as string[]) || [];
    // Total estimé : la liste s'allonge dès que le profil et la douleur sont connus
    const total = questions.length > 2 ? questions.length : 10;
    return (
      <Shell motion={motionEl} center>
        <div className="max-w-md w-full">
          <Reveal>
            <div className="flex items-center justify-between mb-2">
              <span className="sb-kicker">Diagnostic de ton activité</span>
              <span className="text-white/45 text-xs font-bold">{qi + 1}/{total}</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-8">
              <div className="sb-progress h-full bg-lime rounded-full" style={{ width: `${((qi + 1) / total) * 100}%` }} />
            </div>
          </Reveal>
          <div key={q.id} className={`sb-q sb-q--${dir}`}>
            <h2 className="text-white font-extrabold text-xl mb-2 leading-snug">{q.title}</h2>
            {q.hint ? <p className="text-white/50 text-sm mb-5">{q.hint}</p> : <div className="mb-5" />}
            {q.scale ? (
              <div className="grid grid-cols-5 gap-2 mb-3">
                {q.options.map((opt) => (
                  <button key={opt} type="button" onClick={() => answer(q, opt)} aria-pressed={cur === opt}
                    className={`sb-opt aspect-square rounded-2xl text-lg font-extrabold border ${cur === opt ? "border-lime bg-lime text-ink shadow-[0_4px_0_#5E8A0A]" : "border-white/10 bg-[#262626] text-white/85"}`}>
                    {opt}
                  </button>
                ))}
                <span className="col-span-2 text-white/40 text-[11px]">1 = pas prioritaire</span>
                <span className="col-span-3 text-white/40 text-[11px] text-right">10 = je dois régler ça maintenant</span>
              </div>
            ) : (
              <div className="space-y-2.5 mb-6">
                {q.options.map((opt) => {
                  const rank = q.multi ? sel.indexOf(opt) : -1;
                  const selected = q.multi ? rank >= 0 : cur === opt;
                  const disabled = q.id === "douleurs" && !selected && sel.length >= 3;
                  return (
                    <button key={opt} type="button" onClick={() => answer(q, opt)} aria-pressed={selected} disabled={disabled}
                      className={`sb-opt w-full text-left py-4 px-4 rounded-2xl text-sm font-semibold border disabled:opacity-40 ${
                        selected ? "border-lime bg-lime/10 text-lime shadow-[0_4px_0_#5E8A0A]" : "border-white/10 bg-[#262626] text-white/85"
                      }`}>
                      {selected ? (q.id === "douleurs" ? `${rank + 1}. ` : "✓ ") : ""}{opt}
                    </button>
                  );
                })}
              </div>
            )}
            {q.multi && (
              <button type="button" onClick={() => advance(answers)} disabled={!sel.length} data-magnetic className={primaryBtn}>
                Suivant →
              </button>
            )}
            {qi > 0 && (
              <button type="button" onClick={() => { setDir("back"); setQi(qi - 1); }} className="block mx-auto mt-4 text-white/55 hover:text-lime text-xs">← Question précédente</button>
            )}
          </div>
        </div>
      </Shell>
    );
  }

  /* ── 6. DIAGNOSTIC PERSONNALISÉ + RÉSERVATION (offerte à tous) ── */
  if (step === "booking") {
    const d = diag;
    const lowMotivation = d?.motivation != null && d.motivation < 7;
    return (
      <Shell motion={motionEl} right={<span className="text-white/60 text-xs font-semibold">Ton diagnostic</span>}>
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
          <Reveal>
            <div className="sb-panel p-5">
              <p className="sb-kicker mb-1">Ton diagnostic</p>
              <h2 className="text-white font-extrabold text-xl mb-4 leading-snug">
                {firstName.trim() ? `${firstName.trim()}, ` : ""}ta priorité n°1 : <Mark color="lime" enter delay={500}>{d?.painTitle.toLowerCase() || "ton activité"}</Mark>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl p-3.5 text-center bg-white/[0.06] border border-white/10">
                  <div className="font-extrabold text-xl text-white">{audit?.score ?? "–"}<span className="text-white/45 text-sm">/100</span></div>
                  <div className="text-[11px] text-white/55 font-semibold">score de ton annonce</div>
                </div>
                {d?.inaction6m != null && d.inaction6m > 0 && (
                  <div className="rounded-xl p-3.5 text-center bg-lime/10 border border-lime/25">
                    <div className="font-extrabold text-2xl text-lime tracking-tight"><CountText text={eur(d.inaction6m)} /></div>
                    <div className="text-[11px] text-white/60 font-semibold">laissés sur la table en 6 mois si rien ne change</div>
                  </div>
                )}
                {d?.painMetric && (
                  <div className="rounded-xl p-3.5 text-center bg-white/[0.06] border border-white/10 col-span-2 sm:col-span-1">
                    <div className="font-extrabold text-2xl text-white tracking-tight"><CountText text={d.painMetric.value} /></div>
                    <div className="text-[11px] text-white/55 font-semibold leading-tight">{d.painMetric.label}</div>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm text-white/75 leading-relaxed">
                {d?.gapMonthly != null && d.gapMonthly > 0 && d.target != null && (
                  <p>Tu vises {eur(d.target)} net par mois{d.current ? `, tu es aujourd'hui autour de ${eur(d.current)}` : ""} : il te manque environ <strong className="text-lime">{eur(d.gapMonthly)} par mois</strong>. Sur 6 mois, c&apos;est {eur(d.inaction6m || 0)} si rien ne change.</p>
                )}
                {d?.gapMonthly === 0 && <p>Ton objectif de revenu est déjà proche de ta situation : l&apos;enjeu, c&apos;est de le tenir sans y laisser ton temps.</p>}
                {d?.painLine && <p>{d.painLine}</p>}
                {d?.extraLines.map((x) => <p key={x} className="font-semibold text-white">{x}</p>)}
                {d && d.otherPains.length > 0 && <p>Tu as aussi cité : {d.otherPains.join(" ; ").toLowerCase()}. On en parle pendant l&apos;appel.</p>}
              </div>
              {d && d.blockers.length > 0 && (
                <div className="mt-4">
                  <p className="text-white font-bold text-sm mb-2">Ce qui te bloque, d&apos;après tes réponses</p>
                  <ul className="space-y-1.5">
                    {d.blockers.map((b) => (
                      <li key={b} className="flex gap-2 text-sm text-white/70"><span className="text-lime" aria-hidden>●</span><span>{b}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-white/40 text-[11px] mt-4">Ordres de grandeur calculés à partir de tes réponses (milieu de chaque tranche), pas une promesse de résultat.</p>
            </div>
          </Reveal>

          {d && (
            <Reveal delay={60}>
              <div className="sb-panel p-5">
                <p className="text-white font-extrabold text-sm mb-3">Voici ce qu&apos;on regarde ensemble pendant l&apos;appel</p>
                <ol className="space-y-2">
                  {d.callPoints.map((c, i) => (
                    <li key={c} className="flex gap-3 text-sm text-white/80"><span className="shrink-0 w-6 h-6 rounded-full bg-lime text-ink text-xs font-extrabold flex items-center justify-center">{i + 1}</span><span className="pt-0.5">{c}</span></li>
                  ))}
                </ol>
              </div>
            </Reveal>
          )}

          {docSave === "error" && <ErrorBox text="Tes réponses n'ont pas pu être enregistrées de notre côté." onRetry={() => saveDiagnostic(answers)} />}

          <Reveal delay={100}>
            <div id="sb-booking" className="rounded-2xl overflow-hidden border border-lime/30 bg-[#1f1f1f]">
              <div className="px-5 pt-6 pb-4 text-center">
                <div className="inline-flex items-center gap-2 bg-lime/10 border border-lime/25 rounded-full px-3 py-1.5 mb-4">
                  <span className="text-[10px] font-bold text-lime uppercase tracking-widest">Audit stratégique offert · Super BNB Academy</span>
                </div>
                <h3 className="text-white font-extrabold text-2xl mb-2 tracking-tight">Choisis ton <Mark variant="underline" color="lime">créneau</Mark></h3>
                <p className="text-white/60 text-sm leading-relaxed max-w-md mx-auto">
                  {d?.hook || "Un coach reprend ton audit et tes réponses avec toi."} Gratuit, sans engagement.
                </p>
              </div>
              <div id="sb-cal-inline" className="w-full min-h-[560px] overflow-auto" />
              <div className="px-5 pb-5 pt-2 text-center">
                {calFailed && <p className="text-white/70 text-sm mb-2">L&apos;agenda ne s&apos;affiche pas ?</p>}
                <a href={calHref} target="_blank" rel="noopener noreferrer" onClick={() => onCallClick(calFailed ? "fallback" : "link")}
                  className={calFailed
                    ? "sb-btn mo-shine"
                    : "text-white/55 hover:text-white text-xs underline underline-offset-4"}>
                  {calFailed ? "Choisir mon créneau →" : "Ouvrir l'agenda dans un nouvel onglet"}
                </a>
              </div>
            </div>
          </Reveal>

          {lowMotivation && (
            <Reveal delay={120}>
              <p className="text-center text-white/55 text-sm">
                Pas encore le bon moment pour un appel ?{" "}
                <a href="/masterclass/" onClick={() => trackEvent("audit_alt_click", { to: "masterclass" })} className="text-lime underline underline-offset-4">Regarde d&apos;abord la masterclass gratuite</a>
              </p>
            </Reveal>
          )}
        </div>
      </Shell>
    );
  }

  return null;
}
