"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Highlight from "@/components/ui/Highlight";
import Underline from "@/components/ui/Underline";

type Props = {
  tag: string;
  title: React.ReactNode;
  /** Mot-clé ajouté à la fin du titre avec un surlignage vert (2-4 mots). */
  highlight?: React.ReactNode;
  /** Mot-clé ajouté à la fin du titre avec un soulignement tracé (1-2 mots). Ignoré si `highlight` est fourni. */
  underline?: React.ReactNode;
  subtitle?: React.ReactNode;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeader({
  tag,
  title,
  highlight,
  underline,
  subtitle,
  dark = false,
  align = "left",
  className,
}: Props) {
  const accent = highlight ? (
    <Highlight>{highlight}</Highlight>
  ) : underline ? (
    <Underline>{underline}</Underline>
  ) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className={cn("tag mb-5", dark ? "text-brand-light" : "text-brand-dark")}>{tag}</p>
      <h2
        className={cn(
          "isolate text-h2 font-extrabold leading-[1.05] tracking-[-0.02em]",
          dark ? "text-white" : "text-ink"
        )}
      >
        {title}
        {accent && (
          <>
            {" "}
            {accent}
          </>
        )}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed md:text-lg",
            dark ? "text-white/65" : "text-ink/65"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
