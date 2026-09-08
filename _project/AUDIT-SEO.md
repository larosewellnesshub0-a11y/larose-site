# SEO and structured-data audit findings

### Root language gate has an undersized meta description

- **Where:** `site/index.html:7`; generator `build/build.mjs:50,58,228`
- **Evidence:** `<meta name="description" content="رعاية طبية متكاملة، وخطة مبنية على حالتك">` (40 characters)
- **Why it is wrong:** This is below the required 120–160-character range. It gives a crawler too little page-specific summary, so the search engine is likely to ignore it and assemble a snippet from other page text.
- **Fix:** Replace the root gate's `description` value with a truthful Arabic summary of 120–160 characters; keep the existing single emission at `build/build.mjs:58`.

### English Clinical Nutrition title exceeds 60 characters

- **Where:** `site/en/specialties/clinical-nutrition.html:6`; source `content/specialties.json:197`; generator `build/pages/specialties.mjs:293` → `build/lib/shell.mjs:437,454`, written by `build/build.mjs:223`
- **Evidence:** `<title>Clinical &amp; Therapeutic Nutrition in Maadi | La Rose Wellness Hub</title>` (64 rendered characters)
- **Why it is wrong:** This exceeds the 60-character limit, so a search engine may truncate or rewrite the title in results.
- **Fix:** Shorten only the English `seo.title` at `content/specialties.json:197` to no more than 60 rendered characters, including the brand text already present.

### Doctor-directory descriptions are too short in both languages

- **Where:** `site/ar/doctors/index.html:7` and `site/en/doctors/index.html:7`; generator content `build/pages/doctors.mjs:62-65` → `build/lib/shell.mjs:438,455`, written by `build/build.mjs:223`
- **Evidence:** `<meta name="description" content="اتعرّف على أطباء عيادات لاروز التخصصية في المعادي الجديدة، تخصصاتهم، خبراتهم، وأيام ومواعيد العيادة.">` (100 characters); `<meta name="description" content="Meet the doctors at La Rose Wellness Hub in New Maadi, and explore their specialties, experience and clinic hours.">` (114 characters)
- **Why it is wrong:** Both are below the required 120–160-character range. A crawler may replace either description with body text when generating a result snippet.
- **Fix:** Extend the two literal descriptions at `build/pages/doctors.mjs:63-64` with accurate page-specific copy until each is 120–160 characters.

### Doctor-directory cards skip heading level 2

- **Where:** `site/ar/doctors/index.html:394,411` and `site/en/doctors/index.html:394,411`; generator `build/pages/doctors.mjs:42-46`, card heading emitted by `build/lib/components.mjs:107`, written by `build/build.mjs:223`
- **Evidence:** Arabic jumps from `<h1 class="h1 page-hero__title">الأطباء</h1>` to `<h3 class="card__title">`; English jumps from `<h1 class="h1 page-hero__title">Our Doctors</h1>` to `<h3 class="card__title">`.
- **Why it is wrong:** A crawler sees the doctor names as level-3 subsections without an intervening level-2 section, producing an invalid heading outline for the directory content.
- **Fix:** Add one descriptive `h2` (visually hidden if necessary) inside the doctors section before the grid at `build/pages/doctors.mjs:44`; leave the reusable doctor-card `h3` unchanged.

### Arabic branch-directory description is below the minimum length

- **Where:** `site/ar/branches/index.html:7`; generator content `build/pages/branches.mjs:63-66` → `build/lib/shell.mjs:438,455`, written by `build/build.mjs:223`
- **Evidence:** `<meta name="description" content="فروع عيادات لاروز التخصصية. زوري فرع المعادي الجديدة، وتابع تفاصيل فرعي التجمع الخامس والشيخ زايد وقت ما يتم تأكيدها.">` (117 characters)
- **Why it is wrong:** The description is shorter than the required 120-character minimum, so a search engine may substitute text from the page when composing its snippet.
- **Fix:** Extend the Arabic description literal at `build/pages/branches.mjs:64` with a few accurate, useful words so it falls within 120–160 characters.

### GLP-1 article metadata falls outside the length limits

- **Where:** `site/en/articles/glp1-medication-guide.html:6`, `site/ar/articles/glp1-medication-guide.html:6-7`; source `content/articles.json:1591-1596`; generator `build/pages/articles.mjs:806-807,921-924` → `build/lib/shell.mjs:437-438,454-455`, written by `build/build.mjs:223`
- **Evidence:** `<title>GLP-1 medicines: how they work, who they may suit and who they may not | La Rose Wellness Hub</title>` (93 characters); `<title>أدوية GLP-1: بتشتغل إزاي ومين تناسب ومين لأ؟ | عيادات لاروز التخصصية</title>` (68 characters); `<meta name="description" content="الحقن دواء بوصفة ومتابعة، مش اختصار عام لكل حد عايز يخس. نفهم تأثيرها، التحضير، الأعراض، وحماية العضلات من غير مبالغة.">` (118 characters)
- **Why it is wrong:** Both titles exceed 60 characters and may be truncated or rewritten in results. The Arabic description is below 120 characters and may be replaced with a crawler-selected body snippet.
- **Fix:** Shorten the two article titles at `content/articles.json:1591-1592` enough that the generated titles, including the automatic brand suffix, remain at or below 60 characters; extend the Arabic excerpt at line 1595 to 120–160 characters.

### Thyroid Q&A titles and descriptions violate both length bounds

- **Where:** `site/en/articles/qa-thyroid-dose-weight.html:6-7` and `site/ar/articles/qa-thyroid-dose-weight.html:6-7`; source `content/articles.json:3108-3113`; generator `build/pages/articles.mjs:806-807,921-924` → `build/lib/shell.mjs:437-438,454-455`, written by `build/build.mjs:223`
- **Evidence:** `<title>My thyroid results are controlled on treatment, but my weight is stuck. Should I increase the dose? | La Rose Wellness Hub</title>` (122 characters); `<meta name="description" content="My thyroid results are controlled on treatment, but my weight is stuck. Should I increase the dose?">` (99 characters); `<title>تحليل الغدة مظبوط على العلاج وبرضه وزني ثابت، أزوّد الجرعة؟ | عيادات لاروز التخصصية</title>` (83 characters); `<meta name="description" content="تحليل الغدة مظبوط على العلاج وبرضه وزني ثابت، أزوّد الجرعة؟">` (59 characters)
- **Why it is wrong:** Both titles exceed the 60-character limit and are likely candidates for truncation or rewriting. Both descriptions are below 120 characters, so a crawler may ignore them and synthesize snippets from the answer text.
- **Fix:** Shorten the bilingual titles at `content/articles.json:3108-3109` enough to stay within 60 characters after the brand suffix, and replace the duplicated-title excerpts at lines 3112-3113 with accurate 120–160-character summaries.

### Arabic contact description is too short

- **Where:** `site/ar/contact.html:7`; generator content `build/pages/misc.mjs:166-169` → `build/lib/shell.mjs:438,455`, written by `build/build.mjs:223`
- **Evidence:** `<meta name="description" content="اتصل بعيادات لاروز أو ابعت رسالة واتساب، واعرفي عنوان فرع المعادي الجديدة ومواعيد العمل وروابط Instagram وYouTube.">` (114 characters)
- **Why it is wrong:** This is below the required 120-character minimum, so a search engine may replace it with text selected from the contact page.
- **Fix:** Extend the Arabic description literal at `build/pages/misc.mjs:167` with accurate contact-page context until it is 120–160 characters.

TOTAL FINDINGS: 8
