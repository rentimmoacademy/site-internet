"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Highlight from "@/components/ui/Highlight";

const cards = [
  {
    title: "Sous-Location Maroc",
    desc: "Législation, fiscalité, plateformes, villes rentables.",
    slug: "sous-location",
  },
  {
    title: "Conciergerie Maroc",
    desc: "Propriétaires locaux, mandats, Marrakech, Tanger, Agadir.",
    slug: "conciergerie-bnb",
  },
  {
    title: "Cleaning Maroc",
    desc: "Tarifs adaptés, clientèle, structure juridique locale.",
    slug: "cleaning-bnb",
  },
];

export default function MoroccoSpotlight() {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-28 text-white">
      {/* motif zellige discret */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22><path d=%22M20 0L40 20L20 40L0 20Z%22 fill=%22%232DB84B%22/></svg>')] [background-size:40px_40px]" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-brand-green/15 blur-[120px]" />

      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-light">
              <span className="text-xl leading-none">🇲🇦</span> Bonus Maroc inclus
            </div>
            <h2 className="isolate text-h2 font-extrabold leading-[1.05] tracking-[-0.02em] text-white">
              Un module Bonus Maroc dans <Highlight>chaque formation.</Highlight>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
              Chaque formation Rentimmo Academy inclut un module dédié au marché marocain — législation,
              plateformes, fiscalité, et opportunités dans les villes touristiques comme Tanger, Marrakech,
              Casablanca, Agadir.
            </p>
          </motion.div>

          <div className="flex gap-2 text-right">
            <div className="flex-1 rounded-3xl bg-white p-6 text-ink shadow-[0_8px_0_#1A6B33]">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-dark">Villes couvertes</p>
              <p className="mt-2 text-3xl font-extrabold leading-tight">Tanger · Marrakech</p>
              <p className="text-3xl font-extrabold leading-tight">Casablanca · Agadir</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {cards.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/formations/${c.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.05] p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-green/50 hover:bg-white/[0.08]"
              >
                <h3 className="text-xl font-extrabold tracking-tight text-white">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-white/65">{c.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-light transition-all group-hover:gap-3">
                  Voir la formation <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
