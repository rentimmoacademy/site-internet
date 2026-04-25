import type { MetadataRoute } from "next";
import { formations } from "@/lib/formations";
import { getAllPosts } from "@/lib/mdx";

const BASE = "https://rentimmo-academy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const now = new Date();
  const staticRoutes = [
    "",
    "/formations",
    "/blog",
    "/a-propos",
    "/contact",
    "/mentions-legales",
    "/cgv",
    "/politique-confidentialite",
  ].map((r) => ({ url: `${BASE}${r}`, lastModified: now }));

  const formationRoutes = formations.map((f) => ({
    url: `${BASE}/formations/${f.slug}`,
    lastModified: now,
  }));

  const postRoutes = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  return [...staticRoutes, ...formationRoutes, ...postRoutes];
}
