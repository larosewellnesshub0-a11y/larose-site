/* ==========================================================================
   Page shell: head, utility bar, header, drawer, footer, floating actions
   Every page in the site is rendered through `page()`.
   ========================================================================== */

import { t, ta, esc, escJson, link, asset, rel, icon, map, when, clamp, published } from "./util.mjs";

export function trackingHead(c) {
  const a = c?.site?.integrations?.analytics || {};
  const js = (value) => JSON.stringify(String(value));
  const parts = [];
  if (a.googleSiteVerification) parts.push(`<meta name="google-site-verification" content="${esc(a.googleSiteVerification)}">`);
  if (a.bingSiteVerification) parts.push(`<meta name="msvalidate.01" content="${esc(a.bingSiteVerification)}">`);
  if (a.ga4MeasurementId) parts.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(a.ga4MeasurementId)}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${js(a.ga4MeasurementId)},{send_page_view:true,anonymize_ip:true});</script>`);
  if (a.clarityProjectId) parts.push(`<script>(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,'clarity','script',${js(a.clarityProjectId)});</script>`);
  if (a.metaPixelId) parts.push(`<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${js(a.metaPixelId)});fbq('track','PageView');</script>
<noscript><img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=${encodeURIComponent(a.metaPixelId)}&amp;ev=PageView&amp;noscript=1"></noscript>`);
  if (a.tiktokPixelId) parts.push(`<script>!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat([].slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n=d.createElement('script');n.async=!0;n.src='https://analytics.tiktok.com/i18n/pixel/events.js?sdkid='+e+'&lib='+t;var a=d.getElementsByTagName('script')[0];a.parentNode.insertBefore(n,a)};ttq.load(${js(a.tiktokPixelId)});ttq.page()}(window,document,'ttq');</script>`);
  return parts.join("\n");
}

/* --------------------------------------------------------------------------
   Navigation model
   -------------------------------------------------------------------------- */
function navChildren(item, c, locale) {
  if (item.children) {
    return item.children.map((ch) => ({
      label: t(ch.label, locale),
      desc: t(ch.desc, locale),
      href: ch.href,
    }));
  }
  if (item.childrenFrom === "specialties") {
    return published(c.specialties).map((s) => ({
      label: t(s.short || s.name, locale),
      desc: t(s.sub, locale),
      href: `specialties/${s.slug}.html`,
    }));
  }
  if (item.childrenFrom === "branches") {
    return published(c.branches).map((b) => ({
      label: t(b.name, locale),
      desc: b.status === "soon" ? t(c.site.ui.openingSoon, locale) : t(b.area, locale),
      href: `branches/${b.slug}.html`,
    }));
  }
  return [];
}

/* --------------------------------------------------------------------------
   Utility bar
   -------------------------------------------------------------------------- */
/* The language control appears in the utility bar, the header and the drawer,
   so it is built once. It always links to THIS page in the other language, not
   to that language's home page, and it names the language you would switch TO. */
function langSwitch({ c, locale, depth, pagePath, cls = "lang-switch" }) {
  const s = c.site;
  const other = locale === "ar" ? "en" : "ar";
  const href = `${rel(depth + 1)}${other}/${pagePath.replace(/(^|\/)index\.html$/, "$1")}`;
  const label = s.i18n[other].label;
  return `<a class="${cls}" href="${href}" lang="${other}" hreflang="${other}"
     dir="${other === "ar" ? "rtl" : "ltr"}"
     aria-label="${esc(t({ ar: `اعرض الصفحة دي بـ${label}`, en: `View this page in ${label}` }, locale))}"
     >${icon("globe")}<span>${esc(label)}</span></a>`;
}

function utilityBar({ c, locale, depth, pagePath }) {
  const s = c.site;
  const other = locale === "ar" ? "en" : "ar";
  const altHref = `${rel(depth + 1)}${other}/${pagePath}`;
  return `
<div class="utility-bar">
  <div class="wrap utility-bar__inner">
    <nav class="utility-bar__links" aria-label="${esc(t({ ar: "روابط سريعة", en: "Quick links" }, locale))}">
      <a href="${link(depth, "about/index.html")}">${esc(t({ ar: "عن لاروز", en: "About" }, locale))}</a>
      <a href="${link(depth, "articles/")}">${esc(t({ ar: "المركز المعرفي", en: "Health Library" }, locale))}</a>
      <a href="${link(depth, "contact.html")}">${esc(t({ ar: "اتصل بنا", en: "Contact" }, locale))}</a>
    </nav>
    <div class="utility-bar__meta">
      <a href="tel:${esc(s.contact.phone.tel)}">${icon("phone")}<bdi class="num">${esc(s.contact.phone.display)}</bdi></a>
      ${langSwitch({ c, locale, depth, pagePath })}
    </div>
  </div>
</div>`;
}

/* --------------------------------------------------------------------------
   Header
   -------------------------------------------------------------------------- */
function header({ c, locale, depth, active, pagePath }) {
  const s = c.site;
  const items = s.nav.map((item) => {
    const children = navChildren(item, c, locale);
    const isActive = active === item.key;
    if (!children.length) {
      return `<li class="nav__item">
        <a class="nav__link" href="${link(depth, item.href)}"${isActive ? ' aria-current="page"' : ""}>${esc(t(item.label, locale))}</a>
      </li>`;
    }
    const wide = item.mega ? " nav__panel--wide" : "";
    /* Enough links that one column would scroll on a laptop. */
    const tall = !item.mega && (item.children || []).length > 6 ? " nav__panel--tools" : "";
    return `<li class="nav__item" data-dropdown>
      <a class="nav__link" href="${link(depth, item.href)}" aria-expanded="false"${isActive ? ' aria-current="page"' : ""}>
        ${esc(t(item.label, locale))}<i class="nav__caret" aria-hidden="true"></i>
      </a>
      <div class="nav__panel${wide}${tall}">
        <div class="nav__panel-grid">
          ${map(children, (ch) => `<a class="nav__sub" href="${link(depth, ch.href)}">
            ${esc(ch.label)}${ch.desc ? `<span>${esc(ch.desc)}</span>` : ""}
          </a>`)}
        </div>
        <div class="nav__panel-foot">
          <a class="link-cta" href="${link(depth, item.href)}">${esc(t(s.ui.viewAll, locale))} ${icon("arrow")}</a>
          <a class="btn btn--sm btn--primary" href="${link(depth, "patients/booking.html")}">${esc(t(s.ui.bookShort, locale))}</a>
        </div>
      </div>
    </li>`;
  }).join("\n");

  return `
<header class="site-header" id="siteHeader">
  <div class="wrap site-header__inner">
    <a class="wordmark" href="${link(depth, "index.html")}" aria-label="${esc(t(s.brand.name, locale))}">
      <img src="${asset(depth, s.brand.logo.wordmark)}" alt="" width="988" height="853">
      <span class="wordmark__text">
        <b>${esc(t(s.brand.name, locale))}</b>
        <i>${esc(t(s.brand.kind, locale))}</i>
      </span>
    </a>

    <nav class="nav nav--primary" aria-label="${esc(t({ ar: "القائمة الرئيسية", en: "Main menu" }, locale))}">
      <ul class="nav" style="gap:inherit">${items}</ul>
    </nav>

    <div class="header-actions">
      ${langSwitch({ c, locale, depth, pagePath, cls: "lang-switch lang-switch--header" })}
      <a class="btn btn--primary btn--sm" href="${link(depth, "patients/booking.html")}">${esc(t(s.ui.bookShort || s.ui.bookNow, locale))}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="drawer"
              aria-label="${esc(t(s.ui.menu, locale))}"><span></span></button>
    </div>
  </div>
</header>`;
}

/* --------------------------------------------------------------------------
   Mobile drawer
   -------------------------------------------------------------------------- */
function drawer({ c, locale, depth, pagePath }) {
  const s = c.site;
  const groups = s.nav.map((item) => {
    const children = navChildren(item, c, locale);
    if (!children.length) {
      return `<div class="drawer-nav__group">
        <a class="drawer-nav__toggle" href="${link(depth, item.href)}">${esc(t(item.label, locale))}</a>
      </div>`;
    }
    return `<div class="drawer-nav__group" data-drawer-group>
      <button class="drawer-nav__toggle" type="button" aria-expanded="false">
        ${esc(t(item.label, locale))}<i class="nav__caret" aria-hidden="true"></i>
      </button>
      <div class="drawer-nav__panel"><div>
        <div class="drawer-nav__list">
          <a href="${link(depth, item.href)}"><strong>${esc(t(s.ui.viewAll, locale))}</strong></a>
          ${map(children, (ch) => `<a href="${link(depth, ch.href)}">${esc(ch.label)}</a>`)}
        </div>
      </div></div>
    </div>`;
  }).join("\n");

  return `
<div class="drawer" id="drawer" aria-hidden="true">
  <div class="drawer__scrim" data-drawer-close></div>
  <div class="drawer__panel glass" role="dialog" aria-modal="true" aria-label="${esc(t(s.ui.menu, locale))}">
    <div class="drawer__head">
      <a class="wordmark" href="${link(depth, "index.html")}">
        <img src="${asset(depth, s.brand.logo.wordmark)}" alt="${esc(t(s.brand.name, locale))}" width="988" height="853">
      </a>
      <button class="burger" type="button" data-drawer-close aria-label="${esc(t(s.ui.close, locale))}"><span></span></button>
    </div>
    <div class="drawer__body">
      <nav aria-label="${esc(t({ ar: "قائمة الموبايل", en: "Mobile menu" }, locale))}">${groups}</nav>
    </div>
    <div class="drawer__foot">
      <a class="btn btn--primary btn--block" href="${link(depth, "patients/booking.html")}">${esc(t(s.ui.bookNow, locale))}</a>
      <a class="btn btn--whatsapp btn--block" href="${esc(s.contact.whatsapp.href)}" target="_blank" rel="noopener">
        ${icon("whatsapp")} ${esc(t(s.ui.whatsappShort, locale))}
      </a>
      <a class="btn btn--ghost btn--block" href="tel:${esc(s.contact.phone.tel)}">
        ${icon("phone")} <bdi class="num">${esc(s.contact.phone.display)}</bdi>
      </a>
      ${langSwitch({ c, locale, depth, pagePath, cls: "lang-switch lang-switch--drawer" })}
    </div>
  </div>
</div>`;
}

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */
function footer({ c, locale, depth }) {
  const s = c.site;
  const year = new Date().getFullYear();

  const columns = s.footer.columns.map((col) => {
    const links = col.linksFrom === "specialties"
      ? published(c.specialties).map((sp) => ({ label: t(sp.short || sp.name, locale), href: `specialties/${sp.slug}.html` }))
      : col.links.map((l) => ({ label: t(l.label, locale), href: l.href }));
    return `<div class="footer-col">
      <h2 class="footer-col__title">${esc(t(col.title, locale))}</h2>
      <ul>${map(links, (l) => `<li><a href="${link(depth, l.href)}">${esc(l.label)}</a></li>`)}</ul>
    </div>`;
  }).join("\n");

  const maadi = c.branches.find((b) => b.isPrimary) || c.branches[0];

  return `
<footer class="site-footer">
  <div class="wrap site-footer__top">
    <div class="site-footer__grid">

      <div class="site-footer__brand">
        <img src="${asset(depth, s.brand.logo.wordmarkWhite)}" alt="${esc(t(s.brand.name, locale))}" width="988" height="853">
        <p class="site-footer__blurb">${esc(t(s.footer.blurb, locale))}</p>
        <div class="social">
          <a href="${esc(s.social.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">${icon("instagram")}</a>
          <a href="${esc(s.social.youtube)}" target="_blank" rel="noopener" aria-label="YouTube">${icon("youtube")}</a>
          ${when(s.social.tiktok, `<a href="${esc(s.social.tiktok)}" target="_blank" rel="noopener" aria-label="TikTok">${icon("tiktok")}</a>`)}
          ${when(s.social.facebook, `<a href="${esc(s.social.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">${icon("facebook")}</a>`)}
          <a href="${esc(s.contact.whatsapp.href)}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon("whatsapp")}</a>
        </div>
      </div>

      ${columns}

      <div class="footer-col">
        <h2 class="footer-col__title">${esc(t({ ar: "تواصل معانا", en: "Get in touch" }, locale))}</h2>
        <div class="site-footer__contact">
          <a class="footer-contact-row" href="${esc(maadi.mapsUrl || "#")}" target="_blank" rel="noopener">
            ${icon("pin")}<span>${esc(t(maadi.address, locale))}</span>
          </a>
          <a class="footer-contact-row" href="tel:${esc(s.contact.phone.tel)}">
            ${icon("phone")}<bdi class="num">${esc(s.contact.phone.display)}</bdi>
          </a>
          <div class="footer-contact-row">
            ${icon("clock")}<span>${esc(t(s.hours.display, locale))}</span>
          </div>
        </div>
      </div>

    </div>
  </div>

  <div class="wrap">
  </div>

  <div class="wrap site-footer__bar">
    <span>© ${year} ${esc(t(s.legal.copyright, locale))}</span>
    <nav class="site-footer__legal" aria-label="${esc(t({ ar: "روابط قانونية", en: "Legal" }, locale))}">
      ${map(s.footer.legal, (l) => `<a href="${link(depth, l.href)}">${esc(t(l.label, locale))}</a>`)}
    </nav>
  </div>
</footer>`;
}

/* --------------------------------------------------------------------------
   Floating actions
   -------------------------------------------------------------------------- */
function floatingActions({ c, locale, depth }) {
  const s = c.site;
  /* Two controls on desktop, where they float; on a phone the same three
     actions become a fixed bottom bar so calling, messaging and booking are
     always one thumb away instead of a scroll back to the header. */
  return `
<div class="floating-actions no-print">
  <a class="fab fab--whatsapp" href="${esc(s.contact.whatsapp.href)}" target="_blank" rel="noopener"
     aria-label="${esc(t(s.ui.whatsapp, locale))}">${icon("whatsapp")}</a>
  <a class="fab fab--call" href="tel:${esc(s.contact.phone.tel)}"
     aria-label="${esc(t(s.ui.callUs, locale))}">${icon("phone")}</a>
</div>

<nav class="action-bar no-print" aria-label="${esc(t({ ar: "إجراءات سريعة", en: "Quick actions" }, locale))}">
  <a class="action-bar__item" href="tel:${esc(s.contact.phone.tel)}">
    ${icon("phone")}<span>${esc(t(s.ui.callUs, locale))}</span>
  </a>
  <a class="action-bar__item" href="${esc(s.contact.whatsapp.href)}" target="_blank" rel="noopener">
    ${icon("whatsapp")}<span>${esc(t(s.ui.whatsappShort, locale))}</span>
  </a>
  <a class="action-bar__item action-bar__item--cta" href="${link(depth, "patients/booking.html")}">
    ${icon("calendar")}<span>${esc(t(s.ui.bookNow, locale))}</span>
  </a>
</nav>`;
}

/* --------------------------------------------------------------------------
   Search metadata and structured data
   -------------------------------------------------------------------------- */
function absolutePageUrl(base, locale, pagePath) {
  const clean = String(pagePath || "index.html").replace(/^\/+/, "").replace(/index\.html$/, "");
  return `${base}/${locale}/${clean}`;
}

function absoluteMediaUrl(base, src) {
  if (!src) return "";
  return /^https?:\/\//i.test(src) ? src : `${base}/${String(src).replace(/^\/+/, "")}`;
}

function schemaItems(schema) {
  return (schema ? [].concat(schema) : []).flat(Infinity).filter(Boolean);
}

function decodeHtml(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
      if (entity[0] !== "#") return named[entity.toLowerCase()] || match;
      const hex = entity[1].toLowerCase() === "x";
      return String.fromCodePoint(Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10));
    })
    .replace(/\s+/g, " ")
    .trim();
}

function normalisePublicUrl(url) {
  return url.replace(/\/index\.html$/, "/");
}

function breadcrumbSchema({ c, locale, body, currentUrl, currentName }) {
  const base = `https://${c.site.brand.domain}`;
  const list = /<ol class="crumbs">([\s\S]*?)<\/ol>/.exec(body || "")?.[1];
  const crumbs = list ? [...list.matchAll(/<li>([\s\S]*?)<\/li>/g)].map((match) => {
    const html = match[1];
    const href = /<a\b[^>]*href="([^"]+)"/.exec(html)?.[1];
    return {
      name: decodeHtml(html),
      item: href ? normalisePublicUrl(new URL(decodeHtml(href), currentUrl).href) : currentUrl,
    };
  }).filter((item) => item.name) : [];

  if (!crumbs.length) {
    const localeHome = `${base}/${locale}/`;
    crumbs.push({ name: t(c.site.ui.home, locale), item: currentUrl === `${base}/` ? currentUrl : localeHome });
    if (currentUrl !== localeHome && currentUrl !== `${base}/`) {
      crumbs.push({ name: currentName || t(c.site.brand.name, locale), item: currentUrl });
    }
  }

  return {
    "@type": "BreadcrumbList",
    "@id": `${currentUrl}#breadcrumb`,
    itemListElement: crumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function jsonLd({ c, locale, pagePath, schema, body = "", canonicalUrl = "", currentName = "" }) {
  const s = c.site;
  const maadi = c.branches.find((b) => b.isPrimary);
  const base = `https://${s.brand.domain}`;
  const currentUrl = canonicalUrl || absolutePageUrl(base, locale, pagePath);
  const clinicId = `${base}/#clinic`;
  const websiteId = `${base}/#website`;
  const address = maadi ? {
    "@type": "PostalAddress",
    streetAddress: t(maadi.address, locale) || undefined,
    addressLocality: t(maadi.area, locale) || undefined,
    addressRegion: t(maadi.city, locale) || undefined,
    postalCode: t(maadi.postalCode, locale) || undefined,
    addressCountry: t(maadi.country, locale) || undefined,
  } : undefined;
  const openBranches = published(c.branches).filter((branch) => branch.status === "open");
  const areaServed = [...new Set(openBranches.flatMap((branch) => [
    t(branch.area, locale),
    t(branch.city, locale),
  ]).filter(Boolean))];
  /* sameAs is how Google is told these accounts and this domain are one
     organisation. Facebook and TikTok were missing, and Facebook matters most:
     it outranks the site for the clinic's own name and the Business Profile
     currently points at it. */
  const socialProfiles = [
    s.social.instagram, s.social.facebook, s.social.youtube,
    s.social.tiktok, s.social.linktree,
  ].filter(Boolean);
  // Reception hours are intentionally not inferred from display copy. Only a
  // future, structured and confirmed content field is safe for search engines.
  const openingHours = Array.isArray(maadi?.openingHoursSpecification)
    ? maadi.openingHoursSpecification.filter(Boolean)
    : [];

  const org = {
    "@type": "MedicalClinic",
    "@id": clinicId,
    name: t(s.brand.name, locale),
    alternateName: t(s.brand.name, locale === "ar" ? "en" : "ar"),
    url: `${base}/${locale}/`,
    logo: `${base}/${s.brand.logo.wordmark}`,
    image: `${base}/assets/img/clinic/hero-clinic-1200.webp`,
    telephone: s.contact.phone.tel || undefined,
    address,
    geo: maadi?.geo ? { "@type": "GeoCoordinates", latitude: maadi.geo.lat, longitude: maadi.geo.lng } : undefined,
    openingHoursSpecification: openingHours.length ? openingHours : undefined,
    areaServed: areaServed.length ? areaServed : undefined,
    aggregateRating: s.proof?.rating ? {
      "@type": "AggregateRating",
      ratingValue: s.proof.rating.value,
      reviewCount: s.proof.rating.count,
      bestRating: 5,
    } : undefined,
    sameAs: socialProfiles.length ? socialProfiles : undefined,
    medicalSpecialty: published(c.specialties).map((sp) => t(sp.name, locale)).filter(Boolean),
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${base}/`,
    name: t(s.brand.name, locale),
    alternateName: t(s.brand.name, locale === "ar" ? "en" : "ar"),
    inLanguage: s.i18n[locale].locale,
    publisher: { "@id": clinicId },
  };
  const extras = schemaItems(schema).map((block) => {
    const { "@context": ignored, ...clean } = block;
    return clean;
  });
  const graph = {
    "@context": "https://schema.org",
    "@graph": [org, breadcrumbSchema({ c, locale, body, currentUrl, currentName }), website, ...extras],
  };
  return `<script type="application/ld+json">${escJson(graph)}</script>`;
}

/* ==========================================================================
   page()، the shell every page is rendered through
   ==========================================================================
   opts:
     locale    "ar" | "en"
     depth     directories below the locale root (0 for /ar/index.html)
     pagePath  path within the locale, e.g. "specialties/dermatology.html"
     title     page <title> (brand suffix added automatically)
     description  meta description
     active    nav key to mark current
     body      the page HTML
     schema    optional extra JSON-LD object(s)
     image     optional social image path or { src, width, height }
     bodyClass optional extra class on <body>
   ========================================================================== */
export function page(opts) {
  const { c, locale, depth = 0, pagePath, title, description, active, body, schema, image, bodyClass = "" } = opts;
  const s = c.site;
  const dir = s.i18n[locale].dir;
  const base = `https://${s.brand.domain}`;
  // Some page modules supply a full SEO title that already carries the brand.
  // Appending it again produces "… | La Rose | La Rose Wellness Hub".
  const brand = t(s.brand.name, locale);
  const brandShort = t(s.brand.shortName, locale);
  const hasBrand = title && (title.includes(brand) || title.includes(brandShort));
  const fullTitle = !title ? brand : hasBrand ? title : `${title} | ${brand}`;
  const metaDescription = clamp(description || t(s.brand.tagline, locale));
  const canonical = absolutePageUrl(base, locale, pagePath);
  const arUrl = absolutePageUrl(base, "ar", pagePath);
  const enUrl = absolutePageUrl(base, "en", pagePath);
  const imageData = typeof image === "string" ? { src: image } : (image || {});
  const socialImage = absoluteMediaUrl(base, imageData.src || "assets/img/clinic/hero-clinic-1200.webp");
  const socialWidth = imageData.width || 1200;
  const socialHeight = imageData.height || 675;
  const extraSchemas = schemaItems(schema);
  const ogType = extraSchemas.some((block) => block?.["@type"] === "Article") ? "article" : "website";

  return `<!doctype html>
<html lang="${locale}" dir="${dir}" data-forms-endpoint="${esc(s.integrations?.formsEndpoint || "")}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(metaDescription)}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#8E8B63">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="ar" href="${arUrl}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="x-default" href="${arUrl}">

<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(t(s.brand.name, locale))}">
<meta property="og:locale" content="${locale === "ar" ? "ar_EG" : "en_US"}">
<meta property="og:locale:alternate" content="${locale === "ar" ? "en_US" : "ar_EG"}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(metaDescription)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${esc(socialImage)}">
<meta property="og:image:width" content="${socialWidth}">
<meta property="og:image:height" content="${socialHeight}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(metaDescription)}">
<meta name="twitter:image" content="${esc(socialImage)}">

<link rel="icon" href="${asset(depth, "assets/img/logo/favicon.svg")}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${asset(depth, "assets/img/logo/apple-touch-icon.png")}">
${trackingHead(c)}

<link rel="preload" as="font" type="font/woff2" href="${asset(depth, `assets/fonts/${locale === "ar" ? "PlexArabic-400" : "Montserrat-400"}.woff2`)}" crossorigin>
<link rel="stylesheet" href="${asset(depth, "assets/css/tokens.css")}">
<link rel="stylesheet" href="${asset(depth, "assets/css/base.css")}">
<link rel="stylesheet" href="${asset(depth, "assets/css/components.css")}">
<link rel="stylesheet" href="${asset(depth, "assets/css/layout.css")}">

${jsonLd({ c, locale, pagePath, schema, body, canonicalUrl: canonical, currentName: title || brand })}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">${esc(t(s.ui.skipToContent, locale))}</a>

${utilityBar({ c, locale, depth, pagePath })}
${header({ c, locale, depth, active, pagePath })}
${drawer({ c, locale, depth, pagePath })}

<main id="main">
${body}
</main>

${footer({ c, locale, depth })}
${floatingActions({ c, locale, depth })}

<script src="${asset(depth, "assets/js/track.js")}" defer></script>
<script src="${asset(depth, "assets/js/forms.js")}" defer></script>
<script src="${asset(depth, "assets/js/site.js")}" defer></script>
${body.includes("data-tool=") ? `<script src="${asset(depth, "assets/js/tools.js")}" defer></script>` : ""}
</body>
</html>`;
}
