import type { Metadata } from "next";

const TITLE = "Masterclass gratuite — Sous-location & conciergerie Airbnb";
const DESC =
  "Accède gratuitement à la masterclass de Marwan AFASSI : la méthode testée sur +697K€ générés sur Airbnb, sans crédit ni apport, 100% halal-friendly.";
const URL = "https://www.rentimmoacademy.fr/masterclass";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
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

export default function MasterclassLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
