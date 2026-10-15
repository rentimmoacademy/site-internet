"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Affiche l'outil calculateur-commission-airbnb.html (fichier statique autonome,
 * non modifié) dans une iframe pleine largeur, avec une hauteur recalculée en
 * continu depuis le document same-origin pour éviter tout double défilement.
 */
export default function CommissionCalculatorFrame() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1400);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;

    const resize = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc?.documentElement) {
          const h = doc.documentElement.scrollHeight;
          if (h > 0) setHeight(h);
        }
      } catch {
        // cross-origin improbable ici (même domaine), on ignore par sécurité
      }
    };

    iframe.addEventListener("load", resize);
    const interval = setInterval(resize, 350);
    window.addEventListener("resize", resize);

    return () => {
      iframe.removeEventListener("load", resize);
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src="/tools/calculateur-commission-airbnb"
      title="Calculateur commission Airbnb"
      scrolling="no"
      style={{
        width: "100%",
        height,
        border: "0",
        display: "block",
        overflow: "hidden",
      }}
    />
  );
}
