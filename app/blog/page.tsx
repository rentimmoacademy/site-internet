import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Blog — Ressources LCD, sous-location & conciergerie",
  description:
    "Guides terrain, études de cas et retours d'expérience sur la sous-location, la conciergerie Airbnb et le cleaning BnB, en France et au Maroc.",
};

const categories = [
  { slug: "all", label: "Tout" },
  { slug: "sous-location", label: "Sous-location" },
  { slug: "conciergerie", label: "Conciergerie" },
  { slug: "cleaning", label: "Cleaning" },
  { slug: "maroc", label: "Maroc" },
  { slug: "outils", label: "Outils" },
];

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <section className="relative bg-ink pt-40 pb-20">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-x relative">
          <p className="tag mb-5 text-brand-green">Blog Rentimmo</p>
          <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
            Du contenu terrain.{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">Zéro blabla.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Guides, études de cas, retours d'expérience. 100% applicable.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.slug}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-white/75 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 text-ink">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <BlogCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
