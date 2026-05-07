import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallFloat from "@/components/layout/CallFloat";
import CookieBanner from "@/components/layout/CookieBanner";
import { formations } from "@/lib/formations";

const SITE = "https://rentimmo-academy.fr";

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
  metadataBase: new URL(SITE),
  title: {
    default: "Rentimmo Academy — Formations sous-location & conciergerie Airbnb",
    template: "%s | Rentimmo Academy",
  },
  description:
    "Formations terrain pour lancer ta sous-location, ta conciergerie Airbnb ou ton activité de ménage professionnel. France & Maroc. Sans banque, sans crédit, sans apport.",
  keywords: [
    "sous-location professionnelle",
    "formation sous-location",
    "conciergerie Airbnb",
    "formation conciergerie Airbnb",
    "ménage Airbnb",
    "cleaning Airbnb",
    "formation LCD",
    "Airbnb Maroc",
    "Rentimmo Academy",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Rentimmo Academy",
    url: SITE,
    title: "Rentimmo Academy — Formations LCD France & Maroc",
    description:
      "Génère +700 €/mois avec ton premier logement Airbnb. Formation terrain, applicable immédiatement.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rentimmo Academy — Formations LCD France & Maroc",
    description: "Génère +700 €/mois avec ton premier logement Airbnb.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  themeColor: "#1A1A1A",
};

// EducationalOrganization JSON-LD enrichi — visible sur toutes les pages
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${SITE}/#organization`,
  name: "Rentimmo Academy",
  alternateName: "Rentimmo",
  url: SITE,
  logo: `${SITE}/icon.svg`,
  image: `${SITE}/og-image.jpg`,
  description:
    "Académie de formation professionnelle aux métiers de la location courte durée : sous-location professionnelle, conciergerie Airbnb, ménage Airbnb (cleaning BnB). Formations terrain en France et au Maroc, sans banque, sans crédit, sans apport.",
  founder: {
    "@type": "Person",
    name: "Marwan Afassi",
    jobTitle: "Fondateur · Expert location courte durée",
    sameAs: [
      "https://www.instagram.com/rentimmo_academy",
      "https://www.youtube.com/@rentimmoacademy",
    ],
  },
  sameAs: [
    "https://www.instagram.com/rentimmo_academy",
    "https://www.youtube.com/@rentimmoacademy",
    "https://www.tiktok.com/@rentimmoacademy",
  ],
  areaServed: [
    { "@type": "Country", name: "France" },
    { "@type": "Country", name: "Maroc" },
    { "@type": "Country", name: "Belgique" },
    { "@type": "Country", name: "Suisse" },
  ],
  knowsLanguage: ["fr"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Catalogue des formations Rentimmo Academy",
    itemListElement: formations.map((f) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Course",
        name: f.name,
        description: f.description,
        url: `${SITE}/formations/${f.slug}`,
        provider: { "@id": `${SITE}/#organization` },
      },
    })),
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  url: SITE,
  name: "Rentimmo Academy",
  inLanguage: "fr-FR",
  publisher: { "@id": `${SITE}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE}/blog?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
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
