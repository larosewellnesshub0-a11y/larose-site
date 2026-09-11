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
    ar: "الطلب والدفع بيتموا على واتساب مع الفريق، وبعد التأكيد هنبعت لك ملف PDF ومعاه لينك سريع للموبايل.",
    en: "Ordering and payment are handled with the team on WhatsApp. Once confirmed, we send a PDF and a quick link for easy phone access.",
  },
  sampleEyebrow: { ar: "شكل الوصفة", en: "A recipe preview" },
  sampleTitle: { ar: "أكل تعرفه، متقدّم بطريقة أسهل", en: "Familiar food, presented more clearly" },
  sampleText: {
    ar: "كل وصفة بتقدّم فكرة من أكل البيت في شكل عملي، مع السعرات والماكروز عشان يبقى عندك مرجع واضح وإنت بتختار.",
    en: "Each recipe presents a familiar home-cooked idea in a practical format, with calories and macros so you have a clear reference when choosing what to eat.",
  },
  sampleList: [
    { ar: "مكونات مألوفة ومتاحة", en: "Familiar, accessible ingredients" },
    { ar: "طريقة عملية ترجع لها بسهولة", en: "A practical format that is easy to revisit" },
    { ar: "السعرات والماكروز في مكان واضح", en: "Calories and macros in one clear place" },
    { ar: "وقت التحضير ومستوى السهولة واضحين", en: "Prep time and difficulty stated up front" },
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
  const merged = dashboard ? { ...fallback, ...dashboard, slug } : fallback;
  if (slug !== "recipe-book" || !merged) return merged;
  return {
    ...merged,
    inside: fallback.inside,
    audience: fallback.audience,
    faq: fallback.faq,
  };
}

function productImage({ product, locale, depth }) {
  const image = t(product?.image, locale);
  /* A book is two things to a buyer: what it looks like, and what is inside it.
     One cover photograph only answers the first, so where a product has extra
     views they become slides. Radio inputs drive it, not JavaScript: with the
     script blocked the first slide still shows and the labels still work. */
  const extra = (product?.gallery || []).map((g) => t(g, locale)).filter(Boolean);
  if (image && extra.length) {
    const slides = [image, ...extra];
    const id = `pg-${t(product?.slug, "en") || "product"}`;
    const captions = (product?.galleryCaptions || []).map((cpt) => t(cpt, locale));
    return `<div class="pgal" data-pgal>
      ${slides.map((src, i) => `<input class="pgal__radio" type="radio" name="${esc(id)}" id="${esc(id)}-${i}"${i === 0 ? " checked" : ""}>`).join("")}
      <div class="pgal__stage">
        ${slides.map((src, i) => `<figure class="pgal__slide" data-i="${i}">
          <div class="arch arch--ruled arch--tall">
            <img src="${esc(asset(depth, src))}" alt="${esc(captions[i] || t(product?.imageAlt, locale) || t(product?.name, locale))}" width="700" height="875" loading="${i === 0 ? "eager" : "lazy"}" decoding="async">
          </div>
        </figure>`).join("")}
      </div>
      <div class="pgal__dots">
        ${slides.map((src, i) => `<label class="pgal__dot" for="${esc(id)}-${i}"><span class="u-sr-only">${esc(captions[i] || String(i + 1))}</span></label>`).join("")}
      </div>
    </div>`;
  }
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
      <p class="card__price"><small>${esc(t(product?.priceNote || c.site.ui.priceOnConsult, locale))}</small></p>
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
        <p class="card__price" style="margin-top:1.5rem"><small>${esc(t(product?.priceNote || c.site.ui.priceOnConsult, locale))}</small></p>
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
    ${/* The photograph sits BESIDE this block rather than alone across the page:
          on its own, a 4:5 portrait of a book is a full screen of nothing but
          book, and the reader has to scroll past it to reach the point. */""}
    ${/* Content FIRST, photograph second - the mirror of the block at the top of
          the page, where the photograph leads. Alternating which side carries the
          image keeps the weight from stacking down one edge of the page. The
          photograph also takes the narrower track: it is a 4:5 portrait, so an
          equal split makes it tower over the text beside it. */""}
    <div class="${product.insideImage ? "inside-split" : ""}" style="align-items:center">
      <div>
        ${sectionHead({ eyebrow: t(COPY.sampleEyebrow, locale), title: t(COPY.sampleTitle, locale), lede: t(COPY.sampleText, locale) })}
        <div class="card" data-reveal>
          <div class="card__body">
            <div class="chip-pairs">
              ${map(COPY.sampleList, (item) => `<div><span class="chip chip--gold">${icon("check")} ${esc(t(item, locale))}</span></div>`)}
            </div>
          </div>
        </div>
      </div>
      ${when(product.insideImage, `<figure class="inside-look">
        <img src="${esc(asset(depth, t(product.insideImage, locale)))}" alt="${esc(t({ ar: "كتاب وصفات لاروز مفتوح على منضدة مطبخ، وصفحتاه فيهما وصفتان بصورهما وسعراتهما", en: "The La Rose recipe book open on a kitchen counter, both pages showing a recipe with its photograph and figures" }, locale))}" width="1200" height="1500" loading="lazy" decoding="async">
        <figcaption>${esc(t({ ar: "صفحتان من داخل الكتاب", en: "Two pages from inside the book" }, locale))}</figcaption>
      </figure>`)}
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
