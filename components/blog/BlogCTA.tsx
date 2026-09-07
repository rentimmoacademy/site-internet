"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BlogCTAProps {
  title: string;
  description: string;
  href: string;
  cta: string;
  variant?: "green" | "dark" | "gold";
}

const variants = {
  green: {
    wrapper: "bg-brand-green/10 border-brand-green/30",
    title:   "text-brand-dark",
    desc:    "text-ink/70",
    btn:     "bg-brand-green text-ink hover:bg-brand-light",
  },
  dark: {
    wrapper: "bg-ink/5 border-ink/15",
    title:   "text-ink",
    desc:    "text-ink/70",
    btn:     "bg-ink text-white hover:bg-ink/85",
  },
  gold: {
    wrapper: "bg-amber-50 border-amber-200",
    title:   "text-amber-900",
    desc:    "text-amber-800/80",
    btn:     "bg-amber-500 text-white hover:bg-amber-600",
  },
};

export default function BlogCTA({
  title,
  description,
  href,
  cta,
  variant = "green",
}: BlogCTAProps) {
  const v = variants[variant];
  return (
    <div className={`not-prose my-10 rounded-2xl border p-6 md:p-8 ${v.wrapper}`}>
      <p className={`text-lg font-extrabold leading-snug ${v.title}`}>{title}</p>
      <p className={`mt-2 text-sm leading-relaxed ${v.desc}`}>{description}</p>
      <Link
        href={href}
        className={`mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-colors ${v.btn}`}
      >
        {cta} <ArrowRight size={14} />
      </Link>
    </div>
  );
}
