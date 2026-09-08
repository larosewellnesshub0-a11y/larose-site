# AGENTS.md — operating manual

For whoever works on this project next, human or agent. Read this before
changing anything. `PROJECT.md` explains *what* was built and why; this file
explains *how to work on it* without breaking it.

---

## 1. Golden rules

1. **Never invent a medical fact, a price, a doctor, a credential, an address,
   a statistic or a citation.** Everything factual on this site is traceable to
   the clinic's own materials. If a fact is missing, leave the field empty and
   add a `_todo` — that is why the empty states are designed. A fabricated
   credential on a clinic website is a real-world harm, not a content gap.
2. **No prices on any public page.** This is an explicit client decision. Real
   figures live in the dashboard behind `showPrice: false`. `tools/validate.mjs`
   fails the build if a price pattern reaches the output — do not weaken that check.
3. **Edit `content/*.json`, not `site/*.html`.** The HTML is generated. Anything
   you hand-edit in `site/ar/…` is destroyed on the next build.
4. **Arabic is addressed in the masculine/neutral second person** — `احجز`, not
   `احجزي`. The client asked for this explicitly. See §6.
5. **Both languages, always.** Every page exists at `/ar/…` and `/en/…`. The
   validator fails if a counterpart is missing. English is a real translation,
   not a transliteration.
6. **Run the validator before you call anything done.** Zero errors, or it is
   not done.

---

## 2. Run, build, verify

```bash
node build/build.mjs        # regenerate every page       (~6s, 213 pages)
node server/serve.mjs       # preview  http://localhost:4173
node tools/validate.mjs     # must print "0 errors"
python tools/build_content_sheet.py   # regenerate CONTENT-REQUIREMENTS.xlsx
```

The published site needs none of this. `site/` is self-contained — open
`site/index.html` directly, or upload that one folder to any host.

**Mobile:** `http://localhost:4173/_viewport.html?p=/ar/index.html` renders the
page at 390 / 430 / 768 / 1280 side by side. It is a dev tool; the `_` prefix
keeps it out of the validator and the sitemap. Delete it before handover if you
prefer a clean folder.

---

## 3. Where things live

| I want to change… | Edit |
|---|---|
| clinic name, phone, nav, footer, legal, UI strings | `content/site.json` |
| a specialty's copy, conditions, treatments, FAQ, SEO | `content/specialties.json` |
| a doctor | `content/doctors.json` |
| a branch | `content/branches.json` |
| articles, updates, Q&A, daily tips | `content/articles.json` |
| reviews and the moderation queue | `content/reviews.json` |
| the recipe book / online programme | `content/digital.json` |
| how a page is laid out | `build/pages/<section>.mjs` |
| something shared by every page (header, footer, `<head>`) | `build/lib/shell.mjs` |
| a reusable block (card, hero, FAQ, CTA) | `build/lib/components.mjs` |
| colours, type scale, spacing, shadows | `site/assets/css/tokens.css` |
| a component's appearance | `site/assets/css/components.css` |
| header/nav/hero/footer appearance | `site/assets/css/layout.css` |
| site behaviour (nav, tabs, forms, reveal) | `site/assets/js/site.js` |
| calculator and tracker logic | `site/assets/js/tools.js` |

---

## 4. Adding a page

1. Add or extend a module in `build/pages/`. It exports **one** function:
   ```js
   export function pages({ c, locale }) {
     return [{ path: `${locale}/section/thing.html`, html: page({ … }) }];
   }
   ```
2. Register the file in `PAGE_MODULES` in `build/build.mjs` if it is new.
3. **`depth` is the number of directories below the locale root.**
   `ar/index.html` → 0. `ar/tools/bmi.html` → 1. Get this wrong and every link
   and asset on the page 404s. The validator catches it.
4. Build, then validate.

Never hand-write `../`. Use `link(depth, href)` and `asset(depth, path)`.

---

## 5. The design system, in one paragraph

Warm paper ground, never pure white. Olive carries the structure, champagne is
the metal, rose is an accent used sparingly. The **arch** is the brand's
signature shape — lifted from the clinic's own doctor artwork — and frames
portraits, hero imagery and cards. Gloss is physical, not gradient: a specular
sweep across a curve, champagne hairlines, warm shadows and a fine paper grain.
**Liquid Glass belongs to the functional layer only** — sticky header, dropdown
panels, the floating finder, specialty tab bars, the mobile drawer, the FABs —
plus one deliberate exception the HIG allows: the tool result panel, which is a
transient element that appears in response to the reader's input. Content cards
stay opaque. Do not spread glass into the content layer; that is exactly the
"AI slop" look the client asked to avoid.

Every glass surface has two fallbacks that must be preserved:
`@supports not (backdrop-filter)` and `@media (prefers-reduced-transparency)`.
Reduced transparency is an accessibility setting, not a preference.

---

## 6. The Arabic voice

Egyptian Arabic, warm, addressed to the patient in the **masculine/neutral**
second person. Not Modern Standard officialese. No emoji. Latin technical terms
(`InBody`, `RF`, `GLP-1`) are wrapped in `<span class="lat">` so bidi ordering
and font selection stay correct — `latin()` in `util.mjs` does this.

The site was converted from feminine to masculine address in five passes
(`tools/degender.py` plus follow-ups). If you add Arabic copy, write it
masculine from the start. Two traps if you ever re-run a sweep:

- A blanket regex on a trailing **ya** destroys `اللي`, `المعادي`, `الجسمي`,
  `دلوقتي` and dozens more. Use an explicit include-list.
- `محتاجة` and `ماشية` are usually **correct** — they agree with feminine nouns
  (`حالتك محتاجة`, `مجموعة ماشية`). Only change them where they address the
  reader. Same for `الدكتورة` and `أخصائية`, which describe the clinic's female
  doctors and must never be masculinised.

**The checker has one recurring blind spot, now fixed twice.** Its lookbehind
rejects any match preceded by an Arabic letter, and the proclitics و ف ب ل ك are
Arabic letters — so `وكرري`, `وارفعي` and `واسمحي` were invisible while `كرري`
was caught. The same bug had already been found once for the negative imperative
and patched one word at a time (`وقولي`, `وركزي`, `وحددي` are all on the list for
that reason). `tools/check_voice.py` now allows an optional proclitic and matches
the feminine present-plus-object-pronoun (`بتستخدميه`) as a shape. If you add a
rule to that file, test it against a word carrying a waw.

Numbers: prose uses Arabic-Indic (`١٨ سنة`), but the **health tools use Latin
digits in both languages**, deliberately — the input fields accept Latin
numerals, and a mixed readout beside a Latin input reads as two different
numbers.

---

## 6b. Imagery rules

- **People are allowed in specialty images since 2026-09-06** — the client reversed
  the original objects-only rule, because a page of rooms and instruments did not
  read as a clinic. Two limits survive it: a generated face must never appear on a
  page that names a real doctor, or it is read as a photograph of that doctor; and
  no frame may show a treatment the clinic does not offer.
- **Never show a retired device.** Cavitation, radiofrequency and cryolipolysis were
  withdrawn on 2026-09-06. The old body-contouring frame showed an RF handpiece on a
  patient's abdomen and was moved to `_project/retired-images/`. No handpieces, no
  cooling applicators, no device consoles.
- Any generated frame is registered under `media` in `content/site.json` with
  `illustrative: true` and a `_todo`, so the dashboard and the requirements sheet both
  surface it as something to replace.
- Generated frames carry `alt=""` and never a caption asserting they show the clinic.
- Real photographs of the premises belong on the branch page, where they are
  unambiguous.
- The pipeline is `tools/collect_images.py` (watches `~/Downloads`, crops, grades and
  files into `site/assets/img/`) plus an in-page runner injected into a ChatGPT tab.
  `imageIfExists()` in `util.mjs` means the build picks a frame up the moment it lands
  — no content edit needed.
- `~/Downloads` also holds ~94 `lr_*.png` from the client's earlier recipe-book and
  reels jobs. The collector matches only ids it knows about. Do not widen that glob.
- The prompts in `tools/image_runner.js` are the source of truth for a batch. A
  previous session edited the runner **in the page** and not on disk, so the file
  described a batch that had not been produced for hours. Change the file, then
  inject it.

## 6c. Sharing and Ask-AI

Every Knowledge Centre entry ends with a share row and an "Ask AI about this
article" row. All of it is driven by `sharing` in `content/site.json`, which
means the clinic turns a network off, rewrites a label or rewrites the question
from the dashboard's Settings tab, and every article - including ones added
years from now - picks the change up on the next build. Nothing is per-article
except the title and the URL.

- **The assistants are not equivalent.** ChatGPT and Claude accept the question
  in the query string (`?q=`) and open with it already typed. Gemini has no
  documented equivalent, so its button copies the question to the clipboard and
  opens the app. `ASSISTANT_TARGETS` in `components.mjs` records which is which
  with a `prefills` flag - if Gemini ever ships a parameter, that is the one
  line to change.
- **The question is deliberately framed** as "explain this and tell me what to
  ask my doctor". A button on a clinic's site that invites a chatbot to assess
  symptoms would be a different and much worse product, and the note under the
  row says plainly that these answers are not a diagnosis.
- The copy-link button ships `hidden` and is revealed by `site.js`. A control
  whose entire job is the clipboard is worse than absent when no script runs.
- The assistants share one neutral `ai` glyph rather than their real logos,
  which are trademarks. The button carries the name in text instead.

---

## 7. Working with the client's material

- `website data/doctors designs/` — the "Meet Our Specialist" artwork. Three real
  doctors' names, titles, credentials, days and hours were transcribed **verbatim**
  from these. Portraits were cropped from them programmatically.
- `website data/sevices/شيت الاسعار والعروض (2).xlsx` — the price and offers
  sheet. It is also the best source for the clinic's *voice* and for what each
  service actually includes. Note it was a **summer promotion**; confirm before
  treating any figure as current.
- `Market Re/` — competitor research for Cairo clinics.
- The Google Business listing is the source for the rating (5.0 from 138,
  verified 2026-09-05) and the review topics.

---

## 8. Known traps

- **Never test a write endpoint against a real content file.** A `PUT` of a test
  payload to `/api/content/digital.json` replaced the live products with junk; the
  automatic backup was the only reason it cost nothing. Test with a payload that is
  *guaranteed* to fail validation (add `showPrice: true`) and read the returned
  `validationErrors` — the write never happens, and you still learn what you needed.
- **Git Bash mangles Arabic in a curl body.** A payload typed inline arrives in the
  wrong encoding and silently does not match any Arabic pattern, which looks exactly
  like a broken check. Write the JSON from Python as UTF-8 and send it with
  `--data-binary @file`.
- **Codex cannot execute anything here.** Its sandbox denies the user-profile
  Python install. It can *write* a script; you must *run* it.
- **Chrome cannot open `file://` URLs** through the automation extension. Use the
  local server for any visual check.
- The renderer occasionally freezes on a tab after heavy JS injection. Open a new
  tab rather than fighting it. **Never close or resize the user's Chrome window.**
- A negative or zero `z-index` on `.hero__media` paints the photograph *behind*
  the hero's own background colour. It is a positive layer for a reason.
- Mixing a logical offset (`inset-inline-start`) with a physical transform
  (`translateX`) makes dropdowns drift off their trigger under RTL. Centre
  physically in both directions and nudge with JS.

---

## 8b. The dashboard

Ten sections plus **Analytics**. Two things are worth knowing before changing it:

- **Settings renders every field of `site.json` and `pages.json` generically**
  through `renderObjectFields`, so anything added to those files is editable the
  moment it lands - no dashboard work needed. A 2026-09-06 audit walked every key
  path in all eight content files and found **zero unreachable paths**; the only
  read-only ones are the `showPrice` guards, which are deliberate.
  Full evidence in `_project/AUDIT-DASHBOARD-COVERAGE.md`.
- Add a `FIELD_LABELS` entry for any new key, or a non-technical editor sees the
  raw JSON key name. The label should say what the field does on the live site.
- The Analytics charts are hand-drawn inline SVG with no library, because the
  dashboard has zero dependencies and must keep it that way. `analytics.js` is
  loaded before `dashboard.js` and exposes `DashboardAnalytics`.

---

## 9. Open task queue

Ordered by what unblocks the most. Full detail in `CONTENT-REQUIREMENTS.xlsx`
and on the dashboard Overview, which lists every `_todo` in the content files.

1. **Dr Thoraya El-Alfy's profile.** She is the most-mentioned doctor in the
   clinic's Google reviews (9 of 138) and currently has the emptiest profile on
   the site — title, qualifications, experience, days, hours and a portrait are
   all missing. Confirm the English spelling too.
2. **Article cover images are only half wired.** The numbered covers the runner
   produces (`articles/<category>-1.webp` …) are on disk but no content entry
   points at them yet; every article still carries `imagePlaceholder: true`. The
   three specialty frames retired or added on 2026-09-06 are done.
2. Replace the four sample doctor cards, or set those specialties
   `published: false`.
3. Addresses, opening dates and photographs for Fifth Settlement and Sheikh Zayed.
4. Transcribe the Google reviews into `content/reviews.json` via the dashboard's
   paste-and-parse box. The aggregate is already real; the individual texts are not
   yet in.
5. Written patient consent, then real before/after images.
6. The clinic's actual reception hours. Google lists a 20:00 close; the full
   weekly schedule was not readable.
7. Professional photography of the Maadi branch. The four supplied are phone
   snapshots, graded as far as they will go.
8. An SVG wordmark, and a public email address.
9. Legal review of `content` → the three `legal/` pages.
10. Licence Graphik Arabic, or accept the IBM Plex Sans Arabic stand-in. Swapping
    it is a one-line change in `tokens.css`.

---

## 10. Added 2026-09-08 — tracking, publishing, hosted dashboard, imagery

- **Tracking IDs** live in `content/site.json → integrations.analytics` (GA4, Clarity,
  Meta, TikTok, Search Console / Bing verification). Empty string = tag not emitted.
  `trackingHead(c)` in `build/lib/shell.mjs` is the single emitter. `site/assets/js/track.js`
  fires the events listed in the dashboard's *Events & pixels* tab and captures UTM /
  click ids into the booking payload and into WhatsApp links (`[LR-source-campaign]`).
- **Forms → Google Sheet**: `integrations/apps-script/Code.gs` (redeploy from the clinic
  account after edits; `READ_TOKEN` in Script Properties gates the dashboard's lead reads).
- **RecipeGuide**: `/RecipeGuide/` is the recipe-book landing page; the free 60-recipe
  guide is `/RecipeGuide/free/`. Both are single bilingual pages from `build/pages/recipe-guide.mjs`.
- **Branch cards** use `cardImage` in `content/branches.json` (branded aerial renders in
  `site/assets/img/clinic/branch-*.webp`). The Maadi gallery photos were restyled with AI;
  originals are in `_project/img-backups/maadi-originals-20260908/`.
- **Private data**: `content/_private/` (pricing, campaigns) is git-ignored; the repo is public.
- **Publishing**: the dashboard's *Publish* button runs build → validate → commit → push; GitHub
  Actions (`.github/workflows/deploy.yml`) deploys `site/` + `site/dashboard/` to GitHub Pages.
  On the live domain the dashboard runs in read-only *hosted mode* from `dashboard/content/index.json`.
- **Article covers**: `_project/article-covers-queue.json` + the in-page runner (`_project/article_runner.js`,
  v2 uses a MutationObserver because background tabs throttle timers) and `tools/collect_article_covers.py`.
  Every article/update now has its own cover; Q&A prompts are queued in `_project/qa-covers-queue.json`.
- **Launch steps** (accounts, DNS, Search Console, GA4, Clarity): `_project/LAUNCH-GUIDE.md`.
