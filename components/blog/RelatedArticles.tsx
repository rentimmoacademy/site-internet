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
  scale: "Scaler & optimiser",
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
    <section className="bg-white py-16">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <p className="tag mb-6 text-brand-dark">
            Articles connexes · {categoryLabel[category] ?? category}
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-2 rounded-2xl border border-ink/10 bg-cream p-5 shadow-[0_6px_0_rgba(26,26,26,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_0_#2DB84B]"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-ink/55">
                  {categoryLabel[post.category] ?? post.category}
                </span>
                <p className="text-sm font-bold leading-snug text-ink line-clamp-3 group-hover:text-brand-dark transition-colors">
                  {post.title}
                </p>
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-ink/10 text-xs text-ink/55">
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
