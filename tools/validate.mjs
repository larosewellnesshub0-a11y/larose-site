#!/usr/bin/env node
/* ==========================================================================
   Static validator for the generated site.
   Checks the things that actually break a clinic website: dead internal
   links, missing assets, heading structure, unlabelled controls, missing
   alt text, duplicated ids, and leaked placeholder markers.

   Run:  node tools/validate.mjs
   ========================================================================== */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "site");
const CONTENT = JSON.parse(fs.readFileSync(path.join(ROOT, "content", "site.json"), "utf8"));
const BASE = `https://${CONTENT.brand.domain}`;

const issues = [];
const add = (file, level, msg) => issues.push({ file, level, msg });

function decodeHtml(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return String(value || "").replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
    if (entity[0] !== "#") return named[entity.toLowerCase()] || match;
    const hex = entity[1].toLowerCase() === "x";
    return String.fromCodePoint(Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10));
  });
}

function publicUrl(rel) {
  return rel === "index.html" ? `${BASE}/` : `${BASE}/${rel.replace(/index\.html$/, "")}`;
}

function alternateUrl(rel, locale) {
  const match = /^(?:ar|en)\/(.*)$/.exec(rel);
  const withinLocale = match ? match[1] : "index.html";
  return `${BASE}/${locale}/${withinLocale.replace(/index\.html$/, "")}`;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html") && !e.name.startsWith("_")) out.push(p);  // "_" prefix = dev-only, not part of the deliverable
  }
  return out;
}

const files = walk(SITE);
const rels = new Set(files.map((f) => path.relative(SITE, f).replace(/\\/g, "/")));
const h1Index = new Map();

for (const file of files) {
  const rel = path.relative(SITE, file).replace(/\\/g, "/");
  const html = fs.readFileSync(file, "utf8");
  const dir = path.dirname(file);

  /* ---- 1. internal links resolve --------------------------------------- */
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(raw)) continue;
    const clean = raw.split("#")[0].split("?")[0];
    if (!clean) continue;
    /* A leading "/" means the site root, not the filesystem root. Without
       this, path.resolve() sends it to the drive root on Windows and every
       root-absolute internal link reads as dead. */
    let target = clean.startsWith("/")
      ? path.join(SITE, clean.slice(1))
      : path.resolve(dir, clean);
    if (!fs.existsSync(target)) {
      if (fs.existsSync(path.join(target, "index.html"))) continue;
      add(rel, "ERROR", `dead link → ${raw}`);
    }
  }

  /* ---- 2. exactly one <h1> --------------------------------------------- */
  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  if (h1s === 0) add(rel, "ERROR", "no <h1>");
  if (h1s > 1) add(rel, "ERROR", `${h1s} <h1> elements (must be 1)`);
  const h1Text = decodeHtml(/<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1]?.replace(/<[^>]*>/g, "") || "")
    .replace(/\s+/g, " ").trim();
  if (h1Text) {
    const key = `${rel.split("/")[0]}|${h1Text}`;
    if (!h1Index.has(key)) h1Index.set(key, []);
    h1Index.get(key).push(rel);
  }

  /* ---- 3. images have alt ---------------------------------------------- */
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=/.test(m[0])) add(rel, "ERROR", `<img> without alt: ${m[0].slice(0, 90)}`);
  }

  /* ---- 4. iframes have title ------------------------------------------- */
  for (const m of html.matchAll(/<iframe\b[^>]*>/g)) {
    if (!/\stitle=/.test(m[0])) add(rel, "WARN", "<iframe> without title");
  }

  /* ---- 5. form controls are labelled ----------------------------------- */
  const labelFor = new Set([...html.matchAll(/<label[^>]*\sfor="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/<(input|select|textarea)\b[^>]*>/g)) {
    const tag = m[0];
    if (/type="(hidden|submit|button)"/.test(tag)) continue;
    const id = /\sid="([^"]+)"/.exec(tag)?.[1];
    const labelled = (id && labelFor.has(id)) || /aria-label=/.test(tag) || /aria-labelledby=/.test(tag);
    if (!labelled) add(rel, "ERROR", `unlabelled control: ${tag.slice(0, 90)}`);
  }

  /* ---- 6. duplicate ids ------------------------------------------------ */
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  const dupes = ids.filter((v, i) => ids.indexOf(v) !== i);
  for (const d of new Set(dupes)) add(rel, "ERROR", `duplicate id "${d}"`);

  /* ---- 7. no unrendered template artefacts ----------------------------- */
  if (/\$\{/.test(html)) add(rel, "ERROR", "unrendered ${...} template literal");
  if (/\[object Object\]/.test(html)) add(rel, "ERROR", "[object Object] leaked into output");
  if (/undefined<|>undefined|"undefined"/.test(html)) add(rel, "WARN", "literal 'undefined' in output");
  if (/\bNaN\b/.test(html)) add(rel, "WARN", "NaN in output");

  /* ---- 8. no prices on the public site --------------------------------- */
  //  The client's decision: prices are never shown. Catch stray numerals
  //  followed by the Egyptian pound in either script.
  for (const m of html.matchAll(/[\d٠-٩][\d,٠-٩\s]{1,8}(ج\.?م|جنيه|\bEGP\b|\bLE\b)/g)) {
    add(rel, "ERROR", `price leaked into public page: "${m[0].trim()}"`);
  }

  /* ---- 9. lang / dir --------------------------------------------------- */
  const locale = rel.split("/")[0];
  /* Read the attributes off the <html> tag rather than matching the whole tag
     literally. The old regex required `>` straight after dir, so adding any
     further attribute to <html> failed all 212 pages while the lang and dir
     were in fact perfectly correct. */
  // Keep the leading space in the capture: `<html\s(...)` would consume it and
  // then the first attribute has nothing to anchor against.
  const htmlTag = /<html([^>]*)>/i.exec(html)?.[1] || "";
  // NB `\b` inside a template literal is the BACKSPACE character, not a regex
  // word boundary, which is how an earlier version of this silently matched
  // nothing and failed all 213 pages.
  const attr = (name) => new RegExp("\\s" + name + '="([^"]*)"').exec(htmlTag)?.[1];
  // The root redirect at /index.html belongs to no locale, so there is nothing
  // to assert about it.
  if (locale === "ar" || locale === "en") {
    const wantDir = locale === "ar" ? "rtl" : "ltr";
    if (attr("lang") !== locale || attr("dir") !== wantDir) {
      add(rel, "ERROR", `missing lang=${locale} dir=${wantDir}`);
    }
  }

  /* ---- 10. canonical and language alternates ---------------------------- */
  /* Standalone pages: one bilingual document published at its own URL, with no
     /ar and /en twin and a canonical that deliberately points elsewhere. */
  const STANDALONE = new Set(["RecipeGuide/index.html"]);
  const isStandalone = STANDALONE.has(rel.split(String.fromCharCode(92)).join("/"));

  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  if (!canonical) add(rel, "ERROR", "no canonical link");
  else if (!isStandalone && decodeHtml(canonical) !== publicUrl(rel)) {
    add(rel, "ERROR", `canonical does not match own path: ${decodeHtml(canonical)}`);
  }
  for (const language of isStandalone ? [] : ["ar", "en"]) {
    const alternate = new RegExp(`<link rel="alternate" hreflang="${language}" href="([^"]+)"`).exec(html)?.[1];
    if (!alternate) add(rel, "ERROR", `missing hreflang ${language}`);
    else if (decodeHtml(alternate) !== alternateUrl(rel, language)) {
      add(rel, "ERROR", `hreflang ${language} does not match counterpart: ${decodeHtml(alternate)}`);
    }
  }

  /* ---- 11. meta description present and sane --------------------------- */
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] || "";
  if (!desc) add(rel, "ERROR", "no meta description");
  else if (decodeHtml(desc).length > 200) add(rel, "ERROR", `meta description ${decodeHtml(desc).length} chars (>200)`);

  /* ---- 12. title present ------------------------------------------------ */
  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] || "";
  if (!title.trim()) add(rel, "ERROR", "empty <title>");

  /* ---- 13. JSON-LD parses ---------------------------------------------- */
  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!jsonLdBlocks.length) add(rel, "ERROR", "no JSON-LD graph");
  if (jsonLdBlocks.length > 1) add(rel, "ERROR", `${jsonLdBlocks.length} JSON-LD blocks (must be 1)`);
  for (const m of jsonLdBlocks) {
    try {
      const parsed = JSON.parse(m[1].replace(/\\u003c/g, "<").replace(/\\u003e/g, ">").replace(/\\u0026/g, "&"));
      if (!Array.isArray(parsed["@graph"])) add(rel, "ERROR", "JSON-LD is not a single @graph");
    } catch (e) {
      add(rel, "ERROR", `invalid JSON-LD: ${e.message.slice(0, 70)}`);
    }
  }

  /* ---- 14. both locales exist ------------------------------------------ */
  if (locale === "ar" || locale === "en") {
    const other = locale === "ar" ? rel.replace(/^ar\//, "en/") : rel.replace(/^en\//, "ar/");
    if (!rels.has(other)) add(rel, "ERROR", `no counterpart at ${other}`);
  }
}

/* ---- 15. H1 text is unique within each language -------------------------- */
for (const [key, matching] of h1Index) {
  if (matching.length < 2) continue;
  const heading = key.slice(key.indexOf("|") + 1);
  for (const rel of matching) add(rel, "ERROR", `duplicate <h1> text: "${heading}"`);
}

/* ---- 16. every sitemap URL resolves to a generated file ------------------ */
const sitemapPath = path.join(SITE, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  add("sitemap.xml", "ERROR", "missing sitemap.xml");
} else {
  const xml = fs.readFileSync(sitemapPath, "utf8");
  const references = new Set([
    ...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]),
    ...[...xml.matchAll(/<xhtml:link\b[^>]*href="([^"]+)"/g)].map((match) => match[1]),
  ].map(decodeHtml));
  for (const reference of references) {
    let url;
    try {
      url = new URL(reference);
    } catch {
      add("sitemap.xml", "ERROR", `invalid sitemap URL: ${reference}`);
      continue;
    }
    if (url.origin !== BASE) {
      add("sitemap.xml", "ERROR", `sitemap URL is outside canonical domain: ${reference}`);
      continue;
    }
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    if (!relative || relative.endsWith("/")) relative += "index.html";
    if (!fs.existsSync(path.join(SITE, relative))) {
      add("sitemap.xml", "ERROR", `sitemap path does not exist: ${url.pathname}`);
    }
  }
}

/* ---- report -------------------------------------------------------------- */
const errors = issues.filter((i) => i.level === "ERROR");
const warns = issues.filter((i) => i.level === "WARN");

const byFile = {};
for (const i of issues) (byFile[i.file] ||= []).push(i);

console.log(`\n  Validated ${files.length} pages\n`);

// Collapse issues that repeat across many pages — usually one shell bug.
const byMsg = {};
for (const i of issues) {
  const key = i.level + "|" + i.msg.replace(/"[^"]*"/g, '"…"').replace(/→ .*/, "→ …");
  (byMsg[key] ||= []).push(i);
}
const grouped = Object.entries(byMsg).sort((a, b) => b[1].length - a[1].length);

for (const [key, list] of grouped) {
  const [level] = key.split("|");
  const sample = list[0];
  if (list.length > 3) {
    console.log(`  ${level.padEnd(5)} ×${String(list.length).padEnd(4)} ${sample.msg}`);
    console.log(`        e.g. ${sample.file}`);
  } else {
    for (const i of list) console.log(`  ${i.level.padEnd(5)} ${i.file}\n        ${i.msg}`);
  }
}

console.log(`\n  ${errors.length} errors, ${warns.length} warnings\n`);
process.exit(errors.length ? 1 : 0);
