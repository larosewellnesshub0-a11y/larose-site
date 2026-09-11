/* ========================================================================== 
   Specialty hub and specialty detail pages
   ========================================================================== */

import {
  t, ta, esc, link, asset, icon, map, when, published, doctorsIn, specialtyImage, responsiveAttrs, IMAGE_SIZES,
} from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import {
  sectionHead, pageHero, specialtyCard, doctorCard, reviewCard, ratingSummary,
  faqList, faqSchema, beforeAfter, beforeAfterPairs, resultsGallery, sampleNotice,
  reviewMediaSections,
  finder, ctaBand,
} from "../lib/components.mjs";

function orderedSpecialties(c) {
  return published(c.specialties).slice().sort((a, b) => Number(a.index) - Number(b.index));
}

function heroActions({ c, locale, depth, sp }) {
  const whatsapp = `<a class="btn btn--on-dark" href="${esc(t(c.site.contact.whatsapp.href, locale))}" target="_blank" rel="noopener">
      ${icon("whatsapp")} ${esc(t(c.site.ui.whatsappShort, locale))}
    </a>`;

  /* No doctor yet means no appointment to give. Offering one here sends the
     reader to a booking form where this specialty is marked "قريباً" anyway. */
  if (sp && !sp.staffed) {
    return `<span class="badge-sample badge-sample--soon">${esc(t(c.site.ui.comingSoon, locale))}</span>
    ${whatsapp}`;
  }

  return `<a class="btn btn--accent" href="${link(depth, "patients/booking.html")}">${esc(t(c.site.ui.bookNow, locale))}</a>
    ${whatsapp}`;
}

function specialtyHub({ c, locale, specs }) {
  const depth = 1;
  const specialtyLabel = t({ ar: "التخصصات", en: "Specialties" }, locale);
  const base = `https://${c.site.brand.domain}`;
  const itemList = {
    "@type": "ItemList",
    name: specialtyLabel,
    itemListElement: specs.map((sp, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: t(sp.name, locale),
      item: `${base}/${locale}/specialties/${sp.slug}.html`,
    })),
  };
  const body = `
${pageHero({
    c, locale, depth,
    eyebrow: t(c.site.brand.kind, locale),
    title: specialtyLabel,
    text: t({
      ar: "اختار التخصص اللي يناسب حالتك، ولو مش متأكد ابدأ بالحجز وفريقنا هيساعدك توصل للقسم المناسب.",
      en: "Choose the specialty that fits your needs. If you are unsure where to begin, request an appointment and our team will help direct you.",
    }, locale),
    trail: [{ label: specialtyLabel }],
    art: "specialties"})}

<section class="section">
  <div class="wrap">
    ${sectionHead({
      eyebrow: specialtyLabel,
      title: t({ ar: "رعاية متكاملة من أكتر من زاوية", en: "Integrated care from more than one angle" }, locale),
      lede: t({
        ar: "أقسام لاروز بتشتغل جنب بعض عشان نفهم حالتك كاملة، ونوصلك للكشف أو الخدمة اللي محتاجاها فعلاً.",
        en: "La Rose departments work alongside one another to understand your whole case and guide you to the consultation or service you genuinely need.",
      }, locale),
    })}
    <div class="grid grid-3">
      ${map(specs, (sp) => specialtyCard({ c, locale, depth, sp }))}
    </div>
  </div>
</section>

${finder({ c, locale, depth })}
${ctaBand({ c, locale, depth })}`;

  return {
    path: `${locale}/specialties/index.html`,
    html: page({
      c, locale, depth, pagePath: "specialties/index.html",
      active: "specialties",
      title: specialtyLabel,
      description: t({
        ar: "تخصصات عيادات لاروز في المعادي الجديدة: التغذية العلاجية، إدارة الوزن، نحت الجسم، الباطنة، الجراحة، الجلدية، وطب الأطفال.",
        en: "Explore La Rose Wellness Hub specialties in New Maadi, including clinical nutrition, weight management, internal medicine, surgery and paediatrics.",
      }, locale),
      body,
      schema: itemList,
    }),
  };
}

function tabButton({ id, panelId, label, selected = false }) {
  return `<button class="tab" type="button" role="tab" id="${esc(id)}"
    aria-controls="${esc(panelId)}" aria-selected="${selected ? "true" : "false"}" tabindex="${selected ? "0" : "-1"}">${esc(label)}</button>`;
}

function tabPanel({ id, tabId, body, hidden = false }) {
  return `<div role="tabpanel" id="${esc(id)}" aria-labelledby="${esc(tabId)}"${hidden ? " hidden" : ""} style="margin-top:clamp(2rem,4vw,3.5rem)">
    ${body}
  </div>`;
}

function overviewPanel({ c, locale, depth, sp }) {
  const conditions = ta(sp.treats, locale);
  const treatments = sp.treatments || [];
  // A generated brand frame is picked up automatically once it lands on disk.
  const spImage = sp.image || specialtyImage(sp.slug);
  const hasImage = Boolean(spImage);

  return `<div class="stack">
    <p class="lede">${esc(t(sp.intro, locale))}</p>

    <div class="grid${hasImage ? " grid-2" : ""}" style="align-items:center;margin-top:2.5rem">
      <div>
        <h2 class="h2">${esc(t(c.site.ui.conditionsTreated, locale))}</h2>
        <div class="prose" style="margin-top:1.25rem">
          <ul>${map(conditions, (condition) => `<li>${esc(condition)}</li>`)}</ul>
        </div>
      </div>
      ${when(hasImage, `<div class="arch arch--ruled arch--wide" style="max-width:34rem;margin-inline:auto">
        <img src="${asset(depth, t(spImage, locale))}"${responsiveAttrs(t(spImage, locale), IMAGE_SIZES.capped34, (path) => asset(depth, path))} alt="${esc(t(sp.imageAlt, locale) || t(sp.name, locale))}" width="1200" height="750" loading="lazy" decoding="async">
      </div>`)}
    </div>

    <div style="margin-top:3.5rem">
      ${sectionHead({ title: t(c.site.ui.treatments, locale) })}
      <div class="grid grid-2">
        ${map(treatments, (treatment) => {
          const facts = ta(treatment.facts, locale);
          return `<article class="card" style="padding:clamp(1.25rem,2vw,2rem)">
            <div class="stack">
              <h3 class="h3">${esc(t(treatment.name, locale))}</h3>
              ${when(t(treatment.summary, locale), `<p class="lede">${esc(t(treatment.summary, locale))}</p>`)}
              <div class="prose"><p>${esc(t(treatment.body, locale))}</p></div>
              ${when(facts.length, `<div class="cluster">${map(facts, (fact) => `<span class="chip">${esc(fact)}</span>`)}</div>`)}
            </div>
          </article>`;
        })}
      </div>
    </div>
  </div>`;
}

function doctorsPanel({ c, locale, depth, sp }) {
  const doctors = doctorsIn(c.doctors, sp.slug);
  return `${sectionHead({ title: t(c.site.ui.ourDoctors, locale) })}
    ${when(!sp.staffed, `<div style="margin-bottom:1.5rem">${sampleNotice({ c, locale })}</div>`)}
    <div class="grid grid-4">
      ${map(doctors, (doctor) => doctorCard({ c, locale, depth, d: doctor }))}
    </div>`;
}

function reviewsPanel({ c, locale, depth, sp }) {
  const reviews = (c.reviews.reviews || []).filter(
    (review) => review.published !== false && (review.specialties || []).includes(sp.slug),
  );

  /* The empty state used to send people to YouTube to watch testimonials. The
     clinic has 25 of them and the site can now play them in place, so they go
     here: a short row, with the full set still on the reviews page. */
  /* Nine, not three: the clinic has 25 testimonials and this is the page
     where someone is deciding. Repeats across specialties are fine. */
  const media = reviewMediaSections({ c, locale, depth, limit: 9 });

  return `${sectionHead({ title: t(c.site.ui.tabReviews, locale) })}
    ${ratingSummary({ c, locale, depth })}
    ${media}
    ${reviews.length
      ? `<div class="grid grid-3" style="margin-top:2rem">${map(reviews, (review) => reviewCard({ c, locale, r: review }))}</div>`
      : `<div class="card u-center" style="padding:clamp(1.5rem,3vw,2.5rem);margin-top:2rem">
          <h3 class="h3">${esc(t({ ar: "تحب تسمع من ناس عدّت بنفس التجربة؟", en: "Would you like to hear from people who have been through it?" }, locale))}</h3>
          <p class="lede" style="margin:1rem auto 0">${esc(t({
            ar: "تقييمات العيادة على جوجل مفتوحة للجميع، وتجارب المرضى بالفيديو فوق.",
            en: "The clinic's Google reviews are open to everyone, and the patients' own videos are just above.",
          }, locale))}</p>
          <div class="cluster" style="justify-content:center;margin-top:1.5rem">
            <a class="btn btn--ghost" href="${esc(t(c.site.proof.rating.url, locale))}" target="_blank" rel="noopener">${icon("google")} ${esc(t({ ar: "مراجعات جوجل", en: "Google reviews" }, locale))}</a>
            <a class="btn btn--ghost" href="${esc(link(depth, "about/video-testimonials.html"))}">${icon("youtube")} ${esc(t({ ar: "تجارب العملاء بالفيديو", en: "Patient video testimonials" }, locale))}</a>
          </div>
        </div>`}
    <p class="u-center u-muted" style="margin-top:2rem">
      ${esc(t({ ar: "زرت القسم قبل كده؟", en: "Have you visited this department?" }, locale))}
      <a class="link-cta" href="${link(depth, "patients/booking.html")}">${esc(t(c.site.ui.addReview, locale))} ${icon("arrow")}</a>
    </p>`;
}

function resultsPanel({ c, locale, depth, sp }) {
  const gallery = resultsGallery({ locale, depth, items: sp.results });
  if (gallery) {
    return `${sectionHead({ title: t(c.site.ui.tabResults, locale) })}
      ${gallery}`;
  }
  if (!sp.hasBeforeAfter) return "";

  return `${sectionHead({ title: t(c.site.ui.tabResults, locale) })}

    <div class="grid grid-2" style="margin-top:2rem">
      ${map(beforeAfterPairs(c, sp.slug), (pair, index) => beforeAfter({ c, locale, depth, pair, index }))}
    </div>`;
}

function faqPanel({ c, locale, sp }) {
  return `${sectionHead({ title: t(c.site.ui.tabFaq, locale) })}
    ${faqList({ c, locale, items: sp.faq || [], idPrefix: t(sp.slug, locale) })}`;
}

function specialtyDetail({ c, locale, specs, sp }) {
  const depth = 1;
  const slug = t(sp.slug, locale);
  const specialtyLabel = t({ ar: "التخصصات", en: "Specialties" }, locale);
  const resultsBody = resultsPanel({ c, locale, depth, sp });
  const tabs = [
    { key: "overview", label: t(c.site.ui.tabOverview, locale), body: overviewPanel({ c, locale, depth, sp }) },
    { key: "doctors", label: t(c.site.ui.tabDoctors, locale), body: doctorsPanel({ c, locale, depth, sp }) },
    ...(sp.hasReviews
      ? [{ key: "reviews", label: t(c.site.ui.tabReviews, locale), body: reviewsPanel({ c, locale, depth, sp }) }]
      : []),
    ...(resultsBody
      ? [{ key: "results", label: t(c.site.ui.tabResults, locale), body: resultsBody }]
      : []),
    { key: "faq", label: t(c.site.ui.tabFaq, locale), body: faqPanel({ c, locale, sp }) },
  ];
  const related = specs.filter((candidate) => candidate.slug !== sp.slug).slice(0, 4);
  const base = `https://${c.site.brand.domain}`;
  const pageUrl = `${base}/${locale}/specialties/${slug}.html`;
  const specialtyId = `${pageUrl}#specialty`;
  const specialtySchema = {
    "@type": "MedicalSpecialty",
    "@id": specialtyId,
    name: t(sp.name, locale),
    description: t(sp.intro, locale),
    url: pageUrl,
  };
  const medicalWebPageSchema = {
    "@type": "MedicalWebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: t(sp.name, locale),
    description: t(sp.seo.description, locale) || t(sp.intro, locale),
    inLanguage: c.site.i18n[locale].locale,
    about: { "@id": specialtyId },
    isPartOf: { "@id": `${base}/#website` },
  };
  const socialImage = sp.image || specialtyImage(sp.slug);

  const body = `
${pageHero({
    c, locale, depth,
    eyebrow: t(sp.index, locale),
    title: t(sp.name, locale),
    text: t(sp.sub, locale),
    trail: [
      { label: specialtyLabel, href: "specialties/" },
      { label: t(sp.name, locale) },
    ],
    actions: heroActions({ c, locale, depth, sp }),
    art: "specialties"})}

${when(!sp.staffed, `<div class="wrap" style="margin-top:1.75rem">
  <div class="notice notice--sample" data-reveal>
    ${icon("info")}
    <p><strong>${esc(t(c.site.ui.comingSoon, locale))}</strong>، ${esc(t({
      ar: "القسم ده تحت التجهيز والطبيب هيتعلن عنه قريباً. المعلومات الطبية في الصفحة دي صحيحة ومفيدة دلوقتي، وكارت الطبيب المعروض مثال توضيحي لشكل الصفحة. لو محتاج تسأل عن الحالة دي، كلّمنا على واتساب وهنوجهك للتخصص المناسب.",
      en: "This department is being staffed and its doctor will be announced shortly. The medical information on this page is accurate and useful now; the doctor card shown is a sample of how the page will look. If you need to ask about this condition, message us on WhatsApp and we will point you to the right specialty.",
    }, locale))}</p>
  </div>
</div>`)}

<div class="tabs-bar">
  <div class="wrap"><div class="tabs-bar__inner" data-tabs-anchor></div></div>
</div>
<section class="section section--after-tabs">
  <div class="wrap" data-tabs>
    <div class="tabs glass" role="tablist" aria-label="${esc(t({ ar: "أقسام صفحة التخصص", en: "Specialty page sections" }, locale))}">
      ${map(tabs, (tab, index) => tabButton({
        id: `${slug}-tab-${tab.key}`,
        panelId: `${slug}-panel-${tab.key}`,
        label: tab.label,
        selected: index === 0,
      }))}
    </div>
    ${map(tabs, (tab, index) => tabPanel({
      id: `${slug}-panel-${tab.key}`,
      tabId: `${slug}-tab-${tab.key}`,
      body: tab.body,
      hidden: index !== 0,
    }))}
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    ${sectionHead({
      eyebrow: specialtyLabel,
      title: t({ ar: "تخصصات تانية ممكن تهمك", en: "Other specialties you may find helpful" }, locale),
    })}
    <div class="grid grid-4">
      ${map(related, (candidate) => specialtyCard({ c, locale, depth, sp: candidate }))}
    </div>
  </div>
</section>

${ctaBand({ c, locale, depth })}

<section class="section" style="padding-top:0">

</section>`;

  return {
    path: `${locale}/specialties/${slug}.html`,
    html: page({
      c, locale, depth, pagePath: `specialties/${slug}.html`,
      active: "specialties",
      title: t(sp.seo.title, locale),
      description: t(sp.seo.description, locale),
      body,
      image: socialImage ? { src: socialImage, width: 1200, height: 750 } : undefined,
      schema: [specialtySchema, medicalWebPageSchema, faqSchema(sp.faq || [], locale)].filter(Boolean),
    }),
  };
}

export function pages({ c, locale }) {
  const specs = orderedSpecialties(c);
  return [
    specialtyHub({ c, locale, specs }),
    ...specs.map((sp) => specialtyDetail({ c, locale, specs, sp })),
  ];
}
