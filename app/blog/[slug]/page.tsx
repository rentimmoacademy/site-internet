import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getAllPosts, getPost } from "@/lib/mdx";
import FinalCTA from "@/components/sections/FinalCTA";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <article className="bg-ink pt-32 pb-20">
        <div className="container-x">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
          >
            <ArrowLeft size={14} /> Retour au blog
          </Link>

          <header className="mx-auto mt-10 max-w-3xl text-center">
            <span className="inline-block rounded-full bg-brand-green/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-green">
              {post.category}
            </span>
            <h1 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-white">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />{" "}
                {new Date(post.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> {post.readTime}
              </span>
            </div>
          </header>
        </div>

        <div className="container-x mt-16">
          <div className="mx-auto max-w-3xl rounded-3xl bg-cream p-8 text-ink md:p-12">
            <div className="prose prose-lg prose-neutral mx-auto max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-3xl prose-a:text-brand-dark prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-ul:my-5 prose-li:my-1">
              <MDXRemote source={post.content} />
            </div>
          </div>
        </div>
      </article>

      <FinalCTA />

      {/* BlogPosting JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { "@type": "Person", name: "Marwan Afassi" },
            publisher: { "@type": "Organization", name: "Rentimmo Academy" },
          }),
        }}
      />
    </>
  );
}
