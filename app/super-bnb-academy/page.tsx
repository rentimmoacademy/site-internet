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
  Star,
} from "lucide-react";
import SuperBnbHero from "@/components/sections/SuperBnbHero";
import SuperBnbWeeks from "@/components/sections/SuperBnbWeeks";

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
  { icon: Lock, title: "Serrure connectée", desc: "Kit SmartLife installé, check-in autonome 24/7." },
  { icon: Globe, title: "Site de réservation directe", desc: "Domaine, design, paiement Stripe — économies 15% de commissions." },
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
  ["Garantie résultat", "yes", "no"],
];

const testimonials = [
  {
    name: "Sébastien R.",
    city: "Bordeaux",
    quote:
      "Avant : 2h/jour à répondre aux voyageurs. Après 30 jours : 15 min/semaine. Je ne suis plus esclave de mon annonce.",
    metric: "+38% de revenus",
  },
  {
    name: "Camille D.",
    city: "Annecy",
    quote:
      "Le site de réservation directe + les GPTs : je passe 0 commission Airbnb sur 30% de mes nuitées maintenant.",
    metric: "8h gagnées / sem",
  },
  {
    name: "Yassine T.",
    city: "Tanger",
    quote:
      "On a tout reconfiguré avec Yassine. Mes notes sont passées de 4,7 à 4,93. Et j'ai 2 fois plus de réservations directes.",
    metric: "Note 4,93★",
  },
];

const faq = [
  {
    q: "Quelle est la différence avec une formation Rentimmo Academy ?",
    a: "Rentimmo Academy te forme à un métier (sous-loc, conciergerie, cleaning) avec des modules vidéo et templates. Super BnB Academy est un programme d'accompagnement : on configure les outils avec toi, sur ton compte Airbnb, en 30 jours.",
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
    a: "Oui. Si à la fin des 4 semaines tes outils ne sont pas opérationnels, on continue jusqu'à ce qu'ils le soient. Sans frais supplémentaire.",
  },
];

export default function SuperBnbAcademyPage() {
  const [faqIdx, setFaqIdx] = useState<number | null>(0);

  return (
    <div className="font-poppins bg-auto-navy text-white">
      <SuperBnbHero />

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

      <SuperBnbWeeks />

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
            Super BnB Academy vs <span className="text-white/40">formation classique</span>
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
                      Super BnB
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

      {/* Testimonials */}
      <section className="relative bg-auto-navy py-24">
        <div className="dot-grid-mint pointer-events-none absolute inset-0 [background-size:32px_32px]" />
        <div className="container-x relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-auto-mint">
            Hôtes accompagnés
          </p>
          <h2 className="mt-6 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            Ils ont fait le programme.
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-3xl border border-white/10 bg-auto-navy-soft/70 p-7 backdrop-blur"
              >
                <div className="flex items-center gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/85">« {t.quote} »</p>
                <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-white/55">{t.city}</p>
                  </div>
                  <span className="rounded-full bg-auto-mint/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-auto-mint">
                    {t.metric}
                  </span>
                </div>
              </motion.div>
            ))}
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
            <Sparkles size={12} /> Cohorte limitée
          </p>
          <h2 className="mx-auto mt-8 max-w-3xl text-[clamp(2.25rem,5.5vw,4.5rem)] font-extrabold leading-[1] tracking-[-0.03em]">
            Les places sont limitées.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg">
            8 hôtes par cohorte maximum pour garantir l'accompagnement personnalisé. Réserve ta place
            avant fermeture.
          </p>
          <a
            href="https://cal.com/rentimmo-academy/superbnbacademy?overlayCalendar=true"
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-auto-navy px-8 py-4 font-bold text-auto-mint transition-transform hover:scale-[1.03]"
          >
            Réserver mon audit gratuit <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            name: "Super BnB Academy",
            description:
              "Programme d'accompagnement 30 jours pour hôtes Airbnb actifs. On automatise ton logement avec toi : annonce, messages, pricing, réservation directe.",
            provider: {
              "@type": "EducationalOrganization",
              name: "Rentimmo Academy",
              sameAs: "https://rentimmo-academy.com",
            },
            timeRequired: "P30D",
          }),
        }}
      />
    </div>
  );
}
