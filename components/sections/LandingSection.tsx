"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  kicker?: string;
  title: ReactNode;
  intro?: string;
  /** cream = quadrillage du body (pas de fond) · white = bande blanche · ink = bande noire pleine largeur */
  bg?: "cream" | "white" | "ink";
  children: ReactNode;
};

export default function LandingSection({ kicker, title, intro, bg = "cream", children }: Props) {
  const dark = bg === "ink";
  const bgCls = dark
    ? "bg-ink text-white"
    : bg === "white"
    ? "border-y border-ink/10 bg-white text-ink"
    : "text-ink";

  return (
    <section className={`${bgCls} relative overflow-hidden py-20 md:py-28`}>
      {dark && (
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-brand-green/15 blur-[120px]" />
      )}
      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 max-w-3xl"
        >
          {kicker && (
            <span
              className={`text-sm font-bold uppercase tracking-wider ${
                dark ? "text-brand-light" : "text-brand-dark"
              }`}
            >
              {kicker}
            </span>
          )}
          <h2 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
            {title}
          </h2>
          {intro && <p className={`mt-4 text-lg ${dark ? "text-white/65" : "text-ink-muted"}`}>{intro}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
