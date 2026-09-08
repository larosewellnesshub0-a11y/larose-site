/* ========================================================================== 
   Legal pages: privacy, terms of use and medical disclaimer
   ========================================================================== */

import { t, esc, link, icon } from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import { pageHero } from "../lib/components.mjs";

const COPY = {
  privacy: {
    title: { ar: "سياسة الخصوصية", en: "Privacy policy" },
    eyebrow: { ar: "بياناتك وخصوصيتك", en: "Your data and privacy" },
    text: { ar: "شرح واضح للبيانات اللي بيتعامل معاها الموقع، وإيه اللي بيحصل لما تبعت طلب على واتساب.", en: "A clear account of the data this website handles and what happens when you send a request through WhatsApp." },
  },
  terms: {
    title: { ar: "شروط الاستخدام", en: "Terms of use" },
    eyebrow: { ar: "استخدام الموقع", en: "Using this website" },
    text: { ar: "الشروط العامة لاستخدام محتوى موقع عيادات لاروز وخدمات الحجز الموجودة فيه.", en: "The general terms for using the La Rose Wellness Hub website, its content and its booking tools." },
  },
  disclaimer: {
    title: { ar: "إخلاء مسؤولية طبية", en: "Medical disclaimer" },
    eyebrow: { ar: "معلومة عامة، مش تشخيص", en: "General information, not a diagnosis" },
    text: { ar: "اقرا التنبيه ده قبل ما تعتمد على أي محتوى صحي منشور على الموقع.", en: "Please read this notice before relying on any health information published on the website." },
  },
};

const LAWYER_TODO = "<!-- TODO(clinic): have a lawyer review before launch -->";

function legalHero({ c, locale, depth, copy, href }) {
  return pageHero({
    c, locale, depth,
    eyebrow: t(copy.eyebrow, locale),
    title: t(copy.title, locale),
    text: t(copy.text, locale),
    trail: [{ label: t(copy.title, locale), href }],
    variant: "page-hero--paper",
  });
}

function legalBody(hero, content) {
  return `
${LAWYER_TODO}
${hero}
<section class="section">
  <div class="wrap wrap--narrow">
    <div class="prose">
      ${content}
    </div>
  </div>
</section>`;
}

export function pages({ c, locale }) {
  const s = c.site;
  const depth = 1;

  const privacyContent = `
<h2>${esc(t({ ar: "الموقع بيعمل إيه", en: "What this website does" }, locale))}</h2>
<p>${esc(t({
    ar: "الموقع ده موقع ثابت للتعريف بعيادات لاروز وتخصصاتها، ومساعدتك تطلب حجز أو تتواصل مع الفريق. صفحات الموقع نفسها ما بتطلبش إنشاء حساب، وما بتخزّنش بيانات النماذج على سيرفر تابع للموقع.",
    en: "This is a static website introducing La Rose Wellness Hub and its specialties, and helping you request an appointment or contact the team. The website itself does not ask you to create an account and does not store form entries on a website server.",
  }, locale))}</p>

<h2>${esc(t({ ar: "ملفات تعريف الارتباط والتتبّع", en: "Cookies and tracking" }, locale))}</h2>
<p>${esc(t({
    ar: "الموقع ما بيحطّش ملفات تعريف ارتباط للتحليلات أو الإعلانات. فتحك لروابط خارجية، زي واتساب أو خرائط جوجل أو إنستجرام أو يوتيوب، بينقلك لخدمة لها سياسة خصوصية وشروط مستقلة عن الموقع.",
    en: "The site sets no analytics or advertising cookies. Opening an external link: such as WhatsApp, Google Maps, Instagram or YouTube: takes you to a service with its own privacy policy and terms, separate from this website.",
  }, locale))}</p>

<h2>${esc(t({ ar: "نماذج الحجز والتواصل", en: "Booking and contact forms" }, locale))}</h2>
<p>${esc(t({
    ar: "لما تملي نموذج حجز أو تواصل، البيانات اللي كتبتها بتفضل في متصفحك لحد ما تضغط زر الإرسال. الموقع بيكوّن منها رسالة جاهزة ويفتح واتساب على جهازك؛ تقدر تراجع الرسالة وتعدّلها أو تقفلها من غير ما تبعتها. الموقع نفسه ما بيستلمش الرسالة وما بيحفظش نسخة منها على سيرفر.",
    en: "When you complete a booking or contact form, the details remain in your browser until you press the submit button. The site uses them to compose a ready-written message and opens WhatsApp on your device; you can review or edit it, or close it without sending. The website itself does not receive the message or keep a server-side copy.",
  }, locale))}</p>
<p>${esc(t({
    ar: "لو اخترت تبعت الرسالة، واتساب بيعالجها حسب شروطه وسياسة الخصوصية الخاصة به، وبعد وصولها العيادة بتحتفظ بالمحادثة وبتتعامل معاها عشان ترد على طلبك وتنسّق الحجز أو التواصل. اكتب بس البيانات الضرورية لطلبك، وما تبعتش تفاصيل صحية حساسة مش محتاج تكون في رسالة الحجز.",
    en: "If you choose to send the message, WhatsApp processes it under its own terms and privacy policy. Once it reaches the clinic, the clinic holds that conversation and uses it to respond to your request and coordinate the appointment or contact. Include only the information necessary for your request, and avoid adding sensitive health details that are not needed in a booking message.",
  }, locale))}</p>

<h2>${esc(t({ ar: "الإطار القانوني", en: "Legal framework" }, locale))}</h2>
<p>${esc(t({
    ar: "الإطار الحاكم لحماية البيانات الشخصية في مصر هو قانون حماية البيانات الشخصية رقم ١٥١ لسنة ٢٠٢٠. السياسة دي بتشرح طريقة عمل الموقع الحالي، ومش بتستبدل أي حقوق أو التزامات مقررة في القانون.",
    en: "The governing framework for personal data protection in Egypt is the Personal Data Protection Law No. 151 of 2020. This policy describes how the current website works and does not replace any rights or obligations established by law.",
  }, locale))}</p>

<h2>${esc(t({ ar: "أسئلة عن بياناتك", en: "Questions about your data" }, locale))}</h2>
<p>${esc(t({ ar: "لو عندك سؤال عن محادثة سبق وبعتها للعيادة أو عن البيانات الموجودة فيها، تواصل مع الفريق مباشرة على رقم العيادة أو واتساب.", en: "If you have a question about a conversation you previously sent to the clinic or the information in it, contact the team directly by the clinic phone number or WhatsApp." }, locale))}</p>
<p><a href="tel:${esc(s.contact.phone.tel)}"><bdi class="num">${esc(s.contact.phone.display)}</bdi></a> · <a href="${esc(s.contact.whatsapp.href)}" target="_blank" rel="noopener">${esc(t(s.ui.whatsapp, locale))}</a></p>`;

  const termsContent = `
<h2>${esc(t({ ar: "الغرض من الموقع", en: "Purpose of the website" }, locale))}</h2>
<p>${esc(t({
    ar: "الموقع بيوفّر معلومات عامة عن عيادات لاروز، التخصصات والخدمات المنشورة، وطرق التواصل وطلب الحجز. استخدامك للموقع معناه إنك موافقة تستخدمه بشكل قانوني ومن غير محاولة تعطيله أو إساءة استخدام نماذجه وروابطه.",
    en: "This website provides general information about La Rose Wellness Hub, its published specialties and services, and ways to contact the clinic or request an appointment. By using it, you agree to do so lawfully and without trying to disrupt it or misuse its forms or links.",
  }, locale))}</p>

<h2>${esc(t({ ar: "المحتوى الصحي", en: "Health information" }, locale))}</h2>
<p>${esc(t({
    ar: "المحتوى الصحي للتوعية العامة فقط. قراءة صفحة أو استخدام نموذج الحجز ما يعتبرش كشف طبي، وما بيعملش تشخيص أو خطة علاج. القرار المناسب لحالتك بيتحدد بعد كشف فعلي ومراجعة تاريخك الصحي وتحاليلك حسب الحاجة.",
    en: "Health content is for general awareness only. Reading a page or using the booking form is not a medical consultation and does not provide a diagnosis or treatment plan. The right decision for your case is made after an in-person consultation and review of your health history and labs where needed.",
  }, locale))}</p>

<h2>${esc(t({ ar: "طلبات الحجز", en: "Appointment requests" }, locale))}</h2>
<p>${esc(t({
    ar: "نماذج الموقع بتجهّز رسالة واتساب على جهازك. إرسال الرسالة هو طلب للتواصل أو الحجز، مش كشف طبي، ومحتواها تقدر تراجعه قبل الإرسال. الحجز قبل الحضور ضروري، والدخول بأسبقية الحضور حسب التنبيه المنشور في الموقع.",
    en: "The website forms prepare a WhatsApp message on your device. Sending it is a request for contact or an appointment, not a medical consultation, and you can review its contents before sending. Booking ahead is required, and patients are seen in order of arrival as stated on the website.",
  }, locale))}</p>

<h2>${esc(t({ ar: "الروابط والخدمات الخارجية", en: "External links and services" }, locale))}</h2>
<p>${esc(t({
    ar: "الموقع فيه روابط لخدمات خارجية زي واتساب وخرائط جوجل وإنستجرام ويوتيوب. كل خدمة من دول بتشتغل بشروطها وسياسة الخصوصية الخاصة بها، واستخدامك لها بيخضع للقواعد المنشورة عندها.",
    en: "The website links to external services including WhatsApp, Google Maps, Instagram and YouTube. Each service operates under its own terms and privacy policy, and your use of it is governed by the rules it publishes.",
  }, locale))}</p>

<h2>${esc(t({ ar: "التعديلات والقانون المطبّق", en: "Changes and applicable law" }, locale))}</h2>
<p>${esc(t({
    ar: "ممكن تتحدّث صفحات الموقع أو الشروط دي لما تتغير طريقة عمل الموقع أو المعلومات المنشورة. استخدام الموقع وتفسير الشروط دي بيخضع للقوانين السارية في جمهورية مصر العربية.",
    en: "The website and these terms may be updated when the way the site works or the information it publishes changes. Use of the site and interpretation of these terms are subject to the laws in force in the Arab Republic of Egypt.",
  }, locale))}</p>`;

  const disclaimerContent = `
<p class="lede">${esc(t(s.legal.disclaimer, locale))}</p>

<h2>${esc(t({ ar: "المحتوى مش كشف طبي", en: "Content is not a consultation" }, locale))}</h2>
<p>${esc(t({
    ar: "المقالات وصفحات التخصصات والأسئلة الشائعة بتشرح معلومات عامة، لكنها ما تعرفش تفاصيل حالتك ولا تاريخك الصحي ولا أدويتك. عشان كده ما ينفعش استخدامها لتشخيص نفسك أو بدء علاج أو إيقافه أو تغيير جرعة من غير الرجوع لطبيب.",
    en: "Articles, specialty pages and FAQs explain general information, but they do not know the details of your case, health history or medication. They must not be used to diagnose yourself, begin or stop treatment, or change a dose without speaking to a doctor.",
  }, locale))}</p>

<h2>${esc(t({ ar: "النتائج فردية", en: "Results are individual" }, locale))}</h2>
<p>${esc(t(s.legal.resultsVary, locale))}</p>

<h2>${esc(t({ ar: "الحالات الخاصة والطوارئ", en: "Special circumstances and emergencies" }, locale))}</h2>
<p>${esc(t({
    ar: "لو عندك حالة مزمنة، أو حامل أو بترضعي، أو بتاخد أدوية بانتظام، كلّم طبيبك قبل أي تغيير. الموقع مش خدمة طوارئ وما بيراقبش الرسائل بشكل لحظي. في حالة الطوارئ اتصل بالإسعاف على ١٢٣.",
    en: "If you have a chronic condition, are pregnant or breastfeeding, or take regular medication, speak to your doctor before making any change. This website is not an emergency service and messages are not monitored in real time. In an emergency, call the ambulance service on 123.",
  }, locale))}</p>

<p><a class="btn btn--primary" href="${link(depth, "patients/booking.html")}">${icon("calendar")} ${esc(t(s.ui.bookNow, locale))}</a></p>`;

  const privacyBody = legalBody(
    legalHero({ c, locale, depth, copy: COPY.privacy, href: "legal/privacy.html" }),
    privacyContent,
  );
  const termsBody = legalBody(
    legalHero({ c, locale, depth, copy: COPY.terms, href: "legal/terms.html" }),
    termsContent,
  );
  const disclaimerBody = legalBody(
    legalHero({ c, locale, depth, copy: COPY.disclaimer, href: "legal/disclaimer.html" }),
    disclaimerContent,
  );

  const documents = [
    {
      slug: "privacy",
      copy: COPY.privacy,
      body: privacyBody,
      description: {
        ar: "سياسة خصوصية موقع عيادات لاروز: موقع ثابت بلا تحليلات أو إعلانات، ولا يخزّن النماذج على سيرفر؛ الرسائل تُرسل من واتساب الخاص بالزائر.",
        en: "La Rose website privacy policy: a static site with no analytics or advertising cookies and no server-side form storage; visitors send messages through WhatsApp.",
      },
    },
    {
      slug: "terms",
      copy: COPY.terms,
      body: termsBody,
      description: {
        ar: "شروط استخدام موقع عيادات لاروز، وتشمل الغرض من المحتوى الصحي، وطريقة طلب الحجز عبر واتساب، واستخدام الروابط والخدمات الخارجية.",
        en: "Terms for using the La Rose Wellness Hub website, including its health information, WhatsApp appointment requests and links to external services.",
      },
    },
    {
      slug: "disclaimer",
      copy: COPY.disclaimer,
      body: disclaimerBody,
      description: {
        ar: "إخلاء المسؤولية الطبية لموقع عيادات لاروز: المحتوى للتوعية العامة فقط، ومش بديل عن الكشف أو التشخيص أو العلاج، والنتائج بتختلف.",
        en: "La Rose medical disclaimer: website content is general information, not a substitute for consultation, diagnosis or treatment, and individual results vary.",
      },
    },
  ];

  return documents.map((doc) => ({
    path: `${locale}/legal/${doc.slug}.html`,
    html: page({
      c, locale, depth,
      pagePath: `legal/${doc.slug}.html`,
      active: null,
      title: t(doc.copy.title, locale),
      description: t(doc.description, locale),
      body: doc.body,
    }),
  }));
}
