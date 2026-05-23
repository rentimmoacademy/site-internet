"use client";

import { useState } from "react";

const BULLETS = [
  "La méthode pour trouver et négocier un bail commercial en moins de 14 jours",
  "Le calcul de rentabilité que j'utilise en 90 secondes pour valider un appart",
  "Le modèle 100% halal qui démarre avec moins de 4 000€ — zéro crédit conventionnel",
  "Ma stack tech pour gérer plusieurs logements sans répondre aux clients à 3h du matin",
];

const TESTIMONIALS = [
  {
    quote: "+1 200€/mois nets en 3 mois grâce à la méthode Marwan. Le module sur la négo bail commercial vaut à lui seul l'investissement.",
    name: "Karim B.",
    meta: "Ex-ingénieur · Toulouse",
    i: "K",
  },
  {
    quote: "Je suis passé de 65% à 92% de taux d'occupation sur mes Airbnb. Marwan ne raconte pas du blabla, il montre les chiffres.",
    name: "Sami L.",
    meta: "Hôte Airbnb · Lyon",
    i: "S",
  },
  {
    quote: "Reconvertie de l'e-commerce vers la sous-loc. 6 mois après, je dégage un vrai second salaire en restant 100% halal. Merci.",
    name: "Aïcha R.",
    meta: "Reconversion · Paris",
    i: "A",
  },
];

const G = "#2DB84B";
const GD = "#1A6B33";
const INK = "#1A1A1A";
const MUTED = "#6B6B6B";
const CREAM = "#F7F6F2";

export default function MasterclassPage() {
  const [step, setStep] = useState<"form" | "video">("form");
  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const firstName = (fd.get("firstName") as string || "").trim();
    const email = (fd.get("email") as string || "").trim();
    const phone = (fd.get("phone") as string || "").trim();

    const next: Record<string, string> = {};
    if (!firstName) next.firstName = "Prénom requis";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Email valide requis";
    if ((phone.match(/\d/g) || []).length < 8) next.phone = "Numéro WhatsApp requis";
    if (Object.keys(next).length) { setErrs(next); return; }
    setErrs({});
    setLoading(true);

    const source = new URLSearchParams(window.location.search).get("src") || "direct";
    try {
      const r = await fetch("/api/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, email, phone, source }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErrs({ global: data.message || "Une erreur est survenue. Réessaie dans une minute." });
        setLoading(false);
        return;
      }
      sessionStorage.setItem("rentimmo_lead_email", email);
      sessionStorage.setItem("rentimmo_lead_firstName", firstName);
      setStep("video");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrs({ global: "Erreur réseau. Vérifie ta connexion et réessaie." });
      setLoading(false);
    }
  }

  /* ── shared topbar ── */
  const Topbar = () => (
    <header style={{ background: "#fff", borderBottom: "1px solid rgba(26,26,26,.07)", padding: "13px 24px", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 800, fontSize: 16, color: INK }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${GD},${G})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>R</div>
          Rentimmo <span style={{ color: G, marginLeft: 4 }}>Academy</span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: CREAM, padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, border: `1px solid rgba(26,107,51,.12)`, color: "#2D2D2D" }}>
          <span style={{ color: G }}>✓</span> Organisme QUALIOPI
        </div>
      </div>
    </header>
  );

  if (step === "video") return (
    <div style={{ background: INK, minHeight: "100vh", fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)" }}>
      <Topbar />
      <section style={{ padding: "56px 24px 80px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,184,75,.12)", color: G, padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 24 }}>
            ▶ Accès débloqué — Masterclass offerte
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-.025em", marginBottom: 12 }}>
            Génère tes premiers revenus Airbnb <span style={{ color: G }}>sans crédit, sans apport.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 17, marginBottom: 32 }}>Lance la vidéo et prends des notes — chaque minute compte.</p>
        </div>

        <div style={{ maxWidth: 980, margin: "0 auto 48px", borderRadius: 24, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,.55)", aspectRatio: "16/9" }}>
          <iframe src="https://www.youtube.com/embed/QyzwMPk_4yY?rel=0&modestbranding=1&controls=1&playsinline=1&autoplay=1" title="Masterclass Rentimmo Academy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width: "100%", height: "100%", border: 0, display: "block" }} />
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto", background: `rgba(45,184,75,.08)`, border: `1px solid rgba(45,184,75,.25)`, borderRadius: 24, padding: "40px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📞</div>
          <h2 style={{ color: "#fff", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, marginBottom: 12, letterSpacing: "-.02em" }}>Tu veux passer à l'action ?</h2>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: 16, marginBottom: 28 }}>Réserve 45 min avec Marwan. On analyse ta situation et on voit si la formation peut t'accompagner.</p>
          <a href="https://cal.com/rentimmoacademy/appel-strategique" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "20px 36px", background: `linear-gradient(135deg,${GD},${G})`, color: "#fff", borderRadius: 14, fontWeight: 800, fontSize: 17, textDecoration: "none", boxShadow: "0 12px 28px rgba(45,184,75,.35)" }}>
            Réserver mon appel stratégique offert →
          </a>
          <p style={{ color: "rgba(255,255,255,.35)", fontSize: 13, marginTop: 14 }}>45 min · 0€ · Sans engagement</p>
        </div>
      </section>
      <footer style={{ padding: "28px 24px", background: "#111", color: "rgba(255,255,255,.45)", textAlign: "center", fontSize: 13 }}>
        <strong style={{ color: "#fff" }}>Rentimmo Academy</strong> · Marwan AFASSI · Organisme certifié QUALIOPI · © 2026
      </footer>
    </div>
  );

  return (
    <div style={{ background: CREAM, minHeight: "100vh", fontFamily: "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)", color: INK }}>
      <Topbar />

      {/* HERO + FORM */}
      <section style={{ padding: "56px 24px 72px", background: `linear-gradient(180deg,${CREAM} 0%,#fff 100%)` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>

          {/* LEFT */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(45,184,75,.1)", color: GD, padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 22 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: G, boxShadow: `0 0 0 4px rgba(45,184,75,.2)`, display: "inline-block" }} />
              Masterclass offerte · accès immédiat
            </div>
            <h1 style={{ fontSize: "clamp(28px,4.2vw,48px)", lineHeight: 1.06, letterSpacing: "-.025em", fontWeight: 800, marginBottom: 18 }}>
              Sous-location &amp; conciergerie Airbnb :{" "}
              <span style={{ background: "linear-gradient(180deg,transparent 58%,rgba(95,216,122,.42) 58%)", padding: "0 4px" }}>
                la méthode que j'applique depuis 6 ans
              </span>
            </h1>
            <p style={{ fontSize: "clamp(15px,1.5vw,17px)", color: MUTED, marginBottom: 26, lineHeight: 1.6 }}>
              Sans crédit conventionnel · sans apport · halal-friendly · validée sur des dizaines de logements en France et à l'étranger.
            </p>
            <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 11 }}>
              {BULLETS.map((b) => (
                <li key={b} style={{ display: "flex", gap: 11, alignItems: "flex-start", fontSize: 15, color: "#2D2D2D", fontWeight: 500 }}>
                  <span style={{ flexShrink: 0, width: 22, height: 22, background: G, color: "#fff", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, marginTop: 1 }}>✓</span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Social proof mini */}
            <div style={{ display: "flex", gap: 20, marginTop: 28, padding: "18px 0", borderTop: "1px solid rgba(26,26,26,.08)" }}>
              {[{ n: "+6 ans", l: "d'expérience" }, { n: "Dizaines", l: "de logements" }, { n: "QUALIOPI", l: "certifié" }].map(({ n, l }) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: GD }}>{n}</div>
                  <div style={{ fontSize: 11, color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FORM CARD */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "36px 32px", boxShadow: "0 40px 80px rgba(26,107,51,.18)", border: "1px solid rgba(26,107,51,.07)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: `linear-gradient(90deg,${GD},${G})` }} />
            <div style={{ display: "inline-block", background: "rgba(45,184,75,.12)", color: GD, padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 14 }}>
              Accès offert · 0€
            </div>
            <h2 style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-.02em", marginBottom: 6, lineHeight: 1.2, color: INK }}>Reçois ta masterclass maintenant</h2>
            <p style={{ color: MUTED, fontSize: 14, marginBottom: 22 }}>Renseigne tes infos. Tu accèdes à la vidéo dans 10 secondes.</p>

            <form onSubmit={handleSubmit} noValidate>
              {[
                { name: "firstName", label: "Prénom", type: "text", placeholder: "Ton prénom", ac: "given-name" },
                { name: "email", label: "Email", type: "email", placeholder: "ton@email.com", ac: "email" },
              ].map(({ name, label, type, placeholder, ac }) => (
                <div key={name} style={{ marginBottom: 13 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#2D2D2D", marginBottom: 5 }}>{label}</label>
                  <input name={name} type={type} placeholder={placeholder} autoComplete={ac}
                    style={{ width: "100%", padding: "13px 15px", border: `1.5px solid ${errs[name] ? "#DC2626" : "rgba(26,26,26,.13)"}`, borderRadius: 12, fontFamily: "inherit", fontSize: 15, color: INK, background: CREAM, boxSizing: "border-box" as const }} />
                  {errs[name] && <p style={{ color: "#DC2626", fontSize: 11, marginTop: 3, fontWeight: 600 }}>{errs[name]}</p>}
                </div>
              ))}

              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#2D2D2D", marginBottom: 5 }}>
                  📱 WhatsApp <span style={{ color: MUTED, fontWeight: 400, fontSize: 11 }}>(je t'envoie la masterclass + bonus en privé)</span>
                </label>
                <input name="phone" type="tel" placeholder="+33 6 12 34 56 78" autoComplete="tel"
                  style={{ width: "100%", padding: "13px 15px", border: `1.5px solid ${errs.phone ? "#DC2626" : "rgba(26,26,26,.13)"}`, borderRadius: 12, fontFamily: "inherit", fontSize: 15, color: INK, background: CREAM, boxSizing: "border-box" as const }} />
                {errs.phone && <p style={{ color: "#DC2626", fontSize: 11, marginTop: 3, fontWeight: 600 }}>{errs.phone}</p>}
              </div>

              {errs.global && (
                <div style={{ background: "rgba(220,38,38,.07)", border: "1px solid rgba(220,38,38,.22)", borderRadius: 11, padding: "11px 15px", color: "#DC2626", fontSize: 13, marginBottom: 14 }}>{errs.global}</div>
              )}

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "19px 24px", background: `linear-gradient(135deg,${GD},${G})`, color: "#fff", border: 0, borderRadius: 13, fontFamily: "inherit", fontWeight: 800, fontSize: 17, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .7 : 1, boxShadow: "0 12px 28px rgba(45,184,75,.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {loading ? "⏳ Préparation de ton accès…" : "🎁 J'accède à la masterclass maintenant"}
              </button>

              <div style={{ display: "flex", gap: 12, marginTop: 14, justifyContent: "center", fontSize: 12, color: MUTED, flexWrap: "wrap" as const }}>
                {["0€ · gratuit", "Infos protégées", "Désinscription en 1 clic"].map((t) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span style={{ color: G, fontWeight: 900 }}>✓</span> {t}</span>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div style={{ background: "#fff", padding: "22px 24px", borderTop: "1px solid rgba(26,26,26,.06)", borderBottom: "1px solid rgba(26,26,26,.06)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexWrap: "wrap" as const, justifyContent: "center", gap: 32 }}>
          {[
            { n: "+6 ans", l: "d'expérience terrain" },
            { n: "Dizaines", l: "de logements gérés" },
            { n: "FR + 🌍", l: "France et étranger" },
            { n: "QUALIOPI", l: "organisme certifié" },
          ].map(({ n, l }) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: GD, letterSpacing: "-.02em" }}>{n}</div>
              <div style={{ fontSize: 11, color: MUTED, textTransform: "uppercase", letterSpacing: ".05em", fontWeight: 600, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section style={{ padding: "64px 24px", background: CREAM }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, letterSpacing: "-.025em", textAlign: "center", marginBottom: 10 }}>Ils sont passés à l'action</h2>
          <p style={{ textAlign: "center", color: MUTED, fontSize: 16, marginBottom: 44 }}>Témoignages réels de la communauté Rentimmo Academy</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 20 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ background: "#fff", borderRadius: 18, padding: "26px 22px", boxShadow: "0 8px 24px rgba(26,107,51,.08)" }}>
                <div style={{ color: G, marginBottom: 10, fontSize: 13 }}>★ ★ ★ ★ ★</div>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: "#2D2D2D", marginBottom: 18, fontWeight: 500 }}>"{t.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg,${GD},${G})`, color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{t.i}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: MUTED }}>{t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECOND CTA */}
      <section style={{ padding: "56px 24px", background: INK, textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ color: "#fff", fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, marginBottom: 12, letterSpacing: "-.02em" }}>Tu hésites encore ?<br />Inscris-toi, c'est gratuit.</h2>
          <p style={{ color: "rgba(255,255,255,.6)", marginBottom: 28, fontSize: 16 }}>
            0€ · aucun engagement · tu peux accéder à la masterclass maintenant et décider ensuite.
          </p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ padding: "18px 36px", background: "#fff", color: GD, border: 0, borderRadius: 13, fontFamily: "inherit", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 12px 32px rgba(0,0,0,.18)" }}>
            ↑ Accéder à la masterclass gratuite
          </button>
        </div>
      </section>

      <footer style={{ padding: "28px 24px", background: "#111", color: "rgba(255,255,255,.45)", textAlign: "center", fontSize: 13 }}>
        <strong style={{ color: "#fff" }}>Rentimmo Academy</strong> · Marwan AFASSI · Organisme certifié QUALIOPI · © 2026
      </footer>
    </div>
  );
}
