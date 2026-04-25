import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FormationDetail from "@/components/FormationDetail";
import FinalCTA from "@/components/sections/FinalCTA";
import { formations, getFormation } from "@/lib/formations";

export function generateStaticParams() {
  return formations.map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const f = getFormation(params.slug);
  if (!f) return {};
  return {
    title: `${f.name} — ${f.tagline}`,
    description: f.description,
  };
}

export default function FormationPage({ params }: { params: { slug: string } }) {
  const formation = getFormation(params.slug);
  if (!formation) notFound();

  return (
    <>
      <FormationDetail formation={formation} />
      <FinalCTA />
      {/* Course JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: formation.name,
            description: formation.description,
            provider: {
              "@type": "EducationalOrganization",
              name: "Rentimmo Academy",
              sameAs: "https://rentimmo-academy.com",
            },
            offers: { "@type": "Offer", price: formation.price.replace(/[^\d]/g, ""), priceCurrency: "EUR" },
          }),
        }}
      />
    </>
  );
}
