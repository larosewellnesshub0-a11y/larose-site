You are working in the La Rose static site repo (this directory). Read AGENTS.md, PROJECT.md, `_project/WHOLE-SITE-PUBLISHING-COMPLETION-2026-09-18.md` and `../google search console data/SKILL.md` + `AGENTS.md` first.
READ-ONLY on content/, build/, site/. Do not run git commands that change state. Scratch scripts go under `_project/scratch/`.

TASK: build the Phase 2 enhancement queue — every existing article/qa/tip entry (content/articles*.json), ranked for rewrite priority.
Inputs:
- `../google search console data/laroseclinics.com-Performance-on-Search-2026-09-16/Pages.csv` and `Queries.csv` (impressions, clicks, position per URL/query)
- `_project/GSC-SNAPSHOT-2026-09-16.json`
- `_project/GSC-NOT-INDEXED-DIAGNOSIS-2026-09-27.md` (not-indexed URLs)
- `node tools/audit-article-standards.mjs` output (words, sources, citations, links, pass/fail)
Target standard per article: >=1300 words per language, >=10 sources, linked [n] citations incl. FAQ answers, 2-5 internal links per language + booking link, Egyptian Arabic masculine/neutral, aligned English, no prices, cover image, reviewer who is on staff (shimaa-fouad, alyaa-abu-taleb, mohab-ashraf) for the category.
For each entry record: slug, file, type, category, reviewer, AR words, EN words, sources, citations linked?, FAQ citations?, internal links AR/EN, has booking link, has cover, GSC impressions/clicks/avg position (sum of AR+EN URL forms, clean and .html), top 3 GSC queries, not-indexed flag, gaps list, and whether the category has an on-staff clinician reviewer (if not: flag "no-reviewer - skip").
Priority score: not-indexed or impressions>0 first (by impressions desc), then biggest gap to standard.

OUTPUT: `_project/PHASE2-QUEUE-2026-09-27.md` (ranked table + summary counts) and `_project/phase2-queue-2026-09-27.json`.
Self-check: entry count equals the number of article/qa/tip entries in content; print that check at the end of the report.
