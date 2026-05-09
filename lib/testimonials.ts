// Témoignages clients — sources publiques uniquement (Trustpilot, YouTube, vidéos publiques).
// Tout témoignage ajouté ici DOIT pouvoir être recoupé par un tiers (URL source obligatoire).
// Cela protège juridiquement (DGCCRF, Code conso L121-2) et SEO (Google Helpful Content).

export type Testimonial = {
  id: string;
  firstName: string;
  city?: string;
  formation?:
    | "sous-location"
    | "conciergerie-bnb"
    | "cleaning-bnb"
    | "super-bnb"
    | "academy";
  result?: string; // chiffre clé visible immédiatement
  quote: string;
  source:
    | { type: "trustpilot"; url: string; rating: 1 | 2 | 3 | 4 | 5; date: string }
    | { type: "youtube"; videoId: string; videoTitle: string; date?: string }
    | { type: "google-review"; url?: string; rating: 1 | 2 | 3 | 4 | 5; date?: string }
    | { type: "interview-prive"; date?: string; consentDate?: string };
  longContent?: string;
};

const TRUSTPILOT_URL = "https://fr.trustpilot.com/review/rentimmoacademy.fr";

/**
 * Témoignages publics actuellement utilisables.
 * Tous récupérés depuis https://fr.trustpilot.com/review/rentimmoacademy.fr (avis publics 5★).
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "cliente-2025-05",
    firstName: "Cliente vérifiée",
    formation: "sous-location",
    result: "Premier bien acquis",
    quote:
      "Très bon accompagnement de la création d'entreprise et de votre site web jusqu'au premier bien acquis, live toutes les semaines pour traiter des sujets ou les nouveautés qui peuvent impacter l'activité de la LCD. Je recommande.",
    source: { type: "trustpilot", url: TRUSTPILOT_URL, rating: 5, date: "2025-05-22" },
  },
  {
    id: "abdoulaziz-2025-05",
    firstName: "Abdoulaziz",
    formation: "sous-location",
    result: "Premier bien obtenu en toute légalité",
    quote:
      "J'ai suivi la formation de Rentimmo Academy sur la sous-location professionnelle et je suis extrêmement satisfait. Grâce aux enseignements clairs, pratiques et bien structurés, j'ai pu mettre rapidement en application les conseils reçus et obtenir mon premier bien en toute légalité. L'équipe est disponible, pédagogue et vraiment investie dans la réussite des élèves. Si vous cherchez une formation sérieuse pour vous lancer dans l'immobilier sans avoir à acheter, je recommande Rentimmo les yeux fermés. Merci pour cette belle aventure qui ne fait que commencer !",
    source: { type: "trustpilot", url: TRUSTPILOT_URL, rating: 5, date: "2025-05-13" },
  },
  {
    id: "nassim-2025-05",
    firstName: "Nassim",
    formation: "sous-location",
    result: "Lancé en LCD depuis zéro",
    quote:
      "La formation Rentimmo Academy m'a été très utile pour le lancement de mon activité de Location Courte Durée. Des formateurs compétents, à l'écoute et assez réactifs. Un suivi régulier qui permet de motiver les « élèves, entrepreneurs ». Une formation assez complète dans l'ensemble, ce qui permet de se lancer de 0. Je recommande fortement Rentimmo Academy.",
    source: { type: "trustpilot", url: TRUSTPILOT_URL, rating: 5, date: "2025-05-20" },
  },
  {
    id: "kevin-bouhenna-2025-01",
    firstName: "Kevin Bouhenna",
    formation: "sous-location",
    result: "3 partenariats signés en 2 mois",
    quote:
      "J'ai adoré mon accompagnement avec Marwan qui pour moi est le meilleur dans le domaine de la sous location ! Je suis au 3 eme partenariat mis en place en seulement deux mois. Le contenu du programme est vraiment de qualité, de plus Marwan nous aide beaucoup lors des réunions. Je recommande !",
    source: { type: "trustpilot", url: TRUSTPILOT_URL, rating: 5, date: "2025-01-10" },
  },
  {
    id: "cozi-place-2024-06",
    firstName: "Cozi Place",
    formation: "academy",
    quote:
      "J'ai eu un accompagnement très complet avec un personnel très à l'écoute. Je dirais que le contenu de la formation est à l'image de ce qui était annoncé. Je suis très content et je recommande !",
    source: { type: "trustpilot", url: TRUSTPILOT_URL, rating: 5, date: "2024-06-17" },
  },
  {
    id: "sabria-2023-12",
    firstName: "Sabria",
    formation: "academy",
    quote:
      "Je n'ai pas encore eu l'opportunité de suivre la formation de RIACADEMY, mais j'ai pu échanger de nombreuses fois avec Marwan. Il est toujours de très bons conseils, il vous motive à passer à l'action et surtout, il le fait avec bon cœur. Vous ne serez pas déçu.",
    source: { type: "trustpilot", url: TRUSTPILOT_URL, rating: 5, date: "2023-12-05" },
  },
  {
    id: "hijama-cupping-2023-11",
    firstName: "Hijama Cupping",
    formation: "academy",
    quote:
      "Ma formation avec Rentimmoacademy a été pour moi un tremplin sûr et efficace pour que je puisse envisager un véritable changement dans ma vie pro et personnel ! L'accompagnement de Marwan a porté ses fruits et je me suis sentie accompagnée et conseillée tout au long de cette période. Un grand merci à toute l'équipe.",
    source: { type: "trustpilot", url: TRUSTPILOT_URL, rating: 5, date: "2023-11-27" },
  },
  {
    id: "yassine-kaddouri-2023-11",
    firstName: "Yassine Kaddouri",
    formation: "sous-location",
    quote:
      "J'ai pris un accompagnement le 10 octobre 2023 avec rentimmoacademy car j'avais du mal à démarcher des propriétaires, beaucoup de questions concernant cette activité. Marwan m'a énormément aidé et a su transformer mes points faibles en points forts. Je conseille fortement l'accompagnement avec Marwan pour ceux qui commencent l'activité de LCD, cela vous permettra de gagner énormément de temps et de ne pas faire des erreurs pouvant mettre en péril la pérennité de votre activité.",
    source: { type: "trustpilot", url: TRUSTPILOT_URL, rating: 5, date: "2023-11-13" },
  },
  // ============================================================================
  // PROCHAINES ENTRÉES À AJOUTER (en attente de Marwan):
  //
  // - Vidéos témoignages YouTube longue forme (URLs à fournir par Marwan)
  // - Avis Trustpilot supplémentaires si > 12 avis publics dispo
  // - Témoignages WhatsApp avec consentement écrit (Nassim, Yassine A., Abdoulaziz, etc.)
  // ============================================================================
];

// Aggregate rating dérivé pour le schema (calculé sur les témoignages vérifiables ci-dessus)
export const AGGREGATE_RATING = {
  ratingValue:
    Math.round(
      (TESTIMONIALS.filter(
        (t) => t.source.type === "trustpilot" || t.source.type === "google-review"
      ).reduce(
        (acc, t) =>
          acc +
          ((t.source as { rating?: number }).rating ?? 5),
        0
      ) /
        Math.max(
          1,
          TESTIMONIALS.filter(
            (t) =>
              t.source.type === "trustpilot" || t.source.type === "google-review"
          ).length
        )) *
        10
    ) / 10,
  reviewCount: TESTIMONIALS.length,
  bestRating: 5,
  worstRating: 1,
};
