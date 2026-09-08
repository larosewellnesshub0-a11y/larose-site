# CODEX TASKS — ROUND 2

Read `_project/CODEX-BRIEF.md` in full first. Everything in it still applies:
the `pages({c, locale})` contract, `depth`, `t()`/`esc()`, the closed stylesheet,
the editorial rules, no prices, accessibility. Then read `build/pages/home.mjs` and
`build/pages/specialties.mjs` as reference implementations.

You will be told which TASK to do. **Create only the files your task lists.**
Other workers run concurrently — touch nothing else.

---

## TASK E — the Knowledge Centre content

**Create only `content/articles.json`.** No code.

The Knowledge Centre is the site's SEO engine and its credibility layer. It has four
content types, all in one `articles` array, distinguished by a `type` field.

```json
{
  "categories": [
    { "slug": "nutrition", "name": {"ar":"...","en":"..."},
      "desc": {"ar":"...","en":"..."}, "specialty": "clinical-nutrition" }
  ],
  "articles": [ ... ]
}
```

Categories: one per published specialty in `content/specialties.json`, using the same
slugs, plus a `general` category for cross-cutting topics.

### Article object shape

```json
{
  "slug": "insulin-resistance-explained",
  "type": "article",              // article | update | qa | tip
  "published": true,
  "featured": false,
  "category": "clinical-nutrition",
  "specialties": ["clinical-nutrition"],
  "date": "2026-08-14",
  "readingTime": 7,
  "author": "shimaa-fouad",        // a slug from content/doctors.json, or null
  "reviewedBy": "shimaa-fouad",    // a doctor slug, or null
  "image": null,
  "title":   {"ar": "...", "en": "..."},
  "excerpt": {"ar": "...", "en": "..."},
  "sections": [
    { "id": "what-is-it", "heading": {"ar":"...","en":"..."},
      "body": {"ar":"paragraph\n\nparagraph", "en":"paragraph\n\nparagraph"} }
  ],
  "faq": [ { "q": {"ar":"...","en":"..."}, "a": {"ar":"...","en":"..."} } ],
  "sources": [ { "label": "WHO — Obesity and overweight", "url": "https://..." } ],
  "tags": {"ar": ["..."], "en": ["..."]}
}
```

### What to write

**12 `type: "article"`** — full explainers, 5 to 8 `sections` each, 700–1100 words per
language. Cover the questions Egyptian patients actually search for. Suggested set,
each mapped to a real specialty in the content files:

1. Insulin resistance — what it is, why weight will not move, how it is diagnosed
2. PCOS and weight — the hormonal loop, and what actually helps
3. Body composition vs the scale — why InBody matters more than weight
4. Hypothyroidism and weight gain
5. Non-surgical alternatives to bariatric surgery — an honest comparison
6. GLP-1 medication — how it works, who it suits, who it does not
7. Fatty liver — the commonest liver finding on an abdominal ultrasound
8. H. pylori, reflux and IBS — telling them apart
9. Stubborn localised fat — why diet alone will not shift it
10. Protecting muscle while losing weight
11. Hair loss — the blood tests that come before any product
12. Children's appetite — when it is behavioural and when it is medical

**6 `type: "update"`** — scientific updates. Short (250–400 words per language), each
summarising a real, well-established development in its field and what it means for a
patient at this clinic. `sources` is REQUIRED and must point at genuine, checkable
organisations (WHO, NICE, ADA, EASO, ESPEN, the FDA). Do not fabricate a citation, a
study name, a journal or a statistic. If you are not certain a specific study exists,
write about the established guideline position instead and cite the guideline body.

**10 `type: "qa"`** — Ask the doctor. A real patient question in the clinic's voice and
a 150–250 word answer attributed to one of the three REAL doctors
(`shimaa-fouad`, `alyaa-abu-taleb`, `mohab-ashraf`) — matched to their actual
specialty. `sections` may be a single section; `excerpt` is the question.

**14 `type: "tip"`** — daily tips. 40–80 words per language, one practical, specific,
non-obvious thing. `author` is a real doctor slug. `date` should spread across the
fortnight ending 2026-09-05. No `sections` needed — put the tip in `excerpt`.

### Rules that matter

- **Never invent a statistic, a study, a percentage or a guideline.** Where the clinic's
  own content files state a fact (InBody at every visit, weekly follow-up, the
  ultrasound inside the consultation, the pre-injection lab panel), use that. Where
  you need general medical background, keep it to what is uncontroversial and
  textbook-level, and attribute anything specific to a named body in `sources`.
- **No prices, ever.**
- Arabic is the clinic's warm Egyptian register addressed to the patient — the same
  voice as `content/specialties.json`. English is proper British English, a real
  translation, not a transliteration.
- Every article's `faq` should hold 2–4 genuinely-asked questions.
- Each article must end its last section pointing gently at a consultation, without
  hard selling.
- Keep `slug` values short, hyphenated, ASCII, and unique across the whole array.

Output valid JSON. No trailing commas. UTF-8.

---

## TASK F — the Knowledge Centre pages

**Create only `build/pages/articles.mjs`** (replacing the existing one).

Read `content/articles.json` defensively — it may be empty when you run.

Pages, all depth 1 unless stated:

- **`articles/index.html`** — the Knowledge Centre hub. `pageHero`, then:
  a row of section cards linking to Articles / Updates / Ask the doctor / Daily tips /
  FAQ / Health tools; a featured article block; the latest 6 articles in a
  `.grid .grid-3`; a "today's tip" panel pulling the most recent `type: "tip"`; and
  a category filter row of `.chip` links.
- **`articles/list.html`** — all `type: "article"`, paginated only if trivial to do
  (otherwise one grid), with the category chips.
- **`articles/updates.html`** — all `type: "update"`, newest first, each showing its
  `sources` as links.
- **`articles/qa.html`** — all `type: "qa"`, rendered as question cards with the
  answering doctor's name and portrait (look the doctor up in `c.doctors`).
- **`articles/tips.html`** — all `type: "tip"`, newest first, as a dated list. Give the
  most recent one a prominent "today's tip" treatment at the top.
- **`articles/faq.html`** — every `faq` entry from every published specialty AND every
  article, grouped by specialty, rendered with `faqList()`. Pass `faqSchema()`.
- **`articles/category-<slug>.html`** for each category — the same grid, filtered,
  across all four types.
- **`articles/<slug>.html`** for every published entry of any type. Layout:
  crumbs; a type chip and a category chip; `<h1>`; a meta row with the date, reading
  time, author (linked to the doctor page) and, when `reviewedBy` is set, a
  "Medically reviewed by" line using `c.site.ui.reviewedBy`; a hero image in
  `.arch .arch--wide` when `image` is set. Then a two-column body: a sticky table of
  contents built from `sections` (`position:sticky;top:7rem` inline) beside the body
  as `.prose`, each section as `<h2 id="{section.id}">` plus `paras(body)`.
  After the body: `sources` as a cited list when present; the article's `faq` via
  `faqList()`; `medicalNotice()`; an author card when `author` resolves to a doctor;
  related entries (same category, max 3); `ctaBand()`.
  For `type: "tip"` and `type: "qa"`, which have little or no `sections`, fall back to
  a single-column layout rendering `excerpt` as the body — do not emit an empty
  sidebar.
  Add Article + BreadcrumbList JSON-LD, and `faqSchema()` when there are FAQs.

Use `c.site.ui.articles / updates / qa / tips / readingTime / publishedOn / reviewedBy`
for all labels.

---

## TASK G — health tools and home visits

### G1. `build/pages/tools.mjs` — all depth 1

Six tool pages plus a hub. Every tool page must:
- carry a visible `.notice` with `t(c.site.ui.toolDisclaimer, locale)` ABOVE the tool;
- carry `t(c.site.ui.saveLocal, locale)` near any tool that stores data;
- end with `medicalNotice()` and a `ctaBand()`;
- be fully usable by keyboard, with every input carrying a real `<label for>`;
- use ONLY existing classes plus the tool classes listed below, which already exist
  in the stylesheet: `.tool`, `.tool__form`, `.tool__result`, `.tool__figure`,
  `.tool__figure-n`, `.tool__figure-l`, `.tool__bar`, `.tool__bar-fill`,
  `.tool__row`, `.tool__log`, `.tool__log-item`, `.tool__empty`.

Pages:
- **`tools/index.html`** — hub, a `.grid .grid-3` of cards for the six tools.
- **`tools/calorie-calculator.html`** — inputs: sex, age, height (cm), weight (kg),
  activity level (5 options), goal (lose / maintain / gain). Wrapper element carries
  `data-tool="calorie"`.
- **`tools/bmi-calculator.html`** — height, weight. `data-tool="bmi"`.
- **`tools/water-calculator.html`** — weight, activity, climate. `data-tool="water"`.
- **`tools/calorie-tracker.html`** — a daily food log. `data-tool="calorie-tracker"`.
  Needs: a target field, an "add item" row (name + calories), a list container, and a
  daily total with a progress bar.
- **`tools/progress-tracker.html`** — `data-tool="progress"`. Date, weight, waist,
  and a list of saved entries plus a simple bar visualisation.
- **`tools/ultrasound-prep.html`** — `data-tool="prep"`. A checklist of the
  preparation steps that `content/specialties.json` actually states for an abdominal
  ultrasound (6–8 hours fasting, water is fine, avoid fizzy drinks and bloating foods
  the day before), each as a checkbox that persists.

**Do not write any JavaScript.** The behaviour is already implemented in
`site/assets/js/tools.js` and keyed off the `data-tool` attributes and the class names
above. Your job is the markup and the bilingual copy only.

Give every input an `id` of the form `t-<field>` and a `name` of `<field>`, e.g.
`id="t-weight" name="weight"`. The script looks controls up by `name` within the
`[data-tool]` container.

### G2. `build/pages/home-visits.mjs`

- **`${locale}/patients/home-visits.html`** (depth 1) — the home visits service.
  The clinic has NOT supplied coverage areas, availability or what is included, so
  write the page so it works without inventing any of that:
  `pageHero`; an honest explanation of what a home visit is and who it suits (limited
  mobility, post-operative follow-up, elderly patients, anyone who cannot travel to
  Maadi); a "what to expect" section; a clear statement that availability and coverage
  are confirmed when you call, with a WhatsApp and a phone CTA; and an FAQ.
  Add `<!-- TODO(clinic): coverage areas, hours, what is included, which specialties -->`
  where those facts would go. Do not state a price or a coverage radius.

Also add a quick-services strip to the home page: edit **only** the marked section in
`build/pages/home.mjs` — insert, immediately after the `${finder(...)}` line, a
`<section class="section section--tight">` containing a `.grid .grid-4` of four
`.card`s linking to Home visits, Online follow-up (`digital/online-diet.html`),
Health tools (`tools/index.html`) and WhatsApp, each with an icon
(`pin`, `monitor`, `activity`, `whatsapp`). Change nothing else in that file.

---

## TASK H — the dashboard

**Create only `dashboard/index.html`, `dashboard/css/dashboard.css` and
`dashboard/js/dashboard.js`.**

A single-page admin for the clinic, in Arabic (RTL) with English labels alongside.
It talks to the local server already implemented at `server/serve.mjs`:

| call | purpose |
|---|---|
| `GET /api/content` | every content file, as `{ "site.json": {...}, ... }` |
| `GET /api/content/<file>.json` | one file |
| `PUT /api/content/<file>.json` | replace it; the server backs up, writes, and rebuilds |
| `POST /api/upload` `{dir, filename, dataUrl}` | saves an image, returns `{path}` |
| `POST /api/rebuild` | regenerate the site |
| `GET /api/status` | health check |

### Requirements

- **Left sidebar** with sections: Overview · Specialties · Doctors · Branches ·
  Articles & Knowledge · Reviews · Digital products · Site settings · Images · Backups.
- **Overview**: counts of each content type, how many items are unpublished, how many
  are flagged `sample: true`, the last build time from `/api/status`, a prominent
  "Rebuild site" button, and a list of every `_todo` string found anywhere in the
  content files (walk the JSON recursively) so the clinic can see exactly what is
  still missing.
- **List + edit** for every collection. A list shows each item with its name, a
  published toggle and a sample flag. Clicking opens a form built from the item's own
  shape — every bilingual field renders as **two inputs side by side, labelled AR and
  EN**, with the Arabic one `dir="rtl"`. Arrays of strings get add/remove rows.
  Nested arrays of objects (a specialty's `treatments`, an article's `sections`, a
  doctor's `credentials`) get a repeatable sub-form.
- **Reviews** needs a moderation queue: pending reviews shown first with Approve and
  Delete, plus a bulk paste box that accepts pasted Google reviews and parses them
  into review objects for the editor to confirm.
- **Images**: an upload control that reads a file, converts it to a data URL and POSTs
  it to `/api/upload`, then shows the returned path ready to copy into a field.
  Image fields in forms get a "choose / upload" button that fills them in.
- **Save** does `PUT` then reports the rebuild result. Show a clear success or error
  state. Warn before navigating away with unsaved changes.
- **Backups**: explain that the server keeps the last 20 versions of each file under
  `content/_backups/`, and show what a restore involves.
- The dashboard must never be required to view the site — say so on the Overview.

### Constraints

- Plain HTML, CSS and vanilla JS. **No framework, no CDN, no build step, no npm.**
- Reuse the site's design language: import `../site/assets/css/tokens.css` and
  `../site/assets/css/base.css` at the top of `dashboard.css`, then add only what the
  admin UI needs. Same olive/champagne palette, same fonts, same warm paper ground.
- Fully keyboard operable; every control labelled; visible focus.
- Must work at 1280px and at 390px.
- No authentication — it runs on `localhost` only. Say that plainly in the UI.
