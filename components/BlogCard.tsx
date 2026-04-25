"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPostMeta } from "@/lib/mdx";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  "sous-location": "bg-brand-green text-ink",
  conciergerie: "bg-brand-dark text-white",
  cleaning: "bg-brand-light text-ink",
  "lcd-france": "bg-ink text-white",
  maroc: "bg-morocco text-white",
  outils: "bg-info text-white",
};

const categoryLabel: Record<string, string> = {
  "sous-location": "Sous-location",
  conciergerie: "Conciergerie",
  cleaning: "Cleaning",
  "lcd-france": "LCD France",
  maroc: "Maroc",
  outils: "Outils",
};

export default function BlogCard({ post, index = 0 }: { post: BlogPostMeta; index?: number }) {
  const color = categoryColors[post.category] ?? "bg-ink text-white";

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
      >
        {/* Cover */}
        <div className={cn("relative h-56 overflow-hidden p-6", color)}>
          <div className="dot-grid absolute inset-0 opacity-30" />
          <div className="relative flex h-full flex-col justify-between">
            <span className="inline-flex w-fit items-center rounded-full bg-black/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              {categoryLabel[post.category] ?? post.category}
            </span>
            <p className="line-clamp-3 text-2xl font-extrabold leading-tight tracking-tight">
              {post.title}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="line-clamp-3 text-sm leading-relaxed text-ink/70">{post.excerpt}</p>
          <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-4 text-xs text-ink/60">
            <span className="flex items-center gap-1.5">
              <Clock size={12} /> {post.readTime}
            </span>
            <span className="inline-flex items-center gap-1 font-bold text-ink transition-transform group-hover:translate-x-1">
              Lire <ArrowUpRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
