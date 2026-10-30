"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPostMeta } from "@/lib/mdx";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  "sous-location": "bg-brand-green text-ink",
  conciergerie: "bg-brand-dark text-white",
  cleaning: "bg-brand-light text-ink",
  "cleaning-bnb": "bg-brand-light text-ink",
  "lcd-france": "bg-ink text-white",
  maroc: "bg-morocco text-white",
  outils: "bg-info text-white",
  legal: "bg-amber-600 text-white",
  formation: "bg-brand-dark text-white",
  actualite: "bg-info text-white",
};

const categoryLabel: Record<string, string> = {
  "sous-location": "Sous-location",
  conciergerie: "Conciergerie",
  cleaning: "Cleaning",
  "cleaning-bnb": "Cleaning",
  "lcd-france": "LCD France",
  maroc: "Maroc",
  outils: "Outils",
  legal: "Réglementation",
  formation: "Formation",
  actualite: "Actualité",
};

export default function BlogCard({ post, index = 0 }: { post: BlogPostMeta; index?: number }) {
  const color = categoryColors[post.category] ?? "bg-ink text-white";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: Math.min(index, 8) * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_6px_0_rgba(26,26,26,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_0_#2DB84B]"
      >
        {/* Cover */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={post.coverImage || `/og/blog/${post.slug}`}
            alt={post.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className={cn(
              "absolute left-4 top-4 inline-flex w-fit items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
              color
            )}
          >
            {categoryLabel[post.category] ?? post.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="line-clamp-3 text-sm leading-relaxed text-ink/70">{post.excerpt}</p>
          <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 text-xs text-ink/60">
            <span className="flex items-center gap-1.5">
              <Clock size={12} /> {post.readTime}
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-ink transition-all group-hover:gap-2 group-hover:text-brand-dark">
              Lire <ArrowUpRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
