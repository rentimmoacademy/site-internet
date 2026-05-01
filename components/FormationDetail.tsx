"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Layers,
  Users,
  ShieldCheck,
  Star,
  MapPin,
} from "lucide-react";
import type { Formation } from "@/lib/formations";
import CallGate from "@/components/CallGate";

export default function FormationDetail({ formation }: { formation: Formation }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [faqIdx, setFaqIdx] = useState<number | null>(0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink pt-40 pb-24">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -top-20 right-0 h-[500px] w-[500px] rounded-full bg-brand-green/20 blur-[120px]" />

        <div className="container-x relative grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="chip text-brand-green">{formation.name}</span>
              {formation.badge && (
                <span className="rounded-full bg-brand-green px-3 py-1 text-[10px] font-black uppercase tracking-widest text-ink">
                  {formation.badge}
                </span>
              )}
              <span className="morocco-badge">
                <span>🇲🇦</span> Bonus Maroc inclus
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-6 text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.03em] text-white"
            >
              {formation.tagline}
            </motion.h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              {formation.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Clock, label: "Contenu", value: formation.duration },
              { icon: Layers, label: "Modules", value: `${formation.modules} + bonus` },
              { icon: Users, label: "Équipe", value: "Experts LCD" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <s.icon size={18} className="text-brand-green" />
                <p className="mt-4 text-[10px] uppercase tracking-widest text-white/60">{s.label}</p>
                <p className="mt-1 text-xl font-extrabold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section className="bg-ink-soft py-24">
        <div className="container-x">
          <p className="tag mb-5 text-brand-green">Pour qui</p>
          <h2 className="max-w-3xl text-h2 font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
            Cette formation est faite pour toi si…
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {formation.personas.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="rounded-3xl border border-white/10 bg-[#1f1f1f] p-8"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green font-black">
                  {i + 1}
                </div>
                <h3 className="mt-6 text-xl font-extrabold tracking-tight text-white">{p.title}</h3>
                <p className="mt-3 text-sm text-white/65">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme */}
      <section className="bg-ink py-24">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="container-x relative">
          <p className="tag mb-5 text-brand-green">Programme</p>
          <h2 className="max-w-3xl text-h2 font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
            {formation.modules} modules + 1 module bonus Maroc.
          </h2>

          <div className="mt-12 divide-y divide-white/10 rounded-3xl border border-white/10 bg-[#141414]">
            {formation.program.map((m, i) => {
              const open = openIdx === i;
              return (
                <button
                  key={m.title}
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="block w-full text-left"
                >
                  <div className="flex items-center justify-between p-6 md:p-8">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-brand-green">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-lg font-extrabold tracking-tight text-white md:text-xl">
                        {m.title}
                      </h3>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-white/60 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </div>
                  {open && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-6 pb-8 md:px-8"
                    >
                      <div className="grid gap-3 pl-10 md:grid-cols-2">
                        {m.items.map((it) => (
                          <div
                            key={it}
                            className="flex items-start gap-2 text-sm leading-relaxed text-white/75"
                          >
                            <Check size={14} className="mt-1 flex-shrink-0 text-brand-green" />
                            {it}
                          </div>
                        ))}
                      </div>
                    </motion.ul>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="bg-cream py-24 text-ink">
        <div className="container-x">
          <p className="tag mb-5 text-brand-dark">Ce que tu vas apprendre</p>
          <h2 className="max-w-3xl text-h2 font-extrabold leading-[1.05] tracking-[-0.02em]">
            Des résultats concrets, applicables tout de suite.
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {formation.outcomes.map((o, i) => (
              <motion.div
                key={o}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-white p-5"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                  <Check size={16} />
                </span>
                <p className="font-semibold leading-snug">{o}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Maroc */}
      <section className="relative overflow-hidden bg-morocco-gradient py-24 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><path d=%22M20 0L40 20L20 40L0 20Z%22 fill=%22white%22/></svg>')] [background-size:40px_40px]" />
        <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur">
              <span className="text-xl leading-none">🇲🇦</span> Module Bonus Maroc
            </div>
            <h2 className="text-h2 font-extrabold leading-[1.05] tracking-[-0.02em]">
              Le marché marocain, décortiqué.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/85">{formation.moroccoText}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["Tanger", "Marrakech", "Casablanca", "Agadir"].map((c, i) => (
              <div
                key={c}
                className={`rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur ${
                  i === 1 || i === 2 ? "translate-y-6" : ""
                }`}
              >
                <MapPin size={18} className="text-white/80" />
                <p className="mt-3 text-2xl font-extrabold tracking-tight">{c}</p>
                <p className="text-xs uppercase tracking-widest text-white/70">Couvert</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor + Testimonials */}
      <section className="bg-ink py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-[#1f1f1f] p-8 md:p-10">
            <div className="flex items-center gap-5">
              <div
                className="h-20 w-20 flex-shrink-0 rounded-full bg-brand-green bg-cover bg-center ring-2 ring-brand-green/40"
                style={{ backgroundImage: "url(/marwan.jpg)" }}
                aria-label="Marwan Afassi"
              />
              <div>
                <p className="tag mb-2 text-brand-green">Le formateur</p>
                <h2 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                  Marwan Afassi
                </h2>
                <p className="text-sm text-white/60">Ingénieur industriel · Papa · Hôte Airbnb 4,93★</p>
              </div>
            </div>
            <p className="mt-6 text-white/70">
              Lancé avec <span className="text-white">1 000 € de budget</span>, j'ai fait +500K€ de CA sans
              jamais être propriétaire. Dizaines de biens gérés entre la France et le Maroc. Expertise de
              consultant mise à ta disposition — la mienne et celle de nos équipes.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[["+500K€", "générés"], ["6 ans", "terrain"], ["2 pays", "FR & MA"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-2xl font-extrabold text-white md:text-3xl">{v}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-white/50">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="tag mb-5 text-brand-green">Ils l'ont suivie</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Témoignages vérifiés.</h2>
            <div className="mt-8 space-y-4">
              {formation.testimonials.map((t) => (
                <div key={t.name} className="rounded-2xl border border-white/10 bg-[#1f1f1f] p-6">
                  <div className="flex items-center gap-1 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="mt-3 text-base font-bold leading-tight text-white">{t.result}</p>
                  <p className="mt-2 text-sm text-white/55">
                    {t.name} — {t.city}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-cream py-28 text-ink">
        <div className="container-x">
          <div className="mx-auto max-w-3xl text-center">
            <p className="tag mb-5 text-brand-dark">Investissement</p>
            <h2 className="text-h2 font-extrabold leading-[1.05] tracking-[-0.02em]">
              Un investissement qui se rentabilise en quelques mois.
            </h2>
          </div>

          <div className="mx-auto mt-14 max-w-xl rounded-3xl border-2 border-ink/10 bg-white p-10 text-center shadow-[0_30px_80px_-30px_rgba(0,0,0,0.15)]">
            <p className="text-sm uppercase tracking-widest text-ink/50">{formation.name}</p>
            <p className="mt-4 flex items-start justify-center gap-2">
              <span className="mt-3 text-sm font-bold uppercase tracking-widest text-ink/60">
                À partir de
              </span>
              <span className="text-6xl font-extrabold tracking-[-0.03em]">{formation.price}</span>
              <span className="mt-2 text-2xl font-extrabold text-brand-green">*</span>
            </p>
            <p className="mt-2 text-sm text-ink/60">
              * Tarif indicatif. Prise en charge CPF, OPCO, paiement en 3× sans frais.{" "}
              <br className="hidden sm:block" />
              Devis personnalisé lors de l'appel stratégique.
            </p>

            <ul className="mt-10 space-y-3 text-left">
              {[
                `${formation.modules} modules complets + module bonus Maroc`,
                `${formation.duration} de vidéos terrain`,
                "Tous les templates, bails et checklists",
                "Accès à la communauté privée",
                "Mises à jour à vie",
                "Garantie satisfait ou remboursé 14 jours",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                    <Check size={14} />
                  </span>
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>

            <CallGate
              href="https://cal.com/rentimmo-academy/appel-strategique?overlayCalendar=true"
              className="btn-primary mt-10 w-full justify-center"
            >
              Réserver mon appel stratégique <ArrowRight size={16} />
            </CallGate>

            <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink/60">
              <ShieldCheck size={14} /> Appel gratuit · Sans engagement · 30 minutes
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-ink py-24">
        <div className="container-x">
          <p className="tag mb-5 text-brand-green">FAQ</p>
          <h2 className="max-w-3xl text-h2 font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
            Questions fréquentes.
          </h2>
          <div className="mt-12 divide-y divide-white/10 rounded-3xl border border-white/10 bg-[#141414]">
            {formation.faq.map((item, i) => {
              const open = faqIdx === i;
              return (
                <button
                  key={item.q}
                  onClick={() => setFaqIdx(open ? null : i)}
                  className="block w-full text-left"
                >
                  <div className="flex items-center justify-between p-6 md:p-8">
                    <h3 className="pr-4 text-base font-extrabold text-white md:text-lg">{item.q}</h3>
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
    </>
  );
}
