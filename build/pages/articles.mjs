/* ========================================================================== 
   Knowledge Centre: hub, archives, FAQs and data-driven entry pages.
   ========================================================================== */

import {
  t, ta, esc, link, asset, icon, map, when, published, paras,
} from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import {
  sectionHead, crumbs, pageHero, faqList, faqSchema, ctaBand, shareBlock,
} from "../lib/components.mjs";

const COPY = {
  library: { ar: "المركز المعرفي", en: "Knowledge Centre" },
  heroTitle: {
    ar: "معلومة طبية تساعدك تفهم، مش تشخّص نفسك",
    en: "Medical knowledge to help you understand: not diagnose yourself",
  },
  heroText: {
    ar: "مقالات وتحديثات وإجابات من أطباء لاروز، مكتوبة ببساطة عشان تدخل الكشف وأنت فاهمة أسئلتك واختياراتك.",
    en: "Articles, updates and answers from La Rose doctors, written clearly so you can come to a consultation understanding your questions and options.",
  },
  featured: { ar: "اختيارنا ليك", en: "Featured for you" },
  latest: { ar: "أحدث المقالات", en: "Latest articles" },
  categories: { ar: "اختار الموضوع", en: "Browse by topic" },
  /* A table of contents on a medical article should read as one. "جوه
     الموضوع" is colloquial in a place where the reader is judging whether
     the writing is authoritative. */
  contents: { ar: "فهرس الموضوع", en: "On this page" },
  sources: { ar: "المصادر الطبية", en: "Medical sources" },
  reviewHeading: { ar: "كيف راجعنا المقال ده؟", en: "How this article was reviewed" },
  reviewIntro: {
    ar: "المحتوى ده للتثقيف الصحي، ومش بديل عن التشخيص أو الخطة الطبية الشخصية.",
    en: "This content is for health education and does not replace diagnosis or an individual care plan.",
  },
  publicationHistory: { ar: "سجل النشر والمراجعة", en: "Publication and review history" },
  published: { ar: "نُشر", en: "Published" },
  updated: { ar: "آخر تحديث", en: "Last updated" },
  author: { ar: "الكاتب المذكور في السجل", en: "Author listed in record" },
  medicalReviewer: { ar: "المراجع المذكور في السجل", en: "Reviewer listed in record" },
  reviewRecord: { ar: "سجل المراجعة", en: "Review record" },
  reviewRecorded: { ar: "يوجد مراجع مذكور في سجل النشر", en: "A reviewer is listed in the publication record" },
  noSeparateReviewer: { ar: "لا يوجد مراجع طبي منفصل مسجل للمحتوى ده", en: "No separate medical reviewer is recorded for this entry" },
  linkedSources: { ar: "مصادر طبية مرتبطة", en: "Linked medical sources" },
  standardsHeading: { ar: "معايير مراجعة محتوى المركز المعرفي", en: "How La Rose reviews Knowledge Centre content" },
  standardsText: {
    ar: "كل مادة منشورة بتوضح تاريخ النشر، والكاتب والمراجع المذكورين في السجل لو موجودين، والمصادر الطبية المرتبطة بها. تقدر تفتح سجل النشر والمراجعة داخل كل مادة لمعرفة البيانات المسجلة من غير ما نخمن تاريخ تحديث غير موثق.",
    en: "Every published entry identifies its publication date, listed author and reviewer where available, and linked medical sources. Each full entry includes a publication record so readers can see recorded information without us guessing an unrecorded update date.",
  },
  answerBy: { ar: "الإجابة من", en: "Answered by" },
  writtenBy: { ar: "كتبه", en: "Written by" },
  related: { ar: "محتوى ممكن يهمك", en: "You may also find helpful" },
  relatedCare: { ar: "تخصصات لها علاقة بالموضوع", en: "Related care" },
  moreTips: { ar: "نصايح الأيام اللي فاتت", en: "More daily tips" },
  faqs: { ar: "الأسئلة الشائعة", en: "Frequently asked questions" },
  general: { ar: "صحة عامة", en: "General health" },
  generalDesc: {
    ar: "موضوعات بتجمع أكتر من تخصص وتساعدك تشوف الصورة كاملة.",
    en: "Topics that bring several specialties together and help you see the whole picture.",
  },
  emptyTitle: { ar: "القسم ده لسه بيتجهّز", en: "This section is being prepared" },
  emptyText: {
    ar: "المحتوى المنشور هيظهر هنا تلقائياً أول ما يكون جاهز.",
    en: "Published content will appear here automatically as soon as it is ready.",
  },
  hubCards: {
    articles: {
      text: { ar: "شروحات كاملة للأسئلة الصحية اللي بتتكرر في الكشف.", en: "Full explainers for the health questions that often come up in consultations." },
      icon: "book",
      href: "articles/list.html",
    },
    updates: {
      text: { ar: "إيه الجديد في الإرشادات الطبية، وإيه معناه ليك كعميل.", en: "What is changing in medical guidance, and what it means for you as a patient." },
      icon: "sparkle",
      href: "articles/updates.html",
    },
    qa: {
      text: { ar: "أسئلة حقيقية وإجابات واضحة من أطباء العيادة.", en: "Real patient questions, answered clearly by the clinic's doctors." },
      icon: "user",
      href: "articles/qa.html",
    },
    tips: {
      text: { ar: "خطوة صغيرة ومحددة تقدر تجربها في يومك.", en: "One small, specific step you can try in your day." },
      icon: "leaf",
      href: "articles/tips.html",
    },
    faq: {
      text: { ar: "إجابات سريعة على أكتر أسئلة بتوصل لكل تخصص.", en: "Quick answers to the questions each specialty hears most often." },
      icon: "info",
      href: "articles/faq.html",
    },
    tools: {
      text: { ar: "حاسبات ومتابعات بسيطة تساعدك تفهم أرقامك.", en: "Simple calculators and trackers to help you understand your numbers." },
      icon: "activity",
      href: "tools/index.html",
    },
  },
};

const TYPE_ROUTES = {
  article: "articles/list.html",
  update: "articles/updates.html",
  qa: "articles/qa.html",
  tip: "articles/tips.html",
};

function entryType(entry) {
  const value = t(entry?.type, "en");
  return ["article", "update", "qa", "tip"].includes(value) ? value : "article";
}

function typeLabel(c, type, locale) {
  const keys = { article: "articles", update: "updates", qa: "qa", tip: "tips" };
  return t(c.site.ui[keys[type] || "articles"], locale);
}

function entrySlug(entry) {
  return t(entry?.slug, "en") || t(entry?.slug, "ar");
}

function entryTitle(entry, locale) {
  return t(entry?.title, locale) || typeLabelFallback(entryType(entry), locale);
}

function typeLabelFallback(type, locale) {
  return t({
    ar: type === "update" ? "مستجد علمي" : type === "qa" ? "سؤال للطبيب" : type === "tip" ? "نصيحة" : "مقال طبي",
    en: type === "update" ? "Scientific update" : type === "qa" ? "Ask the doctor" : type === "tip" ? "Daily tip" : "Medical article",
  }, locale);
}

function entryExcerpt(entry, locale) {
  return t(entry?.excerpt, locale) || t(entry?.summary, locale) || t(entry?.body, locale);
}

function entryCategorySlug(entry) {
  const value = entry?.category?.slug || entry?.category;
  return t(value, "en") || t(value, "ar");
}

function categorySlug(category) {
  return t(category?.slug, "en") || t(category?.slug, "ar");
}

function categoryName(category, locale) {
  return t(category?.name, locale) || categorySlug(category);
}

function categoryDesc(category, locale) {
  return t(category?.desc, locale) || t(category?.description, locale);
}

function entryDate(entry) {
  return t(entry?.date, "en") || t(entry?.publishedAt, "en") || t(entry?.datePublished, "en");
}

function entryUpdatedDate(entry) {
  return t(entry?.updatedAt, "en") || t(entry?.dateModified, "en");
}

function dateStamp(entry) {
  const stamp = Date.parse(entryDate(entry));
  return Number.isNaN(stamp) ? 0 : stamp;
}

function newest(entries) {
  return entries.slice().sort((a, b) => dateStamp(b) - dateStamp(a));
}

function formatDate(value, locale) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(date);
}

function entrySections(entry) {
  return ta(entry?.sections, "en");
}

function entryFaq(entry) {
  return ta(entry?.faq, "en");
}

function sectionTitle(section, locale) {
  return t(section?.heading, locale) || t(section?.title, locale);
}

function sectionBody(section, locale) {
  return t(section?.body, locale) || t(section?.text, locale);
}

/* Long-form entries may nominate a small number of relevant internal links.
   Keep the prose as plain text in content JSON and construct anchors here so
   a translated label cannot introduce markup into a published article. */
function sectionParas(section, locale) {
  const links = ta(section?.links, locale);
  const validUrl = (url) => /^(?:\.\.\/|https:\/\/laroseclinics\.com\/)/.test(url);
  return String(sectionBody(section, locale) || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => {
      let html = esc(paragraph);
      for (const item of links) {
        const label = t(item?.label, locale);
        const url = t(item?.url, locale) || t(item?.url, "en");
        if (!label || !url || !validUrl(url)) continue;
        const escapedLabel = esc(label);
        if (!html.includes(escapedLabel)) continue;
        html = html.replace(escapedLabel, `<a href="${esc(url)}">${escapedLabel}</a>`);
      }
      return `<p>${html}</p>`;
    })
    .join("\n");
}

function sectionId(section, index) {
  const supplied = t(section?.id, "en") || t(section?.slug, "en") || `section-${index + 1}`;
  const safe = supplied.trim().replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return safe || `section-${index + 1}`;
}

function libraryData(c) {
  const source = c.articles || [];
  const entries = Array.isArray(source)
    ? source
    : Array.isArray(source.articles) ? source.articles : [];
  const supplied = !Array.isArray(source) && Array.isArray(source.categories)
    ? source.categories
    : [];
  const categories = [];
  const seen = new Set();

  const add = (category) => {
    const slug = categorySlug(category);
    if (!slug || seen.has(slug)) return;
    seen.add(slug);
    categories.push(category);
  };

  supplied.forEach(add);
  published(c.specialties || []).forEach((sp) => add({
    slug: t(sp.slug, "en"),
    name: sp.name,
    desc: sp.sub || sp.intro,
    specialty: t(sp.slug, "en"),
  }));
  add({ slug: "general", name: COPY.general, desc: COPY.generalDesc, specialty: null });

  entries.forEach((entry) => {
    const slug = entryCategorySlug(entry);
    if (!slug || seen.has(slug)) return;
    add({
      slug,
      name: entry.categoryName || { ar: slug, en: slug },
      desc: entry.categoryDesc || { ar: "", en: "" },
      specialty: slug,
    });
  });

  return { entries, categories };
}

function categoryFor(categories, entry) {
  const slug = entryCategorySlug(entry);
  return categories.find((category) => categorySlug(category) === slug);
}

function doctorBySlug(c, slug) {
  return published(c.doctors || []).find((doctor) => t(doctor.slug, "en") === slug);
}

function entryDoctor(c, entry, field = "author") {
  const value = entry?.[field];
  const slug = typeof value === "string"
    ? t(value, "en")
    : t(value?.slug, "en");
  return slug ? doctorBySlug(c, slug) : null;
}

function entryAuthorName(entry, doctor, locale, field = "author") {
  if (doctor) return t(doctor.name, locale);
  const value = entry?.[field];
  return t(entry?.[`${field}Name`], locale) || t(value?.name, locale);
}

function categoryChips({ categories, locale, depth, active = "", includeAll = true, allLabel = "" }) {
  return `<nav class="cluster" aria-label="${esc(t(COPY.categories, locale))}">
    ${when(includeAll, `<a class="chip" href="${esc(link(depth, "articles/list.html"))}"${active ? "" : ' aria-current="page"'}>${esc(allLabel)}</a>`)}
    ${map(categories, (category) => {
      const slug = categorySlug(category);
      if (!slug) return "";
      return `<a class="chip" href="${esc(link(depth, `articles/category-${slug}.html`))}"${slug === active ? ' aria-current="page"' : ""}>${esc(categoryName(category, locale))}</a>`;
    })}
  </nav>`;
}

function sampleBadge(c, locale, item) {
  return when(item?.sample, `<span class="badge-sample" style="position:static">${esc(t(c.site.ui.sample, locale))}</span>`);
}

function entryMeta({ c, locale, entry, depth, includeAuthor = false }) {
  const date = entryDate(entry);
  const readingTime = t(entry?.readingTime, locale);
  const doctor = includeAuthor ? entryDoctor(c, entry) : null;
  const author = includeAuthor ? entryAuthorName(entry, doctor, locale) : "";
  return `<div class="cluster u-sm u-muted">
    ${when(date, `<span>${icon("calendar")} ${esc(t(c.site.ui.publishedOn, locale))}: ${esc(formatDate(date, locale))}</span>`)}
    ${when(readingTime, `<span>${icon("clock")} ${esc(readingTime)} ${esc(t(c.site.ui.readingTime, locale))}</span>`)}
    ${when(author, doctor
      ? `<a href="${esc(link(depth, `doctors/${t(doctor.slug, "en")}.html`))}">${icon("user")} ${esc(author)}</a>`
      : `<span>${icon("user")} ${esc(author)}</span>`)}
  </div>`;
}

/* Existing cover records predate individual alt fields. This localised,
   topic-specific fallback keeps every article image meaningful to a screen
   reader without exposing filenames or repeating a generic label. */
function articleImageAlt(entry, locale) {
  const supplied = t(entry?.imageAlt, locale) || t(entry?.imageAlt, "en");
  if (supplied) return supplied;
  const title = entryTitle(entry, locale);
  return locale === "ar"
    ? "صورة توضيحية لموضوع: " + title
    : "Article illustration: " + title;
}

function entryCard({ c, categories, entry, locale, depth, headingLevel = 3 }) {
  const slug = entrySlug(entry);
  const title = entryTitle(entry, locale);
  const category = categoryFor(categories, entry);
  const image = t(entry?.image, locale);
  const type = entryType(entry);
  const H = `h${headingLevel}`;

  return `<article class="card card--article" data-reveal>
    <div class="card__media arch arch--wide">
      ${image
        ? `<img src="${esc(asset(depth, image))}" alt="${esc(articleImageAlt(entry, locale))}" width="600" height="375" loading="lazy" decoding="async">`
        : `<div class="card__placeholder" aria-hidden="true">${icon(type === "tip" ? "leaf" : type === "qa" ? "user" : type === "update" ? "sparkle" : "book", "card__placeholder-icon")}</div>`}
    </div>
    <div class="card__body">
      <div class="cluster">
        <span class="chip">${esc(typeLabel(c, type, locale))}</span>
        ${when(category, `<a class="chip" href="${esc(link(depth, `articles/category-${categorySlug(category)}.html`))}">${esc(categoryName(category, locale))}</a>`)}
        ${sampleBadge(c, locale, entry)}
      </div>
      ${entryMeta({ c, locale, entry, depth })}
      <${H} class="card__title"><a class="card__link" href="${esc(link(depth, `articles/${slug}.html`))}">${esc(title)}</a></${H}>
      ${when(entryExcerpt(entry, locale), `<p class="card__text">${esc(entryExcerpt(entry, locale))}</p>`)}
      <div class="card__foot"><span class="link-cta">${esc(t(c.site.ui.learnMore, locale))} ${icon("arrow")}</span></div>
    </div>
  </article>`;
}

function emptyState(c, locale, headingLevel = 2) {
  return `<div class="card u-center" style="grid-column:1/-1;padding:clamp(2rem,5vw,4rem)">
    <span class="chip">${icon("book")} ${esc(t(COPY.library, locale))}</span>
    <h${headingLevel} class="h3" style="margin-top:1rem">${esc(t(COPY.emptyTitle, locale))}</h${headingLevel}>
    <p class="u-muted u-measure" style="margin:1rem auto 0">${esc(t(COPY.emptyText, locale))}</p>
  </div>`;
}

function sourceList(entry, locale) {
  const sources = ta(entry?.sources, "en");
  if (!sources.length) return "";
  return `<div class="prose"><ol>
    ${map(sources, (source) => {
      const url = t(source?.url, locale) || t(source?.url, "en");
      const label = t(source?.label, locale) || url;
      return `<li><a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a></li>`;
    })}
  </ol></div>`;
}

function reviewAndHistory({ c, locale, depth, entry }) {
  const authorDoctor = entryDoctor(c, entry);
  const reviewerDoctor = entryDoctor(c, entry, "reviewedBy");
  const author = entryAuthorName(entry, authorDoctor, locale);
  const reviewer = entryAuthorName(entry, reviewerDoctor, locale, "reviewedBy");
  const publishedDate = entryDate(entry);
  const updatedDate = entryUpdatedDate(entry);
  const sourceCount = ta(entry?.sources, "en").length;
  const personLink = (doctor, name) => doctor
    ? '<a href="' + esc(link(depth, "doctors/" + t(doctor.slug, "en") + ".html")) + '">' + esc(name) + '</a>'
    : esc(name);
  const authorFact = author
    ? '<div><dt>' + esc(t(COPY.author, locale)) + '</dt><dd>' + personLink(authorDoctor, author) + '</dd></div>'
    : "";
  const reviewerFact = '<div><dt>' + esc(t(COPY.medicalReviewer, locale)) + '</dt><dd>'
    + (reviewer ? personLink(reviewerDoctor, reviewer) : esc(t(COPY.noSeparateReviewer, locale))) + '</dd></div>';
  const sourceFact = sourceCount
    ? '<div><dt>' + esc(t(COPY.linkedSources, locale)) + '</dt><dd>' + esc(String(sourceCount)) + '</dd></div>'
    : "";
  const publishedItem = publishedDate
    ? '<li><strong>' + esc(t(COPY.published, locale)) + ':</strong> ' + esc(formatDate(publishedDate, locale)) + '</li>'
    : "";
  const updatedItem = updatedDate && updatedDate !== publishedDate
    ? '<li><strong>' + esc(t(COPY.updated, locale)) + ':</strong> ' + esc(formatDate(updatedDate, locale)) + '</li>'
    : "";
  const reviewItem = '<li><strong>' + esc(t(COPY.reviewRecord, locale)) + ':</strong> '
    + esc(reviewer ? t(COPY.reviewRecorded, locale) : t(COPY.noSeparateReviewer, locale)) + '</li>';
  const sourcesItem = sourceCount
    ? '<li><strong>' + esc(t(COPY.linkedSources, locale)) + ':</strong> ' + esc(String(sourceCount)) + '</li>'
    : "";
  return '<section class="section section--tight article-transparency" style="padding-top:0">'
    + '<div class="wrap wrap--narrow"><article class="card" data-reveal><div class="card__body">'
    + '<div><p class="eyebrow">' + esc(t(COPY.library, locale)) + '</p><h2 class="h3" style="margin-top:.4rem">' + esc(t(COPY.reviewHeading, locale)) + '</h2></div>'
    + '<p class="u-muted">' + esc(t(COPY.reviewIntro, locale)) + '</p>'
    + '<dl class="article-transparency__facts">' + authorFact + reviewerFact + sourceFact + '</dl>'
    + '<details class="article-transparency__history"><summary>' + esc(t(COPY.publicationHistory, locale)) + '</summary>'
    + '<ol class="prose">' + publishedItem + updatedItem + reviewItem + sourcesItem + '</ol></details>'
    + '</div></article></div></section>';
}

function reviewStandards({ c, locale }) {
  return '<section class="section section--tint article-standards"><div class="wrap wrap--narrow">'
    + '<article class="card" data-reveal><div class="card__body">'
    + '<p class="eyebrow">' + esc(t(COPY.library, locale)) + '</p>'
    + '<h2 class="h3">' + esc(t(COPY.standardsHeading, locale)) + '</h2>'
    + '<p class="card__text">' + esc(t(COPY.standardsText, locale)) + '</p>'
    + '</div></article></div></section>';
}

function hubSectionCard({ c, locale, depth, key, card }) {
  const labels = {
    articles: t(c.site.ui.articles, locale),
    updates: t(c.site.ui.updates, locale),
    qa: t(c.site.ui.qa, locale),
    tips: t(c.site.ui.tips, locale),
    faq: t(c.site.ui.tabFaq, locale),
    tools: t(c.site.ui.healthTools, locale),
  };
  return `<article class="card" data-reveal>
    <div class="card__body">
      <span class="chip">${icon(card.icon)} ${esc(labels[key])}</span>
      <h2 class="card__title"><a class="card__link" href="${esc(link(depth, card.href))}">${esc(labels[key])}</a></h2>
      <p class="card__text">${esc(t(card.text, locale))}</p>
      <div class="card__foot"><span class="link-cta">${esc(t(c.site.ui.learnMore, locale))} ${icon("arrow")}</span></div>
    </div>
  </article>`;
}

function featuredBlock({ c, categories, entry, locale, depth }) {
  if (!entry) return emptyState(c, locale);
  const category = categoryFor(categories, entry);
  const image = t(entry?.image, locale);
  const title = entryTitle(entry, locale);
  return `<article class="card" data-reveal>
    <div class="grid grid-2" style="align-items:center">
      <div class="arch arch--wide">
        ${image
          ? `<img src="${esc(asset(depth, image))}" alt="${esc(articleImageAlt(entry, locale))}" width="800" height="500" loading="lazy" decoding="async">`
          : `<div class="card__placeholder" aria-hidden="true" style="aspect-ratio:16/10">${icon("book", "card__placeholder-icon")}</div>`}
      </div>
      <div class="card__body">
        <div class="cluster">
          <span class="chip">${esc(t(COPY.featured, locale))}</span>
          ${when(category, `<a class="chip" href="${esc(link(depth, `articles/category-${categorySlug(category)}.html`))}">${esc(categoryName(category, locale))}</a>`)}
          ${sampleBadge(c, locale, entry)}
        </div>
        <h2 class="h2"><a href="${esc(link(depth, `articles/${entrySlug(entry)}.html`))}">${esc(title)}</a></h2>
        ${entryMeta({ c, locale, entry, depth, includeAuthor: true })}
        <p class="lede">${esc(entryExcerpt(entry, locale))}</p>
        <a class="btn btn--primary" href="${esc(link(depth, `articles/${entrySlug(entry)}.html`))}">${esc(t(c.site.ui.learnMore, locale))}</a>
      </div>
    </div>
  </article>`;
}

function todayTip({ c, tip, locale, depth, headingLevel = 2 }) {
  if (!tip) return emptyState(c, locale, headingLevel);
  const H = `h${headingLevel}`;
  return `<article class="card tip-card" data-random-tip data-tip-source="${esc(asset(depth, "assets/data/tips.json"))}" data-reveal style="padding:clamp(1.5rem,4vw,3rem)">
    <div class="stack">
      <div class="cluster">
        <span class="chip">${icon("leaf")} ${esc(t(c.site.ui.tips, locale))}</span>
      </div>
      <${H} class="h2"><a href="${esc(link(depth, "articles/tips.html"))}">${esc(t({ ar: "نصيحة النهارده", en: "Today's practical tip" }, locale))}</a></${H}>
      <div class="prose tip-card__text"><p data-random-tip-text>${esc(t(tip, locale))}</p></div>
    </div>
  </article>`;
}

function hubPage({ c, locale, categories, entries }) {
  const depth = 1;
  const articles = newest(entries.filter((entry) => entryType(entry) === "article"));
  const featured = articles.find((entry) => entry?.featured) || articles[0];
  const tip = c.tips[0];
  const body = `
${pageHero({
    c, locale, depth,
    eyebrow: t(COPY.library, locale),
    title: t(COPY.heroTitle, locale),
    text: t(COPY.heroText, locale),
    trail: [{ label: t(COPY.library, locale) }],
    art: "articles"})}

<section class="section section--tight">
  <div class="wrap">
    <div class="grid grid-3">
      ${map(Object.entries(COPY.hubCards), ([key, card]) => hubSectionCard({ c, locale, depth, key, card }))}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    ${sectionHead({ eyebrow: t(COPY.library, locale), title: t(COPY.featured, locale) })}
    ${featuredBlock({ c, categories, entry: featured, locale, depth })}
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ eyebrow: t(c.site.ui.articles, locale), title: t(COPY.latest, locale) })}
    <div class="grid grid-3">
      ${articles.length ? map(articles.slice(0, 6), (entry) => entryCard({ c, categories, entry, locale, depth })) : emptyState(c, locale)}
    </div>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    ${sectionHead({ eyebrow: t(c.site.ui.tips, locale), title: t(c.site.ui.tips, locale) })}
    ${todayTip({ c, tip, locale, depth })}
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    ${sectionHead({ title: t(COPY.categories, locale) })}
    ${categoryChips({ categories, locale, depth, includeAll: false })}
  </div>
</section>


${ctaBand({ c, locale, depth })}`;

  return {
    path: `${locale}/articles/index.html`,
    html: page({
      c, locale, depth, pagePath: "articles/index.html",
      title: t(COPY.library, locale),
      description: t(COPY.heroText, locale),
      active: "articles",
      body,
    }),
  };
}

function articleListPage({ c, locale, categories, entries }) {
  const depth = 1;
  const articles = newest(entries.filter((entry) => entryType(entry) === "article"));
  const label = t(c.site.ui.articles, locale);
  const base = `https://${c.site.brand.domain}`;
  const itemList = {
    "@type": "ItemList",
    name: label,
    itemListElement: articles.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entryTitle(entry, locale),
      item: `${base}/${locale}/articles/${entrySlug(entry)}.html`,
    })),
  };
  const description = t({
    ar: "شروحات طبية واضحة تساعدك تفهم الأعراض والاختيارات والأسئلة اللي تستاهل تتناقش في الكشف.",
    en: "Clear medical explainers to help you understand symptoms, options and the questions worth discussing in a consultation.",
  }, locale);
  const body = `
${pageHero({
    c, locale, depth, eyebrow: t(COPY.library, locale), title: label, text: description,
    trail: [{ label: t(COPY.library, locale), href: "articles/" }, { label }],
    art: "articles"})}
<section class="section">
  <div class="wrap">
    ${categoryChips({ categories, locale, depth, allLabel: label })}
    <div class="grid grid-3" style="margin-top:2rem">
      ${articles.length ? map(articles, (entry) => entryCard({ c, categories, entry, locale, depth, headingLevel: 2 })) : emptyState(c, locale)}
    </div>
  </div>
</section>

${reviewStandards({ c, locale, depth })}

${ctaBand({ c, locale, depth })}`;
  return {
    path: `${locale}/articles/list.html`,
    html: page({
      c, locale, depth, pagePath: "articles/list.html", title: label,
      description, active: "articles", body, schema: itemList,
    }),
  };
}

function updatesPage({ c, locale, entries }) {
  const depth = 1;
  const updates = newest(entries.filter((entry) => entryType(entry) === "update"));
  const label = t(c.site.ui.updates, locale);
  const description = t({
    ar: "ملخصات هادية لمستجدات طبية مستقرة، مع روابط المصادر ومعنى التحديث ليك كعميل.",
    en: "Calm summaries of established medical developments, with source links and what each update means for you as a patient.",
  }, locale);
  const body = `
${pageHero({
    c, locale, depth, eyebrow: t(COPY.library, locale), title: label, text: description,
    trail: [{ label: t(COPY.library, locale), href: "articles/" }, { label }],
    art: "articles"})}
<section class="section">
  <div class="wrap wrap--narrow">
    <div class="stack">
      ${updates.length ? map(updates, (entry) => `<article class="card" data-reveal>
        <div class="card__media arch arch--wide">
          ${t(entry?.image, locale)
            ? `<img src="${esc(asset(depth, t(entry?.image, locale)))}" alt="${esc(articleImageAlt(entry, locale))}" width="600" height="375" loading="lazy" decoding="async">`
            : `<div class="card__placeholder" aria-hidden="true">${icon("sparkle", "card__placeholder-icon")}</div>`}
        </div>
        <div class="card__body">
          <div class="cluster"><span class="chip">${esc(label)}</span>${sampleBadge(c, locale, entry)}</div>
          ${entryMeta({ c, locale, entry, depth, includeAuthor: true })}
          <h2 class="h3"><a href="${esc(link(depth, `articles/${entrySlug(entry)}.html`))}">${esc(entryTitle(entry, locale))}</a></h2>
          <p class="card__text">${esc(entryExcerpt(entry, locale))}</p>
          ${when(ta(entry?.sources, "en").length, `<div><h3 class="h4">${esc(t(COPY.sources, locale))}</h3>${sourceList(entry, locale)}</div>`)}
          <a class="link-cta" href="${esc(link(depth, `articles/${entrySlug(entry)}.html`))}">${esc(t(c.site.ui.learnMore, locale))} ${icon("arrow")}</a>
        </div>
      </article>`) : emptyState(c, locale)}
    </div>
  </div>
</section>

${reviewStandards({ c, locale, depth })}

${ctaBand({ c, locale, depth })}`;
  return {
    path: `${locale}/articles/updates.html`,
    html: page({ c, locale, depth, pagePath: "articles/updates.html", title: label, description, active: "articles", body }),
  };
}

function qaAnswer(entry, locale) {
  const sections = entrySections(entry);
  const answer = sections.map((section) => sectionBody(section, locale)).filter(Boolean).join("\n\n");
  return answer || t(entry?.answer, locale) || t(entry?.body, locale);
}

function qaPage({ c, locale, entries }) {
  const depth = 1;
  const questions = newest(entries.filter((entry) => entryType(entry) === "qa"));
  const label = t(c.site.ui.qa, locale);
  const description = t({
    ar: "أسئلة بصوت المرضى وإجابات مباشرة من أطباء لاروز، من غير تشخيص عن بُعد أو وعود جاهزة.",
    en: "Questions in patients' own words, answered directly by La Rose doctors without remote diagnosis or ready-made promises.",
  }, locale);
  const body = `
${pageHero({
    c, locale, depth, eyebrow: t(COPY.library, locale), title: label, text: description,
    trail: [{ label: t(COPY.library, locale), href: "articles/" }, { label }],
    art: "articles"})}
<section class="section">
  <div class="wrap wrap--narrow">
    <div class="stack">
      ${questions.length ? map(questions, (entry) => {
        const doctor = entryDoctor(c, entry);
        const author = entryAuthorName(entry, doctor, locale);
        const portrait = t(doctor?.portrait, locale);
        return `<article class="card" data-reveal>
          <div class="card__body">
            <div class="cluster"><span class="chip">${esc(label)}</span>${sampleBadge(c, locale, entry)}</div>
            <h2 class="h3"><a href="${esc(link(depth, `articles/${entrySlug(entry)}.html`))}">${esc(entryTitle(entry, locale))}</a></h2>
            <div class="prose">${paras(qaAnswer(entry, locale))}</div>
            ${when(author, `<div class="grid grid-2" style="align-items:center;margin-top:1rem">
              <div class="arch arch--ruled" style="max-width:7rem;margin-inline:auto">
                ${portrait
                  ? `<img src="${esc(asset(depth, portrait))}" alt="${esc(author)}" width="450" height="562" loading="lazy" decoding="async">`
                  : `<div class="doctor-placeholder">${icon("user")}</div>`}
                ${when(doctor?.sample, `<span class="badge-sample">${esc(t(c.site.ui.sample, locale))}</span>`)}
              </div>
              <div>
                <p class="eyebrow">${esc(t(COPY.answerBy, locale))}</p>
                ${doctor
                  ? `<a class="link-cta" href="${esc(link(depth, `doctors/${t(doctor.slug, "en")}.html`))}">${esc(author)} ${icon("arrow")}</a>`
                  : `<p>${esc(author)}</p>`}
              </div>
            </div>`)}
          </div>
        </article>`;
      }) : emptyState(c, locale)}
    </div>
  </div>
</section>

${ctaBand({ c, locale, depth })}`;
  return {
    path: `${locale}/articles/qa.html`,
    html: page({ c, locale, depth, pagePath: "articles/qa.html", title: label, description, active: "articles", body }),
  };
}

function tipsPage({ c, locale, entries }) {
  const depth = 1;
  const tips = newest(entries.filter((entry) => entryType(entry) === "tip"));
  const label = t(c.site.ui.tips, locale);
  const description = t({
    ar: "خطوات عملية صغيرة ومحددة من أطباء لاروز، تقدر تختار منها اللي يناسب يومك.",
    en: "Small, specific and practical steps from La Rose doctors, so you can choose what fits your day.",
  }, locale);
  const body = `
${pageHero({
    c, locale, depth, eyebrow: t(COPY.library, locale), title: label, text: description,
    trail: [{ label: t(COPY.library, locale), href: "articles/" }, { label }],
    art: "articles"})}
<section class="section section--tint">
  <div class="wrap wrap--narrow">
    ${todayTip({ c, tip: c.tips[0], locale, depth })}
  </div>
</section>
${when(tips.length > 1, `<section class="section">
  <div class="wrap wrap--narrow">
    ${sectionHead({ title: t(COPY.moreTips, locale) })}
    <div class="stack">
      ${map(tips.slice(1), (tip) => {
        const doctor = entryDoctor(c, tip);
        const author = entryAuthorName(tip, doctor, locale);
        return `<article class="card" data-reveal><div class="card__body">
          <div class="cluster">
            <span class="chip">${esc(formatDate(entryDate(tip), locale))}</span>
            ${sampleBadge(c, locale, tip)}
          </div>
          <h3 class="h4"><a href="${esc(link(depth, `articles/${entrySlug(tip)}.html`))}">${esc(entryTitle(tip, locale))}</a></h3>
          <div class="prose">${paras(entryExcerpt(tip, locale))}</div>
          ${when(author, doctor
            ? `<a class="link-cta" href="${esc(link(depth, `doctors/${t(doctor.slug, "en")}.html`))}">${esc(author)} ${icon("arrow")}</a>`
            : `<p class="u-sm u-muted">${esc(author)}</p>`)}
        </div></article>`;
      })}
    </div>
  </div>
</section>`)}

${ctaBand({ c, locale, depth })}`;
  return {
    path: `${locale}/articles/tips.html`,
    html: page({ c, locale, depth, pagePath: "articles/tips.html", title: label, description, active: "articles", body }),
  };
}

function faqGroups(c, entries) {
  const specs = published(c.specialties || []);
  const groups = specs.map((sp) => ({
    slug: t(sp.slug, "en"),
    name: sp.name,
    items: [...ta(sp.faq, "en")],
    sample: Boolean(sp.sample),
  }));
  const general = { slug: "general", name: COPY.general, items: [], sample: false };
  const extra = new Map();

  entries.forEach((entry) => {
    const items = entryFaq(entry);
    if (!items.length) return;
    const slug = entryCategorySlug(entry) || "general";
    const target = groups.find((group) => group.slug === slug)
      || (slug === "general" ? general : extra.get(slug));
    if (target) {
      target.items.push(...items);
      target.sample = target.sample || Boolean(entry?.sample);
      return;
    }
    extra.set(slug, {
      slug,
      name: entry.categoryName || { ar: slug, en: slug },
      items: [...items],
      sample: Boolean(entry?.sample),
    });
  });

  return [...groups, general, ...extra.values()].filter((group) => group.items.length);
}

function faqPage({ c, locale, entries }) {
  const depth = 1;
  const label = t(c.site.ui.tabFaq, locale);
  const title = t({
    ar: "الأسئلة الشائعة في المركز المعرفي",
    en: "Medical questions and answers",
  }, locale);
  const groups = faqGroups(c, entries);
  const allFaq = groups.flatMap((group) => group.items);
  const description = t({
    ar: "إجابات مجمعة على الأسئلة اللي بتتكرر في تخصصات لاروز ومحتوى المركز المعرفي.",
    en: "Collected answers to the questions asked most often across La Rose specialties and Knowledge Centre content.",
  }, locale);
  const body = `
${pageHero({
    c, locale, depth, eyebrow: t(COPY.library, locale), title, text: description,
    trail: [{ label: t(COPY.library, locale), href: "articles/" }, { label: title }],
    art: "articles"})}
<section class="section">
  <div class="wrap wrap--narrow">
    ${groups.length ? map(groups, (group) => `<section style="margin-bottom:clamp(2.5rem,6vw,5rem)">
      ${sectionHead({ eyebrow: t(COPY.faqs, locale), title: t(group.name, locale) || group.slug })}
      ${when(group.sample, `<span class="badge-sample" style="position:static;display:inline-flex;margin-bottom:1rem">${esc(t(c.site.ui.sample, locale))}</span>`)}
      ${faqList({ c, locale, items: group.items, idPrefix: `faq-${group.slug}` })}
    </section>`) : emptyState(c, locale)}
  </div>
</section>

${ctaBand({ c, locale, depth })}`;
  return {
    path: `${locale}/articles/faq.html`,
    html: page({
      c, locale, depth, pagePath: "articles/faq.html", title,
      description, active: "articles", body, schema: faqSchema(allFaq, locale),
    }),
  };
}

function categoryPage({ c, locale, categories, entries, category }) {
  const depth = 1;
  const slug = categorySlug(category);
  const label = categoryName(category, locale);
  const matchesSpecialtyHeading = published(c.specialties).some((sp) => t(sp.name, locale) === label);
  const title = matchesSpecialtyHeading
    ? t({ ar: `مقالات ${label}`, en: `${label} articles` }, locale)
    : label;
  const filtered = newest(entries.filter((entry) => entryCategorySlug(entry) === slug));
  const description = categoryDesc(category, locale) || t(COPY.heroText, locale);
  const pagePath = `articles/category-${slug}.html`;
  const body = `
${pageHero({
    c, locale, depth, eyebrow: t(COPY.library, locale), title, text: description,
    trail: [{ label: t(COPY.library, locale), href: "articles/" }, { label: title }],
    art: "articles"})}
<section class="section">
  <div class="wrap">
    ${categoryChips({ categories, locale, depth, active: slug, allLabel: t(c.site.ui.articles, locale) })}
    <div class="grid grid-3" style="margin-top:2rem">
      ${filtered.length ? map(filtered, (entry) => entryCard({ c, categories, entry, locale, depth, headingLevel: 2 })) : emptyState(c, locale)}
    </div>
  </div>
</section>

${ctaBand({ c, locale, depth })}`;
  return {
    path: `${locale}/${pagePath}`,
    html: page({ c, locale, depth, pagePath, title, description, active: "articles", body }),
  };
}

function detailSchemas({ c, locale, entry, doctor, reviewer, pagePath }) {
  const base = `https://${c.site.brand.domain}`;
  const image = t(entry?.image, locale);
  const date = entryDate(entry);
  const author = entryAuthorName(entry, doctor, locale);
  const reviewedBy = entryAuthorName(entry, reviewer, locale, "reviewedBy");
  const citations = ta(entry?.sources, "en")
    .map((source) => t(source?.url, locale) || t(source?.url, "en"))
    .filter(Boolean);
  const keywords = ta(entry?.tags, locale).filter(Boolean);
  const about = [
    entryCategorySlug(entry),
    ...ta(entry?.specialties, "en"),
  ].filter(Boolean);
  const person = author ? {
    "@type": "Person",
    name: author,
    url: doctor ? `${base}/${locale}/doctors/${t(doctor.slug, "en")}.html` : undefined,
  } : undefined;
  // Patient questions are answered by the clinic's own doctors, so Google's
  // rules put them under FAQPage (site-authored), not QAPage (user-generated).
  const faq = entryType(entry) === "qa" ? {
    "@type": "FAQPage",
    "@id": `${base}/${locale}/${pagePath}#faq`,
    mainEntity: [{
      "@type": "Question",
      name: entryTitle(entry, locale),
      acceptedAnswer: {
        "@type": "Answer",
        text: qaAnswer(entry, locale),
        author: person,
      },
    }],
  } : null;
  const article = {
    "@type": "Article",
    "@id": `${base}/${locale}/${pagePath}#article`,
    headline: entryTitle(entry, locale),
    description: entryExcerpt(entry, locale),
    mainEntityOfPage: `${base}/${locale}/${pagePath}`,
    image: image ? (/^https?:/i.test(image) ? image : `${base}/${image.replace(/^\/+/, "")}`) : undefined,
    datePublished: date || undefined,
    dateModified: t(entry?.updatedAt, locale) || t(entry?.dateModified, locale) || date || undefined,
    inLanguage: c.site.i18n[locale].locale,
    articleSection: typeLabel(c, entryType(entry), locale),
    about: about.length ? about : undefined,
    keywords: keywords.length ? keywords.join(", ") : undefined,
    citation: citations.length ? citations : undefined,
    author: person,
    reviewedBy: reviewedBy ? {
      "@type": "Person",
      name: reviewedBy,
      url: reviewer ? `${base}/${locale}/doctors/${t(reviewer.slug, "en")}.html` : undefined,
    } : undefined,
    publisher: {
      "@id": `${base}/#clinic`,
    },
  };
  return faq ? [article, faq] : [article];
}

function authorCard({ c, locale, depth, doctor }) {
  const portrait = t(doctor?.portrait, locale);
  return `<section class="section section--tint">
    <div class="wrap wrap--narrow">
      ${sectionHead({ eyebrow: t(COPY.writtenBy, locale), title: t(doctor.name, locale) })}
      <article class="card" data-reveal>
        <div class="card__body">
          <div class="grid grid-2" style="align-items:center">
            <div class="arch arch--ruled" style="max-width:12rem;margin-inline:auto">
              ${portrait
                ? `<img src="${esc(asset(depth, portrait))}" alt="${esc(t(doctor.name, locale))}" width="450" height="562" loading="lazy" decoding="async">`
                : `<div class="doctor-placeholder">${icon("user")}</div>`}
              ${when(doctor?.sample, `<span class="badge-sample">${esc(t(c.site.ui.sample, locale))}</span>`)}
            </div>
            <div class="stack">
              <p class="u-muted">${esc(t(doctor.title, locale))}</p>
              ${/* The qualifications are the reason to trust the article, so
                    they come before the bio rather than living only on the
                    doctor's own page. */""}
              ${when(ta(doctor?.credentials, locale).length, `<ul class="doctor-creds">
                ${map(ta(doctor.credentials, locale), (cred) => `<li>${esc(cred)}</li>`)}
              </ul>`)}
              ${when(t(doctor.bio, locale), `<p>${esc(t(doctor.bio, locale))}</p>`)}
              <a class="link-cta" href="${esc(link(depth, `doctors/${t(doctor.slug, "en")}.html`))}">${esc(t(c.site.ui.viewProfile, locale))} ${icon("arrow")}</a>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>`;
}

/* A <title> beyond about 60 characters is truncated in results, and the brand
   suffix the shell appends counts too. Cut at the last sensible break before
   the limit rather than mid-word, and never leave dangling punctuation. */
function shortenTitle(title, locale) {
  // The shell appends " | <brand>", 23-24 characters, and that has to fit
  // inside the ~60 a search result shows, so the entry keeps the rest.
  const LIMIT = locale === "ar" ? 36 : 37;
  const text = String(title || "").trim();
  if (text.length <= LIMIT) return text;
  const head = text.slice(0, LIMIT + 1);
  const cut = Math.max(head.lastIndexOf("،"), head.lastIndexOf(","),
                       head.lastIndexOf(" - "), head.lastIndexOf(": "),
                       head.lastIndexOf("؟"), head.lastIndexOf("?"));
  const at = cut > LIMIT * 0.5 ? cut : head.lastIndexOf(" ");
  return text.slice(0, at > 0 ? at : LIMIT).replace(/[\s،,:;.\-–]+$/, "");
}

/* The opening of the answer, trimmed to a description-sized piece on a
   sentence boundary where there is one. */
function answerSummary(entry, locale) {
  const sections = ta(entry?.sections, "en");
  const body = sections.map((section) => t(section?.body, locale) || t(section?.text, locale))
    .filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  if (!body) return "";
  if (body.length <= 158) return body;
  const head = body.slice(0, 159);
  const stop = Math.max(head.lastIndexOf(". "), head.lastIndexOf("، "), head.lastIndexOf("؟ "));
  const at = stop > 110 ? stop + 1 : head.lastIndexOf(" ");
  return body.slice(0, at > 0 ? at : 155).trim().replace(/[\s،,:;\-]+$/, "");
}

/* Articles already name the specialties they relate to in content/articles.json.
   Render those references as useful, descriptive links rather than making a
   reader return to the general specialties hub to find the relevant care. */
function relatedCareLinks({ c, entry, locale, depth }) {
  const slugs = ta(entry?.specialties, "en");
  const specialties = slugs
    .map((slug) => published(c.specialties).find((specialty) => t(specialty.slug, "en") === slug))
    .filter(Boolean);
  if (!specialties.length) return "";
  return `<section class="section section--tight" style="padding-top:0">
  <div class="wrap wrap--narrow">
    ${sectionHead({ title: t(COPY.relatedCare, locale) })}
    <div class="cluster">
      ${map(specialties, (specialty) => `<a class="chip" href="${esc(link(depth, `specialties/${t(specialty.slug, "en")}.html`))}">${esc(t(specialty.name, locale))}</a>`)}
    </div>
  </div>
</section>`;
}

/* Give every entry a dense but relevant internal-link path. Category is the
   strongest signal, then shared clinical specialties; type only breaks ties.
   This avoids keyword-driven links to unrelated medical topics while giving
   each entry up to six routes into the wider library. */
function relatedEntries({ entry, entries, limit = 6 }) {
  const slug = entrySlug(entry);
  const category = entryCategorySlug(entry);
  const specialties = new Set(ta(entry?.specialties, "en"));
  const type = entryType(entry);
  const scored = entries
    .filter((candidate) => entrySlug(candidate) !== slug)
    .map((candidate) => {
      const candidateSpecialties = ta(candidate?.specialties, "en");
      const sharedSpecialties = candidateSpecialties.filter((specialty) => specialties.has(specialty)).length;
      const sameCategory = category && entryCategorySlug(candidate) === category;
      const sameType = entryType(candidate) === type;
      const score = (sameCategory ? 100 : 0)
        + (sharedSpecialties * 35)
        + (sameType ? 6 : 0)
        + (entryType(candidate) === "article" ? 4 : 0);
      return { candidate, score, date: dateStamp(candidate), title: entryTitle(candidate, "en") };
    })
    .sort((a, b) => b.score - a.score || b.date - a.date || a.title.localeCompare(b.title));
  const topical = scored.filter((item) => item.score > 0);
  return (topical.length ? topical : scored).slice(0, limit).map((item) => item.candidate);
}

function detailPage({ c, locale, categories, entries, entry }) {
  const depth = 1;
  const slug = entrySlug(entry);
  const pagePath = `articles/${slug}.html`;
  // The share and Ask-AI links need the page's absolute public URL, the same
  // one the JSON-LD below uses. Declared once, here, so they cannot diverge.
  const base = `https://${c.site.brand.domain}`;
  const title = entryTitle(entry, locale);
  /* A Q&A entry's title is the patient's question, which is often a whole
     sentence, and its excerpt is that same question restated. That produced a
     122-character <title> and a description that told a searcher nothing the
     title had not already said. The heading on the page keeps the full
     question - it reads correctly there - while the tab and the search result
     get a trimmed title and the opening of the doctor's actual answer.
     `seo.title` / `seo.description` on the entry still win over both. */
  const seoTitle = t(entry?.seo?.title, locale) || shortenTitle(title, locale);
  const seoDescription = t(entry?.seo?.description, locale)
    || (entryType(entry) === "qa" ? answerSummary(entry, locale) : "")
    || entryExcerpt(entry, locale)
    || t(COPY.heroText, locale);
  const description = seoDescription;
  const type = entryType(entry);
  const typeRoute = TYPE_ROUTES[type];
  const category = categoryFor(categories, entry);
  const doctor = entryDoctor(c, entry);
  const reviewer = entryDoctor(c, entry, "reviewedBy");
  const reviewedBy = entryAuthorName(entry, reviewer, locale, "reviewedBy");
  const reviewedBySet = Boolean(t(entry?.reviewedBy, "en") || t(entry?.reviewedBy?.slug, "en"));
  const sections = entrySections(entry);
  const faq = entryFaq(entry);
  const image = t(entry?.image, locale);
  const sparse = type === "tip" || type === "qa" || !sections.length;
  // A short entry still gets its full written body. The excerpt is only a
  // stand-in for entries that carry no sections at all: on a Q&A the excerpt is
  // the question restated, so preferring it over the sections printed the
  // question twice and dropped the doctor's answer entirely.
  const fallbackBody = sections.map((section) => sectionBody(section, locale)).filter(Boolean).join("\n\n")
    || entryExcerpt(entry, locale);
  const related = relatedEntries({ entry, entries });

  const body = `
<section class="section section--tight">
  <div class="wrap">
    ${crumbs({
      c, locale, depth,
      trail: [{ label: t(COPY.library, locale), href: "articles/" }, { label: title }],
    })}
    <div class="wrap--narrow" style="margin-top:2rem">
      <div class="cluster">
        <a class="chip" href="${esc(link(depth, typeRoute))}">${esc(typeLabel(c, type, locale))}</a>
        ${when(category, `<a class="chip" href="${esc(link(depth, `articles/category-${categorySlug(category)}.html`))}">${esc(categoryName(category, locale))}</a>`)}
        ${sampleBadge(c, locale, entry)}
      </div>
      <h1 class="h1" style="margin-top:1rem">${esc(title)}</h1>
      <div style="margin-top:1rem">${entryMeta({ c, locale, entry, depth, includeAuthor: true })}</div>
      ${when(reviewedBySet, `<p class="u-sm u-muted" style="margin-top:.75rem">${esc(t(c.site.ui.reviewedBy, locale))}: ${reviewer
        ? `<a href="${esc(link(depth, `doctors/${t(reviewer.slug, "en")}.html`))}">${esc(reviewedBy)}</a>`
        : esc(reviewedBy)}</p>`)}
    </div>
  </div>
</section>

${when(image, `<section class="section section--tight" style="padding-top:0">
  <div class="wrap wrap--narrow"><div class="arch arch--wide">
    <img src="${esc(asset(depth, image))}" alt="${esc(articleImageAlt(entry, locale))}" width="1000" height="625" loading="eager" decoding="async">
  </div></div>
</section>`)}

<section class="section" style="padding-top:${image ? "0" : "var(--section-y)"}">
  <div class="wrap${sparse ? " wrap--narrow" : ""}">
    ${sparse
      ? `<article class="prose">${sections.length
          ? map(sections, (section, index) => `<section>
            ${when(sectionTitle(section, locale), `<h2 id="${esc(sectionId(section, index))}">${esc(sectionTitle(section, locale))}</h2>`)}
            ${sectionParas(section, locale)}
          </section>`)
          : paras(fallbackBody)}</article>`
      : `<div class="article-layout">
        <aside class="card article-toc">
          <div class="card__body">
            <h2 class="h4">${esc(t(COPY.contents, locale))}</h2>
            <nav aria-label="${esc(t(COPY.contents, locale))}"><ol class="prose">
              ${map(sections, (section, index) => `<li><a href="#${esc(sectionId(section, index))}">${esc(sectionTitle(section, locale))}</a></li>`)}
            </ol></nav>
          </div>
        </aside>
        <article class="prose">
          ${map(sections, (section, index) => `<section>
            <h2 id="${esc(sectionId(section, index))}">${esc(sectionTitle(section, locale))}</h2>
            ${sectionParas(section, locale)}
          </section>`)}
        </article>
      </div>`}
  </div>
</section>

${when(ta(entry?.sources, "en").length, `<section class="section section--tight" style="padding-top:0">
  <div class="wrap wrap--narrow">
    ${sectionHead({ title: t(COPY.sources, locale) })}
    ${sourceList(entry, locale)}
  </div>
</section>`)}

${reviewAndHistory({ c, locale, depth, entry })}

${when(faq.length, `<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    ${sectionHead({ title: t(COPY.faqs, locale) })}
    ${faqList({ c, locale, items: faq, idPrefix: `entry-${slug}` })}
  </div>
</section>`)}

${relatedCareLinks({ c, entry, locale, depth })}


${shareBlock({ c, locale, url: `${base}/${locale}/${pagePath.replace(/\.html$/, "")}`, title })}

${when(doctor, authorCard({ c, locale, depth, doctor }))}

${when(related.length, `<section class="section">
  <div class="wrap">
    ${sectionHead({ title: t(COPY.related, locale) })}
    <div class="grid grid-3">
      ${map(related, (candidate) => entryCard({ c, categories, entry: candidate, locale, depth }))}
    </div>
  </div>
</section>`)}

${ctaBand({ c, locale, depth })}`;

  const schema = detailSchemas({ c, locale, entry, doctor, reviewer, pagePath });
  const faqBlock = faqSchema(faq, locale);
  if (faqBlock) schema.push(faqBlock);

  return {
    path: `${locale}/${pagePath}`,
    html: page({
      c, locale, depth, pagePath, title: seoTitle, description,
      active: "articles", body, schema,
      image: image ? { src: image, width: 1200, height: 750 } : undefined,
    }),
  };
}

export function pages({ c, locale }) {
  const { entries: sourceEntries, categories } = libraryData(c);
  const entries = published(sourceEntries).filter((entry) => entrySlug(entry));
  return [
    hubPage({ c, locale, categories, entries }),
    articleListPage({ c, locale, categories, entries }),
    updatesPage({ c, locale, entries }),
    qaPage({ c, locale, entries }),
    tipsPage({ c, locale, entries }),
    faqPage({ c, locale, entries }),
    ...categories.map((category) => categoryPage({ c, locale, categories, entries, category })),
    ...entries.map((entry) => detailPage({ c, locale, categories, entries, entry })),
  ];
}
