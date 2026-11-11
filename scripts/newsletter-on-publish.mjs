/**
 * Détecte les nouveaux articles de blog ajoutés dans le dernier commit poussé sur main
 * et envoie une newsletter Systeme.io pour chacun, au gabarit validé le 10/11/2026
 * (emails-systeme-io/_TEMPLATE-newsletter.html).
 *
 * Destinataires : tous les tags sauf DESINSCRITS (règle de Marwan : « les destinataires c'est tous »).
 * Garde-fou : si le titre ou l'extrait contient un montant ou une promesse de revenus,
 * la newsletter est créée en brouillon seulement (à relire et envoyer à la main).
 * Appelé par .github/workflows/newsletter-on-publish.yml
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const SIO = "https://api.systeme.io/api";
const SITE_URL = "https://www.rentimmoacademy.fr";
const SENDER_EMAIL = "contact@rentimmoacademy.fr";
const SENDER_NAME = "Marwan | Rentimmo Academy";
const TAG_DESINSCRITS = 1022741;
const CAL_URL = "https://cal.com/rentimmoacademy/appel-strategique";
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
  return {
    title: get("title"),
    excerpt: get("excerpt"),
    category: get("category"),
    coverImage: get("coverImage"),
  };
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

async function allTagIds() {
  const ids = [];
  let after = null;
  for (let i = 0; i < 50; i++) {
    const q = `/tags?limit=100&order=asc${after ? `&startingAfter=${after}` : ""}`;
    const r = await sio(q, "GET");
    if (!r.ok) throw new Error(`Lecture des tags impossible : ${r.status}`);
    const items = r.data.items || [];
    ids.push(...items.map((t) => t.id));
    if (!r.data.hasMore || items.length === 0) break;
    after = items[items.length - 1].id;
  }
  return ids;
}

const esc = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Montant en euros, « K€ », SMIC, « par mois » chiffré, « revenus passifs/garantis » : pas d'envoi auto.
const RISKY = /\d\s?(k|K)?\s?€|€\s?\d|SMIC|\d[\d\s]*\s?(€|euros?)\s?(\/|par)\s?mois|revenus?\s+(passifs?|garantis?)|devenir riche/i;

// Ligne « ➡️ » selon la thématique de l'article.
function offerLine(category) {
  if (category === "cleaning" || category === "cleaning-bnb") {
    return `➡️ Si tu veux lancer ton activité de <b>ménage Airbnb</b>, je t'explique tout dans une vidéo. <a href="${SITE_URL}/cleaning/" style="color:#10602A;font-weight:bold;">Clique ici pour la découvrir</a>`;
  }
  if (category === "scale") {
    return `➡️ Si tu as déjà des logements et que tu veux <b>savoir où tu perds des réservations</b>, demande l'audit de ton annonce. <a href="${SITE_URL}/super-bnb-academy/audit/" style="color:#10602A;font-weight:bold;">Clique ici pour le demander</a>`;
  }
  return `➡️ Si tu veux démarrer en <b>sous-location professionnelle ou en conciergerie</b>, j'ai préparé une masterclass qui t'explique comment faire, étape par étape. <a href="${SITE_URL}/masterclass/" style="color:#10602A;font-weight:bold;">Clique ici pour la découvrir</a>`;
}

function buildHtml({ title, excerpt, category, coverImage }, url) {
  const cover = coverImage
    ? `<tr><td style="padding:32px 40px 0;"><a href="${url}" style="display:block;text-decoration:none;"><img src="${SITE_URL}${coverImage}" alt="${esc(title)}" width="520" style="display:block;width:100%;height:auto;border:0;border-radius:6px;"></a></td></tr>`
    : "";
  return `<div style="display:none;max-height:0;overflow:hidden;">${esc((excerpt || "").slice(0, 140))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F4F2;">
<tr><td align="center" style="padding:32px 12px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1A1A1A;">
<tr><td align="center" style="padding:36px 40px 8px;"><a href="${SITE_URL}/" style="text-decoration:none;"><img src="https://rentimmo-email.pages.dev/logo-rentimmo-academy.png" alt="Rentimmo Academy" width="260" height="29" style="display:block;width:260px;max-width:100%;height:auto;border:0;"></a></td></tr>
<tr><td align="center" style="padding:28px 40px 0;font-size:28px;line-height:1.35;font-weight:bold;">${esc(title)}</td></tr>
${cover}
<tr><td style="padding:36px 40px 0;font-size:16px;line-height:1.75;">
<p style="margin:0 0 20px;">Salam {first_name},</p>
<p style="margin:0 0 20px;"><u><b>Dans l'article d'aujourd'hui</b></u> : ${esc(excerpt)}</p>
<p style="margin:0 0 32px;">Tout est expliqué étape par étape, avec ce que j'applique moi-même sur le terrain.</p>
</td></tr>
<tr><td style="padding:0 40px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="background-color:#2DB84B;border-radius:8px;">
<a href="${url}" style="display:block;padding:18px 20px;font-size:19px;font-weight:bold;color:#ffffff;text-decoration:none;">Lire l'article</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:0 40px;font-size:16px;line-height:1.75;">
<p style="margin:0 0 28px;">${offerLine(category)}</p>
<p style="margin:0 0 36px;">➡️ Si tu veux qu'on regarde <b>ta situation ensemble</b>, réserve un appel avec mon équipe. <a href="${CAL_URL}" style="color:#10602A;font-weight:bold;">Clique ici pour réserver ton appel</a>.</p>
<p style="margin:0 0 24px;">Voilà, c'est tout pour aujourd'hui.</p>
<p style="margin:0 0 12px;"><b>À très bientôt,</b></p>
<p style="margin:0 0 48px;"><b>Marwan.</b></p>
</td></tr>
</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;font-family:Arial,Helvetica,sans-serif;">
<tr><td align="center" style="padding:48px 40px 24px;font-size:13px;line-height:1.6;color:#333333;">
<b style="font-size:15px;">Rentimmo Academy</b><br>9 rue Clément Marillier, 21000 Dijon, France
</td></tr>
</table>
</td></tr></table>`;
}

async function main() {
  const files = newArticles();
  if (files.length === 0) {
    console.log("Aucun nouvel article détecté.");
    return;
  }

  // Plusieurs articles dans le même commit : une seule newsletter (le premier), pour ne pas inonder la base.
  if (files.length > 1) {
    console.log(`${files.length} nouveaux articles dans ce commit : newsletter pour le premier seulement (${files[0]}).`);
  }
  const file = files[0];
  const meta = parseFrontmatter(readFileSync(file, "utf-8"));
  if (!meta?.title) {
    console.log(`Frontmatter illisible pour ${file}, rien envoyé.`);
    return;
  }

  const slug = file.replace("content/blog/", "").replace(/\.mdx$/, "");
  const url = `${SITE_URL}/blog/${slug}/`;

  const create = await sio("/mailing/newsletters", "POST", {
    content: {
      subject: meta.title,
      previewText: (meta.excerpt || "").slice(0, 140),
      editorType: "classic",
      bodyHtml: buildHtml(meta, url),
      senderEmail: SENDER_EMAIL,
      senderName: SENDER_NAME,
    },
  });
  if (!create.ok) {
    console.error(`Échec création newsletter pour ${file}:`, create.status, create.data);
    process.exit(1);
  }
  const id = create.data.id;

  const tagIds = (await allTagIds()).filter((t) => t !== TAG_DESINSCRITS);
  const inc = await sio(`/mailing/newsletters/${id}/included-tags`, "PUT", { tagIds });
  const exc = await sio(`/mailing/newsletters/${id}/excluded-tags`, "PUT", { tagIds: [TAG_DESINSCRITS] });
  if (!inc.ok || !exc.ok) {
    console.error(`Newsletter ${id} créée mais tags non réglés :`, inc.status, exc.status, inc.data, exc.data);
    process.exit(1);
  }

  if (RISKY.test(`${meta.title} ${meta.excerpt || ""}`)) {
    console.log(`Newsletter ${id} créée en BROUILLON (montant ou promesse de revenus dans le titre/l'extrait) : à relire et envoyer à la main dans Systeme.io.`);
    return;
  }

  const send = await sio(`/mailing/newsletters/${id}/send`, "POST");
  if (!send.ok) {
    console.error(`Échec envoi newsletter ${id}:`, send.status, send.data);
    process.exit(1);
  }
  console.log(`Newsletter envoyée pour "${meta.title}" (id ${id}, ${tagIds.length} tags inclus, DESINSCRITS exclu).`);
}

main();
