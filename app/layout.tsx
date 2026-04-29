import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallFloat from "@/components/layout/CallFloat";
import CookieBanner from "@/components/layout/CookieBanner";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rentimmo Academy — Formations sous-location & conciergerie Airbnb",
    template: "%s | Rentimmo Academy",
  },
  description:
    "Formations terrain pour lancer ta sous-location, ta conciergerie Airbnb ou ton activité de ménage professionnel. France & Maroc. Sans banque, sans crédit, sans apport.",
  keywords: [
    "sous-location professionnelle",
    "conciergerie Airbnb",
    "formation LCD",
    "ménage Airbnb",
    "Airbnb Maroc",
    "Rentimmo",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Rentimmo Academy",
    title: "Rentimmo Academy — Formations LCD France & Maroc",
    description:
      "Génère +700 €/mois avec ton premier logement Airbnb. Formation terrain, applicable immédiatement.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${poppins.variable}`}>
      <head>
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Rentimmo Academy",
              url: "https://rentimmo-academy.com",
              sameAs: ["https://instagram.com/rentimmo", "https://youtube.com/@rentimmo"],
              description:
                "Académie de formation professionnelle aux métiers de la location courte durée : sous-location, conciergerie, ménage Airbnb.",
            }),
          }}
        />
        {/* Analytics placeholder — replace GA_MEASUREMENT_ID */}
        {/* <Script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" /> */}
      </head>
      <body className="bg-ink text-cream antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CallFloat />
        <CookieBanner />
      </body>
    </html>
  );
}
