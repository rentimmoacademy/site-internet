"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/formations", label: "Formations" },
  { href: "/super-bnb-academy", label: "Super BNB", badge: "Programme" },
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
  // Super BNB Academy : pages noires (lime + noir) → menu clair sur fond sombre.
  const pathname = usePathname() ?? "";
  const sba = pathname.startsWith("/super-bnb-academy");
  const linkCls = sba
    ? "text-white/80 hover:text-lime"
    : "text-ink/70 hover:text-ink";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setGuidesOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? sba
              ? "bg-ink/85 backdrop-blur-xl border-b border-white/10"
              : "bg-cream/85 backdrop-blur-xl border-b border-ink/5"
            : "bg-transparent"
        )}
      >
        <div className="container-x flex h-20 items-center justify-between">
          <Logo dark={!sba} />

          <nav className="hidden items-center gap-7 md:flex">
            <div
              className="relative"
              onMouseEnter={() => setGuidesOpen(true)}
              onMouseLeave={() => setGuidesOpen(false)}
            >
              <button className={cn("inline-flex items-center gap-1.5 text-sm font-semibold transition-colors", linkCls)}>
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
                    <div className="w-72 rounded-2xl border border-ink/10 bg-white p-2 shadow-xl">
                      {guides.map((g) => (
                        <Link
                          key={g.href}
                          href={g.href}
                          className="block rounded-xl px-4 py-3 text-sm font-semibold text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
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
                className={cn("group inline-flex items-center gap-1.5 text-sm font-semibold transition-colors", linkCls)}
              >
                {l.label}
                {l.badge && (
                  <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest", sba ? "bg-lime text-ink" : "bg-auto-mint text-auto-navy")}>
                    {l.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              href="/formations"
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-transform hover:scale-[1.03]",
                sba ? "border border-white/25 text-white hover:border-lime" : "bg-brand-gradient text-white"
              )}
            >
              Voir les formations
              <ArrowRight size={14} />
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            aria-label="Menu"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border md:hidden",
              sba ? "border-white/20 text-white" : "border-ink/10"
            )}
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
            className={cn("fixed inset-0 z-[60] md:hidden", sba ? "bg-ink text-white" : "bg-cream")}
          >
            <div className="container-x flex h-20 items-center justify-between">
              <Logo dark={!sba} />
              <button
                onClick={() => setOpen(false)}
                aria-label="Fermer"
                className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full border", sba ? "border-white/20" : "border-ink/10")}
              >
                <X size={18} />
              </button>
            </div>
            <nav className="container-x mt-10 flex flex-col gap-4">
              <div className={cn("border-b py-5", sba ? "border-white/10" : "border-ink/10")}>
                <span className={cn("text-xs font-bold uppercase tracking-widest", sba ? "text-white/50" : "text-ink/40")}>Guides</span>
                <div className="mt-3 flex flex-col gap-3">
                  {guides.map((g) => (
                    <Link
                      key={g.href}
                      href={g.href}
                      onClick={() => setOpen(false)}
                      className={cn("text-lg font-bold tracking-tight", sba ? "text-white/90" : "text-ink/90")}
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
                  className={cn("flex items-center justify-between border-b py-5 text-3xl font-extrabold tracking-tight", sba ? "border-white/10" : "border-ink/10")}
                >
                  <span>{l.label}</span>
                  {l.badge && (
                    <span className={cn("rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest", sba ? "bg-lime text-ink" : "bg-auto-mint text-auto-navy")}>
                      {l.badge}
                    </span>
                  )}
                </Link>
              ))}
              <Link
                href="/formations"
                onClick={() => setOpen(false)}
                className={cn(
                  "mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 font-bold",
                  sba ? "bg-lime text-ink" : "bg-brand-gradient text-white"
                )}
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
