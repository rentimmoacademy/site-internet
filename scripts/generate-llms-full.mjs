// Génère public/llms-full.txt (contenu complet des articles pour les LLM). Lancé via "prebuild".
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://www.rentimmoacademy.fr";
const dir = join(process.cwd(), "content", "blog");

const posts = readdirSync(dir)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => {
    const raw = readFileSync(join(dir, f), "utf8");
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) return null;
    const meta = Object.fromEntries(
      m[1].split("\n").map((l) => {
        const i = l.indexOf(":");
        return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
      })
    );
    return { slug: f.replace(/\.mdx$/, ""), ...meta, body: m[2].trim() };
  })
  .filter(Boolean)
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

const head = `# Rentimmo Academy — contenu complet

> Académie de formation professionnelle à la location courte durée (LCD) en France et au Maroc : sous-location professionnelle, conciergerie Airbnb, ménage Airbnb (cleaning BnB). Index court : ${SITE}/llms.txt

Ce fichier regroupe le texte intégral des ${posts.length} articles du blog de Rentimmo Academy, du plus récent au plus ancien.

`;

const body = posts
  .map(
    (p) =>
      `---\n\n# ${p.title}\n\nURL : ${SITE}/blog/${p.slug}/\nPublié le : ${p.date}\nCatégorie : ${p.category}\n\n${p.body}\n`
  )
  .join("\n");

writeFileSync(join(process.cwd(), "public", "llms-full.txt"), head + body);
console.log(`llms-full.txt : ${posts.length} articles`);
