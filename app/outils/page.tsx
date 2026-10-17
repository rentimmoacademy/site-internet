import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, FileSearch, Percent, Sparkles, ArrowRight } from "lucide-react";

const SITE = "https://www.rentimmoacademy.fr";
const URL = `${SITE}/outils`;

export const metadata: Metadata = {
  title: "Outils gratuits Airbnb & sous-location — Rentimmo Academy",
  description:
    "4 outils gratuits pour estimer tes revenus, auditer ton annonce, calculer la commission Airbnb et générer ta description optimisée. Sans inscription.",
  keywords: [
    "outils gratuits airbnb",
    "calculateur airbnb",
    "audit annonce airbnb",
    "générateur description airbnb",
    "simulateur revenu sous-location",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Outils gratuits Airbnb & sous-location",
    description: "4 outils gratuits Rentimmo Academy, sans inscription.",
    url: URL,
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
    { "@type": "ListItem", position: 2, name: "Outils", item: URL },
  ],
};

const tools = [
  {
    href: "/outils/audit-annonce",
    icon: FileSearch,
    title: "Audit d'annonce Airbnb",
    description:
      "Analyse ton annonce Airbnb ou Booking existante : score /100, benchmark concurrents, recommandations concrètes.",
  },
  {
    href: "/outils/calculateur-revenus-airbnb",
    icon: Calculator,
    title: "Calculateur de revenus Airbnb",
    description:
      "Estime ton revenu mensuel potentiel en sous-location ou en conciergerie, selon ta ville et ton bien.",
  },
  {
    href: "/outils/calculateur-commission-airbnb",
    icon: Percent,
    title: "Calculateur commission Airbnb 15,5 %",
    description:
      "Calcule le prix à afficher pour garder ton revenu net avec la nouvelle commission Airbnb unique.",
  },
  {
    href: "/outils/generateur-description-airbnb",
    icon: Sparkles,
    title: "Générateur de description Airbnb",
    description:
      "Génère un titre et une description optimisés pour l'algorithme Airbnb, à partir des infos de ton logement.",
  },
];

export default function OutilsPage() {
  return (
    <>
      <section className="bg-cream py-16 text-ink md:py-20">
        <div className="container-x max-w-3xl">
          <p className="tag mb-5 text-brand-dark">Outils gratuits</p>
          <h1 className="text-h2 font-extrabold leading-[1.05] tracking-[-0.02em]">
            4 outils gratuits pour lancer et optimiser ton activité Airbnb
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/70">
            Sans inscription, sans carte bancaire. Estime tes revenus, audite ton annonce, calcule
            ta commission et génère ta description — directement en ligne.
          </p>
        </div>
      </section>

      <section className="bg-cream pb-20">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-3xl border border-ink/10 bg-white p-6 transition-all hover:border-brand-green hover:shadow-lg md:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-dark">
                  <tool.icon size={22} />
                </div>
                <h2 className="mt-5 text-xl font-extrabold text-ink">{tool.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{tool.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-dark transition-transform group-hover:translate-x-1">
                  Utiliser l&apos;outil <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
