export type Formation = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  keyPoints: string[];
  duration: string;
  modules: number;
  price: string;
  badge?: string;
  accentIcon: "key" | "briefcase" | "sparkle";
  personas: { title: string; desc: string }[];
  program: { title: string; items: string[] }[];
  outcomes: string[];
  moroccoText: string;
  faq: { q: string; a: string }[];
  testimonials: { name: string; city: string; result: string }[];
};

export const formations: Formation[] = [
  {
    slug: "sous-location",
    name: "Sous-Location Academy",
    tagline: "Loue des biens que tu ne possèdes pas",
    description:
      "Génère des revenus Airbnb sans crédit, sans banque, sans apport. Tu loues un logement à un propriétaire, tu le sous-loues sur Airbnb, tu gardes la différence.",
    keyPoints: [
      "Trouver des propriétaires qui disent OUI",
      "Rédiger un bail avec les 3 clauses obligatoires",
      "Lancer ton annonce et obtenir tes premiers avis",
      "Automatiser la gestion depuis ton téléphone",
      "Calculer la rentabilité avant de signer",
    ],
    duration: "8h de contenu",
    modules: 6,
    price: "997 €",
    badge: "Bestseller",
    accentIcon: "key",
    personas: [
      { title: "Salarié qui veut sortir du 9-5", desc: "Tu veux un revenu complémentaire sans démissionner ni emprunter." },
      { title: "Jeune actif sans apport", desc: "Tu n'as pas 30K€ à mettre mais tu veux démarrer l'immobilier maintenant." },
      { title: "Entrepreneur LCD", desc: "Tu veux scaler sur 5, 10, 20 logements sans plafond bancaire." },
    ],
    program: [
      { title: "Module 1 — Les fondamentaux légaux", items: ["Le cadre juridique de la sous-location", "Les 3 clauses obligatoires dans ton bail", "Les baux commerciaux, mobility, étudiants", "Fiscalité : LMNP, BIC, micro-BIC"] },
      { title: "Module 2 — Trouver le bon propriétaire", items: ["Les 3 canaux qui convertissent vraiment", "Le pitch qui transforme un NON en OUI", "Gérer les objections classiques", "Négocier le loyer avec marge confortable"] },
      { title: "Module 3 — Visite, bail et signature", items: ["Checklist de visite en 12 points", "Rédiger le bail pas à pas", "Sécuriser la signature et la caution", "État des lieux photo"] },
      { title: "Module 4 — Ameublement et lancement", items: ["Budget ameublement optimisé", "Home staging qui photographie bien", "Photos qui convertissent sur Airbnb", "Rédiger l'annonce parfaite"] },
      { title: "Module 5 — Pricing et optimisation revenus", items: ["Pricing dynamique avec outils gratuits", "Obtenir les 10 premiers avis rapidement", "Monter en Superhost en 6 mois", "Multi-plateformes : Booking, Abritel"] },
      { title: "Module 6 — Automatisation et scale", items: ["Automatiser check-in/check-out", "Déléguer le ménage et la logistique", "Tableau de bord de suivi", "Passer de 1 à 10 logements"] },
      { title: "🇲🇦 Bonus Maroc", items: ["Cadre légal de la location courte durée au Maroc", "Plateformes actives au Maroc", "Fiscalité et déclarations", "Tanger, Marrakech, Casablanca : où se positionner"] },
    ],
    outcomes: [
      "Signer ton premier bail de sous-location",
      "Lancer ton annonce Airbnb en 7 jours",
      "Atteindre +700€ de cashflow mensuel net",
      "Automatiser 90% de la gestion",
      "Dupliquer le modèle sur d'autres logements",
      "Maîtriser le marché France ET Maroc",
    ],
    moroccoText:
      "Le marché marocain est une opportunité immense pour la sous-location. Ce module couvre la législation locale, les plateformes actives au Maroc, la fiscalité, et les meilleures villes pour démarrer — dont Tanger, Marrakech et Casablanca.",
    faq: [
      { q: "La sous-location est-elle légale en France ?", a: "Oui, à condition d'avoir l'accord écrit du propriétaire et de respecter le plafond de loyer. La formation couvre toutes les clauses et démarches." },
      { q: "Combien faut-il pour se lancer ?", a: "Entre 2 500 et 5 000 € pour le dépôt de garantie, le premier loyer et l'ameublement. Aucun crédit nécessaire." },
      { q: "Combien de temps avant les premiers revenus ?", a: "Entre 15 et 45 jours après signature du bail, selon la saison et la ville." },
      { q: "Est-ce que ça marche au Maroc ?", a: "Oui, le module Bonus Maroc est dédié à ça. Les villes touristiques sont particulièrement rentables." },
    ],
    testimonials: [
      { name: "Karim B.", city: "Paris 17e", result: "+1 200 €/mois net sur le premier logement en 45 jours" },
      { name: "Sophie L.", city: "Lyon", result: "3 logements signés en 6 mois, 2 800 €/mois net" },
      { name: "Yassine A.", city: "Tanger", result: "Premier bail signé au Maroc, +8 000 MAD/mois" },
    ],
  },
  {
    slug: "conciergerie-bnb",
    name: "Conciergerie BnB Academy",
    tagline: "Gère les biens des autres, encaisse les commissions",
    description:
      "Lance ta conciergerie Airbnb sans capital de départ. Tu gères les logements de propriétaires, tu prends 15 à 20% de commission sur chaque réservation.",
    keyPoints: [
      "Signer tes premiers mandats de gestion",
      "Fixer ta commission et tes tarifs",
      "Gérer check-in/check-out et ménage",
      "Automatiser les messages voyageurs",
      "Suivre ta rentabilité et scaler",
    ],
    duration: "10h de contenu",
    modules: 8,
    price: "1 497 €",
    badge: "Nouveau",
    accentIcon: "briefcase",
    personas: [
      { title: "Futur entrepreneur sans capital", desc: "Tu veux lancer un business rentable sans investir dans l'immo." },
      { title: "Salarié de l'hôtellerie/immo", desc: "Tu connais le secteur et tu veux te mettre à ton compte." },
      { title: "Hôte Airbnb qui veut scaler", desc: "Tu gères déjà 1-2 biens, tu veux passer à 15+." },
    ],
    program: [
      { title: "Module 1 — Le modèle économique", items: ["Commission forfait vs % : lequel choisir", "Calcul de rentabilité par mandat", "Juridique et statut (auto-entrepreneur, SASU)", "Assurances obligatoires"] },
      { title: "Module 2 — Prospecter les propriétaires", items: ["Les 5 canaux de prospection qui marchent", "Script de prise de contact", "Argumentaire : pourquoi te choisir", "Gestion des objections"] },
      { title: "Module 3 — Signer le mandat", items: ["Le mandat de gestion type", "Clauses protectrices pour toi", "Négocier la commission", "Onboarding du propriétaire"] },
      { title: "Module 4 — Mise en ligne du logement", items: ["Audit photo et home staging", "Rédaction d'annonce optimisée", "Multi-diffusion Airbnb/Booking/Abritel", "Paramétrage pricing dynamique"] },
      { title: "Module 5 — Opérations terrain", items: ["Checklist check-in / check-out", "Protocole ménage standardisé", "Gestion des urgences", "Maintenance préventive"] },
      { title: "Module 6 — Relation voyageur", items: ["Messages automatisés qui gardent 5 étoiles", "Gestion des litiges et réclamations", "Upsell services annexes", "Collecter les avis positifs"] },
      { title: "Module 7 — Finances et reporting", items: ["Tableau de bord propriétaire", "Comptabilité et facturation", "TVA et fiscalité conciergerie", "Reversement et transparence"] },
      { title: "Module 8 — Scaler ton équipe", items: ["Recruter ton premier agent terrain", "Process et SOP documentés", "Passer de 5 à 20 logements", "Sortie : revente de ton portefeuille"] },
      { title: "🇲🇦 Bonus Maroc", items: ["Cadre légal de la gestion locative au Maroc", "Relations avec les propriétaires locaux", "Plateformes actives au Maroc", "Marrakech, Tanger, Agadir : opportunités"] },
    ],
    outcomes: [
      "Signer ton premier mandat de gestion",
      "Encaisser ta première commission sous 30 jours",
      "Gérer 5 logements en parallèle sereinement",
      "Automatiser les messages et opérations",
      "Construire une équipe terrain fiable",
      "Attaquer le marché France ET Maroc",
    ],
    moroccoText:
      "La conciergerie Airbnb est en pleine explosion au Maroc. Ce module couvre le cadre légal de la gestion locative au Maroc, les relations avec les propriétaires locaux, les spécificités des plateformes au Maroc, et les opportunités dans les villes touristiques comme Marrakech, Tanger et Agadir.",
    faq: [
      { q: "Faut-il avoir une société pour lancer une conciergerie ?", a: "Non, tu peux démarrer en auto-entrepreneur. Nous te guidons sur le bon statut selon ton volume." },
      { q: "Quelle commission prendre ?", a: "Entre 15% et 25% selon les prestations. Le module pricing détaille tous les cas." },
      { q: "Et si le propriétaire veut récupérer son bien ?", a: "Le mandat type de la formation te protège avec un préavis clair et des clauses de sortie." },
      { q: "Peut-on lancer une conciergerie au Maroc ?", a: "Oui, le module Bonus Maroc détaille la démarche, les statuts et les villes à cibler." },
    ],
    testimonials: [
      { name: "Nadia R.", city: "Marseille", result: "8 mandats signés, 3 200 €/mois de commissions" },
      { name: "Thomas K.", city: "Bordeaux", result: "Première équipe montée à 3 personnes en 9 mois" },
      { name: "Fatima E.", city: "Marrakech", result: "5 riads en gestion, activité rentable dès le 2e mois" },
    ],
  },
  {
    slug: "cleaning-bnb",
    name: "Cleaning BnB Academy",
    tagline: "Deviens prestataire ménage Airbnb professionnel",
    description:
      "Lance ton activité de ménage professionnel dédiée aux logements Airbnb. Deviens le prestataire incontournable des hôtes et conciergeries de ta ville.",
    keyPoints: [
      "Créer ton offre et fixer tes tarifs",
      "Trouver tes premiers clients hôtes Airbnb",
      "Mettre en place le protocole ménage professionnel",
      "Gérer les équipes et les plannings",
      "Facturer et gérer ta comptabilité",
    ],
    duration: "6h de contenu",
    modules: 5,
    price: "697 €",
    accentIcon: "sparkle",
    personas: [
      { title: "Personne sans diplôme ni capital", desc: "Tu veux lancer un business rentable avec un investissement minime." },
      { title: "Déjà dans le nettoyage", desc: "Tu veux spécialiser ton activité sur le marché Airbnb très rémunérateur." },
      { title: "Étudiant / complément de revenu", desc: "Tu veux générer 1 500 à 3 000 €/mois en temps partiel." },
    ],
    program: [
      { title: "Module 1 — Construire ton offre", items: ["Le protocole ménage Airbnb en 27 points", "Fixer tes tarifs par ville et typologie", "Services additionnels rentables", "Statut juridique et assurance"] },
      { title: "Module 2 — Trouver des clients hôtes", items: ["Les canaux de prospection Airbnb", "Facebook groups et communautés locales", "Démarcher les conciergeries", "Pitch et argumentaire client"] },
      { title: "Module 3 — Le protocole pro", items: ["Checklist complète check-in", "Produits pro et équipement", "Linge et blanchisserie", "Contrôle qualité photos"] },
      { title: "Module 4 — Gérer équipes et planning", items: ["Recruter tes premières agents", "Planning multi-logements", "Outils de gestion (apps mobiles)", "Suivi qualité et formation continue"] },
      { title: "Module 5 — Comptabilité et scale", items: ["Facturation automatisée", "Comptabilité auto-entrepreneur", "Passer en société au bon moment", "De 10 à 50 logements gérés"] },
      { title: "🇲🇦 Bonus Maroc", items: ["Tarifs ménage BnB au Maroc", "Trouver des hôtes locaux", "Structurer une micro-entreprise au Maroc", "Villes touristiques à cibler"] },
    ],
    outcomes: [
      "Signer ton premier contrat ménage",
      "Atteindre 1 500 €/mois dès le 2e mois",
      "Recruter et former ta première agent",
      "Automatiser la facturation",
      "Construire un portefeuille de 20 logements",
      "Lancer au Maroc avec un capital minimal",
    ],
    moroccoText:
      "Le ménage BnB est l'activité la plus simple à lancer au Maroc sans capital. Ce module couvre les tarifs adaptés au marché marocain, comment trouver des clients parmi les hôtes Airbnb locaux, et comment structurer une micro-entreprise de ménage au Maroc.",
    faq: [
      { q: "Faut-il un diplôme pour faire du ménage pro ?", a: "Non. Une bonne organisation et le protocole de la formation suffisent pour être reconnu comme pro." },
      { q: "Combien gagne un prestataire ménage BnB ?", a: "Entre 1 500 € et 6 000 € / mois selon le volume et si tu as une équipe." },
      { q: "Quel matériel faut-il au départ ?", a: "Moins de 500 € d'équipement pro. Le module 3 détaille la liste exacte." },
      { q: "Le modèle fonctionne-t-il au Maroc ?", a: "Oui, c'est même l'activité la plus accessible au Maroc avec un capital très faible." },
    ],
    testimonials: [
      { name: "Laura M.", city: "Nantes", result: "12 logements en rotation, 2 400 €/mois net" },
      { name: "Mehdi O.", city: "Lille", result: "Équipe de 2 personnes, 4 100 €/mois à 8 mois" },
      { name: "Salma H.", city: "Casablanca", result: "Premier contrat signé en 3 semaines" },
    ],
  },
];

export function getFormation(slug: string) {
  return formations.find((f) => f.slug === slug);
}
