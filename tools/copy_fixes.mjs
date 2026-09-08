/* -----------------------------------------------------------------------
   copy_fixes.mjs — one-off editorial sweep requested by the client.

   Four separate jobs, kept in one script so they run in a known order and
   the whole sweep is repeatable:

     1. em dash removal        — the client asked for alternatives
     2. "أدوات صحية" → "أدوات طبية"
     3. remaining feminine imperatives → masculine
     4. inline medical / storage disclaimers stripped site-wide

   Run:  node tools/copy_fixes.mjs
   The standalone legal pages are deliberately left in place; only the
   in-page notices go.
   --------------------------------------------------------------------- */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const R = (...p) => path.join(ROOT, ...p);

let counts = { dash: 0, tools: 0, fem: 0 };

/* ---------------------------------------------------------------- 1. dashes */
/* An em dash in this copy is almost always doing one of two jobs: separating
   an aside, or introducing a list. A comma covers the first; a colon reads far
   better for the second, so we look ahead to see whether the tail of the
   sentence enumerates. Replacing every dash with a comma would turn
   "الأقسام بتتشاور مع بعض — التغذية مع الباطنة، الجلدية مع التغذية"
   into a run-on with three equal commas and no structure. */
function dedash(s) {
  if (!s.includes("—")) return s;
  return s.replace(/\s*—\s*/g, (m, off) => {
    counts.dash++;
    const tail = s.slice(off + m.length, off + m.length + 90);
    const sentence = tail.split(/[.。!?؟\n]|\.\s/)[0];
    // an enumeration in the tail means the dash was introducing a list
    if (/[،,]/.test(sentence) && !/^(و|and\b|أو|or\b)/.test(sentence.trim())) return ": ";
    return "، ";
  });
}

/* --------------------------------------------------------------- 2. naming */
function renameTools(s) {
  const before = s;
  s = s.replaceAll("أدوات صحية", "أدوات طبية")
       .replaceAll("الأدوات الصحية", "الأدوات الطبية")
       .replaceAll("أدواتنا الصحية", "أدواتنا الطبية");
  if (s !== before) counts.tools++;
  return s;
}

/* ------------------------------------------------------------- 3. feminine */
/* Explicit pairs only. A regex on a trailing ya destroys اللي / المعادي /
   الجسمي / دلوقتي, and محتاجة / ماشية are usually correct because they agree
   with a feminine noun rather than addressing the reader. */
const FEM = [
  ["جهّزي", "جهّز"], ["جهزي", "جهز"],
  ["حضّري", "حضّر"], ["حضري", "حضر"],
  ["اختاري", "اختار"], ["إختاري", "اختار"],
  ["سجّلي", "سجّل"], ["سجلي", "سجل"],
  ["اشربي", "اشرب"], ["ابدئي", "ابدأ"], ["إبدئي", "ابدأ"],
  ["تابعي", "تابع"], ["احجزي", "احجز"], ["إحجزي", "احجز"],
  ["اكتبي", "اكتب"], ["قيسي", "قيس"], ["خدي", "خد"],
  ["استخدمي", "استخدم"], ["اسألي", "اسأل"], ["كلّمي", "كلّم"],
];
function demasc(s) {
  for (const [f, m] of FEM) {
    if (s.includes(f)) { counts.fem += s.split(f).length - 1; s = s.replaceAll(f, m); }
  }
  return s;
}

const fixString = (s) => demasc(renameTools(dedash(s)));

/* ---------------------------------------------------------------- content */
function walkJson(v) {
  if (typeof v === "string") return fixString(v);
  if (Array.isArray(v)) return v.map(walkJson);
  if (v && typeof v === "object") {
    const o = {};
    for (const k of Object.keys(v)) o[k] = walkJson(v[k]);
    return o;
  }
  return v;
}

for (const f of fs.readdirSync(R("content")).filter((x) => x.endsWith(".json"))) {
  const p = R("content", f);
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  fs.writeFileSync(p, JSON.stringify(walkJson(j), null, 2));
}

/* -------------------------------------------------------------- templates */
const tpl = [];
for (const dir of ["build/pages", "build/lib"]) {
  for (const f of fs.readdirSync(R(dir)).filter((x) => x.endsWith(".mjs"))) tpl.push(R(dir, f));
}
tpl.push(R("site/assets/js/site.js"), R("site/assets/js/tools.js"),
         R("dashboard/js/dashboard.js"), R("dashboard/index.html"));

for (const p of tpl) {
  if (!fs.existsSync(p)) continue;
  fs.writeFileSync(p, fixString(fs.readFileSync(p, "utf8")));
}

/* ------------------------------------------------- 4. inline disclaimers */
/* Remove the call sites rather than blanking the component, so the empty
   section wrappers do not leave a band of dead padding behind them. */
let removed = 0;
const NOTICE = [
  /^[ \t]*<section class="section section--tight"[^>]*>\s*<div class="wrap wrap--narrow">\$\{medicalNotice\([^)]*\)\}<\/div>\s*<\/section>[ \t]*\n?/gm,
  /^[ \t]*<div class="wrap wrap--narrow">\$\{medicalNotice\([^)]*\)\}<\/div>[ \t]*\n?/gm,
  /^[ \t]*\$\{medicalNotice\([^)]*\)\}[ \t]*\n?/gm,
  /\$\{medicalNotice\([^)]*\)\}/g,
];
for (const p of tpl) {
  if (!fs.existsSync(p) || !p.endsWith(".mjs")) continue;
  let s = fs.readFileSync(p, "utf8");
  const before = s;
  for (const re of NOTICE) s = s.replace(re, "");
  // drop it from the import lists it is no longer used in
  if (!/medicalNotice\s*\(/.test(s)) {
    s = s.replace(/(\n\s*)medicalNotice,(?=\s)/g, "$1")
         .replace(/,\s*medicalNotice(?=[,\s}])/g, "")
         .replace(/\bmedicalNotice,\s*/g, "");
  }
  if (s !== before) { removed++; fs.writeFileSync(p, s); }
}

// the footer carried the long disclaimer paragraph on all 213 pages
{
  const p = R("build/lib/shell.mjs");
  let s = fs.readFileSync(p, "utf8");
  s = s.replace(/^[ \t]*<p class="site-footer__disclaimer">[^\n]*\n/m, "");
  fs.writeFileSync(p, s);
}

console.log(`em dashes replaced : ${counts.dash}`);
console.log(`tools renamed in   : ${counts.tools} strings`);
console.log(`feminine forms     : ${counts.fem}`);
console.log(`notice call sites  : removed from ${removed} template files`);
