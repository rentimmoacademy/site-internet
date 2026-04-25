import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automatic BnB Academy — Automatise ton Airbnb en 30 jours",
  description:
    "Programme d'accompagnement 30 jours pour hôtes Airbnb actifs. On automatise ton logement avec toi : annonce, messages, pricing, réservation directe.",
  openGraph: {
    title: "Automatic BnB Academy — On le fait avec toi",
    description: "Programme 30 jours pour automatiser ton Airbnb avec un coach dédié.",
  },
};

export default function AutomaticBnbLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
