# Offres & pricing Rentimmo Academy — draft stratégique (oct 2026)

⚠️ Document de travail. Pas de prix modifié sur le site/Stripe tant que Marwan ne valide pas.

## ⚠️ Point bloquant
Je n'ai pas eu accès au contenu réel du retour de Faissal (pas d'accès WhatsApp/audio dans cet environnement).
Tout ce qui suit = benchmark + lecture perso, **pas** une analyse de ses propos. Colle-moi le texte ou un résumé
de ce qu'il a dit (points précis) et j'affine direct dessus.

## État actuel réel (vérifié dans `lib/formations.ts`, live)
3 formations (Sous-Location / Conciergerie BNB / Cleaning BNB), **tiers identiques sur les 3** :

| Tier | Prix | Coaching 1-to-1 | Garantie | Autre |
|---|---|---|---|---|
| Bronze | 997 € (ou 2×500€) | Groupe hebdo uniquement | Aucune | Discord 1 an |
| Platinum | 1 497 € (ou 2×750€) | 2 sessions | 12 mois ou remboursé | Suivi perso |
| Gold | 2 497 € (ou 3×850€) | 4 sessions | **6 mois** ou remboursé | Société + site web + identité visuelle offerts |

Prix masqués sur les pages publiques (`FormationDetail.tsx` affiche "Tarif personnalisé* — communiqué lors de
l'appel stratégique"), montants réels seulement dans Stripe checkout. CPF mentionné de façon générique ("via
notre organisme partenaire"), pas de montant.

## Benchmark concurrent (recherche oct 2026, sourcé)

**Sébastien More — Airbnb Business Academy / Le Sous Loueur**
- Communauté Skool : 47€/mois (800 membres), lives quotidiens — produit d'entrée/récurrent, pas une formation one-shot
- Formations one-off à 5 paliers : Starter 1 497€ / Premium 1 997€ / Marketing 2 997€ / Business 3 497€ / Gold 3 997€
- Conciergerie Formula 35h sans prérequis ; Micro-Conciergerie 8h visant 1 500€/mois
- Sources : [Sebastien More avis — ImmoCompare](https://immocompare.org/home/formations-investissement-immobilier/sebastien-more-avis-formation-sous-location/), [Airbnb Business Academy — Skool](https://www.skool.com/airbnb-business-academy/about), [lesousloueur.fr](https://lesousloueur.fr/nos-formations/)

**EasyLoc Immo Éthique — Khalid Ramdani**
- Offre mono-produit, 3 jours de formation, Qualiopi + CPF actifs
- Prix normal 2 500€, promo été descendue à 1 500€, code promo -100€ dispo
- Pas de tiering visible (contrairement à Rentimmo)
- Sources : [EasyLoc Immo](https://www.easylocimmo.com/), [easylocimmo.com/offre-ete](https://easylocimmo.com/offre-ete)

## Lecture perso (à challenger avec le retour de Faissal une fois dispo)
- **Rentimmo est le seul des 3 à avoir une vraie tarification par paliers** avec du coaching 1-to-1 qui scale et une
  garantie qui scale (0 → 12 mois → 6 mois). C'est un vrai atout de structure face à EasyLoc (mono-offre) — mais
  pas assez mis en avant dans le copywriting actuel (la diff Bronze/Gold en 1-to-1 + garantie mérite d'être
  martelée comme argument face à un concurrent mono-tarif).
- **Le plafond Gold (2 497€) est bas** comparé au haut de gamme Sébastien More (3 497-3 997€), alors que Rentimmo
  a un proof point plus fort (+600K€ générés, 7 ans terrain vs positionnement communauté/lives). Il y a de la marge
  pour monter le Gold sans sortir du marché.
- **EasyLoc est repositionné pile sur le milieu de gamme Rentimmo** (Platinum/Gold) avec un seul prix — donc
  Rentimmo n'est pas sous-pricé face à ce concurrent direct, le problème serait plutôt un manque de différenciation
  perçue (mono-offre vs 3-tiers) plutôt qu'un problème de prix absolu.
- Rentimmo surclasse EasyLoc sur le papier (sans-riba commun aux deux, mais Rentimmo propose le Maroc en bonus +
  3 verticales au lieu d'une) — argument à pousser davantage dans le pricing/copy.

## Prochaine étape
Dès que j'ai le retour réel de Faissal (texte), je recoupe avec ce benchmark et je sors une proposition de
pricing + structure d'offre concrète (sans toucher Stripe tant que ce n'est pas validé).
