import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowRight, Clock, Calendar, Youtube, Instagram, BookOpen, Scale, Wrench, Globe } from "lucide-react";
import { getAllPosts, getPost } from "@/lib/mdx";
import { SITE, cn } from "@/lib/utils";
import FinalCTA from "@/components/sections/FinalCTA";
import BlogIllustration from "@/components/blog/BlogIllustration";
import BlogCTA from "@/components/blog/BlogCTA";
import MasterclassPopup from "@/components/blog/MasterclassPopup";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  );
}

const categoryConfig: Record<string, { bg: string; label: string; icon: React.ElementType }> = {
  "sous-location": { bg: "bg-brand-green", label: "Sous-location", icon: BookOpen },
  conciergerie:    { bg: "bg-brand-dark",  label: "Conciergerie",  icon: Wrench },
  cleaning:        { bg: "bg-brand-light", label: "Cleaning",      icon: Wrench },
  maroc:           { bg: "bg-morocco",     label: "Maroc",         icon: Globe },
  outils:          { bg: "bg-info",        label: "Outils",        icon: Wrench },
  legal:           { bg: "bg-amber-600",   label: "Réglementation",icon: Scale },
};

const defaultCat = { bg: "bg-ink", label: "LCD", icon: BookOpen };

const ctaByCategory: Record<string, { headline: string; sub: string; cta: string; href: string }> = {
  "sous-location": {
    headline: "Tu lis ça mais tu n'as pas encore ton premier logement ?",
    sub: "Chaque semaine sans action, c'est 700 à 1 500 € de revenus qui ne rentrent pas. La formation Sous-Location Professionnelle te donne le système complet — de la prospection au premier virement.",
    cta: "Voir la formation sous-location",
    href: "/formations/sous-location-professionnelle",
  },
  conciergerie: {
    headline: "Tu veux gérer des logements sans les posséder ?",
    sub: "La conciergerie Airbnb te permet de toucher 15 à 30 % de commission sur chaque réservation — sans investissement immobilier. La formation te donne le modèle contractuel, les outils et l'acquisition client.",
    cta: "Voir la formation conciergerie",
    href: "/formations/conciergerie-airbnb",
  },
  cleaning: {
    headline: "La prestation ménage, c'est le service le plus demandé en LCD",
    sub: "Un cleaner professionnel tourne entre 1 500 et 3 500 €/mois avec 3-4 clients réguliers. La formation Cleaning BnB te donne les protocoles, les tarifs et comment trouver tes premiers clients.",
    cta: "Voir la formation cleaning",
    href: "/formations/cleaning-bnb",
  },
  outils: {
    headline: "Les outils seuls ne suffisent pas — il faut le bon système",
    sub: "Dans SuperBNB Academy, on configure pricing dynamique, messagerie automatisée, domotique et channel manager avec toi en 4 semaines. Résultat moyen : +38 % de revenus, 15 min/jour de gestion.",
    cta: "Voir SuperBNB Academy",
    href: "/super-bnb-academy",
  },
};

const defaultCTA = {
  headline: "Ce que tu lis ici, on le met en place avec toi.",
  sub: "Formations terrain sur la sous-location, la conciergerie et le cleaning Airbnb. Applicables dès le premier module. France et Maroc.",
  cta: "Voir les formations",
  href: "/formations",
};

function BlogFinalCTA({ category }: { category: string }) {
  const content = ctaByCategory[category] ?? defaultCTA;
  return (
    <section className="bg-ink py-16 border-t border-white/10">
      <div className="container-x">
        <div className="mx-auto max-w-3xl rounded-3xl bg-brand-green/10 border border-brand-green/25 p-8 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-green">
            Rentimmo Academy
          </p>
          <h2 className="mt-3 text-2xl font-extrabold text-white leading-snug">
            {content.headline}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/65">
            {content.sub}
          </p>
          <a
            href={content.href}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-3.5 text-sm font-bold text-ink transition-transform hover:scale-[1.03]"
          >
            {content.cta} <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
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
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://www.rentimmoacademy.fr/blog/${params.slug}`,
      images: [{ url: `https://www.rentimmoacademy.fr/og/blog/${params.slug}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`https://www.rentimmoacademy.fr/og/blog/${params.slug}`],
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const cat = categoryConfig[post.category] ?? defaultCat;
  const CatIcon = cat.icon;

  return (
    <>
      <article>
        {/* ─── Hero visuel catégorie ─── */}
        <div className={cn("relative overflow-hidden pt-32 pb-16 text-white", cat.bg)}>
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-20" />
          <div className="pointer-events-none absolute -top-32 right-0 h-[400px] w-[400px] rounded-full bg-white/10 blur-[100px]" />

          <div className="container-x relative">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white"
            >
              <ArrowLeft size={14} /> Retour au blog
            </Link>

            <div className="mt-8 max-w-3xl">
              {/* Catégorie + icône */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                  <CatIcon size={16} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/80">
                  {cat.label}
                </span>
              </div>

              {/* Titre */}
              <h1 className="text-[clamp(1.85rem,4.5vw,3.25rem)] font-extrabold leading-[1.1] tracking-[-0.025em]">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="mt-6 flex items-center gap-6 text-xs text-white/60">
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
            </div>
          </div>
        </div>

        {/* ─── Contenu ─── */}
        <div className="bg-cream pb-20">
          <div className="container-x">
            <div className="mx-auto max-w-3xl -translate-y-8 rounded-3xl bg-white shadow-xl ring-1 ring-ink/5 p-8 text-ink md:p-12">
              <div className="prose prose-lg prose-neutral mx-auto max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-3xl prose-a:text-brand-dark prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-ul:my-5 prose-li:my-1">
                <MDXRemote source={post.content} components={{ BlogIllustration, BlogCTA }} />
              </div>
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

      <BlogFinalCTA category={post.category} />
      <FinalCTA />

      {/* Popup masterclass — sous-location articles uniquement */}
      {post.category === "sous-location" && <MasterclassPopup />}

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
