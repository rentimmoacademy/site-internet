import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  LEXIQUE,
  LEXIQUE_BY_CATEGORY,
  CATEGORY_LABELS,
} from "@/lib/lexique";
import FinalCTA from "@/components/sections/FinalCTA";
import Reveal from "@/components/ui/Reveal";
import Highlight from "@/components/ui/Highlight";
import Underline from "@/components/ui/Underline";

const SITE = "https://www.rentimmoacademy.fr";
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
      <section className="relative overflow-hidden pt-40 pb-16">
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-brand-green/[0.12] blur-3xl" />

        <div className="container-x relative">
          <nav aria-label="Fil d'Ariane" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-ink/55">
              <li>
                <Link href="/" className="hover:text-brand-dark">
                  Accueil
                </Link>
              </li>
              <li className="text-ink/40">/</li>
              <li className="font-medium text-ink/80">Lexique</li>
            </ol>
          </nav>

          <span className="inline-block rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1 text-sm font-bold uppercase tracking-wider text-brand-dark">
            Glossaire de référence
          </span>
          <h1 className="mt-6 text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            Lexique de la location <br className="hidden md:block" />
            <span className="text-brand-dark">courte durée.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink/70 md:text-xl">
            {LEXIQUE.length} termes essentiels de la sous-location professionnelle, conciergerie Airbnb et cleaning BNB —{" "}
            <Highlight>définis clairement, sans jargon.</Highlight> France et Maroc.
          </p>

          {/* Categories anchors */}
          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map(([key]) => (
              <a
                key={key}
                href={`#${key}`}
                className="group inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm text-ink transition-all hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-white"
              >
                {CATEGORY_LABELS[key]}
                <span className="text-ink/55 group-hover:text-white/65">
                  ({LEXIQUE_BY_CATEGORY[key].length})
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Termes par catégorie */}
      <section className="border-y border-ink/10 bg-white py-20">
        <div className="container-x space-y-16">
          {categories.map(([key, terms], ci) => (
            <section key={key} id={key} className="scroll-mt-32">
              <div className="mb-10 flex items-baseline justify-between border-b border-ink/10 pb-4">
                <h2 className="text-3xl font-extrabold text-ink md:text-4xl">
                  {ci % 3 === 0 ? (
                    <Highlight>{CATEGORY_LABELS[key]}</Highlight>
                  ) : ci % 3 === 1 ? (
                    <span className="text-brand-dark">{CATEGORY_LABELS[key]}</span>
                  ) : (
                    <Underline>{CATEGORY_LABELS[key]}</Underline>
                  )}
                </h2>
                <span className="text-sm text-ink-muted">
                  {terms.length} termes
                </span>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {terms.map((t, ti) => (
                  <Reveal
                    as="article"
                    key={t.slug}
                    index={ti % 2}
                    className="h-full"
                  >
                  <div id={t.slug} className="h-full scroll-mt-32 rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_6px_0_rgba(26,26,26,0.06)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-green/40">
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
                                className="font-medium text-brand-dark hover:text-brand-dark"
                              >
                                {rt?.term ?? r}
                              </a>
                            </span>
                          );
                        })}
                      </p>
                    )}
                  </div>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* Cross-link to formations (le FinalCTA qui suit est une carte noire) */}
      <section className="py-20">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="tag mb-5 text-brand-dark">Aller plus loin</p>
            <h2 className="text-3xl font-extrabold md:text-4xl">
              Tu veux passer de la théorie à la <Highlight>pratique</Highlight> ?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-ink/70">
              Le lexique te donne les bases. Les formations te donnent la méthode terrain testée sur 150+ étudiants en France et au Maroc.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/formations"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-bold text-white shadow-[0_6px_0_#1A6B33] transition-all hover:-translate-y-0.5 hover:gap-3 hover:shadow-[0_8px_0_#2DB84B]"
              >
                Voir les formations <ArrowRight size={16} />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-7 py-4 font-bold text-ink transition-all hover:gap-3 hover:border-ink"
              >
                Articles blog
              </Link>
            </div>
          </Reveal>
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
