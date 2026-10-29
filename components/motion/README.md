# Kit motion Rentimmo Academy

CSS + IntersectionObserver, zéro dépendance (pas de GSAP, pas de Framer Motion). Poids (gzip) : CSS du kit ~3,7 Ko ; le JS du kit est inclus dans le chunk de la page (toute la page /cleaning = ~9 Ko de JS propre).
Règles du kit : seulement `transform` / `opacity` (zéro CLS), le contenu reste visible sans JS, tout est coupé sous `prefers-reduced-motion`.
Exemple complet : `app/(funnel)/cleaning/page.tsx` + `cleaning.css`.

## Mise en place sur une page

```tsx
"use client"; // la page (ou le wrapper) qui monte <Motion/> doit être cliente
import { Motion, Words, Marquee, Accordion, StickyCta, delay } from "@/components/motion";

<Motion deps={step} />   // une fois par page ; change `deps` quand le contenu est remplacé (étape de funnel)
```

## Ce que fait chaque brique

| Besoin | Comment |
|---|---|
| Entrée du hero (CSS pur, sans flash) | `className="mo-enter"` / `mo-enter-pop` / `mo-enter-fade` + `style={delay(200)}` |
| Titre mot par mot | `<h1><Words text="Mon titre" /> <span><Words text="mis en avant" start={3} /></span></h1>` (`start` = nombre de mots déjà passés) |
| Apparition au scroll | `data-reveal="up|fade|scale|left|right"` (+ `data-delay="150"`) |
| Cascade | `data-stagger="100"` sur le parent : ses `[data-reveal]` s'enchaînent de 100 ms |
| Compteur | `<span data-count="7" data-suffix="+">7+</span>` (+ `data-prefix`, `data-decimals`) ; mets la valeur finale en texte (SEO / sans JS) |
| Carte qui s'incline + spotlight | `data-tilt` (pointeur fin seulement). Ne pas mettre `data-reveal` sur le même élément : enveloppe-le |
| Bouton magnétique | `data-magnetic` ; reflet périodique : classe `mo-shine` |
| Barre de lecture | `<div className="mo-progress" data-mo-progress />` |
| Ligne qui se remplit au scroll | `<li className="mo-fill mo-fill--x" data-scrollfill />` (horizontale) ou `mo-fill` (verticale) |
| Fond animé (aurore verte) | `<div className="mo-aurora"><span className="mo-blob mo-blob--a"/><span className="mo-blob mo-blob--b"/></div>` dans une section `position:relative; overflow:hidden` |
| Bandeau défilant | `<Marquee items={["A","B"]} itemClassName="..." />` |
| Bordure lumineuse qui tourne | `mo-borderspin` sur la carte (+ contenu dans un enfant `position:relative`) ; `--mo-radius` / `--mo-card-bg` pour l'adapter |
| Halo + squelette autour d'une vidéo | `mo-halo` (conteneur) + `mo-skeleton` (cadre) |
| FAQ animée et accessible | `<Accordion items={[{ q, a }]} />` |
| CTA collant mobile | `<StickyCta watch={["#formulaire"]} onClick={...}>Texte</StickyCta>` : visible tant qu'aucun élément surveillé n'est à l'écran |
| Point qui pulse / coche qui se dessine | `mo-pulse-dot` / `<svg className="mo-check">` |

Variables CSS utiles : `--mo-ease`, `--mo-green`, `--mo-green-d` (`#1F8035`, blanc dessus = AA), `--mo-ink`, `--mo-cream`.

## Pièges

- `data-reveal` et `data-tilt` écrivent tous les deux `transform` : un par élément, l'autre sur un parent.
- Les compteurs figent leur largeur sur la valeur finale (pas de décalage de mise en page) : ne les mets pas dans un élément `display:flex` sans largeur.
- Pour une page serveur (sans `"use client"`), isole le contenu animé dans un petit composant client qui rend `<Motion />`.
- Garder les durées courtes au-dessus de la ligne de flottaison : le LCP attend la fin de l'entrée du titre.
- Les polices ne font pas partie du kit : Poppins est déclarée par route (voir `app/(funnel)/cleaning/layout.tsx`).
