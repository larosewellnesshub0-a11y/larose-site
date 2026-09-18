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

## Required release evidence per URL

- Arabic/Egyptian Arabic intent record and current Search Console evidence.
- Ten authoritative sources and 1,200+ English words where the intent requires a long-form rewrite.
- Generated Arabic and English HTML: no bare visible numbered citation brackets; all anchors resolve; publication/revision history is present.
- `node build/build.mjs`, `node tools/validate.mjs`, `node tools/audit.mjs`, and `python tools/check_voice.py` pass.
- Commit, successful GitHub Pages deployment, and live HTTP/page-content verification.
- No Search Console indexing request unless the user gives fresh permission for that exact URL.
