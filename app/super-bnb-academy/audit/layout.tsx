import type { Metadata } from "next";

const TITLE = "Audit gratuit de ton annonce Airbnb : score /100 et corrections prioritaires";
const DESC =
  "Audit gratuit de ton annonce Airbnb : note sur 10 par critère (photos, titre, description, prix face aux comparables, avis, équipements), corrections prioritaires et diagnostic de ton activité. Sans carte bancaire.";
const URL = "https://www.rentimmoacademy.fr/super-bnb-academy/audit";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "audit annonce airbnb gratuit",
    "analyser annonce airbnb",
    "score annonce airbnb",
    "optimiser annonce airbnb",
    "outil gratuit propriétaire airbnb",
  ],
  alternates: {
    canonical: URL,
  },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: URL,
    images: [{ url: "https://www.rentimmoacademy.fr/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["https://www.rentimmoacademy.fr/og-image.jpg"],
  },
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
