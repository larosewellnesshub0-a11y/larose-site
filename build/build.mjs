#!/usr/bin/env node
/* ==========================================================================
   LA ROSE WELLNESS HUB — static site generator
   --------------------------------------------------------------------------
   Reads content/*.json, writes site/**.html.
   Run:  node build/build.mjs
   ========================================================================== */

import fs from "node:fs";
import path from "node:path";
import { loadContent, LOCALES, OUT_DIR, ROOT, t, esc, published, specialtyImage } from "./lib/util.mjs";
import { jsonLd, trackingHead } from "./lib/shell.mjs";

import { renderHome } from "./pages/home.mjs";

const PAGE_MODULES = [
  // Each module exports `pages(ctx)` returning [{ path, html }].
  // Added as they are built; the home page is wired directly below.
  "./pages/specialties.mjs",
  "./pages/doctors.mjs",
  "./pages/branches.mjs",
  "./pages/articles.mjs",
  "./pages/digital.mjs",
  "./pages/about.mjs",
  "./pages/patients.mjs",
  "./pages/legal.mjs",
  "./pages/tools.mjs",
  "./pages/home-visits.mjs",
  "./pages/recipe-guide.mjs",
  "./pages/misc.mjs",
];

const written = [];

function out(p, html) {
  const full = path.join(OUT_DIR, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
  written.push(p);
}

/* --------------------------------------------------------------------------
   Root language gate — site/index.html
   A no-JS-dependent redirect that still shows a usable choice if the meta
   refresh is blocked.
   -------------------------------------------------------------------------- */
function rootIndex(c) {
  const s = c.site;
  const base = `https://${s.brand.domain}`;
  const title = `${t(s.brand.name, "ar")} | ${t(s.brand.name, "en")}`;
  /* The tagline is brand copy, four words long, and it was doing duty as this
     page's meta description. A language gate still gets one shot in a result
     listing, so it says what the clinic actually offers. Built from the live
     specialty list, so it cannot drift out of date the way a literal would. */
  // Six is what fits inside a description; the rest are one click away.
  const description = "عيادات لاروز التخصصية في المعادي الجديدة بتجمع التغذية العلاجية والباطنة والأطفال وتخصصات تانية في مكان واحد. اختار لغتك واعرف الخدمات والأطباء والحجز.";
  const socialImage = `${base}/assets/img/clinic/hero-clinic-1200.webp`;
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${base}/">
<link rel="alternate" hreflang="ar" href="${base}/ar/">
<link rel="alternate" hreflang="en" href="${base}/en/">
<link rel="alternate" hreflang="x-default" href="${base}/ar/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(t(s.brand.name, "ar"))}">
<meta property="og:locale" content="ar_EG">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${base}/">
<meta property="og:image" content="${socialImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="675">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${socialImage}">
<meta http-equiv="refresh" content="0; url=ar/">
<script>location.replace("ar/" + location.search + location.hash);</script>
${trackingHead(c)}
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/components.css">
<style>
  body { min-height:100vh; display:grid; place-items:center; background:var(--olive-900); }
  .gate { text-align:center; padding:2rem; }
  .gate img { height:5.5rem; width:auto; margin-inline:auto; opacity:.94; }
  .gate__actions { display:flex; gap:1rem; justify-content:center; margin-top:2.5rem; flex-wrap:wrap; }
  .gate p { color:rgba(246,244,236,.6); font-size:var(--t-xs); margin-top:2rem; }
</style>
${jsonLd({ c, locale: "ar", pagePath: "index.html", canonicalUrl: `${base}/` })}
</head>
<body>
  <div class="gate">
    <h1 class="visually-hidden">${esc(title)}</h1>
    <img src="assets/img/logo/larose-wordmark-white.png" alt="${esc(t(s.brand.name, "en"))}" width="984" height="849">
    <!-- Arabic is the default; this body only shows if both the script and the
         meta refresh are blocked, so it offers one link rather than a choice. -->
    <p><a class="btn btn--on-dark btn--lg" href="ar/" lang="ar" dir="rtl">ادخل للموقع</a></p>
    <p>${esc(t(s.brand.kind, "ar"))} · <a href="en/" lang="en" dir="ltr" style="color:inherit">English</a></p>
  </div>
  <script src="assets/js/track.js" defer></script>
</body>
</html>`;
}

function root404(c) {
  const s = c.site;
  const url = `https://${s.brand.domain}/404.html`;
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>الصفحة مش موجودة | Page not found</title><meta name="description" content="الصفحة دي مش موجودة. This page could not be found."><link rel="canonical" href="${url}"><link rel="alternate" hreflang="ar" href="${url}"><link rel="alternate" hreflang="en" href="${url}"><link rel="stylesheet" href="/assets/css/tokens.css"><link rel="stylesheet" href="/assets/css/base.css"><link rel="stylesheet" href="/assets/css/components.css">${trackingHead(c)}${jsonLd({ c, locale:"ar", pagePath:"404.html", canonicalUrl:url, currentName:"الصفحة مش موجودة" })}</head><body><main class="section"><div class="wrap wrap--narrow" style="text-align:center"><img src="/assets/img/logo/larose-wordmark.png" alt="${esc(t(s.brand.name,"ar"))}" width="160" height="138"><h1 class="h1" style="margin-top:2rem">الصفحة مش موجودة</h1><p class="lede">Page not found</p><p style="margin-top:2rem"><a class="btn btn--primary" href="/ar/">ارجع للرئيسية</a> <a class="btn btn--ghost" href="/en/">English home</a></p></div></main><script src="/assets/js/track.js" defer></script></body></html>`;
}

/* --------------------------------------------------------------------------
   robots.txt + sitemap.xml + llms.txt
   -------------------------------------------------------------------------- */
function sitemap(c, paths) {
  const base = `https://${c.site.brand.domain}`;
  const dateParts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Cairo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date()).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  const today = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  const xml = (value) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  // Same stripping as link() and absolutePageUrl(): the sitemap must list the
  // URL the site actually links to, not a second form of the same page.
  const publicUrl = (p) => p === "index.html"
    ? `${base}/`
    : `${base}/${p.replace(/index\.html$/, "").replace(/\.html$/, "")}`;
  const lastmod = (p) => {
    const match = /^(?:ar|en)\/articles\/([^/]+)\.html$/.exec(p);
    if (!match) return today;
    const entry = (c.articles.articles || []).find((item) => t(item.slug, "en") === match[1]);
    const date = t(entry?.updatedAt, "en") || t(entry?.dateModified, "en") || t(entry?.date, "en");
    return /^\d{4}-\d{2}-\d{2}/.test(date) ? date.slice(0, 10) : today;
  };
  const sitemapImage = (p) => {
    const articleMatch = /^(?:ar|en)\/articles\/([^/]+)\.html$/.exec(p);
    if (articleMatch) {
      const entry = (c.articles.articles || []).find((item) => t(item.slug, "en") === articleMatch[1]);
      return t(entry?.image, "en") || null;
    }
    const specialtyMatch = /^(?:ar|en)\/specialties\/([^/]+)\.html$/.exec(p);
    if (specialtyMatch) {
      const specialty = (c.specialties || []).find((item) => item.slug === specialtyMatch[1]);
      return specialty ? (specialty.image || specialtyImage(specialty.slug)) : null;
    }
    return null;
  };
  const urls = paths
    .filter((p) => p.endsWith(".html") && !p.includes("/404"))
    .map((p) => {
      const localeMatch = /^(ar|en)\/(.*)$/.exec(p);
      const withinLocale = localeMatch ? localeMatch[2] : "index.html";
      const bilingual = p.startsWith("RecipeGuide/");
      // The alternates have to be stripped exactly like <loc>, or the sitemap
      // would point hreflang at a second URL for a page it just listed once.
      const withinClean = withinLocale.replace(/index\.html$/, "").replace(/\.html$/, "");
      const arLoc = bilingual ? publicUrl(p) : `${base}/ar/${withinClean}`;
      const enLoc = bilingual ? publicUrl(p) : `${base}/en/${withinClean}`;
      const priority = p === "index.html" || (p.endsWith("index.html") && p.split("/").length === 2) ? "1.0" : "0.7";
      const image = sitemapImage(p);
      return `  <url>
    <loc>${xml(publicUrl(p))}</loc>
    <lastmod>${lastmod(p)}</lastmod>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${xml(arLoc)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${xml(enLoc)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${xml(arLoc)}"/>
${image ? `    <image:image><image:loc>${xml(/^https?:/i.test(image) ? image : `${base}/${image.replace(/^\/+/, "")}`)}</image:loc></image:image>\n` : ""}  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;
}

function llms(c) {
  const s = c.site;
  const locale = "en";
  const base = `https://${s.brand.domain}`;
  const oneLine = (value) => String(value || "").replace(/—/g, ":").replace(/\s+/g, " ").trim();
  const short = (value, limit = 180) => {
    const text = oneLine(value);
    if (text.length <= limit) return text;
    const cut = text.lastIndexOf(" ", limit - 1);
    return `${text.slice(0, cut > 0 ? cut : limit - 1)}…`;
  };
  const pageUrl = (href) => `${base}/${locale}/${String(href).replace(/^\/+/, "").replace(/index\.html$/, "")}`;
  const line = (label, href, description) => `- [${oneLine(label)}](${pageUrl(href)}): ${short(description)}`;
  const nav = (key) => s.nav.find((item) => item.key === key);
  const knowledge = nav("articles");
  const patients = nav("patients");

  const sections = [
    "# " + oneLine(t(s.brand.name, locale)),
    "",
    "> " + oneLine(t(s.footer.blurb, locale) || t(s.brand.tagline, locale)),
    "",
    "## Specialties",
    "",
    ...published(c.specialties).map((sp) => line(t(sp.name, locale), `specialties/${sp.slug}.html`, t(sp.sub, locale) || t(sp.intro, locale))),
    "",
    "## Doctors",
    "",
    ...published(c.doctors).filter((doctor) => !doctor.sample).map((doctor) => line(t(doctor.name, locale), `doctors/${doctor.slug}.html`, t(doctor.title, locale) || t(doctor.bio, locale))),
    "",
    "## Branches",
    "",
    ...published(c.branches).map((branch) => line(t(branch.name, locale), `branches/${branch.slug}.html`, t(branch.intro, locale) || t(branch.address, locale))),
    "",
    "## Knowledge Centre",
    "",
    ...(knowledge?.children || []).map((item) => line(t(item.label, locale), item.href, t(item.desc, locale))),
    "",
    "## Patient Guide",
    "",
    ...(patients?.children || []).map((item) => line(t(item.label, locale), item.href, t(item.desc, locale))),
    "",
    "## RecipeGuide",
    "",
    `- [The La Rose Recipe Book](${base}/RecipeGuide/): ${short(t((c.digital.products || []).find((p) => p.slug === "recipe-book")?.lede, locale))}`,
    `- [Free 60-recipe guide](${base}/RecipeGuide/free/): Free bilingual recipe sampler from La Rose.`,
    "",
  ];
  return sections.join("\n");
}

function agents(c) {
  const s = c.site, base = `https://${s.brand.domain}`;
  const maadi = published(c.branches).find((b) => b.status !== "soon") || published(c.branches)[0] || {};
  const address = `${t(maadi.address, "ar") || ""} / ${t(maadi.address, "en") || ""}`.trim();
  return [
    `Site: ${t(s.brand.name,"ar")} / ${t(s.brand.name,"en")}`,
    `Description: ${t(s.brand.kind,"ar")} / ${t(s.brand.kind,"en")}`,
    `Address: ${address}`,
    `Phone: ${s.contact.phone.display}`,
    `WhatsApp: ${s.contact.whatsapp.href}`,
    "Languages: Arabic (Egyptian), English",
    `Home-AR: ${base}/ar/`, `Home-EN: ${base}/en/`,
    `Specialties-AR: ${base}/ar/specialties/`, `Specialties-EN: ${base}/en/specialties/`,
    `Doctors-AR: ${base}/ar/doctors/`, `Doctors-EN: ${base}/en/doctors/`,
    `Booking-AR: ${base}/ar/patients/booking`, `Booking-EN: ${base}/en/patients/booking`,
    `Branches-AR: ${base}/ar/branches/`, `Branches-EN: ${base}/en/branches/`,
    `Knowledge-AR: ${base}/ar/articles/`, `Knowledge-EN: ${base}/en/articles/`,
    `RecipeGuide: ${base}/RecipeGuide/`, `RecipeGuide-Free: ${base}/RecipeGuide/free/`,
    `Legal-AR: ${base}/ar/legal/`, `Legal-EN: ${base}/en/legal/`,
    `LLMS: ${base}/llms.txt`, `Sitemap: ${base}/sitemap.xml`,
    "Policy: Indexing and answering questions about the clinic is allowed. Medical content is general information.", ""
  ].join("\n");
}

/* --------------------------------------------------------------------------
   Main
   -------------------------------------------------------------------------- */
async function main() {
  const started = Date.now();
  const c = loadContent();

  // The advice pool is a generated public asset, not page content. Keep one
  // canonical copy in content/ and emit the browser payload on every build.
  const tipsOut = path.join(OUT_DIR, "assets", "data", "tips.json");
  fs.mkdirSync(path.dirname(tipsOut), { recursive: true });
  fs.writeFileSync(tipsOut, `${JSON.stringify(c.tips)}\n`, "utf8");

  // Clean only the generated locale trees; assets are hand-managed.
  for (const loc of LOCALES) {
    const dir = path.join(OUT_DIR, loc);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  }

  // Home
  for (const locale of LOCALES) {
    out(`${locale}/index.html`, renderHome({ c, locale }));
  }

  // Optional page modules — skipped silently until they exist
  for (const mod of PAGE_MODULES) {
    const abs = path.join(ROOT, "build", mod.replace("./", ""));
    if (!fs.existsSync(abs)) continue;
    const m = await import(`file://${abs.replace(/\\/g, "/")}`);
    if (typeof m.pages !== "function") {
      console.warn(`  ! ${mod} has no exported pages(ctx) — skipped`);
      continue;
    }
    for (const locale of LOCALES) {
      for (const p of m.pages({ c, locale })) out(p.path, p.html);
    }
  }

  // Root gate and crawler files
  out("index.html", rootIndex(c));
  out("404.html", root404(c));
  fs.writeFileSync(
    path.join(OUT_DIR, "robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /dashboard/\nDisallow: /_viewport.html\nDisallow: /_bookpages.html\nDisallow: /assets/data/\n\n${["Googlebot","Googlebot-Image","Bingbot","Applebot","DuckDuckBot","GPTBot","OAI-SearchBot","ChatGPT-User","ClaudeBot","Claude-User","Claude-SearchBot","anthropic-ai","PerplexityBot","Perplexity-User","Google-Extended","CCBot","Amazonbot","Bytespider","meta-externalagent","cohere-ai","YouBot"].map((bot) => `User-agent: ${bot}\nAllow: /\nDisallow: /dashboard/\nDisallow: /_viewport.html\nDisallow: /_bookpages.html\nDisallow: /assets/data/`).join("\n\n")}\n\nSitemap: https://${c.site.brand.domain}/sitemap.xml\n`,
    "utf8"
  );
  fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), sitemap(c, written), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "llms.txt"), llms(c), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "agents.txt"), agents(c), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, ".nojekyll"), "", "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "CNAME"), "laroseclinics.com", "utf8");
  const verificationFile = String(c.site.integrations?.analytics?.googleVerificationFile || "").trim();
  if (verificationFile && /^[A-Za-z0-9._-]+\.html$/.test(verificationFile)) {
    fs.writeFileSync(path.join(OUT_DIR, verificationFile), `google-site-verification: ${verificationFile}`, "utf8");
  }

  const ms = Date.now() - started;
  console.log(`\n  La Rose — built ${written.length} pages in ${ms}ms\n`);
  const byDir = written.reduce((acc, p) => {
    const k = p.split("/").slice(0, 2).join("/").replace(/\.html$/, "");
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  for (const [k, v] of Object.entries(byDir)) console.log(`    ${k.padEnd(28)} ${v}`);
  console.log("");
}

main().catch((e) => {
  console.error("\n  BUILD FAILED\n");
  console.error(e);
  process.exit(1);
});
