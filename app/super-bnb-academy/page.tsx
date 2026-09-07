"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import SuperBnbHero from "@/components/sections/SuperBnbHero";
import SuperBnbWeeks from "@/components/sections/SuperBnbWeeks";
import CallGate from "@/components/CallGate";
import SuperBnbAuditModal from "@/components/SuperBnbAuditModal";
import SuperBnbAuditPopup from "@/components/SuperBnbAuditPopup";

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
  { icon: Lock, title: "Kit domotique complet", desc: "Serrure connectée, détecteur fumée, détecteur nuisance sonore et kit radiateur économie énergie. Offert, installé et paramétré avec toi." },
  { icon: Globe, title: "Site de réservation directe", desc: "Domaine, design, paiement Stripe — 0% de commission, contrairement aux plateformes." },
  { icon: Brain, title: "GPTs personnalisés", desc: "Assistants IA pour répondre, traduire, screener les voyageurs." },
  { icon: LayoutGrid, title: "Cockpit personnalisé", desc: "Dashboard Notion + Make connecté à toutes tes plateformes." },
  { icon: Lightbulb, title: "Kit SmartLife", desc: "Capteurs bruit, thermostat, ampoules connectées paramétrés." },
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
  { icon: TrendingUp, value: "+38%", label: "de revenus en 30 jours", sub: "moyenne de nos clients ayant complété le programme" },
  { icon: Clock, value: "15 min", label: "par jour de gestion", sub: "temps moyen de gestion quotidienne une fois le système installé" },
  { icon: ShieldCheck, value: "4,93 / 5", label: "note hôte moyenne atteinte", sub: "en partant d'une note inférieure à 4,8 avant le programme" },
];

const faq = [
  {
    q: "Quelle est la différence avec une formation Rentimmo Academy ?",
    a: "Rentimmo Academy te forme à un métier (sous-loc, conciergerie, cleaning) avec des modules vidéo et templates. SuperBNB Academy est un programme d'accompagnement : on configure les outils avec toi, sur ton compte Airbnb, en 30 jours.",
  },
  {
    q: "Combien de temps je dois y consacrer chaque semaine ?",
    a: "Compte 2 à 3h par semaine pendant 4 semaines. On fait les configurations en visio, tu valides, on déploie.",
  },
  {
    q: "Quels outils sont utilisés ?",
    a: "Superhote, PriceLabs, Stripe, Notion, Make, OpenAI (GPTs), SmartLife. Tous les abonnements (sauf SmartLife inclus) restent à ta charge.",
  },
  {
    q: "Y a-t-il une garantie ?",
    a: "Oui. Ton système est installé et opérationnel à J30, vérifié ensemble par une checklist de réception à 38 points. Si ce n'est pas le cas : remboursement intégral. Notre objectif de transformation est de te faire atteindre +30% de CA comparé à l'année précédente et de ramener ta gestion quotidienne à 15 minutes par jour. C'est ce qu'on vise avec toi, pas une garantie de revenus.",
  },
];

export default function SuperBnbAcademyPage() {
  const [faqIdx, setFaqIdx] = useState<number | null>(0);
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <div className="font-poppins bg-auto-navy text-white">
      <SuperBnbHero />

      {/* Résultats clients */}
      <section className="relative border-y border-white/5 bg-auto-navy-soft py-20">
        <div className="dot-grid-mint pointer-events-none absolute inset-0 [background-size:32px_32px]" />
        <div className="container-x relative">
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint">
                Résultats de nos clients
              </p>
              <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
                Ce que nos clients ont obtenu.{" "}
                <span className="bg-auto-mint bg-clip-text text-transparent">En 30 jours.</span>
              </h2>
            </div>
            <p className="max-w-xs text-sm text-white/60">
              Chiffres moyens des clients ayant complété le programme SuperBNB Academy.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-3xl border border-white/10 bg-auto-navy/60 p-7 backdrop-blur"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-auto-mint/10 text-auto-mint ring-1 ring-auto-mint/30">
                  <s.icon size={20} strokeWidth={2.2} />
                </div>
                <p className="mt-6 text-4xl font-extrabold tracking-[-0.02em] text-auto-mint md:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-sm font-bold text-white">{s.label}</p>
                <p className="mt-1 text-xs text-white/55">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section className="relative bg-auto-navy-soft py-24">
        <div className="dot-grid-mint pointer-events-none absolute inset-0 [background-size:32px_32px]" />
        <div className="container-x relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint">Pour qui</p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Honnêtement,{" "}
            <span className="bg-auto-mint bg-clip-text text-transparent">
              c'est pour qui ce programme ?
            </span>
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-auto-mint/30 bg-auto-mint/5 p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-auto-mint">
                ✓ Pour toi si
              </p>
              <ul className="mt-5 space-y-3">
                {forYou.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-white/85">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-auto-mint/20 text-auto-mint">
                      <Check size={14} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-white/50">
                ✗ Pas pour toi si
              </p>
              <ul className="mt-5 space-y-3">
                {notForYou.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-white/65">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white/50">
                      <X size={14} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Piliers */}
      <section className="relative bg-auto-navy py-24">
        <div className="dot-grid-mint pointer-events-none absolute inset-0 [background-size:32px_32px]" />
        <div className="container-x relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint">
            Méthode
          </p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Les 4 piliers du{" "}
            <span className="bg-auto-mint bg-clip-text text-transparent">programme.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-white/60 text-sm leading-relaxed">
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
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-3xl border border-white/10 bg-auto-navy-soft/60 p-7 backdrop-blur"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-auto-mint/10 text-auto-mint ring-1 ring-auto-mint/30">
                    <pilier.icon size={20} strokeWidth={2.2} />
                  </div>
                  <span className="text-3xl font-extrabold tracking-tight text-auto-mint/30">{pilier.n}</span>
                </div>
                <h3 className="text-lg font-extrabold tracking-tight text-white">{pilier.title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{pilier.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Audit hook — modal trigger */}
      <section className="relative bg-auto-navy border-y border-white/5 py-16">
        <div className="dot-grid-mint pointer-events-none absolute inset-0 [background-size:32px_32px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-auto-mint/8 blur-[100px]" />
        <div className="container-x relative text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint mb-4">
            Diagnostic gratuit
          </p>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.25rem)] font-extrabold text-white leading-tight tracking-tight mb-3">
            Commence par voir où en est ton annonce
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Score /100 · Points critiques · Gain de revenus estimé · Résultat en 60 secondes
          </p>
          <button
            onClick={() => setAuditOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-auto-mint px-8 py-4 font-bold text-auto-navy hover:brightness-110 transition-all hover:shadow-glow-mint"
          >
            <Sparkles size={14} /> Analyser mon annonce gratuitement
          </button>
          <p className="text-white/25 text-xs mt-3">Sans inscription · Sans engagement</p>
        </div>
      </section>

      <SuperBnbAuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />

      <SuperBnbWeeks />

      {/* Mid-page CTA */}
      <section className="relative bg-auto-navy py-16">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl border border-auto-mint/30 bg-gradient-to-br from-auto-mint/15 via-auto-mint/5 to-transparent p-8 md:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-auto-mint/30 blur-[100px]" />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint">
                  Pas sûr que ce soit pour toi ?
                </p>
                <h3 className="mt-3 max-w-2xl text-2xl font-extrabold leading-tight tracking-[-0.015em] md:text-3xl">
                  Réserve ton appel diagnostic gratuit de 30 minutes. On regarde ton annonce ensemble, sans engagement.
                </h3>
                <ul className="mt-4 space-y-1.5">
                  {[
                    "Un regard extérieur expert sur ton annonce",
                    "3 axes concrets d'amélioration identifiés",
                    "La réponse claire : SuperBNB Academy est-il fait pour toi ?",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-white/70">
                      <Check size={14} className="mt-0.5 shrink-0 text-auto-mint" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <CallGate
                href="https://cal.com/rentimmoacademy/superbnbacademy?overlayCalendar=true"
                className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-auto-mint px-7 py-4 font-bold text-auto-navy transition-all hover:scale-[1.03] hover:shadow-glow-mint"
              >
                <CalendarCheck size={16} /> Réserver mon audit
              </CallGate>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus stack */}
      <section className="relative bg-auto-navy py-28">
        <div className="dot-grid-mint pointer-events-none absolute inset-0 [background-size:32px_32px]" />
        <div className="container-x relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint">
            Bonus stack inclus
          </p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            6 bonus qu'on déploie{" "}
            <span className="bg-auto-mint bg-clip-text text-transparent">avec toi.</span>
          </h2>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {bonuses.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-3xl border border-white/10 bg-auto-navy-soft/60 p-7 backdrop-blur transition-all hover:-translate-y-1 hover:border-auto-mint/40"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-auto-mint/10 text-auto-mint ring-1 ring-auto-mint/30">
                  <b.icon size={22} strokeWidth={2.2} />
                </div>
                <h3 className="mt-6 text-lg font-extrabold tracking-tight">{b.title}</h3>
                <p className="mt-2 text-sm text-white/65">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare */}
      <section className="relative bg-auto-navy-soft py-24">
        <div className="dot-grid-mint pointer-events-none absolute inset-0 [background-size:32px_32px]" />
        <div className="container-x relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint">
            La différence
          </p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            SuperBNB Academy vs <span className="text-white/40">formation classique</span>
          </h2>

          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-auto-navy/50 backdrop-blur">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-5 text-left text-[10px] uppercase tracking-widest text-white/50">
                    Critère
                  </th>
                  <th className="p-5 text-left">
                    <p className="text-[10px] uppercase tracking-widest text-auto-mint">
                      SuperBNB Academy
                    </p>
                  </th>
                  <th className="p-5 text-left">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">
                      Formation classique
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map(([label, a, b]) => (
                  <tr key={label} className="border-b border-white/5 last:border-0">
                    <td className="p-5 font-bold text-white">{label}</td>
                    <td className="p-5 text-auto-mint">
                      {a === "yes" ? (
                        <Check size={18} className="text-auto-mint" />
                      ) : a === "no" ? (
                        <X size={18} className="text-white/30" />
                      ) : (
                        a
                      )}
                    </td>
                    <td className="p-5 text-white/50">
                      {b === "yes" ? (
                        <Check size={18} className="text-auto-mint" />
                      ) : b === "no" ? (
                        <X size={18} className="text-white/30" />
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
      <section className="relative bg-auto-navy py-20">
        <div className="container-x">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl border border-white/10 bg-auto-navy-soft/60 p-10 text-center md:p-14">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-auto-mint/15 text-auto-mint ring-1 ring-auto-mint/40">
              <ShieldCheck size={26} strokeWidth={2.2} />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint">
              Garantie installation
            </p>
            <h3 className="max-w-2xl text-[clamp(1.75rem,3.5vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em]">
              Ton système est installé et opérationnel à J30.{" "}
              <span className="bg-auto-mint bg-clip-text text-transparent">
                Sinon remboursement intégral.
              </span>
            </h3>
            <p className="max-w-xl text-sm text-white/65">
              C'est notre seule garantie contractuelle, protégée par une checklist de réception à 38 points signée ensemble à la fin du programme.
            </p>
            <div className="mt-2 rounded-2xl border border-auto-mint/20 bg-auto-mint/5 px-6 py-4 text-sm text-white/70 text-center max-w-lg">
              <span className="font-bold text-auto-mint">Notre objectif de transformation :</span> +30% de chiffre d'affaires comparé à l'année précédente, et une gestion quotidienne ramenée à 15 minutes par jour. C'est ce qu'on vise avec toi, pas une garantie sur les revenus générés.
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-auto-navy-soft py-24">
        <div className="container-x">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint">FAQ</p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Questions fréquentes.
          </h2>

          <div className="mt-12 divide-y divide-white/10 rounded-3xl border border-white/10 bg-auto-navy/40 backdrop-blur">
            {faq.map((item, i) => {
              const open = faqIdx === i;
              return (
                <button
                  key={item.q}
                  onClick={() => setFaqIdx(open ? null : i)}
                  className="block w-full text-left"
                >
                  <div className="flex items-center justify-between p-6 md:p-8">
                    <h3 className="pr-4 text-base font-extrabold md:text-lg">{item.q}</h3>
                    <ChevronDown
                      size={18}
                      className={`flex-shrink-0 text-white/60 transition-transform ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {open && (
                    <div className="px-6 pb-8 md:px-8">
                      <p className="text-sm leading-relaxed text-white/70">{item.a}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-auto-mint py-28 text-auto-navy">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(13,27,46,0.18)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="container-x relative text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-auto-navy px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-auto-mint">
            <Sparkles size={12} /> Diagnostic gratuit
          </p>
          <h2 className="mx-auto mt-8 max-w-3xl text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.03em]">
            Prêt à automatiser ton Airbnb ?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg">
            On regarde ensemble où tu perds de l'argent, et comment on le corrige en 30 jours.
          </p>
          <CallGate
            href="https://cal.com/rentimmoacademy/superbnbacademy?overlayCalendar=true"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-auto-navy px-8 py-4 font-bold text-auto-mint transition-transform hover:scale-[1.03]"
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
                name: "SuperBNB Academy",
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
  );
}
