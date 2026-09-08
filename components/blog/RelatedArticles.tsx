import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPostMeta } from "@/lib/mdx";

const categoryLabel: Record<string, string> = {
  "sous-location": "Sous-location",
  conciergerie: "Conciergerie",
  cleaning: "Cleaning",
  "cleaning-bnb": "Cleaning",
  legal: "Réglementation",
  maroc: "Maroc",
  outils: "Outils",
  formation: "Formation",
  actualite: "Actualité",
};

export default function RelatedArticles({
  posts,
  currentSlug,
  category,
}: {
  posts: BlogPostMeta[];
  currentSlug: string;
  category: string;
}) {
  // Same category first, then fallback to any category
  const sameCategory = posts.filter(
    (p) => p.slug !== currentSlug && p.category === category
  );
  const others = posts.filter(
    (p) => p.slug !== currentSlug && p.category !== category
  );

  const related = [...sameCategory, ...others].slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="bg-cream py-16 border-t border-ink/10">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/40 mb-6">
            Articles connexes · {categoryLabel[category] ?? category}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-ink/40">
                  {categoryLabel[post.category] ?? post.category}
                </span>
                <p className="text-sm font-bold leading-snug text-ink line-clamp-3 group-hover:text-brand-dark transition-colors">
                  {post.title}
                </p>
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-ink/8 text-xs text-ink/50">
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {post.readTime}
                  </span>
                  <ArrowUpRight
                    size={12}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
