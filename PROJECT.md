# PROJECT.md — La Rose Wellness Hub website

**Client:** عيادات لاروز التخصصية / La Rose Wellness Hub — a multi-specialty
polyclinic in New Maadi, Cairo.
**Deliverable:** a bilingual (Arabic RTL / English LTR) static website, a content
dashboard, and the documentation to run both.
**Location:** `D:\Larose wellness hub work\website data\new site`
**Started:** 2026-09-05

---

## 1. What this is, in one paragraph

A complete website generated from JSON content files by a small Node script. There is
no framework, no npm install, no build tool and no database. `node build/build.mjs`
reads `content/*.json` and writes plain HTML into `site/`. The result opens by
double-clicking `site/index.html` and works with no server at all. A local server
(`node server/serve.mjs`) exists for two reasons only: to preview the site in Chrome,
which refuses to run a site properly from `file://`, and to back the dashboard, which
edits the content files and re-runs the generator.

## 2. Why it was built this way

The client's brief asked for "an html for the full website, and html for each page
with an index html page" plus a dashboard for future edits. Those two requirements
pull in opposite directions: hand-written HTML is what was asked for, but sixty
hand-written pages across two languages diverge the moment anyone edits one of them.

The generator resolves that. The **output** is exactly what was asked for — a folder of
real, static, self-contained HTML files, one per page, that any developer or host can
take. The **source** is a set of content files plus a handful of templates, so a change
to the footer lands on all ninety-odd pages at once, and the dashboard has something
structured to edit.

## 3. The decisions the client made

| Decision | Choice | Where it lives |
|---|---|---|
| Languages | Bilingual AR + EN, full parity | every page exists at `/ar/…` and `/en/…` |
| Dashboard | Static site + a local Node writer | `dashboard/` + `server/serve.mjs` |
| Prices | **Never shown publicly.** Real figures loaded into the dashboard behind a per-item toggle, all off | validator fails the build if a price leaks |
| Unstaffed specialties | All 8 built and live, with sample doctor cards clearly ribboned | `published` toggle per specialty |
| Future branches | Both built and live, in an honest "opening soon" state | `published` toggle per branch |
| Body contouring | Cavitation, RF and cryolipolysis **retired 2026-09-06**. The specialty stays live, rebuilt around mesotherapy alone, and an FAQ says plainly that the three devices are not offered | `content/specialties.json` |
| Internal medicine | **Split 2026-09-06** into General Internal Medicine and Liver, Gastroenterology & Endoscopy, though Dr Mohab covers both. Each page names the other and says booking the wrong one costs no visit | `content/specialties.json` |
| Ultrasound | Performed inside both of those consultations, **and** bookable alone at another doctor's request. Given its own card, page and nav entry so the scan itself is findable | `content/specialties.json` |
| Article sharing | Share row (WhatsApp, Facebook, X, Telegram, LinkedIn, copy) plus Ask ChatGPT / Claude / Gemini under every entry, all configured from `sharing` in site.json so the dashboard controls it | `content/site.json` |
| Patient content | Google reviews real; WhatsApp feedback and before/after are consent-pending placeholders | `content/reviews.json` |

## 4. Directory map

```
new site/
├── content/            THE DATA — everything editable lives here
│   ├── site.json           clinic facts, navigation, footer, UI strings, legal
│   ├── specialties.json    8 specialties: intro, conditions, treatments, FAQ, SEO
│   ├── doctors.json        3 real doctors + 4 clearly-flagged samples
│   ├── branches.json       Maadi (open) + 5th Settlement & Sheikh Zayed (soon)
│   ├── articles.json       the Knowledge Centre: articles, updates, Q&A, tips
│   ├── reviews.json        reviews + the moderation queue
│   ├── digital.json        La Rose Digital products
│   ├── pages.json          copy for the remaining static pages
│   └── _backups/           last 20 versions of each file, written on every save
│
├── build/              THE GENERATOR
│   ├── build.mjs           orchestrator — run this
│   ├── lib/util.mjs        i18n, escaping, links, icons, lookups
│   ├── lib/shell.mjs       <head>, utility bar, header, drawer, footer, JSON-LD
│   ├── lib/components.mjs  cards, hero, FAQ, reviews, finder, CTA band
│   └── pages/*.mjs         one module per section of the site
│
├── site/               THE DELIVERABLE — generated, plus hand-managed assets
│   ├── index.html          language gate
│   ├── ar/ · en/           every page, mirrored
│   ├── assets/css/         tokens · base · components · layout
│   ├── assets/js/          site.js · tools.js
│   ├── assets/img/         logo · doctors · clinic · placeholders
│   ├── assets/fonts/       self-hosted woff2
│   ├── sitemap.xml · robots.txt
│   └── _viewport.html      dev-only multi-width harness (delete before launch)
│
├── dashboard/          the admin UI (served at /dashboard/)
├── server/serve.mjs    static preview + dashboard API
├── tools/validate.mjs  the static validator
└── _project/           briefs, worker logs, this documentation
```

## 5. How to run it

```bash
node build/build.mjs        # regenerate every page
node server/serve.mjs       # preview at http://localhost:4173
node tools/validate.mjs     # must report 0 errors before any handover
```

The published site needs none of this. `site/` is self-contained: upload that folder
to any host, or open `site/index.html` directly.

## 6. The design system

**Direction:** "botanical apothecary" — the refined warmth of a high-end wellness
clinic, not the flat institutional look of a hospital site. The reference the client
gave (Fakeeh) supplied the *information architecture*; the visual language is La Rose's
own.

**The signature element is the arch.** It is already in the clinic's own doctor
artwork, where every portrait sits inside one. Here it frames portraits, hero imagery
and specialty cards, and it is the one thing a visitor will remember.

**Gloss without AI gradients.** The brief specifically ruled out AI-looking mesh
gradients. Gloss instead comes from four physical sources: a specular light sweep
across curved surfaces, champagne hairlines, warm shadows (a neutral grey shadow on
warm paper reads as dirt), and a fine paper grain over the whole page.

**Liquid Glass** is applied only to the functional layer — the sticky header, the
floating appointment finder, the specialty tab bar, the mobile drawer and the floating
action buttons — per Apple's rule that glass distinguishes controls from content.
Content cards stay opaque. The one exception the HIG allows, and which is used here, is
a transient interactive element: the health-tool result panel, which appears in
response to the reader's own input.

**Colour.** The client's five brand colours are the whole palette, extended only by
shifting lightness so every shade stays on the logo's hue family. Olive carries the
structure; champagne is the metal; rose is an accent used sparingly. Nothing sits on
pure white — the ground is a warm paper.

**Type.** Romelio (the brand display serif) and Montserrat for English; the Arabic
face is a stand-in — see §9.

## 7. Information architecture

Modelled on the Fakeeh branch-hospital sites (analysed in
`_research/fakeeh-analysis.md`) and scaled to a polyclinic.

- **Home** — hero, appointment finder, quick services, specialties, the integrated
  consultation, doctors, reviews, La Rose Digital, branches, articles, CTA
- **Specialties** — hub + 8 pages, each with tabs: Overview · Doctors · Reviews ·
  Before & after · FAQ
- **Doctors** — hub + one page per doctor
- **Branches** — hub + Maadi, Fifth Settlement, Sheikh Zayed
- **Plan your visit** — booking, home visits, first visit, preparation, FAQ, rights
- **Knowledge Centre** — articles, scientific updates, Ask the doctor, daily tips,
  FAQ by topic, and the health tools
- **Health tools** — calorie calculator, calorie tracker, BMI, progress tracker,
  water intake, ultrasound preparation
- **La Rose Digital** — the recipe book and the online nutrition programme
- **About** — story, technology, reviews, before & after
- **Legal** — privacy, terms, medical disclaimer

## 8. Rules the build enforces

`tools/validate.mjs` fails on any of these, and it is run after every change:

1. Every internal link resolves to a file that exists
2. Exactly one `<h1>` per page
3. Every `<img>` has an `alt`; every `<iframe>` a `title`
4. Every form control has a label
5. No duplicate `id`s
6. No unrendered `${...}`, no `[object Object]`, no stray `undefined`
7. **No price on any public page**
8. Correct `lang` and `dir` for the locale
9. A meta description and a non-empty title
10. Valid JSON-LD
11. Every Arabic page has an English counterpart, and vice versa

## 9. Decisions pending — things to confirm or supply

These were decided by judgement in the client's absence and are all cheap to reverse.

1. **Graphik Arabic is not licensed or supplied.** It is a commercial font from
   Commercial Type. IBM Plex Sans Arabic stands in. To swap it, drop the woff2 files
   into `site/assets/fonts/` and change only `--font-ar-sans` / `--font-ar-display` in
   `site/assets/css/tokens.css`. Nothing else references the family.
2. **No opening dates** were supplied for Fifth Settlement or Sheikh Zayed, so none
   are stated. Both pages say the date will be announced.
3. **Dr Alyaa's surname** appears as both "أبو طالب" and "سعيد" in older clinic
   material. The doctor artwork says Abu Taleb, so that is used.
4. **No public email address** was supplied, so none is published.
5. **Reception hours** were derived from the doctors' stated clinic days. The clinic's
   own reception hours have not been supplied.
6. Sample doctors carry obviously-placeholder names and a visible "مثال توضيحي"
   ribbon, per the client's instruction to show a full card shape.
7. The legal pages are written to be accurate, not final. They need a lawyer.

## 9b. Imagery — what is real and what is not

This matters more on a clinic site than on most, so it is stated plainly.

**Real photographs**
- The three doctor portraits, cropped from the clinic's own "Meet Our Specialist"
  artwork. Every credential beside them is transcribed verbatim from the same files.
- Four photographs of the Maadi branch, supplied by the clinic. They are phone
  snapshots; they have been exposure-lifted, warm-graded and sharpened as far as they
  will go. They appear on the branch page and in the home page's editorial block.
- The logo.

**Generated brand imagery** — registered under `media` in `content/site.json` with
`illustrative: true`, and listed in `CONTENT-REQUIREMENTS.xlsx`:
- The home hero, and the specialty page frames.

Three rules were applied to the generated set, and should be kept:

1. **No people, ever.** Not a doctor, not a patient, not a hand. A generated person on
   a medical site reads as a claim about who works there or who was treated. Every
   frame is a room, an object or a texture.
2. **No text or logos in-frame**, so nothing can be mistaken for signage or a document.
3. **Decorative alt text.** The hero carries `alt=""` and no caption claims it is the
   clinic. It is atmosphere, not a record of the premises.

Even so, a visitor may reasonably assume the hero *is* the reception. **Commissioning
real photography of the Maadi branch is the single highest-value thing the clinic can
do for this site**, and it is the first item in the image list of the requirements
sheet. Until then the generated frame is an honest compromise: it conveys the brand
without asserting a false fact.

## 10. What is still missing from the clinic

Every gap is listed with its exact location in `CONTENT-REQUIREMENTS.xlsx` and is
surfaced on the dashboard's Overview page. The large ones:

- Real photographs of the Maadi branch (the four supplied are phone snapshots, graded
  as far as they will go)
- Portraits and credentials for the four unstaffed specialties
- Addresses, dates and photographs for the two future branches
- Written patient consent for before/after images and for WhatsApp testimonials
- An SVG version of the wordmark
- A public email address

## 11. Verification log

| Date | Check | Result |
|---|---|---|
| 2026-09-05 | `node build/build.mjs` | **213 pages** in ~5.5s, clean |
| 2026-09-05 | `node tools/validate.mjs` | **0 errors, 0 warnings** across all 213 |
| 2026-09-05 | Mobile 390 / 430 / 768 / 1280 (AR and EN) | layout holds; drawer, sticky tab bar and hero all correct |
| 2026-09-05 | Dashboard round trip — `GET` → `PUT` → backup → rebuild | works; 213 pages regenerated, backup written |
| 2026-09-05 | Calorie calculator maths | Mifflin–St Jeor, TDEE, capped deficit and macros all verified by hand |
| 2026-09-05 | Arabic voice — feminine → masculine address | 5 passes, ~550 replacements; **0 feminine second-person forms remain** in rendered HTML |
| 2026-09-05 | Google Business listing | rating re-verified: **5.0 from 138** (was 137); review topics captured |

### Scale

| | |
|---|---|
| Pages | **213** (106 per language + the language gate) |
| Arabic words in page bodies | ~52,500 (so roughly 105,000 across both languages) |
| Specialties | 8, each with tabs, treatments and FAQs |
| Knowledge Centre | 42 entries — 12 articles, 6 scientific updates, 10 Q&A, 14 daily tips |
| Health tools | 6 working calculators and trackers |
| Doctors | 8 profiles (4 real, 4 clearly-flagged samples) |
| Median page length | 376 Arabic words; the longest articles run 1,100+ |
