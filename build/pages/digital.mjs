/* ========================================================================== 
   La Rose Digital، remote services and product detail pages.
   ========================================================================== */

import { t, ta, esc, link, asset, icon, map, when } from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import {
  sectionHead, crumbs, pageHero, faqList, faqSchema, ctaBand,
} from "../lib/components.mjs";

/* Dashboard-backed product records will later supply this data. These bilingual
   fallbacks keep both committed product URLs complete while c.digital.products
   is intentionally empty. */
const PRODUCT_FALLBACKS = [
  {
    slug: "recipe-book",
    icon: "book",
    name: { ar: "كتاب وصفات لاروز", en: "The La Rose Recipe Book" },
    short: {
      ar: "٢٥٠ وصفة مصرية بالسعرات والماكروز، معمولة حوالين أكل البيت اللي تعرفه.",
      en: "250 Egyptian recipes with calories and macros, built around the home cooking you know.",
    },
    lede: {
      ar: "دليل عملي يخلي اختيارات الأكل أوسع وأسهل، من غير مكونات غريبة أو وصفات بعيدة عن بيتنا.",
      en: "A practical guide that makes food choices broader and easier, without unfamiliar ingredients or recipes far removed from everyday home cooking.",
    },
    inside: [
      { ar: "٢٥٠ وصفة مصرية مناسبة لأكل البيت", en: "250 Egyptian recipes suited to everyday home cooking" },
      { ar: "السعرات والماكروز موضّحة مع كل وصفة", en: "Calories and macros shown with every recipe" },
      { ar: "أفكار عملية تساعدك تنوّع أكلك", en: "Practical ideas to help you vary what you eat" },
      { ar: "ملف رقمي تحتفظ بيه وترجع له وقت ما تحتاج", en: "A digital file you can keep and return to whenever you need it" },
    ],
    audience: [
      { ar: "لو بتحب أكل البيت وعايز تنوّع أكتر", en: "If you enjoy home cooking and want more variety" },
      { ar: "لو محتاج مرجع سريع للسعرات والماكروز", en: "If you want a quick reference for calories and macros" },
      { ar: "لو الوصفات المعقدة أو المكونات غير المتاحة بتعطّلك", en: "If complicated recipes or hard-to-find ingredients get in your way" },
    ],
    faq: [
      {
        q: { ar: "الكتاب مطبوع ولا رقمي؟", en: "Is the book printed or digital?" },
        a: { ar: "الكتاب ملف رقمي. بعد ما تتواصل مع الفريق على واتساب، هيأكدوا طلبك ويبعتوا لك الملف.", en: "It is a digital file. Once you message the team on WhatsApp, they will confirm your order and send the file to you." },
      },
      {
        q: { ar: "إزاي أطلب الكتاب؟", en: "How do I order the book?" },
        a: { ar: "اضغط على زر الطلب على واتساب، والفريق هيكمل معاك خطوات التأكيد والإرسال.", en: "Use the WhatsApp order button and the team will take you through confirmation and delivery." },
      },
      {
        q: { ar: "هل الكتاب يغني عن الكشف أو الخطة الشخصية؟", en: "Does the book replace a consultation or a personal plan?" },
        a: { ar: "لأ. الكتاب مرجع عملي للوصفات، لكن حالتك الصحية وخطتك المناسبة ليك محتاجين تقييم فردي.", en: "No. The book is a practical recipe reference, while your health needs and a plan suited to you require an individual assessment." },
      },
    ],
  },
  {
    slug: "online-diet",
    icon: "monitor",
    name: { ar: "المتابعة أونلاين", en: "Online Nutrition Programme" },
    short: {
      ar: "خطة غذائية حسب وزنك وحالتك الصحية، مع متابعة يومية على واتساب، فردي أو ضمن مجموعة.",
      en: "A nutrition plan for your weight and health status, with daily WhatsApp follow-up، privately or in a group.",
    },
    lede: {
      ar: "متابعة تغذية من مكانك، بخطة مرنة ومراجعة مستمرة للنتايج والتعديلات اللي تحتاجها وإنت ماشي.",
      en: "Nutrition follow-up from wherever you are, with a flexible plan and ongoing review of your results and the adjustments you need along the way.",
    },
  },
];

const COPY = {
  digital: { ar: "لاروز ديچيتال", en: "La Rose Digital" },
  hubTitle: { ar: "خدمات لاروز معاك من أي مكان", en: "La Rose care, wherever you are" },
  hubText: {
    ar: "خدماتنا عن بُعد معمولة عشان تساعدك تكمّل بخطوات عملية حتى لو مش قادر توصل العيادة: كتاب وصفات واضح، وبرنامج متابعة تغذية أونلاين.",
    en: "Our remote services are designed to help you keep moving with practical support when you cannot reach the clinic: a clear recipe book and an online nutrition programme.",
  },
  service: { ar: "خدمة رقمية", en: "Digital service" },
  relationTitle: { ar: "خدمة أونلاين مرتبطة برعايتك، مش بديل تلقائي للكشف", en: "Online support connected to your care, not an automatic substitute for a consultation" },
  relationText: {
    ar: "الخدمات الرقمية بتديك أدوات ومتابعة من مكانك. لو حالتك محتاجة فحص في العيادة أو تقييم مباشر، الفريق هيوجهك للحجز المناسب بدل ما يكمّل عن بُعد من غير معلومات كفاية.",
    en: "Digital services give you practical tools and follow-up from home. If your case needs an in-clinic examination or direct assessment, the team will guide you to the right appointment rather than continue remotely without enough information.",
  },
  viewService: { ar: "تفاصيل الخدمة", en: "View service" },
  whatsInside: { ar: "إيه اللي جوه الكتاب؟", en: "What is inside?" },
  order: { ar: "اطلب الكتاب على واتساب", en: "Order on WhatsApp" },
  orderNote: {
    ar: "الموقع مبيستقبلش دفع. الفريق هيأكد الطلب معاك على واتساب ويبعت لك الملف.",
    en: "This website does not take payments. The team will confirm your order on WhatsApp and send you the file.",
  },
  sampleEyebrow: { ar: "شكل الوصفة", en: "A recipe preview" },
  sampleTitle: { ar: "أكل تعرفيه، متقدّم بطريقة أسهل", en: "Familiar food, presented more clearly" },
  sampleText: {
    ar: "كل وصفة بتقدّم فكرة من أكل البيت في شكل عملي، مع السعرات والماكروز عشان يبقى عندك مرجع واضح وإنت بتختار.",
    en: "Each recipe presents a familiar home-cooked idea in a practical format, with calories and macros so you have a clear reference when choosing what to eat.",
  },
  sampleList: [
    { ar: "مكونات مألوفة ومتاحة", en: "Familiar, accessible ingredients" },
    { ar: "طريقة عملية ترجعيلها بسهولة", en: "A practical format that is easy to revisit" },
    { ar: "السعرات والماكروز في مكان واضح", en: "Calories and macros in one clear place" },
  ],
  forWhom: { ar: "الكتاب مناسب لمين؟", en: "Who is it for?" },
  programme: { ar: "برنامج متابعة تغذية أونلاين", en: "Online nutrition programme" },
  formatsTitle: { ar: "اختار شكل المتابعة اللي يناسبك", en: "Choose the follow-up format that suits you" },
  formatsText: {
    ar: "الخطة الفردية وخطة المجموعة بيشتركوا في الأساس؛ والاشتراك الفردي بيضيف تغيير الخطة كل أسبوعين، متابعة القياسات، وجروب مباشر مع الدكتورة.",
    en: "The private and group subscriptions share the same foundations; the private subscription adds plan changes every two weeks, measurement tracking and a direct group with the doctor.",
  },
  privateName: { ar: "اشتراك فردي خاص", en: "Private individual subscription" },
  groupName: { ar: "اشتراك مجموعة", en: "Group subscription" },
  sharedIncludes: [
    { ar: "خطة غذائية معمولة حسب وزنك وحالتك الصحية", en: "A nutrition plan built for your weight and health status" },
    { ar: "متابعة يومية على واتساب", en: "Daily follow-up over WhatsApp" },
    { ar: "مراجعة النتايج وتصحيح الخطة وإنت ماشي", en: "Results reviewed and corrections made as you go" },
    { ar: "مرونة في اختيارات الأكل", en: "Flexibility in your food choices" },
    { ar: "وصفات وأفكار سهلة لأكل البيت", en: "Easy home-cooking recipes and ideas" },
  ],
  privateExtras: [
    { ar: "الخطة بتتغير كل أسبوعين", en: "Your plan changes every two weeks" },
    { ar: "متابعة القياسات", en: "Your measurements are tracked" },
    { ar: "جروب مباشر مع الدكتورة", en: "A direct group with the doctor" },
  ],
  includes: { ar: "الاشتراك يشمل", en: "The subscription includes" },
  plus: { ar: "وكمان في الاشتراك الفردي", en: "The private subscription also includes" },
  enquire: { ar: "اسأل عن الاشتراك", en: "Ask about the subscription" },
};

function dashboardProducts(c) {
  if (Array.isArray(c.digital)) return c.digital;
  return Array.isArray(c.digital?.products) ? c.digital.products : [];
}

function productFor(c, slug) {
  const fallback = PRODUCT_FALLBACKS.find((product) => product.slug === slug);
  const dashboard = dashboardProducts(c).find((product) => t(product?.slug, "en") === slug);
  return dashboard ? { ...fallback, ...dashboard, slug } : fallback;
}

function productImage({ product, locale, depth }) {
  const image = t(product?.image, locale);
  if (image) {
    return `<div class="arch arch--ruled arch--tall">
      <img src="${esc(asset(depth, image))}" alt="${esc(t(product?.imageAlt, locale) || t(product?.name, locale))}" width="700" height="875" loading="eager" decoding="async">
    </div>`;
  }
  return `<div class="arch arch--ruled arch--tall">
    <div class="doctor-placeholder" role="img" aria-label="${esc(t(product?.name, locale))}">${icon(t(product?.icon, locale) || "book")}</div>
  </div>
  <!-- TODO(clinic): supply approved product artwork from the dashboard -->`;
}

function productCard({ c, locale, depth, product }) {
  const slug = t(product.slug, locale);
  return `<article class="card card--product" data-reveal>
    ${when(product.sample, `<span class="badge-sample">${esc(t(c.site.ui.sample, locale))}</span>`)}
    <div class="card__body">
      <span class="chip chip--gold">${icon(t(product.icon, locale) || "book")} ${esc(t(COPY.service, locale))}</span>
      <h2 class="card__title"><a class="card__link" href="${esc(link(depth, `digital/${slug}.html`))}">${esc(t(product.name, locale))}</a></h2>
      <p class="card__text">${esc(t(product.short, locale))}</p>
      <p class="card__price"><small>${esc(t(c.site.ui.priceOnConsult, locale))}</small></p>
      <div class="card__foot"><span class="link-cta">${esc(t(COPY.viewService, locale))} ${icon("arrow")}</span></div>
    </div>
  </article>`;
}

function recipeBookPage({ c, locale, product }) {
  const depth = 1;
  const pagePath = "digital/recipe-book.html";
  const inside = ta(product.inside, locale);
  const audience = ta(product.audience, locale);
  const faq = ta(product.faq, locale);
  const body = `
<section class="section section--tight">
  <div class="wrap">
    ${crumbs({
      c, locale, depth,
      trail: [
        { label: t(COPY.digital, locale), href: "digital/" },
        { label: t(product.name, locale) },
      ],
    })}
    <div class="grid grid-2" style="align-items:center;gap:clamp(2rem,6vw,5rem);margin-top:2rem">
      <div>${productImage({ product, locale, depth })}</div>
      <div>
        ${when(product.sample, `<span class="badge-sample" style="position:static">${esc(t(c.site.ui.sample, locale))}</span>`)}
        <p class="eyebrow">${esc(t(COPY.service, locale))}</p>
        <h1 class="h1" style="margin-top:.7rem">${esc(t(product.name, locale))}</h1>
        <p class="lede" style="margin-top:1rem">${esc(t(product.lede, locale))}</p>
        <h2 class="h4" style="margin-top:2rem">${esc(t(COPY.whatsInside, locale))}</h2>
        <ul class="prose" style="margin-top:.75rem">
          ${map(inside, (item) => `<li>${icon("check")} ${esc(t(item, locale))}</li>`)}
        </ul>
        <p class="card__price" style="margin-top:1.5rem"><small>${esc(t(c.site.ui.priceOnConsult, locale))}</small></p>
        <div class="cluster" style="margin-top:1rem">
          <a class="btn btn--whatsapp btn--lg" href="${esc(t(c.site.contact.whatsapp.href, locale))}" target="_blank" rel="noopener">${icon("whatsapp")} ${esc(t(COPY.order, locale))}</a>
          <a class="btn btn--ghost btn--lg" href="${esc(link(depth, "patients/booking.html"))}">${esc(t(c.site.ui.bookNow, locale))}</a>
        </div>
        ${when(product.freeSample && product.freeSample.url, `<div class="notice" style="margin-top:1.25rem">
          ${icon("book")}
          <div>
            <p>${esc(t(product.freeSample.text, locale))}</p>
            ${/* The free sample is the lowest-commitment thing on the page, so
                  it gets a button rather than a link buried under two of them. */""}
            <p style="margin-top:.85rem">
              <a class="btn btn--accent" href="${esc(/^[a-z]+:/i.test(product.freeSample.url) ? product.freeSample.url : asset(depth, product.freeSample.url.replace(/^\//, "")))}" target="_blank" rel="noopener">
                ${icon("book")} ${esc(t(product.freeSample.label, locale))}
              </a>
            </p>
          </div>
        </div>`)}
        <p class="u-sm u-muted" style="margin-top:1rem">${esc(t(COPY.orderNote, locale))}</p>
      </div>
    </div>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap">
    ${sectionHead({ eyebrow: t(COPY.sampleEyebrow, locale), title: t(COPY.sampleTitle, locale), lede: t(COPY.sampleText, locale) })}
    <div class="card" data-reveal>
      <div class="card__body">
        <div class="grid grid-3">
          ${map(COPY.sampleList, (item) => `<div><span class="chip chip--gold">${icon("check")} ${esc(t(item, locale))}</span></div>`)}
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({ title: t(COPY.forWhom, locale) })}
    <div class="grid grid-3">
      ${map(audience, (item) => `<article class="card" data-reveal><div class="card__body"><span class="chip">${icon("heart")}</span><h3 class="h4">${esc(t(item, locale))}</h3></div></article>`)}
    </div>
  </div>
</section>

${when(faq.length, `<section class="section section--tint">
  <div class="wrap wrap--narrow">
    ${sectionHead({ title: t({ ar: "أسئلة شائعة عن الكتاب", en: "Recipe book questions" }, locale) })}
    ${faqList({ c, locale, items: faq, idPrefix: "recipe-book" })}
  </div>
</section>`)}


`;

  return {
    path: `${locale}/${pagePath}`,
    html: page({
      c, locale, depth, pagePath,
      title: t(product.name, locale),
      description: t(product.short, locale),
      active: "digital",
      body,
      schema: faqSchema(faq, locale) || undefined,
    }),
  };
}

function formatCard({ c, locale, title, summary = null, items, extras = [], accent = false }) {
  return `<article class="card card--product" data-reveal>
    <div class="card__body">
      <span class="chip ${accent ? "chip--gold" : ""}">${icon(accent ? "user" : "heart")} ${esc(t(COPY.service, locale))}</span>
      <h2 class="h3">${esc(t(title, locale))}</h2>
      ${when(summary, `<p class="card__text">${esc(t(summary, locale))}</p>`)}
      <p class="card__price"><small>${esc(t(c.site.ui.priceOnConsult, locale))}</small></p>
      <h3 class="h4">${esc(t(COPY.includes, locale))}</h3>
      <ul class="prose">
        ${map(items, (item) => `<li>${icon("check")} ${esc(t(item, locale))}</li>`)}
      </ul>
      ${when(extras.length, `<h3 class="h4" style="margin-top:1rem">${esc(t(COPY.plus, locale))}</h3>
      <ul class="prose">
        ${map(extras, (item) => `<li>${icon("check")} ${esc(t(item, locale))}</li>`)}
      </ul>`)}
      <div class="card__foot">
        <a class="btn btn--whatsapp btn--block" href="${esc(t(c.site.contact.whatsapp.href, locale))}" target="_blank" rel="noopener">${icon("whatsapp")} ${esc(t(COPY.enquire, locale))}</a>
      </div>
    </div>
  </article>`;
}

function onlineDietPage({ c, locale, product }) {
  const depth = 1;
  const pagePath = "digital/online-diet.html";
  const body = `
${pageHero({
    c, locale, depth,
    eyebrow: t(COPY.digital, locale),
    title: t(COPY.programme, locale),
    text: t(product.lede, locale),
    trail: [
      { label: t(COPY.digital, locale), href: "digital/" },
      { label: t(product.name, locale) },
    ],
    actions: `<a class="btn btn--whatsapp btn--lg" href="${esc(t(c.site.contact.whatsapp.href, locale))}" target="_blank" rel="noopener">${icon("whatsapp")} ${esc(t(COPY.enquire, locale))}</a>
      <a class="btn btn--on-dark btn--lg" href="${esc(link(depth, "patients/booking.html"))}">${esc(t(c.site.ui.bookNow, locale))}</a>`,
    art: "digital"})}

${when(product.sample, `<section class="section section--tight"><div class="wrap"><span class="badge-sample" style="position:static">${esc(t(c.site.ui.sample, locale))}</span></div></section>`)}

<section class="section">
  <div class="wrap">
    ${sectionHead({ title: t(COPY.formatsTitle, locale), lede: t(COPY.formatsText, locale) })}
    <div class="grid grid-2">
      ${(Array.isArray(product.formats) && product.formats.length)
        // Prefer the clinic's own description of each subscription format
        // (content/digital.json), which is transcribed from its price sheet.
        ? map(product.formats, (f, i) => formatCard({
            c, locale,
            title: f.name,
            summary: f.summary,
            items: (t(f.includes, locale) || []).map((x) => ({ ar: x, en: x })),
            accent: i === 0,
          }))
        : `${formatCard({ c, locale, title: COPY.privateName, items: COPY.sharedIncludes, extras: COPY.privateExtras, accent: true })}
           ${formatCard({ c, locale, title: COPY.groupName, items: COPY.sharedIncludes })}`}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap wrap--narrow">
    ${sectionHead({ title: t(COPY.relationTitle, locale), lede: t(COPY.relationText, locale) })}
    <div class="cluster">
      <a class="btn btn--primary" href="${esc(link(depth, "patients/booking.html"))}">${esc(t(c.site.ui.bookNow, locale))}</a>
      <a class="btn btn--whatsapp" href="${esc(t(c.site.contact.whatsapp.href, locale))}" target="_blank" rel="noopener">${icon("whatsapp")} ${esc(t(c.site.ui.whatsapp, locale))}</a>
    </div>
  </div>
</section>


`;

  return {
    path: `${locale}/${pagePath}`,
    html: page({
      c, locale, depth, pagePath,
      title: t(product.name, locale),
      description: t(product.short, locale),
      active: "digital",
      body,
    }),
  };
}

function hubPage({ c, locale, products }) {
  const depth = 1;
  const pagePath = "digital/index.html";
  const body = `
${pageHero({
    c, locale, depth,
    eyebrow: t(COPY.digital, locale),
    title: t(COPY.hubTitle, locale),
    text: t(COPY.hubText, locale),
    art: "digital"})}

<section class="section">
  <div class="wrap">
    <div class="grid grid-2">
      ${map(products, (product) => productCard({ c, locale, depth, product }))}
    </div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap wrap--narrow">
    ${sectionHead({
      eyebrow: t(COPY.digital, locale),
      title: t(COPY.relationTitle, locale),
      lede: t(COPY.relationText, locale),
      center: true,
    })}
    <div class="cluster" style="justify-content:center">
      <a class="btn btn--primary" href="${esc(link(depth, "patients/booking.html"))}">${esc(t(c.site.ui.bookNow, locale))}</a>
    </div>
  </div>
</section>

${ctaBand({ c, locale, depth })}
`;

  return {
    path: `${locale}/${pagePath}`,
    html: page({
      c, locale, depth, pagePath,
      title: t(COPY.digital, locale),
      description: t(COPY.hubText, locale),
      active: "digital",
      body,
    }),
  };
}

export function pages({ c, locale }) {
  const products = PRODUCT_FALLBACKS.map((fallback) => productFor(c, fallback.slug));
  const recipeBook = products.find((product) => product.slug === "recipe-book");
  const onlineDiet = products.find((product) => product.slug === "online-diet");
  return [
    hubPage({ c, locale, products }),
    recipeBookPage({ c, locale, product: recipeBook }),
    onlineDietPage({ c, locale, product: onlineDiet }),
  ];
}
