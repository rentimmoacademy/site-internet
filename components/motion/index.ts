export { default as Motion } from "./Motion";
export { default as Words } from "./Words";
export { default as Marquee } from "./Marquee";
export { default as Accordion } from "./Accordion";
export type { AccordionItem } from "./Accordion";
export { default as StickyCta } from "./StickyCta";

import type { CSSProperties } from "react";
/** Délai d'entrée CSS en ms : <div className="mo-enter" style={delay(200)} /> */
export const delay = (ms: number) => ({ "--mo-d": ms }) as CSSProperties;
