/* ========================================================================== 
   About, technology, reviews and results pages
   ========================================================================== */

import { t, ta, esc, link, asset, icon, map, when, published, responsiveAttrs, IMAGE_SIZES } from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import {
  pageHero, sectionHead, reviewCard, ratingSummary, beforeAfter,
  ctaBand, statStrip,
} from "../lib/components.mjs";
import { beforeAfterPairs, reviewMediaSections } from "../lib/components.mjs";

const STORY = {
  ar: [
    "قصة لاروز بتبدأ من فكرة بسيطة: المريضة مش مجموعة أعراض منفصلة، والخطة الصح ما ينفعش تتكتب قبل ما نفهم الصورة كلها. إحنا مركز طبي متعدد التخصصات في المعادي الجديدة، لكن وجود الأقسام تحت سقف واحد مش هو المهم لوحده. المهم إن الأقسام دي تتكلم مع بعض لما حالتك تحتاج أكتر من زاوية، وإن كل قرار يفضل مرتبط بالكشف والفحص والتحاليل، مش بافتراض جاهز بيتكرر مع كل الناس.",
    "ده بيبان بوضوح في الكشف المتكامل بين التغذية العلاجية والباطنة. زيادة الوزن ممكن تيجي جنب أعراض في الجهاز الهضمي أو الكبد أو الغدة، وعشان كده التقييم الغذائي وكشف الباطنة بيتجمعوا في زيارة واحدة لما الحالة تحتاج ده. أخصائي التغذية وأخصائي الباطنة بيشوفوا نفس الصورة، والسونار على البطن ممكن يتعمل في نفس الزيارة بواسطة الأخصائي. بدل ما تروح لمواعيد متفرقة وتحاول تربط الكلام بنفسك، الخطة بتتبني بين القسمين.",
    "وفي التغذية، البداية مش رقم الميزان. تحليل التركيب الجسمي بجهاز InBody موجود في كل زيارة عشان نعرف توزيع الدهون والعضلات والمياه، ونقارن التغيير في جسمك مش الوزن الكلي بس. بنراجع كمان تاريخك الصحي وتحاليلك وشكل يومك الحقيقي. المعلومات دي هي اللي بتحدد الخطة المكتوبة اللي تخرج بيها، وهي اللي بتخلّي الاختيارات والكميات مرتبطة بحالتك وحياتك انت، مش بنظام مطبوع اتعمل لشخص غيرك.",
    "الخطة كمان مش ورقة بتتسلّم وتنتهي. المتابعة الأسبوعية جزء أساسي من طريقة الشغل، لأن استجابة الجسم والقدرة على الالتزام بيختلفوا من أسبوع للتاني. في كل متابعة بيتعمل تحليل InBody جديد، وبتتراجع أي تحاليل جديدة، وبعدها الخطة أو الجرعة بتتظبط حسب النتايج الفعلية. الهدف إن الخطة تفضل قابلة للتنفيذ وإن التعديل يحصل بناءً على اللي جسمك عمله فعلاً، مش على توقعات بعيدة عن يومك.",
    "وجود ثمانية تخصصات طبية تحت سقف واحد بيسمح بالمشاورة وقت ما تكون مفيدة للحالة. التغذية ممكن تحتاج رأي الباطنة، ومشكلة في البشرة أو الشعر ممكن يكون ليها جانب غذائي أو داخلي. الفكرة مش إن كل مريض لازم تلف على الأقسام، ولا إن كثرة الخدمات معناها كثرة الإجراءات. الفكرة إن التخصص المناسب يبقى متاح، وإن الإحالة تحصل لما يكون لها سبب واضح، من غير ما تتحمّل مسؤولية تنسيق الصورة الطبية لوحدك.",
    "الصراحة عندنا جزء من الرعاية. كشف التغذية نفسه بيقولها بوضوح: مش هنرشح لك حاجة انت مش محتاجاها، ولو طريق تاني أنسب لحالتك هنقولك. ده مهم لأن القرار الطبي مش قائمة خدمات لازم تختار منها. هو نتيجة تقييم حقيقي وحدود واضحة وتوقعات واقعية. وجود جهاز أو جلسة أو علاج في العيادة ما يخليش استخدامه مناسب لكل شخص؛ حالتك هي اللي تحدد، والطبيب يشرح لك القرار قبل البداية.",
    "تقييم 5.0 على Google من 137 مراجعة هو علامة بنعتز بيها، لكنه مش بديل عن الطريقة اللي اتبنى عليها. الثقة بتتكوّن في التفاصيل الصغيرة المتكررة: وقت كفاية لسماع الشكوى، مراجعة التحاليل، فحص فعلي، وخطة مفهومة تقدر تناقشها. وإحنا بنشوف التقييم كمسؤولية تحافظ على نفس المستوى في كل زيارة، مش كجملة دعائية أو وعد بنتيجة واحدة لكل الناس، لأن الاستجابة بتفضل مختلفة من حالة للتانية.",
    "لاروز بالنسبة لنا مكان تبدأ فيه الرعاية بالفهم وتكمل بالمتابعة. من أول الحجز، المطلوب إنك تعرف إيه اللي هيحصل وليه، وإنك تسأل عن أي حاجة مش واضحة. ومن أول قياس لحد المتابعة الأسبوعية، الصورة تفضل واحدة قدام الفريق وقدامك. إحنا موجودين عشان نساعدك توصل لخطة مبنية على جسمك وتاريخك واحتياجك الحقيقي، ومع كل خطوة يفضل المبدأ ثابت: علاج الحالة، ومشاورة التخصصات عند الحاجة، وعدم ترشيح حاجة مش لازمة.",
  ],
  en: [
    "The La Rose story begins with a simple idea: a patient is not a collection of separate symptoms, and the right plan cannot be written before the whole picture is understood. We are a multi-specialty medical centre in New Maadi. What matters is that the departments speak to one another when a case needs more than one perspective, and that every decision remains grounded in a consultation, an examination and the available labs rather than a template repeated for everyone.",
    "You can see that in the integrated clinical-nutrition and internal-medicine consultation. Weight gain can sit alongside digestive, liver or thyroid symptoms, so the nutritional assessment and internal-medicine examination can be brought together in one visit. The nutrition and internal-medicine specialists look at the same picture, and an abdominal ultrasound can be performed by the specialist during that visit. Instead of attending disconnected appointments and trying to reconcile the advice yourself, one plan is built between the two departments.",
    "In nutrition, the starting point is not a number on the scales. An InBody body-composition analysis is included at every visit so the team can see the distribution of fat, muscle and water and compare changes in composition, not simply total weight. Your medical history, labs and the real shape of your day are reviewed as well. That information determines the written plan you take away and keeps its choices and portions connected to your own health and life, rather than to a sheet originally made for somebody else.",
    "The plan is not a page handed over and forgotten. Weekly follow-up is a core part of the way the service works because the body's response, and what is practical to sustain, can differ from one week to the next. A fresh InBody analysis is taken at every follow-up, any new labs are reviewed, and the plan or dose is then adjusted to the actual results. The aim is to keep the plan workable and to base each change on what your body has done, rather than on expectations detached from daily life.",
    "Having eight medical specialties under one roof makes consultation between departments possible when it is useful. Nutrition may need an internal-medicine view; a concern involving skin or hair may have a nutritional or internal aspect. This does not mean every patient is sent around several departments, and more services do not mean more procedures. It means the relevant specialty is available and a referral can happen for a clear reason, without leaving you to coordinate a complex medical picture by yourself.",
    "Honesty is part of the care. The nutrition consultation states it plainly: we will not recommend something you do not need, and if a different route suits your case better, we will tell you. A medical decision is not a menu of services from which you are expected to buy. It follows a real assessment, clear boundaries and realistic expectations. The fact that a device, session or treatment is available at the clinic does not make it appropriate for everyone; your case determines that, and the doctor explains the decision before anything begins.",
    "A 5.0 Google rating from 138 reviews is something we value, but it is not a substitute for the work behind it. Trust is made in repeated details: time to hear the concern, a review of the labs, an actual examination and a plan that is clear enough to discuss. We see the rating as a responsibility to preserve that standard at every visit, not as a slogan or a promise of one result for everybody, because each person's response will always be different.",
    "For us, La Rose is a place where care begins with understanding and continues through follow-up. From the first measurement to the weekly review, you and the team should be looking at the same picture. We are here to help you reach a plan built around your body, history and genuine need, with one principle kept throughout: treat the case, involve other departments when needed, and never recommend something unnecessary.",
  ],
};

const VALUES = [
  {
    icon: "stethoscope",
    title: { ar: "الكشف قبل الخطة", en: "Consultation before a plan" },
    text: { ar: "التاريخ الصحي والتحاليل والفحص بييجوا الأول؛ الخطة نتيجة للتقييم، مش نقطة البداية.", en: "History, labs and examination come first; the plan is the result of assessment, not the starting point." },
  },
  {
    icon: "activity",
    title: { ar: "صورة واحدة بين الأقسام", en: "One picture across departments" },
    text: { ar: "التخصصات بتتشاور مع بعض لما حالتك تحتاج ده، عشان يتعالج السبب مش عرض منفصل.", en: "Specialties confer when your case needs it, so the cause is considered rather than an isolated symptom." },
  },
  {
    icon: "check",
    title: { ar: "الاحتياج الحقيقي", en: "Genuine need" },
    text: { ar: "مش بنرشح حاجة انت مش محتاجاها، ولو طريق تاني أنسب لحالتك بنقولك بوضوح.", en: "We do not recommend something you do not need, and we say clearly when another route suits your case better." },
  },
  {
    icon: "calendar",
    title: { ar: "متابعة بتتغيّر معاك", en: "Follow-up that adapts" },
    text: { ar: "المراجعة الأسبوعية بتخلّي الخطة تتظبط حسب استجابة جسمك واللي قدرت تطبقه فعلاً.", en: "Weekly review keeps the plan aligned with your body's response and what you were genuinely able to follow." },
  },
];

function storyPage({ c, locale }) {
  const depth = 1;
  const branches = published(c.branches);
  const maadi = branches.find((b) => b.isPrimary) || branches[0];
  const photo = maadi?.photos?.[0];
  const body = `
${pageHero({
  c, locale, depth,
  eyebrow: t({ ar: "عن لاروز", en: "About La Rose" }, locale),
  title: t({ ar: "الرعاية بتبدأ لما نفهم الصورة كلها", en: "Care begins when we understand the whole picture" }, locale),
  text: t({
    ar: "مركز طبي متعدد التخصصات في المعادي الجديدة، بخطة مبنية على كشف حقيقي وأقسام بتتشاور مع بعض وقت ما حالتك تحتاج.",
    en: "A multi-specialty medical centre in New Maadi, with plans built from a real consultation and departments that confer when your case needs it.",
  }, locale),
  trail: [{ label: t({ ar: "قصتنا", en: "Our story" }, locale), href: "about/index.html" }],
  art: "about"})}

<section class="section">
  <div class="wrap">
    ${statStrip({ c, locale, cls: "grid grid-4" })}
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap">
    <div class="grid grid-2" style="align-items:start;gap:clamp(2rem,5vw,4.5rem)">
      <div class="prose" data-reveal>
        ${map(ta(STORY, locale), (paragraph) => `<p>${esc(paragraph)}</p>`)}
      </div>
      ${when(photo, `<div data-reveal style="position:sticky;top:7rem">
        <div class="arch arch--ruled arch--tall">
          <img src="${asset(depth, photo.src)}"${responsiveAttrs(photo.src, IMAGE_SIZES.grid2, (path) => asset(depth, path))} alt="${esc(t(photo.alt, locale))}" width="600" height="750" loading="lazy" decoding="async">
        </div>
      </div>`)}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "مبادئنا", en: "Our values" }, locale),
      title: t({ ar: "أربع حاجات بتوجّه كل زيارة", en: "Four principles behind every visit" }, locale),
      lede: t({ ar: "القيمة الحقيقية مش في عدد الخدمات، لكن في إزاي وإمتى بنستخدمها.", en: "The real value is not in the number of services, but in how and when they are used." }, locale),
    })}
    <div class="grid grid-4">
      ${map(VALUES, (value) => `<article class="card" data-reveal>
        <div class="card__body">
          <span class="chip">${icon(value.icon)} ${esc(t(value.title, locale))}</span>
          <h3 class="h4" style="margin-top:1rem">${esc(t(value.title, locale))}</h3>
          <p class="card__text">${esc(t(value.text, locale))}</p>
        </div>
      </article>`)}
    </div>
  </div>
</section>

${ctaBand({ c, locale, depth })}

`;

  return {
    path: `${locale}/about/index.html`,
    html: page({
      c, locale, depth, pagePath: "about/index.html",
      title: t({ ar: "عن عيادات لاروز", en: "About La Rose" }, locale),
      description: t({
        ar: "قصة عيادات لاروز التخصصية وطريقتنا في الكشف المتكامل بين التغذية والباطنة، تحليل InBody، والمتابعة الأسبوعية في المعادي الجديدة.",
        en: "The story and approach of La Rose Wellness Hub: integrated nutrition and internal-medicine consultations, InBody analysis and weekly follow-up in New Maadi.",
      }, locale),
      active: "about",
      body,
    }),
  };
}

function technologyPage({ c, locale }) {
  const depth = 1;
  const specialties = published(c.specialties);
  const nutrition = specialties.find((sp) => sp.slug === "clinical-nutrition");
  const contouring = specialties.find((sp) => sp.slug === "body-contouring");
  const internal = specialties.find((sp) => sp.slug === "internal-medicine");
  const nutritionConsultation = (nutrition?.treatments || []).find((item) => item.slug === "nutrition-consultation");
  const inBodyText = t(nutritionConsultation?.body, locale);
  const contouringMeasurement = ta(nutritionConsultation?.facts, locale)[1] || "";
  const ultrasound = (internal?.treatments || []).find((item) => item.slug === "internal-medicine-consultation");
  const devices = contouring?.treatments || [];

  const body = `
${pageHero({
  c, locale, depth,
  eyebrow: t({ ar: "التقنيات والأجهزة", en: "Technology and equipment" }, locale),
  title: t({ ar: "كل جهاز له دور محدد في الخطة", en: "Every device has a defined role in the plan" }, locale),
  text: t({
    ar: "الأجهزة مش خطة لوحدها. استخدامها بيتحدد بعد التقييم، وبنشرح لك دور كل قياس أو جلسة في حالتك.",
    en: "Equipment is not a plan by itself. Its use is decided after assessment, with the role of each measurement or session explained for your case.",
  }, locale),
  trail: [
    { label: t({ ar: "عن لاروز", en: "About" }, locale), href: "about/" },
    { label: t({ ar: "التقنيات والأجهزة", en: "Technology" }, locale), href: "about/technology.html" },
  ],
  art: "about-technology"})}

<section class="section">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "داخل الكشف", en: "Within the consultation" }, locale),
      title: t({ ar: "قياسات وفحص يكملوا الصورة", en: "Measurements and examination that complete the picture" }, locale),
    })}
    <div class="grid grid-3">
      ${when(inBodyText, `<article class="card" data-reveal><div class="card__body">
        <span class="chip">${icon("activity")} ${esc(t("InBody", locale))}</span>
        <h3 class="h4" style="margin-top:1rem">${esc(t({ ar: "تحليل التركيب الجسمي InBody", en: "InBody body-composition analysis" }, locale))}</h3>
        <p class="card__text">${esc(inBodyText)}</p>
      </div></article>`)}
      ${when(contouringMeasurement, `<article class="card" data-reveal><div class="card__body">
        <span class="chip">${icon("scale")} ${esc(t({ ar: "قياس", en: "Measurement" }, locale))}</span>
        <h3 class="h4" style="margin-top:1rem">${esc(t({ ar: "قياس body contouring", en: "Body-contouring measurement" }, locale))}</h3>
        <p class="card__text">${esc(contouringMeasurement)}</p>
      </div></article>`)}
      ${when(ultrasound, `<article class="card" data-reveal><div class="card__body">
        <span class="chip">${icon("stethoscope")} ${esc(t({ ar: "في نفس الزيارة", en: "In the same visit" }, locale))}</span>
        <h3 class="h4" style="margin-top:1rem">${esc(t(ultrasound.name, locale))}</h3>
        <p class="card__text">${esc(t(ultrasound.body, locale))}</p>
      </div></article>`)}
    </div>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "نحت الجسم", en: "Body contouring" }, locale),
      title: t({ ar: "الأجهزة الأربعة المتاحة", en: "The four available contouring treatments" }, locale),
      lede: t(contouring?.intro, locale),
    })}
    <div class="grid grid-2">
      ${map(devices, (device) => `<article class="card" data-reveal>
        <div class="card__body">
          <span class="chip">${icon("waves")} ${esc(t(device.summary, locale))}</span>
          <h3 class="h3" style="margin-top:1rem">${esc(t(device.name, locale))}</h3>
          <p class="card__text">${esc(t(device.body, locale))}</p>
        </div>
      </article>`)}
    </div>
  </div>
</section>

`;

  return {
    path: `${locale}/about/technology.html`,
    html: page({
      c, locale, depth, pagePath: "about/technology.html",
      title: t({ ar: "التقنيات والأجهزة", en: "Technology and equipment" }, locale),
      description: t({
        ar: "تعرف على تحليل InBody وقياسات نحت الجسم والسونار وأجهزة الكافيتيشن وRF والكرايو والميزوثيرابي المتاحة في عيادات لاروز.",
        en: "Learn about InBody analysis, body-contouring measurements, ultrasound, cavitation, RF, cryolipolysis and mesotherapy at La Rose.",
      }, locale),
      active: "about",
      body,
    }),
  };
}

function reviewsPage({ c, locale }) {
  const depth = 1;
  const reviews = (c.reviews.reviews || []).filter((review) => review.published !== false);
  const body = `
${pageHero({
  c, locale, depth,
  eyebrow: t({ ar: "آراء العملاء", en: "Patient reviews" }, locale),
  title: t({ ar: "تجارب منشورة من عملاء لاروز", en: "Published experiences from La Rose patients" }, locale),
  text: t({
    ar: "بننشر الرأي بعد المراجعة، وأي محتوى توضيحي بيتعلّم بوضوح إنه مثال مش تجربة حقيقية.",
    en: "Reviews are moderated before publication, and any illustrative content is clearly marked as a sample rather than a real experience.",
  }, locale),
  trail: [
    { label: t({ ar: "عن لاروز", en: "About" }, locale), href: "about/" },
    { label: t({ ar: "آراء العملاء", en: "Patient reviews" }, locale), href: "about/reviews.html" },
  ],
  art: "about-results"})}

<section class="section">
  <div class="wrap">
    ${ratingSummary({ c, locale, depth })}
    <div class="section" style="padding-block:clamp(2rem,1.5rem+2vw,3rem)">

    </div>
    ${when(reviews.length, `<div class="grid grid-3" style="margin-top:2rem">
      ${map(reviews, (review) => reviewCard({ c, locale, r: review }))}
    </div>`)}
    ${when(!reviews.length, `<div class="card u-center" style="margin-top:2rem" data-reveal>
      <div class="card__body">
        <h2 class="h3">${esc(t({ ar: "مفيش آراء منشورة هنا لسه", en: "There are no reviews published here yet" }, locale))}</h2>
        <p class="lede" style="margin-top:1rem">${esc(t({
          ar: "تقدر تقرا مراجعات العيادة على Google، وتجارب العملاء بالفيديو معروضة تحت.",
          en: "You can read the current reviews on Google or watch patient experiences on YouTube.",
        }, locale))}</p>
      </div>
    </div>`)}
    <div class="cluster" style="margin-top:2rem;justify-content:center">
      <a class="btn btn--ghost" href="${esc(c.site.proof.rating.url)}" target="_blank" rel="noopener">${icon("google")} ${esc(t({ ar: "مراجعات Google", en: "Google reviews" }, locale))}</a>
      <a class="btn btn--ghost" href="${esc(link(depth, "about/video-testimonials.html"))}">${icon("youtube")} ${esc(t({ ar: "تجارب العملاء بالفيديو", en: "Video testimonials" }, locale))}</a>
    </div>
  </div>
</section>

${/* The videos and the feedback screenshots. Rendered directly rather than
      through reviewTopics(), which is how they were lost once the topics panel
      came out. The copy above tells the reader they are below, so they are. */""}
${when(reviewMediaSections({ c, locale, depth }), `<section class="section">
  <div class="wrap">
    ${reviewMediaSections({ c, locale, depth })}
  </div>
</section>`)}

<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    ${sectionHead({
      eyebrow: t({ ar: "تجربتك تفرق", en: "Your experience matters" }, locale),
      title: t({ ar: "إزاي تسيب مراجعة", en: "How to leave a review" }, locale),
      lede: t({
        ar: "افتح صفحة لاروز على Google من الزر، واختار كتابة مراجعة. اكتب تجربتك بصراحة وبالقدر اللي ترتاح له من التفاصيل.",
        en: "Open the La Rose listing on Google using the button, choose the option to write a review, and share your experience honestly with only the detail you are comfortable making public.",
      }, locale),
    })}
    <a class="btn btn--primary" href="${esc(c.site.proof.rating.url)}" target="_blank" rel="noopener">${icon("google")} ${esc(t({ ar: "اكتب مراجعة على Google", en: "Leave a Google review" }, locale))}</a>
  </div>
</section>`;

  return {
    path: `${locale}/about/reviews.html`,
    html: page({
      c, locale, depth, pagePath: "about/reviews.html",
      title: t({ ar: "آراء العملاء", en: "Patient reviews" }, locale),
      description: t({
        ar: "اقرا آراء عملاء عيادات لاروز وتقييمنا 5.0 على Google من 137 مراجعة، أو شوف تجاربهم بالفيديو.",
        en: "Read La Rose patient reviews and our 5.0 Google rating from 138 reviews, or watch patient experiences on video.",
      }, locale),
      active: "about",
      body,
    }),
  };
}

function resultsPage({ c, locale }) {
  const depth = 1;
  const body = `
${pageHero({
  c, locale, depth,
  eyebrow: t({ ar: "النتائج", en: "Results" }, locale),
  title: t({ ar: "قبل وبعد", en: "Before and after" }, locale),
  trail: [
    { label: t({ ar: "عن لاروز", en: "About" }, locale), href: "about/" },
    { label: t({ ar: "قبل وبعد", en: "Before and after" }, locale), href: "about/results.html" },
  ],
  art: "about-results"})}

<section class="section">
  <div class="wrap">

    <div class="grid grid-2" style="margin-top:2rem">
      ${map(beforeAfterPairs(c), (pair, index) => beforeAfter({
        c, locale, depth, pair, index,
        label: (published(c.specialties).find((x) => x.slug === pair.specialty) || {}).name,
      }))}
    </div>
    <div class="cluster" style="margin-top:2rem">
      <a class="btn btn--ghost" href="${esc(c.site.social.instagramBeforeAfter)}" target="_blank" rel="noopener">${icon("instagram")} ${esc(t({ ar: "نتائج قبل وبعد على Instagram", en: "Before and after on Instagram" }, locale))}</a>
      <a class="btn btn--ghost" href="${esc(link(depth, "about/video-testimonials.html"))}">${icon("youtube")} ${esc(t({ ar: "تجارب العملاء بالفيديو", en: "Video testimonials" }, locale))}</a>
    </div>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    ${sectionHead({
      eyebrow: t({ ar: "إزاي تقرا صورة قبل وبعد", en: "How to read a before & after" }, locale),
      title: t({ ar: "المقارنة العادلة ليها شروط", en: "A fair comparison has conditions" }, locale),
      lede: t({
        ar: "صور قبل وبعد ممكن تتعرض بطريقة تخلي النتيجة تبان أحسن من حقيقتها، حتى من غير تعديل الصورة نفسها. دي الشروط اللي إحنا ملتزمين بيها، وننصحك تدور عليها وأنت بتختار أي عيادة.",
        en: "Before-and-after photos can be presented in a way that makes the results look better than they really are, even without editing the image itself. These are the standards we follow, and we recommend looking for them when choosing any clinic.",
      }, locale),
    })}
    <ul class="prose" data-reveal>
      ${map([
        { ar: "نفس الإضاءة ونفس المكان ونفس وقت اليوم في الصورتين، الإضاءة الجانبية لوحدها بتغيّر شكل البطن تماماً.", en: "The same lighting, the same place and the same time of day in both frames، side lighting alone completely changes how an abdomen reads." },
        { ar: "نفس الوقفة ونفس زاوية الكاميرا ونفس المسافة، من غير شد بطن ولا لف الجسم.", en: "The same stance, camera angle and distance, with no drawing-in of the stomach and no turning of the body." },
        { ar: "نفس الملابس أو ملابس مشابهة، لبس أغمق أو أضيق بيعمل فرق مش حقيقي.", en: "The same or comparable clothing، darker or tighter clothes create a difference that is not real." },
        { ar: "المدة بين الصورتين مكتوبة، وكمان الخطة اللي المريض مشي عليها.", en: "The interval between the two photographs is stated, and so is the plan the patient followed." },
        { ar: "مفيش أي تعديل على الصورة نفسها، لا فلاتر ولا تنحيف رقمي.", en: "No editing of the image itself: no filters, no digital slimming." },
      ], (li) => `<li>${esc(t(li, locale))}</li>`)}
    </ul>
    <div class="notice" style="margin-top:2rem" data-reveal>
      ${icon("info")}
      <p>${esc(t({
        ar: "وبرضه: الصورة مش دليل طبي. نتيجة شخص مش توقّع لنتيجتك، لأن الحالة الصحية والالتزام ونمط الحياة بيختلفوا من واحد للتاني.",
        en: "And even then: a photograph is not medical evidence. One person's result is not a forecast of yours, because health status, adherence and lifestyle differ from person to person.",
      }, locale))}</p>
    </div>
  </div>
</section>`;

  return {
    path: `${locale}/about/results.html`,
    html: page({
      c, locale, depth, pagePath: "about/results.html",
      title: t({ ar: "النتائج قبل وبعد", en: "Before and after results" }, locale),
      description: t({
        ar: "نتائج قبل وبعد من عيادات لاروز، تُنشر فقط بعد موافقة كتابية من المريض، مع توضيح إن النتائج بتختلف من شخص للتاني.",
        en: "Before and after results from La Rose, published only with written patient consent and with a clear reminder that results vary.",
      }, locale),
      active: "about",
      body,
    }),
  };
}

function videoTestimonialsPage({ c, locale }) {
  const depth = 1;
  const label = t({ ar: "تجارب العملاء بالفيديو", en: "Patient video testimonials" }, locale);
  const description = t({
    ar: "تجارب حقيقية من عملاء لاروز بالفيديو، تقدر تشوفها كلها هنا من غير ما تسيب الموقع.",
    en: "Real patient experiences on video, all playable here without leaving the site.",
  }, locale);
  const body = `
${pageHero({
    c, locale, depth, eyebrow: t({ ar: "آراء العملاء", en: "Patient reviews" }, locale),
    title: label,
    trail: [
      { label: t({ ar: "عن لاروز", en: "About" }, locale), href: "about/" },
      { label: t({ ar: "آراء العملاء", en: "Patient reviews" }, locale), href: "about/reviews.html" },
      { label },
    ],
    art: "reviews"})}

<section class="section">
  <div class="wrap">
    ${reviewMediaSections({ c, locale, depth })}
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap wrap--narrow u-center">
    <h2 class="h3">${esc(t({ ar: "عايز تشوف المزيد؟", en: "Want to see more?" }, locale))}</h2>
    <p class="u-muted" style="margin-top:.7rem">${esc(t({
      ar: "باقي التجارب منشورة على قناة لاروز على يوتيوب.",
      en: "The rest of the testimonials are on the La Rose YouTube channel.",
    }, locale))}</p>
    <p style="margin-top:1.3rem">
      <a class="btn btn--ghost" href="${esc(c.site.social.youtubeTestimonials)}" target="_blank" rel="noopener">
        ${icon("youtube")} ${esc(t({ ar: "شوف الباقي على يوتيوب", en: "Watch the rest on YouTube" }, locale))}
      </a>
    </p>
  </div>
</section>

${ctaBand({ c, locale, depth })}`;
  return {
    path: `${locale}/about/video-testimonials.html`,
    html: page({
      c, locale, depth, pagePath: "about/video-testimonials.html",
      title: label, description, active: "about", body,
    }),
  };
}

export function pages({ c, locale }) {
  return [
    storyPage({ c, locale }),
    technologyPage({ c, locale }),
    reviewsPage({ c, locale }),
    videoTestimonialsPage({ c, locale }),
    resultsPage({ c, locale }),
  ];
}
