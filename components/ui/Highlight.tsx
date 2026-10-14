"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Highlighter-stroke effect (signature maxencetison.fr) : une bande de surlignage
 * se dessine derrière le texte au scroll, de gauche à droite.
 */
export default function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline whitespace-nowrap">
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: "0% 50%" }}
        className="absolute inset-x-0 bottom-[0.05em] top-[0.5em] -z-10 rounded-sm bg-brand-green/25"
      />
      <span className="relative">{children}</span>
    </span>
  );
}
