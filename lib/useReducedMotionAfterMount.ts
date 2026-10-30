"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

// useReducedMotion lit la préférence dès le premier rendu client, alors que l'export statique
// a été rendu sans elle : la page ne s'hydrate plus. On ne l'applique qu'après le montage.
export function useReducedMotionAfterMount() {
  const prefers = useReducedMotion();
  const [reduce, setReduce] = useState(false);
  useEffect(() => setReduce(!!prefers), [prefers]);
  return reduce;
}
