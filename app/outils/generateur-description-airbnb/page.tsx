import type { Metadata } from "next";
import DescriptionGenerator from "@/components/DescriptionGenerator";

const SITE = "https://www.rentimmoacademy.fr";
const URL = `${SITE}/outils/generateur-description-airbnb`;

export const metadata: Metadata = {
  title: "Générateur de description Airbnb gratuit — Titre & annonce optimisés",
  description:
    "Génère en 1 minute un titre et une description Airbnb optimisés pour l'algorithme 2026, à partir des infos de ton logement. Outil gratuit Rentimmo Academy.",
  keywords: [
    "générateur description airbnb",
    "générateur titre airbnb",
    "rédiger annonce airbnb",
    "optimiser annonce airbnb",
    "description airbnb ia",
    "outil gratuit airbnb",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Générateur de description Airbnb gratuit",
    description:
      "Obtiens un titre et une description Airbnb optimisés pour l'algorithme 2026 à partir des infos de ton logement.",
    url: URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Générateur de description Airbnb gratuit",
    description: "Titre et description Airbnb optimisés en 1 minute. Outil gratuit Rentimmo Academy.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
    { "@type": "ListItem", position: 2, name: "Outils", item: `${SITE}/outils` },
    { "@type": "ListItem", position: 3, name: "Générateur de description Airbnb", item: URL },
  ],
};

export default function GenerateurDescriptionAirbnbPage() {
  return (
    <>
      <section className="bg-cream py-16 text-ink md:py-20">
        <div className="container-x max-w-3xl">
          <p className="tag mb-5 text-brand-dark">Outil gratuit</p>
          <h1 className="text-h2 font-extrabold leading-[1.05] tracking-[-0.02em]">
            Générateur de description Airbnb
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/70">
            Renseigne les infos de ton logement, obtiens un titre et une description optimisés pour
            l&apos;algorithme Airbnb — données concrètes, zéro adjectif creux.
          </p>
        </div>
      </section>

      <section className="bg-cream pb-20">
        <div className="container-x">
          <DescriptionGenerator />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
