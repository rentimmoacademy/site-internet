"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type Props = {
  kicker: string;
  h1: string;
  intro: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  /** breadcrumb pour SEO (visible UI) */
  breadcrumb?: { label: string; href?: string }[];
};

export default function LandingHero({
  kicker,
  h1,
  intro,
  primaryCta,
  secondaryCta,
  breadcrumb,
}: Props) {
  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-20 text-cream md:pt-40 md:pb-28">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-brand-green/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-brand-light/15 blur-3xl" />

      <div className="container-x relative">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-cream/60">
              {breadcrumb.map((b, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-cream/30">/</span>}
                  {b.href ? (
                    <Link href={b.href} className="hover:text-brand-light">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-cream/90">{b.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <span className="inline-block rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1 text-sm font-bold uppercase tracking-wider text-brand-light">
            {kicker}
          </span>
          <h1 className="mt-6 text-[clamp(2.25rem,5.5vw,4.75rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white">
            {h1}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream/80 md:text-xl">{intro}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-4 font-bold text-white transition-transform hover:scale-[1.03] hover:bg-brand-light"
            >
              {primaryCta.label} <ArrowRight size={16} />
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 font-bold text-cream backdrop-blur transition-colors hover:bg-white/10"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
