# Offres & pricing Rentimmo Academy — synthèse post-retour Faissal (oct 2026)

⚠️ Document de travail. Pas de prix modifié sur le site/Stripe tant que Marwan ne valide pas.

## Contexte important
Le retour de Faissal porte sur la **nouvelle grille de prix déjà co-conçue avec Marwan mais pas encore déployée**
sur le site public ni sur Stripe (voir memory) : Sous-Location 997/2497/3797€ (vs l'ancienne grille encore live
dans `lib/formations.ts` : 997/1497/2497€, garantie 12 mois Platinum / 6 mois Gold, 2/4 sessions coaching 1-to-1).
Les montants cités par Faissal ("2500€", "3800€", "90 jours") matchent la nouvelle grille, pas celle en ligne
aujourd'hui.

## Retour Faissal (résumé fidèle, échange vocal retranscrit)

**1. Tier ~2500€ (Platinum) — pas assez concurrentiel**
- Coaching de groupe uniquement, zéro coaching privé à ce prix = pas compétitif
- Deux profils de prospects : ceux qui comparent n'importe comment (vs commerce, cinéma...) et ceux qui comparent
  sérieusement avec les vrais concurrents du marché — à 2500€ sans 1-to-1, Rentimmo perd face à ces derniers

**2. Gold ~3800€ — bonne valeur/garantie, mais durée de garantie trop courte**
- "Valeur de fou, garantie de fou" sur le fond
- Mais garantie 90 jours vs concurrents qui annoncent 6 mois (2x plus) = argument de comparaison facile à démonter
- Point clé : l'engagement réel d'accompagnement n'a pas besoin de durer 6 mois, mais **l'effet psychologique de
  la promesse** ("je suis là pendant 6 mois" vs "90 jours") est bien plus puissant commercialement

**3. Contexte marché 2026 — plus dur qu'il y a 3-4 ans**
- Besoin de faire du chiffre / monter en trésorerie rapidement
- Les prospects d'aujourd'hui ont déjà vu une masterclass/challenge et déjà parlé à un closer ailleurs —
  marché plus mature/sceptique, scripts de vente classiques moins efficaces

**4. Structure d'offre proposée par Faissal**
- Une offre groupe plus accessible / légère en friction (ex. ~1h/semaine), pour l'entrée de gamme
- Une offre 1-to-1 à un prix qui "donne envie" (pas forcément premium très cher, mais psychologiquement attractif)
- Faire varier les prix selon le canal/lancement (organique YouTube vs trafic payant) pour ne pas perdre d'argent
  sur l'acquisition payante
- Marwan doit se concentrer sur contenu/communication ; laisser le closer gérer la conversion

**5. Setting — scepticisme + question stratégique non résolue**
- Faissal ne connaît aucun infopreneur avec un setting externalisé vraiment efficace (les vendeurs de ce service
  vantent toujours leur méthode, en pratique jamais aussi bon qu'annoncé)
- Si Marwan fait tout lui-même (contenu + setting + reste) : épuisement, pas de scale
- Les bons closers déjà expérimentés et rentables ne veulent pas faire de setting (prise de rdv), seulement closer ;
  les profils encore en formation acceptent de faire les deux mais sont moins aguerris
- Faissal a un contact closer expérimenté intéressé par l'offre Rentimmo, dispo partiellement (pas temps plein)
- Question posée directement à Marwan, pas encore tranchée : **quelle est la stratégie pour augmenter le volume
  de rdv au-delà du seul organique ?**

## Recoupement avec le benchmark concurrent (déjà en base)
- **Sébastien More** (Airbnb Business Academy) : 5 paliers Starter 1497 / Premium 1997 / Marketing 2997 /
  Business 3497 / Gold 3997€
- **EasyLoc Immo Éthique** : mono-offre, prix normal 2500€ (descendu à 1500€ en promo), pas de tiering —
  c'est probablement LE point de comparaison implicite derrière le "2500€" de Faissal : à prix identique à EasyLoc,
  Rentimmo doit proposer au moins autant de valeur perçue (du 1-to-1, pas juste du groupe)
- Le nouveau Gold Rentimmo à 3797€ se positionne bien dans la fourchette haute de Sébastien More (3497-3997€) —
  cohérent, pas de souci de positionnement sur ce palier selon le benchmark pur prix

## Recommandations concrètes (à valider par Marwan avant tout déploiement)

1. **Platinum (~2497€) : ajouter un minimum de coaching 1-to-1** (même 1-2 sessions) plutôt que 100% groupe.
   Faissal a raison : zéro 1-to-1 à ce prix face à des concurrents qui en proposent = objection facile pour le
   prospect sérieux. Pas besoin d'aligner sur le niveau Gold, juste sortir du zéro.

2. **Gold : passer la promesse de garantie de "90 jours" à "6 mois"** dans le copy/marketing, sans nécessairement
   changer le volume réel d'accompagnement actif (qui se concentre naturellement sur les premières semaines).
   Coût quasi nul, gain psychologique élevé selon Faissal — à trancher avec Marwan si le risque remboursement sur
   6 mois reste acceptable vs 90 jours.

3. **Créer une offre groupe d'entrée plus légère** (friction basse, ~1h/semaine) en dessous ou à la place du
   Bronze actuel, pour absorber le trafic organique froid sans le pousser directement sur un tier élevé.

4. **Pricing différencié par canal** : garder un prix "standard" pour l'organique (YouTube/contenu), et un prix
   ajusté pour les lancements/trafic payant, pour protéger la marge sur le CAC payant. Implémentation : nécessite
   un système de prix dynamique par source (`src` déjà trackée sur `/masterclass`, réutilisable).

5. **Setting/volume de rdv — décision structurante à trancher avec Marwan**, 3 options non exclusives :
   - Tester le contact closer expérimenté de Faissal en partiel (quelques rdv/semaine), sans engagement plein temps
   - Construire un funnel payant (ads) en parallèle de l'organique pour ne pas dépendre uniquement du contenu
   - Accepter un setter/closer junior en formation pour couvrir plus de créneaux, en complément du closer senior actuel
   Pas de recommandation tranchée de ma part ici — c'est un choix business/capacité qui appartient à Marwan.

## Décisions tranchées par Marwan (oct 2026, suite au retour Faissal)
1. **Platinum (~2497€)** : ajouter un minimum de coaching 1-to-1 (1-2 sessions), fini le 100% groupe à ce prix.
2. **Gold (~3797€)** : passer la garantie affichée de "90 jours" à "6 mois" dans le copy — accompagnement réel
   inchangé, pure reformulation psychologique validée par Marwan suite à l'argument de Faissal.
3. **Volume de rdv (réponse à la question de Faissal)** :
   - Court terme, 100% organique : réactivation de la base de leads historiques (milliers de contacts déjà
     en base, cf. pool de réveil `memory/calendly-pool-reveil.md`) avec une offre dédiée
   - En parallèle : poussée forte réseaux + YouTube depuis plusieurs semaines, stratégie long terme 100% valeur
   - Ensuite : système d'automatisation type ManyChat **en soutien/complément du setting humain** (pas un
     remplacement) — optin → séquence setting automatisée → offre spécifique pour les anciens leads réactivés.
     **Changement de position** : Marwan refusait ce type d'outil jusqu'ici (cf. memory), maintenant jugé
     "hyper important" en appui du setting humain qui reste la base
   - Test en parallèle du contact closer expérimenté de Faissal, en partiel (pas temps plein)

## Prochaine étape
Implémenter les points 1-2 dans `lib/formations.ts` + pages `/formations/*` + Stripe une fois le wording/montant
exact validé avec Marwan (pas de déploiement sans validation explicite). Point 3 = roadmap setting/acquisition à
construire (ManyChat + séquence optin→setting + segmentation anciens leads).
