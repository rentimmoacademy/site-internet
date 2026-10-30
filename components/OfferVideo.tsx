"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export type OfferVideoName = "sous-location" | "conciergerie" | "menage" | "super-bnb";

// Vidéo d'intro d'une offre : lecture muette quand elle est visible, pause hors écran, son au clic.
export default function OfferVideo({ name, title }: { name: OfferVideoName; title: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container-x">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-ink/10 bg-ink shadow-[0_10px_0_-2px_#1A6B33]">
          <video
            ref={ref}
            src={`/videos/intro-${name}.mp4`}
            poster={`/videos/intro-${name}.webp`}
            muted
            loop
            playsInline
            controls={false}
            preload="none"
            aria-label={title}
            className="block aspect-video w-full"
          />
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Activer le son" : "Couper le son"}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-ink shadow-lg backdrop-blur transition-transform hover:scale-105"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {muted ? "Activer le son" : "Son activé"}
          </button>
        </div>
      </div>
    </section>
  );
}
