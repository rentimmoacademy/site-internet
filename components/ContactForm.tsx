"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/gtag";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    formation: "Sous-Location Academy",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("submit_failed");
      trackEvent("contact_form_submit", { formation: form.formation });
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#1f1f1f] p-8 py-16 text-center md:p-10">
        <CheckCircle2 size={40} className="mb-4 text-brand-green" />
        <p className="text-xl font-extrabold text-white">Message envoyé !</p>
        <p className="mt-2 text-white/70">On te répond sous 24h.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-white/10 bg-[#1f1f1f] p-8 md:p-10"
    >
      <div className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Nom"
            required
            placeholder="Ton nom"
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
          />
          <Field
            label="Email"
            type="email"
            required
            placeholder="toi@email.com"
            value={form.email}
            onChange={(v) => setForm((p) => ({ ...p, email: v }))}
          />
        </div>
        <Field
          label="Téléphone"
          type="tel"
          placeholder="+33…"
          value={form.phone}
          onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
        />
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/70">
            Formation intéressée
          </label>
          <select
            value={form.formation}
            onChange={(e) => setForm((p) => ({ ...p, formation: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3.5 text-sm text-white outline-none focus:border-brand-green"
          >
            <option>Sous-Location Academy</option>
            <option>Conciergerie BnB Academy</option>
            <option>Cleaning BnB Academy</option>
            <option>Je ne sais pas encore</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/70">
            Message
          </label>
          <textarea
            rows={6}
            placeholder="Parle-nous de ton projet et de tes objectifs…"
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            className="w-full resize-none rounded-xl border border-white/10 bg-[#141414] px-4 py-3.5 text-sm text-white outline-none focus:border-brand-green"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-2 justify-center disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Envoyer ma demande"}
        </button>
        {error && (
          <p className="text-xs text-red-400">
            Une erreur est survenue. Réessaie ou écris-nous directement par email.
          </p>
        )}
        <p className="text-xs text-white/50">
          En envoyant ce formulaire, j'accepte la{" "}
          <a href="/politique-confidentialite" className="underline">
            politique de confidentialité
          </a>
          .
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  type = "text",
  required,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/70">
        {label} {required && <span className="text-brand-green">*</span>}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand-green"
      />
    </div>
  );
}
