"use client";

import { useState } from "react";
import BlogCard from "@/components/BlogCard";
import type { BlogPostMeta } from "@/lib/mdx";

const categories = [
  { slug: "all", label: "Tout" },
  { slug: "sous-location", label: "Sous-location" },
  { slug: "conciergerie", label: "Conciergerie" },
  { slug: "cleaning", label: "Cleaning" },
  { slug: "scale", label: "Scaler & optimiser" },
  { slug: "legal", label: "Réglementation" },
  { slug: "maroc", label: "Maroc" },
];

export default function BlogGrid({ posts }: { posts: BlogPostMeta[] }) {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all"
      ? posts
      : posts.filter((p) => {
          // Normalize cleaning-bnb → cleaning
          const cat = p.category === "cleaning-bnb" ? "cleaning" : p.category;
          return cat === active;
        });

  return (
    <>
      {/* Filter bar */}
      <div className="mb-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={
              active === c.slug
                ? "rounded-full border border-ink bg-ink px-4 py-2 text-xs font-bold text-white shadow-[0_3px_0_#1A6B33] transition-colors"
                : "rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-bold text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
            }
          >
            {c.label}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-ink/55">
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <BlogCard key={p.slug} post={p} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-sm text-ink/55">
          Aucun article dans cette catégorie pour l&apos;instant.
        </p>
      )}
    </>
  );
}
