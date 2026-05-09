import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  LEXIQUE,
  LEXIQUE_BY_CATEGORY,
  CATEGORY_LABELS,
} from "@/lib/lexique";
import FinalCTA from "@/components/sections/FinalCTA";

const SITE = "https://rentimmo-academy.fr";
const URL = `${SITE}/lexique`;

export const metadata: Metadata = {
  title: "Lexique LCD : 50 termes de la location courte durée définis",
  description:
    "Glossaire complet de la location courte durée (LCD) : sous-location, conciergerie Airbnb, LMNP, micro-BIC, Loi Le Meur, channel manager, et 45+ autres termes définis clairement.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Lexique LCD : 50 termes de la location courte durée définis | Rentimmo Academy",
    description:
      "Glossaire complet : sous-location, conciergerie Airbnb, LMNP, micro-BIC, Loi Le Meur, channel manager, taxe de séjour, MRE, et 45+ autres termes définis.",
    url: URL,
    type: "article",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
    { "@type": "ListItem", position: 2, name: "Lexique", item: URL },
  ],
};

// DefinedTermSet schema — les LLMs adorent ce format pour les glossaires
const definedTermSetSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Lexique de la location courte durée (LCD)",
  description:
    "Glossaire de référence des termes de la location courte durée en France et au Maroc, maintenu par Rentimmo Academy.",
  url: URL,
  inLanguage: "fr-FR",
  publisher: { "@id": `${SITE}/#organization` },
  hasDefinedTerm: LEXIQUE.map((t) => ({
    "@type": "DefinedTerm",
    "@id": `${URL}/#${t.slug}`,
    name: t.term,
    description: t.full,
    termCode: t.slug,
    inDefinedTermSet: URL,
  })),
};

export default function LexiquePage() {
  const categories = Object.entries(LEXIQUE_BY_CATEGORY) as Array<
    [keyof typeof LEXIQUE_BY_CATEGORY, typeof LEXIQUE]
  >;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink pt-40 pb-16">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-brand-green/15 blur-3xl" />

        <div className="container-x relative">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-cream/60">
              <li>
                <Link href="/" className="hover:text-brand-light">
                  Accueil
                </Link>
              </li>
              <li className="text-cream/30">/</li>
              <li className="font-medium text-cream/90">Lexique</li>
            </ol>
          </nav>

          <span className="inline-block rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1 text-sm font-bold uppercase tracking-wider text-brand-light">
            Glossaire de référence
          </span>
          <h1 className="mt-6 text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
            Lexique de la location <br className="hidden md:block" />
            courte durée.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream/80 md:text-xl">
            {LEXIQUE.length} termes essentiels de la sous-location professionnelle, conciergerie Airbnb et cleaning BnB — définis clairement, sans jargon. France et Maroc.
          </p>

          {/* Categories anchors */}
          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map(([key]) => (
              <a
                key={key}
                href={`#${key}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cream hover:bg-white/10 transition"
              >
                {CATEGORY_LABELS[key]}
                <span className="text-cream/50">
                  ({LEXIQUE_BY_CATEGORY[key].length})
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Termes par catégorie */}
      <section className="bg-cream py-20">
        <div className="container-x space-y-16">
          {categories.map(([key, terms]) => (
            <section key={key} id={key} className="scroll-mt-32">
              <div className="mb-10 flex items-baseline justify-between border-b border-ink/10 pb-4">
                <h2 className="text-3xl font-extrabold text-ink md:text-4xl">
                  {CATEGORY_LABELS[key]}
                </h2>
                <span className="text-sm text-ink-muted">
                  {terms.length} termes
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {terms.map((t) => (
                  <article
                    key={t.slug}
                    id={t.slug}
                    className="scroll-mt-32 rounded-2xl bg-white p-6 ring-1 ring-ink/5 hover:ring-brand-green/30 transition"
                  >
                    <h3 className="text-xl font-extrabold text-ink">
                      {t.term}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-brand-dark">
                      {t.short}
                    </p>
                    <p className="mt-4 leading-relaxed text-ink-muted">
                      {t.full}
                    </p>
                    {t.related && t.related.length > 0 && (
                      <p className="mt-4 text-xs text-ink-muted">
                        Voir aussi :{" "}
                        {t.related.map((r, i) => {
                          const rt = LEXIQUE.find((x) => x.slug === r);
                          return (
                            <span key={r}>
                              {i > 0 && ", "}
                              <a
                                href={`#${r}`}
                                className="font-medium text-brand-dark hover:text-brand-green"
                              >
                                {rt?.term ?? r}
                              </a>
                            </span>
                          );
                        })}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* Cross-link to formations */}
      <section className="bg-ink py-20 text-cream">
        <div className="container-x text-center">
          <p className="tag mb-5 text-brand-green">Aller plus loin</p>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Tu veux passer de la théorie à la pratique ?
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-cream/75">
            Le lexique te donne les bases. Les formations te donnent la méthode terrain testée sur 150+ étudiants en France et au Maroc.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/formations"
              className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-4 font-bold text-white transition-transform hover:scale-[1.03]"
            >
              Voir les formations <ArrowRight size={16} />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 font-bold text-cream backdrop-blur transition-colors hover:bg-white/20"
            >
              Articles blog
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
