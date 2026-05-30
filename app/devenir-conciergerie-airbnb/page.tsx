import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Briefcase, Users, BarChart3, ShieldCheck } from "lucide-react";
import LandingHero from "@/components/sections/LandingHero";
import LandingSection from "@/components/sections/LandingSection";
import FinalCTA from "@/components/sections/FinalCTA";

const SITE = "https://www.rentimmoacademy.fr";
const URL = `${SITE}/devenir-conciergerie-airbnb`;

export const metadata: Metadata = {
  title: "Devenir conciergerie Airbnb : guide pour se lancer en 2026 — Conciergerie BnB Academy",
  description:
    "Comment lancer ta conciergerie Airbnb sans capital ni diplôme : statut juridique, tarification, premiers clients, contrats. Guide pratique 2026 par la Conciergerie BnB Academy — Rentimmo Academy.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Devenir conciergerie Airbnb 2026 — Conciergerie BnB Academy",
    description:
      "Statut juridique, tarification, premiers clients. Le guide pratique de la Conciergerie BnB Academy (Rentimmo Academy) pour lancer en 2026.",
    url: URL,
    type: "article",
  },
};

const FAQS = [
  {
    q: "Faut-il un diplôme pour ouvrir une conciergerie Airbnb ?",
    a: "Non, aucun diplôme obligatoire. Il faut simplement un statut juridique adapté (auto-entrepreneur, EURL ou SASU), une déclaration d'activité auprès de l'URSSAF, et une assurance responsabilité civile professionnelle. La compétence métier s'acquiert par formation et expérience terrain.",
  },
  {
    q: "Quel statut juridique choisir pour démarrer ?",
    a: "Pour les premiers mois : auto-entrepreneur (régime micro-entreprise) — simple, rapide à créer, charges allégées (~22% de cotisations). Dès que le CA dépasse 35-40K€/an : passage en EURL ou SASU avec choix IR ou IS selon optimisation fiscale. La formation Conciergerie BnB Academy détaille les 3 scenarios.",
  },
  {
    q: "Quelle commission prendre aux propriétaires ?",
    a: "Le standard du marché en France est 15 à 25% du chiffre d'affaires généré. La fourchette dépend du service inclus : 15-18% pour gestion administrative + voyageurs uniquement ; 20-25% pour gestion complète avec ménage et linge inclus. Au Maroc : 20 à 30% selon les villes (premium à Tanger, Marrakech).",
  },
  {
    q: "Combien de temps pour signer mon premier client ?",
    a: "Avec une bonne méthode de prospection (LinkedIn, Facebook groupes propriétaires, partenariats agences immo locales) et un argumentaire structuré : 2 à 6 semaines pour signer le premier mandat. La majorité de nos étudiants Conciergerie BnB Academy signent leur 1er client en moins de 30 jours.",
  },
  {
    q: "Combien rapporte une conciergerie Airbnb avec 5 logements ?",
    a: "Sur un portefeuille type de 5 appartements en zone touristique avec une commission moyenne de 20% : entre 4 000 et 8 000 € de revenus mensuels nets, selon la saisonnalité et le ticket moyen. Avec 10 logements : 8 000 à 16 000 €. C'est un modèle scalable sans investissement matériel lourd.",
  },
  {
    q: "Quels outils sont indispensables ?",
    a: "Channel manager (Hostaway, Smoobu ou Lodgify ~ 25-50€/mois/bien), automation messages (Hospitable / Smartbnb ~ 10€/mois/bien), CRM clients (Notion ou HubSpot Free), comptabilité (Indy / Tiime). Total ~ 80-150€/mois pour 5 logements gérés. Le ROI est immédiat dès le 2e bien.",
  },
];

export default function DevenirConciergerieAirbnbPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
      { "@type": "ListItem", position: 2, name: "Devenir conciergerie Airbnb", item: URL },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Devenir conciergerie Airbnb : guide pour se lancer en 2026",
    description: metadata.description,
    author: { "@type": "Person", "@id": `${SITE}/#marwan`, name: "Marwan Afassi" },
    publisher: { "@id": `${SITE}/#organization` },
    datePublished: "2026-05-07",
    dateModified: "2026-05-07",
    mainEntityOfPage: URL,
    inLanguage: "fr-FR",
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Comment lancer ta conciergerie Airbnb en 60 jours",
    description:
      "Les 5 étapes pour créer ton statut, définir ton offre, signer tes premiers clients propriétaires et délivrer une qualité Superhost dès le premier mandat.",
    totalTime: "P60D",
    inLanguage: "fr-FR",
    step: [
      { "@type": "HowToStep", position: 1, name: "Créer ton statut juridique", text: "Auto-entrepreneur en 24h gratuit sur autoentrepreneur.urssaf.fr (code APE 6810Z ou 8299Z). Souscrire l'assurance RC pro (Hiscox, Allianz : 25-40€/mois)." },
      { "@type": "HowToStep", position: 2, name: "Définir ton offre et ta tarification", text: "Choisir ta zone géographique (1 ville pour démarrer), ta cible (proprios occasionnels vs MRE absents), ta commission (15-25%), et tes services inclus." },
      { "@type": "HowToStep", position: 3, name: "Trouver tes premiers clients propriétaires", text: "3 canaux qui marchent : Facebook groupes proprios Airbnb, LinkedIn, partenariats agences immo locales avec commission croisée." },
      { "@type": "HowToStep", position: 4, name: "Setup outils et processus", text: "Channel manager (Hostaway/Smoobu : 25-50€/bien/mois), automation messages (Hospitable), checklist prise en main, templates contrat de mandat." },
      { "@type": "HowToStep", position: 5, name: "Onboarder et délivrer une qualité Superhost", text: "Photos pro du logement (300€ ROI massif), refonte annonce, multi-canaux Airbnb+Booking+Vrbo, communication voyageur réactive. Le 1er proprio recommande à 2-3 amis dans les 60 jours." },
    ],
  };

  return (
    <>
      <LandingHero
        kicker="Lancer son activité"
        h1="Devenir conciergerie Airbnb : se lancer en 2026 sans capital"
        intro="Tu veux ouvrir ta conciergerie Airbnb en France ou au Maroc ? Tu n'as pas besoin de logements en propre — tu gères ceux des autres et tu prends 15 à 25% de commission. Voici comment se lancer concrètement, étape par étape."
        primaryCta={{ href: "/formations/conciergerie-bnb", label: "Voir la formation" }}
        secondaryCta={{ href: "https://cal.com/rentimmoacademy/appel-strategique?overlayCalendar=true", label: "Réserver un appel" }}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Devenir conciergerie Airbnb" }]}
      />

      <LandingSection
        kicker="Le métier en clair"
        title="C'est quoi une conciergerie Airbnb, concrètement ?"
        bg="cream"
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-lg leading-relaxed text-ink">
              Une <strong>conciergerie Airbnb</strong> gère pour le compte de propriétaires les opérations d'une location courte durée : annonce, communication voyageurs, check-in / check-out, ménage, linge, maintenance. En contrepartie, elle prélève une commission sur le chiffre d'affaires (15 à 25% en France, jusqu'à 30% au Maroc selon la ville).
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink">
              C'est un <strong>business sans stock, sans fonds de commerce, sans matériel lourd</strong>. Tes seuls coûts fixes : assurance pro (~30€/mois), outils SaaS (~80-150€/mois pour 5 biens gérés), et ton temps.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
            <h3 className="text-xl font-bold text-ink">Ce qu'inclut typiquement une conciergerie</h3>
            <ul className="mt-4 space-y-3">
              {[
                "Création et optimisation de l'annonce Airbnb / Booking / Vrbo",
                "Pricing dynamique multi-plateformes",
                "Communication voyageurs 7j/7",
                "Check-in et remise de clés (sur place ou autonome)",
                "Coordination ménage + linge hôtelier",
                "Gestion des incidents et maintenance courante",
                "Reporting mensuel détaillé au propriétaire",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 flex-shrink-0 text-brand-green" />
                  <span className="text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LandingSection>

      <LandingSection
        kicker="Pourquoi maintenant"
        title="Le marché 2026 : opportunité massive et concurrence faible"
        intro="Le marché de la conciergerie Airbnb explose en France et au Maroc, avec un déséquilibre fort entre l'offre (peu de conciergeries pros) et la demande (proprios débordés ou MRE)."
        bg="white"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: BarChart3,
              title: "Marché en croissance",
              desc: "+22% de logements Airbnb en France 2024-2026. La majorité des nouveaux proprios cherchent une conciergerie dans les 6 mois (ils sous-estiment toujours la charge mentale).",
            },
            {
              icon: Users,
              title: "Demande MRE explosive",
              desc: "Les Marocains résidant à l'étranger sont une clientèle massive : ils ont des biens à Tanger, Marrakech, Casablanca mais habitent en France/Belgique/Espagne. Ils CHERCHENT activement des conciergeries de confiance.",
            },
            {
              icon: ShieldCheck,
              title: "Barrières à l'entrée faibles",
              desc: "Aucun diplôme requis, statut auto-entrepreneur en 24h, premiers clients possibles dès le mois 1. Mais la qualité prime — le marché est sale, il y a de la place pour les pros sérieux.",
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

      <LandingSection
        kicker="Combien on gagne"
        title="Revenus typiques d'une conciergerie Airbnb"
        intro="Médianes constatées sur les conciergeries que nos étudiants ont lancé en 2024-2026 (France & Maroc)."
        bg="cream"
      >
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
          <table className="w-full">
            <thead className="bg-ink text-cream">
              <tr>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">Portefeuille</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">CA mensuel généré</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">Commission (20%)</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">Net après charges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {[
                ["3 logements", "9 000 €", "1 800 €", "≈ 1 400 €"],
                ["5 logements", "15 000 €", "3 000 €", "≈ 2 400 €"],
                ["10 logements", "32 000 €", "6 400 €", "≈ 5 200 €"],
                ["20 logements (avec assistant)", "70 000 €", "14 000 €", "≈ 10 500 €"],
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
          Net après charges = commission − URSSAF − outils SaaS − sous-traitance ménage − assurance. Hors impôt sur le revenu. Médiane sur biens de 70-110€/nuit, 70-80% taux d'occupation.
        </p>
      </LandingSection>

      <LandingSection
        kicker="Plan d'action"
        title="Les 5 étapes pour lancer ta conciergerie en 60 jours"
        bg="white"
      >
        <ol className="space-y-6">
          {[
            { num: "01", t: "Créer ton statut juridique", d: "Auto-entrepreneur en 24h sur autoentrepreneur.urssaf.fr — gratuit, code APE 6810Z (Activités des marchands de biens immobiliers) ou 8299Z (Autres activités de soutien aux entreprises). Souscrire l'assurance RC pro (Hiscox, Allianz : 25-40€/mois)." },
            { num: "02", t: "Définir ton offre et ta tarification", d: "Choisir ta zone géo (1 ville pour démarrer), ta cible (proprios occasionnels vs investisseurs MRE), ta commission (15 à 25%), et tes services inclus vs en option. Plus c'est précis, plus tu vends." },
            { num: "03", t: "Trouver tes premiers clients propriétaires", d: "3 canaux qui marchent : (1) Facebook groupes 'propriétaires Airbnb', (2) LinkedIn proprios immobiliers, (3) partenariats avec agences immo locales (commission croisée). Le pitch fait toute la différence : 'on génère 30% de revenus en plus que la gestion en direct'." },
            { num: "04", t: "Setup outils et processus", d: "Channel manager (Hostaway 30j gratuit, puis 25-50€/bien/mois), automation messages (Hospitable), checklist de prise en main (clés, accès, équipement, photos), templates contrat de mandat. Tout doit être prêt AVANT le 1er client." },
            { num: "05", t: "Onboarder et délivrer", d: "Premier client = bouche-à-oreille gold mine si tu délivres. Photos pro du logement (300€ ROI massif), refonte annonce, multi-canaux, communication voyageur réactive. Objectif : le 1er proprio te recommande à 2-3 amis dans les 60 jours." },
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

      <LandingSection kicker="FAQ" title="Questions fréquentes sur la conciergerie Airbnb" bg="cream">
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white p-6">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-ink">
                <span>{f.q}</span>
                <span className="text-2xl text-brand-green transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 leading-relaxed text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </LandingSection>

      <LandingSection
        kicker="Aller plus loin"
        title="Tu veux te lancer pour de vrai ?"
        intro="Ce guide te donne le cadre. Pour devenir opérationnel et signer ton premier client en 30 jours, tu as 2 chemins."
        bg="white"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/formations/conciergerie-bnb"
            className="group block rounded-2xl bg-ink p-8 text-cream transition-transform hover:-translate-y-1"
          >
            <span className="rounded-full bg-brand-green/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-light">
              Recommandé
            </span>
            <h3 className="mt-4 text-2xl font-extrabold">Conciergerie BnB Academy</h3>
            <p className="mt-2 text-cream/80">
              Formation complète : statut, prospection, contrats, outils, automation. Tu lances ta conciergerie et tu signes ton 1er proprio en 30-45 jours. Bonus Maroc inclus.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-light group-hover:text-white">
              Voir le programme <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            href="/sous-location-professionnelle"
            className="group block rounded-2xl border-2 border-ink/10 bg-cream p-8 transition-transform hover:-translate-y-1"
          >
            <span className="rounded-full bg-brand-dark/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
              Alternative
            </span>
            <h3 className="mt-4 text-2xl font-extrabold text-ink">Plutôt sous-louer toi-même ?</h3>
            <p className="mt-2 text-ink-muted">
              Si tu préfères louer des biens et les sous-louer en ton nom (vs gérer ceux des autres), regarde notre guide sous-location.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-green">
              Voir le guide <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </LandingSection>


      {/* Outil audit annonce */}
      <section className="bg-ink py-16">
        <div className="container-x">
          <div className="rounded-3xl border border-brand-green/20 bg-brand-green/5 p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-green mb-2">Outil gratuit</p>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Auditez votre annonce Airbnb en 90 secondes</h3>
              <p className="text-white/55 text-sm mt-1">Score /100 · Benchmark concurrents · Titre réoptimisé par IA</p>
            </div>
            <Link
              href="/outils/audit-annonce"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-bold text-white transition-all hover:bg-brand-light"
            >
              Analyser mon annonce <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
