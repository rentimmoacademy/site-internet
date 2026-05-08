import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, Globe2, MapPin, FileText, TrendingUp } from "lucide-react";
import LandingHero from "@/components/sections/LandingHero";
import LandingSection from "@/components/sections/LandingSection";
import FinalCTA from "@/components/sections/FinalCTA";

const SITE = "https://rentimmo-academy.fr";
const URL = `${SITE}/se-former-airbnb-maroc`;

export const metadata: Metadata = {
  title: "Se former à Airbnb au Maroc en 2026 : guide complet",
  description:
    "Investir et se former à la sous-location ou conciergerie Airbnb au Maroc en 2026 : Tanger, Marrakech, Casablanca, Agadir. Guide MRE, fiscalité, formations spécialisées.",
  alternates: { canonical: URL },
  openGraph: {
    title: "Se former à Airbnb au Maroc en 2026 : guide complet | Rentimmo Academy",
    description:
      "Sous-location, conciergerie, ménage Airbnb au Maroc — guide complet pour MRE et résidents : marché, fiscalité, formations.",
    url: URL,
    type: "article",
  },
};

const FAQS = [
  {
    q: "Pourquoi le Maroc est-il une opportunité Airbnb en 2026 ?",
    a: "Avec la Coupe du Monde 2030 co-organisée par le Maroc, le tourisme international est en explosion : +30% de nuitées hôtelières en 2024-2026. Les principales villes (Tanger, Marrakech, Casablanca, Agadir) ont une demande Airbnb croissante alors que l'offre reste fragmentée et peu professionnalisée. Coût d'entrée bas vs France = marges plus élevées sur biens équivalents.",
  },
  {
    q: "Je suis MRE en France, comment je me forme depuis l'étranger ?",
    a: "Toutes les formations Rentimmo Academy (Sous-Location, Conciergerie, Cleaning) sont 100% en ligne, accès à vie, support en français. Spécifiquement chaque formation inclut un module Bonus Maroc dédié : législation locale, plateformes actives, fiscalité, meilleures villes. Tu peux démarrer ton activité au Maroc sans bouger de France.",
  },
  {
    q: "Quelle ville choisir pour démarrer Airbnb au Maroc ?",
    a: "Tanger pour MRE (proximité Europe, marché en croissance, prix entry-level abordable). Marrakech pour tourisme international (forte demande, mais saturation et concurrence). Casablanca pour business (clientèle pro, Tanger Med, financements). Agadir pour saisonnier balnéaire (été cartonne, hiver plus calme). On détaille chaque marché dans le module Bonus Maroc des formations.",
  },
  {
    q: "Quel cadre légal pour Airbnb au Maroc en 2026 ?",
    a: "Loi Airbnb Maroc 2025 impose : déclaration préfectorale obligatoire avant mise en ligne, taxe de séjour à reverser trimestriellement (10-30 MAD/nuit selon ville), conformité incendie minimale, registre des voyageurs tenu 5 ans. Sanctions : 5 000 à 20 000 MAD si non conforme. Les formations couvrent toutes ces démarches.",
  },
  {
    q: "Quelle fiscalité pour un MRE qui fait Airbnb au Maroc ?",
    a: "Les revenus locatifs au Maroc sont déclarés en revenus fonciers (régime micro < 30K MAD/an avec 40% d'abattement, ou réel simplifié au-delà). Pour les MRE résidents fiscaux français : conventions fiscales bilatérales France-Maroc évitent la double imposition (le Maroc taxe en priorité, crédit d'impôt en France). Comptable spécialisé MRE : 1 500-3 000 MAD/an.",
  },
  {
    q: "Combien rapporte un Airbnb à Tanger vs en France ?",
    a: "T2 Tanger Malabata : ~12 000-15 000 MAD/mois CA brut, ~4 500 MAD loyer si sous-location pro = +5 500-8 000 MAD net. T2 Lyon centre : ~2 200-2 600€ CA brut, 900€ loyer = +800-1 200€ net (équivalent ~9 000-13 000 MAD). Tanger souvent plus rentable en % grâce au coût d'entrée plus bas, France plus rentable en valeur absolue.",
  },
  {
    q: "Faut-il être au Maroc pour gérer son Airbnb ?",
    a: "Pas nécessairement. La conciergerie locale (comme Daribnb à Tanger, fondée par Marwan lui-même MRE) gère ton bien à distance : tu touches un revenu mensuel sans bouger de France. C'est le modèle privilégié par 70% des MRE qu'on accompagne — rentable et zéro charge mentale.",
  },
];

export default function SeFormerAirbnbMarocPage() {
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
      { "@type": "ListItem", position: 2, name: "Se former à Airbnb au Maroc", item: URL },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Se former à Airbnb au Maroc en 2026 : guide complet",
    description: metadata.description,
    author: { "@type": "Person", name: "Marwan Afassi" },
    publisher: { "@id": `${SITE}/#organization` },
    datePublished: "2026-05-07",
    dateModified: "2026-05-07",
    mainEntityOfPage: URL,
    inLanguage: "fr-FR",
  };

  return (
    <>
      <LandingHero
        kicker="🇲🇦 Spécial Maroc & MRE"
        h1="Se former à Airbnb au Maroc en 2026"
        intro="Coupe du Monde 2030, marché en explosion, coût d'entrée 3x plus bas qu'en France : le Maroc est l'opportunité Airbnb la plus claire de la décennie. Voici comment t'y positionner — en sous-location, conciergerie ou ménage pro — depuis la France ou sur place."
        primaryCta={{ href: "/formations", label: "Voir toutes les formations" }}
        secondaryCta={{ href: "https://cal.com/rentimmo-academy/appel-strategique?overlayCalendar=true", label: "Réserver un appel" }}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Se former à Airbnb au Maroc" }]}
      />

      <LandingSection kicker="Le marché 2026" title="Pourquoi le Maroc maintenant ?" bg="cream">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              title: "Coupe du Monde 2030",
              desc: "Le Maroc co-organise avec l'Espagne et le Portugal. Investissements massifs en infrastructures hôtelières et transport. La demande Airbnb explose dès 2026-2027 sur tout le pays.",
            },
            {
              icon: MapPin,
              title: "Coût d'entrée 3x plus bas",
              desc: "Un T2 Tanger Malabata se loue 4 500 MAD (~420€). Le même standing en Lyon centre : 900-1 100€. Marges proportionnellement plus élevées sur biens équivalents.",
            },
            {
              icon: Globe2,
              title: "Demande européenne forte",
              desc: "FR, BE, NL, ES, DE : les voyageurs européens représentent 60% des nuitées Airbnb au Maroc. Demande stable été-hiver-printemps, accélération en 2026-2030.",
            },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
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
        kicker="3 modèles, 3 formations"
        title="Quel métier choisir au Maroc ?"
        intro="Selon ton apport, ton temps disponible et ton appétence, voici le bon modèle."
        bg="white"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/formations/sous-location" className="group block rounded-2xl bg-cream p-6 transition-transform hover:-translate-y-1">
            <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
              Sans apport
            </span>
            <h3 className="mt-4 text-xl font-bold text-ink">Sous-location pro</h3>
            <p className="mt-2 text-ink-muted">
              Tu loues des biens à des proprios marocains, tu sous-loues sur Airbnb avec leur accord. Démarrage avec 25-50K MAD (2,5-5K€).
            </p>
            <p className="mt-4 text-sm font-bold text-brand-dark">Idéal : MRE en France qui veut démarrer au Maroc sans crédit local.</p>
            <span className="mt-4 inline-flex items-center gap-2 font-bold text-brand-green group-hover:gap-3 transition-all">
              Voir la formation <ArrowRight size={14} />
            </span>
          </Link>

          <Link href="/formations/conciergerie-bnb" className="group block rounded-2xl bg-cream p-6 transition-transform hover:-translate-y-1">
            <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
              0€ investissement
            </span>
            <h3 className="mt-4 text-xl font-bold text-ink">Conciergerie Airbnb</h3>
            <p className="mt-2 text-ink-muted">
              Tu gères les biens d'autres proprios (locaux ou MRE absents). Commission 20-30% selon ville. Énorme demande sur Tanger / Marrakech.
            </p>
            <p className="mt-4 text-sm font-bold text-brand-dark">Idéal : tu vis au Maroc et veux servir les MRE qui ont besoin de toi sur place.</p>
            <span className="mt-4 inline-flex items-center gap-2 font-bold text-brand-green group-hover:gap-3 transition-all">
              Voir la formation <ArrowRight size={14} />
            </span>
          </Link>

          <Link href="/formations/cleaning-bnb" className="group block rounded-2xl bg-cream p-6 transition-transform hover:-translate-y-1">
            <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-dark">
              Cash récurrent
            </span>
            <h3 className="mt-4 text-xl font-bold text-ink">Cleaning BnB</h3>
            <p className="mt-2 text-ink-muted">
              Tu deviens prestataire de ménage pour les conciergeries marocaines. Récurrent, scalable, marges saines. Très peu de pros sur ce créneau au Maroc.
            </p>
            <p className="mt-4 text-sm font-bold text-brand-dark">Idéal : tu vis au Maroc et veux un revenu rapide et stable.</p>
            <span className="mt-4 inline-flex items-center gap-2 font-bold text-brand-green group-hover:gap-3 transition-all">
              Voir la formation <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </LandingSection>

      <LandingSection kicker="Cadre légal" title="La législation Airbnb Maroc 2026" bg="cream">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
            <div className="flex items-center gap-3">
              <FileText className="size-6 text-brand-green" />
              <h3 className="text-xl font-bold text-ink">Démarches obligatoires</h3>
            </div>
            <ul className="mt-4 space-y-2 text-ink">
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Déclaration préfectorale (avant mise en ligne)</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Numéro d'enregistrement obligatoire dans l'annonce</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Taxe de séjour collectée + reversée trimestriellement</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Registre voyageurs tenu et archivé 5 ans</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Conformité incendie : détecteur fumée, sortie sécurisée</li>
            </ul>
            <p className="mt-4 text-sm italic text-ink-muted">Sanction si non-conforme : 5 000 à 20 000 MAD + suspension annonce.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-ink/5">
            <div className="flex items-center gap-3">
              <Globe2 className="size-6 text-brand-green" />
              <h3 className="text-xl font-bold text-ink">Spécifique MRE</h3>
            </div>
            <ul className="mt-4 space-y-2 text-ink">
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Convention fiscale France-Maroc (pas de double imposition)</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Versement loyers/commissions en MAD ou EUR</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Comptable spécialisé MRE recommandé (1,5-3K MAD/an)</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Mandat de gestion à distance via DocuSign possible</li>
              <li className="flex items-start gap-2"><Check size={16} className="mt-1 flex-shrink-0 text-brand-green" />Déclaration revenus à faire dans les 2 pays (mais 0€ payé France grâce à la convention)</li>
            </ul>
          </div>
        </div>
      </LandingSection>

      <LandingSection kicker="Top 4 villes" title="Où démarrer au Maroc en 2026 ?" bg="white">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Tanger", profile: "MRE, business Tanger Med, weekenders européens", entry: "25-40K MAD/mois CA T2", best: "🏆 Meilleur pour MRE débutants" },
            { name: "Marrakech", profile: "Tourisme international premium, riads, expérience", entry: "30-60K MAD/mois CA T2", best: "Forte demande mais concurrence saturée" },
            { name: "Casablanca", profile: "Business, tourisme d'affaires, expats", entry: "20-35K MAD/mois CA T2", best: "Idéal pour cible pros / longue durée" },
            { name: "Agadir", profile: "Saisonnier balnéaire, familles européennes", entry: "18-32K MAD/mois CA T2", best: "Excellent ratio rentabilité / prix entrée" },
          ].map((c) => (
            <div key={c.name} className="rounded-2xl bg-cream p-6">
              <h3 className="text-2xl font-extrabold text-ink">{c.name}</h3>
              <p className="mt-3 text-sm font-bold uppercase tracking-wider text-brand-dark">{c.best}</p>
              <p className="mt-3 text-sm text-ink-muted">{c.profile}</p>
              <p className="mt-3 text-sm font-bold text-ink">{c.entry}</p>
            </div>
          ))}
        </div>
      </LandingSection>

      <LandingSection kicker="FAQ" title="Questions fréquentes Airbnb Maroc" bg="cream">
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

      <FinalCTA />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
