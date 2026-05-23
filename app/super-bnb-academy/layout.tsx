import type { Metadata } from "next";

const TITLE = "Super BnB Academy — Automatise ton Airbnb en 30 jours avec un coach dédié";
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
    title: "Super BnB Academy — On automatise ton Airbnb avec toi en 30 jours",
    description: DESC,
    url: URL,
    images: [{ url: "https://www.rentimmoacademy.fr/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Super BnB Academy — +38% de revenus en 30 jours",
    description: "Programme d'accompagnement individuel pour hôtes Airbnb actifs. On configure tout avec toi.",
    images: ["https://www.rentimmoacademy.fr/og-image.jpg"],
  },
};

export default function SuperBnbAcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
