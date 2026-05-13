import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Sparkles, Clock, TrendingUp, Star } from "lucide-react";
import LandingHero from "@/components/sections/LandingHero";
import LandingSection from "@/components/sections/LandingSection";
import FinalCTA from "@/components/sections/FinalCTA";

const SITE = "https://www.rentimmoacademy.fr";
const URL = `${SITE}/menage-airbnb-professionnel`;

export const metadata: Metadata = {
  title: "Ménage Airbnb professionnel : devenir cleaner BnB en 2026",
  description:
    "Comment devenir cleaner Airbnb professionnel : standards hôteliers, tarification au m², premiers clients conciergeries. Le guide pour lancer ton activité de ménage BnB en 2026.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Ménage Airbnb professionnel : devenir cleaner BnB en 2026 | Rentimmo Academy",
    description:
      "Standards hôteliers, tarification, premiers clients. Le guide pour lancer ton activité de cleaner Airbnb pro.",
    url: URL,
    type: "article",
  },
};

const FAQS = [
  {
    q: "C'est quoi exactement un cleaner Airbnb pro ?",
    a: "Un cleaner Airbnb professionnel (ou 'cleaning BnB') est un prestataire de ménage spécialisé dans les rotations courtes Airbnb. Il intervient entre chaque check-out et check-in pour remettre le logement aux standards hôteliers : draps changés, salle de bain impeccable, consommables remplacés, photos avant/après. Tarification fixe par rotation (35 à 80€ selon taille).",
  },
  {
    q: "Quel statut juridique pour un cleaner Airbnb ?",
    a: "Auto-entrepreneur (régime micro-entreprise) pour démarrer : créé en 24h en ligne, gratuit, charges allégées (~22% URSSAF). Code APE 8121Z (Nettoyage courant des bâtiments) ou 9603Z (Services personnels). À partir de 35K€ de CA/an : passage en EURL ou SASU avec choix IR/IS.",
  },
  {
    q: "Combien on facture une rotation de ménage Airbnb ?",
    a: "Tarif standard en France 2026 : Studio 30-50€, T2 50-70€, T3 70-90€, T4+ 90-120€. Le tarif inclut : ménage complet, changement draps + serviettes, remise en place, consommables (savon, papier toilette, café). Hors linge fourni (souvent facturé +5-10€ par set ou inclus pour les conciergeries qui fournissent leur stock).",
  },
  {
    q: "Combien on gagne en faisant cleaner Airbnb à temps plein ?",
    a: "À 60€ moyenne par rotation et 4 rotations/jour ouvrable : ~6 000€ CA brut mensuel. Net après URSSAF + frais véhicule + produits : 3 500-4 500€. Au-delà tu recrutes une équipe : 3 cleaners externalisés à 30% commission = potentiel 10-15K€/mois nets sans toucher un balai.",
  },
  {
    q: "Comment trouver mes premiers clients ?",
    a: "Tes meilleurs clients = les conciergeries Airbnb (elles ont 5-30 logements à nettoyer chaque semaine, contrats récurrents). Prospection : (1) LinkedIn 'conciergerie airbnb [ville]', (2) Google Maps + email cold, (3) groupes Facebook 'hôtes airbnb [ville]'. Avec une bonne offre tu signes 2-3 conciergeries en 6 semaines = ~80 rotations/mois assurées.",
  },
  {
    q: "Quel matériel pour démarrer ?",
    a: "Aspirateur pro (200-400€), serpillière + microfibres pro, kit produits ménagers (150€), véhicule pour transport (utilitaire ou voiture avec coffre + remorque), set de draps de rechange (200-300€ pour démarrer). Total : 800 à 1 500€ d'investissement initial. Rentabilisé en 3-4 semaines de boulot.",
  },
];

export default function MenageAirbnbProfessionnelPage() {
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
      { "@type": "ListItem", position: 2, name: "Ménage Airbnb professionnel", item: URL },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Ménage Airbnb professionnel : devenir cleaner BnB en 2026",
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
    name: "Comment lancer ton activité de cleaner Airbnb pro en 30 jours",
    description:
      "Les 5 étapes pour créer ton statut, définir ta tarification, signer tes premières conciergeries et délivrer une qualité hôtelière à chaque rotation.",
    totalTime: "P30D",
    estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: "1500" },
    inLanguage: "fr-FR",
    step: [
      { "@type": "HowToStep", position: 1, name: "Créer ton statut auto-entrepreneur", text: "Création en ligne en 24h gratuit sur autoentrepreneur.urssaf.fr (code APE 8121Z). Souscrire assurance RC pro (~25€/mois). Acheter le matériel de base (800-1 500€)." },
      { "@type": "HowToStep", position: 2, name: "Définir ton offre tarifaire", text: "Grille claire : Studio 35€, T2 55€, T3 75€, T4 95€. Inclus : ménage complet, draps, consommables. Options : linge fourni (+8€), check-in (+15€), urgence (+30%)." },
      { "@type": "HowToStep", position: 3, name: "Trouver tes 3 premières conciergeries", text: "LinkedIn search 'conciergerie airbnb [ville]' + email/DM avec offre claire. Google Maps + appels. Groupes Facebook 'hôtes airbnb [ville]'. Objectif 3 conciergeries = 50-80 rotations récurrentes." },
      { "@type": "HowToStep", position: 4, name: "Délivrer impeccable et obtenir des reviews", text: "Photos avant/après envoyées au proprio à chaque rotation. Standard hôtelier non négociable. 2 reviews 5 étoiles parfaites = recommandation à 5 autres conciergeries." },
      { "@type": "HowToStep", position: 5, name: "Recruter et déléguer dès le mois 4", text: "Quand tu satures (90 rotations/mois solo), recrutement d'un 1er cleaner externe à 30% de commission. Tu passes du métier à l'entreprise." },
    ],
  };

  return (
    <>
      <LandingHero
        kicker="Métier rentable, peu connu"
        h1="Ménage Airbnb pro : devenir cleaner BnB en 2026"
        intro="Le ménage Airbnb professionnel est un des métiers les plus rentables et stables du secteur LCD : tarif fixe par rotation, demande croissante, faible barrière à l'entrée. Voici comment lancer ton activité de cleaner BnB en 2026."
        primaryCta={{ href: "/formations/cleaning-bnb", label: "Voir la formation" }}
        secondaryCta={{ href: "https://cal.com/rentimmoacademy/appel-strategique?overlayCalendar=true", label: "Réserver un appel" }}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Ménage Airbnb professionnel" }]}
      />

      <LandingSection kicker="Le métier" title="Cleaner Airbnb pro : c'est quoi exactement ?" bg="cream">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-lg leading-relaxed text-ink">
              Un <strong>cleaner Airbnb professionnel</strong> (ou prestataire de cleaning BnB) prend en charge le ménage de rotation entre voyageurs sur les locations courte durée. Il travaille avec les <strong>conciergeries Airbnb</strong>, les <strong>hôtes propriétaires actifs</strong> et les <strong>sous-locataires professionnels</strong>.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink">
              C'est un métier <strong>récurrent</strong> (mêmes biens à nettoyer chaque semaine), <strong>scalable</strong> (tu peux recruter une équipe), et avec une <strong>marge attractive</strong> (60-70% net après charges).
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
            <h3 className="text-xl font-bold text-ink">Une rotation type, étape par étape</h3>
            <ul className="mt-4 space-y-3">
              {[
                "État des lieux d'arrivée : photos avant ménage",
                "Aspirateur + lavage sols (toutes pièces)",
                "Cuisine : nettoyage profond plaque, four, frigo",
                "Salle de bain : sanitaires, robinetterie, miroirs",
                "Draps : changement complet + lit refait",
                "Serviettes : changement + pliage hôtelier",
                "Consommables : café, savon, PQ, sacs poubelle",
                "Photos finales pour le proprio + remise des clés",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 size-5 flex-shrink-0 text-brand-green" />
                  <span className="text-ink">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm italic text-ink-muted">Durée moyenne : 1h30 (studio) à 3h (T4+).</p>
          </div>
        </div>
      </LandingSection>

      <LandingSection
        kicker="Pourquoi ça paie autant"
        title="3 raisons pour lesquelles le cleaner BnB est rentable"
        bg="white"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Clock,
              title: "Tarif horaire élevé",
              desc: "Une rotation T2 à 60€ qui prend 1h30 = 40€/h net (vs 12-15€/h pour ménage chez particuliers). La spécialisation Airbnb justifie le premium.",
            },
            {
              icon: TrendingUp,
              title: "Récurrence garantie",
              desc: "Une conciergerie cliente avec 10 logements = 30 à 50 rotations par mois assurées. Tu signes 2-3 conciergeries et tu as un planning rempli pour 12 mois.",
            },
            {
              icon: Star,
              title: "Évolution rapide",
              desc: "Mois 1-3 : tu fais toi-même. Mois 4-6 : tu recrutes 1 cleaner externe à 30% commission. Mois 12 : équipe de 3-4 cleaners, tu pilotes, tu gagnes 8-12K€/mois sans toucher un balai.",
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
        kicker="Tarifs et revenus"
        title="Combien gagne un cleaner Airbnb pro ?"
        bg="cream"
      >
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
          <table className="w-full">
            <thead className="bg-ink text-cream">
              <tr>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">Niveau</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">Rotations/mois</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">CA mensuel</th>
                <th className="p-4 text-left text-sm font-bold uppercase tracking-wider">Net après charges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {[
                ["Démarrage solo (mi-temps)", "30-40", "1 800-2 400 €", "≈ 1 200-1 600 €"],
                ["Solo temps plein", "70-90", "4 200-5 400 €", "≈ 2 800-3 600 €"],
                ["+ 1 cleaner externe (30% comm)", "120-160", "7 200-9 600 €", "≈ 4 800-6 200 €"],
                ["Équipe de 4 cleaners", "300-400", "18 000-24 000 €", "≈ 10 000-14 000 €"],
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
          Net après charges = CA − URSSAF − véhicule (carburant + amortissement) − produits ménagers − assurance pro − sous-traitance cleaners. Hors impôt sur le revenu. Médiane sur biens 60-110€/nuit.
        </p>
      </LandingSection>

      <LandingSection kicker="Plan d'action" title="Lancer ton activité cleaner BnB en 30 jours" bg="white">
        <ol className="space-y-6">
          {[
            { num: "01", t: "Statut auto-entrepreneur", d: "Création en ligne (24h, gratuit) sur autoentrepreneur.urssaf.fr. Code APE 8121Z. Souscription assurance RC pro (~25€/mois). Achat du matériel de base (800-1 500€)." },
            { num: "02", t: "Définir ton offre tarifaire", d: "Grille tarifaire claire : Studio 35€, T2 55€, T3 75€, T4 95€. Inclus : ménage complet, draps, consommables. Options : linge fourni (+8€), check-in (+15€), urgence (+30%). La transparence = bouche-à-oreille." },
            { num: "03", t: "Trouver tes 3 premières conciergeries", d: "LinkedIn search 'conciergerie airbnb [ville]' + email/DM avec offre claire. Google Maps + appels. Groupes Facebook 'hôtes airbnb [ville]'. Objectif : 3 conciergeries clientes = 50-80 rotations récurrentes." },
            { num: "04", t: "Délivrer impeccable et obtenir des reviews", d: "Photos avant/après envoyées au proprio à chaque rotation. Standard hôtelier non négociable. 2 reviews 5 étoiles parfaites = recommandation à 5 autres conciergeries via le réseau." },
            { num: "05", t: "Recruter et déléguer (mois 4+)", d: "Quand tu satures (90 rotations/mois solo), recrutement d'un 1er cleaner externe : 30% de commission sur les rotations qu'il fait. Tu passes du métier à l'entreprise. Outils : Notion pour planning, WhatsApp groupe équipe, paiement Pennylane." },
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

      <LandingSection kicker="FAQ" title="Questions fréquentes sur le ménage Airbnb pro" bg="cream">
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
        title="Tu veux te lancer ?"
        intro="Tu as les fondamentaux. Pour devenir opérationnel et signer tes premières conciergeries en 30-45 jours, voici ton chemin."
        bg="white"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/formations/cleaning-bnb"
            className="group block rounded-2xl bg-ink p-8 text-cream transition-transform hover:-translate-y-1"
          >
            <span className="rounded-full bg-brand-green/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-light">
              Recommandé
            </span>
            <h3 className="mt-4 text-2xl font-extrabold">Cleaning BnB Academy</h3>
            <p className="mt-2 text-cream/80">
              Formation complète : statut, standards hôteliers, tarification, prospection conciergeries, gestion d'équipe. Tu signes tes premiers contrats en 30 jours.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-light group-hover:text-white">
              Voir le programme <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            href="/devenir-conciergerie-airbnb"
            className="group block rounded-2xl border-2 border-ink/10 bg-cream p-8 transition-transform hover:-translate-y-1"
          >
            <span className="rounded-full bg-brand-dark/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
              Alternative
            </span>
            <h3 className="mt-4 text-2xl font-extrabold text-ink">Plutôt conciergerie complète ?</h3>
            <p className="mt-2 text-ink-muted">
              Si tu veux gérer aussi l'annonce, les voyageurs et la maintenance (et pas que le ménage), regarde notre guide pour devenir conciergerie Airbnb complète.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-bold text-brand-green">
              Voir le guide <ArrowRight size={16} />
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
