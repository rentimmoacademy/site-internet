"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, BadgeCheck, Star, Users } from "lucide-react";
import StatCounter from "@/components/StatCounter";
import CallGate from "@/components/CallGate";
import Highlight from "@/components/ui/Highlight";
import { AGGREGATE_RATING } from "@/lib/testimonials";
import { useReducedMotionAfterMount } from "@/lib/useReducedMotionAfterMount";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Trou de serrure (viewBox 100 x 140) utilisé comme masque : la pièce réelle apparaît à travers.
const KEYHOLE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 140'%3E%3Ccircle cx='50' cy='46' r='30'/%3E%3Cpath d='M37 64h26l13 72H24z'/%3E%3C/svg%3E\")";

const ROOM = "/properties/property-5.webp";

type Depth = { mx: MotionValue<number>; my: MotionValue<number> };

// Décalage au pointeur proportionnel à la profondeur du plan (négatif = plan arrière).
function usePointerShift({ mx, my }: Depth, depth: number) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return { x, y };
}

function ProofCard({
  className,
  children,
  delay,
  shift,
  scrollY,
}: {
  className: string;
  children: React.ReactNode;
  delay: number;
  shift: { x: MotionValue<number>; y: MotionValue<number> };
  scrollY: MotionValue<number>;
}) {
  const y = useTransform([shift.y, scrollY], ([a, b]: number[]) => a + b);
  return (
    <motion.div style={{ x: shift.x, y }} className={`absolute z-30 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20, delay }}
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/80 px-4 py-3 text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function Scene({ progress, depth, reduce }: { progress: MotionValue<number>; depth: Depth; reduce: boolean }) {
  // Ouverture de la serrure : animée au chargement, puis prolongée par le scroll.
  const open = useMotionValue(0);
  useEffect(() => {
    if (reduce) {
      open.set(1);
      return;
    }
    const c = animate(open, 1, { duration: 1.4, delay: 0.25, ease: [0.65, 0, 0.35, 1] });
    return () => c.stop();
  }, [open, reduce]);

  const maskSize = useTransform([open, progress], ([o, p]: number[]) => {
    const size = o * 92 + (reduce ? 0 : p * 520);
    return `${size}% auto`;
  });
  const roomScale = useTransform(progress, [0, 1], [1.12, 1]);
  const manY = useTransform(progress, [0, 1], [0, -40]);
  const cardsY = useTransform(progress, [0, 1], [0, -170]);

  const bgShift = usePointerShift(depth, -6);
  const manShift = usePointerShift(depth, 5);
  const nearShift = usePointerShift(depth, 16);
  const midShift = usePointerShift(depth, 10);
  const manYTotal = useTransform([manShift.y, manY], ([a, b]: number[]) => a + b);

  return (
    <div className="relative mx-auto mt-10 aspect-square w-full max-w-[300px] lg:max-w-[460px]">
      {/* Halo arrière */}
      <div className="pointer-events-none absolute -inset-16 bg-[radial-gradient(closest-side,rgba(45,184,75,0.35),transparent)]" />

      {/* Cadre : la pièce réelle à travers la serrure */}
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#141414]">
        <motion.div
          style={{
            x: bgShift.x,
            y: bgShift.y,
            scale: roomScale,
            WebkitMaskImage: KEYHOLE,
            maskImage: KEYHOLE,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "50% 34%",
            maskPosition: "50% 34%",
            WebkitMaskSize: maskSize,
            maskSize,
          }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ROOM} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-brand-dark/20" />
        </motion.div>
      </div>

      {/* Sujet : ancré au bas du cadre, la tête dépasse du cadre. Jamais en opacité 0 : c'est l'élément LCP. */}
      <motion.div
        style={{ x: manShift.x, y: manYTotal }}
        className="absolute inset-x-0 bottom-0 z-20 flex justify-center"
      >
        <motion.img
          src="/marwan-cutout.webp"
          alt="Marwan Afassi, fondateur de Rentimmo Academy"
          width={825}
          height={897}
          fetchPriority="high"
          initial={{ y: 28, scale: 0.97 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: reduce ? 0 : 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="h-auto w-full rounded-b-[2rem] drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
        />
      </motion.div>

      {/* Avant-plan : preuves réelles, plus rapides que le sujet */}
      {AGGREGATE_RATING.reviewCount > 0 && (
        <ProofCard className="-left-10 top-[22%]" delay={1.6} shift={nearShift} scrollY={cardsY}>
          <Star size={18} className="fill-brand-green text-brand-green" />
          <div>
            <p className="text-sm font-extrabold leading-tight">{AGGREGATE_RATING.ratingValue}/5</p>
            <p className="text-xs text-white/60">{AGGREGATE_RATING.reviewCount} avis élèves</p>
          </div>
        </ProofCard>
      )}
      <ProofCard className="-right-8 top-[48%]" delay={1.75} shift={midShift} scrollY={cardsY}>
        <BadgeCheck size={18} className="text-brand-green" />
        <p className="text-sm font-bold leading-tight">
          Organisme certifié
          <br />
          <span className="font-medium text-white/60">Qualiopi</span>
        </p>
      </ProofCard>
      <ProofCard className="-left-6 bottom-[9%] hidden lg:block" delay={1.9} shift={midShift} scrollY={cardsY}>
        <Users size={18} className="text-brand-green" />
        <p className="text-sm font-bold leading-tight">
          Des dizaines d&apos;élèves
          <br />
          <span className="font-medium text-white/60">déjà lancés</span>
        </p>
      </ProofCard>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionAfterMount();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const textY = useTransform(progress, [0, 1], reduce ? [0, 0] : [0, -110]);

  // Pointeur : décalage léger par plan, desktop uniquement.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 80, damping: 18 });
  const my = useSpring(rawY, { stiffness: 80, damping: 18 });
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const sceneProgress = reduce ? scrollYProgress : progress;

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink pt-24"
    >
      {/* Dot grid */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-80" />
      {/* Radial gradients au lieu de blur-[120px] : même rendu, sans filtre coûteux au premier paint mobile */}
      <div className="pointer-events-none absolute -top-64 left-1/2 h-[900px] w-[900px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(45,184,75,0.22),transparent)]" />
      <div className="pointer-events-none absolute -bottom-72 -right-24 h-[800px] w-[800px] bg-[radial-gradient(closest-side,rgba(26,107,51,0.32),transparent)]" />

      <div className="container-x relative z-10 grid items-center py-16 lg:grid-cols-[1.35fr_1fr] lg:gap-10 lg:py-20">
        {/* Mobile : le wrapper s'efface (contents) pour glisser la scène juste sous le titre */}
        <motion.div style={{ y: textY }} className="contents lg:block">
          {/* Floating badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="order-1 mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-green" />
            </span>
            <span className="flex items-center gap-1">
              <span>🇫🇷</span>
              <span>🇲🇦</span>
            </span>
            Formation disponible en France & Maroc
          </motion.div>

          {/* Headline — no entrance animation: this is the LCP element, must paint immediately */}
          <h1 className="order-2 max-w-4xl text-[clamp(2.3rem,4.4vw,3.9rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-white">
            Formation <span className="bg-brand-gradient bg-clip-text text-transparent">sous-location & conciergerie Airbnb</span>{" "}
            : génère +700 €/mois sans crédit, sans apport.
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="order-4 mt-8 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
          >
            La formation terrain pour lancer ta sous-location, ta conciergerie Airbnb ou ton activité
            de ménage pro.{" "}
            <Highlight>
              <span className="text-white">Sans banque, sans crédit, sans apport.</span>
            </Highlight>
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="show"
            className="order-5 mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/formations" className="btn-primary">
              Découvrir les formations <ArrowRight size={18} />
            </Link>
            <CallGate
              href="https://cal.com/rentimmoacademy/appel-strategique?overlayCalendar=true"
              className="btn-ghost"
            >
              Réserver un appel stratégique
            </CallGate>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="show"
            className="order-6 mt-14 grid grid-cols-2 gap-8 border-t border-white/10 pt-8 md:grid-cols-4"
          >
            {[
              { label: "ans d'expérience terrain", value: 7 },
              { label: "€ générés sans être propriétaire", value: 697, prefix: "+", suffix: "K" },
              { label: "formations complètes", value: 3 },
              { label: "marchés couverts", value: 2, labelExtra: "France & Maroc" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                  <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-xs uppercase tracking-widest text-white/50">
                  {s.labelExtra ?? s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="order-3 mt-4 px-10 sm:px-16 lg:order-none lg:mt-0 lg:px-6">
          <Scene progress={sceneProgress} depth={{ mx, my }} reduce={reduce} />
        </div>
      </div>
    </section>
  );
}
