import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, Clock, Calendar, Youtube, Instagram } from "lucide-react";
import { getAllPosts, getPost } from "@/lib/mdx";
import { SITE } from "@/lib/utils";
import FinalCTA from "@/components/sections/FinalCTA";
import BlogIllustration from "@/components/blog/BlogIllustration";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

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
    alternates: { canonical: `https://www.rentimmoacademy.fr/blog/${params.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article", url: `https://www.rentimmoacademy.fr/blog/${params.slug}` },
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
              <MDXRemote source={post.content} components={{ BlogIllustration }} />
            </div>
          </div>
        </div>
      </article>

      {/* Social follow section */}
      <section className="bg-ink py-14 border-t border-white/10">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
              Rentimmo Academy
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-white">
              Contenus gratuits chaque semaine sur la LCD
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Sous-location, conciergerie, automatisation, réglementation : abonne-toi pour ne rien manquer.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={SITE.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                <Youtube size={16} className="text-red-400" />
                YouTube — @rentimmoacademy
              </a>
              <a
                href={SITE.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                <Instagram size={16} className="text-pink-400" />
                Instagram — @rentimmo_academy
              </a>
              <a
                href={SITE.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                <TikTokIcon size={16} />
                TikTok — @rentimmoacademy
              </a>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />

      {/* BlogPosting JSON-LD */}
      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentimmoacademy.fr" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.rentimmoacademy.fr/blog" },
              { "@type": "ListItem", position: 3, name: post.title, item: `https://www.rentimmoacademy.fr/blog/${post.slug}` },
            ],
          }),
        }}
      />
      {post.faq && post.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: post.faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `https://www.rentimmoacademy.fr/blog/${post.slug}`,
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            dateModified: post.date,
            inLanguage: "fr-FR",
            url: `https://www.rentimmoacademy.fr/blog/${post.slug}`,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://www.rentimmoacademy.fr/blog/${post.slug}`,
            },
            image: post.coverImage
              ? `https://www.rentimmoacademy.fr${post.coverImage}`
              : "https://www.rentimmoacademy.fr/og-image.jpg",
            articleSection: post.category,
            author: {
              "@type": "Person",
              "@id": "https://www.rentimmoacademy.fr/#marwan",
              name: "Marwan Afassi",
              url: "https://www.rentimmoacademy.fr/a-propos",
            },
            publisher: {
              "@type": "Organization",
              "@id": "https://www.rentimmoacademy.fr/#organization",
              name: "Rentimmo Academy",
              logo: {
                "@type": "ImageObject",
                url: "https://www.rentimmoacademy.fr/icon.svg",
              },
            },
          }),
        }}
      />
    </>
  );
}
