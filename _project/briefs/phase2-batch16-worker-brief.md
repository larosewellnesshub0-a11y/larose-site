# Phase 2 batch 16 — worker brief (La Rose Knowledge Centre)

You are working in the La Rose static-site repo (the current directory). Read `AGENTS.md`, `PROJECT.md`,
`_project/briefs/phase2-rewrite-brief-agy.md` (the full Phase 2 standard — follow it exactly) and this file.

## Your slugs

Process the slugs listed at the END of this prompt, ONE AT A TIME, in order. For each slug write exactly one
file `content/articles-p2-<slug>-2026-09-27.json` and make its self-check pass before starting the next slug.
If you run out of time, a finished and passing file is worth far more than several half-done ones.

## Differences from phase2-rewrite-brief-agy.md

1. **Reviewer:** IGNORE the "STOP — no reviewer" rule. Take `reviewedBy` and `author` from the table in
   `_project/briefs/phase2-unstaffed-reviewer-map-2026-09-27.md`. Never use any other doctor id.
2. **Current version:** the table's "current file" column names the file that currently defines the slug.
   Where two files are listed, the rewrite file (not `articles.json`) is the live one. Keep `date` from it.
3. **Search data (read-only):** to choose the Arabic primary keyword and the questions for FAQs, you may read
   `../google search console data/laroseclinics.com-Performance-on-Search-2026-09-16/Queries.csv` and
   `Pages.csv`, and `_project/PHASE2-QUEUE-2026-09-27.md`. Put the main Arabic query people actually use in the
   AR title/H1 wording, the first paragraph, and the seo.title naturally. Never invent search volumes.
4. **Internal links:** only link to slugs that exist as `site/en/articles/<slug>.html`. Prefer topically close
   pages (e.g. hair-loss pages link each other; acne pages link each other; hernia/gallbladder/sleeve pages link
   each other). Every link `label` must appear verbatim in that section's body in that language.
5. **Scope and safety for surgery/dermatology topics:** explain, don't prescribe. No drug doses, no named
   prescription-only brands as recommendations, no procedure promises. Isotretinoin, spironolactone, hormonal
   pills, hydroquinone, oral minoxidil etc. may only be described as "treatments a doctor may consider" with
   their key safety caveat (e.g. pregnancy), each backed by a cited source. Red flags that need urgent care
   (e.g. a hernia that becomes painful, hard and cannot be pushed back; fever with jaundice; signs of infection)
   must be stated clearly.
6. **Sources:** at least 10, all fetched and confirmed in this session (see the EXTRA RULES at the end of
   phase2-rewrite-brief-agy.md — they apply to you). Good sources for these topics: AAD (aad.org), NHS,
   MedlinePlus, NIAMS, Mayo Clinic, Cleveland Clinic, ASMBS, ACS (facs.org), SAGES, NIDDK, FDA (biotin
   interference safety communication), DermNet is NOT allowed (use AAD/NHS/NIH instead), PubMed/PMC guideline or
   review pages you have opened.
7. **Voice:** everyday Egyptian Arabic, masculine/neutral address only. For topics about women (hair loss in
   women, acne in pregnancy, teen girls, hernia after pregnancy) talk ABOUT her in third person
   ("الست"، "البنت"، "هي") and address the reader in masculine/neutral second person; never use feminine
   second-person forms (e.g. never "إنتِ", "عندك" meant as feminine, verbs ending in ـي for "you").
   `python tools/check_voice.py` must stay clean.
8. **No prices, no offers, no competitor names.**

## Self-check for every file (mandatory)

```
set PYTHONIOENCODING=utf-8
python _project/scratch/check_new_article.py content/articles-p2-<slug>-2026-09-27.json   -> ALL CHECKS PASS
python _project/scratch/register_score.py content/articles-p2-<slug>-2026-09-27.json      -> first number >= 2.5
```

Also confirm the JSON parses and `date` equals the original. Do NOT run the build, do NOT touch `site/`,
`build/`, `content/articles.json` or any other existing file, do NOT use git. Scratch goes under
`_project/scratch/<slug>/`.

## Final report (print at the end)

For each slug: output path, reviewer, AR/EN words, number of sources, the checker's last line, register score,
internal links used, any source you could not verify, and anything the clinician should double-check.
