# Whole-site publishing completion tracker

## Binding acceptance standard

Each canonical article or scientific update must preserve its original date, use a real `updatedAt` when revised, contain rich aligned Arabic and English, use authoritative sources, make every visible numbered citation an in-page link to the matching source, include natural contextual internal links, and pass rebuild, validation, audit, Arabic voice, deployment, and public-page verification.

## Current evidence — 18 September 2026

`node tools/audit-article-standards.mjs` reports 180 published article pages and 145 below the long-form standard. This means the whole-site goal is **not complete**. The count is an editorial queue, not proof that a short-format tip must be inflated without a useful patient intent.

## Completed, publicly verified long-form releases

- Gallstones on ultrasound: symptoms, assessment and surgery decisions
- Low ferritin with a normal CBC
- Earlier verified releases recorded in Git history: normal ultrasound, fatty-liver fibrosis, hypothyroidism and weight, kidney stones, diabetes review, blood pressure, ultrasound safety, H. pylori/reflux/IBS, prediabetes medicine, and food intolerance versus allergy.

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

## Required release evidence per URL

- Arabic/Egyptian Arabic intent record and current Search Console evidence.
- Ten authoritative sources and 1,200+ English words where the intent requires a long-form rewrite.
- Generated Arabic and English HTML: no bare visible numbered citation brackets; all anchors resolve; publication/revision history is present.
- `node build/build.mjs`, `node tools/validate.mjs`, `node tools/audit.mjs`, and `python tools/check_voice.py` pass.
- Commit, successful GitHub Pages deployment, and live HTTP/page-content verification.
- No Search Console indexing request unless the user gives fresh permission for that exact URL.
