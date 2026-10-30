"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Tag = "div" | "li" | "article" | "section";

/**
 * Apparition au scroll (fade + montée de 24px), utilisable depuis un Server Component.
 * `index` décale l'entrée des cartes d'une grille (i * 0.06 s).
 * prefers-reduced-motion est géré par le MotionConfig global.
 */
export default function Reveal({
  children,
  index = 0,
  delay,
  y = 24,
  as = "div",
  className,
}: {
  children: ReactNode;
  index?: number;
  delay?: number;
  y?: number;
  as?: Tag;
  className?: string;
}) {
  const M = motion[as];
  return (
    <M
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: delay ?? index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </M>
  );
}
