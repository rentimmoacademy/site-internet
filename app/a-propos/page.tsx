import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Trophy, MapPin, Users, BookOpen } from "lucide-react";
import FinalCTA from "@/components/sections/FinalCTA";
import Highlight from "@/components/ui/Highlight";
import Underline from "@/components/ui/Underline";
import Reveal from "@/components/ui/Reveal";

const SITE = "https://www.rentimmoacademy.fr";
const URL = `${SITE}/a-propos`;

export const metadata: Metadata = {
  title: "À propos — Marwan Afassi, fondateur",
  description:
    "Ingénieur, papa, praticien LCD. Lancé avec 1 000 €, +697K€ générés sans être propriétaire, dizaines de biens gérés entre France et Maroc.",
  alternates: { canonical: URL },
};

// Person + ProfilePage schemas — signal E-E-A-T fort pour Google + autorité IA
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE}/#marwan`,
  name: "Marwan Afassi",
  givenName: "Marwan",
  familyName: "Afassi",
  jobTitle: "Fondateur, Expert location courte durée",
  description:
    "Ingénieur industriel, MRE, expert Airbnb depuis 2019. +697 000 € générés en sous-location professionnelle sans être propriétaire. Note 4,93/5 sur 1 196 avis Airbnb. Fondateur de Rentimmo Academy (formation LCD) et de Daribnb (conciergerie Airbnb à Tanger).",
  image: `${SITE}/marwan.jpg`,
  url: URL,
  knowsAbout: [
    "Sous-location professionnelle",
    "Conciergerie Airbnb",
    "Location courte durée",
    "Investissement locatif sans apport",
    "Marché Airbnb au Maroc",
    "Gestion locative pour MRE",
    "Cleaning BNB",
  ],
  worksFor: [
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE}/#organization`,
      name: "Rentimmo Academy",
      url: SITE,
    },
    {
      "@type": "LocalBusiness",
      name: "Daribnb",
      url: "https://www.daribnb.com",
    },
  ],
  founder: [
    { "@type": "Organization", name: "Rentimmo Academy", url: SITE },
    { "@type": "Organization", name: "Daribnb", url: "https://www.daribnb.com" },
  ],
  nationality: { "@type": "Country", name: "France" },
  knowsLanguage: ["fr", "en", "ar"],
  sameAs: [
    "https://www.instagram.com/rentimmo_academy",
    "https://www.youtube.com/@rentimmoacademy",
    "https://www.tiktok.com/@rentimmoacademy",
    "https://fr.linkedin.com/in/marwan-afassi-9300b656",
    "https://www.daribnb.com",
  ],
};

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: URL,
  mainEntity: { "@id": `${SITE}/#marwan` },
  about: { "@id": `${SITE}/#marwan` },
  primaryImageOfPage: `${SITE}/marwan.jpg`,
  inLanguage: "fr-FR",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
    { "@type": "ListItem", position: 2, name: "À propos", item: URL },
  ],
};

const timeline = [
  {
    year: "2019",
    title: "1 000 € en poche, le premier bail",
    text: "Ingénieur de formation, papa, je signe mon premier bail de sous-location à Paris avec 1 000 € de budget. +700 €/mois dès le 2e mois. Le déclic.",
  },
  {
    year: "2020-2022",
    title: "Scale entre Paris, Lyon, Marseille",
    text: "Je systématise les process : scripts de prospection, bails types, automatisation. Je passe de 1 à 10 logements sous gestion.",
  },
  {
    year: "2023",
    title: "Ouverture du marché Maroc",
    text: "J'explore Tanger et Marrakech. Premiers riads, premiers appartements touristiques signés. Le marché explose sous mes yeux.",
  },
  {
    year: "2024",
    title: "Lancement de la conciergerie multi-pays",
    text: "Je passe de sous-locataire à conciergerie multi-mandats. Dizaines de biens gérés entre France et Maroc. Une équipe de consultants se structure.",
  },
  {
    year: "2025-2026",
    title: "+697 000 € générés sans être propriétaire",
    text: "Rentimmo Academy naît pour transmettre toute cette méthodologie. Pas d'apport, pas de crédit, juste du process et de l'exécution. Et l'expertise d'une équipe.",
  },
];

const values = [
  { icon: Trophy, title: "Terrain avant tout", text: "On enseigne ce qu'on pratique. Si un process marche, c'est qu'on l'a testé sur des dizaines de biens." },
  { icon: Users, title: "Équipe > solo", text: "Marwan + ses consultants. Tu n'apprends jamais seul, tu es épaulé par des experts opérationnels." },
  { icon: MapPin, title: "France & Maroc", text: "Deux marchés, deux cultures, une même méthode terrain adaptée localement." },
  { icon: BookOpen, title: "Honnêteté absolue", text: "Pas de promesse de « 10K€/mois en 30 jours ». Des chiffres vrais, des process vrais." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-40 pb-24">
        <div className="pointer-events-none absolute -top-20 left-0 h-[500px] w-[500px] rounded-full bg-brand-green/10 blur-[120px]" />
        <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <p className="tag mb-5 text-brand-dark">À propos</p>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-ink">
              Marwan Afassi.
            </h1>
            <p className="mt-5 text-xl font-semibold text-brand-dark">
              Ingénieur industriel, papa, hôte Airbnb depuis 6 ans.
            </p>
          </div>
          <p className="isolate text-lg leading-relaxed text-ink/70">
            Je suis ingénieur industriel et papa. J'ai démarré avec{" "}
            <span className="font-semibold text-ink">1 000 € en poche</span> et j'ai fait{" "}
            <span className="font-semibold text-ink">+697 000 €</span> sans jamais être propriétaire.{" "}
            <span className="font-semibold text-ink">+1 196 évaluations</span> et{" "}
            <span className="font-semibold text-ink">4,93/5</span> sur Airbnb.{" "}
            <Highlight>Une méthode terrain systématisée</Highlight> — entre la France et le Maroc.
          </p>
        </div>
      </section>

      {/* Photo + intro */}
      <section className="bg-white py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <div
            className="mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-full bg-brand-green bg-cover bg-center ring-4 ring-ink/5 lg:mx-0"
            style={{ backgroundImage: "url(/marwan.webp)" }}
            aria-label="Portrait de Marwan Afassi"
          />
          <Reveal>
            <h2 className="isolate text-h2 font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
              De salarié ingénieur à entrepreneur <Underline>LCD.</Underline>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              J'avais un bon job d'ingénieur industriel et une famille à nourrir. Pas 50 000 € à mettre
              dans l'immo. Juste 1 000 € et l'envie de construire autre chose. La sous-location
              professionnelle m'a ouvert la porte — et je n'ai jamais eu besoin d'une banque.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
              Aujourd'hui, je partage tout ce que j'ai appris — avec mes équipes de consultants qui
              accompagnent chaque apprenant. Rentimmo Academy, c'est la méthode que j'aurais voulu avoir en
              2019.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-24">
        <div className="container-x relative">
          <p className="tag mb-5 text-brand-dark">Parcours</p>
          <h2 className="isolate max-w-3xl text-h2 font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
            De 1 000 € à <Highlight>+697 K€ générés.</Highlight>
          </h2>

          <div className="mt-16 border-l border-ink/15 pl-8 md:pl-12">
            {timeline.map((t, i) => (
              <Reveal key={t.year} index={i} className="relative pb-14 last:pb-0">
                <div className="absolute -left-[45px] top-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-black text-brand-green ring-4 ring-cream md:-left-[57px]">
                  {i + 1}
                </div>
                <p className="text-brand-dark text-xs uppercase tracking-widest font-bold">{t.year}</p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">{t.title}</h3>
                <p className="mt-3 max-w-2xl text-ink/65">{t.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative isolate overflow-hidden bg-ink py-20 text-white">
        <div className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-20" />
        <div className="container-x">
          <p className="tag mb-10 text-brand-light">En chiffres</p>
          <div className="grid gap-6 md:grid-cols-4">
          {[
            ["+697 K€", "Générés sans être proprio"],
            ["1 196", "Évaluations Airbnb"],
            ["4,93★", "Note globale"],
            ["6 ans", "Hôte Airbnb"],
          ].map(([v, l], i) => (
            <Reveal key={l} index={i} className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-green/50">
              <p className="text-4xl font-extrabold tracking-[-0.02em] text-white md:text-5xl">{v}</p>
              <p className="mt-2 text-xs uppercase tracking-widest text-brand-light">{l}</p>
            </Reveal>
          ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-24 text-ink">
        <div className="container-x">
          <p className="tag mb-5 text-brand-dark">Valeurs</p>
          <h2 className="max-w-3xl text-h2 font-extrabold leading-[1.05] tracking-[-0.02em]">
            Les 4 principes qui guident{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">Rentimmo Academy.</span>
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const dark = i % 2 === 1;
              return (
                <Reveal
                  key={v.title}
                  index={i}
                  className={
                    dark
                      ? "rounded-3xl bg-ink p-8 text-white shadow-[0_8px_0_#1A6B33] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_0_#2DB84B]"
                      : "rounded-3xl border border-ink/10 bg-cream p-8 shadow-[0_6px_0_rgba(26,26,26,0.06)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_0_#2DB84B]"
                  }
                >
                  <div
                    className={
                      dark
                        ? "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/15 text-brand-green ring-1 ring-brand-green/30"
                        : "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-dark ring-1 ring-brand-green/20"
                    }
                  >
                    <v.icon size={22} strokeWidth={2.2} />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold tracking-tight">{v.title}</h3>
                  <p className={`mt-3 text-sm ${dark ? "text-white/65" : "text-ink/70"}`}>{v.text}</p>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link href="/formations" className="btn-ghost-dark hover:gap-3">
              Découvrir les formations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
}
