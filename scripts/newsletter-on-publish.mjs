/**
 * Détecte les nouveaux articles de blog ajoutés dans le dernier commit poussé sur main,
 * et déclenche une newsletter Systeme.io pour chacun.
 * Appelé par .github/workflows/newsletter-on-publish.yml
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SIO = "https://api.systeme.io/api";
const SITE_URL = "https://www.rentimmoacademy.fr";
const key = process.env.SYSTEMEIO_API_KEY;

if (!key) {
  console.log("SYSTEMEIO_API_KEY absent — newsletter non envoyée.");
  process.exit(0);
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const block = match[1];
  const get = (field) => {
    const m = block.match(new RegExp(`^${field}:\\s*"([^"]*)"`, "m"));
    return m ? m[1] : null;
  };
  return { title: get("title"), excerpt: get("excerpt") };
}

function newArticles() {
  const diff = execSync("git diff --name-status HEAD~1 HEAD -- content/blog", {
    encoding: "utf-8",
  }).trim();
  if (!diff) return [];
  return diff
    .split("\n")
    .filter((line) => line.startsWith("A\t") && line.endsWith(".mdx"))
    .map((line) => line.split("\t")[1]);
}

async function sio(path, method, body) {
  const r = await fetch(SIO + path, {
    method,
    headers: {
      "X-API-Key": key,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
}

function buildHtml(title, excerpt, url) {
  return `
<table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <tr><td style="background:linear-gradient(135deg,#1A6B33,#5FD87A);padding:32px;text-align:center;border-radius:12px 12px 0 0;">
    <h1 style="color:#fff;font-size:20px;margin:0;">Rentimmo Academy</h1>
  </td></tr>
  <tr><td style="background:#F7F6F2;padding:32px;border-radius:0 0 12px 12px;">
    <h2 style="color:#1A1A1A;font-size:22px;margin:0 0 16px;">${title}</h2>
    <p style="color:#444;font-size:15px;line-height:1.6;margin:0 0 24px;">${excerpt || ""}</p>
    <a href="${url}" style="display:inline-block;background:#2DB84B;color:#fff;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:8px;">Lire l'article →</a>
  </td></tr>
</table>`.trim();
}

async function main() {
  const files = newArticles();
  if (files.length === 0) {
    console.log("Aucun nouvel article détecté.");
    return;
  }

  for (const file of files) {
    const raw = readFileSync(file, "utf-8");
    const meta = parseFrontmatter(raw);
    if (!meta?.title) {
      console.log(`Frontmatter illisible pour ${file}, skip.`);
      continue;
    }

    const slug = file.replace("content/blog/", "").replace(/\.mdx$/, "");
    const url = `${SITE_URL}/blog/${slug}/`;
    const subject = meta.title;
    const previewText = (meta.excerpt || "").slice(0, 140);

    const create = await sio("/mailing/newsletters", "POST", {
      content: {
        subject,
        previewText,
        editorType: "classic",
        bodyHtml: buildHtml(meta.title, meta.excerpt, url),
      },
    });

    if (!create.ok) {
      console.error(`Échec création newsletter pour ${file}:`, create.status, create.data);
      continue;
    }

    const send = await sio(`/mailing/newsletters/${create.data.id}/send`, "POST");
    if (!send.ok) {
      console.error(`Échec envoi newsletter pour ${file}:`, send.status, send.data);
      continue;
    }

    console.log(`Newsletter envoyée pour "${meta.title}" (id ${create.data.id})`);
  }
}

main();
