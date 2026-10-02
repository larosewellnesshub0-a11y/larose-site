// Mobile capture of a specialty page with the «آراء العملاء» tab opened (reviews live behind a tab on mobile).
import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const c = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
await c.route(/promo\.json|track\.js|googletagmanager|clarity/, (r) => r.abort());
const p = await c.newPage();
await p.goto("http://localhost:4173/ar/specialties/weight-management", { waitUntil: "networkidle" });
const tab = p.locator("button, a, [role=tab]").filter({ hasText: "آراء العملاء" }).first();
await tab.click();
await p.waitForTimeout(800);
await p.evaluate(() => { document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-in")); document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager")); });
await p.addStyleTag({ content: "[data-reveal]{opacity:1!important;transform:none!important}" });
await p.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
await p.evaluate(() => document.querySelectorAll("body *").forEach((e) => { const cs = getComputedStyle(e); if (cs.position === "fixed" && e.getBoundingClientRect().top > 300) e.style.setProperty("display", "none", "important"); }));
await p.waitForTimeout(1000);
const y = await p.evaluate(() => { let best = null; for (const e of document.querySelectorAll("body *")) { if (e.children.length > 3) continue; if ((e.textContent || "").includes("من 138 مراجعة")) { const r = e.getBoundingClientRect(); if (r.height > 0 && (!best || r.height < best.h)) best = { y: Math.round(r.y + scrollY), h: Math.round(r.height) }; } } return best; });
console.log("rating y", JSON.stringify(y));
await p.screenshot({ path: "public/shots/m-ar-weight.jpg", type: "jpeg", quality: 86, clip: { x: 0, y: 0, width: 390, height: 4200 }, fullPage: true });
await b.close();
