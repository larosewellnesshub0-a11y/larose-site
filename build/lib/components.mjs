/* ==========================================================================
   Shared page components
   Every page composes from these so the site stays visually consistent and a
   change lands everywhere at once.
   ========================================================================== */

import { t, ta, esc, link, asset, icon, sprig, stars, map, when, published, specialtyImage, bannerImage, sizeAttrs, responsiveAttrs, IMAGE_SIZES } from "./util.mjs";

/* --------------------------------------------------------------------------
   Section heading
   -------------------------------------------------------------------------- */
export function sectionHead({ eyebrow, title, lede, center = false, level = 2 }) {
  return `<div class="section-head${center ? " u-center" : ""}" data-reveal>
    ${when(eyebrow, `<p class="eyebrow">${esc(eyebrow)}</p>`)}
    <h${level} class="h2">${esc(title)}</h${level}>
    ${when(lede, `<p class="lede">${esc(lede)}</p>`)}
  </div>`;
}

/* --------------------------------------------------------------------------
   Breadcrumbs
   -------------------------------------------------------------------------- */
export function crumbs({ c, locale, depth, trail }) {
  const home = { label: t(c.site.ui.home, locale), href: "index.html" };
  const all = [home, ...trail];
  return `<nav aria-label="${esc(t({ ar: "مسار التنقل", en: "Breadcrumb" }, locale))}">
    <ol class="crumbs">
      ${map(all, (x, i) =>
        i === all.length - 1
          ? `<li><span aria-current="page">${esc(x.label)}</span></li>`
          : `<li><a href="${link(depth, x.href)}">${esc(x.label)}</a></li>`
      )}
    </ol>
  </nav>`;
}

/* --------------------------------------------------------------------------
   Page hero (interior pages)
   -------------------------------------------------------------------------- */
export function pageHero({ c, locale, depth, eyebrow, title, text, trail, actions = "", variant = "", art = "" }) {
  /* `art` names a banner in assets/img/banners. Interior pages were a flat slab
     of olive with nothing in it, which is what the client meant by "only dark
     green". The photograph goes in as a background layer rather than an <img>
     so it can never push the heading around while it loads, and it is purely
     decorative: the heading carries the meaning, so there is nothing to caption
     and nothing for a screen reader to announce. */
  const banner = art ? bannerImage(art) : null;
  return `<section class="page-hero ${variant}${banner ? " page-hero--art" : ""}">
  ${banner ? `<div class="page-hero__media" aria-hidden="true" style="background-image:url('${asset(depth, banner)}')"></div>` : ""}
  <div class="page-hero__arch" aria-hidden="true"></div>
  <div class="wrap page-hero__inner">
    ${when(trail, crumbs({ c, locale, depth, trail: trail || [] }))}
    ${when(eyebrow, `<p class="eyebrow">${esc(eyebrow)}</p>`)}
    <h1 class="h1 page-hero__title">${esc(title)}</h1>
    ${when(text, `<p class="lede page-hero__text">${esc(text)}</p>`)}
    ${when(actions, `<div class="page-hero__actions">${actions}</div>`)}
  </div>
</section>`;
}

/* --------------------------------------------------------------------------
   Specialty card
   -------------------------------------------------------------------------- */
export function specialtyCard({ c, locale, depth, sp }) {
  const s = c.site;
  sp = { ...sp, image: sp.image || specialtyImage(sp.slug) };
  const img = sp.image
    ? `<img src="${asset(depth, sp.image)}"${responsiveAttrs(sp.image, IMAGE_SIZES.grid3, (path) => asset(depth, path))} alt="" width="600" height="480" loading="lazy" decoding="async">`
    : `<div class="card__placeholder" aria-hidden="true">${icon(sp.icon || "leaf", "card__placeholder-icon")}</div>`;

  return `<article class="card card--specialty" data-reveal>
    <div class="card__media arch arch--wide">
      ${img}
      ${when(!sp.staffed, `<span class="badge-sample badge-sample--soon">${esc(t(s.ui.comingSoon, locale))}</span>`)}
    </div>
    <div class="card__body">
      <span class="card__index">${esc(sp.index)}</span>
      <h3 class="card__title">
        <a class="card__link" href="${link(depth, `specialties/${sp.slug}.html`)}">${esc(t(sp.name, locale))}</a>
      </h3>
      <p class="card__text">${esc(t(sp.sub, locale))}</p>
      <div class="card__foot">
        <span class="link-cta">${esc(t(s.ui.viewSpecialty, locale))} ${icon("arrow")}</span>
      </div>
    </div>
  </article>`;
}

/* --------------------------------------------------------------------------
   Doctor card
   -------------------------------------------------------------------------- */
export function doctorCard({ c, locale, depth, d }) {
  const s = c.site;
  const media = d.portrait
    ? `<img src="${asset(depth, d.portrait)}" srcset="${asset(depth, d.portrait)} 450w, ${asset(depth, d.portrait2x || d.portrait)} 900w"
            sizes="(max-width: 640px) 46vw, 22vw"
            alt="${esc(t(d.name, locale))}" width="450" height="562" loading="lazy" decoding="async">`
    : `<div class="doctor-placeholder">${icon("user")}</div>`;

  return `<article class="card card--doctor" data-reveal>
    <div class="card__media${d.portrait ? " arch arch--ruled" : ""}">
      ${media}
      ${when(d.sample, `<span class="badge-sample">${esc(t(s.ui.sample, locale))}</span>`)}
    </div>
    <div class="card__body">
      <h3 class="card__title">
        <a class="card__link" href="${link(depth, `doctors/${d.slug}.html`)}">${esc(t(d.name, locale))}</a>
      </h3>
      <p class="card__role">${esc(t(d.title, locale))}</p>
      ${when(d.days, `<p class="card__days">${icon("calendar")} ${esc(t(d.days, locale))} · ${esc(t(d.hours, locale))}</p>`)}
    </div>
  </article>`;
}

/* --------------------------------------------------------------------------
   Review card
   -------------------------------------------------------------------------- */
export function reviewCard({ c, locale, r }) {
  const s = c.site;
  const name = t(r.name, locale) || t(r.name, "en") || "، ";
  const initial = name.trim().charAt(0);
  return `<article class="review" data-reveal>
    ${when(r.sample, `<span class="badge-sample">${esc(t(s.ui.sample, locale))}</span>`)}
    ${stars(r.rating || 5)}
    <p class="review__quote">${esc(t(r.text, locale))}</p>
    <div class="review__foot">
      <span class="review__avatar" aria-hidden="true">${esc(initial)}</span>
      <div>
        <p class="review__name">${esc(name)}</p>
        <p class="review__src">${when(r.source === "Google", icon("google"))}${esc(r.source || "")}</p>
      </div>
    </div>
  </article>`;
}

/* --------------------------------------------------------------------------
   Rating summary
   -------------------------------------------------------------------------- */
export function ratingSummary({ c, locale, depth }) {
  const s = c.site;
  const r = s.proof.rating;
  return `<div class="rating-summary" data-reveal>
    <span class="rating-summary__score">${r.value.toFixed(1)}</span>
    <div>
      ${stars(r.value, "rating rating--lg")}
      <p class="u-sm u-muted" style="margin-top:.35rem">
        ${esc(t({ ar: `من ${r.count} مراجعة على `, en: `From ${r.count} reviews on ` }, locale))}${esc(r.source)}
      </p>
    </div>
    <a class="btn btn--ghost btn--sm" href="${esc(r.url)}" target="_blank" rel="noopener" style="margin-inline-start:auto">
      ${icon("google")} ${esc(t({ ar: "شوف المراجعات", en: "Read the reviews" }, locale))}
    </a>
  </div>`;
}

/* --------------------------------------------------------------------------
   FAQ accordion
   -------------------------------------------------------------------------- */
export function faqList({ c, locale, items, idPrefix = "faq" }) {
  if (!items || !items.length) return "";
  return `<div class="faq">
    ${map(items, (f, i) => `<div class="faq__item">
      <h3>
        <button class="faq__q" type="button" aria-expanded="false" aria-controls="${idPrefix}-${i}">
          <span>${esc(t(f.q, locale))}</span>
          <span class="faq__icon" aria-hidden="true"></span>
        </button>
      </h3>
      <div class="faq__a" id="${idPrefix}-${i}">
        <div><div class="prose">${`<p>${esc(t(f.a, locale))}</p>`}</div></div>
      </div>
    </div>`)}
  </div>`;
}

/** FAQPage JSON-LD for a set of Q&As. */
export function faqSchema(items, locale) {
  if (!items || !items.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: t(f.q, locale),
      acceptedAnswer: { "@type": "Answer", text: t(f.a, locale) },
    })),
  };
}

/* --------------------------------------------------------------------------
   Before / after
   -------------------------------------------------------------------------- */
export function beforeAfter({ c, locale, depth, pair, index = 0, label = null }) {
  const s = c.site;
  if (!pair || !pair.before || !pair.after) {
    return `<div class="ba ba--placeholder" data-reveal>
      <div>
        ${icon("info")}
        ${when(label, `<p class="eyebrow" style="justify-content:center;margin-top:.5rem">${esc(t(label, locale))}</p>`)}
        <p style="margin-top:.6rem">${esc(t({ ar: "مكان صورة قبل وبعد: تُرفع من لوحة التحكم بعد موافقة المريض الكتابية", en: "Before & after slot: uploaded from the dashboard once the patient has given written consent" }, locale))}</p>
      </div>
    </div>`;
  }
  return `<div class="ba${pair.orientation === "portrait" ? " ba--portrait" : ""}" data-before-after data-reveal>
    <img class="ba__before" src="${asset(depth, pair.before)}"${responsiveAttrs(pair.before, IMAGE_SIZES.grid2, (path) => asset(depth, path))}${sizeAttrs(pair.before)} alt="${esc(t(s.ui.before, locale))}" loading="lazy" decoding="async">
    <img class="ba__after"  src="${asset(depth, pair.after)}"${responsiveAttrs(pair.after, IMAGE_SIZES.grid2, (path) => asset(depth, path))}${sizeAttrs(pair.after)}  alt="${esc(t(s.ui.after, locale))}"  loading="lazy" decoding="async">
    ${when(pair.sample, `<span class="badge-sample">${esc(t(s.ui.sample, locale))}</span>`)}
    <span class="ba__label ba__label--before">${esc(t(s.ui.before, locale))}</span>
    <span class="ba__label ba__label--after">${esc(t(s.ui.after, locale))}</span>
    <div class="ba__handle" role="slider" tabindex="0" aria-label="${esc(t({ ar: "قارن بين قبل وبعد", en: "Compare before and after" }, locale))}"
         aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"></div>
  </div>`;
}

/* A finished result card is one portrait image containing the complete branded
   before/after composition. It must never be treated as two slider images. */
export function resultsGallery({ locale, depth, items }) {
  const approved = (items || []).filter((item) =>
    item?.consent === true
    && item.image
    && String(t(item.alt, locale)).trim()
    && String(t(item.caption, locale)).trim()
  );
  if (!approved.length) return "";

  return `<div class="results-gallery">
    ${map(approved, (item) => `<figure class="result-card" data-reveal>
      <img src="${asset(depth, item.image)}" alt="${esc(t(item.alt, locale))}" width="800" height="1000" loading="lazy" decoding="async">
      <figcaption class="result-card__caption">${esc(t(item.caption, locale))}</figcaption>
    </figure>`)}
  </div>`;
}

export function sampleNotice({ c, locale }) {
  return `<div class="notice notice--sample">
    ${icon("info")}<p>${esc(t(c.site.legal.sampleContent, locale))}</p>
  </div>`;
}

/* --------------------------------------------------------------------------
   Booking finder
   -------------------------------------------------------------------------- */
export function finder({ c, locale, depth }) {
  const s = c.site;
  const specs = published(c.specialties);
  const docs = published(c.doctors);
  const branches = published(c.branches);

  return `<div class="wrap">
  <div class="finder glass glass--clear" data-finder data-reveal>
    <div class="finder__head">
      <div>
        <p class="eyebrow">${esc(t({ ar: "احجز في دقيقة", en: "Book in under a minute" }, locale))}</p>
        <h2 class="h4" style="margin-top:.5rem">${esc(t({ ar: "اختار التخصص والطبيب المناسب لحالتك", en: "Choose the specialty and the right doctor for your case" }, locale))}</h2>
      </div>
      <a class="link-cta" href="${esc(s.contact.whatsapp.href)}" target="_blank" rel="noopener">
        ${icon("whatsapp")} ${esc(t({ ar: "أو كلّمنا على واتساب", en: "Or message us on WhatsApp" }, locale))}
      </a>
    </div>

    <form class="finder__form" action="${link(depth, "patients/booking.html")}" method="get">
      <div class="field">
        <label class="field__label" for="f-specialty">${esc(t(s.ui.selectSpecialty, locale))}</label>
        <select class="select" id="f-specialty" name="specialty" data-finder-specialty>
          <option value="">${esc(t({ ar: "كل التخصصات", en: "All specialties" }, locale))}</option>
          ${map(specs, (sp) => `<option value="${esc(sp.slug)}">${esc(t(sp.name, locale))}${!sp.staffed ? ` · ${esc(t(s.ui.comingSoon, locale))}` : ""}</option>`)}
        </select>
      </div>

      <div class="field">
        <label class="field__label" for="f-doctor">${esc(t(s.ui.selectDoctor, locale))}</label>
        <select class="select" id="f-doctor" name="doctor" data-finder-doctor>
          <option value="">${esc(t({ ar: "أي طبيب متاح", en: "Any available doctor" }, locale))}</option>
          <!-- data-branches carries the branches this doctor actually holds a
               clinic at, so the branch select below can rule out combinations
               that do not exist. Same rule as the full booking form. -->
          ${map(docs, (d) => `<option value="${esc(d.slug)}" data-specialties="${esc((d.specialties || []).join(","))}" data-branches="${esc(Object.keys(d.schedule || {}).join(","))}">${esc(t(d.name, locale))}</option>`)}
        </select>
      </div>

      <div class="field">
        <label class="field__label" for="f-branch">${esc(t(s.ui.selectBranch, locale))}</label>
        <select class="select" id="f-branch" name="branch" data-finder-branch>
          ${map(branches, (b) => `<option value="${esc(b.slug)}"${b.status === "soon" ? " disabled" : ""}>${esc(t(b.name, locale))}${b.status === "soon" ? `، ${esc(t(s.ui.openingSoon, locale))}` : ""}</option>`)}
        </select>
      </div>

      <button class="btn btn--primary" type="submit">${esc(t(s.ui.findAppointment, locale))}</button>
    </form>
  </div>
</div>`;
}

/* --------------------------------------------------------------------------
   CTA band
   -------------------------------------------------------------------------- */
export function ctaBand({ c, locale, depth, title, text }) {
  const s = c.site;
  return `<section class="section section--tight">
  <div class="wrap">
    <div class="cta-band" data-reveal>
      <div class="cta-band__inner">
        <div>
          <h2 class="h2">${esc(title || t({ ar: "ابدأ بكشف حقيقي واحجز دلوقتي", en: "Start with a real consultation - book now" }, locale))}</h2>
          <p class="cta-band__text">${esc(text || t(s.hours.bookingNote, locale))}</p>
        </div>
        <!-- The arch wraps the buttons instead of floating beside them, so the
             outline actually frames what it points at. It used to be absolutely
             positioned against the whole band, which left the buttons sitting
             off its centre and reading as a misalignment. -->
        <div class="cta-band__side">
          <div class="cta-band__arch" aria-hidden="true"></div>
          <div class="cta-band__actions">
            <a class="btn btn--on-dark btn--lg" href="${link(depth, "patients/booking.html")}">${esc(t(s.ui.bookNow, locale))}</a>
            <a class="btn btn--whatsapp btn--lg" href="${esc(s.contact.whatsapp.href)}" target="_blank" rel="noopener">
              ${icon("whatsapp")} ${esc(t(s.ui.whatsappShort, locale))}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

/* --------------------------------------------------------------------------
   Stat strip
   -------------------------------------------------------------------------- */
export function statStrip({ c, locale, cls = "" }) {
  return `<div class="${cls}">
    ${map(c.site.proof.stats, (st) => `<div class="stat">
      <span class="stat__n">${esc(st.n)}</span>
      <span class="stat__l">${esc(t(st.label, locale))}</span>
    </div>`)}
  </div>`;
}

/* --------------------------------------------------------------------------
   Review topics
   Google publishes its own auto-generated topic labels and counts for a
   business. They are real, checkable, and a far more honest signal than a
   hand-picked pull quote، so while the individual review texts are still
   being transcribed, this is what carries the reviews page.
   -------------------------------------------------------------------------- */
/* Exported so a specialty's Reviews tab can show the same testimonials rather
   than only linking out to YouTube. `limit` keeps that tab to a short row: the
   full set belongs on the reviews page, not inside a specialty panel. */
export function reviewMediaSections({ c, locale, depth, limit = 0 }) {
  const videos = (c.reviews?.videos || []).map((video) => {
    const youtubeId = String(video?.youtubeId || "").trim();
    const title = String(t(video?.title, locale)).trim();
    const caption = String(t(video?.caption, locale)).trim();
    return /^[A-Za-z0-9_-]{6,20}$/.test(youtubeId) && title && caption
      ? { youtubeId, title, caption, orientation: video?.orientation === "portrait" ? "portrait" : "landscape" }
      : null;
  }).filter(Boolean);

  const screenshots = (c.reviews?.screenshots || []).map((screenshot) => {
    const image = String(screenshot?.image || "").trim();
    const alt = String(t(screenshot?.alt, locale)).trim();
    const allowedSources = ["google", "whatsapp", "instagram", "other"];
    const source = allowedSources.includes(screenshot?.source) ? screenshot.source : "other";
    return screenshot?.consent === true && image && alt ? { image, alt, source } : null;
  }).filter(Boolean);

  const sourceLabels = {
    google: { ar: "Google", en: "Google" },
    whatsapp: { ar: "WhatsApp", en: "WhatsApp" },
    instagram: { ar: "Instagram", en: "Instagram" },
    other: { ar: "مصدر آخر", en: "Other source" },
  };

  const mediaHeading = ({ id, title, lede = "" }) => `<div class="section-head" data-reveal>
    <h2 class="h2" id="${esc(id)}">${esc(title)}</h2>
    ${when(lede, `<p class="lede">${esc(lede)}</p>`)}
  </div>`;

  const shown = limit > 0 ? videos.slice(0, limit) : videos;
  const videoSection = shown.length ? `<section class="review-media-section" aria-labelledby="video-testimonials-title">
    ${mediaHeading({
      id: "video-testimonials-title",
      title: t({ ar: "تجارب العملاء بالفيديو", en: "Patient video testimonials" }, locale),
    })}
    <div class="video-testimonials">
      ${map(shown, (video) => `<figure class="video-testimonial" data-reveal>
        <div class="video-testimonial__media${video.orientation === "portrait" ? " video-testimonial__media--portrait" : ""}" data-youtube-facade data-youtube-id="${esc(video.youtubeId)}" data-youtube-title="${esc(video.title)}">
          <button class="video-facade" type="button" data-youtube-play aria-label="${esc(t({ ar: `شغّل الفيديو: ${video.title}`, en: `Play video: ${video.title}` }, locale))}">
            <span class="video-facade__thumbnail" aria-hidden="true">
              ${icon("youtube", "video-facade__brand-icon")}
              <span class="video-facade__thumb-title">${esc(video.title)}</span>
            </span>
            <span class="video-facade__play" aria-hidden="true"></span>
          </button>
        </div>
        <figcaption class="video-testimonial__caption">
          <strong>${esc(video.title)}</strong>
          <p>${esc(video.caption)}</p>
        </figcaption>
      </figure>`)}
    </div>
  </section>` : "";

  const screenshotSection = screenshots.length ? `<section class="review-media-section" aria-labelledby="review-screenshots-title">
    ${mediaHeading({
      id: "review-screenshots-title",
      title: t({ ar: "رسائل وتجارب العملاء", en: "Customer feedback screenshots" }, locale),
    })}
    <div class="review-screenshots">
      ${map(screenshots, (screenshot) => `<figure class="review-screenshot" data-reveal>
        <img src="${asset(depth, screenshot.image)}" alt="${esc(screenshot.alt)}" width="900" height="1200" loading="lazy" decoding="async">
        <figcaption>${esc(t(sourceLabels[screenshot.source], locale))}</figcaption>
      </figure>`)}
    </div>
  </section>` : "";

  return `${videoSection}${screenshotSection}`;
}

export function reviewTopics({ c, locale, depth }) {
  const topics = c.reviews?.topics?.items || [];
  const mediaSections = reviewMediaSections({ c, locale, depth });
  if (!topics.length) return mediaSections;
  const max = Math.max(...topics.map((x) => x.count));
  const topicSection = `<div data-reveal>
    <h2 class="h3">${esc(t({ ar: "أكتر حاجة بيتكلم عنها المرضى", en: "What patients mention most" }, locale))}</h2>
    <p class="u-sm u-muted" style="margin-top:.6rem;max-width:var(--measure-narrow)">${esc(t({
      ar: "دي التصنيفات اللي جوجل نفسه بيستخرجها من نص المراجعات، والعدد جنب كل واحدة هو عدد المراجعات اللي ذكرتها.",
      en: "These are the topics Google itself extracts from the review text; the number beside each is how many reviews mention it.",
    }, locale))}</p>
    <div class="stack" style="margin-top:1.5rem">
      ${map(topics, (x) => `<div class="tool__log-item" style="grid-template-columns:minmax(7rem,auto) 1fr auto">
        <span>${esc(t(x.label, locale))}</span>
        <span class="tool__bar" style="margin:0"><span class="tool__bar-fill is-ok" style="width:${Math.round((x.count / max) * 100)}%"></span></span>
        <b>${esc(String(x.count))}</b>
      </div>`)}
    </div>
    <p class="u-xs u-faint" style="margin-top:1rem">${esc(t({
      ar: `المصدر: نشاط لاروز التجاري على جوجل، تم التحقق في ${c.reviews.aggregate.checked}.`,
      en: `Source: La Rose's Google Business listing، verified ${c.reviews.aggregate.checked}.`,
    }, locale))}</p>
  </div>`;
  return mediaSections ? `${topicSection}${mediaSections}` : topicSection;
}

/** Before/after pairs for a specialty, or the shared sample set. */
export function beforeAfterPairs(c, specialtySlug = null) {
  const all = c.reviews?.beforeAfter?.pairs || [];
  if (!specialtySlug) return all;
  const mine = all.filter((p) => p.specialty === specialtySlug);
  return mine.length ? mine : all.slice(0, 3);
}

/* ==========================================================================
   SHARE + ASK-AI
   Sits under every Knowledge Centre entry. Everything about it - which
   networks appear, the labels, the question the assistants are handed - comes
   from `sharing` in site.json, so the clinic changes it in the dashboard and
   every article picks the change up on the next build. Nothing here is
   per-article except the title and the URL.
   ========================================================================== */

/* Assistants differ in what they accept. ChatGPT and Claude take the question
   in the query string and open with it already typed. Gemini has no documented
   equivalent, so its button copies the question and opens the app, and the
   label says "copy the question" rather than implying a prefill that will not
   happen. Promising the wrong thing is worse than the extra tap. */
const ASSISTANT_TARGETS = {
  chatgpt: { url: (q) => `https://chatgpt.com/?q=${encodeURIComponent(q)}`, prefills: true },
  claude:  { url: (q) => `https://claude.ai/new?q=${encodeURIComponent(q)}`, prefills: true },
  gemini:  { url: () => "https://gemini.google.com/app", prefills: false },
};

const SHARE_TARGETS = {
  whatsapp: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  x:        (url, title) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
  telegram: (url, title) => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  linkedin: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
};

const SHARE_ICONS = {
  whatsapp: "whatsapp", facebook: "facebook", x: "x",
  telegram: "telegram", linkedin: "linkedin", copy: "link",
};

export function shareBlock({ c, locale, url, title }) {
  const cfg = c.site.sharing;
  if (!cfg || cfg.enabled === false) return "";

  const enabled = (list) => (Array.isArray(list) ? list : []).filter((x) => x && x.enabled !== false);

  const networks = enabled(cfg.networks).map((n) => {
    const label = t(n.label, locale) || n.key;
    const glyph = icon(SHARE_ICONS[n.key] || "link", "share__icon");
    if (n.key === "copy") {
      /* A button, not a link: there is nowhere to navigate to. With JS off it
         is simply absent rather than a control that does nothing. */
      return `<li class="share__item" data-share-copy-item hidden><button class="share__btn" type="button"
        data-share-copy="${esc(url)}">${glyph}<span>${esc(label)}</span></button></li>`;
    }
    const build = SHARE_TARGETS[n.key];
    if (!build) return "";
    return `<li class="share__item"><a class="share__btn" href="${esc(build(url, title))}"
      target="_blank" rel="noopener noreferrer">${glyph}<span>${esc(label)}</span></a></li>`;
  }).join("");

  const ask = cfg.ask || {};
  const question = (t(ask.question, locale) || "")
    .replace(/\{title\}/g, title)
    .replace(/\{url\}/g, url);

  const assistants = ask.enabled === false ? "" : enabled(ask.assistants).map((a) => {
    const target = ASSISTANT_TARGETS[a.key];
    if (!target) return "";
    const label = t(a.label, locale) || a.key;
    /* The question rides on the element for the copy-and-open case; it is the
       same string the prefilled links carry, so the two paths cannot drift. */
    return `<li class="share__item"><a class="share__btn share__btn--ai" href="${esc(target.url(question))}"
      target="_blank" rel="noopener noreferrer"${target.prefills ? "" : ` data-ask-copy="${esc(question)}"`}
      >${icon("ai", "share__icon")}<span>${esc(label)}</span></a></li>`;
  }).join("");

  return `<section class="section section--tight entry-share" style="padding-top:0">
  <div class="wrap wrap--narrow">
    <div class="share" data-share-copied="${esc(t(cfg.copied, locale) || "Copied")}">
      ${when(networks, `<h2 class="h4 share__title">${esc(t(cfg.heading, locale))}</h2>
      <ul class="share__row">${networks}</ul>`)}
      ${when(assistants, `<div class="share__ask">
        <h2 class="h4 share__title">${esc(t(ask.heading, locale))}</h2>
        <ul class="share__row">${assistants}</ul>
      </div>`)}
    </div>
  </div>
</section>`;
}
