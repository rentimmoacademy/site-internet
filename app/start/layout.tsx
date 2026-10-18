import type { Metadata } from "next";

const TITLE = "Rentimmo Academy — Choisis ton programme";
const DESC =
  "Sous-location professionnelle, conciergerie Airbnb, ménage BNB ou Super BNB Academy : trouve en 10 secondes le programme fait pour toi. +7 ans d'expérience, +697 000€ générés.";
const URL = "https://www.rentimmoacademy.fr/start";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  robots: { index: false, follow: true },
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

export default function StartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
