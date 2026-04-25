"use client";

import { motion } from "framer-motion";
import { MapPin, Star, TrendingUp } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

type Property = {
  name: string;
  city: string;
  type: string;
  occupancy: string;
  rating: string;
  highlight: string;
  image?: string;
  bg?: string;
};

const properties: Property[] = [
  {
    name: "Le Basin",
    city: "Troyes",
    type: "Studio voyageurs",
    occupancy: "92%",
    rating: "4,9★",
    highlight: "Décor jaune moutarde, parquet point de Hongrie",
    image: "/properties/property-1.jpg",
  },
  {
    name: "Le Cosy",
    city: "Reims",
    type: "Studio voyageurs",
    occupancy: "88%",
    rating: "4,9★",
    highlight: "Décor scandinave, écrin pour couples",
    image: "/properties/property-2.PNG",
  },
  {
    name: "Le Skyloft",
    city: "Troyes centre",
    type: "Combles aménagés",
    occupancy: "94%",
    rating: "5,0★",
    highlight: "Lumière zénithale, déco bois & céladon",
    image: "/properties/property-3.JPG",
  },
  {
    name: "Le New York",
    city: "Troyes",
    type: "Appartement 2 pièces",
    occupancy: "90%",
    rating: "4,9★",
    highlight: "Bleu cobalt, ambiance Brooklyn",
    image: "/properties/property-4.jpg",
  },
  {
    name: "Le Latino",
    city: "Troyes",
    type: "Appartement haussmannien",
    occupancy: "89%",
    rating: "4,9★",
    highlight: "Parquet, voilage et coussins coraux",
    image: "/properties/property-5.jpg",
  },
  {
    name: "Le Pacha",
    city: "Tanger",
    type: "Appartement vue mer",
    occupancy: "87%",
    rating: "4,9★",
    highlight: "Inspiration zellige, +25% vs marché local",
    image: "/properties/property-6.JPG",
  },
];

export default function PropertiesShowcase() {
  return (
    <section className="relative bg-cream py-28 text-ink">
      <div className="dot-grid-light pointer-events-none absolute inset-0 opacity-50" />
      <div className="container-x relative">
        <SectionHeader
          tag="Nos réalisations"
          title={
            <>
              Quelques logements{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">
                qu'on a opérés.
              </span>
            </>
          }
          subtitle="Studios, riads, appartements de standing — France et Maroc. Des taux d'occupation élevés et des notes Airbnb exigeantes."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-3xl border border-ink/10 bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image / placeholder */}
              <div className="relative h-56 overflow-hidden">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className={`h-full w-full bg-gradient-to-br ${p.bg}`}>
                    <div className="dot-grid absolute inset-0 opacity-30" />
                    <div className="relative flex h-full items-end p-6 text-white">
                      <p className="text-3xl font-extrabold tracking-tight drop-shadow">{p.name}</p>
                    </div>
                  </div>
                )}

                {/* Top-right rating chip */}
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow">
                  <Star size={12} className="fill-warning text-warning" /> {p.rating}
                </span>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-extrabold tracking-tight">{p.name}</h3>
                  <span className="rounded-full bg-brand-green/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-dark">
                    {p.type.split(" ")[0]}
                  </span>
                </div>

                <p className="mt-1 flex items-center gap-1 text-sm text-ink/65">
                  <MapPin size={12} /> {p.city} · {p.type}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{p.highlight}</p>

                <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4 text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-brand-dark">
                    <TrendingUp size={13} /> Taux d'occupation {p.occupancy}
                  </span>
                  <span className="text-ink/50">indicatif</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ink/50">
          * Les chiffres présentés sont indicatifs et basés sur des moyennes constatées sur nos
          opérations passées. Les performances varient selon la saison, la ville et la typologie.
        </p>
      </div>
    </section>
  );
}
