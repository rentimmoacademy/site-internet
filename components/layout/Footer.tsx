import Link from "next/link";
import { Instagram, Youtube, Mail } from "lucide-react";
import Logo from "./Logo";
import { SITE } from "@/lib/utils";

const cols = [
  {
    title: "Formations",
    links: [
      { href: "/formations/sous-location", label: "Sous-Location Academy" },
      { href: "/formations/conciergerie-bnb", label: "Conciergerie BnB Academy" },
      { href: "/formations/cleaning-bnb", label: "Cleaning BnB Academy" },
      { href: "/formations", label: "Voir toutes les formations" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/a-propos", label: "À propos" },
      { href: "/contact", label: "Contact" },
      { href: SITE.calBooking, label: "Réserver un appel" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/cgv", label: "CGV" },
      { href: "/politique-confidentialite", label: "Politique de confidentialité" },
    ],
  },
];

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink">
      <div className="dot-grid absolute inset-0 opacity-40" />

      <div className="container-x relative pt-24 pb-10">
        {/* Top — big wordmark */}
        <div className="border-b border-white/10 pb-12">
          <p className="tag mb-6 text-brand-green">L'académie LCD</p>
          <h2 className="max-w-3xl text-h2 font-extrabold leading-[1.05] tracking-tight text-white">
            Forme-toi aux métiers de la location courte durée.{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">France & Maroc.</span>
          </h2>
        </div>

        {/* Columns */}
        <div className="grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm text-white/60">
              L'académie qui forme les pros de la LCD. Sans banque, sans crédit, sans apport.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={SITE.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-brand-green hover:text-brand-green"
              >
                <Instagram size={16} />
              </a>
              <a
                href={SITE.socials.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-brand-green hover:text-brand-green"
              >
                <Youtube size={16} />
              </a>
              <a
                href={SITE.socials.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-brand-green hover:text-brand-green"
              >
                <TikTokIcon />
              </a>
              <a
                href={`mailto:${SITE.email}`}
                aria-label="Email"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-brand-green hover:text-brand-green"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="tag mb-4 text-white/40">{col.title}</p>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/75 transition-colors hover:text-brand-green"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Rentimmo Academy — Tous droits réservés</p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-green" />
            Organisme de formation — Qualiopi en cours de référencement
          </p>
        </div>
      </div>
    </footer>
  );
}
