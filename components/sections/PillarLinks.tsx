import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";

const OFFERS = [
  { href: "/sous-location-professionnelle", label: "Sous-location professionnelle", key: "sous-location" },
  { href: "/devenir-conciergerie-airbnb", label: "Conciergerie Airbnb", key: "conciergerie" },
  { href: "/menage-airbnb-professionnel", label: "Ménage Airbnb (Cleaning BNB)", key: "cleaning" },
  { href: "/super-bnb-academy", label: "Super BNB Academy : scaler et optimiser", key: "scale" },
];

export default async function PillarLinks({
  offer,
  categories,
  title,
}: {
  offer: string;
  categories: string[];
  title: string;
}) {
  const posts = (await getAllPosts())
    .filter((p) => categories.includes(p.category))
    .slice(0, 10);

  return (
    <section className="bg-cream py-16 text-ink">
      <div className="container-x">
        {posts.length > 0 && (
          <>
            <h2 className="text-2xl font-extrabold md:text-3xl">{title}</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}/`}
                    className="flex items-start gap-2 text-sm font-semibold text-brand-dark underline-offset-4 hover:underline"
                  >
                    <ArrowRight size={14} className="mt-0.5 shrink-0" />
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2 className="mt-12 text-2xl font-extrabold md:text-3xl">Les formations de Rentimmo Academy</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {OFFERS.filter((o) => o.key !== offer).map((o) => (
            <li key={o.href}>
              <Link
                href={o.href}
                className="inline-flex rounded-full border border-brand-dark/20 bg-white px-5 py-2.5 text-sm font-bold text-brand-dark transition-colors hover:border-brand-green"
              >
                {o.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/formations"
              className="inline-flex rounded-full bg-brand-green px-5 py-2.5 text-sm font-bold text-ink"
            >
              Voir toutes les formations
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
