"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export default function ContactBanner() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
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
        body: JSON.stringify({ ...form, phone: "", formation: "Je ne sais pas encore" }),
      });
      if (!res.ok) throw new Error("submit_failed");
      setSent(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-ink py-16 md:py-20">
      <div className="container-x">
        <div className="mx-auto max-w-3xl rounded-3xl bg-[#1f1f1f] border border-white/10 p-8 md:p-12">
          <p className="tag text-brand-green">Contact direct</p>
          <h2 className="mt-4 text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
            Une question sur ton projet ? Écris-nous.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
            Formation, reconversion, premier logement… dis-nous où tu en es, on te répond
            directement.
          </p>

          {sent ? (
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-brand-green/25 bg-brand-green/10 p-5">
              <CheckCircle2 size={24} className="shrink-0 text-brand-green" />
              <p className="text-sm text-white">Message envoyé ! On te répond sous 24h.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  required
                  placeholder="Ton prénom"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand-green"
                />
                <input
                  type="email"
                  required
                  placeholder="Ton email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand-green"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Dis-nous en quelques mots ton besoin…"
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                className="w-full resize-none rounded-xl border border-white/10 bg-[#141414] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand-green"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-gradient px-7 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Envoyer le message <ArrowRight size={15} />
                  </>
                )}
              </button>
              {error && (
                <p className="text-xs text-red-400">
                  Une erreur est survenue. Réessaie ou écris-nous directement par email.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
