"use client";

import { useEffect, useRef, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/gtag";

/**
 * Point d'entrée rapide depuis la page Super BNB Academy.
 * Un seul tunnel : on récupère le lien puis on envoie vers /super-bnb-academy/audit/?url=…
 * (opt-in, audit, diagnostic et réservation se passent là-bas).
 */
export default function SuperBnbAuditModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  const go = () => {
    const u = url.trim();
    if (!u) return;
    if (!/airbnb\.|abnb\.me/i.test(u)) { setErr("L'audit fonctionne avec une annonce Airbnb : colle le lien de ton annonce Airbnb (ex. airbnb.fr/rooms/12345678)."); return; }
    trackEvent("audit_modal_submit");
    window.location.href = `/super-bnb-academy/audit/?url=${encodeURIComponent(u)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-ink/60 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="sb-modal-title">
      <div className="relative w-full sm:max-w-lg bg-white border border-ink/10 sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-[0_10px_0_-2px_#5E8A0A] p-6 pt-5" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <button onClick={onClose} aria-label="Fermer" className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-ink/60 hover:text-ink"><X size={16} /></button>
        </div>
        <div className="inline-flex items-center gap-2 bg-lime rounded-full px-3 py-1.5 mb-4">
          <Sparkles size={12} className="text-ink" />
          <span className="text-[10px] font-bold text-ink uppercase tracking-widest">Audit gratuit</span>
        </div>
        <h2 id="sb-modal-title" className="text-2xl font-extrabold text-ink tracking-tight mb-2">Colle le lien de ton annonce</h2>
        <p className="text-ink/65 text-sm mb-5">Ton annonce Airbnb notée sur 6 critères, comparée à ta ville, puis le diagnostic de ton activité.</p>
        <form onSubmit={(e) => { e.preventDefault(); go(); }} className="flex flex-col gap-2">
          <input ref={inputRef} type="url" inputMode="url" value={url} onChange={(e) => { setUrl(e.target.value); setErr(""); }}
            placeholder="airbnb.fr/rooms/12345678" aria-label="Lien de ton annonce"
            className="w-full bg-cream border border-ink/15 rounded-xl px-4 py-3 text-base text-ink placeholder-ink/35 focus:outline-none focus:border-lime-deep/60" />
          {err && <p className="text-red-600 text-xs" role="alert">{err}</p>}
          <button type="submit" disabled={!url.trim()} className="w-full rounded-xl bg-ink px-6 py-3.5 font-bold text-white disabled:opacity-40">
            Auditer mon annonce →
          </button>
        </form>
        <p className="text-ink/55 text-xs text-center mt-3">Gratuit · Sans engagement</p>
      </div>
    </div>
  );
}
