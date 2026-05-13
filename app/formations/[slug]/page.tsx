import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FormationDetail from "@/components/FormationDetail";
import FinalCTA from "@/components/sections/FinalCTA";
import { formations, getFormation } from "@/lib/formations";

const SITE = "https://www.rentimmoacademy.fr";

export function generateStaticParams() {
  return formations.map((f) => ({ slug: f.slug }));
}

// Titles SEO-optimisés par formation pour matcher les keywords exact (volumes Google FR :
// "sous-location professionnelle" ~3K/mois, "conciergerie airbnb" ~9K/mois, "ménage airbnb" ~1.5K/mois)
const SEO_TITLE_BY_SLUG: Record<string, string> = {
  "sous-location": "Formation sous-location professionnelle 2026 — Sous-Location Academy",
  "conciergerie-bnb": "Formation conciergerie Airbnb 2026 — Conciergerie BnB Academy",
  "cleaning-bnb": "Formation ménage Airbnb 2026 — Cleaning BnB Academy · Seule formation FR dédiée",
};

const SEO_DESCRIPTION_BY_SLUG: Record<string, string> = {
  "sous-location":
    "Formation sous-location professionnelle : 8 modules, 8h, baux inclus, applicable immédiatement. 6+ ans d'expérience terrain, dizaines de sous-locs gérées. Lance ton 1er logement en 30 jours — France & Maroc.",
  "conciergerie-bnb":
    "Formation conciergerie Airbnb 100% terrain : 8 modules, 10h, statut juridique, prospection, mandats, automatisation. Signe ton 1er mandat en 30 jours. Bonus Maroc inclus.",
  "cleaning-bnb":
    "La 1ère formation française dédiée au cleaner BnB professionnel. 8 modules, standards hôteliers, protocole 47 points, grille tarifaire, prospection conciergeries. Lance ton activité en 30 jours.",
};

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const f = getFormation(params.slug);
  if (!f) return {};
  const url = `${SITE}/formations/${f.slug}`;
  const title = SEO_TITLE_BY_SLUG[f.slug] ?? `${f.name} — ${f.tagline}`;
  const description = SEO_DESCRIPTION_BY_SLUG[f.slug] ?? f.description;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

export default function FormationPage({ params }: { params: { slug: string } }) {
  const formation = getFormation(params.slug);
  if (!formation) notFound();

  const url = `${SITE}/formations/${formation.slug}`;
  const priceNumeric = formation.price.replace(/[^\d]/g, "");

  // Course schema enrichi (Google rich results pour les formations + signaux d'autorité IA)
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: formation.name,
    description: formation.description,
    url,
    provider: { "@id": `${SITE}/#organization` },
    creator: { "@id": `${SITE}/#marwan` },
    educationalLevel: "Beginner to Intermediate",
    inLanguage: "fr-FR",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      audienceType: "Entrepreneurs LCD, salariés en reconversion, MRE, jeunes actifs",
    },
    teaches: formation.outcomes,
    timeRequired: formation.duration,
    courseCode: formation.slug,
    numberOfCredits: formation.modules,
    offers: {
      "@type": "Offer",
      price: priceNumeric,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url,
      validFrom: "2026-01-01",
      category: "Formation professionnelle",
    },
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: "online",
        inLanguage: "fr-FR",
        courseWorkload: formation.duration,
        location: {
          "@type": "VirtualLocation",
          url: SITE,
        },
        instructor: { "@id": `${SITE}/#marwan` },
      },
    ],
  };

  // FAQPage schema (Google peut afficher les Q/R directement dans la SERP)
  const faqSchema = formation.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: formation.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
      { "@type": "ListItem", position: 2, name: "Formations", item: `${SITE}/formations` },
      { "@type": "ListItem", position: 3, name: formation.name, item: url },
    ],
  };

  return (
    <>
      <FormationDetail formation={formation} />
      <FinalCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
