import type { Metadata } from "next";

const SITE = "https://www.rentimmoacademy.fr";
const URL = `${SITE}/outils/audit-annonce`;

export const metadata: Metadata = {
  title: "Audit annonce Airbnb gratuit — Score /100 + recommandations IA | Rentimmo Academy",
  description:
    "Analysez gratuitement votre annonce Airbnb ou Booking.com en 90 secondes. Score /100, benchmark 5 concurrents, titre réoptimisé par IA. Outil gratuit Rentimmo Academy.",
  keywords: [
    "audit annonce airbnb gratuit",
    "analyse annonce airbnb",
    "optimiser annonce airbnb",
    "score annonce airbnb",
    "outil audit airbnb",
    "benchmark airbnb concurrents",
    "améliorer annonce booking",
    "outil gratuit location courte durée",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: "Audit annonce Airbnb gratuit — Score /100 en 90 secondes",
    description:
      "Collez votre URL Airbnb ou Booking. En 90s : score /100, benchmark concurrents, titre réoptimisé par IA. 100% gratuit.",
    url: URL,
    images: [{ url: `${SITE}/og-image.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audit annonce Airbnb gratuit — Score /100",
    description: "Analysez votre annonce en 90s. Score, benchmark, contenu réoptimisé par IA.",
  },
};

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
