/* ========================================================================== 
   Contact and not-found pages
   ========================================================================== */

import { t, esc, link, icon, map, when, published } from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import { pageHero, sectionHead } from "../lib/components.mjs";

function contactCard({ locale, ico, title, text, href, external = false }) {
  return `<article class="card" data-reveal>
    <div class="card__body">
      <span class="chip">${icon(ico)} ${esc(t(title, locale))}</span>
      <h3 class="h4" style="margin-top:1rem">${esc(t(title, locale))}</h3>
      <p class="card__text">${text}</p>
      <a class="link-cta" href="${href}"${external ? ' target="_blank" rel="noopener"' : ""}>${esc(t({ ar: "افتح الرابط", en: "Open link" }, locale))} ${icon("arrow")}</a>
    </div>
  </article>`;
}

function contactPage({ c, locale }) {
  const depth = 0;
  const s = c.site;
  const branches = published(c.branches);
  const maadi = branches.find((b) => b.isPrimary) || branches[0];
  const messageIntro = t({ ar: "رسالة جديدة من صفحة التواصل في موقع لاروز", en: "New message from the La Rose website contact page" }, locale);
  const messageInvalid = t({ ar: "من فضلك اكتب الاسم ورقم التليفون بشكل صحيح.", en: "Please enter your name and phone number correctly." }, locale);
  const messageSent = t({ ar: "فتحنا واتساب في نافذة جديدة. راجع الرسالة وابعتها.", en: "WhatsApp has opened in a new window. Review the message and send it when ready." }, locale);
  const mapUrl = maadi?.geo
    ? `https://www.google.com/maps?q=${maadi.geo.lat},${maadi.geo.lng}&z=16&output=embed`
    : "";
  const channels = [
    {
      ico: "phone",
      title: { ar: "التليفون", en: "Phone" },
      text: `<bdi class="num">${esc(s.contact.phone.display)}</bdi>`,
      href: `tel:${esc(s.contact.phone.tel)}`,
    },
    {
      ico: "whatsapp",
      title: { ar: "واتساب", en: "WhatsApp" },
      text: esc(t({ ar: "للحجز والأسئلة قبل الزيارة", en: "For bookings and questions before your visit" }, locale)),
      href: esc(s.contact.whatsapp.href),
      external: true,
    },
    {
      ico: "instagram",
      title: { ar: "Instagram", en: "Instagram" },
      text: esc(t({ ar: "تابع أخبار العيادة والمحتوى الجديد", en: "Follow clinic updates and new content" }, locale)),
      href: esc(s.social.instagram),
      external: true,
    },
    {
      ico: "youtube",
      title: { ar: "YouTube", en: "YouTube" },
      text: esc(t({ ar: "فيديوهات لاروز وتجارب المرضى", en: "La Rose videos and patient experiences" }, locale)),
      href: esc(s.social.youtube),
      external: true,
    },
    {
      ico: "pin",
      title: { ar: "العنوان", en: "Address" },
      text: esc(t(maadi?.address, locale)),
      href: esc(maadi?.mapsUrl || "#"),
      external: true,
    },
  ];

  const body = `
${pageHero({
  c, locale, depth,
  eyebrow: t({ ar: "اتصل بنا", en: "Contact" }, locale),
  title: t({ ar: "إحنا هنا لما تحتاج تسأل أو تحجز", en: "We are here when you need to ask or book" }, locale),
  text: t({
    ar: "اختار الطريقة الأسهل ليك، أو ابعت تفاصيل رسالتك وهنفتحها لك جاهزة على واتساب.",
    en: "Choose the channel that suits you, or send the details below and we will prepare the message for you in WhatsApp.",
  }, locale),
  trail: [{ label: t({ ar: "اتصل بنا", en: "Contact" }, locale), href: "contact.html" }],
  art: "contact"})}

<section class="section">
  <div class="wrap">
    <div class="grid grid-2" style="align-items:start;gap:clamp(2rem,5vw,4.5rem)">
      <div>
        ${sectionHead({
          eyebrow: t({ ar: "طرق التواصل", en: "Contact channels" }, locale),
          title: t({ ar: "اختار الأنسب ليك", en: "Choose what works for you" }, locale),
        })}
        <div class="grid grid-2">
          ${map(channels, (channel) => contactCard({ locale, ...channel }))}
        </div>
      </div>

      <form class="card" data-whatsapp-form="201040661893"
            data-msg-intro="${esc(messageIntro)}"
            data-msg-invalid="${esc(messageInvalid)}"
            data-msg-sent="${esc(messageSent)}" novalidate data-reveal>
        <div class="card__body">
          <h2 class="h3">${esc(t({ ar: "ابعت لنا رسالة", en: "Send us a message" }, locale))}</h2>
          <p class="u-sm u-muted" style="margin-top:.75rem">${esc(t({
            ar: "لما تضغط إرسال، هنفتح رسالتك في واتساب عشان تراجعها وتبعتها بنفسك.",
            en: "When you submit, we will open your message in WhatsApp so you can review and send it yourself.",
          }, locale))}</p>

          <div class="form-grid" style="margin-top:1.5rem">
            <div class="field">
              <label class="field__label" for="contact-name">${esc(t({ ar: "الاسم الكامل *", en: "Full name *" }, locale))}</label>
              <input class="input" id="contact-name" name="name" type="text" autocomplete="name" required>
            </div>

            <div class="field">
              <label class="field__label" for="contact-phone">${esc(t({ ar: "رقم التليفون *", en: "Phone number *" }, locale))}</label>
              <input class="input" id="contact-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required>
            </div>

            <div class="field">
              <label class="field__label" for="contact-branch">${esc(t({ ar: "الفرع المفضّل", en: "Preferred branch" }, locale))}</label>
              <select class="select" id="contact-branch" name="branch">
                <option value="">${esc(t({ ar: "اختار الفرع", en: "Select a branch" }, locale))}</option>
                ${map(branches, (b) => `<option value="${esc(b.slug)}"${b.status === "soon" ? " disabled" : ""}>${esc(t(b.name, locale))}${b.status === "soon" ? `، ${esc(t(s.ui.openingSoon, locale))}` : ""}</option>`)}
              </select>
            </div>

            <div class="field">
              <label class="field__label" for="contact-subject">${esc(t({ ar: "موضوع الرسالة", en: "Subject" }, locale))}</label>
              <select class="select" id="contact-subject" name="subject">
                <option value="">${esc(t({ ar: "اختار الموضوع", en: "Select a subject" }, locale))}</option>
                <option value="booking">${esc(t({ ar: "حجز أو تعديل موعد", en: "Book or change an appointment" }, locale))}</option>
                <option value="visit">${esc(t({ ar: "سؤال قبل الزيارة", en: "Question before a visit" }, locale))}</option>
                <option value="feedback">${esc(t({ ar: "ملاحظة أو اقتراح", en: "Feedback or suggestion" }, locale))}</option>
                <option value="other">${esc(t({ ar: "موضوع تاني", en: "Something else" }, locale))}</option>
              </select>
            </div>

            <div class="field" style="grid-column:1/-1">
              <label class="field__label" for="contact-message">${esc(t({ ar: "الرسالة", en: "Message" }, locale))}</label>
              <textarea class="textarea" id="contact-message" name="message" rows="6"></textarea>
            </div>
          </div>

          <button class="btn btn--primary" type="submit" style="margin-top:1.25rem">${icon("whatsapp")} ${esc(t({ ar: "افتح الرسالة على واتساب", en: "Open message in WhatsApp" }, locale))}</button>
          <p class="form-status" data-form-status hidden></p>
        </div>
      </form>
    </div>
  </div>
</section>

${when(mapUrl, `<section class="section section--sunk">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "فرع المعادي", en: "Maadi branch" }, locale),
      title: t({ ar: "موقعنا على الخريطة", en: "Find us on the map" }, locale),
      lede: t(maadi?.address, locale),
    })}
    <div style="border-radius:var(--r-lg);overflow:hidden" data-reveal>
      <iframe src="${esc(mapUrl)}" title="${esc(t({ ar: "خريطة موقع فرع لاروز بالمعادي", en: "Map showing the La Rose Maadi branch" }, locale))}" style="display:block;width:100%;aspect-ratio:16/9;border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </div>
  </div>
</section>`)}`;

  return {
    path: `${locale}/contact.html`,
    html: page({
      c, locale, depth, pagePath: "contact.html",
      title: t({ ar: "اتصل بنا", en: "Contact us" }, locale),
      description: t({
        ar: "اتصل بعيادات لاروز أو ابعت رسالة واتساب لحجز موعد أو للسؤال عن خدمة. هنا رقم العيادة وعنوان فرع المعادي الجديدة ومواعيد العمل وحسابات Instagram وYouTube.",
        en: "Contact La Rose Wellness Hub by phone or WhatsApp, and find our New Maadi address, clinic hours, Instagram and YouTube links.",
      }, locale),
      active: "contact",
      body,
    }),
  };
}

function notFoundPage({ c, locale }) {
  const depth = 0;
  const actions = `<a class="btn btn--accent" href="${link(depth, "index.html")}">${esc(t({ ar: "ارجع للرئيسية", en: "Back to home" }, locale))}</a>
    <a class="btn btn--on-dark" href="${link(depth, "specialties/")}">${esc(t({ ar: "شوف التخصصات", en: "Browse specialties" }, locale))}</a>
    <a class="btn btn--on-dark" href="${link(depth, "patients/booking.html")}">${esc(t(c.site.ui.bookNow, locale))}</a>`;
  const body = pageHero({
    c, locale, depth,
    eyebrow: t("404", locale),
    title: t({ ar: "الصفحة دي مش موجودة", en: "This page could not be found" }, locale),
    text: t({
      ar: "ممكن يكون الرابط اتغيّر أو الصفحة اتنقلت. اختار واحدة من الروابط دي ونكمّل من هناك.",
      en: "The link may have changed or the page may have moved. Choose one of these links and carry on from there.",
    }, locale),
    actions,
    art: "contact"});

  return {
    path: `${locale}/404.html`,
    html: page({
      c, locale, depth, pagePath: "404.html",
      title: t({ ar: "الصفحة غير موجودة", en: "Page not found" }, locale),
      description: t({ ar: "الصفحة المطلوبة غير موجودة.", en: "The requested page could not be found." }, locale),
      active: null,
      body,
    }),
  };
}

export function pages({ c, locale }) {
  return [contactPage({ c, locale }), notFoundPage({ c, locale })];
}
