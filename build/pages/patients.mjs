/* ========================================================================== 
   Patient guide: visit planning, booking, preparation, FAQs and rights
   ========================================================================== */

import { t, ta, esc, link, icon, map, when, published, bySlug, paras } from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import {
  sectionHead, pageHero, finder, ctaBand, faqList, faqSchema,
} from "../lib/components.mjs";

/* Saturday first: that is how the week is read in Egypt, and the clinic's own
   days start there. JS day numbers are 0=Sunday..6=Saturday. */
const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5];
const DAY_NAMES = {
  ar: ["الأحد", "الاتنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};

function dayList(days, locale) {
  const names = DAY_NAMES[locale === "ar" ? "ar" : "en"];
  const picked = WEEK_ORDER.filter((n) => days.includes(n)).map((n) => names[n]);
  if (picked.length <= 1) return picked.join("");
  const last = picked.pop();
  return locale === "ar" ? `${picked.join(" و")} و${last}` : `${picked.join(", ")} & ${last}`;
}

const COPY = {
  hub: {
    title: { ar: "دليل المريض", en: "Plan Your Visit" },
    eyebrow: { ar: "قبل ما تيجي", en: "Before you come in" },
    text: {
      ar: "كل اللي محتاج تعرفه قبل زيارتك، من الحجز والتحضير للكشف لحد اللي بيحصل في أول زيارة.",
      en: "Everything you need before your visit، from booking and preparation to what happens when you first come in.",
    },
    sectionTitle: { ar: "ابدأ من هنا", en: "Start here" },
    sectionText: {
      ar: "اختار الدليل اللي محتاجاه، ولو لسه مش عارفة أنهي تخصص مناسب لحالتك استخدم أداة الحجز تحت.",
      en: "Choose the guide you need. If you are still unsure which specialty fits your case, use the booking finder below.",
    },
  },
  booking: {
    title: { ar: "احجز موعدك", en: "Book an appointment" },
    eyebrow: { ar: "طلب حجز", en: "Appointment request" },
    text: {
      ar: "املا البيانات اللي تحت، وهنفتح لك رسالة واتساب جاهزة تراجعها وتبعتها لفريق العيادة.",
      en: "Fill in the details below and we will open a ready-written WhatsApp message for you to review and send to the clinic team.",
    },
  },
  firstVisit: {
    title: { ar: "أول زيارة لك", en: "Your first visit" },
    eyebrow: { ar: "خطوة بخطوة", en: "Step by step" },
    text: {
      ar: "من طلب الحجز لحد خطة المتابعة: ده اللي تتوقعيه، من غير مفاجآت ومن غير خطة جاهزة.",
      en: "From the booking request to your follow-up plan: what to expect, without surprises or a ready-made sheet.",
    },
  },
  preparation: {
    title: { ar: "التحضير للكشف", en: "Preparing for your visit" },
    eyebrow: { ar: "قبل الموعد", en: "Before your appointment" },
    text: {
      ar: "تحضير بسيط بيساعد الطبيب يشوف الصورة كاملة، وبيختلف حسب نوع الكشف اللي حجزته.",
      en: "A little preparation helps the doctor see the full picture, and it depends on the appointment you have booked.",
    },
  },
  faq: {
    title: { ar: "الأسئلة الشائعة", en: "Frequently asked questions" },
    eyebrow: { ar: "إجابات من الأقسام", en: "Answers from every department" },
    text: {
      ar: "جمعنا هنا أسئلة كل التخصصات المنشورة عشان تلاقي الإجابة في مكان واحد.",
      en: "We have brought together the questions from every published specialty so you can find the answer in one place.",
    },
  },
  rights: {
    title: { ar: "حقوق المريض", en: "Patient rights" },
    eyebrow: { ar: "رعاية مبنية على الاحترام", en: "Care built on respect" },
    text: {
      ar: "من حقك تفهم وتسأل وتشارك في القرار، وعليك دور يساعد الفريق الطبي يقدّم لك رعاية آمنة وواضحة.",
      en: "You have the right to understand, ask and take part in decisions, with responsibilities that help the clinical team provide safe, clear care.",
    },
  },
};

const HUB_CARDS = [
  {
    href: "patients/booking.html",
    icon: "calendar",
    title: { ar: "حجز موعد", en: "Book an appointment" },
    text: { ar: "اختار التخصص والطبيب والفرع، وابعتلنا طلبك على واتساب.", en: "Choose a specialty, doctor and branch, then send your request over WhatsApp." },
  },
  {
    href: "patients/first-visit.html",
    icon: "stethoscope",
    title: { ar: "أول زيارة لك", en: "Your first visit" },
    text: { ar: "اعرف إيه اللي هيحصل من وقت وصولك لحد ما تخرج بخطتك.", en: "See what happens from the moment you arrive until you leave with your plan." },
  },
  {
    href: "patients/preparation.html",
    icon: "check",
    title: { ar: "التحضير للكشف", en: "Preparing for your visit" },
    text: { ar: "التحاليل والأدوية المطلوبة، وتعليمات الصيام قبل سونار البطن.", en: "What labs and medication details to bring, plus fasting instructions for an abdominal ultrasound." },
  },
  {
    href: "patients/faq.html",
    icon: "info",
    title: { ar: "الأسئلة الشائعة", en: "Frequently asked questions" },
    text: { ar: "إجابات واضحة على أكتر الأسئلة اللي بتتسأل في كل تخصص.", en: "Clear answers to the questions patients ask most across every specialty." },
  },
];

const FIRST_VISIT_STEPS = [
  {
    title: { ar: "احجز قبل ما تيجي", en: "Book before you come" },
    body: {
      ar: "الحجز قبل ما تحضر ضروري. في نموذج الحجز اختار التخصص والطبيب والفرع، وحدد اليوم والوقت اللي يناسبوك. النموذج بيجهّز رسالة واتساب على جهازك، عشان تراجعها بنفسك قبل ما تبعتها لفريق العيادة. وتقدر كمان تفتح واتساب مباشرة من الزر الموجود في الموقع. اكتب في الملاحظات أي تفاصيل مهمة تساعد الفريق يفهم طلبك، من غير ما تحاول تشخّص حالتك بنفسك.",
      en: "Booking before you visit is essential. In the booking form, choose the specialty, doctor and branch, then select the day and time that suit you. The form prepares a WhatsApp message on your device so you can review it yourself before sending it to the clinic team. You can also open WhatsApp directly using the button on the website. Add any important details in the notes to help the team understand your request, without trying to diagnose your condition yourself.",
    },
  },
  {
    title: { ar: "الوصول للعيادة", en: "Arriving at the clinic" },
    body: {
      ar: "تعال في الموعد اللي اتفقت عليه مع الفريق، وخد معاك تحاليلك الحديثة وأسماء أي أدوية بتاخدها. مواعيد العيادة المنشورة هي السبت والاتنين والثلاثاء من ٣ لـ٧ مساءً، والحجز قبل الحضور ضروري. الدخول بيكون بأسبقية الحضور، عشان كده وجود طلب حجز مش معناه إن الكشف هيبدأ في دقيقة ثابتة بالظبط. ولو زيارتك محتاجة تحضير، زي سونار البطن، التزم بتعليمات التحضير الموجودة في الدليل قبل ما توصل.",
      en: "Come at the time agreed with the team, and bring any recent test results and the names of any medicines you are taking. The clinic's published opening times are Saturday, Monday and Tuesday, 3 to 7 pm, and booking before your visit is essential. Patients are seen in order of arrival, so having a booking request does not mean your consultation will start at an exact minute. If your visit requires preparation, such as an abdominal ultrasound, follow the preparation instructions in the guide before you arrive.",
    },
  },
  {
    title: { ar: "تحليل التركيب الجسمي InBody", en: "Your InBody body-composition analysis" },
    body: {
      ar: "في الزيارة بيتعمل تحليل للتركيب الجسمي بجهاز InBody. الهدف مش مجرد تسجيل رقم الوزن، التحليل بيوضح نسبة الدهون والعضلات والمياه، وده بيدينا صورة أدق عن جسمك والتغيير اللي محتاجين نتابعه. وفي كشف التغذية بيتضاف كمان قياس لتقييم التطور. القياسات دي جزء من التقييم، والطبيب بيقراها مع تاريخك الصحي وتحاليلك وشكواك وتفاصيل يومك قبل ما يقترح أي خطة.",
      en: "During your visit, a body composition analysis is carried out using InBody. The aim is not simply to record your weight. The analysis shows your body fat, muscle and water levels, giving us a clearer picture of your body and the changes we need to monitor. Nutrition consultations also include an additional measurement to assess progress. These measurements form part of the assessment, and the doctor reviews them alongside your medical history, test results, symptoms and daily routine before recommending any plan.",
    },
  },
  {
    title: { ar: "الكشف وفهم حالتك", en: "The consultation and understanding your case" },
    body: {
      ar: "بعد القياسات بييجي الجزء الأهم، الكلام والكشف. الطبيب بيراجع تاريخك الصحي، والأعراض اللي مضايقاك، والأدوية الحالية، وأي تحاليل أو أشعات متاحة. تفاصيل الفحص بتختلف حسب التخصص وشكوتك. وفي كشف التغذية بنفهم كمان مواعيد أكلك، واختياراتك، وإيه اللي تقدر تلتزم بيه فعلاً. ولو حجزك كشف باطنة، التقييم ممكن يشمل سونار على البطن في نفس الزيارة حسب حاجة الحالة ورؤية الطبيب. الهدف إن القرار يتبني على الصورة كاملة، مش على عرض واحد أو ورقة جاهزة.",
      en: "After the measurements comes the most important part, the discussion and examination. The doctor reviews your medical history, the symptoms that are bothering you, your current medicines, and any available test results or scans. The details of the examination vary depending on the specialty and your symptoms. During a nutrition consultation, we also look at your meal times, food choices and what you can realistically stick to. If you have booked an internal medicine consultation, the assessment may also include an abdominal ultrasound during the same visit, depending on your condition and the doctor's judgement. The aim is to base the decision on the full picture, not on one symptom or a ready-made plan.",
    },
  },
  {
    title: { ar: "مراجعة التحاليل", en: "Reviewing your labs" },
    body: {
      ar: "لو معاك تحاليل حديثة، الطبيب بيراجعها مع تاريخك المرضي بدل ما يبص لكل رقم بشكل منفصل. وجود التحاليل بيوفّر وقت، لكن لو مش معاك مش مطلوب تختار فحوصات بنفسك، الطبيب بيحدد المطلوب بعد الكشف. ولو الخطة ممكن تشمل حقن للتخسيس، فيه مجموعة تحاليل أساسية مطلوبة قبل البداية ومذكورة بالتفصيل في صفحة التحضير. وأي تحاليل جديدة بتتراجع في المتابعة، ونتايجها ممكن تغيّر الخطة أو الجرعة حسب تقييم الطبيب.",
      en: "If you have recent test results, the doctor reviews them alongside your medical history rather than looking at each result in isolation. Bringing them can save time, but if you do not have any tests, you do not need to choose investigations yourself. The doctor will decide what is needed after the examination. If your plan may include weight-loss injections, there is a set of essential tests required before starting, listed in detail on the preparation page. Any new test results are also reviewed during follow-up visits, and they may lead to changes in the plan or dosage based on the doctor's assessment.",
    },
  },
  {
    title: { ar: "الخطة المكتوبة", en: "Your written plan" },
    body: {
      ar: "في كشف التغذية، بتخرج من الزيارة بخطة مكتوبة مبنية على التقييم اللي حصل: تركيب جسمك، وتاريخك الصحي، وتحاليلك، وشكل حياتك. الخطة ممكن تكون غذائية، أو جزء من مسار يشمل جلسات أو علاج دوائي لو الطبيب شايف إنه مناسب بعد الكشف. مفيش علاج واحد يناسب الكل، ومفيش داعي يتضاف لك شيء مش محتاجه. ولو الأنسب لحالتك مسار تاني أو تقييم من تخصص مختلف، القرار بيتشرح لك بوضوح قبل ما تبدأ.",
      en: "During a nutrition consultation, you leave with a written plan based on the assessment carried out, including your body composition, medical history, test results and lifestyle. The plan may be dietary, or it may form part of a pathway that includes sessions or medication if the doctor considers this appropriate after the examination. There is no single treatment that suits everyone, and there is no reason to add anything you do not need. If a different pathway or an assessment by another specialty is more suitable for your condition, the decision will be explained clearly before you start.",
    },
  },
  {
    title: { ar: "المتابعة الأسبوعية", en: "Weekly follow-up" },
    body: {
      ar: "في مسار التغذية وإدارة الوزن، الخطة مش مجرد ورقة بتستلمها مرة واحدة. المتابعة الأسبوعية فيها تحليل InBody جديد عشان نقيس التغيير في الدهون والعضلات والمياه، مش الوزن بس. الطبيب بيراجع استجابة جسمك، وأي تحاليل جديدة، والحاجات اللي قدرت تلتزم بيها فعلاً، وبعدها يظبط الكميات والاختيارات أو الجرعة لو فيه علاج دوائي. الهدف إن الخطة تفضل مناسبة لجسمك وحياتك مع الوقت. ولو اتأخرت عن متابعة التغذية أكتر من أسبوع، بتتحسب كشف جديد لأن الحالة بتحتاج تقييم من الأول.",
      en: "In the nutrition and weight management pathway, the plan is not simply a sheet of paper you receive once. Weekly follow-up includes a new InBody analysis to measure changes in body fat, muscle and water, not just weight. The doctor reviews how your body is responding, any new test results, and what you have realistically been able to follow, then adjusts the portions, choices or dosage if medication is part of the plan. The aim is to keep the plan suitable for your body and lifestyle over time. If you delay a nutrition follow-up by more than one week, it is counted as a new consultation because your condition needs to be assessed again from the beginning.",
    },
  },
];

const RIGHTS = [
  { ar: "شرح واضح لحالتك والخيارات المقترحة بلغة تقدر تفهمها.", en: "A clear explanation of your condition and the proposed options in language you can understand." },
  { ar: "إنك تسأل أي سؤال وتطلب توضيح قبل ما توافق على خطوة.", en: "To ask questions and request clarification before agreeing to any step." },
  { ar: "احترام خصوصيتك والحفاظ على سرية معلوماتك الصحية.", en: "Respect for your privacy and confidentiality of your health information." },
  { ar: "إنك ترفض علاج أو إجراء بعد ما تفهم الفوايد والمخاطر والبدائل.", en: "To refuse a treatment or procedure after understanding its benefits, risks and alternatives." },
  { ar: "إنك تطلب رأي طبي تاني من متخصص آخر.", en: "To seek a second medical opinion from another qualified professional." },
  { ar: "إنك تعرف اسم وصفة الشخص المسؤول عن علاجك.", en: "To know the name and role of the person responsible for your care." },
];

const RESPONSIBILITIES = [
  { ar: "تدي الفريق تاريخ صحي دقيق وتذكر الأمراض والحساسيات والعلاجات السابقة.", en: "Give the team an accurate health history, including conditions, allergies and previous treatments." },
  { ar: "تتبع الخطة اللي اتفقت عليها، أو توضّح بصراحة لو جزء منها مش مناسب أو صعب تنفيذه.", en: "Follow the plan you agreed, or say openly if part of it is unsuitable or difficult to follow." },
  { ar: "توصل في الموعد المتفق عليه، وتبلغ الفريق لو مش هتقدر تحضر.", en: "Arrive at the agreed time and tell the team if you cannot attend." },
  { ar: "تبلغ الطبيب بأي تغيير في الأدوية أو الجرعات أو بأي عرض جديد.", en: "Tell the doctor about any change in medication or dose, and about any new symptom." },
];

function trail(locale, current, href) {
  return [
    { label: t(COPY.hub.title, locale), href: "patients/" },
    { label: t(current, locale), href },
  ];
}

export function pages({ c, locale }) {
  const s = c.site;
  const depth = 1;
  const specs = published(c.specialties);
  const docs = published(c.doctors);
  const branches = published(c.branches);
  const nutrition = bySlug(specs, "clinical-nutrition");
  const consultation = bySlug(nutrition?.treatments || [], "nutrition-consultation");
  const consultationFacts = ta(consultation?.facts, locale);
  const latinTerms = ta(s.latinTerms, locale);
  const allFaq = specs.flatMap((sp) => sp.faq || []);

  const hubBody = `
${pageHero({
    c, locale, depth,
    eyebrow: t(COPY.hub.eyebrow, locale),
    title: t(COPY.hub.title, locale),
    text: t(COPY.hub.text, locale),
    trail: [{ label: t(COPY.hub.title, locale), href: "patients/" }],
    art: "patients"})}
<section class="section">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "خططي لزيارتك", en: "Plan your visit" }, locale),
      title: t(COPY.hub.sectionTitle, locale),
      lede: t(COPY.hub.sectionText, locale),
    })}
    <div class="grid grid-2">
      ${map(HUB_CARDS, (item) => `<article class="card" data-reveal>
        <div class="card__body">
          <span class="chip">${icon(item.icon)} ${esc(t({ ar: "دليل عملي", en: "Practical guide" }, locale))}</span>
          <h3 class="card__title"><a class="card__link" href="${link(depth, item.href)}">${esc(t(item.title, locale))}</a></h3>
          <p class="card__text">${esc(t(item.text, locale))}</p>
          <div class="card__foot"><span class="link-cta">${esc(t(s.ui.learnMore, locale))} ${icon("arrow")}</span></div>
        </div>
      </article>`)}
    </div>
  </div>
</section>
${finder({ c, locale, depth })}
${ctaBand({ c, locale, depth })}`;

  const bookingBody = `
${pageHero({
    c, locale, depth,
    eyebrow: t(COPY.booking.eyebrow, locale),
    title: t(COPY.booking.title, locale),
    text: t(COPY.booking.text, locale),
    trail: trail(locale, COPY.booking.title, "patients/booking.html"),
    art: "patients"})}
<section class="section">
  <div class="wrap">
    <div class="grid grid-2" style="align-items:start">
      <form class="card" style="padding:clamp(1.25rem,3vw,2.25rem)" data-finder data-whatsapp-form="201040661893" data-form-source="booking"
            data-msg-intro="${esc(t({ ar: "طلب حجز جديد من موقع لاروز", en: "New appointment request from the La Rose website" }, locale))}"
            data-msg-invalid="${esc(t({ ar: "من فضلك كمّلي الخانات المطلوبة قبل ما نفتح واتساب.", en: "Please complete the required fields before we open WhatsApp." }, locale))}"
            data-msg-sent="${esc(t({ ar: "فتحنا واتساب بالرسالة الجاهزة. راجعها واضغط إرسال.", en: "WhatsApp has opened with your message. Review it, then press send." }, locale))}">
        <h2 class="h3">${esc(t({ ar: "بيانات طلب الحجز", en: "Appointment details" }, locale))}</h2>
        <div class="form-grid">
          <div class="field">
            <label class="field__label" for="booking-name">${esc(t({ ar: "الاسم بالكامل", en: "Full name" }, locale))} <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="booking-name" name="name" type="text" autocomplete="name" required>
          </div>
          <div class="field">
            <label class="field__label" for="booking-phone">${esc(t({ ar: "رقم الموبايل", en: "Phone number" }, locale))} <span class="req" aria-hidden="true">*</span></label>
            <input class="input" id="booking-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel"
                   aria-describedby="booking-phone-hint" data-eg-mobile required>
            <p class="field__hint" id="booking-phone-hint">${esc(t({ ar: "رقم موبايل مصري، زي 01000000000", en: "An Egyptian mobile number, e.g. 01000000000" }, locale))}</p>
          </div>
          <div class="field">
            <label class="field__label" for="booking-specialty">${esc(t(s.ui.selectSpecialty, locale))}</label>
            <select class="select" id="booking-specialty" name="specialty" data-finder-specialty>
              <option value="">${esc(t({ ar: "اختار التخصص", en: "Choose a specialty" }, locale))}</option>
              ${map(specs, (sp) => `<option value="${esc(sp.slug)}"${!sp.staffed ? " disabled" : ""}>${esc(t(sp.name, locale))}${!sp.staffed ? ` — ${esc(t(s.ui.comingSoon, locale))}` : ""}</option>`)}
            </select>
          </div>
          <div class="field">
            <label class="field__label" for="booking-doctor">${esc(t(s.ui.selectDoctor, locale))}</label>
            <select class="select" id="booking-doctor" name="doctor" data-finder-doctor
              data-schedules="${esc(JSON.stringify(Object.fromEntries(docs.filter((d) => d.schedule).map((d) => [t(d.slug, "en"), d.schedule]))))}">
              <option value="">${esc(t({ ar: "أي طبيب متاح", en: "Any available doctor" }, locale))}</option>
              ${map(docs, (d) => `<option value="${esc(d.slug)}" data-specialties="${esc((d.specialties || []).join(","))}">${esc(t(d.name, locale))}${d.sample ? `، ${esc(t(s.ui.sample, locale))}` : ""}</option>`)}
            </select>
          </div>
          
          <div class="field">
            <label class="field__label" for="booking-branch">${esc(t(s.ui.selectBranch, locale))}</label>
            <select class="select" id="booking-branch" name="branch">
              ${map(branches, (b) => {
                /* A branch is bookable if a doctor actually holds a clinic
                   there, whatever its opening status says. Fifth Settlement is
                   still being prepared but has a real weekly clinic. */
                const hasClinic = docs.some((d) => d.schedule && (d.schedule[t(b.slug, "en")] || []).length);
                const soon = b.status === "soon";
                const note = soon && !hasClinic ? `، ${esc(t(s.ui.openingSoon, locale))}`
                  : soon && hasClinic ? `، ${esc(t({ ar: "عيادات محدودة", en: "limited clinics" }, locale))}` : "";
                return `<option value="${esc(b.slug)}"${soon && !hasClinic ? " disabled" : ""}>${esc(t(b.name, locale))}${note}</option>`;
              })}
            </select>
          </div>
          <div class="field">
            <label class="field__label" for="booking-day">${esc(t({ ar: "اليوم المفضّل", en: "Preferred day" }, locale))} <span class="field__opt">${esc(t({ ar: "اختياري", en: "optional" }, locale))}</span></label>
            <input class="input" id="booking-day" name="day" type="date" aria-describedby="booking-day-hint">
            <p class="field__hint" id="booking-day-hint" data-day-hint></p>
          </div>
          <div class="field">
            <label class="field__label" for="booking-time">${esc(t({ ar: "الوقت المفضّل", en: "Preferred time" }, locale))} <span class="field__opt">${esc(t({ ar: "اختياري", en: "optional" }, locale))}</span></label>
            <input class="input" id="booking-time" name="time" type="time">
          </div>
          <div class="field" style="grid-column:1/-1">
            <label class="field__label" for="booking-notes">${esc(t({ ar: "ملاحظات", en: "Notes" }, locale))} <span class="field__opt">${esc(t({ ar: "اختياري", en: "optional" }, locale))}</span></label>
            <textarea class="textarea" id="booking-notes" name="notes" rows="5"></textarea>
          </div>
        </div>
        <label class="checkbox" for="booking-consent">
          <input id="booking-consent" name="consent" type="checkbox" value="agreed" required>
          <span>${esc(t({ ar: "أوافق على إرسال البيانات اللي كتبتها عبر واتساب بعد ما أراجع الرسالة، وقرأت", en: "I agree to send the details I entered through WhatsApp after reviewing the message, and I have read the" }, locale))} <a href="${link(depth, "legal/privacy.html")}">${esc(t({ ar: "سياسة الخصوصية", en: "privacy policy" }, locale))}</a>. <span class="req" aria-hidden="true">*</span></span>
        </label>
        <p class="form-status" data-form-status hidden></p>
        <button class="btn btn--primary btn--lg" type="submit">${icon("whatsapp")} ${esc(t({ ar: "جهّز رسالة الحجز", en: "Prepare my booking message" }, locale))}</button>
        ${/* Not everyone wants to fill a form. Plenty of callers - older
              patients especially - would rather just ring, so the phone is an
              equal option here and not buried on the contact page. */""}
        <p class="form-alt">
          <span>${esc(t({ ar: "تحب تحجز بالتليفون؟", en: "Would you rather book by phone?" }, locale))}</span>
          <a class="btn btn--ghost" href="tel:${esc(s.contact.phone.tel)}">
            ${icon("phone")} ${esc(t({ ar: "اتصل بينا", en: "Call us" }, locale))}
            <bdi dir="ltr">${esc(s.contact.phone.display)}</bdi>
          </a>
        </p>
      </form>

      <aside class="stack">
        <div class="card" style="padding:clamp(1.25rem,3vw,2.25rem)">
          ${/* One panel per specialty, all rendered, one shown. Built this way so
                the right list is already correct before any script runs and for a
                reader with JS off - the fallback is the clinic's busiest
                specialty rather than an empty box. */""}
          ${map(specs, (sp, i) => {
            const inc = sp.consultationIncludes || {};
            const items = ta(inc.items, locale);
            const conditions = ta(inc.conditions?.items, locale);
            if (!items.length && !conditions.length) return "";
            return `<div data-consultation-includes data-specialty="${esc(t(sp.slug, "en"))}"${i === 0 ? "" : " hidden"}>
              ${when(items.length, `
              <h2 class="h3">${esc(t(inc.heading, locale) || t({ ar: "الكشف بيشمل", en: "The consultation includes" }, locale))}</h2>
              <div class="prose">
                <ul>${map(items, (fact) => `<li>${esc(fact)}</li>`)}</ul>
              </div>`)}
              ${/* Someone booking nutrition alone may have a cause that a
                    nutrition visit on its own will not find. Say so here,
                    where the choice is actually being made. */""}
              ${when(["clinical-nutrition", "weight-management"].includes(t(sp.slug, "en")) && c.site.integratedConsultation, `
              <div class="notice" style="margin-block-start:1.5rem">
                ${icon("info")}
                <div>
                  <p><strong>${esc(t(c.site.integratedConsultation.eyebrow, locale))}</strong></p>
                  <p style="margin-block-start:.4rem">${esc(t({
                    ar: "لو الوزن زاد من غير سبب واضح، الكشف المتكامل بيشوف التغذية والباطنة والسونار في نفس الزيارة، عشان نعرف السبب قبل ما نحدد الخطة.",
                    en: "If the weight has gone up without an obvious reason, the integrated consultation covers nutrition, internal medicine and an ultrasound in the same visit, so the cause is understood before the plan is set.",
                  }, locale))}</p>
                  <p style="margin-block-start:.6rem"><a class="link-cta" href="${link(depth, "specialties/clinical-nutrition.html")}">${esc(t({ ar: "تفاصيل الكشف المتكامل", en: "About the integrated consultation" }, locale))} ${icon("arrow")}</a></p>
                </div>
              </div>`)}
              ${/* What the doctor actually treats, which is a different question
                    from what the visit includes, so it gets its own heading. */""}
              ${when(conditions.length, `
              <h3 class="h4" style="margin-block-start:1.5rem">${esc(t(inc.conditions?.heading, locale) || t({ ar: "الدكتور بيشوف حالات زي", en: "The doctor sees conditions such as" }, locale))}</h3>
              <div class="prose">
                <ul>${map(conditions, (fact) => `<li>${esc(fact)}</li>`)}</ul>
              </div>`)}
            </div>`;
          })}
        </div>
        <div class="notice">
          ${icon("calendar")}
          <div>
            <p><strong>${esc(t({ ar: "مهم قبل ما تيجي", en: "Before you come" }, locale))}</strong></p>
            <p>${esc(t(s.hours.bookingNote, locale))}</p>
          </div>
        </div>
        <div class="card" style="padding:clamp(1.25rem,3vw,2.25rem)">
          <h2 class="h3">${esc(t({ ar: "مواعيد العيادة", en: "Clinic hours" }, locale))}</h2>
          ${/* One block per specialty, all rendered, one shown - the same
                pattern as the consultation panel above, so the days are already
                right before any script runs and with JS off. */""}
          ${map(specs, (sp, i) => {
            const slug = t(sp.slug, "en");
            const mine = docs.filter((d) => d.schedule && (d.specialties || []).includes(slug));
            const byBranch = new Map();
            mine.forEach((d) => Object.entries(d.schedule).forEach(([b, days]) => {
              const set = byBranch.get(b) || new Set();
              (days || []).forEach((n) => set.add(n));
              byBranch.set(b, set);
            }));
            const lines = [...byBranch.entries()].map(([bSlug, set]) => {
              const branch = branches.find((b) => t(b.slug, "en") === bSlug);
              const names = dayList([...set], locale);
              return { branch: branch ? t(branch.name, locale) : bSlug, names, only: byBranch.size === 1 };
            });
            const body = lines.length
              ? lines.map((l) => `<p>${icon("clock")} ${l.only ? "" : `<strong>${esc(l.branch)}</strong>: `}${esc(l.names)} · ${esc(t(s.hours.time, locale))}</p>`).join("")
              : `<p>${icon("clock")} ${esc(t(s.hours.display, locale))}</p>`;
            return `<div data-clinic-hours data-specialty="${esc(slug)}"${i === 0 ? "" : " hidden"}>${body}</div>`;
          })}
          <a class="btn btn--whatsapp btn--block" href="${esc(s.contact.whatsapp.href)}" target="_blank" rel="noopener">${icon("whatsapp")} ${esc(t(s.ui.whatsapp, locale))}</a>
        </div>
      </aside>
    </div>
  </div>
</section>
`;

  const firstVisitBody = `
${pageHero({
    c, locale, depth,
    eyebrow: t(COPY.firstVisit.eyebrow, locale),
    title: t(COPY.firstVisit.title, locale),
    text: t(COPY.firstVisit.text, locale),
    trail: trail(locale, COPY.firstVisit.title, "patients/first-visit.html"),
    art: "patients"})}
<section class="section">
  <div class="wrap wrap--narrow">
    <div class="prose">
      <ol>
        ${map(FIRST_VISIT_STEPS, (step) => `<li>
          <h2 class="h3">${esc(t(step.title, locale))}</h2>
          ${paras(t(step.body, locale), latinTerms)}
        </li>`)}
      </ol>
    </div>
  </div>
</section>
<section class="section section--sunk">
  <div class="wrap">
    ${sectionHead({
      eyebrow: t({ ar: "خليهم معاك", en: "Keep these with you" }, locale),
      title: t({ ar: "ثلاث حاجات بتسهّل الزيارة", en: "Three things that make the visit easier" }, locale),
    })}
    <div class="grid grid-3">
      ${map([
        { icon: "calendar", title: { ar: "تأكيد الحجز", en: "Your booking" }, text: { ar: "الحجز قبل الحضور ضروري، والدخول بأسبقية الحضور.", en: "Booking ahead is required, and patients are seen in order of arrival." } },
        { icon: "book", title: { ar: "التحاليل والأدوية", en: "Labs and medication" }, text: { ar: "هات تحاليلك الحديثة، واكتب أسماء أي أدوية أو جرعات بتاخدها.", en: "Bring recent labs and write down the names and doses of medicines you take." } },
        { icon: "check", title: { ar: "أسئلتك", en: "Your questions" }, text: { ar: "اكتب اللي عايز تسأله عشان تناقشه مع الطبيب وقت الكشف.", en: "Write down what you want to ask so you can discuss it with the doctor." } },
      ], (item) => `<article class="card" data-reveal><div class="card__body">
        <span class="chip">${icon(item.icon)} ${esc(t(item.title, locale))}</span>
        <p class="card__text">${esc(t(item.text, locale))}</p>
      </div></article>`)}
    </div>
  </div>
</section>
`;

  const preparationBody = `
${pageHero({
    c, locale, depth,
    eyebrow: t(COPY.preparation.eyebrow, locale),
    title: t(COPY.preparation.title, locale),
    text: t(COPY.preparation.text, locale),
    trail: trail(locale, COPY.preparation.title, "patients/preparation.html"),
    art: "patients"})}
<section class="section">
  <div class="wrap">
    <div class="grid grid-2">
      <article class="card" data-reveal>
        <div class="card__body">
          <span class="chip">${icon("leaf")} ${esc(t({ ar: "كشف التغذية", en: "Nutrition consultation" }, locale))}</span>
          <h2 class="h3">${esc(t({ ar: "إيه اللي تجيبه معاك", en: "What to bring" }, locale))}</h2>
          <div class="prose"><ul>
            <li>${esc(t({ ar: "أي تحاليل حديثة عندك. وجودها بيوفّر وقت، ولو مش متوفرة الطبيب هيحدد المطلوب بعد الكشف.", en: "Any recent labs you have. Bringing them saves time; if none are available, the doctor will specify what is needed after the consultation." }, locale))}</li>
            <li>${esc(t({ ar: "أسماء أي أدوية بتاخدها حالياً والجرعات، عشان الطبيب يراجعها مع تاريخك الصحي.", en: "The names and doses of any medicines you currently take, so the doctor can review them with your health history." }, locale))}</li>
          </ul></div>
        </div>
      </article>
      <article class="card" data-reveal>
        <div class="card__body">
          <span class="chip">${icon("activity")} ${esc(t({ ar: "سونار البطن", en: "Abdominal ultrasound" }, locale))}</span>
          <h2 class="h3">${esc(t({ ar: "تعليمات التحضير", en: "Preparation instructions" }, locale))}</h2>
          <div class="prose"><ul>
            <li>${esc(t({ ar: "صيام من ٦ لـ٨ ساعات قبل الميعاد.", en: "Fast for six to eight hours before the appointment." }, locale))}</li>
            <li>${esc(t({ ar: "المياه عادي أثناء فترة الصيام.", en: "Water is fine during the fasting period." }, locale))}</li>
            <li>${esc(t({ ar: "تجنّب المشروبات الغازية والأكل اللي بيسبب انتفاخ في اليوم اللي قبل السونار.", en: "Avoid fizzy drinks and foods that cause bloating on the day before the scan." }, locale))}</li>
          </ul></div>
        </div>
      </article>
    </div>
  </div>
</section>
<section class="section section--sunk">
  <div class="wrap wrap--narrow">
    ${sectionHead({
      eyebrow: t({ ar: "قبل حقن التخسيس", en: "Before weight-loss injections" }, locale),
      title: t({ ar: "مجموعة التحاليل الأساسية", en: "The baseline lab panel" }, locale),
      lede: t({ ar: "التحاليل دي بتتطلب قبل بداية الحقن لو الطبيب قرر بعد الكشف إن العلاج مناسب لحالتك.", en: "These tests are requested before injections begin if, after the consultation, the doctor decides that treatment is suitable for your case." }, locale),
    })}
    <div class="card" style="padding:clamp(1.25rem,3vw,2.25rem)" data-reveal>
      <div class="prose"><ul>
        ${map([
          { ar: "CBC", en: "CBC" },
          { ar: "TSH وFT3 وFT4", en: "TSH, FT3 and FT4" },
          { ar: "Urea وCreatinine", en: "Urea and creatinine" },
          { ar: "AST وALT", en: "AST and ALT" },
          { ar: "HbA1c وسكر صايم (FBS)", en: "HbA1c and fasting blood sugar (FBS)" },
        ], (test) => `<li>${esc(t(test, locale))}</li>`)}
      </ul></div>
    </div>
  </div>
</section>
`;

  const faqBody = `
${pageHero({
    c, locale, depth,
    eyebrow: t(COPY.faq.eyebrow, locale),
    title: t(COPY.faq.title, locale),
    text: t(COPY.faq.text, locale),
    trail: trail(locale, COPY.faq.title, "patients/faq.html"),
    art: "patients"})}
${map(specs, (sp, index) => `<section class="section${index % 2 ? " section--sunk" : ""}">
  <div class="wrap wrap--narrow">
    ${sectionHead({
      eyebrow: t({ ar: `القسم ${sp.index}`, en: `Department ${sp.index}` }, locale),
      title: t(sp.name, locale),
      lede: t(sp.sub, locale),
    })}
    ${!sp.staffed ? `<p><span class="badge-sample">${esc(t(s.ui.comingSoon, locale))}</span></p>` : ""}
    ${faqList({ c, locale, items: sp.faq || [], idPrefix: sp.slug })}
  </div>
</section>`)}
`;

  const rightsBody = `
${pageHero({
    c, locale, depth,
    eyebrow: t(COPY.rights.eyebrow, locale),
    title: t(COPY.rights.title, locale),
    text: t(COPY.rights.text, locale),
    trail: trail(locale, COPY.rights.title, "patients/rights.html"),
    art: "patients"})}
<section class="section">
  <div class="wrap">
    <div class="grid grid-2">
      <article class="card" data-reveal><div class="card__body">
        <span class="chip">${icon("heart")} ${esc(t({ ar: "حقوقك", en: "Your rights" }, locale))}</span>
        <h2 class="h3">${esc(t({ ar: "من حقك في أي رعاية صحية", en: "In any healthcare setting, you have the right to" }, locale))}</h2>
        <div class="prose"><ul>${map(RIGHTS, (item) => `<li>${esc(t(item, locale))}</li>`)}</ul></div>
      </div></article>
      <article class="card" data-reveal><div class="card__body">
        <span class="chip">${icon("check")} ${esc(t({ ar: "مسؤولياتك", en: "Your responsibilities" }, locale))}</span>
        <h2 class="h3">${esc(t({ ar: "دورك في رعاية آمنة وواضحة", en: "Your part in safe, clear care" }, locale))}</h2>
        <div class="prose"><ul>${map(RESPONSIBILITIES, (item) => `<li>${esc(t(item, locale))}</li>`)}</ul></div>
      </div></article>
    </div>
  </div>
</section>`;

  return [
    {
      path: `${locale}/patients/index.html`,
      html: page({
        c, locale, depth, pagePath: "patients/index.html", active: "patients",
        title: t(COPY.hub.title, locale),
        description: t({
          ar: "دليل المريض في عيادات لاروز: حجز الموعد، التحضير للكشف، خطوات أول زيارة، والأسئلة الشائعة لكل التخصصات في المعادي الجديدة.",
          en: "Plan your visit to La Rose Wellness Hub: book an appointment, prepare for your consultation, understand your first visit and read specialty FAQs.",
        }, locale),
        body: hubBody,
      }),
    },
    {
      path: `${locale}/patients/booking.html`,
      html: page({
        c, locale, depth, pagePath: "patients/booking.html", active: "patients",
        title: t(COPY.booking.title, locale),
        description: t({
          ar: "اطلب حجز موعد في عيادات لاروز بالمعادي الجديدة. اختار التخصص والطبيب والفرع، وابعت طلب الحجز مباشرة لفريق العيادة على واتساب.",
          en: "Request an appointment at La Rose Wellness Hub in New Maadi. Choose your specialty, doctor and branch, then send the request directly via WhatsApp.",
        }, locale),
        body: bookingBody,
      }),
    },
    {
      path: `${locale}/patients/first-visit.html`,
      html: page({
        c, locale, depth, pagePath: "patients/first-visit.html", active: "patients",
        title: t(COPY.firstVisit.title, locale),
        description: t({
          ar: "اعرف إيه اللي بيحصل في أول زيارة لعيادات لاروز: الحجز، تحليل InBody، الكشف، مراجعة التحاليل، الخطة المكتوبة، والمتابعة الأسبوعية.",
          en: "What happens at your first La Rose visit: booking, InBody analysis, consultation, lab review, your written plan and weekly follow-up.",
        }, locale),
        body: firstVisitBody,
      }),
    },
    {
      path: `${locale}/patients/preparation.html`,
      html: page({
        c, locale, depth, pagePath: "patients/preparation.html", active: "patients",
        title: t(COPY.preparation.title, locale),
        description: t({
          ar: "تعليمات التحضير لكشف التغذية وسونار البطن في لاروز، والتحاليل الأساسية المطلوبة قبل بدء حقن التخسيس لو قرر الطبيب إنها مناسبة.",
          en: "How to prepare for nutrition and abdominal ultrasound appointments, plus the baseline lab panel requested before weight-loss injections begin.",
        }, locale),
        body: preparationBody,
      }),
    },
    {
      path: `${locale}/patients/faq.html`,
      html: page({
        c, locale, depth, pagePath: "patients/faq.html", active: "patients",
        title: t(COPY.faq.title, locale),
        description: t({
          ar: "إجابات أسئلة المرضى الشائعة عن التغذية العلاجية، إدارة الوزن، نحت الجسم، الباطنة، الجراحة، الجلدية، وطب الأطفال في لاروز.",
          en: "Patient FAQs covering clinical nutrition, weight management, body contouring, internal medicine, surgery, dermatology and paediatrics at La Rose.",
        }, locale),
        body: faqBody,
        schema: faqSchema(allFaq, locale),
      }),
    },
    {
      path: `${locale}/patients/rights.html`,
      html: page({
        c, locale, depth, pagePath: "patients/rights.html", active: "patients",
        title: t(COPY.rights.title, locale),
        description: t({
          ar: "دليل واضح لحقوق المريض ومسؤولياته: الشرح والمشاركة في القرار والخصوصية ورفض العلاج والرأي الثاني، مع مسؤوليات التاريخ الصحي والمتابعة.",
          en: "A clear guide to patient rights and responsibilities: explanation, questions, privacy, refusal, second opinions, accurate history and agreed follow-up.",
        }, locale),
        body: rightsBody,
      }),
    },
  ];
}
