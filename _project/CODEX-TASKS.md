# CODEX TASKS — La Rose Wellness Hub

Read `_project/CODEX-BRIEF.md` completely first, then `build/pages/home.mjs`,
`build/lib/util.mjs`, `build/lib/shell.mjs`, `build/lib/components.mjs`.

You will be told which TASK to do. **Create only the files listed in your task.**
Other workers are editing this repo at the same time — touch nothing else.

---

## TASK A — specialty and doctor pages

Also read `content/specialties.json` and `content/doctors.json`.

### A1. `build/pages/specialties.mjs`

Per locale:

**`${locale}/specialties/index.html`** (depth 1) — the hub.
`pageHero` + intro, then one `.grid .grid-3` of every published specialty via
`specialtyCard()` in `index` order. Then `finder()` and `ctaBand()`.

**`${locale}/specialties/<slug>.html`** (depth 1) — one page per published specialty.
This is the most important template on the site.

- `pageHero` with crumbs `[Specialties, this]`, eyebrow `sp.index`, title `sp.name`,
  text `sp.sub`, and two actions: Book (`btn--accent`) and WhatsApp (`btn--on-dark`).
- A tab bar: wrapper carries `data-tabs`, uses `.tabs`/`.tab` with
  `role="tablist"`/`role="tab"`, `aria-controls`, `aria-selected`. Panels are
  `<div role="tabpanel" id="..." aria-labelledby="...">`; every panel except the
  first carries the `hidden` attribute. Labels come from `c.site.ui.tabOverview`,
  `tabDoctors`, `tabReviews`, `tabResults`, `tabFaq`.
  Panels: Overview, Doctors, Reviews (if `sp.hasReviews`), Before & after
  (if `sp.hasBeforeAfter`), FAQ.
- **Overview panel** — `sp.intro` as a lede; then a two-column block: on one side the
  conditions list (`c.site.ui.conditionsTreated`) from `sp.treats` as a `.prose ul`,
  on the other an `.arch .arch--ruled .arch--tall` image if the specialty has one,
  otherwise omit that column entirely. Then a treatments section
  (`c.site.ui.treatments`): one `.card` per `sp.treatments` entry with `name`,
  `summary`, `body`, and the `facts` array rendered as `.chip` elements when present.
- **Doctors panel** — `doctorsIn(c.doctors, sp.slug)` via `doctorCard()` in a
  `.grid .grid-4`. When `sp.staffed` is false, put `sampleNotice({c, locale})` above
  the grid.
- **Reviews panel** — `ratingSummary()`, then reviews from `c.reviews.reviews` whose
  `specialties` array includes `sp.slug`. When there are none, a friendly empty state
  linking to `c.site.proof.rating.url` and `c.site.social.youtubeTestimonials`. Always
  end with a line inviting the patient to add their experience, linking to
  `patients/booking.html`.
- **Results panel** (only when `sp.hasBeforeAfter`) — a `.notice` carrying
  `c.site.legal.resultsVary`, then a `.grid .grid-2` of three
  `beforeAfter({c, locale, depth, pair: null})` placeholders.
- **FAQ panel** — `faqList({c, locale, items: sp.faq, idPrefix: sp.slug})`.
- After the tabs: a related-specialties strip — up to four other published
  specialties via `specialtyCard()` in a `.grid .grid-4`. Then `ctaBand()` and
  `medicalNotice()`.
- `title` / `description` come from `sp.seo`. Pass
  `schema: [faqSchema(sp.faq, locale), <MedicalSpecialty JSON-LD>]`.

### A2. `build/pages/doctors.mjs`

**`${locale}/doctors/index.html`** (depth 1) — `pageHero`, then a `.grid .grid-4` of
published doctors via `doctorCard()`. Real doctors (`sample: false`) first; the
sample ones follow, under a `sampleNotice()`.

**`${locale}/doctors/<slug>.html`** (depth 1) — per published doctor:
crumbs; a two-column hero with the portrait in `.arch .arch--ruled .arch--tall`
(or the `.doctor-placeholder` markup when `d.portrait` is null), and alongside it the
name as `<h1>`, the title, credentials as a `.prose ul`, days and hours as `.chip`
elements, and Book + WhatsApp buttons. When `d.sample`, put `sampleNotice()` directly
below that block. Then the bio as `.prose`; the specialties this doctor staffs via
`specialtyCard()` in a `.grid .grid-3`; reviews from `c.reviews.reviews` whose
`doctor` field equals the slug (omit the whole section when there are none); then
`ctaBand()` and `medicalNotice()`. Add Physician JSON-LD via `schema`.

---

## TASK B — branches, about, contact

Also read `content/branches.json` and `content/site.json`.

### B1. `build/pages/branches.mjs`

**`${locale}/branches/index.html`** (depth 1) — `pageHero`, a `.grid .grid-3` of
branch cards (copy the branch-card markup from `home.mjs`), then `ctaBand()`.

**`${locale}/branches/<slug>.html`** (depth 1) — per published branch.

When `status === "open"`: crumbs; `<h1>` = branch name; intro as a lede; a two-column
block with the address, landmark, phone (number wrapped in `<bdi class="num">`), hours
and a "get directions" button to `b.mapsUrl` (`target="_blank" rel="noopener"`);
alongside it a photo gallery using `.arch .arch--wide` for `b.photos`. Then
"getting here" as a `.prose ol`, the branch's specialties via `specialtyCard()` in a
`.grid .grid-3`, then `ctaBand()`. Add MedicalClinic JSON-LD.

When `status === "soon"`: a `chip chip--rose` carrying `c.site.ui.openingSoon`, the
intro, an explicit note that bookings currently go to the Maadi branch (linking to
`branches/maadi.html`), and `ctaBand()`. **Do not invent an address, an opening date
or photographs** — those fields are deliberately empty. Where the address would sit,
write a line saying it will be announced, and add
`<!-- TODO(clinic): address, opening date, photos -->`. No JSON-LD for these.

### B2. `build/pages/about.mjs` — all depth 1

- **`about/index.html`** — "our story". Genuine editorial copy in both languages,
  grounded only in facts present in `content/*.json`: a multi-specialty clinic in New
  Maadi; the integrated nutrition + internal-medicine consultation; InBody analysis at
  every visit; weekly follow-up; 5.0 on Google from 137 reviews; departments that
  confer with one another; never recommending something the patient does not need.
  500–700 words per language in the clinic's warm Egyptian Arabic voice. Include
  `statStrip()`, a photo in an `.arch`, and a values section of four `.card`s. End
  with `ctaBand()` + `medicalNotice()`.
- **`about/technology.html`** — the equipment. Cover only what the content evidences:
  the InBody body-composition analyser, body-contouring measurement, abdominal
  ultrasound performed by the specialist in the same visit, and the four contouring
  devices. Pull the device descriptions from the `body-contouring` specialty in
  `content/specialties.json` rather than writing new clinical claims.
- **`about/reviews.html`** — `ratingSummary()`, every published review via
  `reviewCard()` in a `.grid .grid-3`, links out to the Google listing and the YouTube
  playlist, a clear empty state when the array is empty, and a short section on how to
  leave a review.
- **`about/results.html`** — a `.notice` with `c.site.legal.resultsVary`, then a
  `.grid .grid-2` of six `beforeAfter({c, locale, depth, pair: null})` placeholders,
  then a paragraph explaining that real photographs are published only with written
  patient consent, then links to `c.site.social.instagramBeforeAfter` and the YouTube
  playlist.

### B3. `build/pages/misc.mjs`

- **`${locale}/contact.html`** (depth 0) — `pageHero`; a two-column layout with the
  contact channels (phone, WhatsApp, Instagram, YouTube, address) as `.card`s with
  icons on one side, and a contact form on the other. The form carries
  `data-whatsapp-form="201040661893"` plus localised `data-msg-intro`,
  `data-msg-invalid` and `data-msg-sent`, and contains
  `<p class="form-status" data-form-status hidden></p>`. Fields: name (required),
  phone (required, `type="tel"`), preferred branch (select), subject (select), message
  (textarea) — each with an `id` and a matching `<label for>`. Also embed a Google Maps
  iframe for the Maadi branch built from its geo coordinates, wrapped in a container
  with `border-radius:var(--r-lg);overflow:hidden`, and give the iframe a `title`.
- **`${locale}/404.html`** (depth 0) — a short friendly page linking back to home, the
  specialties hub and booking. No `active` nav key.

---

## TASK C — patient guide and legal

Also read `content/site.json` and `content/specialties.json`.

### C1. `build/pages/patients.mjs` — five pages, all depth 1

- **`patients/index.html`** — a hub: `pageHero`, a `.grid .grid-2` of cards linking to
  the four pages below, then `finder()`, then `ctaBand()`.
- **`patients/booking.html`** — the most important conversion page. `pageHero`, then a
  booking form. The site is static, so the form composes a pre-filled WhatsApp
  message: give the `<form>` `data-whatsapp-form="201040661893"` plus localised
  `data-msg-intro`, `data-msg-invalid`, `data-msg-sent`, and include
  `<p class="form-status" data-form-status hidden></p>`.
  Fields, each with `id` + `<label for>`: full name (required); phone (required,
  `type="tel" inputmode="tel"`); specialty (`name="specialty"`, options from published
  specialties); doctor (`name="doctor"`, each option carrying `data-specialties`
  exactly as `finder()` does, so the existing JS filters it); branch
  (`name="branch"`, "soon" branches `disabled`); preferred day; preferred time; notes
  (textarea); and a required consent checkbox referencing `legal/privacy.html`.
  Beside the form, an aside listing what the consultation includes (take the facts
  from the `nutrition-consultation` treatment in `specialties.json`), the booking note
  from `c.site.hours.bookingNote`, the clinic hours, and a WhatsApp button. End with
  `medicalNotice()`. **No prices.**
- **`patients/first-visit.html`** — a step-by-step walkthrough as a numbered
  `.prose ol` plus supporting cards, grounded in the content files: booking, arrival,
  InBody analysis, the consultation, lab review, the written plan, the weekly
  follow-up. ~450 words per language.
- **`patients/preparation.html`** — two blocks: (a) for a nutrition consultation —
  bring recent labs and any current medication; (b) for an abdominal ultrasound —
  fast 6–8 hours, water is fine, avoid fizzy drinks and bloating foods the day before.
  Also list the baseline panel asked for before weight-loss injections: CBC; TSH, FT3,
  FT4; urea and creatinine; AST and ALT; HbA1c and fasting blood sugar. All of this is
  already stated in `content/specialties.json` — add no test that is not there.
- **`patients/faq.html`** — one combined FAQ. Collect every `faq` entry from every
  published specialty, group them under a heading per specialty, render each group
  with `faqList({..., idPrefix: sp.slug})`, and pass `faqSchema()` for the whole set.
- **`patients/rights.html`** — patient rights and responsibilities. A careful, honest,
  generic list (a clear explanation; to ask questions; privacy and confidentiality; to
  refuse a treatment; a second opinion; to know who is treating them. Responsibilities:
  accurate history, following the agreed plan, arriving on time, reporting medication
  changes). Nothing clinic-specific.

### C2. `build/pages/legal.mjs` — three pages, all depth 1

`legal/privacy.html`, `legal/terms.html`, `legal/disclaimer.html`.
Use `pageHero({..., variant: "page-hero--paper"})` and a `.wrap--narrow .prose` body.

The disclaimer page leads with the exact text from `c.site.legal.disclaimer`.
The privacy policy must describe what this site actually does: it is static, it sets
no analytics or advertising cookies, it stores nothing server-side, and form
submissions are sent by the visitor's own WhatsApp — after which the clinic holds that
conversation. Name Egyptian Law 151 of 2020 on Personal Data Protection as the
governing framework. Put `<!-- TODO(clinic): have a lawyer review before launch -->`
at the top of each page.

---

## TASK D — health library and digital products

Also read `content/articles.json` and `content/digital.json`.

### D1. `build/pages/articles.mjs` — all depth 1

- **`articles/index.html`** — the hub. `pageHero`, a category filter row of `.chip`
  links, then a `.grid .grid-3` of article cards (copy the markup from `home.mjs`).
  When `c.articles.articles` is empty, render a designed empty state explaining that
  articles are added from the dashboard. **Invent no articles.**
- **`articles/category-<slug>.html`** for each entry in `c.articles.categories` — the
  same grid, filtered.
- **`articles/<slug>.html`** for each published article: crumbs; category chip;
  `<h1>`; a meta row (author, date, reading time); a hero image in `.arch .arch--wide`
  when `image` is set; then a two-column body — a sticky table of contents built from
  the article's `sections` array (`position:sticky;top:7rem` inline) beside the body as
  `.prose`, each section rendered as `<h2 id="...">` plus its paragraphs via `paras()`.
  After the body: the article's own `faq` via `faqList()` when present,
  `medicalNotice()`, an author card when `author` resolves to a doctor slug in
  `c.doctors`, related articles (same category, max three), and `ctaBand()`.
  Add Article + BreadcrumbList JSON-LD, and `faqSchema()` when the article has FAQs.

Design this module to work with **zero** articles today and any number later — read
every field defensively with `||` fallbacks.

### D2. `build/pages/digital.mjs` — all depth 1

- **`digital/index.html`** — the hub. `pageHero` explaining these are the clinic's
  remote services, a `.grid .grid-2` of `.card--product` cards for the two products, a
  section on how they relate to the in-clinic service, then `ctaBand()`.
- **`digital/recipe-book.html`** — a two-column hero: product imagery in an `.arch` on
  one side; on the other the name, a lede, a "what's inside" list and the call to
  action. The site takes no payments, so the CTA is a WhatsApp order button
  (`c.site.contact.whatsapp.href`) plus a note that the team will confirm and send the
  file. Then a sample-recipe teaser, a "who it's for" section, and an FAQ via
  `faqList()`.
- **`digital/online-diet.html`** — the online nutrition programme. Present the two
  formats the clinic actually offers, as two comparison cards: an individual (private)
  subscription and a group subscription. What each includes is stated in the clinic's
  own material: a nutrition plan built for your weight and health status; daily
  follow-up over WhatsApp; results reviewed and corrections made as you go;
  flexibility in food choices; easy home-cooking recipes and ideas; and for the private
  plan, the plan changes every two weeks, measurements are tracked, and there is a
  direct group with the doctor.

**No prices on any of these pages** — use `t(c.site.ui.priceOnConsult, locale)`
wherever a price would sit, and route every CTA to WhatsApp or
`patients/booking.html`.

`c.digital.products` is currently an empty array, so both product pages render from
hard-coded bilingual copy you write in the module. Add a comment noting that the
dashboard will later supply this data.
