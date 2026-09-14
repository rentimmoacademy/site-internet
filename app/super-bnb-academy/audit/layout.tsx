import type { Metadata } from "next";

const TITLE = "Audit gratuit de ton annonce Airbnb — Score /100 en 90 secondes";
const DESC =
  "Analyse IA gratuite de ton annonce Airbnb ou Booking.com : score par catégorie, benchmark concurrents, titre optimisé et gain de revenus estimé. Sans inscription.";
const URL = "https://www.rentimmoacademy.fr/super-bnb-academy/audit";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "audit annonce airbnb gratuit",
    "analyser annonce airbnb",
    "score annonce airbnb",
    "optimiser annonce airbnb",
    "benchmark concurrents airbnb",
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
