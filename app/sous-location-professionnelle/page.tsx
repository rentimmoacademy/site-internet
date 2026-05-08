import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, TrendingUp, MapPin, Wallet } from "lucide-react";
import LandingHero from "@/components/sections/LandingHero";
import LandingSection from "@/components/sections/LandingSection";
import FinalCTA from "@/components/sections/FinalCTA";

const SITE = "https://rentimmo-academy.fr";
const URL = `${SITE}/sous-location-professionnelle`;

export const metadata: Metadata = {
  title: "Sous-location professionnelle : guide complet 2026",
  description:
    "Tout sur la sous-location professionnelle en France et au Maroc : cadre légal, rentabilité, comment se lancer sans apport. Le guide de référence pour démarrer en 2026.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Sous-location professionnelle : guide complet 2026 | Rentimmo Academy",
    description:
      "Cadre légal, rentabilité, comment se lancer. Le guide de référence pour démarrer la sous-location en 2026.",
    url: URL,
    type: "article",
  },
};

const FAQS = [
  {
    q: "La sous-location professionnelle est-elle légale en France ?",
    a: "Oui, à 100% — à condition d'avoir l'accord ÉCRIT du propriétaire et de respecter les plafonds de loyer fixés par le Code civil. Sans accord écrit, vous risquez une résiliation immédiate du bail principal et le remboursement de tous les loyers perçus au propriétaire.",
  },
  {
    q: "Combien faut-il pour démarrer en sous-location ?",
    a: "Entre 2 500 € et 5 000 € pour : le dépôt de garantie (1 à 2 mois de loyer), le premier loyer, l'ameublement (lits, électroménager, vaisselle, déco), et les photos pro de l'annonce. Aucun apport bancaire ni crédit immobilier nécessaire — c'est précisément l'avantage du modèle.",
  },
  {
    q: "Combien rapporte une sous-location en moyenne ?",
    a: "Sur un T2 bien situé en zone touristique ou affaires (Paris, Lyon, Bordeaux, Marseille, Nice ou ville étudiante), comptez 600 à 1 500 € de cashflow net mensuel après loyer payé au propriétaire, charges, ménage et commission Airbnb. Multiplié par plusieurs logements : on parle vite de 3 à 10K€ nets/mois.",
  },
  {
    q: "Quelle fiscalité pour la sous-location professionnelle ?",
    a: "Régime LMNP (Loueur Meublé Non Professionnel) avec déclaration des revenus en BIC. Possibilité de micro-BIC (abattement forfaitaire 50%) ou régime réel (déduction des charges réelles, souvent plus avantageux dès 3 logements). Un expert-comptable LMNP coûte 600-1 200 €/an et fait économiser bien plus.",
  },
  {
    q: "Combien de temps avant les premiers revenus ?",
    a: "Entre 15 et 45 jours après signature du bail principal : le temps d'ameubler, photographier, mettre en ligne sur Airbnb / Booking / Vrbo, et récupérer les premières réservations. Le break-even mensuel est généralement atteint dès le 1er mois si le bien est dans une zone à forte demande.",
  },
  {
    q: "Est-ce que ça marche au Maroc ?",
    a: "Oui — Tanger, Marrakech, Casablanca et Agadir ont des marchés Airbnb dynamiques avec un bon ratio rentabilité / coût d'entrée. Le cadre légal marocain accepte la sous-location avec accord écrit du bailleur. La formation Sous-Location Academy inclut un module Bonus Maroc dédié.",
  },
  {
    q: "Est-ce que je peux faire ça en parallèle de mon job salarié ?",
    a: "Oui — la majorité de nos étudiants démarrent en parallèle de leur emploi. Comptez 5 à 8 heures hebdo les 2 premiers mois (recherche propriétaire, signature, lancement), puis 1 à 2 heures hebdo en routine grâce à l'automatisation (check-in autonome, pricing dynamique, ménage délégué).",
  },
];

export default function SousLocationProfessionnellePage() {
  // FAQPage JSON-LD pour rich results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
      { "@type": "ListItem", position: 2, name: "Sous-location professionnelle", item: URL },
    ],
  };

  // Article schema (le guide)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Sous-location professionnelle : guide complet 2026",
    description: metadata.description,
    author: { "@type": "Person", "@id": `${SITE}/#marwan`, name: "Marwan Afassi" },
    publisher: { "@id": `${SITE}/#organization` },
    datePublished: "2026-05-07",
    dateModified: "2026-05-07",
    mainEntityOfPage: URL,
    inLanguage: "fr-FR",
  };

  // HowTo schema — extraction par les LLMs et rich result Google possible
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Comment démarrer sa sous-location professionnelle en France ou au Maroc",
    description:
      "Les 6 étapes concrètes pour signer ton premier bail de sous-location professionnelle, ameubler, lancer ton annonce et automatiser la gestion.",
    totalTime: "P30D",
    estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "3500" },
    inLanguage: "fr-FR",
    step: [
      { "@type": "HowToStep", position: 1, name: "Comprendre le cadre légal", text: "Maîtriser les 3 clauses obligatoires (accord écrit du propriétaire, plafond de loyer, déclaration mairie). C'est ton garde-fou contre la résiliation du bail." },
      { "@type": "HowToStep", position: 2, name: "Trouver le bon propriétaire", text: "3 canaux qui marchent : LeBonCoin annonces > 30 jours, agences immobilières spécialisées propriétaires-bailleurs, bouche-à-oreille MRE. Le pitch fait toute la différence." },
      { "@type": "HowToStep", position: 3, name: "Visiter et négocier le bail", text: "Checklist de visite en 12 points, négociation du loyer pour garder une marge confortable (objectif : revenus Airbnb bruts ≥ 2x loyer payé), rédaction du bail avec clauses sécurisantes." },
      { "@type": "HowToStep", position: 4, name: "Ameubler et lancer l'annonce", text: "Budget ameublement optimisé (2 500-3 500 € pour un T2). Photos pro, titre vendeur, description SEO Airbnb. L'annonce doit cartonner dès la mise en ligne." },
      { "@type": "HowToStep", position: 5, name: "Pricing dynamique et premiers avis", text: "Outils gratuits pour ajuster les tarifs en temps réel. Stratégie pour obtenir 10 avis 5 étoiles dans les 2 premiers mois et grimper dans le ranking Airbnb." },
      { "@type": "HowToStep", position: 6, name: "Automatiser et scaler", text: "Check-in autonome (smart lock), ménage délégué, réponses voyageurs automatisées. Tu passes de 1 à 5 logements sans tripler le temps." },
    ],
  };

  return (
    <>
      <LandingHero
        kicker="Guide complet 2026"
        h1="Sous-location professionnelle : démarrer en 2026 sans banque, sans apport"
        intro="La sous-location professionnelle est le moyen le plus rapide pour générer des revenus locatifs sans crédit immobilier. Tu loues un bien, tu le sous-loues sur Airbnb avec accord du propriétaire, tu gardes la marge. Voici comment ça marche concrètement."
        primaryCta={{ href: "/formations/sous-location", label: "Voir la formation" }}
        secondaryCta={{ href: "https://cal.com/rentimmo-academy/appel-strategique?overlayCalendar=true", label: "Réserver un appel" }}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Sous-location professionnelle" }]}
      />

      {/* Définition + cadre légal */}
      <LandingSection
        kicker="C'est quoi exactement"
        title="Sous-location professionnelle : la définition claire"
        bg="cream"
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-lg leading-relaxed text-ink">
              La <strong>sous-location professionnelle</strong> consiste à louer un bien à un propriétaire (ton bailleur), puis à le re-louer en courte durée sur Airbnb / Booking / Vrbo avec son accord écrit. Tu encaisses la différence entre le loyer que tu paies au propriétaire et les revenus Airbnb générés.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink">
              C'est un modèle <strong>100% légal en France</strong> à condition de respecter 3 règles : accord écrit du bailleur, plafond de loyer fixé par le Code civil, et déclaration fiscale en LMNP.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
            <h3 className="text-xl font-bold text-ink">Les 3 clauses légales obligatoires</h3>
            <ul className="mt-4 space-y-3">
              {[
                "Accord ÉCRIT du propriétaire (jamais oral)",
                "Plafond de loyer respecté (Article 8 Loi du 6 juillet 1989)",
                "Déclaration en mairie pour la location courte durée (Loi ALUR)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 flex-shrink-0 text-brand-green" />
                  <span className="text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LandingSection>

      {/* Pourquoi c'est le meilleur démarrage */}
      <LandingSection
        kicker="Le meilleur point d'entrée"
        title="Pourquoi la sous-location bat l'achat immobilier en 2026"
        intro="L'achat immobilier classique demande 30 à 50K€ d'apport, un dossier bancaire solide, et bloque ton endettement pendant 20 ans. La sous-location professionnelle te donne accès au cashflow Airbnb sans ces contraintes."
        bg="white"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Wallet,
              title: "Sans crédit ni apport",
              desc: "Tu paies un dépôt de garantie + premier loyer + ameublement. Total : 2,5K€ à 5K€ vs 30K€+ pour un achat. Pas de banquier, pas de taux, pas d'endettement.",
            },
            {
              icon: TrendingUp,
              title: "Cashflow immédiat",
              desc: "Premier revenu Airbnb dans les 30 à 45 jours après signature du bail. L'achat immobilier prend 6 à 12 mois entre offre et premier loyer.",
            },
            {
              icon: ShieldCheck,
              title: "Scalable sans plafond bancaire",
              desc: "Les banques refusent généralement de financer plus de 3-4 biens locatifs. En sous-loc, tu peux signer 5, 10, 20 baux sans aucune limite — uniquement bridé par le temps.",
            },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="rounded-2xl bg-cream p-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-brand-green/10">
                  <Icon className="size-6 text-brand-green" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-ink">{b.title}</h3>
                <p className="mt-2 text-ink-muted">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </LandingSection>

      {/* Combien ça rapporte */}
      <LandingSection
        kicker="Chiffres concrets"
        title="Combien rapporte une sous-location en 2026 ?"
        intro="Ces chiffres sont des médianes constatées sur les 150+ étudiants Rentimmo Academy qui ont signé leur premier bail (France et Maroc confondus)."
        bg="cream"
      >
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
          <table className="w-full">
            <thead className="bg-ink text-cream">
              <tr>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">Type de bien</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">Loyer payé proprio</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">Revenus Airbnb bruts</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">Cashflow net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {[
                ["Studio Paris 9-18e", "1 200 €", "2 800-3 200 €", "+700 à +1 100 €"],
                ["T2 Lyon centre", "900 €", "2 200-2 600 €", "+800 à +1 200 €"],
                ["T2 Bordeaux Chartrons", "850 €", "2 100-2 400 €", "+750 à +1 050 €"],
                ["T2 Marseille Vieux Port", "750 €", "1 900-2 200 €", "+700 à +1 000 €"],
                ["T2 Tanger Malabata", "4 500 MAD", "12 000-15 000 MAD", "+5 500 à +8 000 MAD"],
              ].map((row) => (
                <tr key={row[0]} className="hover:bg-cream/50">
                  {row.map((cell, i) => (
                    <td key={i} className={`p-4 ${i === 3 ? "font-bold text-brand-dark" : "text-ink"}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm italic text-ink-muted">
          Cashflow net = revenus Airbnb − loyer propriétaire − ménage − consommables − commission plateforme. Hors fiscalité (LMNP avec abattement). Médiane sur 12 mois pleins après stabilisation.
        </p>
      </LandingSection>

      {/* Les 6 étapes pour démarrer */}
      <LandingSection
        kicker="Comment se lancer"
        title="Les 6 étapes pour démarrer ta sous-location"
        bg="white"
      >
        <ol className="space-y-6">
          {[
            { num: "01", t: "Comprendre le cadre légal", d: "Maîtriser les 3 clauses obligatoires, le plafond de loyer, et les obligations en mairie. C'est ton garde-fou contre la résiliation." },
            { num: "02", t: "Trouver le bon propriétaire", d: "3 canaux qui marchent vraiment : LeBonCoin, agences immobilières spécialisées propriétaires-bailleurs, et le bouche-à-oreille MRE. Le pitch fait toute la différence." },
            { num: "03", t: "Visiter et négocier le bail", d: "Checklist de visite en 12 points, négociation du loyer pour garder une marge confortable (objectif : Airbnb brut ≥ 2x loyer payé), rédaction du bail avec clauses sécurisantes." },
            { num: "04", t: "Ameubler et lancer l'annonce", d: "Budget ameublement optimisé (souvent 2 500-3 500 € pour un T2). Photos pro, titre vendeur, description SEO Airbnb. L'annonce doit cartonner dès la mise en ligne." },
            { num: "05", t: "Pricing dynamique et premiers avis", d: "Outils gratuits pour ajuster les tarifs en temps réel (Wheelhouse, PriceLabs trial). Stratégie pour obtenir 10 avis 5 étoiles dans les 2 premiers mois et grimper dans le ranking Airbnb." },
            { num: "06", t: "Automatiser et scaler", d: "Check-in autonome (boîte à clé, smart lock), ménage délégué (équipe locale ou Bnbsitter), réponses voyageurs automatisées (Hospitable, Smartbnb). Tu passes de 1 à 5 logements sans tripler le temps." },
          ].map((s) => (
            <li key={s.num} className="flex gap-6 rounded-2xl bg-cream p-6">
              <div className="flex-shrink-0 text-3xl font-extrabold text-brand-green/30 md:text-4xl">{s.num}</div>
              <div>
                <h3 className="text-xl font-bold text-ink">{s.t}</h3>
                <p className="mt-2 leading-relaxed text-ink-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </LandingSection>

      {/* France vs Maroc */}
      <LandingSection
        kicker="France & Maroc"
        title="Sous-location en France vs au Maroc : ce qui change"
        bg="cream"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇫🇷</span>
              <h3 className="text-xl font-bold text-ink">France</h3>
            </div>
            <ul className="mt-4 space-y-2 text-ink">
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Cadre Loi ALUR + Code civil</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Régime LMNP, BIC, micro-BIC ou réel</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Limite 120 nuits/an en résidence principale (Paris, Lyon, etc.)</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Numéro d'enregistrement obligatoire dans certaines villes</li>
            </ul>
            <p className="mt-4 text-sm text-ink-muted">Marché mature avec forte concurrence mais demande stable : tourisme, business, étudiants.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🇲🇦</span>
              <h3 className="text-xl font-bold text-ink">Maroc</h3>
            </div>
            <ul className="mt-4 space-y-2 text-ink">
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Cadre Loi 2025 sur la location courte durée</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Déclaration préfectorale obligatoire</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Taxe de séjour à reverser (10-30 MAD/nuit selon ville)</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Marché en explosion avec Coupe du Monde 2030</li>
            </ul>
            <p className="mt-4 text-sm text-ink-muted">Tanger, Marrakech, Casablanca, Agadir : marges souvent supérieures à la France grâce au coût d'entrée plus bas.</p>
          </div>
        </div>
      </LandingSection>

      {/* FAQ */}
      <LandingSection
        kicker="FAQ"
        title="Questions fréquentes sur la sous-location professionnelle"
        bg="white"
      >
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl bg-cream p-6"
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-ink">
                <span>{f.q}</span>
                <span className="text-2xl text-brand-green transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 leading-relaxed text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </LandingSection>

      {/* Lien fort vers la formation */}
      <LandingSection
        kicker="Aller plus loin"
        title="Tu veux passer à l'action ?"
        intro="Ce guide donne les fondamentaux. Pour passer du « je comprends » au « j'ai signé mon premier bail », tu as 2 options."
        bg="cream"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/formations/sous-location"
            className="group block rounded-2xl bg-ink p-8 text-cream transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-brand-green/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-light">
                Recommandé
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-extrabold">Sous-Location Academy</h3>
            <p className="mt-2 text-cream/80">
              La formation complète. 6 modules, 8h de contenu, accès à vie, support communauté. Tu signes ton premier bail dans les 30 jours.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-light group-hover:text-white">
              Voir le programme <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            href="https://cal.com/rentimmo-academy/appel-strategique?overlayCalendar=true"
            className="group block rounded-2xl border-2 border-ink/10 bg-white p-8 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-brand-dark/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
                Sur-mesure
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-extrabold text-ink">Appel stratégique 30 min</h3>
            <p className="mt-2 text-ink-muted">
              Tu hésites encore ? Réserve un appel offert avec notre équipe. On audit ta situation, on te dit honnêtement si la sous-location est faite pour toi.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-green">
              Réserver un créneau <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </LandingSection>

      <FinalCTA />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
