"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import Highlight from "@/components/ui/Highlight";

type Props = {
  kicker: string;
  h1: ReactNode;
  intro: string;
  /** fragment exact de `intro` à surligner (phrase-promesse) */
  introHighlight?: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  /** breadcrumb pour SEO (visible UI) */
  breadcrumb?: { label: string; href?: string }[];
};

export default function LandingHero({
  kicker,
  h1,
  intro,
  introHighlight,
  primaryCta,
  secondaryCta,
  breadcrumb,
}: Props) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 text-ink md:pt-40 md:pb-28">
            <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-brand-green/[0.12] blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-brand-light/10 blur-3xl" />

      <div className="container-x relative">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-ink/55">
              {breadcrumb.map((b, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-ink/30">/</span>}
                  {b.href ? (
                    <Link href={b.href} className="hover:text-brand-dark">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-ink/80">{b.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="max-w-4xl">
          <span className="inline-block rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1 text-sm font-bold uppercase tracking-wider text-brand-dark">
            {kicker}
          </span>
          <h1 className="mt-6 text-[clamp(2.25rem,5.5vw,4.75rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink">
            {h1}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/70 md:text-xl">{renderIntro(intro, introHighlight)}</p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-bold text-white shadow-[0_6px_0_#1A6B33] transition-all duration-300 hover:-translate-y-0.5 hover:gap-3 hover:shadow-[0_8px_0_#2DB84B]"
            >
              {primaryCta.label} <ArrowRight size={16} />
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-7 py-4 font-bold text-ink transition-all hover:gap-3 hover:border-ink"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function renderIntro(intro: string, hl?: string) {
  if (!hl) return intro;
  const i = intro.indexOf(hl);
  if (i < 0) return intro;
  return (
    <>
      {intro.slice(0, i)}
      <Highlight>{hl}</Highlight>
      {intro.slice(i + hl.length)}
    </>
  );
}
