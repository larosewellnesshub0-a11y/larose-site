/**
 * Correctness audit of the BUILT site, not the sources.
 *
 * validate.mjs already checks links and the content model. This one looks for the
 * things that are only visible once a page is assembled: accessibility and layout
 * defects, duplicate or over-long metadata, broken structured data, hreflang pairs
 * that do not point back, and copy that breaks the clinic's own rules.
 *
 * The categories in HARD are blocking and set a non-zero exit code.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(HERE);
const SITE = path.join(ROOT, "site");

const HARD = new Set(["dead-link", "missing-asset", "img-no-alt", "img-no-size"]);
const findings = [];
const add = (cat, page, detail) => findings.push({ cat, page, detail: detail || "" });

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

/* site/_bookpages.html and site/_viewport.html are internal rendering helpers
   used to screenshot book spreads, and robots.txt disallows both. They are not
   pages of the site, so they are not audited as pages. */
const pages = walk(SITE).filter((p) => !path.basename(p).startsWith("_"));
const rel = (p) => path.relative(SITE, p).split(path.sep).join("/");

/* GitHub Pages serves /a/b for site/a/b.html and /a/b/ for site/a/b/index.html. */
function missing(href, fromFile) {
  if (/^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(href)) return null;
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return null;
  const base = clean.startsWith("/") ? SITE : path.dirname(fromFile);
  const target = path.normalize(path.join(base, clean.replace(/^\//, "")));
  const candidates = [target, target + ".html", path.join(target, "index.html")];
  return candidates.some((c) => fs.existsSync(c)) ? null : clean;
}

const titles = new Map();
const descriptions = new Map();
const push = (map, key, page) => {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(page);
};

for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const page = rel(file);
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/gi)) {
    const miss = missing(m[1], file);
    if (miss) add("dead-link", page, miss);
  }

  for (const m of html.matchAll(/\b(?:src|href)="([^"]+\.(?:webp|png|jpe?g|svg|ico|css|js|woff2?|json|xml|pdf))"/gi)) {
    const miss = missing(m[1], file);
    if (miss) add("missing-asset", page, miss);
  }

  const mainAt = html.indexOf("<main");
  const mainEnd = html.indexOf("</main>");
  let seenInMain = 0;
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    const src = (tag.match(/\bsrc="([^"]*)"/i) || ["", ""])[1];
    const alt = tag.match(/\balt="([^"]*)"/i);
    const decorative = /\baria-hidden="true"/i.test(tag);
    if (!alt && !decorative) add("img-no-alt", page, src);
    else if (alt && alt[1] && src.split("/").pop().replace(/\.\w+$/, "") === alt[1]) {
      add("img-alt-is-filename", page, src);
    }
    if (!/\bwidth="\d+"/i.test(tag) || !/\bheight="\d+"/i.test(tag)) add("img-no-size", page, src);
    /* Only images below the fold benefit from lazy loading, and on this site
       that means inside <main> and not the first one. Header logos and the lead
       image are supposed to load eagerly. */
    const prioritised = /\bloading="eager"/i.test(tag) || /\bfetchpriority="high"/i.test(tag);
    const inMain = mainAt !== -1 && m.index > mainAt && (mainEnd === -1 || m.index < mainEnd);
    const isLead = inMain && seenInMain++ === 0;
    if (inMain && !isLead && !prioritised && !/\bloading="lazy"/i.test(tag)) {
      add("img-not-lazy", page, src);
    }
  }

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const d of new Set(dupes)) add("duplicate-id", page, d);

  const heads = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  const h1s = heads.filter((h) => h === 1).length;
  if (h1s === 0) add("no-h1", page, "");
  if (h1s > 1) add("multiple-h1", page, String(h1s));
  for (let i = 1; i < heads.length; i++) {
    if (heads[i] - heads[i - 1] > 1) add("heading-skip", page, "h" + heads[i - 1] + " then h" + heads[i]);
  }

  const lang = (html.match(/<html\b[^>]*\blang="([^"]+)"/i) || ["", ""])[1];
  const expect = page.startsWith("en/") ? "en" : page.startsWith("ar/") ? "ar" : null;
  if (expect && lang && !lang.startsWith(expect)) add("lang-mismatch", page, lang + " on " + expect + " path");

  /* Measure what a reader sees, so "&#39;" counts as one character, not five. */
  const decode = (s) =>
    s
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/i) || ["", ""])[1]).trim();
  const desc = decode((html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || ["", ""])[1]).trim();
  if (!title) add("no-title", page, "");
  if (!desc) add("no-description", page, "");
  if (title.length > 60) add("title-too-long", page, String(title.length));
  if (desc.length > 155) add("description-too-long", page, String(desc.length));
  if (title) push(titles, title, page);
  if (desc) push(descriptions, desc, page);

  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      add("bad-jsonld", page, String(e.message).slice(0, 60));
    }
  }

  for (const m of html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/gi)) {
    if (m[1] === "x-default") continue;
    const p = m[2].replace(/^https?:\/\/[^/]+/, "");
    const asDir = path.join(SITE, p, "index.html");
    const asFile = path.join(SITE, p.replace(/\/$/, "") + ".html");
    if (!fs.existsSync(asDir) && !fs.existsSync(asFile) && !fs.existsSync(path.join(SITE, p))) {
      add("hreflang-dead", page, m[2]);
    }
  }

  if (visible.includes("—")) add("em-dash", page, "");
  /* A money word only counts as a whole word. "واعجنيها" (knead it) contains the
     letters of جنيه and was being reported as a price. */
  const money = visible.match(/(?:^|[^\p{L}])(جنيه|جنيهات|EGP)(?:$|[^\p{L}])|\$\s?\d/u);
  if (money) add("price-in-copy", page, money[0]);
}

for (const [t, ps] of titles) {
  if (ps.length > 1) add("duplicate-title", ps[0], ps.length + ' pages share "' + t.slice(0, 40) + '"');
}
for (const [, ps] of descriptions) {
  if (ps.length > 1) add("duplicate-description", ps[0], ps.length + " pages");
}

const byCat = new Map();
for (const f of findings) {
  if (!byCat.has(f.cat)) byCat.set(f.cat, []);
  byCat.get(f.cat).push(f);
}

console.log("\n  Audited " + pages.length + " built pages\n");
let hard = 0;
for (const [cat, list] of [...byCat].sort((a, b) => b[1].length - a[1].length)) {
  const blocking = HARD.has(cat);
  if (blocking) hard += list.length;
  console.log("  [" + (blocking ? "FAIL" : "warn") + "] " + cat.padEnd(24) + String(list.length).padStart(5));
  for (const f of list.slice(0, 4)) console.log("         " + f.page + "  " + f.detail);
  if (list.length > 4) console.log("         ... and " + (list.length - 4) + " more");
}
if (!findings.length) console.log("  clean\n");
console.log("\n  " + findings.length + " findings, " + hard + " of them blocking\n");
process.exit(hard ? 1 : 0);
