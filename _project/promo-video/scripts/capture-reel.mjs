// Mobile (390×844 @3x) captures for the vertical reel, plus y-positions of the parts each scene scrolls to.
import { chromium } from "playwright";
import fs from "node:fs";
const BASE = "http://localhost:4173";
const OUT = "public/shots";
const mobile = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const A = "mounjaro-results-timeline-what-to-expect";
const jobs = [
  ["m-ar-home", "/ar/", {}, ["احجز في دقيقة", "اختار التخصص والطبيب"]],
  ["m-ar-home-dark", "/ar/", { dark: true }, []],
  ["m-en-home", "/en/", {}, []],
  ["m-ar-weight", "/ar/specialties/weight-management", {}, ["آراء العملاء", "5.0 من"]],
  ["m-ar-articles", "/ar/articles/", {}, []],
  ["m-ar-article", "/ar/articles/" + A, {}, []],
  ["m-en-article", "/en/articles/" + A, {}, []],
  ["m-ar-faq", "/ar/patients/faq", {}, []],
  ["m-ar-bmi", "/ar/tools/bmi-calculator", {}, []],
  ["m-ar-tools", "/ar/tools/", {}, []],
  ["m-ar-prep", "/ar/patients/preparation", {}, []],
  ["m-ar-doctor", "/ar/doctors/shimaa-fouad", {}, []],
  ["m-ar-recipe", "/ar/digital/recipe-book", {}, ["جرّب ٦٠ وصفة مجاناً", "الكتاب هدية مع الكشف"]],
  ["m-ar-online", "/ar/digital/online-diet", {}, []],
  ["m-ar-specialties", "/ar/specialties/", {}, []],
];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const marks = {};
for (const [name, url, opt, find] of jobs) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
  await ctx.route(/promo\.json|track\.js|googletagmanager|clarity/, (r) => r.abort());
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  if (opt.dark) await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
    document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in"));
    document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager"));
  });
  await page.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important} .promo,.promo-banner,[class^=promo]{display:none!important}" });
  await page.evaluate(() => document.querySelectorAll("img[srcset]").forEach((i) => { const c = i.currentSrc; i.removeAttribute("sizes"); i.removeAttribute("srcset"); if (c) i.src = c; }));
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  await page.evaluate(() => document.querySelectorAll("body *").forEach((e) => { const cs = getComputedStyle(e); if (cs.position === "fixed" && e.getBoundingClientRect().top > 300) e.style.setProperty("display", "none", "important"); }));
  await page.waitForTimeout(1500);
  marks[name] = await page.evaluate((find) => {
    const out = {};
    for (const f of find) {
      let best = null;
      for (const e of document.querySelectorAll("body *")) {
        if (e.children.length > 3) continue;
        if ((e.textContent || "").includes(f)) { const r = e.getBoundingClientRect(); if (r.height > 0 && (!best || r.height < best.h)) best = { y: Math.round(r.y + scrollY), h: Math.round(r.height) }; }
      }
      out[f] = best;
    }
    const wa = document.querySelector('a[href*="wa.me"], a[href*="whatsapp"]');
    if (wa) { const r = wa.getBoundingClientRect(); out.whatsapp = [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }
    out.height = document.documentElement.scrollHeight;
    return out;
  }, find);
  const h = Math.min(marks[name].height, 4200);
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: "jpeg", quality: 86, clip: { x: 0, y: 0, width: 390, height: h }, fullPage: true });
  console.log(name, h, JSON.stringify(marks[name]));
  await ctx.close();
}
fs.writeFileSync("src/reel-marks.json", JSON.stringify(marks, null, 1));
await browser.close();
