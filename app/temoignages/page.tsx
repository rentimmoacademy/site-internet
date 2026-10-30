import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Star, ExternalLink, Quote, Youtube } from "lucide-react";
import { TESTIMONIALS, AGGREGATE_RATING } from "@/lib/testimonials";
import FinalCTA from "@/components/sections/FinalCTA";
import Highlight from "@/components/ui/Highlight";
import Underline from "@/components/ui/Underline";
import Reveal from "@/components/ui/Reveal";

const SITE = "https://www.rentimmoacademy.fr";
const URL = `${SITE}/temoignages`;

export const metadata: Metadata = {
  title: "Témoignages — Avis clients Rentimmo Academy",
  description:
    "Avis et témoignages des étudiants Rentimmo Academy : sous-location professionnelle, conciergerie Airbnb, cleaning BNB. Sources : Trustpilot, vidéos YouTube, avis vérifiés.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Témoignages — Avis clients Rentimmo Academy",
    description:
      "Avis et témoignages vérifiés des étudiants Rentimmo Academy. Sources publiques : Trustpilot, vidéos YouTube.",
    url: URL,
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
    { "@type": "ListItem", position: 2, name: "Témoignages", item: URL },
  ],
};

// Review schema individuels (uniquement pour les témoignages avec source vérifiable)
const reviewSchemas = TESTIMONIALS.map((t) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  itemReviewed: {
    "@type": "EducationalOrganization",
    "@id": `${SITE}/#organization`,
    name: "Rentimmo Academy",
  },
  author: {
    "@type": "Person",
    name: t.firstName,
  },
  reviewRating:
    t.source.type === "trustpilot" || t.source.type === "google-review"
      ? {
          "@type": "Rating",
          ratingValue: (t.source as { rating: number }).rating,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  reviewBody: t.quote,
  url: t.source.type === "trustpilot" ? t.source.url : undefined,
}));

// Aggregate rating à mettre sur la page (si suffisant de reviews vérifiables — sinon on l'omet)
const aggregateRatingSchema =
  TESTIMONIALS.length >= 5
    ? {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "@id": `${SITE}/#organization`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: AGGREGATE_RATING.ratingValue,
          reviewCount: AGGREGATE_RATING.reviewCount,
          bestRating: AGGREGATE_RATING.bestRating,
          worstRating: AGGREGATE_RATING.worstRating,
        },
      }
    : null;

export default function TemoignagesPage() {
  const trustpilot = TESTIMONIALS.filter((t) => t.source.type === "trustpilot");
  const youtube = TESTIMONIALS.filter((t) => t.source.type === "youtube");
  const others = TESTIMONIALS.filter(
    (t) => t.source.type !== "trustpilot" && t.source.type !== "youtube"
  );

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
              <li className="font-medium text-ink/80">Témoignages</li>
            </ol>
          </nav>

          <span className="inline-block rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-1 text-sm font-bold uppercase tracking-wider text-brand-dark">
            Avis vérifiés
          </span>
          <h1 className="mt-6 text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
            Ce que disent nos{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">étudiants.</span>
          </h1>
          <p className="isolate mt-6 max-w-2xl text-lg text-ink/70 md:text-xl">
            Tous les témoignages publiés sur cette page sont issus de sources publiques vérifiables (Trustpilot, vidéos YouTube).{" "}
            <Highlight>Aucun avis fabriqué</Highlight> — chaque citation peut être recoupée à la source.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-brand-green text-brand-green" />
              ))}
            </div>
            <p className="text-sm text-ink/70">
              <span className="font-bold text-ink">4,9 / 5</span> — basé sur les avis publics Trustpilot
            </p>
            <a
              href="https://fr.trustpilot.com/review/rentimmoacademy.fr"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brand-dark hover:text-brand-dark underline-offset-4 hover:underline"
            >
              Voir tous les avis sur Trustpilot
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Trustpilot section */}
      {trustpilot.length > 0 && (
        <section className="bg-white py-20">
          <div className="container-x">
            <div className="mb-10 flex items-baseline justify-between border-b border-ink/10 pb-4">
              <h2 className="isolate text-3xl font-extrabold text-ink md:text-4xl">
                Avis <Highlight>Trustpilot</Highlight>
              </h2>
              <a
                href="https://fr.trustpilot.com/review/rentimmoacademy.fr"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-dark hover:text-brand-dark"
              >
                Tous les avis Trustpilot
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {trustpilot.map((t, i) => {
                const src = t.source as { type: "trustpilot"; url: string; rating: 1 | 2 | 3 | 4 | 5 };
                return (
                  <Reveal
                    as="article"
                    key={t.id}
                    index={i}
                    className="rounded-3xl border border-ink/10 bg-cream p-8 shadow-[0_6px_0_rgba(26,26,26,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_0_#2DB84B]"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(src.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className="fill-brand-green text-brand-green"
                        />
                      ))}
                    </div>
                    <Quote
                      size={28}
                      className="text-brand-green/30 mb-3"
                    />
                    <p className="text-ink leading-relaxed">{t.quote}</p>
                    <div className="mt-6 pt-6 border-t border-ink/5 flex items-center justify-between">
                      <span className="text-sm font-bold text-ink-muted">
                        Avis Trustpilot vérifié
                      </span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-brand-dark hover:text-brand-dark"
                      >
                        Source
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* YouTube section */}
      {youtube.length > 0 && (
        <section className="relative isolate overflow-hidden bg-ink py-20 text-white">
          <div className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-20" />
          <div className="container-x">
            <div className="mb-10 flex items-baseline justify-between border-b border-white/10 pb-4">
              <h2 className="text-3xl font-extrabold text-white md:text-4xl">
                Témoignages <Underline>vidéo</Underline>
              </h2>
              <a
                href="https://www.youtube.com/@rentimmoacademy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-light transition-all hover:gap-3"
              >
                Chaîne YouTube
                <Youtube size={16} />
              </a>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {youtube.map((t, i) => {
                const src = t.source as { type: "youtube"; videoId: string; videoTitle: string };
                return (
                  <Reveal
                    as="article"
                    key={t.id}
                    index={i}
                    className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-green/50"
                  >
                    <div className="aspect-video rounded-xl bg-black/40 overflow-hidden mb-4">
                      <iframe
                        loading="lazy"
                        src={`https://www.youtube.com/embed/${src.videoId}`}
                        title={src.videoTitle}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <h3 className="font-bold text-white">
                      {t.firstName}
                      {t.city && <span className="text-white/55"> · {t.city}</span>}
                    </h3>
                    {t.result && (
                      <p className="mt-1 text-sm font-bold text-brand-light">
                        {t.result}
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-white/65">
                      « {t.quote} »
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Others (interviews privées avec accord) */}
      {others.length > 0 && (
        <section className="py-20">
          <div className="container-x">
            <div className="mb-10 border-b border-ink/10 pb-4">
              <h2 className="text-3xl font-extrabold text-ink md:text-4xl">
                Interviews
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {others.map((t, i) => (
                <Reveal
                  as="article"
                  key={t.id}
                  index={i}
                  className="rounded-3xl border border-ink/10 bg-white p-8 shadow-[0_6px_0_rgba(26,26,26,0.06)]"
                >
                  <Quote size={28} className="text-brand-green/30 mb-3" />
                  <p className="text-ink leading-relaxed">{t.quote}</p>
                  <div className="mt-6 pt-6 border-t border-ink/5">
                    <p className="font-bold text-ink">
                      {t.firstName}
                      {t.city && <span className="text-ink-muted font-normal"> · {t.city}</span>}
                    </p>
                    {t.result && (
                      <p className="mt-1 text-sm font-bold text-brand-dark">
                        {t.result}
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state si vraiment vide (cas dégradé) */}
      {TESTIMONIALS.length === 0 && (
        <section className="bg-cream py-20">
          <div className="container-x text-center">
            <p className="text-ink-muted">
              Plus de témoignages bientôt en ligne.{" "}
              <a
                href="https://fr.trustpilot.com/review/rentimmoacademy.fr"
                target="_blank"
                rel="noreferrer"
                className="text-brand-dark hover:text-brand-dark underline"
              >
                Voir les avis sur Trustpilot
              </a>
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-white py-20 text-ink">
        <Reveal className="container-x text-center">
          <p className="tag mb-5 text-brand-dark">À ton tour</p>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Tu veux faire partie de la prochaine vague ?
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-ink/70">
            Nos étudiants viennent de France, Belgique, Pays-Bas, Espagne et Maroc. Salariés en reconversion, jeunes actifs sans apport, MRE qui gèrent à distance — chacun avec son chemin, mais une méthode commune testée sur 6+ ans.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/formations"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-bold text-white transition-all hover:gap-3 hover:bg-brand-dark"
            >
              Voir les formations <ArrowRight size={16} />
            </Link>
            <a
              href="https://cal.com/rentimmoacademy/appel-strategique?overlayCalendar=true"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white px-7 py-4 font-bold text-ink transition-colors hover:border-ink"
            >
              Réserver un appel stratégique
            </a>
          </div>
        </Reveal>
      </section>

      <FinalCTA />

      {reviewSchemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
      {aggregateRatingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
