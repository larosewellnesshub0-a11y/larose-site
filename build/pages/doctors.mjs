/* ========================================================================== 
   Doctor hub and doctor profile pages
   ========================================================================== */

import {
  t, ta, esc, link, asset, icon, map, when, published,
} from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import {
  sectionHead, crumbs, pageHero, specialtyCard, doctorCard, reviewCard,
  sampleNotice, ctaBand,
} from "../lib/components.mjs";

function doctorHub({ c, locale, doctors }) {
  const depth = 1;
  const doctorLabel = t({ ar: "الأطباء", en: "Our Doctors" }, locale);
  const realDoctors = doctors.filter((doctor) => !doctor.sample);
  const sampleDoctors = doctors.filter((doctor) => doctor.sample);
  const base = `https://${c.site.brand.domain}`;
  const itemList = {
    "@type": "ItemList",
    name: doctorLabel,
    itemListElement: realDoctors.map((doctor, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: t(doctor.name, locale),
      item: `${base}/${locale}/doctors/${doctor.slug}.html`,
    })),
  };
  const body = `
${pageHero({
    c, locale, depth,
    eyebrow: t(c.site.brand.kind, locale),
    title: doctorLabel,
    text: t({
      ar: "اتعرّف على أطباء لاروز، وتخصص كل طبيب، ومواعيد العيادة قبل ما تحجز.",
      en: "Meet the La Rose medical team and see each doctor's specialty and clinic hours before you book.",
    }, locale),
    trail: [{ label: doctorLabel }],
    art: "doctors"})}

<section class="section">
  <div class="wrap">
    <!-- The cards carry the doctors' names as h3, so without this the outline
         jumped straight from the page h1 to level three. Visually hidden
         because the hero above already says what the list is. -->
    <h2 class="visually-hidden">${esc(t({ ar: "أطباء العيادة", en: "The clinic's doctors" }, locale))}</h2>
    <div class="grid grid-4">
      ${map(realDoctors, (doctor) => doctorCard({ c, locale, depth, d: doctor }))}
    </div>
    ${when(sampleDoctors.length, `<div style="margin-top:3.5rem">

      <div class="grid grid-4" style="margin-top:1.5rem">
        ${map(sampleDoctors, (doctor) => doctorCard({ c, locale, depth, d: doctor }))}
      </div>
    </div>`)}
  </div>
</section>`;

  return {
    path: `${locale}/doctors/index.html`,
    html: page({
      c, locale, depth, pagePath: "doctors/index.html",
      active: "doctors",
      title: doctorLabel,
      description: t({
        ar: "أطباء عيادات لاروز في المعادي الجديدة: التغذية العلاجية، الباطنة والجهاز الهضمي، والأطفال. تخصص كل طبيب وخبرته وأيام ومواعيد العيادة قبل ما تحجز.",
        en: "The doctors at La Rose Wellness Hub in New Maadi: clinical nutrition, internal medicine, gastroenterology and paediatrics. Each doctor's field, experience and clinic days.",
      }, locale),
      body,
      schema: itemList,
    }),
  };
}

function portrait({ c, locale, depth, doctor }) {
  const badge = when(doctor.sample, `<span class="badge-sample">${esc(t(c.site.ui.sample, locale))}</span>`);
  if (!doctor.portrait) {
    return `<div class="doctor-placeholder" style="position:relative">
      ${icon("user")}
      ${badge}
    </div>`;
  }

  return `<div class="arch arch--ruled arch--tall">
    <img src="${asset(depth, t(doctor.portrait, locale))}"
         srcset="${asset(depth, t(doctor.portrait, locale))} 450w, ${asset(depth, t(doctor.portrait2x || doctor.portrait, locale))} 900w"
         sizes="(max-width: 640px) 88vw, 40vw"
         alt="${esc(t(doctor.name, locale))}" width="600" height="750" loading="eager" decoding="async">
    ${badge}
  </div>`;
}

function doctorDetail({ c, locale, doctor, specs }) {
  const depth = 1;
  const slug = t(doctor.slug, locale);
  const doctorLabel = t({ ar: "الأطباء", en: "Our Doctors" }, locale);
  const credentials = ta(doctor.credentials, locale);
  const doctorSpecs = specs.filter((sp) => (doctor.specialties || []).includes(sp.slug));
  const reviews = (c.reviews.reviews || []).filter(
    (review) => review.published !== false && review.doctor === doctor.slug,
  );
  const base = `https://${c.site.brand.domain}`;
  const pageUrl = `${base}/${locale}/doctors/${slug}.html`;
  const medicalSpecialty = doctorSpecs.map((sp) => t(sp.name, locale)).filter(Boolean);
  const physicianSchema = {
    "@type": "Physician",
    "@id": `${pageUrl}#physician`,
    name: t(doctor.name, locale),
    description: t(doctor.bio, locale) || undefined,
    medicalSpecialty: medicalSpecialty.length ? medicalSpecialty : undefined,
    worksFor: { "@id": `${base}/#clinic` },
    url: pageUrl,
    ...(doctor.portrait
      ? { image: `${base}/${t(doctor.portrait, locale).replace(/^\/+/, "")}` }
      : {}),
  };

  const body = `
<section class="section">
  <div class="wrap">
    ${crumbs({
      c, locale, depth,
      trail: [
        { label: doctorLabel, href: "doctors/" },
        { label: t(doctor.name, locale) },
      ],
    })}
    <div class="grid grid-2" style="align-items:center;gap:clamp(2rem,5vw,5rem);margin-top:2rem">
      <div style="max-width:30rem;margin-inline:auto;width:100%">
        ${portrait({ c, locale, depth, doctor })}
      </div>
      <div class="stack">
        <p class="eyebrow">${esc(doctorLabel)}</p>
        <h1 class="h1">${esc(t(doctor.name, locale))}</h1>
        <p class="lede">${esc(t(doctor.title, locale))}</p>
        <div class="prose">
          <ul>${map(credentials, (credential) => `<li>${esc(credential)}</li>`)}</ul>
        </div>
        <div class="cluster">
          ${when(t(doctor.days, locale), `<span class="chip">${icon("calendar")} ${esc(t(doctor.days, locale))}</span>`)}
          ${when(t(doctor.hours, locale), `<span class="chip">${icon("clock")} ${esc(t(doctor.hours, locale))}</span>`)}
        </div>
        <div class="cluster" style="margin-top:.75rem">
          <a class="btn btn--primary btn--lg" href="${link(depth, "patients/booking.html")}">${esc(t(c.site.ui.bookNow, locale))}</a>
          <a class="btn btn--whatsapp btn--lg" href="${esc(t(c.site.contact.whatsapp.href, locale))}" target="_blank" rel="noopener">
            ${icon("whatsapp")} ${esc(t(c.site.ui.whatsappShort, locale))}
          </a>
        </div>
      </div>
    </div>
    ${when(doctor.sample, `<div style="margin-top:1.5rem">${sampleNotice({ c, locale })}</div>`)}
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap">
    ${sectionHead({ title: t({ ar: "عن الطبيب", en: "About the doctor" }, locale) })}
    <div class="prose"><p>${esc(t(doctor.bio, locale))}</p></div>
  </div>
</section>

<section class="section section--tint">
  <div class="wrap">
    ${sectionHead({
      eyebrow: doctorLabel,
      title: t({ ar: "التخصصات اللي بيعمل فيها الطبيب", en: "The doctor's specialties" }, locale),
    })}
    <div class="grid grid-3">
      ${map(doctorSpecs, (sp) => specialtyCard({ c, locale, depth, sp }))}
    </div>
  </div>
</section>

${when(reviews.length, `<section class="section">
  <div class="wrap">
    ${sectionHead({ title: t({ ar: "آراء المرضى", en: "Patient reviews" }, locale) })}
    <div class="grid grid-3">
      ${map(reviews, (review) => reviewCard({ c, locale, r: review }))}
    </div>
  </div>
</section>`)}

${ctaBand({ c, locale, depth })}

<section class="section" style="padding-top:0">

</section>`;

  return {
    path: `${locale}/doctors/${slug}.html`,
    html: page({
      c, locale, depth, pagePath: `doctors/${slug}.html`,
      active: "doctors",
      title: t(doctor.name, locale),
      description: t(doctor.bio, locale),
      body,
      schema: physicianSchema,
    }),
  };
}

export function pages({ c, locale }) {
  const doctors = published(c.doctors);
  const specs = published(c.specialties).slice().sort((a, b) => Number(a.index) - Number(b.index));
  return [
    doctorHub({ c, locale, doctors }),
    ...doctors.map((doctor) => doctorDetail({ c, locale, doctor, specs })),
  ];
}
