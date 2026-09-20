# Whole-site publishing completion tracker

## Binding acceptance standard

Each canonical article or scientific update must preserve its original date, use a real `updatedAt` when revised, contain rich aligned Arabic and English, use authoritative sources, make every visible numbered citation an in-page link to the matching source, include natural contextual internal links, and pass rebuild, validation, audit, Arabic voice, deployment, and public-page verification.

## Current evidence — 18 September 2026

`node tools/audit-article-standards.mjs` reports 180 published article pages and 145 below the long-form standard. This means the whole-site goal is **not complete**. The count is an editorial queue, not proof that a short-format tip must be inflated without a useful patient intent.

## Completed, publicly verified long-form releases

- Gallstones on ultrasound: symptoms, assessment and surgery decisions
- Low ferritin with a normal CBC
- Earlier verified releases recorded in Git history: normal ultrasound, fatty-liver fibrosis, hypothyroidism and weight, kidney stones, diabetes review, blood pressure, ultrasound safety, H. pylori/reflux/IBS, prediabetes medicine, and food intolerance versus allergy.

## Proven defect: a 20-article generic template batch (2026-09-20)

While starting `h-pylori-in-children-symptoms-tests`, found that `content/articles-longform-2026-09-12.json` contains a batch of exactly 20 articles sharing one 21-section generic skeleton (headings like "How to judge a claim online", "A note on online information", "Plan for review, not perfection" appear verbatim in all 20), each with **exactly 1 source** and near-identical word counts (~1,390–1,420). Prose is real (not Lorem-ipsum) and topically adapted, but is templated advice-about-seeking-advice rather than topic-specific clinical content, and is far below the 10-source standard.

Affected slugs: `fat-dissolving-injections-side-effects-safety`, `inbody-test-first-visit-guide`, `ibs-symptoms-women-assessment-guide`, `ibs-symptoms-men-assessment-guide`, `severe-ibs-symptoms-red-flags`, `fatty-liver-treatment-and-follow-up`, `h-pylori-symptoms-and-testing-pathway`, `h-pylori-children-when-testing-considered`, `insulin-resistance-adults-symptoms-testing`, `insulin-resistance-children-family-assessment`, `dark-neck-skin-children-assessment`, `acne-oily-skin-gentle-routine`, `acne-in-teen-girls-assessment`, `cellulite-exercise-realistic-expectations`, `cellulite-home-care-and-safety`, `gallbladder-surgery-operation-day-guide`, `abdominal-wall-hernia-symptoms-guide`, `sleeve-gastrectomy-operation-day-recovery`, `therapeutic-nutrition-first-visit-guide`, `body-fat-percentage-context-men-women`.

One of these, `h-pylori-children-when-testing-considered`, overlaps in intent with the locked next URL `h-pylori-in-children-symptoms-tests` (both are pediatric H. pylori testing-decision pages). Per Search Console, the target URL already owns the symptom-phrased query `اعراض الجرثومة عند الاطفال` (position 52, no attribution for the sibling), so this round's rewrite is scoped to **symptoms and what a parent notices**, leaving `h-pylori-children-when-testing-considered` to own **the testing-decision detail**, with a link between them — not a consolidation or redirect, which is outside what this handoff authorises. **Flagged to the user; whether to rewrite or consolidate the other 19 batch articles is their call, not queued automatically.**

## Next Arabic-first clinical queue

1. `h-pylori-in-children-symptoms-tests` — Arabic query evidence: `اعراض الجرثومة عند الاطفال`; child-specific testing decision, safety signs, and follow-up.
2. `fatty-liver-ultrasound` — Arabic query evidence: `هل السونار يكشف دهون الكبد` and `شكل دهون الكبد في السونار`.
3. `dark-neck-acanthosis-insulin-resistance` — Arabic query evidence: `اسمرار الرقبة والانسولين`.
4. Internal-medicine, gastroenterology and ultrasound pages with fewer than ten sources or without linked citations, selected by Search Console page/query evidence before cosmetic updates.

## 20 September 2026 — silent-gallstones-usually-need-no-treatment

Completed the locked next URL from the Codex handoff (`content/google search console data/goal.txt`):

- URL/slug: `silent-gallstones-usually-need-no-treatment` (type: update). Canonical EN/AR preserved; original `date` 2026-08-17 preserved; `updatedAt` 2026-09-20 (genuine revision).
- Distinct intent from `gallstones-symptoms-and-surgery` (which owns "I have pain, is it my gallbladder"): this update owns the incidental/asymptomatic-finding reader — natural history, why prophylactic cholecystectomy is not routine, and named patient-specific exceptions (large solitary stone, porcelain gallbladder, growing/large polyp, haemolytic disease, immunosuppression/transplant candidacy).
- Kept as a dedicated replacement file, not an edit to `content/articles.json` in place: that file is already 100% dirty from a prior line-ending (LF→CRLF) drift unrelated to content, so any in-place edit would be inseparable from 14k+ unrelated diff lines. Registered `content/articles-silent-gallstones-rewrite-2026-09-20.json` in all three required locations: `build/lib/util.mjs` (loader, base-slug exclusion, spread), `tools/build_seo_content_plan.py` (`ARTICLE_FILES`), `tools/snapshot-content.mjs` (`PUBLIC`).
- 8 sections, 4 FAQ items, 10 verified real sources (NICE CG188; Egyptian Health Council gallstone guidance; AAFP 2024 review; two PMC reviews on asymptomatic gallstone thresholds/exceptions — Sasmal 2025, Behari 2011; PMC cholecystectomy-for-asymptomatic review — Lee 2022; NIDDK; Mayo Clinic; NHS; PMC Gutt 2020). All 10 verified live via a real browser (NIDDK and Mayo Clinic block plain `curl`/bot user agents with 000/403 — false negatives; confirmed genuine with Chrome). Final EN body prose: ~1,360 words (~1,630 including headings/FAQ/excerpt), after the user asked for 1,300–1,500+ and no filler — the added material is genuinely new sourced content (Cochrane review finding, bile-duct-injury rate context, estrogen-medicine risk factor, cardiac-vs-renal transplant nuance), not padding. Every `[n]`/`[n, m]` in body and FAQ text confirmed as a clickable `citation-ref` anchor in the rebuilt and live HTML, all 10 numbered sources covered — bare brackets only remain inside non-visible JSON-LD, which is expected.
- 5 explicit internal links (ultrasound, laparoscopic gallbladder removal, typical biliary pain → gallstones-symptoms-and-surgery, pregnancy, recovery after surgery), confirmed rendered in both languages. Caught and fixed 3 that silently failed to render on first build because the renderer requires the link `label` to be an exact substring already present in that paragraph's text (`build/pages/articles.mjs` `sectionParas`, line ~309) — worth remembering for every future rewrite in this file.
- Verified via Chrome: Search Console URL Inspection for both live URLs still shows "URL is on Google" / indexed / HTTPS / 1 breadcrumb / 1 review snippet (unchanged from the prior evidence in the handoff); no "Request indexing" or "Test live URL" was clicked. Ran an Arabic-first SERP check ("حصوة المرارة بدون اعراض هل تحتاج علاج") — first-page results are shallow Egyptian clinic pages plus Mayo Clinic; none covered the specific patient-exception framework, which is this rewrite's differentiator.
- Gates: `node build/build.mjs` (490 pages), `node tools/validate.mjs` (0 errors, 0 warnings), `node tools/audit.mjs` (80 findings, 0 blocking — the 2 new non-blocking em-dash warnings come from source-label punctuation matching the sitewide convention already used in `gallstones-symptoms-and-surgery`), `python tools/check_voice.py` (PASS). Python runs natively here; no Codex sandbox needed for this repo.
- Also added, at the user's explicit instruction: a sitewide, renderer-level translation notice on every English article page (`build/pages/articles.mjs`, `COPY.translationNotice`, guarded to `locale === "en"`). First version said the translation "has been checked against the Arabic original for medical accuracy" — a verification claim that was only true for this one article, not the other ~176 EN pages it also rendered on. Fixed (advisor catch) to a plain, unconditionally true provenance line: "The Arabic version of this article is the original; this English page is a translation of it." Does not name a doctor or claim a specific credential, since author/reviewer bylines here are flagged `PROVISIONAL` pending clinic confirmation. Renders on 177 of 194 EN article-detail pages (the other ~17 EN URLs are hub/list/category pages that don't use the article-detail template). If the user wants a stronger "checked by our doctors" claim, that should be a per-article field set only where genuinely true, not this sitewide default.
- Deployment: pushed to `main` in two commits (`460981e` initial rewrite, `d67379e` follow-up fixing the translation-notice wording and expanding word count per user feedback), GitHub Actions rebuilt and deployed both times. Final live verification (`curl`, post-`d67379e`): HTTP 200 on both EN/AR; canonical/hreflang (ar/en/x-default) correct; `datePublished` 2026-08-17 and `dateModified` 2026-09-20 both present in JSON-LD; corrected translation notice present on the EN page only; all 10 citation source anchors covered with no broken/cross-article targets; all 5 editorial internal links plus the sitewide auto-linker's extras render correctly. `site/` was left unstaged/uncommitted locally both times — CI rebuilds it from source on every push, so the local generated output never needed to be committed.
- No Search Console indexing request submitted for this or any URL.
- Files changed: `content/articles-silent-gallstones-rewrite-2026-09-20.json` (new), `build/lib/util.mjs`, `build/pages/articles.mjs`, `tools/build_seo_content_plan.py`, `tools/snapshot-content.mjs`, this tracker.

## 20 September 2026 — h-pylori-in-children-symptoms-tests

Second locked URL from the whole-site queue.

- URL/slug: `h-pylori-in-children-symptoms-tests` (type: article). Canonical EN/AR preserved; original `date` 2026-09-11 preserved; `updatedAt` 2026-09-20.
- **Found and logged a pre-existing defect before writing:** `h-pylori-children-when-testing-considered` (in the 20-article generic-template batch, see above) overlaps in intent. Resolved per advisor guidance by splitting intent along the GSC-confirmed query: this URL owns symptom recognition (`اعراض الجرثومة عند الاطفال` already lands here); the sibling keeps the testing-decision detail. Linked between them rather than merging/redirecting — that decision is the user's, not mine.
- Also fixed genuine mojibake in the prior version's English text (`One symptom:or an online search result:cannot confirm` — colons where em-dashes belonged); isolated to this one slug in `articles.json`, not a site-wide corruption (checked).
- 8 sections, 4 FAQ, 8 real sources verified in Chrome (ESPGHAN/NASPGHAN 2024 joint guideline, Egyptian Health Council pediatric H. pylori guideline, AAP/HealthyChildren.org, PMC review — Seo 2018, Nature Reviews Disease Primers — Thapar 2020 on paediatric functional abdominal pain, NCI H. pylori/cancer fact sheet, StatPearls, ACG patient infographic). EN body prose ~1,294 words (~1,600 including headings/FAQ/excerpt) — meets the 1,300+/rich-content standard.
- 5 editorial internal links (functional pattern → recurrent-tummy-aches-in-children; testing decision → h-pylori-children-when-testing-considered; urgent assessment → child-vomiting-and-dehydration-warning-signs, plus 2 auto-linker additions), all confirmed rendering in both languages. All 8 numbered sources have at least one inline citation anchor (caught and fixed one unused source before shipping).
- Registered in all three required locations (`build/lib/util.mjs`, `tools/build_seo_content_plan.py`, `tools/snapshot-content.mjs`).
- Gates: build (490 pages), validate (0/0), audit (82 findings, 0 blocking — the +2 non-blocking em-dash warnings match the sitewide source-label convention), Arabic voice (PASS).
- Deployment and live verification: pushed to `main` (commit `3853d1c`), GitHub Actions rebuilt and deployed. Live-verified by `curl`: HTTP 200 both locales; canonical/hreflang correct; `datePublished` 2026-09-11 and `dateModified` 2026-09-20 both present; translation notice present on the EN page; all 8 citation source anchors covered; all 5 editorial internal links plus auto-linker extras render correctly.
- No Search Console indexing request submitted.

## 20 September 2026 — fatty-liver-ultrasound

Third locked URL from the whole-site queue. **Note for future sessions:** before drafting a new rewrite file for any slug, check whether `build/lib/util.mjs` already has an exclusion + replacement registered for it — this one already had a substantial uncommitted rewrite (`content/articles-fatty-liver-rewrite-2026-09-14.json`, 18 sections, 10 sources, already at ~1,400 EN words) sitting locally from a prior, never-committed session. I nearly created a duplicate file and a duplicate loader registration before catching this; deleted the duplicate and worked on the existing file instead.

- Already met the long-form bar (18 sections, 3 FAQ, 10 sources, ~1,400 EN words, updatedAt already 2026-09-18) before I touched it. My job was verification, not rewriting.
- **Verified all 10 sources in Chrome and found 2 broken/wrong citations**, both fixed: (1) the EASL–EASD–EASO citation pointed to `journal-of-hepatology.eu/article/S0168-8278(24)00129-2/fulltext`, which returns "Article not found" — replaced with the verified working `easl.eu` guideline page; (2) the ACR "Chronic Liver Disease appropriateness criteria" citation pointed to ACR document id `3158166`, which is actually a breast-cancer-screening-density document, completely unrelated — replaced with the correct document id `3098416` (verified: "Chronic Liver Disease", covers fibrosis staging and HCC surveillance). Also found and fixed one orphaned source (ACG abnormal-liver-chemistries guideline, source 7) that had no inline citation anywhere in the body — added it to the blood-tests section where it belongs.
- `updatedAt` bumped to 2026-09-20 for this genuine correction (was 2026-09-18).
- Gates: build (490 pages), validate (0/0), audit (82 findings, 0 blocking), Arabic voice (PASS). All 10 citation source anchors now covered in the rebuilt HTML.
- Deployment and live verification: pushed to `main` (commit `96db808`), deployed, and live-verified: HTTP 200 both locales, canonical/hreflang correct, `dateModified` 2026-09-20, both fixed source URLs (`easl.eu`, ACR doc `3098416`) confirmed present and correct on the live page, all 10 citation anchors resolve.
- No Search Console indexing request submitted.
- Files changed: `content/articles-fatty-liver-rewrite-2026-09-14.json` only (already registered in all three required locations from the prior session).

## 20 September 2026 — dark-neck-acanthosis-insulin-resistance

Fourth locked URL. Already fully long-form and already committed/live before this session (18 sections, 3 FAQ, 10 sources, ~1,355 EN words, date 2026-09-07). Audit-only, per the same pattern as fatty-liver-ultrasound.

- Verified all 10 sources live in Chrome (Mayo Clinic, DermNet, AAD, Australasian College of Dermatologists, NHS, NIDDK insulin resistance, NICHD PCOS, ACOG PCOS, ADA diagnosis, StatPearls). All real and on-topic — no dead links this time.
- Found 2 smaller defects: (1) source 7 was labelled "NIDDK: PCOS" but its URL is nichd.nih.gov — a different NIH institute; corrected the label to "NICHD: PCOS" rather than changing the URL, since NICHD is the right, real, relevant source. (2) source 10 (StatPearls) had no inline citation anywhere in 18 sections; added it to the opening section's citation set.
- `updatedAt` bumped to 2026-09-20 for the genuine correction.
- Gates: build (490 pages), validate (0/0), audit (82 findings, 0 blocking), Arabic voice (PASS). All 10 citation anchors now covered.
- Deployment and live verification: pending — will follow immediately.
- No Search Console indexing request submitted.
- Files changed: `content/articles-dark-neck-rewrite-2026-09-14.json` only (already registered in all three required locations).

## Required release evidence per URL

- Arabic/Egyptian Arabic intent record and current Search Console evidence.
- Ten authoritative sources and 1,200+ English words where the intent requires a long-form rewrite.
- Generated Arabic and English HTML: no bare visible numbered citation brackets; all anchors resolve; publication/revision history is present.
- `node build/build.mjs`, `node tools/validate.mjs`, `node tools/audit.mjs`, and `python tools/check_voice.py` pass.
- Commit, successful GitHub Pages deployment, and live HTTP/page-content verification.
- No Search Console indexing request unless the user gives fresh permission for that exact URL.
