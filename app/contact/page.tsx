import type { Metadata } from "next";
import { Mail, MessageCircle, Instagram, Youtube, MapPin, CalendarClock } from "lucide-react";
import { SITE } from "@/lib/utils";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1Z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Contact — Parle-nous de ton projet LCD",
  description: "Contact Rentimmo Academy. Pose ta question, réserve un appel ou écris-nous directement.",
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-ink pt-40 pb-24">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        {/* Left — info */}
        <div>
          <p className="tag mb-5 text-brand-green">Contact</p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
            Parle-nous de ton projet.
          </h1>
          <p className="mt-6 text-lg text-white/70">
            Une question sur une formation ? Besoin d'un conseil sur ton premier logement ? Écris-nous, on
            répond sous 24h.
          </p>

          <div className="mt-12 space-y-5">
            <a
              href={SITE.calBooking}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border-2 border-brand-green/40 bg-brand-green/5 p-5 text-white transition-colors hover:border-brand-green hover:bg-brand-green/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green text-ink">
                <CalendarClock size={20} />
              </span>
              <span>
                <p className="text-[10px] uppercase tracking-widest text-brand-green">Recommandé</p>
                <p className="font-bold">Réserver un appel stratégique (30 min)</p>
              </span>
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1f1f1f] p-5 text-white transition-colors hover:border-brand-green"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                <Mail size={20} />
              </span>
              <span>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Email</p>
                <p className="font-bold">{SITE.email}</p>
              </span>
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1f1f1f] p-5 text-white transition-colors hover:border-brand-green"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                <MessageCircle size={20} />
              </span>
              <span>
                <p className="text-[10px] uppercase tracking-widest text-white/50">WhatsApp</p>
                <p className="font-bold">Chat instantané</p>
              </span>
            </a>
            <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1f1f1f] p-5 text-white">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                <MapPin size={20} />
              </span>
              <span>
                <p className="text-[10px] uppercase tracking-widest text-white/50">Couverture</p>
                <p className="font-bold">France · Maroc</p>
              </span>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <a
              href={SITE.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/75 transition-colors hover:border-brand-green hover:text-brand-green"
            >
              <Instagram size={16} />
            </a>
            <a
              href={SITE.socials.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/75 transition-colors hover:border-brand-green hover:text-brand-green"
            >
              <Youtube size={16} />
            </a>
            <a
              href={SITE.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/75 transition-colors hover:border-brand-green hover:text-brand-green"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>

        {/* Right — form */}
        <form
          action={`mailto:${SITE.email}`}
          method="post"
          encType="text/plain"
          className="rounded-3xl border border-white/10 bg-[#1f1f1f] p-8 md:p-10"
        >
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nom" name="name" required placeholder="Ton nom" />
              <Field label="Email" name="email" type="email" required placeholder="toi@email.com" />
            </div>
            <Field label="Téléphone" name="phone" type="tel" placeholder="+33…" />
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/70">
                Formation intéressée
              </label>
              <select
                name="formation"
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
                name="message"
                rows={6}
                placeholder="Parle-nous de ton projet et de tes objectifs…"
                className="w-full resize-none rounded-xl border border-white/10 bg-[#141414] px-4 py-3.5 text-sm text-white outline-none focus:border-brand-green"
              />
            </div>
            <button type="submit" className="btn-primary mt-2 justify-center">
              Envoyer ma demande
            </button>
            <p className="text-xs text-white/50">
              En envoyant ce formulaire, j'accepte la{" "}
              <a href="/politique-confidentialite" className="underline">
                politique de confidentialité
              </a>
              .
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-white/70">
        {label} {required && <span className="text-brand-green">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#141414] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-brand-green"
      />
    </div>
  );
}
