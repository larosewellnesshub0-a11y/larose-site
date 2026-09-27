# Phase 2 enhancement brief (La Rose Knowledge Centre)

You are working in the La Rose static-site repo (the current directory). Read `AGENTS.md`, `PROJECT.md` and this brief first.
Your target is given at the top of the prompt as TOPIC SLUG. It is an EXISTING published entry. Its queue row (current file, word counts, gaps, GSC impressions) is in `_project/PHASE2-QUEUE-2026-09-27.md`.

## Find the current version

The live version is the LAST definition of that slug the loader uses: a rewrite file `content/articles-*-rewrite-*.json` (or `articles-expansion*`/`longform*`) overrides `content/articles.json`. The queue row's `File` column names it. Read it fully, plus `content/articles-bloating-when-to-see-doctor-rewrite-2026-09-23.json` as the structural model, plus the pages it will link to.

## Output — one file only

Write `content/articles-p2-<TOPIC SLUG>-2026-09-27.json`:

```json
{ "_note": "Phase 2 enhancement (2026-09-27) of <slug>; replaces the entry from <source file>. <one line: what changed>", "articles": [ { ... } ] }
```

The build loader replaces the existing entry with the same slug by this one. Do NOT edit any other file (not the original rewrite file, not `content/articles.json`, not `build/`, not `site/`). No git state changes. Do not run the build. Scratch goes under `_project/scratch/<TOPIC SLUG>/`.

## Fields — what to keep and what to change

- KEEP exactly: `slug`, `type`, `category`, `date`, `image`, `published`, `featured`, and any other existing fields you do not need to change (e.g. `specialties`, `id`, `related`), unless they are wrong.
- SET `updatedAt`: "2026-09-27".
- APPEND to `history` (create the array if absent; keep existing items first): `{"date":"2026-09-27","note":{"ar":"<one Egyptian-Arabic sentence on what was expanded/updated and that it was medically re-reviewed>","en":"<same in English>"}}`. It is rendered in the page's publication history.
- SET `reviewedBy` AND `author` to the staffed clinician for the category: `internal-medicine`, `gastroenterology-hepatology`, `ultrasound` → `mohab-ashraf`; `weight-management`, `obesity`, `body-contouring` → `shimaa-fouad`; `pediatrics`/child nutrition → `alyaa-abu-taleb`; `clinical-nutrition` → keep `alyaa-abu-taleb` or `shimaa-fouad` if already set, otherwise `shimaa-fouad` (or `alyaa-abu-taleb` if the topic is about children). If the category is none of these, STOP and report "no reviewer — skipped" without writing a file.
- `readingTime`: Arabic words / 200, rounded up.
- `title`, `excerpt`, `seo`: keep the URL's search intent; improve only if it helps the Arabic primary keyword appear naturally. seo.title ≤ 60 chars, seo.description 120–155 chars.
- Keep the existing correct content and sources where they are good; extend, correct and restructure to meet the standards. Remove anything unsupported by its citation.

## Hard standards (the checker enforces them)

Same as Phase 1:
1. ≥ 1,300 words per language (target 1,600–2,200); 6–9 sections; 5–7 FAQs.
2. ≥ 10 distinct authoritative sources (NIH/NCBI/PubMed article pages, WHO, CDC, NHS, NICE, Mayo, Cleveland Clinic, specialty societies, FDA/EMA labels, peer-reviewed guidelines). No blogs, competitors, Wikipedia, homepages. **Fetch every URL** and confirm it resolves and matches its label. Never invent a URL, statistic or recommendation.
3. Every section body and FAQ answer, in both languages, carries `[n]` citations to the 1-based `sources` index; AR and EN cite the same numbers.
4. Per language: 2–5 distinct links to existing articles (`{label, url:"../articles/<slug>.html"}` in section `links`, targets must exist in `site/en/articles/`) plus `{label, url:"../patients/booking.html"}` in the final section. AR and EN link sets match. The link `label` must appear verbatim in that section's body text of that language, so it can be turned into an inline link.
5. Arabic is the original in everyday **Egyptian Arabic**, masculine/neutral address only (never feminine forms). English is an aligned faithful translation.
6. No prices/costs/offers; no promises; no competitor names; no invented services, doctors or stats. The clinic is mentioned only generically and only in the final next-step section.
7. Red flags / urgent-care guidance where relevant; individual decisions deferred to the treating clinician.
8. Do not drift into the scope of neighbouring pages: summarise and link instead.

## Self-check — mandatory

```
set PYTHONIOENCODING=utf-8
python _project/scratch/check_new_article.py content/articles-p2-<TOPIC SLUG>-2026-09-27.json
python _project/scratch/register_score.py content/articles-p2-<TOPIC SLUG>-2026-09-27.json   # first number must be >= 2.5 (Egyptian, not MSA; approved pages score 3-5). Write the Arabic like a kind Egyptian doctor talking: ده/دي، مش، عشان، إزاي، إيه، بيعمل، هتلاحظ.
```

Iterate until it prints `ALL CHECKS PASS`. Also confirm `date` equals the original entry's `date`.

## Final report

Slug, output path, source file replaced, AR/EN words before → after, sources before → after, reviewer before → after, the checker's final output, internal links, unverifiable sources, and anything the clinician should double-check.


## EXTRA RULES FOR THIS WORKER (strict — your last batch had fabricated citations)

- Every source MUST be a real page you have actually opened in this session: fetch it and confirm the page title matches your label (authors, year, journal). Never build a PubMed/PMC URL from memory. If you cannot open a source, drop it and find another.
- Every sentence that cites [n] must state only what source n actually says. Do not attach specific percentages, hour counts or doses unless that exact figure appears in the cited source.
- Never attribute a statement to NICE, ESGE, AGA, WHO etc. unless the cited source is that organisation's own document.
- Prefer: NHS, NIDDK, MedlinePlus, Mayo Clinic, CDC, AAP/HealthyChildren, society guidelines on PubMed/PMC that you have opened.
- Arabic: everyday Egyptian, masculine/neutral second person only, no prices.
