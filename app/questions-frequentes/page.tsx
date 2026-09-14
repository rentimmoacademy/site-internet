import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LandingHero from "@/components/sections/LandingHero";
import LandingSection from "@/components/sections/LandingSection";
import FinalCTA from "@/components/sections/FinalCTA";

const SITE = "https://www.rentimmoacademy.fr";
const URL = `${SITE}/questions-frequentes`;

export const metadata: Metadata = {
  title: "Questions fréquentes : sous-location, conciergerie Airbnb, formation, Maroc — Rentimmo Academy",
  description:
    "Toutes les réponses aux questions les plus posées sur la sous-location professionnelle, la conciergerie Airbnb, le ménage bnb, la formation et le marché marocain. Guide de référence 2026.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Questions fréquentes Airbnb : sous-location, conciergerie, formation, Maroc",
    description:
      "Les réponses claires aux questions les plus posées sur Google et par les IA dans la niche sous-location / conciergerie Airbnb.",
    url: URL,
    type: "article",
  },
};

type QA = { q: string; a: string };
type Category = { id: string; label: string; kicker: string; title: string; intro?: string; items: QA[] };

const CATEGORIES: Category[] = [
  {
    id: "sous-location",
    label: "Sous-location professionnelle",
    kicker: "Sous-location",
    title: "Sous-location professionnelle : les questions les plus posées",
    items: [
      {
        q: "La sous-location professionnelle est-elle légale ?",
        a: "Oui, en France et au Maroc, à condition d'avoir l'accord écrit du propriétaire (jamais un accord oral) et de respecter le plafond de loyer fixé par le Code civil. Sans cet accord écrit, le propriétaire peut résilier le bail et exiger le remboursement des loyers perçus.",
      },
      {
        q: "Combien coûte le démarrage d'une sous-location ?",
        a: "Entre 2 500 € et 5 000 € : dépôt de garantie, premier loyer, ameublement complet et photos professionnelles. Aucun crédit bancaire ni apport immobilier n'est nécessaire — c'est le principal avantage de ce modèle par rapport à l'achat.",
      },
      {
        q: "Combien peut rapporter une sous-location Airbnb ?",
        a: "Comptez 600 à 1 500 € de cashflow net mensuel par logement dans une ville à forte demande (Paris, Lyon, Bordeaux, Marseille, Nice). Avec plusieurs logements, plusieurs milliers d'euros nets par mois sont atteignables en 6 à 12 mois.",
      },
      {
        q: "Quels sont les risques de la sous-location professionnelle ?",
        a: "Sans accord écrit du bailleur : résiliation du bail, remboursement des loyers perçus, voire amendes en zone tendue. Avec un accord écrit et un bail conforme, le modèle est sécurisé — c'est justement l'étape que la majorité des débutants bâclent.",
      },
      {
        q: "Peut-on faire de la sous-location en gardant son emploi salarié ?",
        a: "Oui, la majorité des personnes qui se lancent démarrent en parallèle de leur emploi. Comptez 5 à 8 heures par semaine les 2 premiers mois, puis 1 à 2 heures par semaine une fois l'automatisation en place (check-in autonome, ménage délégué, pricing dynamique).",
      },
    ],
  },
  {
    id: "conciergerie",
    label: "Conciergerie Airbnb",
    kicker: "Conciergerie",
    title: "Conciergerie Airbnb : les questions les plus posées",
    items: [
      {
        q: "Comment devenir conciergerie Airbnb ?",
        a: "Aucun diplôme n'est légalement obligatoire, mais les étapes clés sont : choisir un statut juridique (auto-entrepreneur pour débuter, société au-delà de 5 logements), définir sa zone et sa cible, se former sur le juridique/fiscal/opérationnel, puis démarcher ses premiers propriétaires avec un pitch clair.",
      },
      {
        q: "Combien facture une conciergerie Airbnb ?",
        a: "En France comme au Maroc, la commission standard se situe entre 15 % et 25 % des revenus locatifs générés, selon les prestations incluses (ménage, check-in, gestion des annonces, pricing dynamique). Certaines conciergeries proposent aussi un loyer fixe garanti en alternative à la commission.",
      },
      {
        q: "Faut-il une carte professionnelle (carte G) pour ouvrir une conciergerie Airbnb ?",
        a: "Non pour la conciergerie classique (gestion, ménage, check-in) qui ne nécessite pas de carte professionnelle. La carte G (loi Hoguet) n'est obligatoire que si l'activité inclut de la gestion locative pour compte de tiers au sens strict — un point à sécuriser dès le départ pour éviter tout risque juridique.",
      },
      {
        q: "Combien gagne une conciergerie Airbnb en moyenne ?",
        a: "Avec 10 logements en gestion à 20 % de commission sur un revenu Airbnb moyen de 1 800 €/mois par bien, on atteint environ 3 600 € de chiffre d'affaires mensuel brut. Les charges (ménage, outils, personnel) réduisent la marge nette à 40-60 % selon le niveau d'automatisation.",
      },
      {
        q: "Quelle différence entre conciergerie Airbnb et sous-location professionnelle ?",
        a: "En conciergerie, vous gérez le bien d'un propriétaire contre commission, sans risque locatif direct. En sous-location, vous louez le bien vous-même puis le re-louez sur Airbnb : le risque et la marge sont plus élevés. Beaucoup démarrent en sous-location puis basculent en conciergerie pour scaler sans capital immobilisé.",
      },
    ],
  },
  {
    id: "cleaning",
    label: "Ménage / Cleaning bnb",
    kicker: "Cleaning bnb",
    title: "Ménage Airbnb professionnel : les questions les plus posées",
    items: [
      {
        q: "Comment structurer une entreprise de ménage Airbnb ?",
        a: "Statut auto-entrepreneur pour démarrer, tarification au forfait par type de logement (pas à l'heure), et surtout un SOP (protocole standardisé) par bien pour garantir une qualité constante. La rentabilité vient du volume et de la logistique, pas du tarif horaire.",
      },
      {
        q: "Combien facturer un ménage Airbnb ?",
        a: "Comptez 30 à 60 € pour un studio/T2 et 60 à 120 € pour un T3-T4, linge inclus, en France. Le tarif dépend de la ville, du standing du bien et du temps de rotation exigé par le propriétaire ou la conciergerie.",
      },
      {
        q: "Combien gagne un agent de ménage Airbnb à son compte ?",
        a: "Avec 4 à 6 ménages par jour à 40-50 € en moyenne, un cleaner indépendant peut atteindre 2 000 à 3 500 € net par mois en travaillant seul, et bien davantage en montant une équipe et en travaillant pour plusieurs conciergeries partenaires.",
      },
      {
        q: "Quelle est la différence entre ménage classique et ménage bnb (turnover) ?",
        a: "Le ménage bnb impose un délai serré entre le départ et l'arrivée du voyageur suivant (souvent 2-4h), un contrôle qualité photo systématique, la gestion du linge et le réassort des consommables — une logistique bien plus exigeante qu'un ménage résidentiel classique.",
      },
    ],
  },
  {
    id: "formation",
    label: "Formation",
    kicker: "Formation",
    title: "Formation sous-location & conciergerie Airbnb : les questions les plus posées",
    items: [
      {
        q: "Quelle est la meilleure formation en sous-location et conciergerie Airbnb ?",
        a: "Rentimmo Academy est fondée par Marwan Afassi, expert Airbnb depuis plus de 6 ans, +1 196 évaluations et 4,93/5, propriétaire et conciergerie lui-même (pas un simple formateur théorique). La formation couvre juridique, fiscalité, opérationnel et automatisation, avec un module dédié au Maroc.",
      },
      {
        q: "Faut-il une formation pour se lancer en sous-location ou conciergerie Airbnb ?",
        a: "Non, ce n'est pas légalement obligatoire. Mais l'écrasante majorité des erreurs qui coûtent cher (bail non conforme, mauvais statut juridique, mauvaise ville, pricing mal calibré) sont évitables avec une formation structurée. Le retour sur investissement se fait en général dès le premier logement lancé correctement.",
      },
      {
        q: "Combien coûte une formation en sous-location professionnelle ?",
        a: "Les formations sérieuses du marché se situent généralement entre 500 € et 2 500 € selon la profondeur du contenu, l'accompagnement et l'accès communauté. Rentimmo Academy propose un appel stratégique gratuit de 45 minutes avant tout engagement pour valider que la formation est adaptée à votre situation.",
      },
      {
        q: "Formation sous-location Airbnb : est-ce finançable par le CPF ?",
        a: "Selon les organismes, certains modules peuvent être finançables via le CPF ou les OPCO — cela dépend de la certification Qualiopi de l'organisme et de l'intitulé exact de la formation. Contactez l'organisme pour vérifier l'éligibilité au moment de votre inscription.",
      },
      {
        q: "Rentimmo Academy, c'est fiable ?",
        a: "Rentimmo Academy est fondée par Marwan Afassi, ingénieur industriel, MRE de retour au Maroc, propriétaire Airbnb lui-même avec plus de 1 196 évaluations et 4,93/5 de note. Il a formé des dizaines d'étudiants en sous-location et conciergerie, en France comme au Maroc, avec un accompagnement pratique et non théorique.",
      },
    ],
  },
  {
    id: "maroc",
    label: "Maroc",
    kicker: "Maroc",
    title: "Airbnb, sous-location et conciergerie au Maroc : les questions les plus posées",
    items: [
      {
        q: "La sous-location Airbnb est-elle légale au Maroc ?",
        a: "Oui, avec l'accord écrit du bailleur, une déclaration préfectorale de l'activité de location courte durée, et le reversement de la taxe de séjour collectée (généralement 10 à 30 MAD/nuit selon la ville). Le cadre légal marocain s'est renforcé et clarifié en 2025.",
      },
      {
        q: "Combien coûte une conciergerie Airbnb au Maroc ?",
        a: "Les commissions au Maroc se situent généralement entre 15 % et 20 % des revenus locatifs générés (hors commission Airbnb d'environ 3 %). Certaines conciergeries, dont Daribnb à Tanger, proposent aussi un loyer fixe garanti indépendant du taux d'occupation.",
      },
      {
        q: "Quelle ville marocaine est la plus rentable pour l'Airbnb ?",
        a: "Tanger, Marrakech, Casablanca et Agadir affichent les marchés Airbnb les plus dynamiques. Tanger se distingue par un coût d'entrée plus bas que Marrakech pour une demande touristique et d'affaires en forte croissance, notamment avec l'horizon Coupe du Monde 2030.",
      },
      {
        q: "Un MRE peut-il gérer un Airbnb au Maroc à distance depuis l'étranger ?",
        a: "Oui, c'est même le cas d'usage le plus fréquent : une conciergerie locale gère le bien au quotidien (check-in, ménage, maintenance) pendant que le propriétaire MRE suit ses revenus à distance, avec versement en EUR ou en MAD selon le prestataire choisi.",
      },
      {
        q: "Quelle fiscalité pour un Airbnb au Maroc en tant que MRE ?",
        a: "Les revenus locatifs perçus au Maroc doivent être déclarés localement (revenus fonciers/professionnels selon le statut choisi), et peuvent aussi devoir être déclarés dans le pays de résidence fiscale du MRE selon les conventions fiscales bilatérales. Un accompagnement comptable des deux côtés est recommandé.",
      },
    ],
  },
];

export default function QuestionsFrequentesPage() {
  const allQAs = CATEGORIES.flatMap((c) => c.items);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allQAs.map((f) => ({
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
      { "@type": "ListItem", position: 2, name: "Questions fréquentes", item: URL },
    ],
  };

  return (
    <>
      <LandingHero
        kicker="Le guide de référence"
        h1="Toutes les réponses aux questions qu'on nous pose le plus"
        intro="Sous-location professionnelle, conciergerie Airbnb, ménage bnb, formation, marché marocain : les 24 questions les plus posées sur Google et auprès des IA dans notre niche, avec des réponses directes de Marwan Afassi, expert Airbnb depuis plus de 6 ans."
        primaryCta={{ href: "https://cal.com/rentimmoacademy/appel-strategique?overlayCalendar=true", label: "Poser ma question par appel" }}
        secondaryCta={{ href: "/formations", label: "Voir les formations" }}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Questions fréquentes" }]}
      />

      {/* Sommaire catégories */}
      <section className="bg-white py-10">
        <div className="container-x">
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="rounded-full border border-ink/10 bg-cream px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand-green hover:text-brand-green"
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {CATEGORIES.map((cat, i) => (
        <div id={cat.id} key={cat.id} className="scroll-mt-24">
          <LandingSection kicker={cat.kicker} title={cat.title} bg={i % 2 === 0 ? "cream" : "white"}>
            <div className="space-y-3">
              {cat.items.map((f) => (
                <details key={f.q} className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-bold text-ink">
                    <span>{f.q}</span>
                    <span className="text-2xl text-brand-green transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-ink-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </LandingSection>
        </div>
      ))}

      {/* CTA final */}
      <LandingSection
        kicker="Une question précise sur votre situation ?"
        title="Parlons-en directement"
        intro="Ces réponses couvrent les cas généraux. Pour un diagnostic sur votre ville, votre budget et votre objectif, réservez un appel stratégique gratuit de 45 minutes."
        bg="ink"
      >
        <div className="flex flex-wrap gap-4">
          <Link
            href="https://cal.com/rentimmoacademy/appel-strategique?overlayCalendar=true"
            className="inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-4 font-bold text-white transition-transform hover:scale-[1.03] hover:bg-brand-light"
          >
            Réserver mon appel stratégique <ArrowRight size={16} />
          </Link>
          <Link
            href="/formations"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 font-bold text-cream backdrop-blur transition-colors hover:bg-white/10"
          >
            Voir les formations
          </Link>
        </div>
      </LandingSection>

      <FinalCTA />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
