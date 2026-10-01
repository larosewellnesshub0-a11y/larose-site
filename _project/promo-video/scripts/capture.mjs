// Captures real screenshots of the built site for the promo video.
// Run with the local server up: node server/serve.mjs 4173
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "http://localhost:4173";
const OUT = path.resolve("public/shots");
fs.mkdirSync(OUT, { recursive: true });

const desktop = { width: 1440, height: 900, deviceScaleFactor: 1.5 };
const mobile = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const tablet = { width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

const A = "mounjaro-results-timeline-what-to-expect";
const jobs = [
  // Arabic is the primary site
  ["ar-home", "/ar/", desktop, { full: 7000 }],
  ["ar-home-dark", "/ar/", desktop, { dark: true, full: 3000 }],
  ["ar-specialties", "/ar/specialties/", desktop, { full: 4000 }],
  ["ar-weight", "/ar/specialties/weight-management", desktop, { full: 4000 }],
  ["ar-rheum", "/ar/specialties/rheumatology", desktop, { full: 3000 }],
  ["ar-doctors", "/ar/doctors/", desktop, { full: 3000 }],
  ["ar-doctor", "/ar/doctors/shimaa-fouad", desktop, { full: 3000 }],
  ["ar-branches", "/ar/branches/", desktop, { full: 3000 }],
  ["ar-branch", "/ar/branches/fifth-settlement", desktop, { full: 3000 }],
  ["ar-tools", "/ar/tools/", desktop, { full: 3000 }],
  ["ar-bmi", "/ar/tools/bmi-calculator", desktop, { full: 2500 }],
  ["ar-recipe", "/ar/digital/recipe-book", desktop, { full: 3000 }],
  ["ar-articles", "/ar/articles/", desktop, { full: 4000 }],
  ["ar-article", "/ar/articles/" + A, desktop, { full: 9000 }],
  ["ar-about", "/ar/about/", desktop, { full: 3000 }],
  ["ar-patients", "/ar/patients/first-visit", desktop, { full: 3000 }],
  ["m-ar-home", "/ar/", mobile, { full: 5000 }],
  ["m-ar-article", "/ar/articles/" + A, mobile, { full: 5000 }],
  ["m-ar-bmi", "/ar/tools/bmi-calculator", mobile, { full: 2500 }],
  ["m-ar-doctor", "/ar/doctors/shimaa-fouad", mobile, { full: 2500 }],
  ["t-ar-home", "/ar/", tablet, { full: 3500 }],
  ["t-ar-specialties", "/ar/specialties/", tablet, { full: 3500 }],
  // English counterparts
  ["en-home", "/en/", desktop, { full: 4000 }],
  ["en-article", "/en/articles/" + A, desktop, { full: 6000 }],
  ["en-specialties", "/en/specialties/", desktop, { full: 3000 }],
  ["en-doctors", "/en/doctors/", desktop, { full: 3000 }],
  ["m-en-home", "/en/", mobile, { full: 3000 }],
  ["t-en-home", "/en/", tablet, { full: 3000 }],
];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const seo = {};
for (const [name, url, vp, opt] of jobs) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.deviceScaleFactor, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, reducedMotion: "reduce" });
  await ctx.route(/promo\.json|track\.js|googletagmanager|clarity/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  if (opt.dark) await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  // trigger lazy images and reveal animations
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
    document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in"));
    document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
  });
  await page.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important} .promo,.promo-banner,[class^=promo]{display:none!important}" });
  await page.evaluate(() => document.querySelectorAll("img[srcset]").forEach((i) => { const c = i.currentSrc; i.removeAttribute("sizes"); i.removeAttribute("srcset"); if (c) i.src = c; }));
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  await page.waitForTimeout(1600);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const clipH = Math.min(h, opt.full || vp.height);
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: vp.width, height: clipH }, fullPage: true });
  if (name === "ar-article" || name === "en-article" || name === "ar-home") {
    seo[name] = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name=description]')?.content,
      canonical: document.querySelector('link[rel=canonical]')?.href,
      hreflang: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map((l) => [l.hreflang, l.href]),
      jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => { try { const j = JSON.parse(s.textContent); const g = j["@graph"] || [j]; return g.map((x) => x["@type"]); } catch { return []; } }),
      h1: document.querySelector("h1")?.textContent.trim(),
      h2: [...document.querySelectorAll("article h2, main h2")].slice(0, 8).map((e) => e.textContent.trim()),
      sources: document.querySelectorAll("ol li a[href*=ncbi], ol li a[href*=nice], .sources li").length,
      faqs: document.querySelectorAll("details").length,
      og: document.querySelector('meta[property="og:image"]')?.content,
    }));
  }
  console.log(name, vp.width + "x" + clipH);
  await ctx.close();
}
fs.writeFileSync("src/seo.json", JSON.stringify(seo, null, 2));
await browser.close();
