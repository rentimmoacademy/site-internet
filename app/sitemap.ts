import type { MetadataRoute } from "next";
import { formations } from "@/lib/formations";
import { getAllPosts } from "@/lib/mdx";

const BASE = "https://www.rentimmoacademy.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const now = new Date();
  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/formations", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/sous-location-professionnelle", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/devenir-conciergerie-airbnb", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/menage-airbnb-professionnel", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/se-former-airbnb-maroc", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/masterclass", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/super-bnb-academy", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/outils/audit-annonce", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/super-bnb-academy/audit", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/lexique", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/temoignages", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/a-propos", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/contact", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/cgv", priority: 0.2, changeFrequency: "yearly" as const },
    { path: "/politique-confidentialite", priority: 0.2, changeFrequency: "yearly" as const },
  ].map((r) => ({ url: `${BASE}${r.path}/`, lastModified: now, changeFrequency: r.changeFrequency, priority: r.priority }));

  const formationRoutes = formations.map((f) => ({
    url: `${BASE}/formations/${f.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}/`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...formationRoutes, ...postRoutes];
}
