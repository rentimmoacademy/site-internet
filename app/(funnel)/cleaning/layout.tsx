import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cleaning BnB Academy — monte ton activité de ménage Airbnb",
  description: "Présentation gratuite de Cleaning BnB Academy : créer une structure de ménage pour les hôtes Airbnb.",
  robots: { index: false, follow: false },
};

export default function CleaningLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
