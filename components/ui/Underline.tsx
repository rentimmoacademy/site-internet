"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Soulignement tracé à la main (signature maxencetison.fr, en duo avec <Highlight>) :
 * un trait vert se dessine sous le mot quand il entre à l'écran.
 */
export default function Underline({
  children,
  color = "green",
}: {
  children: ReactNode;
  /** "lime" = variante Super BNB Academy (trait lime, à utiliser sur fond noir). */
  color?: "green" | "lime";
}) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 200 12"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.32em] w-full overflow-visible ${color === "lime" ? "text-lime" : "text-brand-green"}`}
      >
        <motion.path
          d="M2 8 C 40 3, 90 3, 120 6 S 180 10, 198 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-40px 0px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
    </span>
  );
}
