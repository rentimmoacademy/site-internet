import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import BlogGrid from "@/components/blog/BlogGrid";

export const metadata: Metadata = {
  title: "Blog — Ressources LCD, sous-location & conciergerie",
  description:
    "Guides terrain, études de cas et retours d'expérience sur la sous-location, la conciergerie Airbnb et le cleaning BnB, en France et au Maroc.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <section className="relative bg-ink pt-40 pb-24">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-x relative">
          <p className="tag mb-5 text-brand-green">Blog Rentimmo</p>
          <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white">
            Du contenu terrain.{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">Zéro blabla.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Guides, études de cas, retours d&apos;expérience. 100% applicable.
          </p>

          <div className="mt-12">
            <BlogGrid posts={posts} />
          </div>
        </div>
      </section>
    </>
  );
}
