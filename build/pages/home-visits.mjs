/* ========================================================================== 
   Home visits service
   ========================================================================== */

import { t, esc, icon, map } from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import {
  sectionHead, pageHero, faqList, faqSchema,
} from "../lib/components.mjs";

/* Home visits are not running yet. Offering a call and a WhatsApp booking for a
   service that cannot be delivered wastes the reader's time and the reception's,
   so the actions become an invitation to be told when it opens. */
function contactActions({ c, locale }) {
  return `<span class="badge-sample badge-sample--soon">${esc(t(c.site.ui.comingSoon, locale))}</span>
    <a class="btn btn--on-dark btn--lg" href="${esc(t(c.site.contact.whatsapp.href, locale))}" target="_blank" rel="noopener">
      ${icon("whatsapp")} ${esc(t({ ar: "قولنا تحب نبلغك أول ما تبدأ", en: "Tell us and we will let you know when it starts" }, locale))}
    </a>`;
}

function homeVisitsPage({ c, locale }) {
  const depth = 1;
  const s = c.site;
  const title = t(s.ui.homeVisits, locale);
  const patientsLabel = t({ ar: "دليل المريض", en: "Plan your visit" }, locale);
  const suitableFor = [
    {
      title: { ar: "الحركة محدودة", en: "Limited mobility" },
      text: { ar: "لو الخروج من البيت والوصول للعيادة مرهق أو صعب.", en: "When leaving home and reaching the clinic is difficult or exhausting." },
    },
    {
      title: { ar: "متابعة بعد عملية", en: "Post-operative follow-up" },
      text: { ar: "لو الحركة بعد العملية صعبة ومحتاج تعرف هل الزيارة المنزلية مناسبة للمتابعة.", en: "When travel after an operation is difficult and you need to ask whether a home visit is suitable for follow-up." },
    },
    {
      title: { ar: "كبار السن", en: "Older patients" },
      text: { ar: "لو رحلة العيادة نفسها عبء على المريض أو على الأسرة.", en: "When the journey to the clinic is a burden for the patient or their family." },
    },
    {
      title: { ar: "مش قادر توصل المعادي", en: "Unable to travel to Maadi" },
      text: { ar: "لو حالتك أو ظروفك الحالية مانعاك من الوصول للعيادة.", en: "When your condition or current circumstances prevent you from getting to the clinic." },
    },
  ];
  const steps = [
    {
      title: { ar: "كلّمنا الأول", en: "Contact us first" },
      text: {
        ar: "قول لفريق الاستقبال الزيارة لمين، سبب طلبها، والمنطقة اللي موجودة فيها.",
        en: "Tell reception who the visit is for, why you are requesting it and the area you are in.",
      },
    },
    {
      title: { ar: "نأكد التفاصيل", en: "We confirm the details" },
      text: {
        ar: "الفريق هيأكد لك التغطية والتوافر، والتخصص المناسب، وإيه اللي الزيارة بتشمله قبل ما تحجز.",
        en: "The team will confirm coverage, availability, the appropriate specialty and what the visit includes before you book.",
      },
    },
    {
      title: { ar: "جهّز المعلومات المتاحة", en: "Have available information ready" },
      text: {
        ar: "لو عندك تقارير أو تحاليل حديثة أو قائمة بالأدوية، خليها جاهزة عشان تعرضها وقت الزيارة.",
        en: "If you have recent reports, test results or a medication list, keep them ready to share at the visit.",
      },
    },
  ];
  const faqs = [
    {
      q: { ar: "هل الزيارات المنزلية متاحة في منطقتي؟", en: "Are home visits available in my area?" },
      a: {
        ar: "مناطق التغطية لسه مش منشورة على الموقع. كلّمنا على واتساب أو بالتليفون وقول لنا منطقتك، وفريق الاستقبال هيأكد لك التغطية والتوافر قبل الحجز.",
        en: "Coverage areas are not yet published on the website. Message us on WhatsApp or call with your area, and reception will confirm coverage and availability before booking.",
      },
    },
    {
      q: { ar: "أنهي تخصصات متاحة للزيارة المنزلية؟", en: "Which specialties are available for home visits?" },
      a: {
        ar: "التخصصات المتاحة للزيارات المنزلية لسه مش منشورة. اشرح لنا سبب الزيارة وقت الاتصال، والفريق هيأكد لك لو التخصص المناسب متاح للزيارة في البيت.",
        en: "The specialties available for home visits have not yet been published. Tell us the reason for the visit when you contact us, and the team will confirm whether the appropriate specialty can visit at home.",
      },
    },
    {
      q: { ar: "أقدر أحدد يوم ووقت من الموقع؟", en: "Can I choose a day and time on the website?" },
      a: {
        ar: "مواعيد الزيارات المنزلية بتتأكد وقت الاتصال. واتساب أو التليفون هما أسرع طريقة تسأل بيها عن التوافر وتتفق على التفاصيل.",
        en: "Home-visit appointments are confirmed when you contact us. WhatsApp or phone is the quickest way to ask about availability and agree the details.",
      },
    },
    {
      q: { ar: "أجهّز إيه قبل الزيارة؟", en: "What should I prepare before the visit?" },
      a: {
        ar: "قول لفريق الاستقبال سبب طلب الزيارة وأي صعوبة في الحركة أو الوصول. ولو عندك تحاليل أو تقارير حديثة أو قائمة بالأدوية، خليها جاهزة. الفريق هيقول لك لو في أي تجهيزات تانية حسب الزيارة المتفق عليها.",
        en: "Tell reception why you are requesting the visit and about any mobility or access difficulty. If you have recent tests, reports or a medication list, keep them ready. The team will tell you if anything else is needed for the agreed visit.",
      },
    },
  ];

  const body = `
${pageHero({
    c, locale, depth,
    eyebrow: patientsLabel,
    title,
    text: t({
      ar: "الخدمة دي لسه تحت التجهيز وهنبدأها قريباً. لو الوصول للعيادة في المعادي صعب عليك أو على حد من أسرتك، قولنا وهنبلغك أول ما تبدأ.",
      en: "This service is still being prepared and will start soon. If getting to the Maadi clinic is difficult for you or a family member, tell us and we will let you know as soon as it begins.",
    }, locale),
    trail: [
      { label: patientsLabel, href: "patients/" },
      { label: title },
    ],
    actions: contactActions({ c, locale }),
    art: "home-visits"})}

<section class="section">
  <div class="wrap">
    ${sectionHead({
      eyebrow: title,
      title: t({ ar: "رعاية في البيت لما مشوار العيادة يكون صعب", en: "Care at home when the clinic journey is difficult" }, locale),
      lede: t({
        ar: "الزيارة المنزلية هي كشف أو متابعة بتتم في بيت المريض لما الوصول للعيادة يكون صعب. الخدمة لسه تحت التجهيز، والتفاصيل هنعلنها هنا أول ما تبدأ.",
        en: "A home visit is a consultation or follow-up provided at the patient's home when getting to the clinic is difficult. The service is still being prepared, and the details will be announced here as soon as it starts.",
      }, locale),
    })}
    <div class="grid grid-4">
      ${map(suitableFor, (item) => `<article class="card" data-reveal>
        <div class="card__body">
          <span class="chip">${icon("heart")} ${esc(t({ ar: "ممكن تناسب", en: "May suit" }, locale))}</span>
          <h2 class="card__title">${esc(t(item.title, locale))}</h2>
          <p class="card__text">${esc(t(item.text, locale))}</p>
        </div>
      </article>`)}
    </div>
  </div>
</section>

<section class="section section--sunk">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "قبل الحجز", en: "Before booking" }, locale),
      title: t({ ar: "إيه اللي تتوقعه", en: "What to expect" }, locale),
      lede: t({
        ar: "الخطوة الأولى دايماً إننا نفهم احتياج المريض ونأكد إن الزيارة متاحة ومناسبة قبل ترتيبها.",
        en: "The first step is always to understand the patient's need and confirm that a visit is available and appropriate before arranging it.",
      }, locale),
    })}
    <div class="grid grid-3">
      ${map(steps, (step, index) => `<article class="card" data-reveal>
        <div class="card__body">
          <span class="chip">${esc(String(index + 1).padStart(2, "0"))}</span>
          <h2 class="card__title">${esc(t(step.title, locale))}</h2>
          <p class="card__text">${esc(t(step.text, locale))}</p>
        </div>
      </article>`)}
    </div>
  </div>
</section>

<!-- TODO(clinic): coverage areas, hours, what is included, which specialties -->
<section class="section section--tint">
  <div class="wrap wrap--narrow">
    <div class="card" style="padding:clamp(1.5rem,3vw,2.5rem)">
      <div class="stack">
        <p class="eyebrow">${esc(t({ ar: "التوافر والتغطية", en: "Availability and coverage" }, locale))}</p>
        <h2 class="h2">${esc(t({ ar: "أكّد التفاصيل معانا قبل ما ترتب يومك", en: "Confirm the details with us before planning your day" }, locale))}</h2>
        <p class="lede">${esc(t({
          ar: "مناطق التغطية، المواعيد، التخصصات المتاحة، وإيه اللي الزيارة بتشمله مش منشورين لسه. فريق الاستقبال هيأكد لك كل التفاصيل وقت المكالمة أو رسالة واتساب.",
          en: "Coverage areas, appointment times, available specialties and what the visit includes have not yet been published. Reception will confirm every detail when you call or message us on WhatsApp.",
        }, locale))}</p>
        <div class="cluster">
          <a class="btn btn--whatsapp btn--lg" href="${esc(t(s.contact.whatsapp.href, locale))}" target="_blank" rel="noopener">
            ${icon("whatsapp")} ${esc(t(s.ui.whatsapp, locale))}
          </a>
          <a class="btn btn--primary btn--lg" href="tel:${esc(t(s.contact.phone.tel, locale))}">
            ${icon("phone")} ${esc(t(s.ui.callUs, locale))} · <bdi class="num">${esc(t(s.contact.phone.display, locale))}</bdi>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap wrap--narrow">
    ${sectionHead({
      eyebrow: t(s.ui.tabFaq, locale),
      title: t({ ar: "أسئلة عن الزيارات المنزلية", en: "Questions about home visits" }, locale),
    })}
    ${faqList({ c, locale, items: faqs, idPrefix: "home-visits" })}
  </div>
</section>`;

  return {
    path: `${locale}/patients/home-visits.html`,
    html: page({
      c, locale, depth, pagePath: "patients/home-visits.html",
      active: "patients",
      title,
      description: t({
        ar: "اسأل عن الزيارات المنزلية من عيادات لاروز للحالات اللي صعب عليها الوصول للمعادي. التغطية والتوافر وتفاصيل الزيارة بتتأكد بالتليفون أو واتساب.",
        en: "Ask about La Rose home visits for patients who cannot travel to Maadi. Coverage, availability and visit details are confirmed by phone or WhatsApp.",
      }, locale),
      body,
      schema: faqSchema(faqs, locale),
    }),
  };
}

export function pages({ c, locale }) {
  return [homeVisitsPage({ c, locale })];
}
