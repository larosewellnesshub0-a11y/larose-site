import { chromium } from "playwright";
import fs from "node:fs";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell" });
const jobs = [["ar-home", "/ar/", ["h1", ".hero .btn", ".site-header img, header img", ".hero__stats, [class*=stat]", "form, .booking"]],
  ["ar-doctor", "/ar/doctors/shimaa-fouad", ["main img", "h1"]], ["ar-article", "/ar/articles/mounjaro-results-timeline-what-to-expect", ["img[fetchpriority=high]", "h1"]],
  ["ar-bmi", "/ar/tools/bmi-calculator", ["form", "h1"]], ["ar-specialties", "/ar/specialties/", [".card", "h1"]], ["ar-weight", "/ar/specialties/weight-management", ["h1", ".card"]]];
const out = {};
for (const [k, u, sels] of jobs) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto("http://localhost:4173" + u, { waitUntil: "networkidle" });
  out[k] = await p.evaluate((sels) => Object.fromEntries(sels.map((s) => { const e = document.querySelector(s); if (!e) return [s, null]; const r = e.getBoundingClientRect(); return [s, [r.x, r.y + scrollY, r.width, r.height].map(Math.round)]; })), sels);
  await p.close();
}
console.log(JSON.stringify(out, null, 0));
await b.close();
