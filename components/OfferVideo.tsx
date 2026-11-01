"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export type OfferVideoName = "sous-location" | "conciergerie" | "menage" | "super-bnb";

const SITE = "https://www.rentimmoacademy.fr";

// Données VideoObject (Google Vidéos + moteurs IA) : nom de marque du programme dans chaque titre.
const VIDEO_META: Record<OfferVideoName, { name: string; description: string; duration: string; page: string }> = {
  "sous-location": {
    name: "Sous-Location Academy : lance ta sous-location professionnelle Airbnb",
    description:
      "Présentation de la Sous-Location Academy par Rentimmo Academy : signer un premier logement avec un petit budget, viser +700 € par mois et par logement, agrandir son parc. Accompagnement sur mesure 6 mois, lives hebdo avec Marwan Afassi, bail fourni, garantie réussite ou remboursé.",
    duration: "PT39S",
    page: "/formations/sous-location/",
  },
  conciergerie: {
    name: "Conciergerie BnB Academy : lance ta conciergerie Airbnb de zéro",
    description:
      "Présentation de la Conciergerie BnB Academy par Rentimmo Academy : démarrer sans capital, 200 à 400 € par logement géré, signer de plus en plus de mandats. Accompagnement sur mesure 6 mois, lives hebdo avec Marwan Afassi, garantie réussite ou remboursé.",
    duration: "PT36S",
    page: "/formations/conciergerie-bnb/",
  },
  menage: {
    name: "Cleaning BnB Academy : monte ton activité de ménage Airbnb",
    description:
      "Présentation de la Cleaning BnB Academy par Rentimmo Academy : répondre à la forte demande de ménage spécialisé Airbnb, structurer et automatiser son activité. Accompagnement sur mesure 6 mois, lives hebdo avec Marwan Afassi, garantie réussite ou remboursé.",
    duration: "PT40S",
    page: "/formations/cleaning-bnb/",
  },
  "super-bnb": {
    name: "Super BnB Academy : automatise ton Airbnb en 30 jours",
    description:
      "Présentation de la Super BnB Academy par Rentimmo Academy : accompagnement 30 jours pour hôtes Airbnb actifs. Annonces et plans 3D, prix par logement, channel manager et plusieurs plateformes, messagerie automatique, serrure connectée, site de réservation directe. +30 % de chiffre d'affaires garanti ou remboursé, sous conditions.",
    duration: "PT42S",
    page: "/super-bnb-academy/",
  },
};

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

  const meta = VIDEO_META[name];
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: meta.name,
    description: meta.description,
    thumbnailUrl: `${SITE}/videos/intro-${name}.webp`,
    contentUrl: `${SITE}/videos/intro-${name}.mp4`,
    uploadDate: "2026-10-31",
    duration: meta.duration,
    inLanguage: "fr-FR",
    isPartOf: `${SITE}${meta.page}`,
    publisher: { "@id": `${SITE}/#organization` },
  };

  return (
    <section className="py-12 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <div className="container-x">
        <div className={`relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-ink/10 bg-ink ${
            name === "super-bnb" ? "shadow-[0_10px_0_-2px_#8BC21A]" : "shadow-[0_10px_0_-2px_#1A6B33]"
          }`}>
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
