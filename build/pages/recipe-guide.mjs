/* ==========================================================================
   The free 60-recipe guide, rebuilt in the clinic's own design

   The published guide at laroseclinics.com/RecipeGuide is a separate one-page
   document that does not look like the rest of the site. This rebuilds it from
   content/recipe-guide.json - parsed from that page, so every recipe, quantity,
   step, tip and macro is the original wording, not a rewrite - using the site's
   own tokens and components.

   It is ONE bilingual page rather than an /ar and /en pair, because that is
   what the published guide is and what the circulated link points at. The
   language toggle hides one side with CSS, so both languages are in the markup
   and the page works with no script at all.
   ========================================================================== */

import { t, esc, map, when, imageIfExists } from "../lib/util.mjs";
import { trackingHead } from "../lib/shell.mjs";

/* The free guide lives two levels below the site root. */
const A = (p) => `../../${p}`;

/* Selling copy for /RecipeGuide/. Keep this separate from the free 60-recipe
   manuscript: the free guide content is deliberately not rewritten here. */
const LANDING_PRODUCT_COPY = {
  inside: [
    { ar: "٢٥٠ وصفة مصرية مقسّمة على الفطار والغدا والعشا والسناكس", en: "250 Egyptian recipes across breakfast, lunch, dinner and snacks" },
    { ar: "السعرات والماكروز محسوبة لكل وصفة", en: "Calories and macros worked out for every recipe" },
    { ar: "كل وصفة ليها فيديو مخصوص يورّيك بتتعمل إزاي", en: "Every recipe has its own video showing you how to make it" },
    { ar: "مكونات موجودة في أي سوبر ماركت، مش مكونات مستوردة", en: "Ingredients from any supermarket, nothing imported" },
    { ar: "بدائل لكل وصفة لو مكوّن مش متوفر", en: "A substitution for each recipe when an ingredient is unavailable" },
    { ar: "أفكار تحضير مسبق للأسبوع", en: "Batch-preparation ideas for the week" },
    { ar: "نسخة PDF تشتغل على الموبايل واللاب", en: "A PDF that works on both phone and laptop" },
  ],
  audience: [
    { ar: "اللي ماشي على خطة من العيادة وعايز أفكار جاهزة بدل حيرة «آكل إيه النهاردة؟»", en: "Anyone following a clinic plan who wants ready ideas instead of wondering what to eat today" },
    { ar: "اللي بيطبخ للبيت كله وعايز أكلة واحدة تنفع على السفرة بدل ما يعمل وجبتين", en: "Anyone cooking for the whole household who wants one dish for the table instead of making two meals" },
    { ar: "اللي بيحسب سعراته وعايز الأرقام قدامه بدل ما يقدّر كل طبق بالنظر", en: "Anyone counting calories who wants the numbers in front of them instead of estimating every plate by eye" },
    { ar: "اللي زهق من تكرار نفس الوجبات وعايز اختيارات للفطار والغدا والعشا والسناكس", en: "Anyone tired of repeating the same meals who wants choices for breakfast, lunch, dinner and snacks" },
    { ar: "اللي بيتمرّن أو بيروح الجيم وعايز ينوّع مصادر البروتين ويعرف بروتين كل وصفة من غير تخمين", en: "Anyone who trains or goes to the gym and wants varied protein options with the protein in each recipe already shown" },
    { ar: "اللي عايز يدخل اختيارات صحية أكتر في يومه، حتى لو مش ماشي على خطة من العيادة", en: "Anyone building a healthier daily routine, even without following a clinic plan" },
  ],
  faq: [
    {
      q: { ar: "الكتاب ده بديل عن الكشف؟", en: "Is the book a substitute for a consultation?" },
      a: { ar: "لأ. الكتاب وصفات لأكل البيت، مش خطة علاج ولا بديل عن كشف أو خطة معمولة لحالتك.", en: "No. The book contains home-cooking recipes; it is not a treatment plan or a substitute for a consultation or a plan made for your needs." },
    },
    {
      q: { ar: "أستلم الكتاب إزاي؟", en: "How do I receive the book?" },
      a: { ar: "كلّمنا على واتساب، وبعد تأكيد الطلب هنبعت لك الكتاب كملف PDF ومعاه لينك سريع تفتحه بسهولة من الموبايل.", en: "Message us on WhatsApp. Once the order is confirmed, we will send the book as a PDF and a quick link for easy access on your phone." },
    },
    {
      q: { ar: "ينفع أستخدمه لو عندي حالة صحية؟", en: "Can I use it if I have a medical condition?" },
      a: { ar: "الكتاب وصفات أكل بيت، مش خطة علاج. لو بتتابع مع دكتور أو أخصائي، التزم بتعليماته واختار من الكتاب اللي يناسب خطتك.", en: "The book is a collection of home-cooking recipes, not a treatment plan. If you are under a doctor or dietitian's care, follow their guidance and choose recipes that fit your own plan." },
    },
    {
      q: { ar: "السعرات والماكروز دقيقة؟ اتحسبت إزاي؟", en: "Are the calories and macros accurate, and how were they calculated?" },
      a: { ar: "السعرات والماكروز محسوبة على المقادير المكتوبة لكل وصفة. لو غيّرت الكمية أو نوع منتج، الأرقام ممكن تختلف، فاعتبرها مرجع للوصفة زي ما هي مكتوبة.", en: "The calories and macros are calculated from the quantities written for each recipe. Changing a quantity or product can change the numbers, so use them as a reference for the recipe as written." },
    },
    {
      q: { ar: "هحتاج مكونات أو أدوات خاصة؟", en: "Will I need special ingredients or equipment?" },
      a: { ar: "المكونات من حاجات موجودة في السوبر ماركت، ومفيش اعتماد على مكونات مستوردة. بص على طريقة الوصفة قبل ما تبدأ عشان تجهّز الأدوات اللي هتستخدمها.", en: "The ingredients are available from ordinary supermarkets, without relying on imported items. Check the method before you start so you can prepare the equipment used in that recipe." },
    },
    {
      q: { ar: "ينفع لو أنا نباتي أو مش باكل أكلات معينة؟", en: "Can I use it if I am vegetarian or avoid certain foods?" },
      a: { ar: "فيه وصفات وبدائل متنوعة، لكن مش كل وصفة هتناسب كل اختيار غذائي. راجع المكونات واختار اللي يناسبك، ولو بتستبعد أكل بتعليمات طبية امشِ على كلام دكتورك.", en: "There is a variety of recipes and substitutions, but not every recipe will suit every dietary choice. Check the ingredients and choose what works for you; if you avoid foods on medical advice, follow your doctor's guidance." },
    },
    {
      q: { ar: "الكتاب طلب مرة واحدة ولا اشتراك؟", en: "Is this a one-time purchase or a subscription?" },
      a: { ar: "الكتاب طلب مرة واحدة، مش اشتراك شهري. تفاصيل الطلب والدفع بيأكدها لك الفريق على واتساب.", en: "The book is a one-time purchase, not a monthly subscription. The team will confirm the ordering and payment details on WhatsApp." },
    },
    {
      q: { ar: "ينفع أطبخ منه للبيت كله؟", en: "Can I use it to cook for the whole family?" },
      a: { ar: "آه، الوصفات معمولة من أكل البيت وتقدر تحضّرها للأسرة. اختار الكمية المناسبة لعددكم، وكل شخص يمشي على أي تعليمات خاصة بيه.", en: "Yes. The recipes are based on home cooking and can be prepared for the family. Choose a quantity that suits your household, while each person follows any guidance specific to them." },
    },
    {
      q: { ar: "فعلاً فيه فيديو لكل وصفة؟", en: "Is there really a video for every recipe?" },
      a: { ar: "آه. كل وصفة ليها فيديو مخصوص يورّيك خطواتها وهي بتتعمل.", en: "Yes. Every recipe has its own video showing each step as it is made." },
    },
  ],
};

const COPY = {
  eyebrow: { ar: "هدية من عيادات لاروز", en: "A gift from La Rose Clinics" },
  title: { ar: "كتاب الوصفات", en: "The Recipe Guide" },
  lede: {
    ar: "٦٠ وصفة من أكل البيت، بالسعرات والماكروز، عشان تعرف بالظبط إنت بتاكل إيه من غير ما تحرم نفسك.",
    en: "Sixty everyday recipes with the calories and macros worked out, so you know what you are eating without giving up the food you like.",
  },
  contents: { ar: "المحتويات", en: "Contents" },
  searchLabel: { ar: "دوّر في الوصفات", en: "Search recipes" },
  searchPlaceholder: { ar: "دوّر بالاسم أو المكوّن", en: "Search by name or ingredient" },
  clearSearch: { ar: "امسح البحث", en: "Clear search" },
  noResults: { ar: "مفيش وصفات مطابقة لبحثك.", en: "No recipes match your search." },
  ingredients: { ar: "المقادير", en: "Ingredients" },
  method: { ar: "الطريقة", en: "Method" },
  toTop: { ar: "لأول الصفحة", en: "Back to top" },
  ctaTitle: {
    ar: "بطّل تخمين. خد خطة مبنية على أرقامك إنت.",
    en: "Stop guessing. Get a plan built on your numbers.",
  },
  ctaText: {
    ar: "الوصفات دي بداية كويسة، بس الخطة اللي بتنفع فعلاً بتتبني على تحاليلك وتركيب جسمك وحياتك إنت.",
    en: "These recipes are a good start, but the plan that actually works is built on your own tests, your body composition and your life.",
  },
  book: { ar: "احجز كشف", en: "Book a consultation" },
  whatsapp: { ar: "كلّمنا على واتساب", en: "Message us on WhatsApp" },
  site: { ar: "زور الموقع", en: "Visit the website" },
  watch: { ar: "شوف الوصفات بالفيديو", en: "Watch the recipes on video" },
  langToggle: { ar: "English", en: "العربية" },
};

/* The macro strip. Keys come from the source guide, so they are matched rather
   than assumed, and anything unrecognised is still shown. */
const META_LABELS = {
  Serves: { ar: "يكفي", en: "Serves" },
  Prep: { ar: "تحضير", en: "Prep" },
  Cook: { ar: "طهي", en: "Cook" },
  Calories: { ar: "سعرات", en: "Calories" },
  Protein: { ar: "بروتين", en: "Protein" },
  Carbs: { ar: "كارب", en: "Carbs" },
  Fat: { ar: "دهون", en: "Fat" },
  Level: { ar: "المستوى", en: "Level" },
};

/* A value like "12 min" or "535 kcal" is part number, part unit. The number is
   Latin in both languages, so it is isolated to keep it readable in RTL. */
const LEVELS = { Easy: "سهل", Medium: "متوسط", Moderate: "متوسط", Hard: "متقدم", Advanced: "متقدم" };

function metaValue(v) {
  const raw = String(v || "");
  const m = raw.match(/^([\d./]+)\s*(.*)$/);
  if (!m) {
    /* A word, not a quantity - the difficulty level. */
    const ar = LEVELS[raw] || raw;
    return `<span class="rg-meta__v">${bi({ en: raw, ar })}</span>`;
  }
  /* Number and unit are one left-to-right quantity, so they are isolated
     together: isolating only the digits drops the unit on the wrong side in
     RTL and "23 g" renders as "g 23". */
  return `<span class="rg-meta__v"><bdi class="num">${esc(m[1])}${m[2] ? `<small> ${esc(m[2])}</small>` : ""}</bdi></span>`;
}

/* "12 min" -> "PT12M". Schema.org wants ISO 8601 durations; a zero cook time
   is omitted rather than published as PT0M, which would read as a claim. */
function isoDuration(v) {
  const m = String(v || "").match(/^(\d+)\s*min/i);
  if (!m || Number(m[1]) === 0) return undefined;
  return `PT${m[1]}M`;
}

function bi(pair, cls = "") {
  return `<span class="rg-en ${cls}">${esc(pair.en || "")}</span><span class="rg-ar ${cls}">${esc(pair.ar || pair.en || "")}</span>`;
}

function recipeSearchText(r) {
  const pairs = [r.title, r.subtitle, r.blurb, ...(r.ingredients || [])];
  return pairs
    .flatMap((pair) => [pair?.en, pair?.ar])
    .concat(r.tags?.en || [], r.tags?.ar || [])
    .filter(Boolean)
    .join(" ");
}

function recipeCard(r, s) {
  const meta = Object.entries(r.meta || {});
  const playlist = s.social?.youtubeRecipes || s.social?.youtube;
  return `
<article class="rg-card" id="${esc(r.id)}" data-rg-recipe data-rg-search-text="${esc(recipeSearchText(r))}">
  <div class="rg-card__media">
    <img src="${A(`assets/img/recipe-guide/${esc(r.imageFile)}`)}" alt="${esc(r.title.en)}" width="1100" height="825" loading="lazy" decoding="async">
  </div>
  <div class="rg-card__body">
    <p class="rg-card__num"><bdi class="num">${esc(r.number)}</bdi></p>
    <h3 class="rg-card__title">${bi(r.title)}</h3>
    ${when(r.subtitle.en || r.subtitle.ar, `<p class="rg-card__sub">${bi(r.subtitle)}</p>`)}

    ${when(meta.length, `<ul class="rg-meta">
      ${map(meta, ([k, v]) => `<li class="rg-meta__i">
        <span class="rg-meta__k">${bi(META_LABELS[k] || { ar: k, en: k })}</span>
        ${metaValue(v)}
      </li>`)}
    </ul>`)}

    ${when(r.blurb.en || r.blurb.ar, `<p class="rg-card__blurb">${bi(r.blurb)}</p>`)}

    <div class="rg-cols">
      ${when(r.ingredients.length, `<div>
        <h4 class="rg-lab">${bi(COPY.ingredients)}</h4>
        <ul class="rg-ing">
          ${map(r.ingredients, (i) => `<li>
            <span class="rg-q"><bdi class="num">${esc(i.qty)}</bdi></span>
            <span class="rg-n">${bi({ ar: i.ar, en: i.en })}</span>
          </li>`)}
        </ul>
      </div>`)}

      ${when(r.steps.length, `<div>
        <h4 class="rg-lab">${bi(COPY.method)}</h4>
        <ol class="rg-steps">
          ${map(r.steps, (s) => `<li>${bi({ ar: s.ar, en: s.en })}</li>`)}
        </ol>
      </div>`)}
    </div>

    ${when(r.notes.length, `<div class="rg-notes">
      ${map(r.notes, (n) => `<div class="rg-note">
        <p class="rg-note__h">${bi(n.label && n.label.en ? n.label : { ar: "", en: "" })}</p>
        <p>${bi({ ar: n.ar, en: n.en })}</p>
      </div>`)}
    </div>`)}

    ${when((r.tags.en || []).length, `<p class="rg-tags">
      ${map(r.tags.en, (tg, i) => `<span class="rg-tag">${bi({ en: tg, ar: (r.tags.ar || [])[i] || tg })}</span>`)}
    </p>`)}

    ${when(playlist, `<p class="rg-watch">
      <a class="rg-watch__btn" href="${esc(playlist)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3Z"/></svg>
        ${bi(COPY.watch)}
      </a>
    </p>`)}
  </div>
</article>`;
}

function ctaBand(c) {
  const s = c.site;
  return `
<section class="rg-cta">
  <div class="rg-wrap">
    <h2 class="rg-cta__title">${bi(COPY.ctaTitle)}</h2>
    <p class="rg-cta__text">${bi(COPY.ctaText)}</p>
    <p class="rg-cta__actions">
      <a class="rg-btn rg-btn--primary" href="https://${esc(s.brand.domain)}/ar/patients/booking">${bi(COPY.book)}</a>
      <a class="rg-btn" href="${esc(s.contact.whatsapp.href)}" target="_blank" rel="noopener">${bi(COPY.whatsapp)}</a>
    </p>
  </div>
</section>`;
}

export function pages({ c, locale }) {
  /* One bilingual page, so it is emitted once rather than per locale. */
  if (locale !== "ar") return [];

  const g = c.recipeGuide;
  if (!g || !(g.recipes || []).length) return [];

  const s = c.site;
  const productRecord = (c.digital?.products || []).find((item) => item.slug === "recipe-book");
  if (!productRecord) return [];
  const product = { ...productRecord, ...LANDING_PRODUCT_COPY };
  const recipes = g.recipes.map((r) => ({
    ...r,
    imageFile: (r.image || "").split("/").pop(),
  }));
  const cats = g.categories || [];
  const byCat = cats.map((cat) => ({
    ...cat,
    items: recipes.filter((r) => r.number.split(".")[0] === cat.key),
  })).filter((cat) => cat.items.length);

  const title = "كتاب وصفات لاروز | The La Rose Recipe Guide";
  const desc = "٦٠ وصفة من أكل البيت بالسعرات والماكروز، هدية من عيادات لاروز. Sixty everyday recipes with calories and macros, free from La Rose Clinics.";
  const canonical = `https://${s.brand.domain}/RecipeGuide/free/`;

  const cover = imageIfExists("assets/img/digital/recipe-book-cover.webp") || "assets/img/digital/recipe-book.webp";
  const freeHtml = `<!doctype html>
<html lang="ar" dir="rtl" class="rg lg-ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" hreflang="ar" href="${esc(canonical)}">
<link rel="alternate" hreflang="en" href="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
${trackingHead(c)}
<link rel="icon" href="${A("assets/img/logo/favicon.svg")}" type="image/svg+xml">
<link rel="stylesheet" href="${A("assets/css/tokens.css")}">
<link rel="stylesheet" href="${A("assets/css/base.css")}">
<link rel="stylesheet" href="${A("assets/css/components.css")}">
<link rel="stylesheet" href="${A("assets/css/layout.css")}">
<link rel="stylesheet" href="${A("assets/css/recipe-guide.css")}">
${/* Recipe structured data. Worth doing properly here: a recipe with its
      ingredients, steps and nutrition is one of the few things Google shows
      rich results for, and every field below is real data from the guide
      rather than a guess. English is used for the machine-readable copy
      because the schema vocabulary is English and the values are unit-bearing. */""}
<script type="application/ld+json">
${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [{
    "@type": "ItemList",
    name: "The La Rose Recipe Guide",
    numberOfItems: recipes.length,
    itemListElement: recipes.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Recipe",
        name: r.title.en,
        description: r.blurb.en || r.subtitle.en || undefined,
        image: `https://${s.brand.domain}/assets/img/recipe-guide/${r.imageFile}`,
        recipeYield: r.meta.Serves || undefined,
        prepTime: isoDuration(r.meta.Prep),
        cookTime: isoDuration(r.meta.Cook),
        recipeIngredient: r.ingredients.map((x) => [x.qty, x.en].filter(Boolean).join(" ")),
        recipeInstructions: r.steps.map((x) => ({ "@type": "HowToStep", text: x.en })),
        nutrition: {
          "@type": "NutritionInformation",
          calories: r.meta.Calories || undefined,
          proteinContent: r.meta.Protein || undefined,
          carbohydrateContent: r.meta.Carbs || undefined,
          fatContent: r.meta.Fat || undefined,
        },
        keywords: (r.tags.en || []).join(", ") || undefined,
        author: { "@type": "Organization", name: t(s.brand.name, "en") },
      },
    })),
    }],
  }, null, 1)}
</script>
</head>
<body>
<a class="skip-link" href="#rg-main">${esc(t(s.ui.skipToContent, "ar"))}</a>

<header class="rg-head">
  <div class="rg-wrap rg-head__inner">
    <a class="rg-brand" href="https://${esc(s.brand.domain)}/">
      <img src="${A("assets/img/logo/larose-wordmark.png")}" alt="${esc(t(s.brand.name, "ar"))}" width="120" height="104">
    </a>
    <a class="rg-back" href="../">${bi({ ar: "الكتاب الكامل", en: "Full recipe book" })}</a>
    <div class="rg-search" role="search" data-rg-search hidden>
      <label class="visually-hidden" for="rg-search-input">${bi(COPY.searchLabel)}</label>
      <input class="rg-search__input" id="rg-search-input" type="search" autocomplete="off"
        placeholder="${esc(COPY.searchPlaceholder.ar)}"
        data-rg-search-input
        data-rg-placeholder-ar="${esc(COPY.searchPlaceholder.ar)}"
        data-rg-placeholder-en="${esc(COPY.searchPlaceholder.en)}">
      <button class="rg-search__clear" type="button" aria-label="${esc(COPY.clearSearch.ar)}"
        data-rg-search-clear
        data-rg-label-ar="${esc(COPY.clearSearch.ar)}"
        data-rg-label-en="${esc(COPY.clearSearch.en)}" hidden>
        <span aria-hidden="true">×</span>
      </button>
      <p class="rg-search__count" aria-live="polite" aria-atomic="true" data-rg-search-count>
        <span class="rg-en" data-rg-count-en>${esc(String(recipes.length))} recipes</span>
        <span class="rg-ar" data-rg-count-ar>${esc(recipes.length.toLocaleString("ar-EG-u-nu-arab"))} وصفة</span>
      </p>
    </div>
    <button class="rg-lang" type="button" data-rg-lang aria-live="polite">
      <span class="rg-en">العربية</span><span class="rg-ar">English</span>
    </button>
  </div>
</header>

<main id="rg-main">
  <section class="rg-hero">
    <div class="rg-wrap rg-hero__grid">
      <div>
        <p class="rg-hero__eyebrow">${bi(COPY.eyebrow)}</p>
        <h1 class="rg-hero__title">${bi(COPY.title)}</h1>
        <p class="rg-hero__lede">${bi(COPY.lede)}</p>
      </div>
      <img class="rg-hero__cover" src="${A(cover)}" alt="${esc(t(COPY.title, "en"))}" width="700" height="1050" decoding="async">
    </div>
  </section>

  <nav class="rg-toc" aria-label="${esc(t(COPY.contents, "ar"))}" data-rg-toc>
    <div class="rg-wrap">
      <h2 class="rg-toc__title">${bi(COPY.contents)}</h2>
      <ol class="rg-toc__list">
        ${map(byCat, (cat) => `<li data-rg-toc-category="${esc(cat.key)}">
          <a href="#cat-${esc(cat.key)}">
            ${bi(cat.name)}
            <span class="rg-toc__n"><bdi class="num" data-rg-toc-count>${esc(String(cat.items.length))}</bdi></span>
          </a>
        </li>`)}
      </ol>
    </div>
  </nav>

  <p class="rg-no-results rg-wrap" data-rg-no-results hidden>${bi(COPY.noResults)}</p>

  ${map(byCat, (cat, i) => `
  <section class="rg-cat" id="cat-${esc(cat.key)}" data-rg-category="${esc(cat.key)}">
    <div class="rg-wrap">
      <h2 class="rg-cat__title">${bi(cat.name)}</h2>
    </div>
    <div class="rg-wrap rg-list">
      ${map(cat.items, (r) => recipeCard(r, s))}
    </div>
  </section>
  ${i === 2 || i === 5 ? ctaBand(c) : ""}`)}

  ${ctaBand(c)}
</main>

<footer class="rg-foot">
  <div class="rg-wrap">
    <p><a href="https://${esc(s.brand.domain)}/">${esc(t(s.brand.name, "ar"))}</a></p>
    <p class="rg-foot__meta">
      <a href="tel:${esc(s.contact.phone.tel)}"><bdi class="num">${esc(s.contact.phone.display)}</bdi></a>
      · <a href="${esc(s.contact.whatsapp.href)}" target="_blank" rel="noopener">WhatsApp</a>
      · <a href="https://${esc(s.brand.domain)}/ar/">${bi(COPY.site)}</a>
    </p>
  </div>
</footer>

<script src="${A("assets/js/track.js")}" defer></script>
<script>
/* The toggle only swaps a class and the direction; both languages are already
   in the markup, so the page reads correctly with this script blocked. */
(function () {
  var root = document.documentElement;
  var btn = document.querySelector("[data-rg-lang]");
  var input = document.querySelector("[data-rg-search-input]");
  var clear = document.querySelector("[data-rg-search-clear]");
  if (!btn) return;
  function apply(lang) {
    root.classList.toggle("lg-ar", lang === "ar");
    root.classList.toggle("lg-en", lang === "en");
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    if (input) input.setAttribute("placeholder", input.getAttribute("data-rg-placeholder-" + lang));
    if (clear) clear.setAttribute("aria-label", clear.getAttribute("data-rg-label-" + lang));
    try { localStorage.setItem("lrRecipeLang", lang); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem("lrRecipeLang"); } catch (e) {}
  if (saved === "en" || saved === "ar") apply(saved);
  btn.addEventListener("click", function () {
    apply(root.classList.contains("lg-ar") ? "en" : "ar");
  });
})();

/* Search is revealed only after its behaviour is ready. Every card's search
   text contains both languages, regardless of the language currently shown. */
(function () {
  var search = document.querySelector("[data-rg-search]");
  var input = document.querySelector("[data-rg-search-input]");
  var clear = document.querySelector("[data-rg-search-clear]");
  var countEn = document.querySelector("[data-rg-count-en]");
  var countAr = document.querySelector("[data-rg-count-ar]");
  var toc = document.querySelector("[data-rg-toc]");
  var noResults = document.querySelector("[data-rg-no-results]");
  if (!search || !input || !clear || !countEn || !countAr || !toc || !noResults) return;

  function normalise(value) {
    return String(value || "")
      .normalize("NFC")
      .toLowerCase()
      .replace(/[\u064B-\u0652]/g, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/\s+/g, " ")
      .trim();
  }

  function arabicNumber(value) {
    return String(value).replace(/\d/g, function (digit) {
      return "٠١٢٣٤٥٦٧٨٩"[Number(digit)];
    });
  }

  var tocItems = {};
  Array.prototype.forEach.call(document.querySelectorAll("[data-rg-toc-category]"), function (item) {
    tocItems[item.getAttribute("data-rg-toc-category")] = item;
  });

  var categories = Array.prototype.map.call(document.querySelectorAll("[data-rg-category]"), function (category) {
    return {
      element: category,
      tocItem: tocItems[category.getAttribute("data-rg-category")],
      cards: Array.prototype.map.call(category.querySelectorAll("[data-rg-recipe]"), function (card) {
        return { element: card, text: normalise(card.getAttribute("data-rg-search-text")) };
      }),
    };
  });

  function updateCount(count) {
    countEn.textContent = count === 1 ? "1 recipe" : count + " recipes";
    countAr.textContent = count === 1 ? "وصفة واحدة" : arabicNumber(count) + " وصفة";
  }

  function filterRecipes() {
    var query = normalise(input.value);
    var total = 0;
    categories.forEach(function (category) {
      var categoryTotal = 0;
      category.cards.forEach(function (card) {
        var matches = !query || card.text.indexOf(query) !== -1;
        card.element.hidden = !matches;
        if (matches) categoryTotal += 1;
      });
      category.element.hidden = categoryTotal === 0;
      if (category.tocItem) {
        category.tocItem.hidden = categoryTotal === 0;
        var tocCount = category.tocItem.querySelector("[data-rg-toc-count]");
        if (tocCount) tocCount.textContent = categoryTotal;
      }
      total += categoryTotal;
    });
    clear.hidden = input.value.length === 0;
    toc.hidden = total === 0;
    noResults.hidden = total !== 0;
    updateCount(total);
  }

  input.addEventListener("input", filterRecipes);
  clear.addEventListener("click", function () {
    input.value = "";
    filterRecipes();
    input.focus();
  });
  search.hidden = false;
  filterRecipes();
})();
</script>
</body>
</html>`;

  const orderText = encodeURIComponent("أهلاً، عايز أطلب كتاب وصفات لاروز");
  const whatsapp = `${s.contact.whatsapp.href}&text=${orderText}`;
  const list = (items) => `<ul class="rg-landing__list">${map(items || [], (item) => `<li>${bi(item)}</li>`)}</ul>`;
  const landingTitle = `${t(product.name, "ar")} | ${t(product.name, "en")}`;
  const landingDesc = `${t(product.short, "ar")} · ${t(product.short, "en")}`;
  const landingCanonical = `https://${s.brand.domain}/RecipeGuide/`;
  const landingHtml = `<!doctype html>
<html lang="ar" dir="rtl" class="rg lg-ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(landingTitle)}</title>
<meta name="description" content="${esc(landingDesc)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${landingCanonical}">
<link rel="alternate" hreflang="ar" href="${landingCanonical}">
<link rel="alternate" hreflang="en" href="${landingCanonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(landingTitle)}">
<meta property="og:description" content="${esc(landingDesc)}">
<meta property="og:url" content="${landingCanonical}">
<meta property="og:image" content="https://${s.brand.domain}/${esc(cover)}">
${trackingHead(c)}
<link rel="icon" href="../assets/img/logo/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="../assets/css/tokens.css">
<link rel="stylesheet" href="../assets/css/base.css">
<link rel="stylesheet" href="../assets/css/components.css">
<link rel="stylesheet" href="../assets/css/layout.css">
<link rel="stylesheet" href="../assets/css/recipe-guide.css">
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@graph": [{ "@type": "Book",
    name: t(product.name, "en"), description: t(product.lede, "en"),
    image: `https://${s.brand.domain}/${cover}`,
    bookFormat: "https://schema.org/EBook",
    inLanguage: ["ar", "en"],
    numberOfPages: undefined,
    publisher: { "@type": "Organization", name: t(s.brand.name, "en"), url: `https://${s.brand.domain}/` },
    author: { "@type": "Organization", name: t(s.brand.name, "en") },
    url: `https://${s.brand.domain}/RecipeGuide/`
  }] })}</script>
</head>
<body>
<header class="rg-head"><div class="rg-wrap rg-head__inner">
  <a class="rg-brand" href="https://${s.brand.domain}/"><img src="../assets/img/logo/larose-wordmark.png" alt="${esc(t(s.brand.name, "ar"))}" width="120" height="104"></a>
  <button class="rg-lang" type="button" data-rg-lang><span class="rg-en">العربية</span><span class="rg-ar">English</span></button>
</div></header>
<main id="rg-main" class="rg-landing">
  <section class="rg-landing__hero"><div class="rg-wrap rg-landing__hero-grid">
    <div><p class="rg-hero__eyebrow">${bi({ ar: "كتاب لاروز الرقمي", en: "La Rose digital recipe book" })}</p><h1 class="rg-hero__title">${bi(product.name)}</h1><p class="rg-hero__count"><bdi class="num">250</bdi> ${bi({ ar: "وصفة مصرية بالسعرات والماكروز", en: "Egyptian recipes with calories and macros" })}</p><p class="rg-hero__lede">${bi(product.lede)}</p>
    <p class="rg-cta__actions"><a class="rg-btn rg-btn--primary" href="${esc(whatsapp)}" target="_blank" rel="noopener">${bi(product.cta)}</a><a class="rg-btn rg-btn--dark" href="free/" data-track="recipe-guide">${bi(product.freeSample.label)}</a></p></div>
    <img class="rg-landing__cover" src="../${esc(cover)}" alt="${esc(t(product.name, "en"))}" width="700" height="875">
  </div></section>
  <section class="rg-landing__section"><div class="rg-wrap rg-landing__inside"><div><h2>${bi({ ar: "إيه اللي جوه الكتاب؟", en: "What is inside?" })}</h2>${list(product.inside)}</div><figure class="rg-landing__spread"><img src="../assets/img/digital/recipe-book.webp" alt="${esc(t({ ar: "صفحتان من داخل كتاب وصفات لاروز", en: "Two pages from inside the La Rose recipe book" }, "en"))}" width="600" height="750" loading="lazy" decoding="async"><figcaption>${bi({ ar: "لقطة من داخل الكتاب الكامل", en: "A look inside the full book" })}</figcaption></figure></div></section>
  <section class="rg-landing__section rg-landing__section--tint"><div class="rg-wrap"><h2>${bi({ ar: "الكتاب مناسب لمين؟", en: "Who is it for?" })}</h2>${list(product.audience)}</div></section>
  <section class="rg-landing__section"><div class="rg-wrap"><h2>${bi({ ar: "إزاي تطلبه؟", en: "How to order" })}</h2>${list([{ar:"ابعت لنا على واتساب",en:"Message us on WhatsApp"},{ar:"الفريق هيأكد معاك الطلب",en:"The team confirms your order"},{ar:"بنبعت لك الكتاب PDF ومعاه لينك سريع تفتحه بسهولة من الموبايل",en:"We send the book as a PDF and a quick link for easy access on your phone"}])}<p class="rg-cta__actions"><a class="rg-btn rg-btn--primary" href="${esc(whatsapp)}" target="_blank" rel="noopener">${bi(product.cta)}</a></p></div></section>
  <section class="rg-landing__section rg-landing__section--tint"><div class="rg-wrap"><h2>${bi({ ar: "أسئلة متكررة", en: "Frequently asked questions" })}</h2><div class="rg-landing__faq">${map(product.faq || [], (item) => `<details><summary>${bi(item.q)}</summary><p>${bi(item.a)}</p></details>`)}</div></div></section>
  <section class="rg-cta"><div class="rg-wrap"><h2 class="rg-cta__title">${bi(product.freeSample.label)}</h2><p class="rg-cta__text"><bdi class="num">60</bdi> ${bi({ ar: "وصفة من الكتاب الكامل، مجاناً وبدون تسجيل", en: "recipes from the full book, free and with no sign-up" })} · ${bi(product.freeSample.text)}</p><p class="rg-cta__actions"><a class="rg-btn rg-btn--primary" href="free/" data-track="recipe-guide">${bi(product.freeSample.label)}</a></p></div></section>
</main>
<footer class="rg-foot"><div class="rg-wrap"><p><a href="https://${s.brand.domain}/">${esc(t(s.brand.name,"ar"))}</a></p><p class="rg-foot__meta"><a href="tel:${esc(s.contact.phone.tel)}"><bdi class="num">${esc(s.contact.phone.display)}</bdi></a> · <a href="${esc(s.contact.whatsapp.href)}">WhatsApp</a></p></div></footer>
<script src="../assets/js/track.js" defer></script>
<script>(function(){var r=document.documentElement,b=document.querySelector('[data-rg-lang]');if(!b)return;b.addEventListener('click',function(){var en=r.classList.toggle('lg-en');r.classList.toggle('lg-ar',!en);r.lang=en?'en':'ar';r.dir=en?'ltr':'rtl'})})();</script>
</body></html>`;

  return [
    { path: "RecipeGuide/index.html", html: landingHtml },
    { path: "RecipeGuide/free/index.html", html: freeHtml },
  ];
}
