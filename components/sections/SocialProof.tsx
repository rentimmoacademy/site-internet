const items = [
  "Sous-Location",
  "Conciergerie Airbnb",
  "Cleaning BnB",
  "Sans crédit",
  "Sans apport",
  "🇲🇦 Disponible au Maroc",
  "Formation terrain",
  "+500K€ générés",
  "Experts LCD",
];

export default function SocialProof() {
  return (
    <section className="border-y border-ink/5 bg-cream py-10 text-ink">
      <div className="relative overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap">
          {[...items, ...items, ...items].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-6 text-lg font-extrabold tracking-tight text-ink/60"
            >
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
