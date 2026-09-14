"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/formations", label: "Formations" },
  { href: "/super-bnb-academy", label: "SuperBNB", badge: "Programme" },
  { href: "/blog", label: "Blog" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

const guides = [
  { href: "/sous-location-professionnelle", label: "Sous-location professionnelle" },
  { href: "/devenir-conciergerie-airbnb", label: "Devenir conciergerie Airbnb" },
  { href: "/menage-airbnb-professionnel", label: "Ménage Airbnb professionnel" },
  { href: "/se-former-airbnb-maroc", label: "Se former à Airbnb au Maroc" },
  { href: "/questions-frequentes", label: "Questions fréquentes" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "bg-ink/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
        )}
      >
        <div className="container-x flex h-20 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-7 md:flex">
            <div
              className="relative"
              onMouseEnter={() => setGuidesOpen(true)}
              onMouseLeave={() => setGuidesOpen(false)}
            >
              <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white">
                Guides
              </button>
              <AnimatePresence>
                {guidesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-3"
                  >
                    <div className="w-72 rounded-2xl border border-white/10 bg-ink p-2 shadow-xl">
                      {guides.map((g) => (
                        <Link
                          key={g.href}
                          href={g.href}
                          className="block rounded-xl px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          {g.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors hover:text-white"
              >
                {l.label}
                {l.badge && (
                  <span className="rounded-full bg-auto-mint px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-auto-navy">
                    {l.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/formations"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.03]"
            >
              Voir les formations
              <ArrowRight size={14} />
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            aria-label="Menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 md:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-ink md:hidden"
          >
            <div className="container-x flex h-20 items-center justify-between">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="container-x mt-10 flex flex-col gap-4">
              <div className="border-b border-white/10 py-5">
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Guides</span>
                <div className="mt-3 flex flex-col gap-3">
                  {guides.map((g) => (
                    <Link
                      key={g.href}
                      href={g.href}
                      onClick={() => setOpen(false)}
                      className="text-lg font-bold tracking-tight text-white/90"
                    >
                      {g.label}
                    </Link>
                  ))}
                </div>
              </div>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between border-b border-white/10 py-5 text-3xl font-extrabold tracking-tight"
                >
                  <span>{l.label}</span>
                  {l.badge && (
                    <span className="rounded-full bg-auto-mint px-2 py-1 text-[10px] font-black uppercase tracking-widest text-auto-navy">
                      {l.badge}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href="/formations"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-4 font-bold text-white"
              >
                Voir les formations <ArrowRight size={16} />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
