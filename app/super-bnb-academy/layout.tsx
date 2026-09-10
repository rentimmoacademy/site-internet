import type { Metadata } from "next";

const TITLE = "SuperBNB Academy — Automatise ton Airbnb en 30 jours avec un coach dédié";
const DESC =
  "Programme d'accompagnement 30 jours pour hôtes Airbnb actifs. On configure avec toi : annonce optimisée, messages automatiques, PriceLabs, site de réservation directe. +38% de revenus en moyenne.";
const URL = "https://www.rentimmoacademy.fr/super-bnb-academy";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "super bnb academy",
    "automatiser airbnb",
    "programme airbnb",
    "accompagnement hôte airbnb",
    "pricelabs formation",
    "réservation directe airbnb",
    "channel manager airbnb",
    "coaching airbnb",
    "optimiser annonce airbnb",
    "automatisation airbnb france",
  ],
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: "SuperBNB Academy — On automatise ton Airbnb avec toi en 30 jours",
    description: DESC,
    url: URL,
    images: [{ url: "https://www.rentimmoacademy.fr/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SuperBNB Academy — +38% de revenus en 30 jours",
    description: "Programme d'accompagnement individuel pour hôtes Airbnb actifs. On configure tout avec toi.",
    images: ["https://www.rentimmoacademy.fr/og-image.jpg"],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quelle est la différence entre SuperBNB Academy et une formation Rentimmo Academy ?",
      acceptedAnswer: { "@type": "Answer", text: "Rentimmo Academy te forme à un métier (sous-loc, conciergerie, cleaning) avec des modules vidéo et templates. SuperBNB Academy est un programme d'accompagnement : on configure les outils avec toi, sur ton compte Airbnb, en 30 jours." },
    },
    {
      "@type": "Question",
      name: "Combien de temps faut-il consacrer au programme SuperBNB Academy chaque semaine ?",
      acceptedAnswer: { "@type": "Answer", text: "Compte 2 à 3h par semaine pendant 4 semaines. On fait les configurations en visio, tu valides, on déploie." },
    },
    {
      "@type": "Question",
      name: "Quels outils sont utilisés dans SuperBNB Academy ?",
      acceptedAnswer: { "@type": "Answer", text: "Superhote, PriceLabs, Stripe, Notion, Make, OpenAI (GPTs), SmartLife. Tous les abonnements (sauf SmartLife inclus) restent à ta charge." },
    },
    {
      "@type": "Question",
      name: "Y a-t-il une garantie avec SuperBNB Academy ?",
      acceptedAnswer: { "@type": "Answer", text: "Oui. Ton système est installé et opérationnel à J30, vérifié ensemble par une checklist de réception à 38 points. Si ce n'est pas le cas : remboursement intégral. Notre objectif de transformation est de te faire atteindre +30% de CA comparé à l'année précédente et de ramener ta gestion quotidienne à 15 minutes par jour." },
    },
  ],
};

export default function SuperBnbAcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {children}
    </>
  );
}
