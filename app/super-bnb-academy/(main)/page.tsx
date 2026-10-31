"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  Check,
  X,
  ChevronDown,
  Sparkles,
  Box,
  Lock,
  Globe,
  Brain,
  LayoutGrid,
  Lightbulb,
  TrendingUp,
  Clock,
  ShieldCheck,
  CalendarCheck,
  Flame,
} from "lucide-react";
import SuperBnbHero from "@/components/sections/SuperBnbHero";
import OfferVideo from "@/components/OfferVideo";
import SuperBnbWeeks from "@/components/sections/SuperBnbWeeks";
import CallGate from "@/components/CallGate";
import SuperBnbAuditModal from "@/components/SuperBnbAuditModal";
import SuperBnbAuditPopup from "@/components/SuperBnbAuditPopup";
import Highlight from "@/components/ui/Highlight";
import Underline from "@/components/ui/Underline";

const forYou = [
  "Tu as déjà au moins 1 bien Airbnb actif",
  "Tu passes trop de temps à gérer la relation voyageur",
  "Tu veux automatiser sans te perdre dans 15 outils",
  "Tu veux récupérer 8h+ par semaine",
];

const notForYou = [
  "Tu n'as pas encore de bien en gestion",
  "Tu cherches une formation vidéo classique",
  "Tu ne veux pas faire les setups avec nous",
];

const bonuses = [
  { icon: Box, title: "Plan 3D du logement", desc: "Vue isométrique de ton logement, intégrée à ton annonce." },
  { icon: Lock, title: "Kit Autonomie (serrure TTLock)", desc: "Serrure connectée TTLock et kit domotique complémentaire, offerts, installés et paramétrés avec toi." },
  { icon: Globe, title: "Site de réservation directe", desc: "Domaine, design, paiement Stripe. 0% de commission, contrairement aux plateformes." },
  { icon: Brain, title: "GPTs personnalisés", desc: "Assistants IA pour répondre, traduire, screener les voyageurs." },
  { icon: LayoutGrid, title: "Cockpit personnalisé", desc: "Dashboard Notion + Make connecté à toutes tes plateformes." },
  { icon: Lightbulb, title: "Kit domotique additionnel", desc: "Capteurs de nuisance sonore, thermostat connecté et ampoules intelligentes, paramétrés avec toi." },
];

const compareRows: [string, string, string][] = [
  ["Format", "On fait avec toi", "Tu regardes des vidéos"],
  ["Durée", "30 jours intensifs", "À ton rythme"],
  ["Coach dédié", "yes", "no"],
  ["Setup outils inclus", "yes", "no"],
  ["Suivi personnalisé", "yes", "no"],
  ["Garantie installation", "yes", "no"],
];

const stats = [
  { icon: TrendingUp, value: "+30%", label: "de chiffre d'affaires visé", sub: "objectif visé, comparé à l'année précédente" },
  { icon: Clock, value: "15 min", label: "de gestion quotidienne visée", sub: "objectif visé, une fois le système installé" },
  { icon: ShieldCheck, value: "38 pts", label: "checklist de réception", sub: "vérifiée avec toi à la fin du programme" },
];

const faq = [
  {
    q: "Quelle est la différence avec une formation Rentimmo Academy ?",
    a: "Rentimmo Academy te forme à un métier (sous-loc, conciergerie, cleaning) avec des modules vidéo et templates. Super BNB Academy est un programme d'accompagnement : on configure les outils avec toi, sur ton compte Airbnb, en 30 jours.",
  },
  {
    q: "Combien de temps je dois y consacrer chaque semaine ?",
    a: "Compte 2 à 3h par semaine pendant 4 semaines. On fait les configurations en visio, tu valides, on déploie.",
  },
  {
    q: "Quels outils sont utilisés ?",
    a: "Superhote, PriceLabs, Stripe, Notion, Make, OpenAI (GPTs), serrure connectée TTLock. Tous les abonnements (sauf le Kit Autonomie inclus) restent à ta charge.",
  },
  {
    q: "Y a-t-il une garantie ?",
    a: "Oui. Ton système est installé et opérationnel à J30, vérifié ensemble par une checklist de réception à 38 points. Si ce n'est pas le cas : remboursement intégral. Notre objectif de transformation est de te faire atteindre +30% de CA comparé à l'année précédente et de ramener ta gestion quotidienne à 15 minutes par jour. C'est ce qu'on vise avec toi, pas une garantie de revenus.",
  },
  {
    q: "Comment optimiser une annonce Airbnb pour avoir plus de réservations ?",
    a: "Les leviers qui comptent le plus : un titre qui répond à une recherche précise, des photos professionnelles dans le bon ordre, une description structurée par bénéfices, un prix ajusté en dynamique (pas fixe) et une note hôte au-dessus de 4,8. C'est exactement ce qu'on reprend avec toi dans Super BNB Academy.",
  },
  {
    q: "Faut-il passer par une conciergerie Airbnb ou automatiser soi-même sa gestion ?",
    a: "Une conciergerie délègue tout mais coûte 15 à 25% de commission à vie. Super BNB Academy t'apprend à automatiser ta propre gestion (messages, pricing, check-in) en 30 jours : tu gardes 100% de tes revenus et tu restes autonome sur le long terme.",
  },
  {
    q: "Comment augmenter son taux d'occupation sur Airbnb ?",
    a: "Le pricing dynamique (type PriceLabs) ajusté au marché local, la diffusion multi-plateformes (Airbnb + Booking + site direct) et un temps de réponse voyageur sous la minute sont les 3 facteurs qui font le plus varier ton taux d'occupation.",
  },
  {
    q: "Quel est le meilleur outil pour gérer plusieurs logements Airbnb en même temps ?",
    a: "Un channel manager (comme Superhote) centralise calendriers et messages sur tous tes logements et toutes tes plateformes. C'est l'outil qu'on configure en priorité dans Super BNB Academy dès que tu gères 2 biens ou plus.",
  },
];

// Super BNB Academy = offre premium : couleur propre vert lime #B6F23A + noir.
// Inverse du reste du site : sections noires dominantes, respirations crème pour la lecture.
// ⛔ Jamais de texte lime sur fond clair. Lime-deep en petit texte ne passe pas AA sur crème :
// sur fond clair, kicker = pastille lime + texte noir ; liens = texte ink souligné lime-deep.
const KICKER_LIGHT = "inline-block rounded-full bg-lime px-3 py-1.5 text-ink";
const LINK_LIGHT = "font-semibold text-ink underline decoration-lime-deep decoration-2 underline-offset-2 hover:decoration-ink";
const LIFT = "transition-all duration-500 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0";
// Carte noire sur section #1A1A1A (gris #262626) / sur section #262626 (noir #1A1A1A)
const DARK_CARD = `rounded-3xl border border-white/10 bg-[#262626] text-white shadow-[0_8px_0_#5E8A0A] hover:shadow-[0_12px_0_#B6F23A] ${LIFT}`;
const DARK_CARD_INK = `rounded-3xl border border-white/10 bg-ink text-white shadow-[0_8px_0_#5E8A0A] hover:shadow-[0_12px_0_#B6F23A] ${LIFT}`;
const ICON_BOX = "inline-flex items-center justify-center rounded-2xl bg-lime text-ink";
const ICON_BOX_DARK = "inline-flex items-center justify-center rounded-2xl bg-lime/15 text-lime ring-1 ring-lime/30";
const KICKER = "text-[11px] font-bold uppercase tracking-[0.3em]";
const LIME_CTA =
  "inline-flex items-center gap-2 rounded-full bg-lime px-7 py-4 font-bold text-ink shadow-[0_6px_0_#5E8A0A] transition-all hover:-translate-y-0.5 hover:gap-3 hover:bg-lime-dark hover:shadow-[0_8px_0_#5E8A0A] motion-reduce:hover:translate-y-0";

export default function SuperBnbAcademyPage() {
  const [faqIdx, setFaqIdx] = useState<number | null>(0);
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
    <div className="bg-ink text-ink">
      <SuperBnbHero />

      {/* Vidéo : posée sur le noir du hero, ombre lime */}
      <div className="bg-ink [&_section>div>div]:!border-white/10 [&_section>div>div]:!shadow-[0_10px_0_-2px_#5E8A0A]">
        <OfferVideo name="super-bnb" title="Présentation de Super BNB Academy" />
      </div>

      {/* Journée type - narratif douleur */}
      <section className="relative bg-cream py-20">
        <div className="container-x relative mx-auto max-w-3xl">
          <p className="text-center">
            <span className={`${KICKER} ${KICKER_LIGHT}`}>Le quotidien d&apos;un hôte qui gère seul</span>
          </p>
          <div className="mt-10 space-y-5">
            {[
              { h: "07h14", d: "Une annulation de dernière minute tombe. Il faut décaler le ménage en urgence et repenser le calendrier." },
              { h: "12h30", d: "Un voyageur redemande le code de la porte pour la 3e fois. Tu réponds depuis ta pause déjeuner." },
              { h: "18h50", d: "Le prix du week-end n'a pas bougé depuis 3 semaines alors que toute la ville affiche complet." },
              { h: "22h40", d: "Un message d'un futur voyageur traîne depuis 6h sans réponse. Ton taux de réponse commence à chuter." },
            ].map((row, i) => (
              <motion.div
                key={row.h}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex items-start gap-5 rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_6px_0_rgba(26,26,26,0.06)]"
              >
                <span className="shrink-0 rounded-full bg-ink px-3 py-1.5 text-xs font-extrabold text-lime">
                  {row.h}
                </span>
                <p className="text-sm leading-relaxed text-ink/70">{row.d}</p>
              </motion.div>
            ))}
          </div>
          <p className="isolate mt-10 text-center text-xl font-extrabold tracking-tight text-ink">
            Ça te <Highlight color="lime">parle</Highlight> ?
          </p>
          <p className="mt-3 text-center text-sm text-ink/55">
            C&apos;est exactement ce qu&apos;on élimine avec toi en 30 jours&nbsp;: messages automatiques, pricing dynamique, check-in autonome.
          </p>
        </div>
      </section>

      {/* Résultats clients */}
      <section className="relative bg-ink py-20 text-white">
        <div className="container-x relative">
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={`${KICKER} text-lime`}>
                Objectifs du programme
              </p>
              <h2 className="isolate mt-4 max-w-2xl text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
                Ce qu'on vise avec toi.{" "}
                <Highlight color="lime">En 30 jours.</Highlight>
              </h2>
            </div>
            <p className="max-w-xs text-sm text-white/55">
              Objectifs visés avec toi pendant le programme Super BNB Academy.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className={`${DARK_CARD} p-7`}
              >
                <div className={`${ICON_BOX_DARK} h-11 w-11`}>
                  <s.icon size={20} strokeWidth={2.2} />
                </div>
                <p className="mt-6 text-4xl font-extrabold tracking-[-0.02em] text-lime md:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-sm font-bold text-white">{s.label}</p>
                <p className="mt-1 text-xs text-white/65">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section className="relative border-y border-white/5 bg-[#262626] py-24 text-white">
        <div className="container-x relative">
          <p className={`${KICKER} text-lime`}>Pour qui</p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Honnêtement,{" "}
            <span className="text-lime">c'est pour qui ce programme ?</span>
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className={`${DARK_CARD_INK} p-8`}>
              <p className="text-sm font-bold uppercase tracking-widest text-lime">
                ✓ Pour toi si
              </p>
              <ul className="mt-5 space-y-3">
                {forYou.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-white/85">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-lime text-ink">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-cream p-8 shadow-[0_6px_0_rgba(26,26,26,0.06)]">
              <p className="text-sm font-bold uppercase tracking-widest text-ink/55">
                ✗ Pas pour toi si
              </p>
              <ul className="mt-5 space-y-3">
                {notForYou.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-ink/70">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-ink/55">
                      <X size={14} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-ink/55 leading-relaxed">
                Pas encore de logement ? Découvre notre formation{" "}
                <Link href="/sous-location-professionnelle" className={LINK_LIGHT}>
                  sous-location professionnelle
                </Link>
                . Tu préfères tout déléguer ?{" "}
                <Link href="/devenir-conciergerie-airbnb" className={LINK_LIGHT}>
                  Découvre la conciergerie Airbnb
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Piliers */}
      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-lime/10 blur-[120px]" />
        <div className="container-x relative">
          <p className={`${KICKER} text-lime`}>
            Méthode
          </p>
          <h2 className="isolate mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Les 4 piliers du <Highlight color="lime">programme.</Highlight>
          </h2>
          <p className="mt-5 max-w-2xl text-white/65 text-sm leading-relaxed">
            Peu importe d&apos;où tu pars aujourd&apos;hui, on fait le bilan de ta situation réelle puis on avance sur ces 4 axes en 30 jours avec ton coach dédié.
          </p>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, n: "01", title: "Diagnostiquer", desc: "Bilan complet de ton annonce, de tes revenus actuels et de ta gestion quotidienne. On part de la réalité, pas d'hypothèses." },
              { icon: TrendingUp, n: "02", title: "Optimiser", desc: "Titre, photos, description, pricing dynamique. Chaque levier travaillé pour maximiser la visibilité et le taux de conversion." },
              { icon: Brain, n: "03", title: "Automatiser", desc: "Messages voyageurs, check-in autonome, cautions, calendriers multi-plateformes. Ton Airbnb tourne sans toi." },
              { icon: LayoutGrid, n: "04", title: "Scaler", desc: "Site de réservation directe, cockpit de pilotage, outils IA. Le système qui te permet de gérer plusieurs biens sans multiplier le temps." },
            ].map((pilier, i) => (
              <motion.div
                key={pilier.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className={`rounded-3xl border border-white/10 bg-[#262626] p-7 shadow-[0_8px_0_#5E8A0A] hover:border-lime/50 hover:shadow-[0_12px_0_#B6F23A] ${LIFT}`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`${ICON_BOX_DARK} h-11 w-11`}>
                    <pilier.icon size={20} strokeWidth={2.2} />
                  </div>
                  <span className="text-3xl font-extrabold tracking-tight text-lime" aria-hidden="true">{pilier.n}</span>
                </div>
                <h3 className="text-lg font-extrabold tracking-tight text-white">{pilier.title}</h3>
                <p className="mt-2 text-sm text-white/65 leading-relaxed">{pilier.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit hook - modal trigger (carte lime, texte noir, sur section noire) */}
      <section className="relative bg-[#262626] py-16">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-lime px-6 py-14 text-center shadow-[0_8px_0_#5E8A0A] md:px-12"
          >
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(26,26,26,0.14)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="relative">
              <p className={`${KICKER} text-ink/70 mb-4`}>
                Diagnostic gratuit
              </p>
              <h2 className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-extrabold text-ink leading-tight tracking-tight mb-3">
                Commence par voir où en est <span className="underline decoration-ink decoration-[0.12em] underline-offset-[0.18em]">ton annonce</span>
              </h2>
              <p className="text-ink/75 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Score /100 · Points critiques · Gain de revenus estimé · Résultat en 60 secondes
              </p>
              <button
                onClick={() => setAuditOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 font-bold text-white shadow-[0_6px_0_#5E8A0A] transition-all hover:-translate-y-0.5 hover:gap-3 hover:shadow-[0_8px_0_#5E8A0A] motion-reduce:hover:translate-y-0"
              >
                <Sparkles size={14} className="text-lime" /> Analyser mon annonce gratuitement
              </button>
              <p className="text-ink/70 text-xs mt-4">Sans inscription · Sans engagement</p>
              <Link
                href="/super-bnb-academy/audit"
                className="mt-3 inline-block text-xs font-semibold text-ink/75 underline underline-offset-4 hover:text-ink transition-colors"
              >
                Ou utilise l&apos;outil sur sa page dédiée →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <SuperBnbAuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />

      <SuperBnbWeeks />

      {/* Mid-page CTA */}
      <section className="relative bg-ink py-16">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl border border-lime/30 bg-[#262626] p-8 shadow-[0_8px_0_#5E8A0A] md:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-lime/10 blur-[100px]" />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className={`${KICKER} text-lime`}>
                  Pas sûr que ce soit pour toi ?
                </p>
                <h3 className="mt-3 max-w-2xl text-2xl font-extrabold leading-tight tracking-[-0.015em] text-white md:text-3xl">
                  Réserve ton appel diagnostic gratuit. On regarde ton annonce ensemble, sans engagement.
                </h3>
                <ul className="mt-4 space-y-1.5">
                  {[
                    "Un regard extérieur expert sur ton annonce",
                    "3 axes concrets d'amélioration identifiés",
                    "La réponse claire : Super BNB Academy est-il fait pour toi ?",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/75">
                      <Check size={14} className="mt-0.5 shrink-0 text-lime" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <CallGate
                href="https://cal.com/rentimmoacademy/superbnbacademy?overlayCalendar=true"
                className={`${LIME_CTA} flex-shrink-0`}
              >
                <CalendarCheck size={16} /> Réserver mon audit
              </CallGate>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus stack */}
      <section className="relative bg-[#262626] py-28 text-white">
        <div className="container-x relative">
          <p className={`${KICKER} text-lime`}>
            Bonus stack inclus
          </p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            6 bonus qu'on déploie <Underline color="lime">avec toi.</Underline>
          </h2>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {bonuses.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className={`${DARK_CARD_INK} p-7`}
              >
                <div className={`${i % 3 === 1 ? ICON_BOX : ICON_BOX_DARK} h-12 w-12`}>
                  <b.icon size={22} strokeWidth={2.2} />
                </div>
                <h3 className="mt-6 text-lg font-extrabold tracking-tight text-white">{b.title}</h3>
                <p className="mt-2 text-sm text-white/65">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare */}
      <section className="relative bg-cream py-24">
        <div className="container-x relative">
          <p className={`${KICKER} ${KICKER_LIGHT}`}>
            La différence
          </p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Super BNB Academy vs <span className="text-ink/55">formation classique</span>
          </h2>

          <div className="mt-12 overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-[0_6px_0_rgba(26,26,26,0.06)]">
            <table className="w-full text-sm">
              <thead>
                {/* En-tête noir */}
                <tr className="bg-ink">
                  <th className="p-5 text-left text-[10px] uppercase tracking-widest text-white/70">
                    Critère
                  </th>
                  <th className="p-5 text-left">
                    <p className="text-[10px] uppercase tracking-widest text-lime">
                      Super BNB Academy
                    </p>
                  </th>
                  <th className="p-5 text-left">
                    <p className="text-[10px] uppercase tracking-widest text-white/70">
                      Formation classique
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map(([label, a, b]) => (
                  <tr key={label} className="border-b border-ink/10 last:border-0">
                    <td className="p-5 font-bold text-ink">{label}</td>
                    <td className="p-5 font-semibold text-ink">
                      {a === "yes" ? (
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-lime text-ink"><Check size={15} strokeWidth={3} /></span>
                      ) : a === "no" ? (
                        <X size={18} className="text-ink/40" />
                      ) : (
                        a
                      )}
                    </td>
                    <td className="p-5 text-ink/55">
                      {b === "yes" ? (
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-lime text-ink"><Check size={15} strokeWidth={3} /></span>
                      ) : b === "no" ? (
                        <X size={18} className="text-ink/40" />
                      ) : (
                        b
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Garantie */}
      <section className="relative overflow-hidden bg-ink py-24 text-white">
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-lime/10 blur-[120px]" />
        <div className="container-x relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center"
          >
            <span className={`${ICON_BOX_DARK} h-14 w-14`}>
              <ShieldCheck size={26} strokeWidth={2.2} />
            </span>
            <p className={`${KICKER} text-lime`}>
              Garantie installation
            </p>
            <h3 className="isolate max-w-2xl text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white">
              Ton système est installé et opérationnel à J30.{" "}
              <Highlight color="lime">Sinon remboursement intégral.</Highlight>
            </h3>
            <p className="max-w-xl text-sm text-white/65">
              C'est notre seule garantie contractuelle, protégée par une checklist de réception à 38 points signée ensemble à la fin du programme.
            </p>
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-sm text-white/65 text-center max-w-lg">
              <span className="font-bold text-lime">Notre objectif de transformation :</span> +30% de chiffre d'affaires comparé à l'année précédente, et une gestion quotidienne ramenée à 15 minutes par jour. C'est ce qu'on vise avec toi, pas une garantie sur les revenus générés.
            </div>
          </motion.div>
        </div>
      </section>

      {/* Urgence / places limitées */}
      <section className="relative bg-[#262626] py-20 text-white">
        <div className="container-x">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border border-lime/30 bg-ink p-10 text-center shadow-[0_8px_0_#5E8A0A] md:p-14">
            <span className={`${ICON_BOX} h-14 w-14`}>
              <Flame size={26} strokeWidth={2.2} />
            </span>
            <p className={`${KICKER} text-lime`}>
              Places limitées ce mois-ci
            </p>
            <h3 className="max-w-2xl text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white">
              Il reste <span className="text-lime">2 à 3 places</span> disponibles ce mois.
            </h3>
            <p className="max-w-xl text-sm text-white/70">
              Chaque coach accompagne un nombre volontairement restreint d&apos;hôtes en simultané sur les 30 jours du programme, pour garantir un suivi réellement personnalisé, pas une formation de masse. Une fois les places du mois prises, il faut attendre la session suivante.
            </p>
            <CallGate
              href="https://cal.com/rentimmoacademy/superbnbacademy?overlayCalendar=true"
              className={`${LIME_CTA} mt-2`}
            >
              <CalendarCheck size={16} /> Réserver ma place ce mois
            </CallGate>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-white py-24">
        <div className="container-x">
          <p className={`${KICKER} ${KICKER_LIGHT}`}>FAQ</p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Questions <span className="rounded-lg bg-lime px-2">fréquentes.</span>
          </h2>

          <div className="mt-12 divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-cream shadow-[0_6px_0_rgba(26,26,26,0.06)]">
            {faq.map((item, i) => {
              const open = faqIdx === i;
              return (
                <button
                  key={item.q}
                  onClick={() => setFaqIdx(open ? null : i)}
                  className="block w-full text-left"
                >
                  <div className="flex items-center justify-between p-6 md:p-8">
                    <h3 className="pr-4 text-base font-extrabold text-ink md:text-lg">{item.q}</h3>
                    <ChevronDown
                      size={18}
                      className={`flex-shrink-0 text-ink/55 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {open && (
                    <div className="px-6 pb-8 md:px-8">
                      <p className="text-sm leading-relaxed text-ink/70">{item.a}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-lime py-28 text-ink">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(26,26,26,0.18)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="container-x relative text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-lime">
            <Sparkles size={12} /> Diagnostic gratuit
          </p>
          <h2 className="mx-auto mt-8 max-w-3xl text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.03em]">
            Prêt à <span className="underline decoration-ink decoration-[0.1em] underline-offset-[0.15em]">automatiser</span> ton Airbnb ?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg">
            On regarde ensemble où tu perds de l'argent, et comment on le corrige en 30 jours.
          </p>
          <CallGate
            href="https://cal.com/rentimmoacademy/superbnbacademy?overlayCalendar=true"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 font-bold text-white shadow-[0_6px_0_#5E8A0A] transition-all hover:-translate-y-0.5 hover:gap-3 motion-reduce:hover:translate-y-0"
          >
            Réserver mon audit gratuit <ArrowRight size={16} />
          </CallGate>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Course",
                "@id": "https://www.rentimmoacademy.fr/super-bnb-academy#course",
                name: "Super BNB Academy",
                description:
                  "Programme d'accompagnement 30 jours pour hôtes Airbnb actifs. On automatise ton logement avec toi : annonce, messages, pricing, réservation directe.",
                url: "https://www.rentimmoacademy.fr/super-bnb-academy",
                provider: {
                  "@type": "EducationalOrganization",
                  "@id": "https://www.rentimmoacademy.fr/#organization",
                  name: "Rentimmo Academy",
                  url: "https://www.rentimmoacademy.fr",
                },
                timeRequired: "P30D",
                offers: {
                  "@type": "Offer",
                  url: "https://cal.com/rentimmoacademy/superbnbacademy",
                  availability: "https://schema.org/InStock",
                  priceCurrency: "EUR",
                  category: "Coaching individuel",
                },
              },
              {
                "@type": "FAQPage",
                mainEntity: faq.map((item) => ({
                  "@type": "Question",
                  name: item.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: item.a,
                  },
                })),
              },
            ],
          }),
        }}
      />

      <SuperBnbAuditPopup />
    </div>
    </MotionConfig>
  );
}
