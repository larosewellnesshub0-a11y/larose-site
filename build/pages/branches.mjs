/* ========================================================================== 
   Branch pages
   ========================================================================== */

import { t, ta, esc, link, asset, icon, map, when, published, branchCardImage } from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import { pageHero, sectionHead, specialtyCard, ctaBand } from "../lib/components.mjs";

function branchCard({ c, locale, depth, b }) {
  const s = c.site;
  return `<article class="card card--branch" data-reveal>
    <div class="card__media arch arch--wide">
      ${branchCardImage(b)
        ? `<img src="${asset(depth, branchCardImage(b))}" alt="${esc(t(b.name, locale))}" width="600" height="400" loading="lazy" decoding="async">`
        : b.photos?.[0]
        ? `<img src="${asset(depth, b.photos[0].src)}" alt="${esc(t(b.photos[0].alt, locale))}" width="600" height="400" loading="lazy" decoding="async">`
        : `<div class="doctor-placeholder" style="border-radius:0;aspect-ratio:3/2">${icon("pin")}</div>`}
      ${when(b.status === "soon", `<span class="badge-sample badge-sample--soon">${esc(t(s.ui.openingSoon, locale))}</span>`)}
    </div>
    <div class="card__body">
      <h3 class="card__title">
        <a class="card__link" href="${link(depth, `branches/${b.slug}.html`)}">${esc(t(b.name, locale))}</a>
      </h3>
      <p class="card__text">${esc(t(b.address, locale) || t(b.intro, locale))}</p>
      ${when(b.hours && t(b.hours, locale), `<p class="card__days" style="color:var(--champagne-700);font-size:var(--t-xs);font-weight:600">${icon("clock")} ${esc(t(b.hours, locale))}</p>`)}
    </div>
  </article>`;
}

function branchHub({ c, locale }) {
  const depth = 1;
  const branches = published(c.branches);
  const body = `
${pageHero({
  c, locale, depth,
  eyebrow: t({ ar: "فروع لاروز", en: "La Rose branches" }, locale),
  title: t({ ar: "قريبين منكِ، بنفس طريقة الرعاية", en: "Closer to you, with the same approach to care" }, locale),
  text: t({
    ar: "فرع المعادي الجديدة مفتوح دلوقتي، وفرعي التجمع الخامس والشيخ زايد تحت التجهيز. كل التفاصيل المؤكدة هتلاقيها هنا.",
    en: "Our New Maadi branch is open now, while Fifth Settlement and Sheikh Zayed are in preparation. You will find every confirmed detail here.",
  }, locale),
  trail: [{ label: t({ ar: "الفروع", en: "Branches" }, locale), href: "branches/" }],
  art: "branches"})}

<section class="section">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "اختار الفرع", en: "Choose a branch" }, locale),
      title: t({ ar: "الفروع الحالية والقادمة", en: "Current and upcoming branches" }, locale),
      lede: t({ ar: "تشرّفنا بزيارتك في أقرب فرع ليك.", en: "We would be glad to welcome you at whichever branch is closest to you." }, locale),
    })}
    <div class="grid grid-3">
      ${map(branches, (b) => branchCard({ c, locale, depth, b }))}
    </div>
  </div>
</section>

${ctaBand({ c, locale, depth })}`;

  return {
    path: `${locale}/branches/index.html`,
    html: page({
      c, locale, depth, pagePath: "branches/index.html",
      title: t({ ar: "فروع عيادات لاروز", en: "La Rose branches" }, locale),
      description: t({
        ar: "فروع عيادات لاروز التخصصية: العنوان والمواصلات ومواعيد العمل لفرع المعادي الجديدة، وتفاصيل فرعي التجمع الخامس والشيخ زايد أول ما يتم تأكيدها.",
        en: "La Rose Wellness Hub branches. Visit our New Maadi clinic and find confirmed updates for Fifth Settlement and Sheikh Zayed.",
      }, locale),
      active: "branches",
      body,
    }),
  };
}

/* What a visit at this branch includes, when the branch differs from the
   clinic-wide list (e.g. one visiting doctor on one day a week). Content
   comes from branches.json → consultation; nothing is rendered without it. */
function consultationBlock({ c, locale, depth, b }) {
  const inc = b.consultation;
  if (!inc) return "";
  const items = ta(inc.items, locale);
  const doctor = published(c.doctors || []).find((d) => d.slug === inc.doctor);
  if (!items.length) return "";
  return `
<section class="section">
  <div class="wrap">
    <div class="card" data-reveal style="padding:clamp(1.25rem,3vw,2.25rem)">
      <h2 class="h3">${esc(t(inc.heading, locale) || t({ ar: "الكشف بيشمل", en: "The consultation includes" }, locale))}</h2>
      ${when(doctor, `<p class="card__days" style="margin-top:.75rem">${icon("calendar")} ${esc(t(doctor?.name, locale))} · ${esc(t(b.hours, locale))}</p>`)}
      <div class="prose" style="margin-top:1rem">
        <ul>${map(items, (fact) => `<li>${esc(fact)}</li>`)}</ul>
      </div>
      ${when(t(inc.price, locale), `<p style="margin-top:1.25rem;font-weight:600">${icon("info")} ${esc(t(inc.price, locale))}</p>`)}
      <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap">
        <a class="btn btn--primary" href="${link(depth, "patients/booking.html")}">${esc(t(c.site.ui.bookNow || { ar: "احجز الآن", en: "Book now" }, locale))}</a>
        ${when(doctor, `<a class="btn btn--ghost" href="${link(depth, `doctors/${esc(t(doctor?.slug, "en"))}.html`)}">${esc(t({ ar: "صفحة الطبيبة", en: "Doctor profile" }, locale))}</a>`)}
      </div>
    </div>
  </div>
</section>`;
}

function openBranch({ c, locale, b }) {
  const depth = 1;
  const specialties = published(c.specialties).filter((sp) => (b.specialties || []).includes(sp.slug));
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: t(b.name, locale),
    description: t(b.intro, locale),
    url: `https://${c.site.brand.domain}/${locale}/branches/${b.slug}.html`,
    telephone: b.phone?.tel || c.site.contact.phone.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: t(b.address, locale),
      addressLocality: t(b.city, locale),
      addressCountry: "EG",
    },
    geo: b.geo ? {
      "@type": "GeoCoordinates",
      latitude: b.geo.lat,
      longitude: b.geo.lng,
    } : undefined,
    image: (b.photos || []).map((photo) => `https://${c.site.brand.domain}/${photo.src}`),
  };

  const body = `
${pageHero({
  c, locale, depth,
  eyebrow: t(b.area, locale),
  title: t(b.name, locale),
  text: t(b.intro, locale),
  trail: [
    { label: t({ ar: "الفروع", en: "Branches" }, locale), href: "branches/" },
    { label: t(b.name, locale), href: `branches/${b.slug}.html` },
  ],
  art: "branches"})}

<section class="section">
  <div class="wrap">
    <div class="grid grid-2" style="align-items:start">
      <div class="card" data-reveal>
        <div class="card__body">
          <h2 class="h3">${esc(t({ ar: "معلومات الزيارة", en: "Visit details" }, locale))}</h2>
          <div class="stack" style="margin-top:1.5rem">
            <p>${icon("pin")} <strong>${esc(t({ ar: "العنوان", en: "Address" }, locale))}</strong><br>${esc(t(b.address, locale))}</p>
            <p>${icon("pin")} <strong>${esc(t({ ar: "أقرب علامة", en: "Landmark" }, locale))}</strong><br>${esc(t(b.landmark, locale))}</p>
            <p>${icon("phone")} <strong>${esc(t({ ar: "التليفون", en: "Phone" }, locale))}</strong><br><a href="tel:${esc(b.phone.tel)}"><bdi class="num">${esc(b.phone.display)}</bdi></a></p>
            <p>${icon("clock")} <strong>${esc(t({ ar: "المواعيد", en: "Hours" }, locale))}</strong><br>${esc(t(b.hours, locale))}</p>
          </div>
          <a class="btn btn--primary" href="${esc(b.mapsUrl)}" target="_blank" rel="noopener" style="margin-top:1.75rem">${icon("pin")} ${esc(t({ ar: "افتح الاتجاهات", en: "Get directions" }, locale))}</a>
        </div>
      </div>

      <div data-reveal>
        <h2 class="h3">${esc(t({ ar: "من جوه الفرع", en: "Inside the branch" }, locale))}</h2>
        <div class="grid grid-2" style="margin-top:1.5rem">
          ${map(b.photos || [], (photo) => `<div class="arch arch--wide">
            <img src="${asset(depth, photo.src)}" alt="${esc(t(photo.alt, locale))}" width="600" height="400" loading="lazy" decoding="async">
          </div>`)}
        </div>
      </div>
    </div>
  </div>
</section>

${consultationBlock({ c, locale, depth, b })}

<section class="section section--sunk">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "قبل ما توصل", en: "Before you arrive" }, locale),
      title: t({ ar: "إزاي توصل للفرع", en: "Getting here" }, locale),
    })}
    <div class="prose u-measure">
      <ol>${map(ta(b.gettingHere, locale), (step) => `<li>${esc(step)}</li>`)}</ol>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "تحت سقف واحد", en: "Under one roof" }, locale),
      title: t({ ar: "التخصصات المتاحة في الفرع", en: "Specialties available at this branch" }, locale),
      lede: t({
        ar: "الأقسام بتتشاور مع بعض لما حالتك تحتاج أكتر من زاوية.",
        en: "Departments confer with one another when your case needs more than one perspective.",
      }, locale),
    })}
    <div class="grid grid-3">
      ${map(specialties, (sp) => specialtyCard({ c, locale, depth, sp }))}
    </div>
  </div>
</section>

${ctaBand({ c, locale, depth })}`;

  return {
    path: `${locale}/branches/${b.slug}.html`,
    html: page({
      c, locale, depth, pagePath: `branches/${b.slug}.html`,
      title: t(b.name, locale),
      description: t(b.intro, locale),
      active: "branches",
      body,
      schema,
    }),
  };
}

function soonBranch({ c, locale, b }) {
  const depth = 1;
  const body = `
${pageHero({
  c, locale, depth,
  eyebrow: t(b.area, locale),
  title: t(b.name, locale),
  trail: [
    { label: t({ ar: "الفروع", en: "Branches" }, locale), href: "branches/" },
    { label: t(b.name, locale), href: `branches/${b.slug}.html` },
  ],
  art: "branches"})}

<section class="section">
  <div class="wrap wrap--narrow">
    <div class="card" data-reveal>
      <div class="card__body">
        <span class="chip chip--rose">${esc(t(c.site.ui.openingSoon, locale))}</span>
        <p class="lede" style="margin-top:1.5rem">${esc(t(b.intro, locale))}</p>
        <div class="notice" style="margin-top:1.5rem">
          ${icon("info")}
          <p>${esc(t({
            ar: "لحد ما الفرع يفتح، كل الحجوزات والكشوفات متاحة في فرع المعادي. تقدر تشوف تفاصيله وتحجز هناك.",
            en: "Until this branch opens, all bookings and consultations are available at the Maadi branch. You can view its details and book there.",
          }, locale))} <a href="${link(depth, "branches/maadi.html")}">${esc(t({ ar: "تفاصيل فرع المعادي", en: "Maadi branch details" }, locale))}</a>.</p>
        </div>
        <p style="margin-top:1.5rem">${esc(t({ ar: "العنوان وموعد الافتتاح هيتم إعلانهم هنا بعد تأكيدهم.", en: "The address and opening date will be announced here once confirmed." }, locale))}</p>
        <!-- TODO(clinic): address, opening date, photos -->
      </div>
    </div>
  </div>
</section>

${ctaBand({
  c, locale, depth,
  title: t({ ar: "احجز دلوقتي في فرع المعادي", en: "Book at the Maadi branch for now" }, locale),
})}`;

  return {
    path: `${locale}/branches/${b.slug}.html`,
    html: page({
      c, locale, depth, pagePath: `branches/${b.slug}.html`,
      title: t(b.name, locale),
      description: t(b.intro, locale),
      active: "branches",
      body,
    }),
  };
}

export function pages({ c, locale }) {
  const branches = published(c.branches);
  return [
    branchHub({ c, locale }),
    ...branches.map((b) => b.status === "open"
      ? openBranch({ c, locale, b })
      : soonBranch({ c, locale, b })),
  ];
}
