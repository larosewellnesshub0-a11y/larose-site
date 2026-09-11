/* ==========================================================================
   Home page، the reference implementation.
   Every other page follows the composition conventions established here.
   ========================================================================== */

import { t, ta, esc, link, asset, icon, sprig, map, when, published, doctorsIn, branchCardImage } from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import {
  sectionHead, specialtyCard, doctorCard, reviewCard, ratingSummary,
  finder, ctaBand, statStrip, beforeAfter,
} from "../lib/components.mjs";

export function renderHome({ c, locale }) {
  const s = c.site;
  const depth = 0;
  const specs = published(c.specialties);
  const featuredDocs = published(c.doctors).filter((d) => d.featured);
  const branches = published(c.branches);
  const reviews = (c.reviews.reviews || []).filter((r) => r.published !== false).slice(0, 3);
  const articles = (c.articles.articles || []).filter((a) => a.published !== false).slice(0, 3);
  const maadi = branches.find((b) => b.isPrimary) || branches[0];
  // The hero is brand atmosphere, not a record of the premises، it is marked
  // `illustrative` in site.json and carries an empty alt. The REAL photographs
  // of the Maadi branch are used further down the page and on the branch page.
  const heroPhoto = s.media?.homeHero?.src || maadi?.photos?.[0]?.src;

  const body = `

<!-- ============================ HERO ============================ -->
<section class="hero">
  <div class="hero__media" role="presentation"
       style="background-image:url('${asset(depth, heroPhoto)}')"></div>
  <div class="wrap hero__inner">
    <p class="hero__brand lat" lang="en" dir="ltr">${esc(t(s.brand.name, "en"))}</p>
    <p class="eyebrow">${esc(t(s.brand.kind, locale))}</p>
    <h1 class="h-display hero__title">${esc(t({
      ar: "حالتك أكبر من رأي تخصص واحد",
      en: "Your case is more than one specialty’s opinion",
    }, locale))}</h1>
    <p class="hero__text">${esc(t({
      ar: "لاروز مركز طبي متعدد التخصصات في المعادي الجديدة، بيجمع التغذية العلاجية وإدارة الوزن وبدائل التكميم ونحت الجسم، الباطنة والكبد والمناظير، الجراحة العامة وجراحات السمنة، الجلدية وطب الأطفال. ولأن الأقسام بتتشاور مع بعض، حالتك بتتشاف من أكتر من زاوية في زيارة واحدة.",
      en: "La Rose is a multidisciplinary medical centre in New Maadi, bringing together clinical nutrition, weight management and sleeve alternatives, body contouring, internal medicine, liver care and endoscopy, general and bariatric surgery, dermatology and paediatrics. Because our departments consult one another, your case is considered from more than one perspective in a single visit.",
    }, locale))}</p>

    <div class="hero__actions">
      <a class="btn btn--accent btn--lg" href="${link(depth, "patients/booking.html")}">${esc(t(s.ui.bookNow, locale))}</a>
      <a class="btn btn--on-dark btn--lg" href="${link(depth, "specialties/")}">${esc(t({ ar: "استكشف التخصصات", en: "Explore specialties" }, locale))}</a>
    </div>

    <div class="hero__proof">
      ${map(s.proof.stats, (st) => `<div class="stat">
        <span class="stat__n">${esc(st.n)}</span>
        <span class="stat__l">${esc(t(st.label, locale))}</span>
      </div>`)}
    </div>
  </div>
</section>

<!-- =========================== FINDER =========================== -->
${finder({ c, locale, depth })}

<!-- ====================== QUICK SERVICES ======================= -->
<section class="section section--tight">
  <div class="wrap">
    <div class="grid grid-4">
      ${map([
        {
          href: "patients/home-visits.html", ico: "pin", soon: true,
          title: s.ui.homeVisits,
          text: { ar: "كشف ومتابعة في البيت لما الوصول للعيادة يكون صعب. الخدمة تحت التجهيز وهنبدأها قريباً.", en: "Consultation and follow-up at home when getting to the clinic is difficult. The service is being prepared and starts soon." },
        },
        {
          href: "digital/online-diet.html", ico: "monitor",
          title: s.ui.onlineFollowUp,
          text: { ar: "خطة تغذية ومتابعة من أي مكان، حسب حالتك وشكل يومك.", en: "A nutrition plan and follow-up from anywhere, shaped around your case and your day." },
        },
        {
          href: "tools/index.html", ico: "activity",
          title: s.ui.healthTools,
          text: { ar: "حاسبات ومتتبعات بسيطة تساعدك تفهم أرقامك وتسجّل تقدمك.", en: "Simple calculators and trackers to understand your numbers and record your progress." },
        },
        {
          href: t(s.contact.whatsapp.href, locale), ico: "whatsapp", external: true,
          title: s.ui.whatsappShort,
          text: { ar: "اسأل عن الخدمة المناسبة أو ابعت طلب حجز لفريق الاستقبال.", en: "Ask about the right service or send reception an appointment request." },
        },
      ], (service) => `<article class="card" data-reveal>
        <div class="card__body">
          <span class="chip">${icon(service.ico)} ${esc(t(service.soon
            ? { ar: "قريباً", en: "Coming soon" }
            : { ar: "خدمة سريعة", en: "Quick service" }, locale))}</span>
          <h2 class="card__title">
            <a class="card__link" href="${service.external ? esc(service.href) : link(depth, service.href)}"${service.external ? ' target="_blank" rel="noopener"' : ""}>${esc(t(service.title, locale))}</a>
          </h2>
          <p class="card__text">${esc(t(service.text, locale))}</p>
          <div class="card__foot">
            <span class="link-cta">${esc(t(s.ui.learnMore, locale))} ${icon("arrow")}</span>
          </div>
        </div>
      </article>`)}
    </div>
  </div>
</section>

<!-- ========================= SPECIALTIES ======================== -->
<section class="section" id="specialties">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "التخصصات", en: "Specialties" }, locale),
      title: t({ ar: "تخصصات بتشتغل مع بعض، مش كل تخصص لوحده", en: "Specialties that work together, not in isolation" }, locale),
      lede: t({
        ar: "أغلب المشاكل الصحية مش بتيجي لوحدها. عشان كده أقسامنا بتتشاور مع بعض: التغذية مع الباطنة، الجلدية مع التغذية، عشان تتعالج الحالة مش العرض.",
        en: "Most health problems do not arrive alone. That is why our departments confer with one another: nutrition with internal medicine, dermatology with nutrition، so the case is treated rather than the symptom.",
      }, locale),
    })}
    <div class="grid grid-3">
      ${map(specs, (sp) => specialtyCard({ c, locale, depth, sp }))}
    </div>
  </div>
</section>

<!-- ====================== THE DIFFERENCE ======================== -->
<section class="section section--dark section--integrated">
  ${sprig("sprig sprig--br")}
  <div class="wrap">
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr));align-items:center;gap:clamp(2rem,5vw,4.5rem)">

      <div data-reveal>
        <p class="eyebrow">${esc(t({ ar: "الكشف المتكامل", en: "The integrated consultation" }, locale))}</p>
        <h2 class="h2" style="margin-top:.7rem">${esc(t({
          ar: "زيارة واحدة، وحالتك تتشاف من أكتر من زاوية",
          en: "One visit, with your case considered from more than one angle",
        }, locale))}</h2>
        <p class="lede" style="margin-top:1.1rem">${esc(t({
          ar: "أغلب الأعراض مش بتخص قسم واحد. وجع البطن ممكن يكون باطنة أو جراحة، وتساقط الشعر ممكن يكون جلدية أو نقص غذائي، والوزن الزايد ممكن يكون غدة. عشان كده الأقسام هنا بتتشاور مع بعض قبل ما الخطة تتكتب، وأوضح مثال على ده الكشف المتكامل بين التغذية والباطنة.",
          en: "Most symptoms do not belong to a single department. Abdominal pain can be medical or surgical; hair loss can be dermatological or nutritional; weight gain can be thyroid. So the departments here confer before the plan is written, and the clearest example of that is the integrated nutrition and internal-medicine consultation.",
        }, locale))}</p>

        <ul class="prose" style="margin-top:1.75rem;color:rgba(246,244,236,.8)">
          ${map(ta(c.site.integratedConsultation?.items, locale), (li) => `<li>${esc(li)}</li>`)}
        </ul>
        ${when(t(c.site.integratedConsultation?.closing, locale), `<p class="u-sm" style="margin-top:1.5rem;color:rgba(246,244,236,.72)">${esc(t(c.site.integratedConsultation.closing, locale))}</p>`)}

        <div class="cluster" style="margin-top:2rem">
          <a class="btn btn--on-dark" href="${link(depth, "specialties/clinical-nutrition.html")}">${esc(t({ ar: "تفاصيل الكشف المتكامل", en: "About the integrated consultation" }, locale))}</a>
        </div>
      </div>

      <div data-reveal style="--reveal-delay:120ms">
        <div class="arch arch--ruled arch--tall" style="max-width:26rem;margin-inline:auto">
          ${/* The three disciplines the integrated consultation actually
                combines, rather than a generic waiting-room shot. */""}
          <img src="${asset(depth, "assets/img/clinic/integrated-consultation.webp")}" alt="${esc(t({ ar: "التغذية والباطنة والسونار في زيارة واحدة داخل عيادات لاروز بالمعادي", en: "Nutrition, internal medicine and ultrasound in one visit at La Rose Maadi" }, locale))}" width="600" height="750" loading="lazy" decoding="async">
        </div>
      </div>

    </div>
  </div>
</section>

<!-- ==================== WHAT BRINGS PEOPLE HERE ================== -->
<section class="section section--sunk" id="reasons">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "الحالات", en: "Conditions" }, locale),
      title: t({ ar: "الناس بتيجي لاروز عشان إيه", en: "What brings people to La Rose" }, locale),
      lede: t({
        ar: "مش كل اللي بييجي هنا جاي عشان الوزن. دي أكتر الحالات اللي بنشوفها، وكل واحدة تحت التخصص اللي بيعالجها.",
        en: "Not everyone who comes here comes about weight. These are the cases we see most, each under the specialty that treats it.",
      }, locale),
    })}
    <div class="grid grid-4">
      ${map(specs.map((sp) => ({ sp, items: (t(sp.treats, locale) || []).slice(0, 4) })), ({ sp, items }) => `
        <div class="card" data-reveal>
          <div class="card__body">
            <span class="chip chip--gold">${icon(sp.icon || "leaf")} ${esc(t(sp.short || sp.name, locale))}</span>
            <ul class="prose" style="font-size:var(--t-sm);margin-top:.25rem">
              ${map(items, (x) => `<li>${esc(x)}</li>`)}
            </ul>
            <div class="card__foot">
              <a class="link-cta" href="${link(depth, `specialties/${sp.slug}.html`)}">${esc(t(s.ui.viewSpecialty, locale))} ${icon("arrow")}</a>
            </div>
          </div>
        </div>`)}
    </div>
  </div>
</section>

<!-- =========================== DOCTORS ========================== -->
<section class="section" id="doctors">
  <div class="wrap">
    ${sectionHead({
      /* No eyebrow here on purpose. The eyebrow said "the medical team" and the
         title then said something else entirely, which read as two competing
         headings stacked on top of each other. The section name is the heading
         now and the sentence under it does the explaining. */
      title: t({ ar: "الفريق الطبي", en: "The medical team" }, locale),
      lede: t({
        ar: "كل طبيب في لاروز بيقضّي وقت حقيقي في الكشف: التاريخ الطبي، التحاليل، والفحص. بحيث تكون الخطة شاملة للوصول لأحسن نتيجة ممكنة!",
        en: "Every doctor at La Rose spends real time on the consultation: the history, the labs, the examination, so the plan is a complete one aimed at the best result possible.",
      }, locale),
    })}
    <div class="grid grid-4">
      ${map(featuredDocs, (d) => doctorCard({ c, locale, depth, d }))}
    </div>
    <div class="cluster" style="margin-top:2.75rem;justify-content:center">
      <a class="btn btn--ghost" href="${link(depth, "doctors/")}">${esc(t({ ar: "كل الأطباء", en: "All doctors" }, locale))}</a>
    </div>
  </div>
</section>

<!-- =========================== REVIEWS ========================== -->
<section class="section section--sunk" id="reviews">
  <div class="wrap">
    ${sectionHead({
      title: t({ ar: "اراء المرضى", en: "Patient reviews" }, locale),
    })}
    ${ratingSummary({ c, locale, depth })}
    ${when(reviews.length, `<div class="grid grid-3" style="margin-top:2rem">
      ${map(reviews, (r) => reviewCard({ c, locale, r }))}
    </div>`)}
    <div class="cluster" style="margin-top:2.5rem">
      <a class="btn btn--ghost" href="${link(depth, "about/reviews.html")}">${esc(t({ ar: "كل الآراء", en: "All reviews" }, locale))}</a>
      <a class="btn btn--ghost" href="${link(depth, "about/video-testimonials.html")}">
        ${icon("youtube")} ${esc(t({ ar: "فيديوهات تجارب العملاء", en: "Patient video testimonials" }, locale))}
      </a>
    </div>
  </div>
</section>

<!-- ========================= LA ROSE DIGITAL ===================== -->
<section class="section" id="digital">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "لاروز ديچيتال", en: "La Rose Digital" }, locale),
      title: t({ ar: "لو مش قادر توصل العيادة", en: "For when you cannot get to the clinic" }, locale),
      lede: t({
        ar: "خدمتين مصممين تشتغلوا من أي مكان: كتاب وصفات عملي، وبرنامج متابعة أونلاين بنفس الخطة ونفس المتابعة الأسبوعية.",
        en: "Two services designed to work from anywhere: a practical recipe book, and an online follow-up programme with the same plan and the same weekly review.",
      }, locale),
    })}
    <div class="grid grid-2">
      ${map([
        {
          slug: "recipe-book", ico: "book",
          name: { ar: "كتاب وصفات لاروز", en: "The La Rose Recipe Book" },
          text: {
            ar: "٢٥٠ وصفة مصرية بالسعرات والماكروز، مبنية على أكل البيت، مش وصفات مستوردة بمكونات مش موجودة. دليل عملي تشتريه مرة وتستخدمه دايماً.",
            en: "250 Egyptian recipes with calories and macros, built around home cooking، not imported recipes with ingredients you cannot find. A practical guide you buy once and keep using.",
          },
        },
        {
          slug: "online-diet", ico: "monitor",
          name: { ar: "المتابعة أونلاين", en: "Online Nutrition Programme" },
          text: {
            ar: "خطة غذائية متخصصة حسب وزنك وحالتك الصحية، ومتابعة يومية، ومراجعة نتايجك أول بأول، فردي أو ضمن مجموعة.",
            en: "A nutrition plan built for your weight and your health status, daily follow-up, and your results reviewed as you go، individually or within a group.",
          },
        },
      ], (p) => `<article class="card card--product" data-reveal>
        <div class="card__body">
          <span class="chip chip--gold">${icon(p.ico)} ${esc(t({ ar: "خدمة رقمية", en: "Digital service" }, locale))}</span>
          <h3 class="card__title" style="margin-top:.4rem">
            <a class="card__link" href="${link(depth, `digital/${p.slug}.html`)}">${esc(t(p.name, locale))}</a>
          </h3>
          <p class="card__text">${esc(t(p.text, locale))}</p>
          <div class="card__foot">
            <span class="link-cta">${esc(t(s.ui.learnMore, locale))} ${icon("arrow")}</span>
          </div>
        </div>
      </article>`)}
    </div>
  </div>
</section>

<!-- =========================== BRANCHES ========================== -->
<section class="section section--tint" id="branches">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "الفروع", en: "Branches" }, locale),
      title: t({ ar: "المعادي والتجمع دلوقتي، والشيخ زايد قريباً", en: "Maadi and Fifth Settlement now, Sheikh Zayed soon" }, locale),
    })}
    <div class="grid grid-3">
      ${map(branches, (b) => `<article class="card card--branch" data-reveal>
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
      </article>`)}
    </div>
  </div>
</section>

<!-- =========================== ARTICLES ========================== -->
${when(articles.length, `
<section class="section" id="articles">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "المركز المعرفي", en: "Health library" }, locale),
      title: t({ ar: "معلومات ونصائح هتفرق في حياتك اليومية مبنيين على معلومات وخبرات حقيقية من أطبائنا", en: "Guidance you can use day to day, built on our doctors' real experience" }, locale),
    })}
    <div class="grid grid-3">
      ${map(articles, (a) => `<article class="card card--article" data-reveal>
        <div class="card__media arch arch--wide">
          ${a.image ? `<img src="${asset(depth, a.image)}" alt="" width="600" height="375" loading="lazy" decoding="async">` : ""}
        </div>
        <div class="card__body">
          <div class="card__meta"><span>${esc(t(a.category, locale))}</span><span>${esc(a.readingTime || "")}</span></div>
          <h3 class="card__title"><a class="card__link" href="${link(depth, `articles/${a.slug}.html`)}">${esc(t(a.title, locale))}</a></h3>
          <p class="card__text">${esc(t(a.excerpt, locale))}</p>
        </div>
      </article>`)}
    </div>
    <div class="cluster" style="margin-top:2.5rem;justify-content:center">
      <a class="btn btn--ghost" href="${link(depth, "articles/")}">${esc(t({ ar: "كل المقالات", en: "All articles" }, locale))}</a>
    </div>
  </div>
</section>`)}

<!-- ============================ CTA ============================= -->
${ctaBand({ c, locale, depth })}


`;

  return page({
    c, locale, depth, pagePath: "index.html",
    active: null,
    title: null,
    description: t({
      ar: "عيادات لاروز في المعادي والتجمع الخامس: كشف بياخد وقته مع طبيب متخصص، تغذية علاجية وباطنة وأطفال وجراحة، وحجز أونلاين في دقيقة. الكشف بيشمل تحليل التركيب الجسمي InBody ومتابعة أسبوعية.",
      en: "La Rose Wellness Hub, Maadi and Fifth Settlement: unhurried consultations in nutrition, internal medicine, paediatrics and surgery. Book online today. Every consultation includes InBody body-composition analysis and weekly follow-up.",
    }, locale),
    body,
  });
}
