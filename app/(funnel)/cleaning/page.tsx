"use client";

import { useRef, useState } from "react";
import Logo from "@/components/layout/Logo";
import { trackEvent, trackMeta } from "@/lib/gtag";
import { CLEANING_CAL_URL, CLEANING_VIDEO_ID } from "@/lib/cleaning";

const G = "#2DB84B";
const GD = "#1A6B33";
const INK = "#1A1A1A";
const MUTED = "#6B6B6B";
const CREAM = "#F7F6F2";
const FONT = "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)";

const BULLETS = [
  "Monter ton activité de ménage Airbnb de A à Z, sans local et sans capital",
  "Trouver et signer ton premier client (hôte, conciergerie ou propriétaire)",
  "Encaisser ton premier revenu, puis passer de « je fais le ménage » à « je dirige une équipe »",
  "Ce qu'un hôte Airbnb attend vraiment de la personne qui s'occupe de son logement",
];

const FAQ = [
  { q: "C'est vraiment gratuit ?", a: "Oui. Aucune carte bancaire demandée. Tu accèdes à la présentation juste après ton inscription." },
  { q: "Pourquoi mon WhatsApp ?", a: "Pour t'envoyer la présentation en privé et répondre à tes questions pendant ou après le visionnage." },
  { q: "Je n'ai jamais travaillé dans le ménage, c'est pour moi ?", a: "Oui, si tu es prêt à te former sérieusement et à aller chercher tes clients. Ce n'est pas pour toi si tu cherches de l'argent facile et immédiat." },
];

const inputStyle = (err?: string): React.CSSProperties => ({
  width: "100%", padding: "13px 15px", border: `1.5px solid ${err ? "#DC2626" : "rgba(26,26,26,.13)"}`,
  borderRadius: 12, fontFamily: "inherit", fontSize: 15, color: INK, background: CREAM, boxSizing: "border-box",
});

export default function CleaningPage() {
  const [step, setStep] = useState<"form" | "video">("form");
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const firstName = ((fd.get("firstName") as string) || "").trim();
    const email = ((fd.get("email") as string) || "").trim();
    const phone = ((fd.get("phone") as string) || "").trim();
    const next: Record<string, string> = {};
    if (!firstName) next.firstName = "Prénom requis";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Format invalide. Ex : prenom@email.com";
    if ((phone.match(/\d/g) || []).length < 8) next.phone = "Numéro incomplet (ex : +33 6 12 34 56 78)";
    if (Object.keys(next).length) { setErrs(next); return; }
    setErrs({});
    setLoading(true);
    const source = new URLSearchParams(window.location.search).get("src") || "direct";
    try {
      const r = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, phone, source, funnel: "cleaning" }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErrs({ global: data.message || "Une erreur est survenue. Réessaie dans une minute." });
        setLoading(false);
        return;
      }
      sessionStorage.setItem("rentimmo_lead_email", email);
      trackEvent("cleaning_optin", { source });
      trackMeta("Lead", { content_name: "cleaning", source });
      setStep("video");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrs({ global: "Erreur réseau. Vérifie ta connexion et réessaie." });
      setLoading(false);
    }
  }

  const Topbar = (
    <header style={{ background: "rgba(26,26,26,.92)", borderBottom: "1px solid rgba(255,255,255,.08)", padding: "13px 24px", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo />
        <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.8)" }}>✓ Organisme QUALIOPI</div>
      </div>
    </header>
  );
  const Footer = (
    <footer style={{ padding: "28px 24px", background: "#111", color: "rgba(255,255,255,.45)", textAlign: "center", fontSize: 13 }}>
      <strong style={{ color: "#fff" }}>Rentimmo Academy</strong> · Marwan AFASSI · Organisme certifié QUALIOPI · © 2026
    </footer>
  );

  if (step === "video") {
    return (
      <div style={{ background: INK, minHeight: "100vh", fontFamily: FONT }}>
        {Topbar}
        <section style={{ padding: "48px 20px 72px" }}>
          <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
            <div style={{ display: "inline-block", background: "rgba(45,184,75,.12)", color: G, padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 22 }}>
              ▶ Accès débloqué — Présentation Cleaning BnB Academy
            </div>
            <h1 style={{ color: "#fff", fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 28 }}>
              Du premier client au <span style={{ color: G }}>premier encaissement</span>
            </h1>
          </div>
          <div style={{ maxWidth: 980, margin: "0 auto 40px", borderRadius: 24, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.55)", aspectRatio: "16/9", background: "#000" }}>
            {CLEANING_VIDEO_ID ? (
              <iframe
                src={`https://www.youtube.com/embed/${CLEANING_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
                title="Présentation Cleaning BnB Academy"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: 0, display: "block" }}
              />
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.7)", padding: 24, textAlign: "center" }}>
                La présentation arrive très bientôt. Réserve ton appel ci-dessous, on te l'envoie avant.
              </div>
            )}
          </div>
          <div style={{ maxWidth: 640, margin: "0 auto", background: "rgba(45,184,75,.08)", border: "1px solid rgba(45,184,75,.25)", borderRadius: 24, padding: "32px 24px", textAlign: "center" }}>
            <h2 style={{ color: "#fff", fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, marginBottom: 12 }}>Tu veux savoir si c'est fait pour toi ?</h2>
            <p style={{ color: "rgba(255,255,255,.6)", fontSize: 16, marginBottom: 24 }}>Réserve un appel de 45 min. On regarde ta situation et on voit si la formation peut t'accompagner.</p>
            <a
              href={CLEANING_CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackEvent("cleaning_call_click"); trackMeta("Schedule", { content_name: "cleaning" }); }}
              style={{ display: "block", padding: "18px 24px", background: `linear-gradient(135deg,${GD},${G})`, color: "#fff", borderRadius: 14, fontWeight: 800, fontSize: 17, textDecoration: "none" }}
            >
              Réserver mon appel offert →
            </a>
            <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, marginTop: 12 }}>45 min · 0 € · Sans engagement</p>
          </div>
        </section>
        {Footer}
      </div>
    );
  }

  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: FONT, color: INK }}>
      {Topbar}
      <section style={{ padding: "52px 20px 64px", background: INK }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-block", background: "rgba(45,184,75,.14)", color: G, padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 20 }}>
              Présentation offerte · accès immédiat
            </div>
            <h1 style={{ color: "#fff", fontSize: "clamp(28px,4.2vw,46px)", lineHeight: 1.07, fontWeight: 800, marginBottom: 16 }}>
              Monte ton activité de ménage Airbnb de A à Z : <span style={{ color: G }}>signe ton premier client et encaisse</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,.65)", fontSize: 16, lineHeight: 1.6, marginBottom: 22 }}>
              Une présentation de 9 minutes par Marwan AFASSI : plus de 7 ans en location courte durée, jusqu'à 24 logements gérés entre la France et le Maroc.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 11 }}>
              {BULLETS.map((b) => (
                <li key={b} style={{ display: "flex", gap: 11, color: "rgba(255,255,255,.85)", fontSize: 15 }}>
                  <span style={{ flexShrink: 0, width: 22, height: 22, background: G, color: "#fff", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div ref={formRef} style={{ background: "#fff", borderRadius: 24, padding: "32px 28px", boxShadow: "0 40px 80px rgba(26,107,51,.18)" }}>
            <h2 style={{ fontSize: 23, fontWeight: 800, marginBottom: 6 }}>Reçois la présentation maintenant</h2>
            <p style={{ color: MUTED, fontSize: 14, marginBottom: 20 }}>Renseigne tes infos. Tu accèdes à la vidéo dans 10 secondes.</p>
            <form onSubmit={handleSubmit} noValidate>
              {[
                { name: "firstName", label: "Prénom", type: "text", ph: "Ton prénom", ac: "given-name" },
                { name: "email", label: "Email", type: "email", ph: "ton@email.com", ac: "email" },
                { name: "phone", label: "📱 WhatsApp", type: "tel", ph: "+33 6 12 34 56 78", ac: "tel" },
              ].map((f) => (
                <div key={f.name} style={{ marginBottom: 13 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, marginBottom: 5 }}>{f.label}</label>
                  <input name={f.name} type={f.type} placeholder={f.ph} autoComplete={f.ac} aria-invalid={!!errs[f.name]} style={inputStyle(errs[f.name])} />
                  {errs[f.name] && <p role="alert" style={{ color: "#DC2626", fontSize: 11, marginTop: 3, fontWeight: 600 }}>{errs[f.name]}</p>}
                </div>
              ))}
              {errs.global && <div role="alert" style={{ background: "rgba(220,38,38,.07)", borderRadius: 11, padding: "11px 15px", color: "#DC2626", fontSize: 13, marginBottom: 14 }}>{errs.global}</div>}
              <button type="submit" disabled={loading} style={{ width: "100%", padding: "18px 24px", background: `linear-gradient(135deg,${GD},${G})`, color: "#fff", border: 0, borderRadius: 13, fontFamily: "inherit", fontWeight: 800, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "⏳ Préparation de ton accès…" : "🎁 J'accède à la présentation →"}
              </button>
              <p style={{ fontSize: 11, color: MUTED, textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
                En validant, tu acceptes de recevoir la présentation et des messages de Rentimmo Academy par email et WhatsApp. Désinscription possible à tout moment.
              </p>
            </form>
          </div>
        </div>
      </section>
      <section style={{ padding: "56px 20px", background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", display: "grid", gap: 14 }}>
          <h2 style={{ fontSize: "clamp(20px,2.6vw,28px)", fontWeight: 800, textAlign: "center", marginBottom: 14 }}>Tes questions, nos réponses</h2>
          {FAQ.map((f) => (
            <div key={f.q} style={{ background: CREAM, border: "1px solid rgba(26,26,26,.06)", borderRadius: 16, padding: "20px 22px" }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{f.q}</div>
              <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.6 }}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>
      {Footer}
    </div>
  );
}
