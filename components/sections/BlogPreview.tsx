import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { getAllPosts } from "@/lib/mdx";
import BlogCard from "@/components/BlogCard";

export default async function BlogPreview() {
  const posts = (await getAllPosts()).slice(0, 3);

  return (
    <section className="relative bg-cream py-28 text-ink">
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            tag="Ressources"
            title={
              <>
                Du contenu terrain,{" "}
                <span className="bg-brand-gradient bg-clip-text text-transparent">chaque semaine.</span>
              </>
            }
            subtitle="Guides, études de cas, retours d'expérience. 100% applicable, zéro blabla."
          />
          <Link
            href="/blog"
            className="btn-ghost-dark shrink-0"
          >
            Voir tous les articles <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
