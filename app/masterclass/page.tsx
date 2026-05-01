"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, PlayCircle, ShieldCheck } from "lucide-react";
import MasterclassPlayer from "@/components/MasterclassPlayer";
import { isMasterclassWatched } from "@/lib/masterclass";

export default function MasterclassPage() {
  const [unlocked, setUnlocked] = useState(() => isMasterclassWatched());

  return (
    <section className="relative overflow-hidden bg-ink pt-32 pb-24">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-green/30 bg-brand-green/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-green">
            <PlayCircle size={14} /> Masterclass offerte
          </span>
          <h1 className="mt-7 text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-white">
            Génère tes premiers revenus Airbnb{" "}
            <span className="text-brand-green">sans crédit, sans apport.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            Visionne la masterclass complète. Tu débloques l'accès à l'appel stratégique en
            regardant au moins 70% de la vidéo.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <MasterclassPlayer onUnlock={() => setUnlocked(true)} />
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          {unlocked ? (
            <div className="rounded-3xl border border-brand-green/40 bg-brand-green/10 p-8 text-center md:p-10">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green text-ink">
                <ShieldCheck size={26} strokeWidth={2.4} />
              </span>
              <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                Appel stratégique débloqué.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/75">
                Réserve ton créneau pour échanger avec Marwan sur ton projet et le modèle qui te
                correspond.
              </p>
              <Link
                href="/reserver"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-4 font-bold text-ink transition-transform hover:scale-[1.03]"
              >
                Réserver mon appel <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-ink-soft/60 p-8 text-center backdrop-blur md:p-10">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white/50 ring-1 ring-white/10">
                <Lock size={24} />
              </span>
              <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                Appel verrouillé pour le moment.
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/65">
                Continue à visionner la masterclass — l'accès à l'appel stratégique se débloque
                automatiquement à 70% de la vidéo.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
