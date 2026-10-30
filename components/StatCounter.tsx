"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";

// useLayoutEffect ne tourne pas au rendu statique : on retombe sur useEffect côté serveur.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function StatCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.6,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const reduce = useReducedMotion();
  // Le HTML statique porte la vraie valeur (lue par Google et sans JS), le compteur repart de 0 au montage.
  const [display, setDisplay] = useState(value);

  useIsoLayoutEffect(() => {
    setDisplay(reduce ? value : 0);
  }, [reduce, value]);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, reduce, value, duration, mv, rounded]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}
