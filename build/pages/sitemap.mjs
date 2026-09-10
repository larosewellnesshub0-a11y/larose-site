/* ========================================================================== 
   Human-readable HTML sitemap
   ========================================================================== */

import { t, esc, link, map, published } from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";

const COPY = {
  title: { ar: "خريطة موقع عيادات لاروز", en: "La Rose website sitemap" },
  intro: {
    ar: "كل أقسام موقع عيادات لاروز في مكان واحد: التخصصات والأطباء والفروع ودليل المريض والمحتوى الطبي والأدوات والخدمات الرقمية.",
    en: "Find every main section of the La Rose website in one place: specialties, doctors, branches, patient guides, medical content, tools and digital services.",
  },
  about: { ar: "عن عيادات لاروز والتواصل", en: "About La Rose and contact" },
  specialties: { ar: "التخصصات الطبية", en: "Medical specialties" },
  doctors: { ar: "أطباء لاروز", en: "La Rose doctors" },
  branches: { ar: "فروع عيادات لاروز", en: "La Rose branches" },
  patients: { ar: "دليل المريض", en: "Patient guide" },
  knowledge: { ar: "المركز المعرفي الطبي", en: "Medical Knowledge Centre" },
  topics: { ar: "الموضوعات الطبية", en: "Medical topics" },
  tools: { ar: "الأدوات الطبية", en: "Medical tools" },
  digital: { ar: "خدمات لاروز الرقمية", en: "La Rose digital services" },
  legal: { ar: "المعلومات القانونية وخريطة الموقع", en: "Legal information and site orientation" },
};

function navItem(c, key) {
  return c.site.nav.find((item) => item.key === key);
}

function uniqueLinks(links) {
  const seen = new Set();
  return links.filter((item) => {
    const href = String(item?.href || "").replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "");
    if (!href || seen.has(href)) return false;
    seen.add(href);
    return true;
  });
}

function articleCategorySlug(value) {
  if (typeof value === "string") return value;
  return t(value?.slug, "en") || t(value?.slug, "ar");
}

function articleCategories(c) {
  const categories = [];
  const seen = new Set();
  const add = (category) => {
    const slug = articleCategorySlug(category);
    if (!slug || seen.has(slug)) return;
    seen.add(slug);
    categories.push({
      slug,
      name: category.name || category.categoryName || { ar: slug, en: slug },
    });
  };

  (c.articles.categories || []).forEach(add);
  published(c.specialties).forEach((specialty) => add({ slug: specialty.slug, name: specialty.name }));
  add({ slug: "general", name: { ar: "صحة عامة", en: "General health" } });
  (c.articles.articles || []).forEach((entry) => {
    const slug = articleCategorySlug(entry.category?.slug || entry.category);
    add({ slug, name: entry.categoryName || { ar: slug, en: slug } });
  });
  return categories;
}

function nestedList({ locale, depth, root, children = [], nestedTitle = null, nested = [] }) {
  return `<ul>
    <li><a href="${link(depth, root.href)}">${esc(t(root.label, locale))}</a>
      ${(children.length || nested.length) ? `<ul>
        ${map(children, (item) => `<li><a href="${link(depth, item.href)}">${esc(t(item.label, locale))}</a></li>`)}
        ${nested.length ? `<li><span>${esc(t(nestedTitle, locale))}</span>
          <ul>${map(nested, (item) => `<li><a href="${link(depth, item.href)}">${esc(t(item.label, locale))}</a></li>`)}</ul>
        </li>` : ""}
      </ul>` : ""}
    </li>
  </ul>`;
}

function section({ title, list }) {
  return `<section>
    <h2>${esc(title)}</h2>
    ${list}
  </section>`;
}

export function pages({ c, locale }) {
  const depth = 0;
  const specialties = published(c.specialties).map((specialty) => ({
    label: specialty.name,
    href: `specialties/${t(specialty.slug, "en")}.html`,
  }));
  const doctors = published(c.doctors).map((doctor) => ({
    label: doctor.name,
    href: `doctors/${t(doctor.slug, "en")}.html`,
  }));
  const branches = published(c.branches).map((branch) => ({
    label: branch.name,
    href: `branches/${t(branch.slug, "en")}.html`,
  }));
  const patientNav = navItem(c, "patients");
  const knowledgeNav = navItem(c, "articles");
  const toolsNav = navItem(c, "tools");
  const digitalNav = navItem(c, "digital");
  const categoryLinks = articleCategories(c).map((category) => ({
    label: category.name,
    href: `articles/category-${category.slug}.html`,
  }));

  const aboutLinks = [
    { label: { ar: "الرئيسية", en: "La Rose home" }, href: "index.html" },
    { label: { ar: "عن عيادات لاروز", en: "About La Rose" }, href: "about/index.html" },
    { label: { ar: "التقنيات والأجهزة الطبية", en: "Medical technology" }, href: "about/technology.html" },
    { label: { ar: "آراء مرضى لاروز", en: "La Rose patient reviews" }, href: "about/reviews.html" },
    { label: { ar: "تجارب المرضى بالفيديو", en: "Patient video testimonials" }, href: "about/video-testimonials.html" },
    { label: { ar: "نتائج قبل وبعد", en: "Before-and-after results" }, href: "about/results.html" },
    { label: { ar: "تواصل مع عيادات لاروز", en: "Contact La Rose" }, href: "contact.html" },
  ];
  const digitalLinks = [
    ...(digitalNav?.children || []),
    { label: { ar: "دليل كتاب وصفات لاروز", en: "La Rose Recipe Guide" }, href: "../RecipeGuide/" },
    { label: { ar: "نسخة مجانية من دليل الوصفات", en: "Free Recipe Guide sample" }, href: "../RecipeGuide/free/" },
  ];
  const legalLinks = [
    ...c.site.footer.legal.filter((item) => item.href !== "sitemap.html"),
    { label: COPY.title, href: "sitemap.html" },
  ];

  const body = `
<section class="section">
  <div class="wrap wrap--narrow">
    <div class="prose">
      <h1 id="sitemap-title">${esc(t(COPY.title, locale))}</h1>
      <p class="lede">${esc(t(COPY.intro, locale))}</p>
      <nav aria-labelledby="sitemap-title">
        ${section({ title: t(COPY.about, locale), list: `<ul>${map(aboutLinks, (item) => `<li><a href="${link(depth, item.href)}">${esc(t(item.label, locale))}</a></li>`)}</ul>` })}
        ${section({ title: t(COPY.specialties, locale), list: nestedList({ locale, depth, root: { label: { ar: "كل تخصصات لاروز الطبية", en: "All La Rose medical specialties" }, href: "specialties/" }, children: specialties }) })}
        ${section({ title: t(COPY.doctors, locale), list: nestedList({ locale, depth, root: { label: { ar: "دليل أطباء لاروز", en: "La Rose doctor directory" }, href: "doctors/" }, children: doctors }) })}
        ${section({ title: t(COPY.branches, locale), list: nestedList({ locale, depth, root: { label: { ar: "دليل فروع عيادات لاروز", en: "La Rose branch directory" }, href: "branches/" }, children: branches }) })}
        ${section({ title: t(COPY.patients, locale), list: nestedList({ locale, depth, root: { label: patientNav.label, href: patientNav.href }, children: uniqueLinks(patientNav.children || []) }) })}
        ${section({ title: t(COPY.knowledge, locale), list: nestedList({ locale, depth, root: { label: knowledgeNav.label, href: knowledgeNav.href }, children: uniqueLinks(knowledgeNav.children || []), nestedTitle: COPY.topics, nested: categoryLinks }) })}
        ${section({ title: t(COPY.tools, locale), list: nestedList({ locale, depth, root: { label: toolsNav.label, href: toolsNav.href }, children: uniqueLinks((toolsNav.children || []).filter((item) => item.href !== toolsNav.href)) }) })}
        ${section({ title: t(COPY.digital, locale), list: nestedList({ locale, depth, root: { label: digitalNav.label, href: digitalNav.href }, children: uniqueLinks(digitalLinks) }) })}
        ${section({ title: t(COPY.legal, locale), list: `<ul>${map(legalLinks, (item) => `<li><a href="${link(depth, item.href)}">${esc(t(item.label, locale))}</a></li>`)}</ul>` })}
      </nav>
    </div>
  </div>
</section>`;

  return [{
    path: `${locale}/sitemap.html`,
    html: page({
      c,
      locale,
      depth,
      pagePath: "sitemap.html",
      title: t(COPY.title, locale),
      description: t(COPY.intro, locale),
      active: null,
      body,
    }),
  }];
}
