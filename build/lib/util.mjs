/* ==========================================================================
   Build utilities، La Rose Wellness Hub static generator
   ========================================================================== */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const CONTENT_DIR = path.join(ROOT, "content");
export const OUT_DIR = path.join(ROOT, "site");

export const LOCALES = ["ar", "en"];
export const DEFAULT_LOCALE = "ar";

/* ---- content loading ----------------------------------------------------- */
export function loadContent() {
  const read = (f) => JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf8"));
  const articles = read("articles.json");
  // Keep the September knowledge-centre expansion in its own source file so
  // editorial batches remain reviewable without rewriting the core library.
  const articleExpansion = read("articles-expansion-2026-09-11.json");
  const longformExpansion = read("articles-longform-2026-09-12.json");
  // Add two substantive safety-and-follow-up sections to every article in this
  // editorial batch. They deliberately support (rather than replace) each
  // article's topic-specific sections and make the guidance useful in a real
  // consultation without turning it into personal medical advice.
  const expansionArticles = (articleExpansion.articles || []).map((article) => ({
    ...article,
    sections: [
      ...(article.sections || []),
      {
        id: "use-information-wisely",
        heading: { ar: "استخدم المعلومات عشان تحضّر سؤالاً أفضل", en: "Use the information to prepare a better question" },
        body: {
          ar: "المقال يشرح أسئلة شائعة، لكنه لا يحدد سبب العرض أو الخطة المناسبة لك وحده. العمر، الأمراض والأدوية والحمل أو الجراحة السابقة ونتائج الفحص قد تغيّر معنى نفس العرض من شخص لآخر.\n\nقبل الموعد، اكتب ما الذي تغير، متى بدأ، وما الذي يجعله أفضل أو أسوأ، وخد قائمة بالأدوية والمكملات ونتائج سابقة لو متاحة. التفاصيل الصغيرة تساعد الفريق يقرر هل المتابعة، الفحص أو خطوة أخرى هي الأنسب.",
          en: "An article can explain common questions, but it cannot identify the cause of a symptom or set your individual plan. Age, health conditions, medicines, pregnancy, earlier surgery and examination findings can change what the same symptom means from one person to another.\n\nBefore an appointment, note what changed, when it began and what makes it better or worse. Bring lists of medicines and supplements and earlier results if available. Small details help the team decide whether follow-up, examination or another step is appropriate."
        }
      },
      {
        id: "follow-up-plan",
        heading: { ar: "اخرج من المتابعة بخطوة واضحة", en: "Leave follow-up with a clear next step" },
        body: {
          ar: "في نهاية الزيارة، اسأل ما الذي نراقبه، متى ترجع، ومن تتواصل معه لو تغيرت الأعراض. لو طُلب تحليل أو تصوير، اعرف السؤال الذي سيجيب عنه وكيف ترسل النتيجة أو تراجعها.\n\nلا تؤجل الرعاية المطلوبة بسبب الاعتماد على المقال أو تجربة شخص آخر. ولو ظهرت علامات شديدة أو متفاقمة، اتبع تعليمات فريقك واطلب رعاية عاجلة حسب شدة الحالة.",
          en: "At the end of a visit, ask what is being monitored, when to return and whom to contact if symptoms change. If a test or scan is requested, understand the question it will answer and how results will be reviewed.\n\nDo not delay needed care because of an article or another person's experience. If severe or worsening signs appear, follow your team's instructions and seek urgent care according to the situation."
        }
      }
    ]
  }));
  articles.articles = [
    ...(articles.articles || []),
    ...expansionArticles,
    ...(longformExpansion.articles || []),
  ];
  // Editorial images are hand-managed beneath `assets/img/articles/`. A small
  // legacy set was recorded without that directory; resolve it here so every
  // generated route advertises the real public asset rather than a dead URL.
  articles.articles = articles.articles.map((article) => {
    const image = article?.image;
    if (typeof image !== "string" || !image.startsWith("assets/img/") || image.startsWith("assets/img/articles/")) return article;
    const articleImage = `assets/img/articles/${path.basename(image)}`;
    return fs.existsSync(path.join(OUT_DIR, articleImage)) ? { ...article, image: articleImage } : article;
  });
  return {
    site:        read("site.json"),
    specialties: read("specialties.json").specialties,
    doctors:     read("doctors.json").doctors,
    branches:    read("branches.json").branches,
    // The FULL object, not just the array: it also carries `categories`,
    // and this keeps it consistent with reviews/digital/pages below.
    articles,
    tips:        read("tips.json"),
    reviews:     read("reviews.json"),
    digital:     read("digital.json"),
    pages:       read("pages.json"),
    recipeGuide: read("recipe-guide.json"),
  };
}

/* ---- i18n ----------------------------------------------------------------
   t(value, locale) unwraps a {ar, en} object. Strings pass through unchanged
   so a field can be either localised or shared.
   ------------------------------------------------------------------------- */
export function t(value, locale) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value;
  if (locale in value) return value[locale] ?? "";
  return "";
}

/** Localised array helper، always returns an array. */
export function ta(value, locale) {
  const v = t(value, locale);
  return Array.isArray(v) ? v : v ? [v] : [];
}

/* ---- escaping ------------------------------------------------------------ */
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

/** Escape for use inside a JSON-LD <script> block. */
export const escJson = (obj) =>
  JSON.stringify(obj).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

/* ---- URLs ----------------------------------------------------------------
   Every page knows its own depth below the locale root, so links are emitted
   as relative paths. That is what lets the whole site work from `file://`
   with no server، the client requirement.
   ------------------------------------------------------------------------- */
export function rel(depth) {
  return depth === 0 ? "" : "../".repeat(depth);
}

/** Link to a page within the same locale. */
export function link(depth, href) {
  if (!href) return "#";
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  // Root-relative public resources (for example /sitemap.xml) must not be
  // prefixed with the current page depth.
  if (href.startsWith("/")) return href;
  /* Clean URLs: the site is served by GitHub Pages, which resolves `dir/` to
     `dir/index.html`, so links never expose the file name (2026-09-08).
     The 2026-09-10 pass extends that to every other page too: Pages answers
     `specialties/clinical-nutrition` as happily as it answers the `.html`, and
     a visitor browsing the site should never see the extension. Verified live
     before changing: both forms return 200. Canonical, og:url, hreflang and the
     sitemap are generated from absolutePageUrl(), which strips it the same way,
     so only one form is ever advertised. */
  const clean = href
    .replace(/(^|\/)index\.html(?=$|[?#])/, "$1")
    .replace(/\.html(?=$|[?#])/, "");
  const out = rel(depth) + clean;
  return out === "" ? "./" : out;
}

/** Link to an asset. Assets live at `site/assets/`, one level ABOVE the
    locale root (`site/ar/`), so an extra `../` is always required. */
export function asset(depth, p) {
  return rel(depth + 1) + p.replace(/^\/+/, "");
}

/** The same page in the other locale. */
export function altLocaleHref(locale, depth, pagePath) {
  const other = locale === "ar" ? "en" : "ar";
  return `${rel(depth + 1)}${other}/${pagePath.replace(/(^|\/)index\.html$/, "$1")}`;
}

/* ---- text ---------------------------------------------------------------- */

/** Wrap Latin technical terms appearing inside Arabic copy. */
export function latin(text, terms) {
  if (!text) return "";
  let out = esc(text);
  for (const term of [...terms].sort((a, b) => b.length - a.length)) {
    const safe = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`(?<![\\w-])${safe}(?![\\w-])`, "g"), `<span class="lat">${term}</span>`);
  }
  return out;
}

/** Convert a plain-text paragraph block into <p> elements. */
export function paras(text, terms = []) {
  return String(text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${terms.length ? latin(p, terms) : esc(p)}</p>`)
    .join("\n");
}

/** Truncate for meta descriptions. */
export const clamp = (s, n = 158) => {
  const str = String(s ?? "").replace(/\s+/g, " ").trim();
  return str.length <= n ? str : str.slice(0, str.lastIndexOf(" ", n - 1)) + "…";
};

/* ---- conditional rendering ----------------------------------------------- */
export const when = (cond, html) => (cond ? html : "");
export const map = (arr, fn) => (arr || []).map(fn).join("\n");

/* ---- file output --------------------------------------------------------- */
export function write(outPath, html) {
  const full = path.join(OUT_DIR, outPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html, "utf8");
  return outPath;
}

/* ---- icons ---------------------------------------------------------------
   A small inline set. Inline SVG keeps the site to zero icon-font requests
   and lets every icon inherit `currentColor`.
   ------------------------------------------------------------------------- */
const ICONS = {
  phone:      `<path d="M4.5 3h3l1.5 4-2 1.4a12 12 0 0 0 5.6 5.6L14 12l4 1.5v3a1.5 1.5 0 0 1-1.7 1.5A15.5 15.5 0 0 1 3 5.2 1.5 1.5 0 0 1 4.5 3Z"/>`,
  whatsapp:   { vb: "0 0 24 24", d: `<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a13 13 0 0 1-6.6-5.8c-.5-.8-.8-1.7-.8-2.5 0-.9.4-1.6.8-2 .2-.2.4-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2 0 .4-.1.6l-.4.5c-.1.2-.3.3-.1.6a9.6 9.6 0 0 0 3.7 3.2c.3.2.5.1.6 0l.9-1c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3 0 .2 0 .8-.2 1.4Z"/>` },
  pin:        `<path d="M10 18s6-5.1 6-9.3A6 6 0 0 0 4 8.7C4 12.9 10 18 10 18Z"/><circle cx="10" cy="8.5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/>`,
  clock:      `<circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10 5.8V10l2.8 1.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
  calendar:   `<rect x="3" y="4.5" width="14" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3 8.5h14M7 2.8v3.4M13 2.8v3.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
  arrow:      `<path d="M4 10h11m0 0-4-4m4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  globe: { vb: "0 0 24 24", d: `<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.3 3.8 5.4 3.8 9s-1.3 6.7-3.8 9m0-18C9.5 5.3 8.2 8.4 8.2 12s1.3 6.7 3.8 9M3.5 9h17M3.5 15h17" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>` },
  star:       `<path d="M10 1.8l2.5 5.1 5.6.8-4 4 .9 5.6L10 14.6 5 17.3l1-5.6-4-4 5.5-.8L10 1.8Z"/>`,
  check:      `<path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`,
  info:       `<circle cx="10" cy="10" r="7.6" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M10 9v4.6M10 6.5v.1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
  /* Share targets. Simplified single-path marks at the same 20x20 weight as the
     rest of the set - recognisable at 18px, which is the size they render at. */
  facebook:   `<path d="M11.6 18v-6.4h2.2l.33-2.5H11.6V7.5c0-.72.2-1.2 1.24-1.2h1.32V4.06A17.8 17.8 0 0 0 12.23 4C10.32 4 9 5.16 9 7.29V9.1H6.8v2.5H9V18h2.6Z"/>`,
  /* Drawn on TikTok's own 24-unit grid rather than the 20-unit one the other
     glyphs use, so the note keeps its proportions. */
  tiktok:     { vb: "0 0 24 24", d: `<path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.82-2.47v-3.1a5.69 5.69 0 1 0 4.91 5.63V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.29 4.29 0 0 1-3.24-1.48Z"/>` },
  x:          `<path d="M13.9 3h2.5l-5.5 6.3L17.4 17h-4.6l-3.4-4.5L5.4 17H2.9l5.9-6.7L2.6 3h4.7l3.1 4.1L13.9 3Zm-.9 12.5h1.4L6.9 4.4H5.4l7.6 11.1Z"/>`,
  telegram:   `<path d="M17.6 4.2 2.9 9.9c-.7.3-.7.8-.1 1l3.7 1.2 1.4 4.3c.2.5.4.6.8.2l2-1.8 3.8 2.8c.7.4 1.2.2 1.4-.6l2.5-11.7c.2-.9-.3-1.3-1-1.1ZM7.6 12.3l7.4-4.6c.3-.2.6-.1.4.2l-6.1 5.6-.2 2.3-1.5-3.5Z"/>`,
  linkedin:   `<path d="M6.1 7.4v9.2H3.3V7.4h2.8ZM4.7 3.3c.9 0 1.5.6 1.5 1.4S5.6 6.1 4.7 6.1 3.2 5.5 3.2 4.7s.6-1.4 1.5-1.4Zm12 8v5.3H14v-4.9c0-1.2-.5-2-1.5-2-.8 0-1.3.5-1.5 1.1-.1.2-.1.5-.1.8v5H8.1s0-8.1 0-9.2h2.8v1.3c.4-.6 1.1-1.5 2.6-1.5 1.9 0 3.2 1.2 3.2 3.9Z"/>`,
  link:       `<path d="M8.4 11.6a3 3 0 0 0 4.5.3l2.4-2.4a3 3 0 0 0-4.2-4.2l-1.4 1.3M11.6 8.4a3 3 0 0 0-4.5-.3L4.7 10.5a3 3 0 0 0 4.2 4.2l1.4-1.3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
  /* One neutral mark for all three assistants. Their real logos are trademarks
     and reproducing them on a clinic's site is a licence question nobody here
     needs; the button carries the name in text, which is accurate and allowed. */
  ai:         `<path d="M10 2.6l1.5 4.2 4.2 1.5-4.2 1.5L10 14l-1.5-4.2L4.3 8.3l4.2-1.5L10 2.6Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M15.4 13.1l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7Z"/>`,
  instagram:  `<rect x="3" y="3" width="14" height="14" rx="4.2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="10" r="3.3" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="14.1" cy="5.9" r="1"/>`,
  youtube:    `<rect x="2" y="4.6" width="16" height="10.8" rx="3.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8.4 7.9l4.4 2.1-4.4 2.1V7.9Z"/>`,
  google:     `<path d="M17.6 10.2c0-.6 0-1.1-.2-1.6H10v3.1h4.3a3.7 3.7 0 0 1-1.6 2.4v2h2.6c1.5-1.4 2.3-3.5 2.3-5.9Z"/><path d="M10 18c2.2 0 4-.7 5.3-1.9l-2.6-2a4.8 4.8 0 0 1-7.1-2.5H2.9v2.1A8 8 0 0 0 10 18Z"/><path d="M5.6 11.6a4.8 4.8 0 0 1 0-3.1V6.4H2.9a8 8 0 0 0 0 7.2l2.7-2Z"/><path d="M10 5.1c1.2 0 2.3.4 3.1 1.2l2.3-2.3A8 8 0 0 0 2.9 6.4l2.7 2.1A4.8 4.8 0 0 1 10 5.1Z"/>`,
  leaf:       `<path d="M17 3c0 7.7-3.6 11.5-9 11.5A4.5 4.5 0 0 1 3.5 10C3.5 5.4 8.6 3 17 3Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M14 6c-4.5 2.2-7 5.7-8 11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
  scale:      `<path d="M10 3v14M5 6.5h10M4 17h12" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M5 6.5 2.8 12h4.4L5 6.5ZM15 6.5 12.8 12h4.4L15 6.5Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>`,
  /* An ultrasound probe: the transducer head with its beam fanning out below.
     `waves` was the nearest existing shape but it now belongs to nothing in
     particular, and a scan is a service of its own on this site. */
  ultrasound: `<path d="M6.4 2.8h7.2a1.4 1.4 0 0 1 1.4 1.4v2.6H5V4.2a1.4 1.4 0 0 1 1.4-1.4Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M4.2 9.6a9 9 0 0 0 11.6 0M5.6 13a7 7 0 0 0 8.8 0M7.2 16.4a4.6 4.6 0 0 0 5.6 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
  waves:      `<path d="M2 7.5c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 4 0M2 12.5c2-1.6 4-1.6 6 0s4 1.6 6 0 4-1.6 4 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
  stethoscope:`<path d="M5 3v4.2a3.6 3.6 0 0 0 7.2 0V3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M8.6 10.8v2a4 4 0 0 0 8 0v-1.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="16.6" cy="9.5" r="1.9" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3.6 3h2.8M11 3h2.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
  scalpel:    `<path d="M3 17l5.5-5.5M8.5 11.5 15.8 4.2a2 2 0 0 1 2.8 2.8L11.3 14.3l-2.8-2.8Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>`,
  activity:   `<path d="M2 10h3.4l2.2-6 4.4 12 2.2-6H18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
  sparkle:    `<path d="M10 2.5l1.7 4.7 4.8 1.8-4.8 1.8L10 15.5l-1.7-4.7-4.8-1.8 4.8-1.8L10 2.5Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M15.6 13.4l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9Z"/>`,
  heart:      `<path d="M10 16.5S3 12.4 3 7.9A3.9 3.9 0 0 1 10 5.6a3.9 3.9 0 0 1 7 2.3c0 4.5-7 8.6-7 8.6Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>`,
  book:       `<path d="M3.5 4.2A16 16 0 0 1 10 5.6a16 16 0 0 1 6.5-1.4v10.6A16 16 0 0 0 10 16.2a16 16 0 0 0-6.5-1.4V4.2Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M10 5.6v10.6" fill="none" stroke="currentColor" stroke-width="1.4"/>`,
  monitor:    `<rect x="2.5" y="3.5" width="15" height="10.5" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7 17.5h6M10 14v3.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
  user:       `<circle cx="10" cy="7" r="3.4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3.8 17.2a6.4 6.4 0 0 1 12.4 0" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`,
};

export function icon(name, cls = "ico") {
  const entry = ICONS[name];
  if (!entry) return "";
  // Most glyphs are drawn on a 20-unit grid; a few carry their own viewBox.
  const vb = typeof entry === "string" ? "0 0 20 20" : entry.vb;
  const body = typeof entry === "string" ? entry : entry.d;
  return `<svg class="${cls}" viewBox="${vb}" fill="currentColor" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** The olive sprig ornament, from the clinic's own artwork. */
export function sprig(cls = "sprig sprig--tl") {
  return `<svg class="${cls}" viewBox="0 0 200 300" fill="none" aria-hidden="true" focusable="false">
    <path d="M100 300C100 300 96 210 78 150C60 90 24 44 24 44" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    ${Array.from({ length: 9 }, (_, i) => {
      const y = 60 + i * 26, x = 84 - i * 5.5, s = 1 - i * 0.055;
      return `<ellipse cx="${x - 26 * s}" cy="${y}" rx="${25 * s}" ry="${11 * s}" transform="rotate(-28 ${x - 26 * s} ${y})" fill="currentColor" opacity=".85"/>
              <ellipse cx="${x + 26 * s}" cy="${y + 12}" rx="${25 * s}" ry="${11 * s}" transform="rotate(28 ${x + 26 * s} ${y + 12})" fill="currentColor" opacity=".85"/>`;
    }).join("")}
  </svg>`;
}

/** Star rating markup. */
export function stars(value = 5, cls = "rating") {
  const full = Math.round(value);
  return `<span class="${cls}" role="img" aria-label="${value} / 5">${
    Array.from({ length: 5 }, (_, i) =>
      `<svg viewBox="0 0 20 20" fill="${i < full ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.2" aria-hidden="true">${ICONS.star}</svg>`
    ).join("")
  }</span>`;
}

/* ---- optional imagery -----------------------------------------------------
   Generated brand frames land in site/assets/img/ over time. Rather than
   editing content every time one arrives, templates ask for a path and get
   it back only if the file is actually there. A missing image simply falls
   through to the designed placeholder.
   ------------------------------------------------------------------------- */
export function imageIfExists(relPath) {
  if (!relPath) return null;
  try {
    return fs.existsSync(path.join(OUT_DIR, relPath)) ? relPath : null;
  } catch { return null; }
}

/* ---- intrinsic image size -------------------------------------------------
   Every <img> needs width and height or the page reflows as images arrive.
   Hard-coding them breaks the moment an image is regenerated at a new size, so
   read the real dimensions off the file instead. Pure header parsing, no
   dependency: WebP (VP8, VP8L and VP8X), PNG and JPEG are all the site uses.
   Results are cached because the same frame appears on many pages.
   ------------------------------------------------------------------------- */
const sizeCache = new Map();

export function imageSize(relPath) {
  if (!relPath) return null;
  if (sizeCache.has(relPath)) return sizeCache.get(relPath);
  let out = null;
  try {
    const b = fs.readFileSync(path.join(OUT_DIR, relPath));
    if (b.length > 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
      const kind = b.toString("ascii", 12, 16);
      if (kind === "VP8X") {
        out = { w: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), h: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
      } else if (kind === "VP8 ") {
        out = { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
      } else if (kind === "VP8L") {
        const bits = b.readUInt32LE(21);
        out = { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
      }
    } else if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) {
      out = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    } else if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length - 9) {
        if (b[i] !== 0xff) { i++; continue; }
        const marker = b[i + 1];
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
          out = { w: b.readUInt16BE(i + 7), h: b.readUInt16BE(i + 5) };
          break;
        }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch { out = null; }
  sizeCache.set(relPath, out);
  return out;
}

/** width and height attributes for an <img>, or an empty string if the file
    cannot be measured. Keeps the caller free of branching. */
export function sizeAttrs(relPath) {
  const s = imageSize(relPath);
  return s ? ` width="${s.w}" height="${s.h}"` : "";
}

/* ---- responsive image candidates ----------------------------------------
   The image pipeline writes smaller siblings beside the original frame, such
   as `frame-600.webp`. Keep the discovery here so every template uses the
   same real dimensions rather than treating the filename as a width promise.
   `toUrl` lets a page resolve an asset relative to its own depth. */
export function responsiveAttrs(relPath, sizes, toUrl = (p) => p) {
  if (!relPath || !sizes) return "";
  const match = String(relPath).match(/^(.*)(\.[^./]+)$/);
  if (!match) return "";
  const [, stem, ext] = match;
  const paths = [
    imageIfExists(relPath),
    ...[600, 700, 900, 1200]
      .map((width) => imageIfExists(`${stem}-${width}${ext}`))
      .filter(Boolean),
  ];
  const byWidth = new Map();
  for (const candidate of paths) {
    const size = imageSize(candidate);
    if (size?.w && !byWidth.has(size.w)) byWidth.set(size.w, candidate);
  }
  if (byWidth.size < 2) return "";
  const srcset = [...byWidth.entries()]
    .sort(([a], [b]) => a - b)
    .map(([width, candidate]) => `${toUrl(candidate)} ${width}w`)
    .join(", ");
  return ` srcset="${srcset}" sizes="${sizes}"`;
}

/* These values deliberately mirror the CSS layout primitives: the 1240px
   wrap, its fluid gutter, and the auto-fit 18rem / 22rem grid tracks. Keep a
   context-specific value at the call site when a component has a tighter cap. */
const WRAP_GUTTER = "clamp(1.15rem, 0.6rem + 2.6vw, 3rem)";
const GRID_GAP = "clamp(1.1rem, 0.6rem + 1.6vw, 2rem)";
export const IMAGE_SIZES = Object.freeze({
  grid3: `(min-width: 77.5rem) 22.5rem, (min-width: 62rem) calc((100vw - ${WRAP_GUTTER} - ${WRAP_GUTTER} - ${GRID_GAP} - ${GRID_GAP}) / 3), (min-width: 41rem) calc((100vw - ${WRAP_GUTTER} - ${WRAP_GUTTER} - ${GRID_GAP}) / 2), calc(100vw - ${WRAP_GUTTER} - ${WRAP_GUTTER})`,
  grid2: `(min-width: 77.5rem) 34.75rem, (min-width: 50rem) calc((100vw - ${WRAP_GUTTER} - ${WRAP_GUTTER} - ${GRID_GAP}) / 2), calc(100vw - ${WRAP_GUTTER} - ${WRAP_GUTTER})`,
  narrow: `(min-width: 55rem) 49rem, calc(100vw - ${WRAP_GUTTER} - ${WRAP_GUTTER})`,
  capped34: `(min-width: 34rem) 34rem, calc(100vw - ${WRAP_GUTTER} - ${WRAP_GUTTER})`,
  capped26: `(min-width: 26rem) 26rem, calc(100vw - ${WRAP_GUTTER} - ${WRAP_GUTTER})`,
  insideSplit: `(min-width: 77.5rem) 27rem, (min-width: 56.25rem) 34vw, calc(100vw - ${WRAP_GUTTER} - ${WRAP_GUTTER})`,
  branchGallery: `(min-width: 77.5rem) 33.75rem, (min-width: 52rem) calc((100vw - ${WRAP_GUTTER} - ${WRAP_GUTTER} - clamp(2rem, 5vw, 4rem)) / 2), calc(100vw - ${WRAP_GUTTER} - ${WRAP_GUTTER})`,
  recipeHero: "(min-width: 45rem) 20rem, calc(100vw - 2.5rem)",
  recipeHeroFan: "(min-width: 67.5rem) 14.5rem, (min-width: 45rem) 11.25rem, 1px",
  recipeLandingCover: "(min-width: 45rem) 28rem, min(22rem, calc(100vw - 2.5rem))",
  recipeLandingSpread: "(min-width: 24rem) 24rem, calc(100vw - 2.5rem)",
});

/** The illustrative frame for a specialty. Falls back to the shared branded
    placeholder so no card is ever image-less; a generated frame replaces it
    automatically the moment it lands on disk. */
// Preference order: a real photograph of the clinic, then the specialty's own
// generated brand artwork, and only then the shared plate. The middle step
// matters - before it existed, five specialties shared one identical frame.
export const specialtyImage = (slug) =>
  imageIfExists(`assets/img/specialties/${slug}.webp`) ||
  imageIfExists(`assets/img/specialties/${slug}-art.webp`) ||
  imageIfExists("assets/img/specialties/_placeholder.webp");

// Brand artwork is still not a photograph of the clinic, so it stays flagged
// as illustrative for the dashboard and the requirements sheet.
export const bannerImage = (name) =>
  imageIfExists(`assets/img/banners/${name}.webp`);

/** True when the frame being shown is the shared placeholder, not artwork
    made for this specialty. Templates use it to avoid implying otherwise. */
export const specialtyImageIsPlaceholder = (slug) =>
  !imageIfExists(`assets/img/specialties/${slug}.webp`);

/* ---- lookups ------------------------------------------------------------- */
export const bySlug = (arr, slug) => arr.find((x) => x.slug === slug);
export const published = (arr) => arr.filter((x) => x.published !== false);

export function doctorsIn(doctors, specialtySlug) {
  return published(doctors).filter((d) => (d.specialties || []).includes(specialtySlug));
}

export function reviewsFor(reviews, key) {
  return (reviews.reviews || []).filter(
    (r) => r.published !== false && (!key || key === "all" || (r.specialties || []).includes(key))
  );
}

/** The branded aerial render used on branch cards (home page and branches hub).
    `cardImage` in branches.json points at it; the build only uses it once the
    file actually exists, so a branch without a render falls back to its photos. */
export function branchCardImage(b) {
  return (b && b.cardImage && imageIfExists(b.cardImage)) || null;
}
