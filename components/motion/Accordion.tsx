"use client";

import { useId, useState } from "react";
import "./motion.css";

export type AccordionItem = { q: string; a: string };

/** FAQ accessible (boutons + aria-expanded), ouverture animée, contenu présent dans le DOM. */
export default function Accordion({
  items,
  defaultOpen = -1,
  className,
}: {
  items: AccordionItem[];
  defaultOpen?: number;
  className?: string;
}) {
  const uid = useId();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`mo-acc ${className || ""}`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q} className="mo-acc-item" data-open={isOpen} data-reveal="up">
            <h3 className="mo-acc-h">
              <button
                type="button"
                className="mo-acc-btn"
                id={`${uid}-b${i}`}
                aria-expanded={isOpen}
                aria-controls={`${uid}-p${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{it.q}</span>
                <span className="mo-acc-icon" aria-hidden="true" />
              </button>
            </h3>
            <div id={`${uid}-p${i}`} role="region" aria-labelledby={`${uid}-b${i}`} className="mo-acc-panel">
              <div className="mo-acc-inner">
                <p>{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
