// Bandeau des plateformes et outils utilisés au quotidien (pas des partenaires : on ne dit pas « ils nous font confiance »).
const logos = [
  { src: "/logos/airbnb.svg", alt: "Airbnb", h: "h-7" },
  { src: "/logos/booking.svg", alt: "Booking.com", h: "h-6" },
  { src: "/logos/leboncoin.svg", alt: "Leboncoin", h: "h-8" },
  { src: "/logos/airdna.svg", alt: "AirDNA", h: "h-5" },
  { src: "/logos/pricelabs.svg", alt: "PriceLabs", h: "h-8" },
  { src: "/logos/airroi.svg", alt: "AirROI", h: "h-6" },
];

export default function SocialProof() {
  return (
    <section className="relative border-b-4 border-brand-green bg-ink py-8 text-white">
      <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-white/50">
        Les plateformes et outils qu&apos;on utilise au quotidien
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="animate-marquee flex w-max items-center gap-20 pr-20">
          {[...logos, ...logos, ...logos, ...logos].map((l, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={l.src}
              alt={i < logos.length ? l.alt : ""}
              aria-hidden={i >= logos.length || undefined}
              loading="lazy"
              className={`${l.h} w-auto opacity-70 brightness-0 invert transition-opacity duration-300 hover:opacity-100`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
