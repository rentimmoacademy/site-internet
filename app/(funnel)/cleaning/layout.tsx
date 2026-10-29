import type { Metadata } from "next";
import { Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Cleaning BnB Academy — monte ton activité de ménage Airbnb",
  description: "Présentation gratuite de Cleaning BnB Academy : créer une structure de ménage pour les hôtes Airbnb.",
  alternates: { canonical: "https://www.rentimmoacademy.fr/cleaning" },
  robots: { index: false, follow: false },
};

// Poppins (charte) préchargée pour cette route seulement : évite le décalage de mise en page
// quand la police remplace la police de secours. 3 graisses suffisent (400 / 600 / 800).
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-cleaning",
  display: "swap",
});

export default function CleaningLayout({ children }: { children: React.ReactNode }) {
  return <div className={poppins.variable}>{children}</div>;
}
