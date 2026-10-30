import type { Metadata } from "next";
import { Mail, Instagram, Youtube, MapPin, CalendarClock } from "lucide-react";
import { SITE } from "@/lib/utils";
import CallGate from "@/components/CallGate";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/ui/Reveal";
import Underline from "@/components/ui/Underline";
import Highlight from "@/components/ui/Highlight";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1Z" />
    </svg>
  );
}

export const metadata: Metadata = {
  alternates: { canonical: "https://www.rentimmoacademy.fr/contact" },
  title: "Contact — Parle-nous de ton projet LCD",
  description: "Contact Rentimmo Academy. Pose ta question, réserve un appel ou écris-nous directement.",
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-40 pb-24">
      <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        {/* Left — info */}
        <div>
          <p className="tag mb-5 text-brand-dark">Contact</p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink">
            Parle-nous de ton <Underline>projet</Underline>.
          </h1>
          <p className="mt-6 text-lg text-ink/70">
            Une question sur une formation ? Besoin d'un conseil sur ton premier logement ?{" "}
            <Highlight>Écris-nous, on répond sous 24h.</Highlight>
          </p>

          <div className="mt-12 space-y-5">
            <CallGate
              href={`${SITE.calBooking}?overlayCalendar=true`}
              className="flex items-center gap-4 rounded-3xl bg-ink p-6 text-white shadow-[0_8px_0_#1A6B33] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_0_#2DB84B]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green text-ink">
                <CalendarClock size={20} />
              </span>
              <span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-light">Recommandé</p>
                <p className="text-lg font-bold">Réserver un appel stratégique</p>
                <p className="text-sm text-white/65">Offert, avec notre équipe</p>
              </span>
            </CallGate>
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_6px_0_rgba(26,26,26,0.06)] text-ink transition-all duration-500 hover:-translate-y-1 hover:border-brand-green"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-dark">
                <Mail size={20} />
              </span>
              <span>
                <p className="text-[10px] uppercase tracking-widest text-ink/55">Email</p>
                <p className="font-bold">{SITE.email}</p>
              </span>
            </a>
            <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_6px_0_rgba(26,26,26,0.06)] text-ink">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-dark">
                <MapPin size={20} />
              </span>
              <span>
                <p className="text-[10px] uppercase tracking-widest text-ink/55">Couverture</p>
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-ink/70 transition-colors hover:border-brand-green hover:text-brand-dark"
            >
              <Instagram size={16} />
            </a>
            <a
              href={SITE.socials.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-ink/70 transition-colors hover:border-brand-green hover:text-brand-dark"
            >
              <Youtube size={16} />
            </a>
            <a
              href={SITE.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 text-ink/70 transition-colors hover:border-brand-green hover:text-brand-dark"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>

        {/* Right — form */}
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
