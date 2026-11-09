import "./motion.css";
import type { CSSProperties, ReactNode } from "react";

/**
 * Surligneur (`hl`) ou soulignement tracé à la main (`underline`) qui se dessine quand le mot entre à l'écran.
 * Remplace Highlight / Underline (framer-motion) sur les pages du kit : CSS pur piloté par <Motion />
 * (data-reveal="mark"). Sans JS, le trait est déjà dessiné. `color="lime"` = variante Super BNB Academy.
 * `enter` : au-dessus de la ligne de flottaison, le trait se dessine au chargement (CSS pur, délai `delay` ms).
 */
export default function Mark({
  children,
  variant = "hl",
  color = "green",
  enter = false,
  delay = 700,
}: {
  children: ReactNode;
  variant?: "hl" | "underline";
  color?: "green" | "lime";
  enter?: boolean;
  delay?: number;
}) {
  const cls = `mo-mark mo-mark--${variant}${color === "lime" ? " mo-mark--lime" : ""}${enter ? " mo-mark--enter" : ""}`;
  const props = enter ? { style: { "--mo-d": delay } as CSSProperties } : { "data-reveal": "mark" };
  if (variant === "underline")
    return (
      <span className={cls} {...props}>
        <span className="mo-mark-txt">{children}</span>
        <svg aria-hidden viewBox="0 0 200 12" preserveAspectRatio="none" className="mo-mark-svg">
          <path d="M2 8 C 40 3, 90 3, 120 6 S 180 10, 198 4" pathLength={1} />
        </svg>
      </span>
    );
  return (
    <span className={cls} {...props}>
      <span className="mo-mark-txt">{children}</span>
    </span>
  );
}
