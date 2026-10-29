"use client";

import { useEffect, useState, type ReactNode } from "react";
import "./motion.css";

/**
 * CTA collant en bas d'écran, mobile uniquement (< 768 px).
 * Visible tant qu'AUCUN des éléments `watch` (sélecteurs CSS) n'est à l'écran :
 * ex. watch={["#formulaire"]} => la barre apparaît quand le formulaire est sorti du viewport.
 * `rescan` : change-le quand les éléments surveillés sont remplacés (changement d'étape).
 */
export default function StickyCta({
  children,
  watch,
  rescan,
  href,
  onClick,
  external,
  className,
}: {
  children: ReactNode;
  watch: string[];
  rescan?: unknown;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  className?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    if (!("IntersectionObserver" in window)) return;
    const els = watch.map((s) => document.querySelector(s)).filter(Boolean) as Element[];
    if (!els.length) return;
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)));
      setShow(seen.size === 0);
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rescan, watch.join("|")]);

  const common = { className: className || "mo-sticky-btn", tabIndex: show ? 0 : -1 } as const;
  return (
    <div className="mo-sticky" data-show={show}>
      {href ? (
        <a {...common} href={href} onClick={onClick} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      ) : (
        <button type="button" {...common} onClick={onClick}>
          {children}
        </button>
      )}
    </div>
  );
}
