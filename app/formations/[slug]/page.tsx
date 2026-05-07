import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FormationDetail from "@/components/FormationDetail";
import FinalCTA from "@/components/sections/FinalCTA";
import { formations, getFormation } from "@/lib/formations";

const SITE = "https://rentimmo-academy.fr";

export function generateStaticParams() {
  return formations.map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const f = getFormation(params.slug);
  if (!f) return {};
  const url = `${SITE}/formations/${f.slug}`;
  return {
    title: `${f.name} — ${f.tagline}`,
    description: f.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${f.name} — ${f.tagline}`,
      description: f.description,
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

  // Course schema (Google rich results pour les formations)
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: formation.name,
    description: formation.description,
    url,
    provider: {
      "@type": "EducationalOrganization",
      "@id": `${SITE}/#organization`,
      name: "Rentimmo Academy",
      url: SITE,
      sameAs: SITE,
    },
    educationalLevel: "Beginner",
    inLanguage: "fr-FR",
    teaches: formation.outcomes,
    timeRequired: formation.duration,
    offers: {
      "@type": "Offer",
      price: priceNumeric,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: "fr-FR",
      courseWorkload: formation.duration,
    },
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
