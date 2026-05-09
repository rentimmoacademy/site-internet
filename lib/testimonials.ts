// Témoignages clients — sources publiques uniquement (Trustpilot, YouTube, vidéos publiques).
// Tout témoignage ajouté ici DOIT pouvoir être recoupé par un tiers (URL source obligatoire).
// Cela protège juridiquement (DGCCRF, Code conso L121-2) et SEO (Google Helpful Content).

export type Testimonial = {
  id: string;
  // Identification (public uniquement — pas de nom complet sans accord explicite)
  firstName: string;
  city?: string;
  formation?: "sous-location" | "conciergerie-bnb" | "cleaning-bnb" | "super-bnb" | "academy";
  // Le résultat / quote
  result?: string; // chiffre clé visible immédiatement
  quote: string; // citation
  // Sourcing (obligatoire pour la vérifiabilité)
  source:
    | { type: "trustpilot"; url: string; rating: 1 | 2 | 3 | 4 | 5; date?: string }
    | { type: "youtube"; videoId: string; videoTitle: string; date?: string }
    | { type: "google-review"; url?: string; rating: 1 | 2 | 3 | 4 | 5; date?: string }
    | { type: "interview-prive"; date?: string; consentDate?: string };
  // Optionnel
  longContent?: string; // version longue si la quote est un extrait
};

/**
 * Témoignages publics actuellement utilisables.
 *
 * À enrichir au fur et à mesure que :
 * - les vidéos témoignages YouTube de Rentimmo sont identifiées
 * - les étudiants Nassim, Yassine, Abdoulaziz valident par WhatsApp leur citation
 * - de nouveaux avis Trustpilot tombent
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "trustpilot-extrait-1",
    firstName: "Étudiant Trustpilot",
    formation: "academy",
    quote:
      "Une formation très utile pour le lancement de mon activité de location courte durée. Les formateurs sont compétents et à l'écoute, avec un suivi régulier qui motive vraiment les élèves. Une formation complète qui permet de se lancer de zéro.",
    source: {
      type: "trustpilot",
      url: "https://fr.trustpilot.com/review/rentimmoacademy.fr",
      rating: 5,
    },
  },
  {
    id: "trustpilot-extrait-2",
    firstName: "Étudiant Trustpilot",
    formation: "sous-location",
    quote:
      "Grâce aux enseignements clairs, pratiques et bien structurés, j'ai pu mettre rapidement en application les conseils reçus et obtenir mon premier bien en toute légalité. L'équipe est disponible, pédagogue et vraiment investie dans la réussite des élèves.",
    source: {
      type: "trustpilot",
      url: "https://fr.trustpilot.com/review/rentimmoacademy.fr",
      rating: 5,
    },
  },
  // ============================================================================
  // PROCHAINES ENTRÉES À AJOUTER (en attente de Marwan):
  //
  // 1. Nassim — résultat exact + ville + accord WhatsApp
  // 2. Yassine — résultat exact + ville + accord WhatsApp
  // 3. Abdoulaziz — résultat exact + ville + accord WhatsApp
  // 4-8. Vidéos témoignages YouTube longue forme (URLs à fournir)
  //
  // Format à venir pour les YouTube :
  // {
  //   id: "yt-nassim",
  //   firstName: "Nassim", city: "Lyon", formation: "sous-location",
  //   result: "+1 200 €/mois sur le 1er bien en 45 jours",
  //   quote: "Citation extraite du timestamp [X:XX] de la vidéo",
  //   source: { type: "youtube", videoId: "XXXXX", videoTitle: "Le parcours de Nassim" }
  // }
  // ============================================================================
];

// Aggregate rating dérivé pour le schema (à recalculer quand on a + de témoignages vérifiables)
export const AGGREGATE_RATING = {
  ratingValue: 4.9, // basé sur les 12 avis Trustpilot publics (note moyenne)
  reviewCount: TESTIMONIALS.length,
  bestRating: 5,
  worstRating: 1,
};
