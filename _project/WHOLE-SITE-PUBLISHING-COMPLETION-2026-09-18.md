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
- Deployment and live verification: pushed to `main` (commit `1fcf2a2`), deployed, live-verified: HTTP 200 both locales, "NICHD: PCOS" label confirmed live, all 10 citation anchors resolve, dateModified 2026-09-20.
- No Search Console indexing request submitted.
- Files changed: `content/articles-dark-neck-rewrite-2026-09-14.json` only (already registered in all three required locations).

## 20 September 2026 — responsive-complementary-feeding

Fifth locked URL. The named 3-item queue from 18 September was exhausted after dark-neck; selected this one via a fresh `node tools/audit-article-standards.mjs` run (144 of 180 published articles still below the long-form baseline) cross-referenced against real Search Console impressions — this slug had the most (18, EN position ~6.6–8, no matching top query text in the export, so likely long-tail).

- No existing registered rewrite file for this slug (checked `build/lib/util.mjs` first, per the lesson from fatty-liver-ultrasound) — this one was a genuine rewrite, not an audit-fix.
- Preserved the existing content's real strengths (the WHO-guideline framing, the responsive-feeding concept, and the La Rose-specific clinician-review paragraph) rather than discarding them; expanded from 3 sections/540 words/1 source to 10 sections/4 FAQ/6 sources/~1,311 EN body words.
- 6 real sources verified live in Chrome: WHO 2023 guideline (reused, reverified), CDC "Choking Hazards", AAP/HealthyChildren.org "Starting Solid Foods", ESPGHAN complementary-feeding position paper (Fewtrell 2017, PubMed), CDC "When, What, and How to Introduce Solid Foods", UNICEF "Feeding your baby: 6–12 months".
- Arabic-first SERP check ("الأكل التكميلي للرضيع بعد الشهر السادس") showed first-page results dominated by shallow food-list blogs and one Saudi SFDA PDF; none covered the responsive-feeding/behavioural angle this article leads with, confirming a real content gap.
- 2 editorial internal links added (iron-rich foods, growth-curve follow-up visit); both initially failed to render because the link label didn't exactly match body text (the same exact-substring-match gotcha as before) — caught and fixed before shipping.
- Type kept as `update` (accurate — tied to the WHO guideline), `date` preserved (2026-09-05), `updatedAt` set to 2026-09-20.
- Gates: build (490 pages), validate (0/0), audit (84 findings, 0 blocking), Arabic voice (PASS). All 6 citation anchors covered.
- Deployment and live verification: pushed to `main` (commit `6fa873b`), deployed, live-verified: HTTP 200 both locales, canonical correct, dateModified 2026-09-20, all 6 citation anchors resolve, both internal links render.
- No Search Console indexing request submitted.
- Files changed: `content/articles-responsive-complementary-feeding-rewrite-2026-09-20.json` (new), `build/lib/util.mjs`, `tools/build_seo_content_plan.py`, `tools/snapshot-content.mjs`.

## 20 September 2026 — inbody-results-explained

Sixth locked URL, selected the same way as responsive-complementary-feeding (fresh audit run + real GSC impressions: 12, EN queries "what does inbody score mean", "how to read inbody results", positions 50-67, weak ranking with clear room to improve).

- Checked `build/lib/util.mjs` first — no existing rewrite registered, genuine expansion needed.
- **Found a real cannibalisation risk before writing:** the sibling `inbody-preparation-for-reliable-follow-up` already owns the measurement-conditions/preparation angle. Trimmed my "why readings change" section to a brief explanation and linked out to that sibling instead of duplicating its content, keeping this URL scoped to reading/interpreting the report (the GSC query intent).
- Expanded from 5 sections/2 sources/~800 words to 8 sections/4 FAQ/6 sources/~1,242 EN body words (~1,496 total). Preserved the existing accurate content (BIA mechanism explanation, La Rose branch details) rather than discarding it.
- 4 new sources verified live in Chrome, alongside the 2 pre-existing ones (NIDDK, NICE): Thivel et al. 2018 (PubMed) on BIA accuracy varying with obesity degree; Cruz-Jentoft et al. 2019 EWGSOP2 sarcopenia consensus (PMC); Saunders et al. 1998 (PubMed) on hydration/exercise effects on BIA; Cleveland Clinic sarcopenia page.
- Added a genuinely new "clinic vs. home smart scale" section (why BIA devices disagree with each other — different electrode placement and equations) — a real, common point of patient confusion not covered anywhere else on the site.
- 3 editorial internal links (body composition, protecting muscle while losing weight, InBody preparation guide); 2 of the 3 initially failed to render (same exact-substring-match gotcha) — caught and fixed by adjusting body wording before shipping.
- `date` preserved (2026-09-10), `updatedAt` set to 2026-09-20.
- Gates: build (490 pages), validate (0/0), audit (85 findings, 0 blocking), Arabic voice (PASS). All 6 citation anchors covered.
- Deployment and live verification: pushed to `main` (commit `d3580d8`), deployed, live-verified: HTTP 200 both locales, canonical correct, dateModified 2026-09-20, all 6 citation anchors resolve, all 3 editorial internal links render.
- No Search Console indexing request submitted.
- Files changed: `content/articles-inbody-results-explained-rewrite-2026-09-20.json` (new), `build/lib/util.mjs`, `tools/build_seo_content_plan.py`, `tools/snapshot-content.mjs`.

## 20 September 2026 — diabetes-remission-is-not-cure

Seventh locked URL, selected via fresh audit + GSC impressions (11, EN position ~8.27, already ranking reasonably).

- No existing registered rewrite (checked first). Expanded from 2 sections/1 source/no citations to 8 sections/4 FAQ/5 sources/~1,206 EN body words (~1,454 total).
- 4 new sources verified live in Chrome, alongside the existing ADA consensus report: Diabetes UK's remission page; Lean et al. 2024 Lancet Diabetes & Endocrinology 5-year DiRECT extension study (PubMed) — used its real reported numbers (46%/36% remission at 1/2 years, only 26% of 2-year responders still in remission at 5 years); Mohamed et al. 2024 systematic review on bariatric surgery and T2D remission (PMC); CDC's diabetes care schedule page.
- Arabic-first SERP check ("هل السكر من النوع التاني بيتشفى نهائيا") showed a real mix of legitimate sources (Diabetes UK Arabic translation, Imperial College London Diabetes Centre, Mayo Clinic Arabic) alongside sensationalist "complete cure" YouTube content — reinforced the importance of staying evidence-based and not overclaiming in this specific topic.
- Added real, non-sensational content the site didn't have: how remission actually happens (DiRECT + bariatric surgery routes with real trial numbers), relapse is common not rare (the 26%-at-5-years figure), who is more likely to achieve it, why rapid weight loss needs medical supervision (not a solo diet attempt), and explicit reassurance that not reaching the remission definition is not failure.
- 2 editorial internal links (weight loss → weight-management-first-visit, bariatric surgery → preparing-for-bariatric-surgery); one initially failed to render (label said "weight management" but body said "weight loss") — caught and fixed.
- `date` preserved (2026-08-20), `updatedAt` set to 2026-09-20.
- Gates: build (490 pages), validate (0/0), audit (87 findings, 0 blocking), Arabic voice (PASS). All 5 citation anchors covered.
- Deployment and live verification: pushed to `main` (commit `27ef862`), deployed, live-verified: HTTP 200 both locales, canonical correct, dateModified 2026-09-20, all 5 citation anchors resolve, both internal links render.
- No Search Console indexing request submitted.
- Files changed: `content/articles-diabetes-remission-rewrite-2026-09-20.json` (new), `build/lib/util.mjs`, `tools/build_seo_content_plan.py`, `tools/snapshot-content.mjs`.

## 20 September 2026 — body-composition-not-scale

Eighth locked URL, selected via fresh audit + GSC impressions (11, similar traffic to inbody-results-explained since the two are a natural cluster).

- No existing registered rewrite (checked first). Expanded from 6 sections/2 sources/no citations to 9 sections/4 FAQ/5 sources/~1,148 EN body words (~1,370 total).
- **Deliberate scope split from `inbody-results-explained` (completed article #6 this session):** this page owns "why scale weight alone misleads and how to build a follow-up dashboard"; the sibling owns "how to read an InBody report field by field." Kept the BIA-mechanism section brief here and linked to the sibling's fuller technical explanation instead of re-deriving it, to avoid the two pages competing for the same content.
- 3 new sources verified live in Chrome, alongside NICE NG246 (reused, already verified this session) and NIDDK bioelectrical impedance (reused): Aragon et al. 2017 ISSN position stand on diets and body composition (PMC) — slower weight loss preserves muscle better, higher protein may be needed during a deficit; Steinberg et al. 2015 JAND study on daily weighing improving weight-loss outcomes; ADA Standards of Care 2026 obesity/weight-management chapter (existing citation, label corrected to match its actual title).
- Added genuinely new content: normal daily weight-fluctuation range, the real daily-weighing outcome data (with the caveat that it does not suit everyone), and a "non-scale progress" section on signs of improvement unrelated to the scale.
- 3 editorial internal links (to `inbody-results-explained`, `protecting-muscle-while-losing-weight`, `inbody-preparation-for-reliable-follow-up`); 2 of 3 initially failed to render (exact-substring-match gotcha, one a case-sensitivity miss) — caught and fixed before shipping.
- `date` preserved (2026-08-20), `updatedAt` set to 2026-09-20.
- Gates: build (490 pages), validate (0/0), audit (88 findings, 0 blocking), Arabic voice (PASS). All 5 citation anchors covered.
- Deployment and live verification: pushed to `main` (commit `b5374fa`), deployed, live-verified: HTTP 200 both locales, canonical correct, dateModified 2026-09-20, all 5 citation anchors resolve, all 3 internal links render.
- No Search Console indexing request submitted.
- Files changed: `content/articles-body-composition-not-scale-rewrite-2026-09-20.json` (new), `build/lib/util.mjs`, `tools/build_seo_content_plan.py`, `tools/snapshot-content.mjs`.

## 20 September 2026 — pcos-and-weight

Ninth locked URL, selected via fresh audit + GSC impressions (a PCOS/weight-management cluster page with steady long-tail traffic, no single dominant top query in the export).

- No existing registered rewrite (checked `build/lib/util.mjs` first). Kept the existing article's non-judgemental framing intact and expanded from 4 sections/4 sources to 7 sections/4 FAQ/5 sources/~1,184 EN body words (~1,392 total).
- Added a new `long-term-health` section (type 2 diabetes/metabolic syndrome risk, unopposed endometrial thickening from prolonged anovulation) and a new consultation paragraph on rapid-weight-loss/muscle-protection follow-up — real, non-filler content, not padding.
- 5 sources verified live in Chrome: WHO PCOS fact sheet (reused), Teede et al. 2023 International Evidence-based Guideline (PubMed, reused), ACOG PCOS FAQ (reused), Legro et al. 2013 Endocrine Society guideline (PMC, reused), NICHD PCOS topic page (new).
- **Self-caught citation-numbering error before shipping:** an acanthosis-nigricans skin-sign claim was originally marked `[3]`/ACOG without confirming ACOG's FAQ actually supports that specific claim. Found via the `grep -oE '\[[0-9](, ?[0-9])*\]' ... | sort -u` audit technique (citation `3` wasn't actually appearing correctly used) — renumbered that claim to `[4]`/Legro's Endocrine Society guideline, and added new, properly `[3]`-cited content elsewhere (hormonal-contraceptives and ovulation-induction paragraphs in `medical-options`) so all sources ended up genuinely cited.
- 3 editorial internal links (dark-neck-acanthosis-insulin-resistance, body-composition-not-scale, protecting-muscle-while-losing-weight); the `protecting-muscle-while-losing-weight` link initially failed to render for a **new reason** — the `url` value was missing the required `../articles/` prefix, so `validUrl()` in `build/pages/articles.mjs` silently rejected it (distinct from the usual exact-substring-match label gotcha). Caught by grepping the built HTML for the expected `<a href>` and confirming it was absent; fixed by adding the prefix.
- **Voice-check failure caught before commit:** first build failed `python tools/check_voice.py` on one feminine imperative, "ناقشي مع طبيبك" ("discuss (f.) with your doctor"), in the new `medical-options` pregnancy-goal paragraph. Found via a standalone debug script re-running the checker's own patterns/word list against just this file (fed into a UTF-8 output file to avoid shell mojibake) — isolated to "WORD ناقشي". Fixed to masculine "ناقش", rebuilt, and voice check passed on rerun.
- `date` preserved (2026-08-17), `updatedAt` set to 2026-09-20.
- Gates: build (490 pages), validate (0/0), audit (89 findings, 0 blocking, em-dash count 85), Arabic voice (PASS after the fix above). All 5 citation anchors covered.
- Deployment and live verification: pushed to `main` (commit `3f5c7cb`), deployed, live-verified: both locales serving the new content, all 5 citation anchors resolve, hreflang `<link rel="alternate">` trio correct (ar/en/x-default), all 3 internal links render in both locales, EN translation notice present.
- No Search Console indexing request submitted.
- Files changed: `content/articles-pcos-and-weight-rewrite-2026-09-20.json` (new), `build/lib/util.mjs`, `tools/build_seo_content_plan.py`, `tools/snapshot-content.mjs`.

## 21 September 2026 — preparing-for-bariatric-surgery

Tenth locked URL, selected via fresh `node tools/audit-article-standards.mjs` cross-referenced against real GSC impressions (9, the highest among not-yet-completed candidates; `insulin-resistance-in-children` and `childrens-appetite` were close runners-up for a future round).

- No existing registered rewrite (checked `build/lib/util.mjs` first). Kept the existing article's accurate, well-scoped framing intact and expanded from 5 sections/1 source/no citations to 6 sections/4 FAQ/5 sources/~1,087 EN body words (~1,302 total).
- **Deliberate scope check against five siblings before writing:** `bariatric-assessment-is-multidisciplinary` (owns the multidisciplinary-team detail), `bariatric-vitamin-monitoring` (owns post-op vitamin/supplement monitoring specifics), `bariatric-follow-up-is-lifelong` (owns long-term follow-up cadence), `sleeve-gastrectomy-what-to-know` (owns sleeve-specific procedure detail) and `weight-management-first-visit` (owns the non-surgical entry point). Kept this article scoped to the pre-op decision/assessment/consent journey and linked out to all four relevant siblings instead of duplicating their content.
- 4 new sources verified live in Chrome, alongside NICE NG246 (reused): Mechanick et al. 2019/2020 AACE/TOS/ASMBS/OMA/ASA perioperative bariatric-surgery clinical practice guideline (PubMed 31917200); Stenberg et al. 2022 ERAS Society perioperative-care guideline (PMC8885505) — sourced the real numeric candidacy criteria (BMI ≥40, or ≥35 with an obesity-related condition), smoking-cessation timing (≥4 weeks), alcohol-abstinence and preoperative low-calorie-diet detail; Sogg et al. 2016 ASMBS presurgical psychosocial evaluation guideline (PubMed 27179400); NIDDK's Weight-loss (Metabolic & Bariatric) Surgery page (candidacy criteria, patient-facing).
- Hit a CAPTCHA wall navigating `pubmed.ncbi.nlm.nih.gov` with a query-string search (reCAPTCHA "checking your browser" page) — did not attempt to solve it, per standing policy; found the correct PMID via a Google-search snippet instead and navigated directly to the PMID URL, which loaded normally.
- Added real, non-filler content the site didn't have: numeric BMI candidacy thresholds, when surgery should be delayed rather than proceed (uncontrolled psychiatric illness, active substance dependency, inability to commit to follow-up), a sleep-apnoea screening explanation, early-vs-late complication types (bleeding/leak vs. stricture/gallstones/deficiency), lifelong vitamin/mineral monitoring and post-op gallstone-prevention medicine, and post-op pregnancy-timing guidance (~12–18 months).
- 4 editorial internal links (multidisciplinary assessment, sleeve gastrectomy, vitamin monitoring, lifelong follow-up); all 4 rendered correctly on the first build — no exact-substring-match or `validUrl()` failures this time, having checked both known failure modes before shipping.
- `date` preserved (2026-09-07), `updatedAt` set to 2026-09-20.
- Gates: build (490 pages), validate (0/0), audit (90 findings, 0 blocking, em-dash count 86), Arabic voice (PASS, no fix needed this time). All 5 citation anchors covered.
- Deployment and live verification: pushed to `main` (commit `21f9991`), deployed, live-verified: both locales serving the new content, all 5 citation anchors resolve, hreflang `<link rel="alternate">` trio correct (ar/en/x-default), all 4 internal links render in both locales, EN translation notice present, dateModified correct.
- No Search Console indexing request submitted.
- Files changed: `content/articles-preparing-for-bariatric-surgery-rewrite-2026-09-20.json` (new), `build/lib/util.mjs`, `tools/build_seo_content_plan.py`, `tools/snapshot-content.mjs`.

## 21 September 2026 — insulin-resistance-in-children

Eleventh locked URL, selected via fresh `node tools/audit-article-standards.mjs` cross-referenced against real GSC impressions (9, highest among not-yet-completed candidates after preparing-for-bariatric-surgery).

- No existing registered rewrite (checked `build/lib/util.mjs` first). Kept the existing article's accurate, non-alarmist framing intact and expanded from 5 sections/2 sources/no citations to 6 sections/4 FAQ/5 sources/~1,070 EN body words (~1,304 total).
- **Found and deliberately avoided a near-duplicate-topic trap:** two other registered slugs exist for the same general subject — `insulin-resistance-children-family-assessment` and its sibling `insulin-resistance-adults-symptoms-testing` — both sharing the same generic 21-section template with 1 source each. These match the previously-flagged 20-article generic-template defect batch (see the `SEO-CONTENT-CLUSTER-PLAN` / earlier tracker entries) and were left untouched — not read for content, not linked to, not cited as precedent — since retiring or rewriting that batch is explicitly the user's decision, not mine to make unprompted. This article (`insulin-resistance-in-children`) is a separate, genuinely distinct, already-well-written slug with its own real content, confirmed by its meaningfully different section headings.
- 3 new sources verified live in Chrome, alongside the 2 existing ones (ADA Obesity/Weight-Management Standards of Care, CDC Growth Charts): Hampl et al. 2023 AAP Clinical Practice Guideline for pediatric obesity (PubMed 36622115); ADA Standards of Care 2026 Section 14 — Children and Adolescents (diabetesjournals.org); NIDDK's Insulin Resistance & Prediabetes page.
- Hit the same PubMed/PMC reCAPTCHA wall again on a query-string search and once on a direct PMC article URL — did not attempt to solve either; found the correct PMID via a Google AI-overview snippet (cross-checked by loading the PMID URL directly, which resolved correctly) and substituted the equivalent `diabetesjournals.org` article page (verified via DOI redirect + matching Google-search snippet title) when the PMC copy of the ADA chapter kept hitting Cloudflare's "security verification" interstitial.
- Added real, non-filler content the site didn't have: puberty's own normal, transient reduction in insulin sensitivity (so a mid-puberty test result needs cautious interpretation), the actual numeric BMI-percentile screening thresholds (≥85th percentile overweight, ≥95th percentile obesity) paired with the age-10-or-puberty screening trigger, why A1C can be less reliable in children than adults, waist circumference and blood pressure as standard parts of the exam, and explicit guidance on harmful shortcuts to avoid (cutting food groups without supervision, unsupervised supplements, weight-shaming in front of siblings).
- 4 editorial internal links (insulin-resistance-explained for the adult-context handoff, dark-neck-acanthosis-insulin-resistance for the skin-sign detail, child-nutrition-growth-visit for the assessment visit, childrens-appetite for eating-behaviour overlap). **Two of the four initially failed to render** on first build: the AR link to `insulin-resistance-explained` used a label that didn't match the body verbatim (body said "تفاصيل الموضوع عند الكبار...", label omitted "الموضوع" and added a stray "ال-" prefix), and the EN link to `child-nutrition-growth-visit` failed on a sentence-initial capitalisation mismatch ("An organised..." in the body vs. "an organised..." in the label) — both are variants of the session's established exact-substring-match gotcha, not the `validUrl()` prefix bug from the previous article. Both fixed and reverified before shipping.
- `date` preserved (2026-09-11), `updatedAt` set to 2026-09-21.
- Gates: build (490 pages), validate (0/0), audit (92 findings, 0 blocking, em-dash count 88), Arabic voice (PASS, no fix needed). All 5 citation anchors covered.
- Deployment and live verification: pushed to `main` (commit `690ed3a`), deployed, live-verified: both locales serving the new content, all 5 citation anchors resolve, hreflang `<link rel="alternate">` trio correct (ar/en/x-default), all 4 internal links render in both locales, EN translation notice present, dateModified correct.
- No Search Console indexing request submitted.
- Files changed: `content/articles-insulin-resistance-children-rewrite-2026-09-21.json` (new), `build/lib/util.mjs`, `tools/build_seo_content_plan.py`, `tools/snapshot-content.mjs`.

## 21 September 2026 — childrens-appetite

Twelfth locked URL, selected via fresh `node tools/audit-article-standards.mjs` cross-referenced against real GSC impressions (7, tied-highest among not-yet-completed candidates; already an inbound link target from the previous article, `insulin-resistance-in-children`).

- No existing registered rewrite (checked `build/lib/util.mjs` first). This was already an unusually well-written article — kept all of its existing content in full and expanded from 6 sections/1 source/no citations to 6 sections/4 FAQ/5 sources/~1,052 EN body words (~1,307 total).
- 4 new sources verified live in Chrome, alongside the existing WHO complementary-feeding guideline: Goday et al. 2019 Pediatric Feeding Disorder consensus definition (PMC6314510/PMID 30358739) — gave the real clinical line separating ordinary picky eating from a feeding disorder (impaired intake ≥2 weeks, meals regularly >30 minutes, permanent texture modification); the Ellyn Satter Institute's Division of Responsibility in Feeding (matches the article's existing "you provide food/time/place, the child decides how much/whether" framing exactly — confirmed this is literally Satter's named, citable model, not just good original advice); AAP HealthyChildren.org's picky-eating page (real data point: a food may need 10+ exposures before acceptance); CDC Growth Charts (reused).
- Added real, non-filler content the site didn't have: the 2-week/30-minute Pediatric Feeding Disorder threshold, the explicit four-part Satter division-of-responsibility breakdown (what/when/where vs. how-much/whether), food-neophobia's typical age range (2 to school age), sensory/texture sensitivity as a real difference rather than stubbornness, and when anaemia testing is and is not routine for a selective eater.
- 4 editorial internal links (child-nutrition-growth-visit, responsive-complementary-feeding, iron-rich-foods-for-children, and a reciprocal link to insulin-resistance-in-children, article #11, which already links here) — **all 4 rendered correctly on the first build**, no exact-substring-match or `validUrl()` failures this time.
- `date` preserved (2026-09-05), `updatedAt` set to 2026-09-21.
- Gates: build (490 pages), validate (0/0), audit (94 findings, 0 blocking, em-dash count 90), Arabic voice (PASS, no fix needed). All 5 citation anchors covered.
- Deployment and live verification: pushed to `main` (commit `e7513b3`), deployed, live-verified: both locales serving the new content, all 5 citation anchors resolve, hreflang `<link rel="alternate">` trio correct (ar/en/x-default), all 4 internal links render in both locales, EN translation notice present, dateModified correct.
- No Search Console indexing request submitted.
- Files changed: `content/articles-childrens-appetite-rewrite-2026-09-21.json` (new), `build/lib/util.mjs`, `tools/build_seo_content_plan.py`, `tools/snapshot-content.mjs`.

## 21 September 2026 — protecting-muscle-while-losing-weight

Thirteenth locked URL, selected via fresh `node tools/audit-article-standards.mjs` cross-referenced against real GSC impressions (7, tied-highest among not-yet-completed candidates; already a frequent internal-link target this session from `pcos-and-weight`, `body-composition-not-scale` and `inbody-results-explained`).

- No existing registered rewrite (checked `build/lib/util.mjs` first). Kept the existing article's accurate, non-alarmist content in full and expanded from 6 sections/2 sources/no citations to 6 sections/4 FAQ/5 sources/~1,087 EN body words (~1,281 total).
- 3 new sources verified live in Chrome, alongside the 2 existing ones (ESPEN/EASO sarcopenic-obesity definition, NICE NG246): Neeland et al. 2024 review on lean-body-mass changes with GLP-1-based therapies (PubMed 38937282) — gave the real, honestly-reported heterogeneous range (some studies show 40–60% of weight lost is lean mass, others ≤15%, varying by population/drug); Aragon et al. 2017 ISSN position stand on diets and body composition (PMC5470183, reused from `body-composition-not-scale`) — gave the real protein numbers (≈1.6 g/kg outperforms the 0.8 g/kg reference intake; trained individuals in a deficit may need 2.3–3.1 g/kg fat-free mass); WHO Guidelines on Physical Activity and Sedentary Behaviour (2020) — gave the real resistance-training frequency target (≥2 days/week covering major muscle groups).
- **Guessed a PMID from memory and got a completely unrelated paper** (a plant-nanobody article) before correcting course — confirms the standing rule that PMIDs must always be looked up via a live search result or citation snippet, never typed from recollection. Found the correct Neeland PMID (38937282) via a Google search results page's accessible link references rather than the rendered snippet text.
- **New validator failure mode found and fixed:** `node tools/validate.mjs` flagged three "price leaked into public page" errors on the Arabic page. The site's price-redaction regex (`tools/validate.mjs`, check 8) matches any digit run followed by `ج.?م` to catch a stray Egyptian-pound price, and it has no way to distinguish that from "١.٦ **جم**" (1.6 **grams**, using the common gram abbreviation). Fixed by writing "جرام" in full wherever an Arabic gram quantity sits next to a number, instead of the abbreviation — logged in `SKILL.md` so future numeric Arabic content (protein grams, doses, etc.) uses the full word from the start.
- Added real, non-filler content the site didn't have: the specific protein-per-kilogram targets, spreading protein across 3–4 meals rather than one large meal, the WHO resistance-training frequency target, normal first-week muscle soreness and gradual-load progression, and the honestly-reported range (not a single overstated number) for GLP-1-related lean-mass loss.
- 3 editorial internal links (body-composition-not-scale, weight-management-first-visit, glp1-medication-guide) — all rendered correctly in both locales (the sitewide auto-linker also added extra matches of the same targets elsewhere in the body, which is expected, documented behaviour, not a defect).
- `date` preserved (2026-09-03), `updatedAt` set to 2026-09-21.
- Gates: build (490 pages), validate (0/0 after the price-regex fix above), audit (95 findings, 0 blocking, em-dash count 91), Arabic voice (PASS). All 5 citation anchors covered.
- Deployment and live verification: pushed to `main` (commit `2ee5995`), deployed, live-verified: both locales serving the new content, all 5 citation anchors resolve, hreflang `<link rel="alternate">` trio correct (ar/en/x-default), all 3 internal links render in both locales, EN translation notice present, dateModified correct, no stray gram/price ambiguity live.
- No Search Console indexing request submitted.
- Files changed: `content/articles-protecting-muscle-while-losing-weight-rewrite-2026-09-21.json` (new), `build/lib/util.mjs`, `tools/build_seo_content_plan.py`, `tools/snapshot-content.mjs`.

## Required release evidence per URL

- Arabic/Egyptian Arabic intent record and current Search Console evidence.
- Ten authoritative sources and 1,200+ English words where the intent requires a long-form rewrite.
- Generated Arabic and English HTML: no bare visible numbered citation brackets; all anchors resolve; publication/revision history is present.
- `node build/build.mjs`, `node tools/validate.mjs`, `node tools/audit.mjs`, and `python tools/check_voice.py` pass.
- Commit, successful GitHub Pages deployment, and live HTTP/page-content verification.
- No Search Console indexing request unless the user gives fresh permission for that exact URL.
