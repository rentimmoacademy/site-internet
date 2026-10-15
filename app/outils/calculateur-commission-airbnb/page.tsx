import type { Metadata } from "next";
import CommissionCalculatorFrame from "@/components/CommissionCalculatorFrame";

const SITE = "https://www.rentimmoacademy.fr";
const URL = `${SITE}/outils/calculateur-commission-airbnb`;

export const metadata: Metadata = {
  title: "Calculateur commission Airbnb 15,5 % gratuit",
  description:
    "Calcule en 2 minutes le prix à afficher avec la nouvelle commission Airbnb unique de 15,5 %, ta perte par nuit, l'impact sur tes frais de ménage et le comparatif avec Booking et Vrbo. Outil gratuit Rentimmo Academy.",
  keywords: [
    "calculateur commission airbnb",
    "commission airbnb 15,5",
    "nouvelle commission airbnb 2026",
    "calcul prix airbnb commission",
    "frais airbnb hote",
    "outil gratuit airbnb",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Calculateur commission Airbnb 15,5 % gratuit",
    description:
      "Entre tes chiffres et découvre le prix à afficher pour garder le même revenu net avec la nouvelle commission Airbnb de 15,5 %.",
    url: URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur commission Airbnb 15,5 % gratuit",
    description:
      "Calcule ta perte et le prix à afficher avec la nouvelle commission Airbnb. Outil gratuit Rentimmo Academy.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
    { "@type": "ListItem", position: 2, name: "Outils", item: `${SITE}/outils` },
    { "@type": "ListItem", position: 3, name: "Calculateur commission Airbnb", item: URL },
  ],
};

export default function CalculateurCommissionAirbnbPage() {
  return (
    <>
      <section className="bg-cream py-16 text-ink md:py-20">
        <div className="container-x max-w-3xl">
          <p className="tag mb-5 text-brand-dark">Outil gratuit</p>
          <h1 className="text-h2 font-extrabold leading-[1.05] tracking-[-0.02em]">
            Calculateur commission Airbnb 15,5 %
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/70">
            Entre tes chiffres et vois en direct ce que la nouvelle commission Airbnb unique de
            15,5 % change sur ton revenu net, ainsi que le prix à afficher pour ne rien perdre.
          </p>
        </div>
      </section>

      <section className="bg-cream pb-20">
        <div className="container-x">
          <CommissionCalculatorFrame />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
