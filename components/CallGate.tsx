"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock, X, ShieldCheck, PlayCircle } from "lucide-react";
import { isMasterclassWatched } from "@/lib/masterclass";

type Variant = "primary" | "ghost" | "mint";

const variantClasses: Record<Variant, string> = {
  primary:
    "inline-flex items-center gap-2 rounded-full bg-brand-green px-7 py-4 font-bold text-ink shadow-glow transition-transform hover:scale-[1.02]",
  ghost:
    "inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 font-bold text-white backdrop-blur transition-colors hover:bg-white/10",
  mint:
    "inline-flex items-center gap-2 rounded-full bg-auto-mint px-7 py-4 font-bold text-auto-navy transition-all hover:scale-[1.02] hover:shadow-glow-mint",
};

export function CallGateDialog({
  open,
  onClose,
  href,
}: {
  open: boolean;
  onClose: () => void;
  href: string;
}) {
  const [step, setStep] = useState<"masterclass" | "budget" | "blocked">("budget");

  useEffect(() => {
    if (!open) return;
    setStep(isMasterclassWatched() ? "budget" : "masterclass");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleBudget = (qualified: boolean) => {
    if (qualified) {
      window.open(href, "_blank", "noopener,noreferrer");
      onClose();
    } else {
      setStep("blocked");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-ink p-8 text-white shadow-2xl md:p-10"
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>

        {step === "masterclass" && (
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/15 text-brand-green ring-1 ring-brand-green/40">
              <PlayCircle size={22} strokeWidth={2.2} />
            </span>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-green">
              Étape 1 / 2
            </p>
            <h3 className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.015em] md:text-3xl">
              Visionne la masterclass d'abord.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Pour qu'on parle de ton projet en connaissance de cause, on demande à tous nos
              prospects de visionner la masterclass au préalable. C'est gratuit, ~30 min, et ça pose
              les bases.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/masterclass"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3.5 font-bold text-ink transition-transform hover:scale-[1.02]"
              >
                Voir la masterclass <ArrowRight size={14} />
              </Link>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white/70 hover:bg-white/5"
              >
                Plus tard
              </button>
            </div>
          </div>
        )}

        {step === "budget" && (
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/15 text-brand-green ring-1 ring-brand-green/40">
              <ShieldCheck size={22} strokeWidth={2.2} />
            </span>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-green">
              Pré-qualification
            </p>
            <h3 className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.015em] md:text-3xl">
              As-tu un budget pour développer ton activité ?
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Pour que l'appel soit utile, on s'assure que tu as les moyens de passer à l'action.
              Pas de jugement — juste un filtre pour respecter ton temps et le nôtre.
            </p>
            <div className="mt-7 grid gap-3">
              <button
                onClick={() => handleBudget(true)}
                className="group flex items-center justify-between rounded-2xl border-2 border-brand-green/40 bg-brand-green/10 px-5 py-4 text-left transition-colors hover:border-brand-green hover:bg-brand-green/20"
              >
                <span>
                  <p className="text-sm font-extrabold text-white">Oui, j'ai un budget</p>
                  <p className="text-xs text-white/60">
                    Je suis prêt à investir pour développer mon activité
                  </p>
                </span>
                <ArrowRight
                  size={16}
                  className="text-brand-green transition-transform group-hover:translate-x-1"
                />
              </button>
              <button
                onClick={() => handleBudget(false)}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <span>
                  <p className="text-sm font-bold text-white/85">Non, 0 € pour le moment</p>
                  <p className="text-xs text-white/55">Je veux juste me renseigner</p>
                </span>
              </button>
            </div>
          </div>
        )}

        {step === "blocked" && (
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white/50 ring-1 ring-white/10">
              <Lock size={22} />
            </span>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
              Pas encore le bon moment
            </p>
            <h3 className="mt-3 text-2xl font-extrabold leading-tight tracking-[-0.015em] md:text-3xl">
              L'appel stratégique demande un budget de départ.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Sans capital de départ, on ne peut pas t'aider sur l'appel stratégique. Mais tu peux
              quand même progresser : visionne la masterclass, lis le blog, applique ce que tu
              apprends, et reviens nous voir quand tu seras prêt.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/masterclass"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-green px-6 py-3.5 font-bold text-ink transition-transform hover:scale-[1.02]"
              >
                Voir la masterclass <ArrowRight size={14} />
              </Link>
              <Link
                href="/blog"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-white/15 px-6 py-3.5 text-sm font-bold text-white/80 hover:bg-white/5"
              >
                Lire le blog
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface CallGateProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}

export default function CallGate({ href, children, className, variant = "primary" }: CallGateProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className={className ?? variantClasses[variant]}
      >
        {children}
      </a>
      <CallGateDialog open={open} onClose={() => setOpen(false)} href={href} />
    </>
  );
}
