// Lexique LCD (Location Courte Durée) — 50 termes définis pour SEO IA
// Cible : pages glossaire = source #1 citée par les LLMs (ChatGPT, Claude, Perplexity)
// pour les questions définitionnelles ("c'est quoi un bail commercial dérogatoire", etc.)

export type LexiqueTerm = {
  slug: string;
  term: string;
  short: string; // une phrase
  full: string; // 2-4 phrases
  related?: string[]; // slugs liés
  category:
    | "juridique"
    | "fiscal"
    | "operationnel"
    | "marketing"
    | "plateformes"
    | "metiers";
};

export const LEXIQUE: LexiqueTerm[] = [
  // ==== JURIDIQUE ====
  {
    slug: "sous-location-professionnelle",
    term: "Sous-location professionnelle",
    short:
      "Modèle où tu loues un bien à un propriétaire puis le re-loues en courte durée avec son accord.",
    full:
      "La sous-location professionnelle consiste à louer un logement à un propriétaire (le bailleur principal) puis à le re-louer en location meublée touristique (Airbnb, Booking, Vrbo) avec son accord écrit. Tu encaisses la différence entre les revenus locatifs et le loyer payé. C'est un modèle 100% légal en France à condition de respecter 3 règles : accord écrit du propriétaire, respect du plafond de loyer (article 8 de la Loi de 1989), et déclaration en mairie pour les communes l'imposant.",
    related: ["bail-commercial-derogatoire", "loi-alur", "lmnp"],
    category: "juridique",
  },
  {
    slug: "bail-commercial-derogatoire",
    term: "Bail commercial dérogatoire",
    short:
      "Bail de courte durée (max 3 ans) utilisé pour la sous-location professionnelle.",
    full:
      "Le bail commercial dérogatoire est un contrat de location commerciale d'une durée maximale de 3 ans, encadré par l'article L145-5 du Code de commerce. C'est le bail le plus utilisé en sous-location professionnelle car il permet une flexibilité côté locataire (toi) tout en sécurisant le propriétaire. À l'issue des 3 ans, soit tu signes un nouveau bail dérogatoire (dans certaines limites), soit tu passes en bail commercial classique (9 ans).",
    related: ["sous-location-professionnelle", "bail-mobilite"],
    category: "juridique",
  },
  {
    slug: "bail-mobilite",
    term: "Bail mobilité",
    short:
      "Bail courte durée (1 à 10 mois) pour étudiants/salariés en mission, sans dépôt de garantie.",
    full:
      "Le bail mobilité est un contrat de location meublée d'une durée de 1 à 10 mois, créé par la Loi ELAN de 2018. Il s'adresse aux étudiants, apprentis, salariés en mutation/mission/formation. Pas de dépôt de garantie possible, pas de reconduction tacite. Utile pour la sous-location pro si tu vises ce segment, mais moins flexible que le bail commercial dérogatoire pour du Airbnb classique.",
    related: ["bail-commercial-derogatoire", "loi-elan"],
    category: "juridique",
  },
  {
    slug: "loi-alur",
    term: "Loi ALUR",
    short:
      "Loi de 2014 qui a structuré la location courte durée en France (numéro d'enregistrement, déclaration mairie).",
    full:
      "La Loi ALUR (Accès au Logement et Urbanisme Rénové) de 2014 a posé le cadre légal moderne de la location meublée touristique en France. Elle impose la déclaration en mairie pour les communes l'exigeant, le respect du plafond de 120 nuits/an pour la résidence principale, et l'affichage du numéro d'enregistrement sur les annonces Airbnb / Booking. Les sanctions ont été durcies en 2024-2025 par la Loi Le Meur.",
    related: ["loi-le-meur", "numero-enregistrement", "changement-usage"],
    category: "juridique",
  },
  {
    slug: "loi-le-meur",
    term: "Loi Le Meur",
    short:
      "Loi de novembre 2024 qui a alourdi la fiscalité Airbnb et durci les contrôles.",
    full:
      "La Loi Le Meur (du nom de la députée Annaïg Le Meur) votée le 19 novembre 2024 et applicable depuis le 1er janvier 2025 a profondément modifié la fiscalité de la location meublée touristique. Elle a réduit l'abattement micro-BIC de 50% à 30% pour les meublés non classés, abaissé le plafond du micro-BIC à 15 000 €/an, et renforcé les pouvoirs des maires pour limiter les Airbnb. Les meublés classés tourisme ★★★+ conservent un abattement à 71%.",
    related: ["lmnp", "micro-bic", "regime-reel"],
    category: "juridique",
  },
  {
    slug: "changement-usage",
    term: "Changement d'usage",
    short:
      "À Paris et 30+ villes : autorisation administrative requise pour louer un logement en courte durée plus de 120 nuits/an.",
    full:
      "Le changement d'usage est une autorisation administrative obligatoire à Paris et dans 30+ villes en zones tendues (Lyon, Bordeaux, Nice, etc.) pour utiliser un local d'habitation en location meublée touristique plus de 120 nuits/an. À Paris, l'autorisation exige une compensation : remettre sur le marché locatif longue durée un autre local commercial de surface équivalente dans le même arrondissement. Quasi-impossible en pratique pour un investisseur classique.",
    related: ["loi-alur", "120-nuits"],
    category: "juridique",
  },
  {
    slug: "120-nuits",
    term: "Plafond 120 nuits",
    short:
      "Limite annuelle de location courte durée pour une résidence principale en France.",
    full:
      "Tu peux louer ta résidence principale en location meublée touristique jusqu'à 120 nuits par année civile. Au-delà, le bien est requalifié en résidence secondaire (taxe d'habitation, fiscalité différente) et soumis à autorisation de changement d'usage dans les villes concernées. Ce plafond ne s'applique PAS à la sous-location professionnelle (où le bien n'est pas ta résidence principale).",
    related: ["changement-usage", "loi-alur"],
    category: "juridique",
  },
  {
    slug: "numero-enregistrement",
    term: "Numéro d'enregistrement",
    short:
      "Identifiant obligatoire à afficher sur les annonces Airbnb dans 200+ communes.",
    full:
      "Depuis la Loi ALUR, les communes peuvent imposer un numéro d'enregistrement obligatoire pour toute annonce de location meublée touristique. Délivré par la mairie sous 48-72h après dépôt du dossier (gratuit), il doit être affiché sur Airbnb / Booking / Vrbo. L'absence du numéro entraîne la suppression automatique de l'annonce + amende 5 000-15 000 €. Concerne Paris, Lyon, Bordeaux, Marseille, Nice, Toulouse, et 200+ communes touristiques.",
    related: ["loi-alur", "loi-le-meur"],
    category: "juridique",
  },
  {
    slug: "loi-elan",
    term: "Loi ELAN",
    short:
      "Loi de 2018 qui a notamment créé le bail mobilité.",
    full:
      "La Loi ELAN (Évolution du Logement, de l'Aménagement et du Numérique) de novembre 2018 a apporté plusieurs innovations en matière de logement, dont la création du bail mobilité (1 à 10 mois pour étudiants/salariés en mission). Elle a aussi posé les bases des sanctions modernes pour les locations courte durée non conformes.",
    related: ["bail-mobilite", "loi-alur"],
    category: "juridique",
  },
  {
    slug: "loi-hoguet",
    term: "Loi Hoguet",
    short:
      "Loi de 1970 régulant les professions immobilières (carte G obligatoire pour la gestion locative).",
    full:
      "La Loi Hoguet du 2 janvier 1970 encadre les professions immobilières en France. Elle impose une carte professionnelle pour la transaction (carte T) et la gestion locative (carte G). Sa jurisprudence concernant les conciergeries Airbnb reste floue en 2026 — la majorité opèrent sans carte G en se positionnant comme prestataires de services, mais c'est un risque juridique à surveiller.",
    related: ["conciergerie-airbnb", "mandat-gestion"],
    category: "juridique",
  },
  {
    slug: "mandat-gestion",
    term: "Mandat de gestion",
    short:
      "Contrat écrit entre un propriétaire et une conciergerie pour la gestion de son bien.",
    full:
      "Le mandat de gestion est un contrat écrit obligatoire entre un propriétaire et une conciergerie Airbnb. Il précise : identité des parties, description précise du bien, prestations incluses (annonce, voyageurs, ménage, etc.), tarification (commission % ou forfait), durée du mandat (12 mois renouvelable typique), et clause de résiliation. Sans mandat, la conciergerie n'a aucun cadre légal pour facturer ni percevoir des fonds pour le compte du propriétaire.",
    related: ["loi-hoguet", "conciergerie-airbnb"],
    category: "juridique",
  },

  // ==== FISCAL ====
  {
    slug: "lmnp",
    term: "LMNP (Loueur Meublé Non Professionnel)",
    short:
      "Statut fiscal pour les revenus de location meublée < 23 000 € OU < 50% des revenus du foyer.",
    full:
      "Le statut LMNP s'applique automatiquement quand tes revenus de location meublée restent inférieurs à 23 000 €/an OU représentent moins de 50% des revenus totaux du foyer fiscal. Tes revenus sont déclarés en BIC (Bénéfices Industriels et Commerciaux), avec choix entre micro-BIC (abattement forfaitaire) ou régime réel (déduction des charges + amortissement). Régime généralement le plus favorable pour la sous-location professionnelle.",
    related: ["lmp", "micro-bic", "regime-reel"],
    category: "fiscal",
  },
  {
    slug: "lmp",
    term: "LMP (Loueur Meublé Professionnel)",
    short:
      "Statut fiscal qui s'applique au-delà de 23 000 € de revenus locatifs ET > 50% du revenu foyer.",
    full:
      "Le statut LMP (Loueur Meublé Professionnel) s'applique automatiquement quand 2 conditions sont remplies : revenus locatifs > 23 000 €/an ET ces revenus dépassent 50% du revenu total du foyer fiscal. Avantages LMP : possibilité d'imputer le déficit foncier sur le revenu global, plus-values pro après 5 ans (exonération possible). Inconvénient : cotisations sociales URSSAF (~30-40%) sur les revenus.",
    related: ["lmnp", "regime-reel"],
    category: "fiscal",
  },
  {
    slug: "micro-bic",
    term: "Micro-BIC",
    short:
      "Régime fiscal simplifié avec abattement forfaitaire pour la location meublée.",
    full:
      "Le micro-BIC est un régime fiscal simplifié pour les loueurs meublés non professionnels. Depuis la Loi Le Meur (2025), l'abattement est de 30% pour les meublés non classés (plafond 15 000 €/an de revenus) et 71% pour les meublés classés tourisme ★★★+ (plafond 188 700 €/an). Au-delà des plafonds, passage obligatoire au régime réel.",
    related: ["lmnp", "regime-reel", "loi-le-meur", "meuble-tourisme"],
    category: "fiscal",
  },
  {
    slug: "regime-reel",
    term: "Régime réel simplifié",
    short:
      "Régime fiscal où tu déduis les charges réelles + amortissement (souvent à 0% d'imposition).",
    full:
      "Au régime réel simplifié, tu déduis les charges réelles supportées (loyer payé au propriétaire en sous-loc, ménage, plateforme, internet, frais de gestion, comptable, etc.) ET tu amortis le bien et le mobilier sur 20-30 ans. Conséquence : très souvent une imposition nulle ou quasi-nulle pendant 3-10 ans. Recommandé dès 15-20 K€ de revenus locatifs annuels. Coût comptable : 800-1 500 €/an.",
    related: ["lmnp", "micro-bic", "amortissement"],
    category: "fiscal",
  },
  {
    slug: "amortissement",
    term: "Amortissement",
    short:
      "Déduction comptable de la perte de valeur d'un bien dans le temps (régime réel LMNP/LMP).",
    full:
      "L'amortissement est la déduction comptable annuelle de la perte de valeur d'un bien (immeuble, mobilier, gros équipement) dans le temps. En régime réel LMNP, tu amortis le bien sur 20-30 ans (uniquement la valeur du bâti, pas du foncier) et le mobilier sur 5-10 ans. C'est ce qui permet d'avoir une imposition nulle pendant les premières années en régime réel.",
    related: ["regime-reel", "lmnp"],
    category: "fiscal",
  },
  {
    slug: "meuble-tourisme",
    term: "Meublé de tourisme classé",
    short:
      "Logement meublé évalué et classé ★ à ★★★★★ par Atout France pour bénéficier d'avantages fiscaux.",
    full:
      "Le classement meublé de tourisme est une évaluation de qualité (1 à 5 étoiles) réalisée par Atout France ou un organisme accrédité. Coût : 200-600 € pour 5 ans. Avantages : abattement micro-BIC porté à 71%, plafond CA 188 700 €/an, taxe de séjour réduite parfois, signal qualité pour Airbnb. Très rentable pour les sous-locataires pro qui dépassent 15 K€/an de revenus.",
    related: ["micro-bic", "loi-le-meur"],
    category: "fiscal",
  },
  {
    slug: "taxe-sejour",
    term: "Taxe de séjour",
    short:
      "Taxe locale collectée auprès des voyageurs Airbnb et reversée à la commune.",
    full:
      "La taxe de séjour est une taxe communale due par les voyageurs en hébergement touristique. Le montant varie selon la commune (0,20 € à 5 € par adulte par nuit). Collectée par l'hôte (ou la conciergerie / Airbnb directement dans certaines villes) et reversée trimestriellement à la mairie. Au Maroc : 10-30 MAD selon ville. Sanction si non reversée : redressement + 25% pénalité.",
    related: ["loi-alur"],
    category: "fiscal",
  },
  {
    slug: "kbis",
    term: "KBIS",
    short:
      "Extrait du registre du commerce identifiant officiellement une entreprise française.",
    full:
      "Le KBIS est l'extrait officiel du Registre du Commerce et des Sociétés (RCS) qui identifie une entreprise commerciale française. Il contient : raison sociale, forme juridique, capital, dirigeants, adresse, activité. Délivré par les Greffes des Tribunaux de Commerce. Gratuit via monidenum.fr (FranceConnect, instantané) ou infogreffe.fr (~3 €). Indispensable pour les démarches administratives et bancaires.",
    related: ["sasu", "auto-entrepreneur"],
    category: "fiscal",
  },
  {
    slug: "auto-entrepreneur",
    term: "Auto-entrepreneur",
    short:
      "Régime simplifié de micro-entreprise avec plafond CA 77 700 €/an pour les services.",
    full:
      "Le statut d'auto-entrepreneur (micro-entreprise) permet de créer une activité en 24h en ligne, sans capital, avec une comptabilité simplifiée. Plafond de chiffre d'affaires : 77 700 €/an pour les prestations de services (gestion, conciergerie, ménage, formation). Cotisations sociales ~22% du CA. Idéal pour démarrer une conciergerie Airbnb ou un cleaning BnB avant de basculer en EURL/SASU.",
    related: ["sasu", "kbis"],
    category: "fiscal",
  },
  {
    slug: "sasu",
    term: "SASU",
    short:
      "Société par Actions Simplifiée Unipersonnelle — structure pour entrepreneur solo dépassant les plafonds auto-entrepreneur.",
    full:
      "La SASU (Société par Actions Simplifiée Unipersonnelle) est la forme juridique préférée des entrepreneurs solo qui dépassent les plafonds auto-entrepreneur. Capital libre (1 € minimum), responsabilité limitée aux apports, dirigeant assimilé salarié (cotisations URSSAF). Coût création : 200-400 € (statuts + greffe). Adaptée à une conciergerie Airbnb ou cleaning qui scale au-delà de 80 K€ de CA.",
    related: ["auto-entrepreneur", "kbis"],
    category: "fiscal",
  },

  // ==== OPÉRATIONNEL ====
  {
    slug: "channel-manager",
    term: "Channel manager",
    short:
      "Outil qui synchronise calendrier et tarifs sur plusieurs plateformes (Airbnb, Booking, Vrbo).",
    full:
      "Un channel manager est un outil SaaS qui synchronise en temps réel le calendrier, les tarifs et les disponibilités d'un logement sur plusieurs plateformes de location courte durée (Airbnb, Booking.com, Vrbo, Expedia). Évite les doubles réservations. Outils principaux : Hostaway (~50 €/bien/mois), Lodgify (~30 €), Smoobu (~25 €), Beds24 (~20 €). ROI rentabilisé dès le 2e bien en gestion.",
    related: ["pricing-dynamique", "multi-plateformes"],
    category: "operationnel",
  },
  {
    slug: "pricing-dynamique",
    term: "Pricing dynamique",
    short:
      "Ajustement automatique des tarifs selon la demande, la saisonnalité et les événements locaux.",
    full:
      "Le pricing dynamique est l'ajustement automatique du tarif nuitée selon la demande, la saisonnalité, le taux d'occupation, les événements locaux (Coupe du Monde, JO, conventions) et la concurrence en temps réel. Outils principaux : PriceLabs, Wheelhouse, Smart Pricing Airbnb (intégré). Augmentation moyenne du CA : +20-35% vs tarif fixe.",
    related: ["channel-manager"],
    category: "operationnel",
  },
  {
    slug: "check-in-autonome",
    term: "Check-in autonome",
    short:
      "Système d'arrivée du voyageur sans contact humain (boîte à clé, smart lock, code).",
    full:
      "Le check-in autonome permet au voyageur d'arriver dans le logement sans rencontrer l'hôte ou la conciergerie. Solutions : boîte à clé sécurisée à code (Igloohome, Master Lock — 50-100 €), smart lock connectée (Nuki, August — 150-300 €), accès via concierge digital de l'immeuble. Économise 15-30 €/check-in vs accueil sur place.",
    related: ["check-out", "automatisation"],
    category: "operationnel",
  },
  {
    slug: "check-out",
    term: "Check-out",
    short:
      "Procédure de départ du voyageur (heure limite, état des lieux, restitution clés).",
    full:
      "Le check-out est la procédure de départ du voyageur, généralement entre 10h et 12h. Inclut : confirmation de départ, vérification rapide état du logement (photos), récupération des clés (ou laisser dans la boîte à clé), récupération du linge sale par l'équipe ménage. Idéalement aligné avec le check-in du voyageur suivant en début d'après-midi (15h-16h) pour permettre la rotation ménage.",
    related: ["check-in-autonome", "rotation"],
    category: "operationnel",
  },
  {
    slug: "rotation",
    term: "Rotation",
    short:
      "Cycle complet ménage + linge entre 2 voyageurs.",
    full:
      "Une rotation est le cycle complet d'opérations entre le check-out d'un voyageur et le check-in du suivant : ménage en profondeur (1h30-3h selon taille), changement complet du linge (draps, serviettes), restock consommables (savon, papier toilette, café), vérification équipement, photos avant/après pour le proprio. Tarif standard 2026 : 30-100 € selon taille et niveau de service.",
    related: ["check-out", "cleaning-bnb"],
    category: "operationnel",
  },
  {
    slug: "cleaning-bnb",
    term: "Cleaning BnB",
    short:
      "Service de ménage hôtelier spécialisé pour les rotations Airbnb / locations courte durée.",
    full:
      "Le cleaning BnB est un métier de prestataire de ménage spécialisé dans les rotations courte durée (Airbnb, Booking). Diffère du ménage classique par : standards hôteliers (pliage hôtelier, présentation), tarification fixe par rotation (vs taux horaire), récurrence (mêmes biens chaque semaine), photos avant/après. CA possible 4 à 18 K€/mois selon le scaling.",
    related: ["rotation", "conciergerie-airbnb"],
    category: "metiers",
  },
  {
    slug: "linge-hotelier",
    term: "Linge hôtelier",
    short:
      "Linge spécifique (draps, serviettes) à grammage et qualité hôteliers, fourni par la conciergerie.",
    full:
      "Le linge hôtelier désigne les draps, taies, serviettes, peignoirs de qualité et grammage hôteliers (en général 200+ fils pour les draps, 500-600 g/m² pour les serviettes). Fournis par la conciergerie ou le sous-locataire pro. Permet de laver-sécher-repasser-livrer en 24-48h sans rupture entre 2 rotations. Coût d'achat initial pour un T2 : 200-400 €.",
    related: ["rotation", "cleaning-bnb"],
    category: "operationnel",
  },
  {
    slug: "automatisation",
    term: "Automatisation",
    short:
      "Logiciels qui automatisent messages voyageurs, pricing, check-in (Hospitable, Smartbnb).",
    full:
      "L'automatisation est l'ensemble des outils qui prennent en charge des tâches récurrentes de gestion locative : messages voyageurs (pré-arrivée, check-in, check-out, demande d'avis), ajustement tarifs (pricing dynamique), notifications maintenance, reporting. Outils principaux : Hospitable (ex-Smartbnb), Touch Stay, Operto. Permet de gérer 10-20 logements en 5-10h/semaine au lieu de 30-40h.",
    related: ["channel-manager", "pricing-dynamique"],
    category: "operationnel",
  },

  // ==== MÉTIERS ====
  {
    slug: "conciergerie-airbnb",
    term: "Conciergerie Airbnb",
    short:
      "Société qui gère pour le compte de propriétaires des locations Airbnb contre commission.",
    full:
      "Une conciergerie Airbnb est une entreprise qui prend en charge la gestion complète de logements en location meublée touristique pour le compte de propriétaires : annonce, communication voyageurs, check-in / check-out, ménage, linge, maintenance, reporting. Rémunération : commission de 15 à 25% du CA généré (jusqu'à 30% au Maroc). Modèle scalable : pas de capital fixe nécessaire, juste des outils et de l'organisation.",
    related: ["mandat-gestion", "rotation", "loi-hoguet"],
    category: "metiers",
  },
  {
    slug: "super-host",
    term: "Superhost",
    short:
      "Statut Airbnb réservé aux hôtes les plus performants (note 4,8+, taux acceptation 90%+, 0 annulation).",
    full:
      "Superhost est le statut Airbnb attribué tous les 3 mois aux hôtes qui répondent à 4 critères : note moyenne ≥ 4,8/5, taux d'acceptation des demandes ≥ 90%, taux d'annulation ≤ 1%, taux de réponse aux messages < 24h. Avantages : badge visible sur les annonces, ranking algorithmique boost, priorité support Airbnb, +20-30% de réservations en moyenne. Cible critique pour la sous-location pro et conciergerie.",
    related: ["conciergerie-airbnb", "ranking-airbnb"],
    category: "metiers",
  },
  {
    slug: "ranking-airbnb",
    term: "Ranking Airbnb",
    short:
      "Algorithme qui classe les annonces dans les résultats de recherche (note, taux d'acceptation, photos, prix).",
    full:
      "Le ranking Airbnb est l'algorithme propriétaire qui détermine l'ordre d'apparition des annonces dans les résultats de recherche pour un voyageur. Facteurs principaux : note moyenne, nombre de reviews récentes, taux d'acceptation, taux de réponse, qualité des photos, complétude de l'annonce, taux de conversion clic→réservation, prix relatif au marché. Optimiser ces 8 facteurs = +50 à 100% de réservations.",
    related: ["super-host", "pricing-dynamique"],
    category: "marketing",
  },

  // ==== PLATEFORMES ====
  {
    slug: "airbnb",
    term: "Airbnb",
    short:
      "Plateforme #1 mondiale de location meublée touristique entre particuliers (et pros).",
    full:
      "Airbnb est la plateforme dominante de location meublée touristique avec ~7 millions de logements dans 220 pays. Commission hôte : 14-16% (3% host fee + service fee voyageur). Ticket moyen FR 2026 : 80-150 €/nuit. Représente 50-60% des nuitées courte durée en France pour un hôte typique.",
    related: ["super-host", "ranking-airbnb"],
    category: "plateformes",
  },
  {
    slug: "booking",
    term: "Booking.com",
    short:
      "Plateforme #1 hôtelière mondiale, capte 25-35% des nuitées courte durée Airbnb-équivalentes en France.",
    full:
      "Booking.com est la plus grande plateforme de réservation hôtelière mondiale (~2.5 millions de propriétés). Pour la location meublée, la commission est de 15-18%. Audience plus européenne que Airbnb (FR, DE, BE, NL, ES). Indispensable en multi-canal : représente 25-35% des nuitées courte durée non-couvertes par Airbnb seul.",
    related: ["airbnb", "vrbo", "channel-manager"],
    category: "plateformes",
  },
  {
    slug: "vrbo",
    term: "Vrbo (Expedia)",
    short:
      "Plateforme orientée familles et longs séjours (7+ nuits), idéale pour les biens 3+ chambres.",
    full:
      "Vrbo (Vacation Rentals By Owner), filiale du groupe Expedia, est une plateforme orientée familles, vacances et longs séjours (7+ nuits typiques). Commission : 5-8% pour le hôte + service fee voyageur. Audience principalement nord-américaine et européenne. Représente 5-10% des nuitées courte durée en France, mais cible précieuse pour les biens 3+ chambres et les destinations vacances.",
    related: ["airbnb", "booking"],
    category: "plateformes",
  },
  {
    slug: "multi-plateformes",
    term: "Multi-plateformes",
    short:
      "Stratégie de diffusion d'un bien sur plusieurs canaux (Airbnb + Booking + Vrbo) avec calendrier synchronisé.",
    full:
      "La stratégie multi-plateformes consiste à diffuser un même bien sur plusieurs plateformes (Airbnb + Booking.com + Vrbo + parfois site direct) en synchronisant les calendriers via un channel manager. Permet d'augmenter le taux d'occupation de 15-30% vs Airbnb seul, sans risque de double-booking grâce à la synchro temps réel.",
    related: ["channel-manager", "airbnb", "booking", "vrbo"],
    category: "plateformes",
  },

  // ==== MARKETING / ANNONCE ====
  {
    slug: "annonce-airbnb",
    term: "Annonce Airbnb",
    short:
      "Page de présentation d'un bien sur Airbnb (titre, description, photos, équipements, tarif).",
    full:
      "L'annonce Airbnb est la page de présentation d'un bien : titre (60 caractères max), description (1500 caractères), 20-40 photos haute qualité, liste équipements, tarif et règles de réservation. La qualité de l'annonce détermine 60% du taux de conversion clic→réservation. Optimisation = photos pro + titre vendeur + description structurée + 30+ équipements cochés.",
    related: ["super-host", "ranking-airbnb"],
    category: "marketing",
  },
  {
    slug: "photos-pro-airbnb",
    term: "Photos pro Airbnb",
    short:
      "Photos hautes qualité (objectif grand-angle, lumière naturelle) qui boostent les réservations de 30-40%.",
    full:
      "Les photos pro Airbnb sont des photographies réalisées par un photographe professionnel équipé d'un objectif grand-angle (16-35mm), avec utilisation de la lumière naturelle et retouche pro. Coût : 200-500 € pour un shoot complet (8-15 photos clés). ROI : +30-40% de réservations en moyenne. Premier investissement à faire sur tout bien Airbnb.",
    related: ["annonce-airbnb"],
    category: "marketing",
  },

  // ==== AUTRES ====
  {
    slug: "mre",
    term: "MRE (Marocain Résidant à l'Étranger)",
    short:
      "Marocain vivant à l'étranger qui possède souvent un bien immobilier au Maroc.",
    full:
      "MRE est l'acronyme officiel pour Marocain Résidant à l'Étranger. Ils représentent ~5 millions de personnes (principalement en France, Belgique, Pays-Bas, Espagne, Italie). Cible privilégiée pour la conciergerie Airbnb au Maroc : propriétaires d'un bien à Tanger / Marrakech / Casablanca / Agadir qu'ils ne peuvent pas gérer à distance, et qui cherchent des services de gestion en français.",
    related: ["conciergerie-airbnb"],
    category: "metiers",
  },
  {
    slug: "qualiopi",
    term: "Qualiopi",
    short:
      "Certification qualité française obligatoire pour les organismes de formation finançables (CPF, OPCO).",
    full:
      "Qualiopi est la certification qualité unique attestant de la qualité du processus mis en œuvre par les organismes de formation. Obligatoire depuis 2022 pour bénéficier de fonds publics (CPF, OPCO, France Travail, Plan de développement des compétences). Coût : 1 500-3 500 € pour l'audit initial. Validité : 3 ans. Permet aux apprenants de financer leur formation via leur Compte Personnel de Formation.",
    related: ["cpf", "opco"],
    category: "metiers",
  },
  {
    slug: "cpf",
    term: "CPF (Compte Personnel de Formation)",
    short:
      "Compte de formation alimenté par l'employeur pour financer une formation qualifiante.",
    full:
      "Le Compte Personnel de Formation (CPF) est un compte personnel alimenté chaque année (jusqu'à 500 €/an, plafond 5 000 €) par l'employeur via les cotisations sociales. Permet de financer des formations Qualiopi tout au long de la vie active. Plateforme : moncompteformation.gouv.fr. Pour qu'une formation soit éligible, l'organisme de formation doit être certifié Qualiopi ET référencé EDOF (Espace Des Organismes de Formation).",
    related: ["qualiopi", "opco"],
    category: "metiers",
  },
  {
    slug: "opco",
    term: "OPCO",
    short:
      "Opérateur de Compétences qui finance la formation des salariés selon leur branche.",
    full:
      "Un OPCO (Opérateur de Compétences) est un organisme agréé par l'État qui collecte les contributions formation des entreprises et finance les actions de formation des salariés. Il existe 11 OPCO en France selon la branche (OPCO Atlas pour les services, AKTO pour le commerce, etc.). Permet de financer une formation Qualiopi via l'employeur sans toucher au CPF du salarié.",
    related: ["qualiopi", "cpf"],
    category: "metiers",
  },

  // ==== KPI / MÉTRIQUES ====
  {
    slug: "taux-occupation",
    term: "Taux d'occupation",
    short:
      "Pourcentage de nuits réservées sur l'année (médiane FR 2026 : 60-75%).",
    full:
      "Le taux d'occupation est le pourcentage de nuits effectivement réservées sur le total de nuits disponibles. Médiane France 2026 : 60-75% selon la ville et la qualité de l'optimisation. Paris/Lyon/Bordeaux : 75-85% en bonne saison, 50-65% basse saison. Stations balnéaires : 85% été, 30-40% hiver. Indicateur clé de la rentabilité d'une location courte durée.",
    related: ["adr", "revpar"],
    category: "operationnel",
  },
  {
    slug: "adr",
    term: "ADR (Average Daily Rate)",
    short:
      "Tarif moyen par nuit réservée (KPI hôtelier appliqué à Airbnb).",
    full:
      "L'ADR (Average Daily Rate ou Tarif Moyen Journalier) est le revenu moyen par nuit réservée sur une période donnée. Calcul : revenus totaux / nombre de nuits réservées. Exemple : 3 000 € de revenus sur 25 nuits réservées = ADR 120 €. Indicateur clé pour évaluer le pricing efficacy d'une annonce Airbnb.",
    related: ["taux-occupation", "revpar"],
    category: "operationnel",
  },
  {
    slug: "revpar",
    term: "RevPAR (Revenue Per Available Room)",
    short:
      "Revenu moyen par nuit disponible (combine taux d'occupation et ADR).",
    full:
      "Le RevPAR (Revenue Per Available Room) est le revenu moyen généré par nuit disponible sur une période. Formule : ADR × Taux d'occupation. Exemple : ADR 120 € × Taux occupation 70% = RevPAR 84 €. C'est le KPI le plus pertinent pour comparer la performance globale entre 2 logements ou 2 stratégies pricing.",
    related: ["adr", "taux-occupation"],
    category: "operationnel",
  },
];

export const LEXIQUE_BY_CATEGORY = {
  juridique: LEXIQUE.filter((t) => t.category === "juridique"),
  fiscal: LEXIQUE.filter((t) => t.category === "fiscal"),
  operationnel: LEXIQUE.filter((t) => t.category === "operationnel"),
  marketing: LEXIQUE.filter((t) => t.category === "marketing"),
  plateformes: LEXIQUE.filter((t) => t.category === "plateformes"),
  metiers: LEXIQUE.filter((t) => t.category === "metiers"),
};

export const CATEGORY_LABELS: Record<LexiqueTerm["category"], string> = {
  juridique: "Cadre juridique",
  fiscal: "Fiscalité",
  operationnel: "Opérationnel",
  marketing: "Marketing & annonce",
  plateformes: "Plateformes",
  metiers: "Métiers & statuts",
};

export function getTerm(slug: string): LexiqueTerm | undefined {
  return LEXIQUE.find((t) => t.slug === slug);
}
