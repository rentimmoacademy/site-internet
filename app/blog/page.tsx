import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import BlogGrid from "@/components/blog/BlogGrid";
import Highlight from "@/components/ui/Highlight";
import FinalCTA from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.rentimmoacademy.fr/blog" },
  title: "Blog — Ressources LCD, sous-location & conciergerie",
  description:
    "Guides terrain, études de cas et retours d'expérience sur la sous-location, la conciergerie Airbnb et le cleaning BNB, en France et au Maroc.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <section className="relative pt-40 pb-16">
        <div className="container-x relative">
          <p className="tag mb-5 text-brand-dark">Blog Rentimmo Academy</p>
          <h1 className="max-w-4xl text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink">
            Du contenu terrain.{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">Zéro blabla.</span>
          </h1>
          <p className="isolate mt-6 max-w-2xl text-lg text-ink/70">
            Guides, études de cas, retours d&apos;expérience.{" "}
            <Highlight>100% applicable.</Highlight>
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-x">
          <BlogGrid posts={posts} />
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
