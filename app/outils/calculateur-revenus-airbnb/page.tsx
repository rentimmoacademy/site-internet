import type { Metadata } from "next";
import RevenueCalculator from "@/components/RevenueCalculator";

const SITE = "https://www.rentimmoacademy.fr";
const URL = `${SITE}/outils/calculateur-revenus-airbnb`;

export const metadata: Metadata = {
  title: "Calculateur de revenus Airbnb gratuit — Sous-location vs conciergerie",
  description:
    "Estime en 1 minute le revenu mensuel potentiel d'un logement en sous-location professionnelle ou en conciergerie Airbnb, selon ta ville et ton type de bien. Outil gratuit Rentimmo Academy.",
  keywords: [
    "calculateur revenus airbnb",
    "simulateur revenu sous-location",
    "combien rapporte un airbnb",
    "revenu conciergerie airbnb",
    "calculateur sous-location professionnelle",
    "outil gratuit airbnb",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Calculateur de revenus Airbnb gratuit",
    description:
      "Estime ton revenu potentiel en sous-location ou en conciergerie Airbnb selon ta ville et ton type de bien.",
    url: URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur de revenus Airbnb gratuit",
    description: "Estime ton revenu potentiel en sous-location ou en conciergerie. Outil gratuit Rentimmo Academy.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
    { "@type": "ListItem", position: 2, name: "Outils", item: `${SITE}/outils` },
    { "@type": "ListItem", position: 3, name: "Calculateur de revenus Airbnb", item: URL },
  ],
};

export default function CalculateurRevenusAirbnbPage() {
  return (
    <>
      <section className="bg-cream py-16 text-ink md:py-20">
        <div className="container-x max-w-3xl">
          <p className="tag mb-5 text-brand-dark">Outil gratuit</p>
          <h1 className="text-h2 font-extrabold leading-[1.05] tracking-[-0.02em]">
            Calculateur de revenus Airbnb
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/70">
            Sous-location ou conciergerie : choisis ta ville et ton type de bien, obtiens une
            estimation de revenu mensuel pour les deux modèles.
          </p>
        </div>
      </section>

      <section className="bg-cream pb-20">
        <div className="container-x">
          <RevenueCalculator />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
