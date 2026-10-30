import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/testimonials";
import Highlight from "@/components/ui/Highlight";

// Deux rangées d'avis publics qui défilent en sens inverse (inspiré des « lanes » d'avis de maxencetison.fr).
// Aucun compteur d'avis affiché : seulement les avis eux-mêmes, avec leur source.
const SOURCE_LABEL = { trustpilot: "Avis Trustpilot", youtube: "Témoignage YouTube", "google-review": "Avis Google", "interview-prive": "Témoignage" } as const;

const reviews = TESTIMONIALS.filter((t) => t.quote.length > 60).map((t) => ({
  id: t.id,
  name: t.firstName,
  text: t.quote.length > 190 ? `${t.quote.slice(0, 187).replace(/\s+\S*$/, "")}…` : t.quote,
  source: SOURCE_LABEL[t.source.type],
}));

function Lane({ items, reverse = false }: { items: typeof reviews; reverse?: boolean }) {
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className="flex w-max gap-5 pr-5 animate-marquee hover:[animation-play-state:paused]"
        style={{ animationDuration: "70s", animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[...items, ...items].map((r, i) => (
          <figure
            key={`${r.id}-${i}`}
            aria-hidden={i >= items.length || undefined}
            className={`w-[340px] flex-shrink-0 rounded-3xl p-6 ${
              i % 3 === 1 ? "bg-ink text-white shadow-[0_6px_0_#1A6B33]" : "border border-ink/10 bg-white text-ink shadow-[0_6px_0_rgba(26,26,26,0.06)]"
            }`}
          >
            <div className="flex gap-0.5 text-brand-green">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} size={14} className="fill-current" />
              ))}
            </div>
            <blockquote className={`mt-3 text-sm leading-relaxed ${i % 3 === 1 ? "text-white/80" : "text-ink/75"}`}>
              « {r.text} »
            </blockquote>
            <figcaption className="mt-4 flex items-center justify-between text-xs">
              <span className="font-bold">{r.name}</span>
              <span className={i % 3 === 1 ? "text-white/50" : "text-ink/45"}>{r.source}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function TestimonialLanes() {
  if (reviews.length < 4) return null;
  const half = Math.ceil(reviews.length / 2);
  return (
    <section className="py-24">
      <div className="container-x">
        <p className="tag mb-5 text-brand-dark">Ils sont passés par là</p>
        <h2 className="text-h2 font-extrabold leading-[1.05] tracking-[-0.02em] text-ink">
          Ce qu&apos;en disent <Highlight>nos élèves.</Highlight>
        </h2>
      </div>
      <div className="mt-12 space-y-5">
        <Lane items={reviews.slice(0, half)} />
        <Lane items={reviews.slice(half)} reverse />
      </div>
    </section>
  );
}
