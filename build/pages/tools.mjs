/* ========================================================================== 
   Health tools hub, calculators and trackers
   ========================================================================== */

import { t, esc, link, icon, map } from "../lib/util.mjs";
import { page } from "../lib/shell.mjs";
import {
  sectionHead, pageHero, ctaBand,
} from "../lib/components.mjs";

const TOOL_DEFS = [
  {
    slug: "calorie-calculator",
    icon: "activity",
    title: { ar: "حاسبة السعرات والماكروز", en: "Calorie and macro calculator" },
    text: {
      ar: "تقدير لاحتياجك اليومي من الطاقة وتوزيع الماكروز حسب بياناتك وهدفك.",
      en: "Estimate your daily energy needs and macro split from your details and goal.",
    },
  },
  {
    slug: "bmi-calculator",
    icon: "scale",
    title: { ar: "حاسبة مؤشر كتلة الجسم", en: "BMI calculator" },
    text: {
      ar: "احسب مؤشر كتلة الجسم وشوف معناه، مع توضيح حدود الرقم ده.",
      en: "Calculate your body mass index and understand what the number can، and cannot، tell you.",
    },
  },
  {
    slug: "water-calculator",
    icon: "waves",
    title: { ar: "حاسبة المياه", en: "Water intake calculator" },
    text: {
      ar: "تقدير تقريبي لاحتياجك اليومي من المياه حسب وزنك ونشاطك والجو.",
      en: "An approximate daily water estimate based on your weight, activity and climate.",
    },
  },
  {
    slug: "calorie-tracker",
    icon: "book",
    title: { ar: "متتبع السعرات اليومي", en: "Daily calorie tracker" },
    text: {
      ar: "سجّل الأكل والسعرات على مدار اليوم، وتابع إجمالي يومك قدام هدفك.",
      en: "Log food and calories through the day and compare your running total with your target.",
    },
  },
  {
    slug: "progress-tracker",
    icon: "monitor",
    title: { ar: "متتبع الوزن والقياسات", en: "Weight and measurement tracker" },
    text: {
      ar: "احتفظ بسجل للوزن ومحيط الخصر عشان تشوف التغيير على مدى الوقت.",
      en: "Keep a record of your weight and waist measurement to see change over time.",
    },
  },
  {
    slug: "ultrasound-prep",
    icon: "stethoscope",
    title: { ar: "قائمة تحضير سونار البطن", en: "Abdominal ultrasound preparation" },
    text: {
      ar: "قائمة بسيطة تفتكّرك بالصيام والمياه والأكل والمشروبات قبل الميعاد.",
      en: "A simple checklist for fasting, water, food and drinks before your appointment.",
    },
  },
];



function toolEnding({ c, locale, depth }) {
  return `<section class="section section--tight" style="padding-top:0">

  </section>
  ${ctaBand({ c, locale, depth })}`;
}

function healthToolPage({ c, locale, slug, title, intro, description, tool }) {
  const depth = 1;
  const toolsLabel = t(c.site.ui.healthTools, locale);
  const body = `
${pageHero({
    c, locale, depth,
    eyebrow: toolsLabel,
    title: t(title, locale),
    text: t(intro, locale),
    trail: [
      { label: toolsLabel, href: "tools/" },
      { label: t(title, locale) },
    ],
    art: "tools"})}

<section class="section">
  <div class="wrap wrap--narrow">
    ${tool}
  </div>
</section>

${toolEnding({ c, locale, depth })}`;

  return {
    path: `${locale}/tools/${slug}.html`,
    html: page({
      c, locale, depth, pagePath: `tools/${slug}.html`,
      active: "articles",
      title: t(title, locale),
      description: t(description, locale),
      body,
    }),
  };
}

function toolsHub({ c, locale }) {
  const depth = 1;
  const title = t(c.site.ui.healthTools, locale);
  const body = `
${pageHero({
    c, locale, depth,
    eyebrow: t(c.site.ui.knowledgeCentre, locale),
    title,
    text: t({
      ar: "حاسبات ومتتبعات بسيطة تساعدك تفهم أرقامك وتسجّل يومك. كل نتيجة هنا للتوعية، والخطة الطبية بتتحدد حسب حالتك في الكشف.",
      en: "Simple calculators and trackers to help you understand your numbers and record your day. Every result is for guidance; a medical plan is set around your individual case at consultation.",
    }, locale),
    trail: [{ label: title }],
    art: "tools"})}

<section class="section">
  <div class="wrap">
    ${sectionHead({
      eyebrow: title,
      title: t({ ar: "اختار الأداة اللي محتاجاها", en: "Choose the tool you need" }, locale),
      lede: t({
        ar: "الأدوات مجانية، والبيانات اللي بتسجّلها في المتتبعات بتفضل على جهازك.",
        en: "The tools are free to use, and information entered in the trackers stays on your device.",
      }, locale),
    })}
    <div class="grid grid-3">
      ${map(TOOL_DEFS, (item) => `<article class="card" data-reveal>
        <div class="card__body">
          <span class="chip">${icon(item.icon)} ${esc(t(c.site.ui.healthTools, locale))}</span>
          <h2 class="card__title">
            <a class="card__link" href="${link(depth, `tools/${item.slug}.html`)}">${esc(t(item.title, locale))}</a>
          </h2>
          <p class="card__text">${esc(t(item.text, locale))}</p>
          <div class="card__foot">
            <span class="link-cta">${esc(t(c.site.ui.learnMore, locale))} ${icon("arrow")}</span>
          </div>
        </div>
      </article>`)}
    </div>
  </div>
</section>

${ctaBand({ c, locale, depth })}`;

  return {
    path: `${locale}/tools/index.html`,
    html: page({
      c, locale, depth, pagePath: "tools/index.html",
      active: "articles",
      title,
      description: t({
        ar: "أدوات طبية مجانية من عيادات لاروز: حاسبة السعرات والماكروز، مؤشر كتلة الجسم، المياه، ومتتبعات السعرات والوزن وتحضير السونار.",
        en: "Free health tools from La Rose: calorie and macro, BMI and water calculators, plus calorie, progress and ultrasound preparation trackers.",
      }, locale),
      body,
    }),
  };
}

function calorieCalculator({ c, locale }) {
  const title = { ar: "حاسبة السعرات والماكروز", en: "Calorie and macro calculator" };
  const tool = `<div class="tool" data-tool="calorie">
    <form class="tool__form">
      <div class="field">
        <label class="field__label" for="t-sex">${esc(t({ ar: "النوع", en: "Sex" }, locale))}</label>
        <select class="select" id="t-sex" name="sex" required>
          <option value="">${esc(t({ ar: "اختار", en: "Select" }, locale))}</option>
          <option value="female">${esc(t({ ar: "أنثى", en: "Female" }, locale))}</option>
          <option value="male">${esc(t({ ar: "ذكر", en: "Male" }, locale))}</option>
        </select>
      </div>
      <div class="field">
        <label class="field__label" for="t-age">${esc(t({ ar: "العمر بالسنين", en: "Age in years" }, locale))}</label>
        <input class="input" id="t-age" name="age" type="number" min="18" max="120" step="1" inputmode="numeric" required>
      </div>
      <div class="field">
        <label class="field__label" for="t-height">${esc(t({ ar: "الطول (سم)", en: "Height (cm)" }, locale))}</label>
        <input class="input" id="t-height" name="height" type="number" min="1" step="0.1" inputmode="decimal" required>
      </div>
      <div class="field">
        <label class="field__label" for="t-weight">${esc(t({ ar: "الوزن (كجم)", en: "Weight (kg)" }, locale))}</label>
        <input class="input" id="t-weight" name="weight" type="number" min="1" step="0.1" inputmode="decimal" required>
      </div>
      <div class="field">
        <label class="field__label" for="t-activity">${esc(t({ ar: "مستوى النشاط", en: "Activity level" }, locale))}</label>
        <select class="select" id="t-activity" name="activity" required>
          <option value="">${esc(t({ ar: "اختار", en: "Select" }, locale))}</option>
          <option value="1.2">${esc(t({ ar: "قليل: أغلب اليوم من غير حركة", en: "Low: mostly inactive" }, locale))}</option>
          <option value="1.375">${esc(t({ ar: "خفيف: حركة أو تمرين خفيف", en: "Light: some movement or light exercise" }, locale))}</option>
          <option value="1.55">${esc(t({ ar: "متوسط: تمرين منتظم", en: "Moderate: regular exercise" }, locale))}</option>
          <option value="1.725">${esc(t({ ar: "عالي: تمرين قوي أغلب الأيام", en: "High: hard exercise most days" }, locale))}</option>
          <option value="1.9">${esc(t({ ar: "عالي جداً: مجهود بدني قوي يومياً", en: "Very high: hard physical activity every day" }, locale))}</option>
        </select>
      </div>
      <div class="field">
        <label class="field__label" for="t-goal">${esc(t({ ar: "الهدف", en: "Goal" }, locale))}</label>
        <select class="select" id="t-goal" name="goal" required>
          <option value="">${esc(t({ ar: "اختار", en: "Select" }, locale))}</option>
          <option value="lose">${esc(t({ ar: "نزول الوزن", en: "Lose weight" }, locale))}</option>
          <option value="maintain">${esc(t({ ar: "تثبيت الوزن", en: "Maintain weight" }, locale))}</option>
          <option value="gain">${esc(t({ ar: "زيادة الوزن", en: "Gain weight" }, locale))}</option>
        </select>
      </div>
      <div class="cluster" style="grid-column:1/-1;margin-top:.35rem">
        <button class="btn btn--primary" type="submit">${esc(t(c.site.ui.calculate, locale))}</button>
        <button class="btn btn--ghost" type="button" data-clear>${esc(t(c.site.ui.reset, locale))}</button>
      </div>
    </form>
    <div class="tool__result" aria-live="polite" hidden></div>
  </div>`;

  return healthToolPage({
    c, locale, slug: "calorie-calculator", title,
    intro: {
      ar: "اكتب بياناتك وهدفك عشان تاخد تقدير للسعرات اليومية والماكروز. الحاسبة مخصصة للبالغين.",
      en: "Enter your details and goal for an estimate of daily calories and macros. This calculator is intended for adults.",
    },
    description: {
      ar: "احسب احتياجك اليومي التقريبي من السعرات والماكروز حسب العمر والطول والوزن والنشاط والهدف، مع توضيح إن النتيجة مش بديل عن الكشف.",
      en: "Estimate daily calories and macros from age, height, weight, activity and goal, with clear guidance on the limits of an online calculator.",
    },
    tool,
  });
}

function bmiCalculator({ c, locale }) {
  const title = { ar: "حاسبة مؤشر كتلة الجسم", en: "BMI calculator" };
  const tool = `<div class="tool" data-tool="bmi">
    <form class="tool__form">
      <div class="field">
        <label class="field__label" for="t-height">${esc(t({ ar: "الطول (سم)", en: "Height (cm)" }, locale))}</label>
        <input class="input" id="t-height" name="height" type="number" min="1" step="0.1" inputmode="decimal" required>
      </div>
      <div class="field">
        <label class="field__label" for="t-weight">${esc(t({ ar: "الوزن (كجم)", en: "Weight (kg)" }, locale))}</label>
        <input class="input" id="t-weight" name="weight" type="number" min="1" step="0.1" inputmode="decimal" required>
      </div>
      <div class="cluster" style="grid-column:1/-1;margin-top:.35rem">
        <button class="btn btn--primary" type="submit">${esc(t(c.site.ui.calculate, locale))}</button>
        <button class="btn btn--ghost" type="button" data-clear>${esc(t(c.site.ui.reset, locale))}</button>
      </div>
    </form>
    <div class="tool__result" aria-live="polite" hidden></div>
  </div>`;

  return healthToolPage({
    c, locale, slug: "bmi-calculator", title,
    intro: {
      ar: "مؤشر كتلة الجسم بيقارن الوزن بالطول. احسبه هنا، واقرا النتيجة مع ملاحظة إنه مش بيقيس توزيع الدهون والعضلات.",
      en: "BMI compares weight with height. Calculate it here, keeping in mind that it does not measure how fat and muscle are distributed.",
    },
    description: {
      ar: "حاسبة مؤشر كتلة الجسم للبالغين مع النطاق المرتبط بالطول، وشرح واضح لحدود BMI وأهمية تحليل تركيب الجسم بدل الاعتماد على الوزن وحده.",
      en: "An adult BMI calculator with a height-related range and a clear explanation of BMI's limits and the value of body-composition assessment.",
    },
    tool,
  });
}

function waterCalculator({ c, locale }) {
  const title = { ar: "حاسبة المياه", en: "Water intake calculator" };
  const tool = `<div class="tool" data-tool="water">
    <form class="tool__form">
      <div class="field">
        <label class="field__label" for="t-weight">${esc(t({ ar: "الوزن (كجم)", en: "Weight (kg)" }, locale))}</label>
        <input class="input" id="t-weight" name="weight" type="number" min="1" step="0.1" inputmode="decimal" required>
      </div>
      <div class="field">
        <label class="field__label" for="t-activity">${esc(t({ ar: "النشاط اليومي", en: "Daily activity" }, locale))}</label>
        <select class="select" id="t-activity" name="activity" required>
          <option value="">${esc(t({ ar: "اختار", en: "Select" }, locale))}</option>
          <option value="0">${esc(t({ ar: "قليل أو من غير تمرين", en: "Low or no exercise" }, locale))}</option>
          <option value="350">${esc(t({ ar: "نشاط متوسط", en: "Moderately active" }, locale))}</option>
          <option value="700">${esc(t({ ar: "نشاط قوي أو لفترة طويلة", en: "Hard or prolonged activity" }, locale))}</option>
        </select>
      </div>
      <div class="field">
        <label class="field__label" for="t-climate">${esc(t({ ar: "الجو خلال يومك", en: "Climate during your day" }, locale))}</label>
        <select class="select" id="t-climate" name="climate" required>
          <option value="">${esc(t({ ar: "اختار", en: "Select" }, locale))}</option>
          <option value="0">${esc(t({ ar: "معتدل أو أغلب الوقت في مكان مكيّف", en: "Mild or mostly air-conditioned" }, locale))}</option>
          <option value="350">${esc(t({ ar: "دافي مع وقت بره", en: "Warm with some time outdoors" }, locale))}</option>
          <option value="700">${esc(t({ ar: "حر مع وقت طويل بره", en: "Hot with extended time outdoors" }, locale))}</option>
        </select>
      </div>
      <div class="cluster" style="grid-column:1/-1;margin-top:.35rem">
        <button class="btn btn--primary" type="submit">${esc(t(c.site.ui.calculate, locale))}</button>
        <button class="btn btn--ghost" type="button" data-clear>${esc(t(c.site.ui.reset, locale))}</button>
      </div>
    </form>
    <div class="tool__result" aria-live="polite" hidden></div>
  </div>`;

  return healthToolPage({
    c, locale, slug: "water-calculator", title,
    intro: {
      ar: "اكتب وزنك واختار مستوى الحركة والجو عشان تاخد تقدير عام لكمية المياه اليومية.",
      en: "Enter your weight, activity and climate for a general estimate of daily water intake.",
    },
    description: {
      ar: "تقدير تقريبي لاحتياج المياه اليومي حسب الوزن والنشاط وحرارة الجو، مع تنبيه خاص إن بعض الحالات الصحية لازم ترجع للطبيب.",
      en: "Estimate daily water intake from weight, activity and climate, with a clear warning that some health conditions need individual medical advice.",
    },
    tool,
  });
}

function calorieTracker({ c, locale }) {
  const title = { ar: "متتبع السعرات اليومي", en: "Daily calorie tracker" };
  const tool = `<div class="tool" data-tool="calorie-tracker">
    <div class="field">
      <label class="field__label" for="t-target">${esc(t({ ar: "هدف السعرات اليومي", en: "Daily calorie target" }, locale))}</label>
      <input class="input" id="t-target" name="target" type="number" min="1" step="1" inputmode="numeric">
    </div>

    <form class="tool__form" data-add style="margin-top:1.5rem">
      <div class="field">
        <label class="field__label" for="t-item">${esc(t({ ar: "اسم الأكل أو الوجبة", en: "Food or meal name" }, locale))}</label>
        <input class="input" id="t-item" name="item" type="text" autocomplete="off" required>
      </div>
      <div class="field">
        <label class="field__label" for="t-kcal">${esc(t({ ar: "السعرات", en: "Calories" }, locale))}</label>
        <input class="input" id="t-kcal" name="kcal" type="number" min="1" step="1" inputmode="numeric" required>
      </div>
      <div class="cluster" style="grid-column:1/-1;margin-top:.35rem">
        <button class="btn btn--primary" type="submit">${esc(t({ ar: "ضيفي لليوم", en: "Add to today" }, locale))}</button>
        <button class="btn btn--ghost" type="button" data-clear>${esc(t({ ar: "امسح اليوم", en: "Clear today" }, locale))}</button>
      </div>
    </form>

    <div class="tool__result" style="margin-top:1.75rem">
      <div class="tool__figure">
        <span class="tool__figure-n" data-total aria-live="polite">0</span>
        <span class="tool__figure-l">${esc(t({ ar: "إجمالي اليوم من الهدف", en: "Today's total against target" }, locale))}</span>
      </div>
      <div class="tool__bar" aria-hidden="true"><span class="tool__bar-fill"></span></div>
    </div>
    <ul class="tool__log" aria-live="polite">
      <li class="tool__empty">${esc(t({ ar: "لسه مفيش حاجة مسجلة النهاردة.", en: "Nothing logged yet today." }, locale))}</li>
    </ul>
  </div>`;

  return healthToolPage({
    c, locale, slug: "calorie-tracker", title,
    intro: {
      ar: "سجّل كل وجبة أو مشروب بسعراته، والمتتبع هيجمع يومك ويقارنه بالهدف اللي كتبته.",
      en: "Log each meal or drink with its calories, and the tracker will add up your day against the target you enter.",
    },
    description: {
      ar: "متتبع سعرات يومي بسيط يسجل الأكل والسعرات ويحسب الإجمالي مقارنة بهدفك، مع حفظ البيانات على جهازك فقط.",
      en: "A simple daily calorie tracker that logs foods, totals calories against your target and stores the day's entries on your device only.",
    },
    tool,
  });
}

function progressTracker({ c, locale }) {
  const title = { ar: "متتبع الوزن والقياسات", en: "Weight and measurement tracker" };
  const tool = `<div class="tool" data-tool="progress">
    <form class="tool__form" data-add>
      <div class="field">
        <label class="field__label" for="t-date">${esc(t({ ar: "التاريخ", en: "Date" }, locale))}</label>
        <input class="input" id="t-date" name="date" type="date">
      </div>
      <div class="field">
        <label class="field__label" for="t-weight">${esc(t({ ar: "الوزن (كجم)", en: "Weight (kg)" }, locale))}</label>
        <input class="input" id="t-weight" name="weight" type="number" min="1" step="0.1" inputmode="decimal" required>
      </div>
      <div class="field">
        <label class="field__label" for="t-waist">${esc(t({ ar: "محيط الخصر (سم)", en: "Waist (cm)" }, locale))}</label>
        <input class="input" id="t-waist" name="waist" type="number" min="1" step="0.1" inputmode="decimal">
      </div>
      <div class="cluster" style="grid-column:1/-1;margin-top:.35rem">
        <button class="btn btn--primary" type="submit">${esc(t({ ar: "احفظ القياس", en: "Save measurement" }, locale))}</button>
      </div>
    </form>
    <div class="tool__result" aria-live="polite" hidden></div>
    <ul class="tool__log" aria-live="polite">
      <li class="tool__empty">${esc(t({ ar: "سجّل أول قياس عشان نبدأ نتابع التغيير.", en: "Log your first measurement to start tracking change." }, locale))}</li>
    </ul>
  </div>`;

  return healthToolPage({
    c, locale, slug: "progress-tracker", title,
    intro: {
      ar: "سجّل الوزن ومحيط الخصر بالتاريخ. السجل هيعرض التغيير ويعمل مقارنة بسيطة بين القياسات.",
      en: "Log your weight and waist by date. The tracker will show the change and a simple visual comparison between entries.",
    },
    description: {
      ar: "سجل بسيط لمتابعة الوزن ومحيط الخصر بالتاريخ وعرض التغيير مع الوقت، مع حفظ كل القياسات على جهازك فقط.",
      en: "Track weight and waist by date and see change over time in a simple visual record stored on your device only.",
    },
    tool,
  });
}

function ultrasoundPrep({ c, locale }) {
  const title = { ar: "قائمة تحضير سونار البطن", en: "Abdominal ultrasound preparation" };
  const checks = [
    {
      name: "fasting",
      label: { ar: "هصوم من ٦ لـ ٨ ساعات قبل الميعاد.", en: "I will fast for six to eight hours before the appointment." },
    },
    {
      name: "water",
      label: { ar: "عارفة إن المياه عادي خلال فترة الصيام.", en: "I know that water is fine during the fasting period." },
    },
    {
      name: "fizzy",
      label: { ar: "هتجنب المشروبات الغازية في اليوم اللي قبل السونار.", en: "I will avoid fizzy drinks on the day before the ultrasound." },
    },
    {
      name: "bloating",
      label: { ar: "هتجنب الأكل اللي بيسبب لي انتفاخ في اليوم اللي قبله.", en: "I will avoid foods that make me bloated on the day before it." },
    },
  ];
  const tool = `<div class="tool" data-tool="prep">
    <div class="stack">
      ${map(checks, (check) => `<label class="checkbox" for="t-${esc(check.name)}">
        <input id="t-${esc(check.name)}" name="${esc(check.name)}" type="checkbox">
        <span>${esc(t(check.label, locale))}</span>
      </label>`)}
    </div>
    <div class="tool__result" style="margin-top:1.75rem">
      <div class="tool__figure">
        <span class="tool__figure-n" data-total aria-live="polite">0 / ${esc(checks.length)}</span>
        <span class="tool__figure-l">${esc(t({ ar: "خطوات خلصتها", en: "Steps checked" }, locale))}</span>
      </div>
      <div class="tool__bar" aria-hidden="true"><span class="tool__bar-fill"></span></div>
    </div>
    <div class="cluster" style="margin-top:1.25rem">
      <button class="btn btn--ghost" type="button" data-clear>${esc(t(c.site.ui.reset, locale))}</button>
    </div>
  </div>`;

  return healthToolPage({
    c, locale, slug: "ultrasound-prep", title,
    intro: {
      ar: "علّم على خطوات التحضير واحدة واحدة قبل سونار البطن. القائمة مبنية على تعليمات التحضير المنشورة عندنا.",
      en: "Tick off each preparation step before an abdominal ultrasound. This checklist follows the preparation instructions published by the clinic.",
    },
    description: {
      ar: "قائمة تحضير سونار البطن: الصيام من ٦ لـ ٨ ساعات، المياه مسموحة، وتجنب المشروبات الغازية والأكل المسبب للانتفاخ في اليوم السابق.",
      en: "Abdominal ultrasound preparation checklist: fast for six to eight hours, water is fine, and avoid fizzy drinks and bloating foods the day before.",
    },
    tool,
  });
}

export function pages({ c, locale }) {
  return [
    toolsHub({ c, locale }),
    calorieCalculator({ c, locale }),
    bmiCalculator({ c, locale }),
    waterCalculator({ c, locale }),
    calorieTracker({ c, locale }),
    progressTracker({ c, locale }),
    ultrasoundPrep({ c, locale }),
  ];
}
