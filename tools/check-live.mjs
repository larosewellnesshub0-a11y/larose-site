#!/usr/bin/env node

const DEFAULT_BASE = "https://larosewellnesshub0-a11y.github.io/larose-site/";
const input = process.argv[2] || DEFAULT_BASE;
const base = new URL(input.endsWith("/") ? input : `${input}/`);

function liveUrl(sitePath) {
  const relative = String(sitePath || "/").replace(/^\/+/, "");
  return new URL(relative, base).href;
}

function trackingPresent(body) {
  return /googletagmanager\.com\/gtag|clarity\.ms\/tag|connect\.facebook\.net\/.*fbevents|analytics\.tiktok\.com\/.*events\.js/.test(body);
}

function sample(items, count) {
  const pool = [...new Set(items)];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

async function inspect(url, label = "") {
  try {
    const response = await fetch(url, { redirect: "follow", headers: { "user-agent": "LaRose-live-QA/1.0" } });
    const type = response.headers.get("content-type") || "—";
    const body = await response.text();
    const isHtml = type.includes("text/html");
    const tracking = isHtml ? (trackingPresent(body) ? "yes" : "no") : "n/a";
    return { label: label || new URL(url).pathname, url, status: response.status, type, tracking, body };
  } catch (error) {
    return { label: label || url, url, status: "ERR", type: "—", tracking: "n/a", body: "", error: error.message };
  }
}

const fixedPaths = [
  "/", "/ar/", "/en/", "/RecipeGuide/", "/RecipeGuide/free/", "/robots.txt",
  "/sitemap.xml", "/agents.txt", "/llms.txt", "/404.html", "/dashboard/",
  "/dashboard/content/index.json",
];

const fixed = [];
for (const sitePath of fixedPaths) fixed.push(await inspect(liveUrl(sitePath), sitePath));

const sitemapBody = fixed.find((item) => item.label === "/sitemap.xml")?.body || "";
const locs = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replace(/&amp;/g, "&"));
const articlePaths = locs.map((value) => new URL(value).pathname)
  .filter((value) => /\/(?:ar|en)\/articles\/[^/]+\.html$/.test(value))
  .filter((value) => !/\/(?:category-[^/]+|index|list|updates|qa|tips|faq)\.html$/.test(value));
const articleChecks = [];
for (const pathname of sample(articlePaths, 5)) articleChecks.push(await inspect(liveUrl(pathname), pathname));

const assetCandidates = [...fixed, ...articleChecks].flatMap((item) =>
  [...item.body.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => {
    const value = match[1];
    if (!/\.(?:css|js|png|jpe?g|webp|svg|woff2)(?:[?#]|$)/i.test(value)) return null;
    const parsed = new URL(value, item.url);
    return parsed.origin === base.origin ? parsed.href : null;
  })).filter(Boolean);
const assetChecks = [];
for (const url of sample(assetCandidates, 3)) assetChecks.push(await inspect(url, new URL(url).pathname));

const results = [...fixed, ...articleChecks, ...assetChecks];
console.log(`Live QA: ${base.href}`);
console.log("STATUS  CONTENT-TYPE                         TRACKING  PATH");
for (const item of results) {
  console.log(`${String(item.status).padEnd(7)} ${item.type.slice(0, 36).padEnd(36)} ${item.tracking.padEnd(8)} ${item.label}${item.error ? ` — ${item.error}` : ""}`);
}
const failures = results.filter((item) => item.status !== 200);
console.log(`\n${results.length} URLs checked; ${failures.length} non-200 response${failures.length === 1 ? "" : "s"}.`);
process.exitCode = failures.length ? 1 : 0;
