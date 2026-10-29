"use client";

import { useEffect, useLayoutEffect } from "react";
import "./motion.css";

/**
 * Chef d'orchestre du kit motion. À monter UNE fois par page (ou par étape de funnel).
 * Il scanne le DOM et branche les comportements déclarés par des attributs data-* :
 *
 *   data-reveal="up|fade|scale|left|right"  apparition au scroll (data-delay="120" en ms)
 *   data-stagger="80"                        sur un parent : décale ses [data-reveal] de 80 ms chacun
 *   data-count="7" (+ data-prefix / data-suffix / data-decimals)   compteur animé
 *   data-tilt                                carte qui s'incline + spotlight (pointeur fin)
 *   data-magnetic                            bouton attiré par le curseur (pointeur fin)
 *   data-scrollfill                          expose --mo-fill (0 -> 1) selon l'avancée dans le viewport
 *   data-mo-progress                         barre de lecture (scaleX)
 *
 * `deps` : change-le quand le contenu est remplacé (ex. étape d'un funnel) pour re-scanner.
 * prefers-reduced-motion : rien n'est caché, rien ne bouge, les compteurs affichent leur valeur finale.
 */

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Faux tant qu'on n'a pas fait le premier scan de la page : les éléments déjà visibles
// au chargement ne sont pas cachés (ils ont été peints par le HTML statique, pas de flash).
let booted = false;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function Motion({ deps }: { deps?: unknown }) {
  useIsoLayoutEffect(() => {
    const ac = new AbortController();
    const { signal } = ac;
    const cleanups: Array<() => void> = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const hasIO = "IntersectionObserver" in window;
    const firstScan = !booted;
    booted = true;

    /* ---- stagger ---- */
    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((parent) => {
      const step = Number(parent.dataset.stagger) || 80;
      let i = 0;
      parent.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.closest("[data-stagger]") !== parent || el.dataset.delay) return;
        el.style.setProperty("--mo-d", String(i * step));
        i += 1;
      });
    });
    document.querySelectorAll<HTMLElement>("[data-reveal][data-delay]").forEach((el) => {
      el.style.setProperty("--mo-d", String(Number(el.dataset.delay) || 0));
    });

    /* ---- reveal ---- */
    const reveals = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-mo="in"])'));
    if (reveals.length) {
      if (reduce || !hasIO) {
        reveals.forEach((el) => (el.dataset.mo = "in"));
      } else {
        const io = new IntersectionObserver(
          (entries) =>
            entries.forEach((en) => {
              if (!en.isIntersecting) return;
              (en.target as HTMLElement).dataset.mo = "in";
              io.unobserve(en.target);
            }),
          { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
        );
        reveals.forEach((el) => {
          const r = el.getBoundingClientRect();
          const inView = r.top < window.innerHeight * 0.92 && r.bottom > 0;
          if (firstScan && inView) {
            el.dataset.mo = "in";
            return;
          }
          el.dataset.mo = "hidden";
          io.observe(el);
        });
        cleanups.push(() => io.disconnect());
      }
    }

    /* ---- compteurs ---- */
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]:not([data-count-done])"));
    if (counters.length && !reduce && hasIO) {
      const run = (el: HTMLElement) => {
        const to = parseFloat(el.dataset.count || "0");
        const dec = Number(el.dataset.decimals || 0);
        const pre = el.dataset.prefix || "";
        const suf = el.dataset.suffix || "";
        const fmt = (v: number) =>
          pre + v.toLocaleString("fr-FR", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
        const dur = 1400;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = clamp((now - t0) / dur);
          const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
          el.textContent = fmt(to * e);
          if (p < 1) requestAnimationFrame(tick);
          else el.dataset.countDone = "1";
        };
        requestAnimationFrame(tick);
      };
      const cio = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            cio.unobserve(en.target);
            run(en.target as HTMLElement);
          }),
        { threshold: 0.6 }
      );
      counters.forEach((el) => {
        // fige la largeur sur la valeur finale pour éviter tout décalage de mise en page
        el.style.display = "inline-block";
        el.style.minWidth = `${el.getBoundingClientRect().width}px`;
        el.style.fontVariantNumeric = "tabular-nums";
        el.textContent = (el.dataset.prefix || "") + "0" + (el.dataset.suffix || "");
        cio.observe(el);
      });
      cleanups.push(() => cio.disconnect());
    }

    /* ---- tilt + spotlight, bouton magnétique (pointeur fin, hors reduced-motion) ---- */
    if (finePointer && !reduce) {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        el.classList.add("mo-tilt", "mo-spot");
        let raf = 0;
        el.addEventListener(
          "pointermove",
          (e) => {
            const x = e.clientX;
            const y = e.clientY;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
              const r = el.getBoundingClientRect();
              const px = clamp((x - r.left) / r.width);
              const py = clamp((y - r.top) / r.height);
              el.dataset.tilting = "1";
              el.style.setProperty("--ry", `${((px - 0.5) * 9).toFixed(2)}deg`);
              el.style.setProperty("--rx", `${((0.5 - py) * 9).toFixed(2)}deg`);
              el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
              el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
            });
          },
          { signal, passive: true }
        );
        el.addEventListener(
          "pointerleave",
          () => {
            cancelAnimationFrame(raf);
            delete el.dataset.tilting;
            el.style.setProperty("--rx", "0deg");
            el.style.setProperty("--ry", "0deg");
          },
          { signal }
        );
      });

      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        el.addEventListener(
          "pointermove",
          (e) => {
            const r = el.getBoundingClientRect();
            const dx = e.clientX - (r.left + r.width / 2);
            const dy = e.clientY - (r.top + r.height / 2);
            el.dataset.pulling = "1";
            el.style.setProperty("--tx", `${(dx * 0.16).toFixed(1)}px`);
            el.style.setProperty("--ty", `${(dy * 0.28).toFixed(1)}px`);
          },
          { signal, passive: true }
        );
        el.addEventListener(
          "pointerleave",
          () => {
            delete el.dataset.pulling;
            el.style.setProperty("--tx", "0px");
            el.style.setProperty("--ty", "0px");
          },
          { signal }
        );
      });
    }

    /* ---- scroll : barre de progression + data-scrollfill ---- */
    const bar = document.querySelector<HTMLElement>("[data-mo-progress]");
    const fills = Array.from(document.querySelectorAll<HTMLElement>("[data-scrollfill]"));
    if (bar || fills.length) {
      let ticking = false;
      const update = () => {
        ticking = false;
        if (bar) {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.transform = `scaleX(${h > 0 ? clamp(window.scrollY / h) : 0})`;
        }
        fills.forEach((f) => {
          if (reduce) return f.style.setProperty("--mo-fill", "1");
          const r = f.getBoundingClientRect();
          f.style.setProperty("--mo-fill", clamp((window.innerHeight * 0.72 - r.top) / r.height).toFixed(3));
        });
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };
      window.addEventListener("scroll", onScroll, { signal, passive: true });
      window.addEventListener("resize", onScroll, { signal, passive: true });
      update();
    }

    return () => {
      ac.abort();
      cleanups.forEach((fn) => fn());
    };
  }, [deps]);

  return null;
}
