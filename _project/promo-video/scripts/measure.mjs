import { chromium } from "playwright";
import fs from "node:fs";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const out = {};
for (const [k, u] of [["ar-home", "/ar/"], ["ar-article", "/ar/articles/mounjaro-results-timeline-what-to-expect"], ["en-home", "/en/"]]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto("http://localhost:4173" + u, { waitUntil: "networkidle" });
  out[k] = await p.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y + scrollY, b.width, b.height]; };
    return { h1: r("h1"), hero: r(".hero, header + main section, main > section"), cover: r("img[fetchpriority=high]"), meta: r(".article-meta, .byline, [class*=meta]"), btn: r(".btn--accent, .btn") };
  });
  await p.close();
}
fs.writeFileSync("src/rects.json", JSON.stringify(out, null, 1));
console.log(JSON.stringify(out));
await b.close();
