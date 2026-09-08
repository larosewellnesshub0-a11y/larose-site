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

import { t, esc, map, when } from "../lib/util.mjs";

/* This page lives at recipe-guide/index.html, one level down. */
const A = (p) => `../${p}`;

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
      <a class="rg-btn rg-btn--primary" href="https://${esc(s.brand.domain)}/ar/patients/booking.html">${bi(COPY.book)}</a>
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
  const canonical = `https://${s.brand.domain}/RecipeGuide/`;

  const html = `<!doctype html>
<html lang="ar" dir="rtl" class="rg lg-ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
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
    <div class="rg-wrap">
      <p class="rg-hero__eyebrow">${bi(COPY.eyebrow)}</p>
      <h1 class="rg-hero__title">${bi(COPY.title)}</h1>
      <p class="rg-hero__lede">${bi(COPY.lede)}</p>
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

  /* The published address, already in circulation. Case matters. */
  return [{ path: "RecipeGuide/index.html", html }];
}
