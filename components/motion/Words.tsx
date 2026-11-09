import "./motion.css";
import type { CSSProperties } from "react";

/**
 * Titre qui apparaît mot par mot (flou -> net). Composant serveur-compatible, le HTML
 * statique contient déjà tous les mots (l'animation est du CSS pur, pas de JS).
 * `start` décale l'index quand on enchaîne plusieurs <Words> dans un même titre.
 */
export default function Words({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="mo-word" style={{ "--i": start + i } as CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}
