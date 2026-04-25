"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Key, Briefcase, Sparkles, Clock, Layers } from "lucide-react";
import type { Formation } from "@/lib/formations";
import { cn } from "@/lib/utils";

const iconMap = {
  key: Key,
  briefcase: Briefcase,
  sparkle: Sparkles,
};

export default function FormationCard({ formation, index = 0 }: { formation: Formation; index?: number }) {
  const Icon = iconMap[formation.accentIcon];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group card-dark flex flex-col"
    >
      {/* Top line: icon + badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green ring-1 ring-brand-green/20">
          <Icon size={24} strokeWidth={2.2} />
        </div>
        <div className="flex flex-col items-end gap-2">
          {formation.badge && (
            <span className="rounded-full bg-brand-green px-3 py-1 text-[10px] font-black uppercase tracking-widest text-ink">
              {formation.badge}
            </span>
          )}
          <span className="morocco-badge">
            <span>🇲🇦</span> Bonus Maroc
          </span>
        </div>
      </div>

      <h3 className="mt-8 text-2xl font-extrabold leading-tight tracking-tight text-white">
        {formation.name}
      </h3>
      <p className="mt-2 text-base font-semibold text-brand-green">{formation.tagline}</p>
      <p className="mt-4 text-sm leading-relaxed text-white/65">{formation.description}</p>

      {/* Key points */}
      <ul className="mt-6 space-y-3">
        {formation.keyPoints.slice(0, 3).map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-white/80">
            <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-green" />
            {p}
          </li>
        ))}
      </ul>

      {/* Meta */}
      <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-5 text-xs text-white/60">
        <span className="flex items-center gap-1.5">
          <Clock size={13} /> {formation.duration}
        </span>
        <span className="h-3 w-px bg-white/15" />
        <span className="flex items-center gap-1.5">
          <Layers size={13} /> {formation.modules} modules
        </span>
      </div>

      {/* Price + CTA */}
      <div className="mt-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40">À partir de</p>
          <p className="text-2xl font-extrabold tracking-tight text-white">
            {formation.price}
            <span className="text-brand-green">*</span>
          </p>
        </div>
        <Link
          href={`/formations/${formation.slug}`}
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition-all",
            "hover:bg-brand-green hover:text-white hover:gap-3"
          )}
        >
          Découvrir <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
}
