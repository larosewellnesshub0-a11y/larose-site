# Phase 3 new-article brief (La Rose Knowledge Centre, 2026-10-01)

You are working in the La Rose static-site repo (the current directory). Read `AGENTS.md`, `PROJECT.md` and this brief first.
Your topic is given at the top of the prompt as TOPIC SLUG. Its full row (keywords, intent, category, reviewer, closest existing pages, suggested links, risk notes) is in `_project/PHASE3-TOPIC-SHORTLIST-2026-10-01.md (read its header too: author/reviewer pairs and the clinic-mention rule)`. Read that row, then read the 2–3 "closest existing entries" named in it (search `content/*.json` for the slug; rewrite files override `content/articles.json`) so your article does NOT repeat their scope. Use `content/articles-bloating-when-to-see-doctor-rewrite-2026-09-23.json` as the structural model.

## Output — one file only

Write `content/articles-new-<TOPIC SLUG>-2026-10-01.json`:

```json
{ "_note": "Phase 3 new article (2026-10-01). <one-line scope and what it deliberately does NOT cover>", "articles": [ { ... } ] }
```

Do NOT edit any other file: not `build/`, not `site/`, not `content/articles.json`, not other content files. Do NOT run git commands that change state. Do not run `node build/build.mjs` (another worker may be building). Scratch files go under `_project/scratch/<TOPIC SLUG>/`.

## Article object — required fields

- `slug`: TOPIC SLUG. `type`: "article". `published`: true. `featured`: false.
- `category`, `author` and `reviewedBy`: exactly as in the shortlist section header. The author and the reviewer are DIFFERENT clinicians (AGENTS.md rules 10 and 17; the checker rejects other pairs). `category: "rheumatology"` is valid. `specialties`: array starting with the category.
- `date`: "2026-10-01", `updatedAt`: "2026-10-01". `readingTime`: integer minutes (Arabic words / 200, rounded up).
- `image`: "assets/img/articles/<TOPIC SLUG>-cover.webp" (the cover is produced separately).
- `title`, `excerpt`, `seo.title`, `seo.description`: `{ar, en}`. The Arabic title should contain the primary Arabic keyword naturally. seo.title ≤ 60 chars, seo.description 120–155 chars, per language.
- `tags`: `{ar:[...], en:[...]}`, 4–8 each, drawn from the primary/secondary keywords.
- `sections`: 6–9 sections, each `{id, heading:{ar,en}, body:{ar,en}, links:{ar:[...], en:[...]}}`. Bodies are plain text paragraphs separated by `\n\n` (look at the model file to see what the renderer accepts; do not use HTML or markdown headings inside bodies).
- `faq`: 5–7 items `{q:{ar,en}, a:{ar,en}}`. Questions should reflect real Egyptian search phrasing from the keyword list.
- `sources`: 10–16 items `{label, url}`.

## Hard standards (the checker enforces them)

1. **Length:** at least 1,300 words in EACH language (target 1,600–2,200). Counted over headings, bodies, FAQ questions and answers.
2. **Sources:** at least 10 distinct, authoritative, directly relevant pages: NIH/NIDDK/NCBI Bookshelf/PubMed (specific article pages), WHO, CDC, NHS, NICE, Mayo Clinic, Cleveland Clinic, specialty societies (ACG, AGA, ASGE, BSG, ESPGHAN, AAP, ADA, ESPEN, Obesity Society), FDA/EMA labels, peer-reviewed guidelines. No blogs, no competitor clinics, no Wikipedia, no homepages or search pages. **Fetch every URL** with Python or Node and confirm it resolves (200) and that the page title matches your label. If a site blocks bots (403), pick another source unless it is a canonical guideline you can confirm otherwise. Never invent a URL, DOI, statistic or guideline recommendation; every factual claim must be supportable from the cited page.
3. **Citations:** every section body and every FAQ answer, in both languages, carries bracketed numeric citations like `[3]` or `[2, 7]` that point to the matching 1-based index in `sources`. The Arabic and English versions of a paragraph cite the same numbers.
4. **Internal links:** per language, 2–5 distinct links to existing articles, as `{label, url:"../articles/<slug>.html"}` inside section `links`, choosing from the shortlist row's suggested targets (all exist; check `site/en/articles/<slug>.html` exists). PLUS one booking link `{label, url:"../patients/booking.html"}` in the final section, e.g. ar label "احجز استشارة مع الفريق الطبي" / en "Book a consultation". Arabic and English link sets must match.
5. **Language:** write the ARABIC first as the original, in clear everyday **Egyptian Arabic** (e.g. "إيه", "إزاي", "دلوقتي", "مش", "عشان", "لازم", "ممكن") while keeping medical terms precise (add the English term in parentheses once where useful). Address the reader in **masculine or neutral** form only — never feminine (no احجزي/راجعي/تقدري/عايزة/-كِ/ت...يش). Then write the ENGLISH as an aligned, faithful translation (same sections, same claims, same citations), natural and plain.
6. **No prices, costs, offers or fees** of any kind. No promises of results, no "best clinic" claims, no guarantees. Do not name competitor clinics. Do not invent clinic services, doctors, credentials, statistics or case stories. Speak of the clinic only generically ("the medical team at La Rose" / "الفريق الطبي في لاروز") and only in the booking/next-step section. There you may add that La Rose has branches in Maadi (المعادي) and Fifth Settlement, New Cairo (التجمع الخامس) — nothing else (no hours, no doctor names, no devices, no services not named in the row). Never claim the clinic offers something the row says not to claim.
7. **Safety:** include clear red-flag / when-to-seek-urgent-care guidance where relevant; defer individual decisions to the treating clinician; respect the shortlist row's risk notes exactly.
8. **Non-cannibalisation:** stay inside the row's differentiated scope; summarise adjacent topics in one or two sentences and link to them instead of re-explaining.
9. **SERP coverage:** before writing, list (in your scratch folder, `serp-notes.md`) the sub-questions that top Arabic results for the primary keyword typically answer (use your knowledge plus fetchable pages such as Arabic health portals — never copy their text), and make sure the article answers them better and with sources.

## Self-check — mandatory, iterate until it passes

```
set PYTHONIOENCODING=utf-8
python _project/scratch/check_new_article.py content/articles-new-<TOPIC SLUG>-2026-10-01.json
python _project/scratch/register_score.py content/articles-new-<TOPIC SLUG>-2026-10-01.json   # first number must be >= 2.5 (Egyptian, not MSA)
```

It must print `ALL CHECKS PASS`. Fix every failure and rerun. Treat any `WARN` source line as needing either a replacement source or a note in your final report. Also parse the file with `json.load` to be sure it is valid UTF-8 JSON.

## Final report (print at the end)

Slug, file path, AR/EN word counts, number of sources, the checker's final output, list of internal links, any source you could not verify, and any content decision the clinician reviewer should double-check.

## Phase 3 extras

- Weights in kg, never pounds (the price regex catches the word `pounds`).
- Drug names: use generic names (tirzepatide, semaglutide). You may name Mounjaro, Wegovy, Zepbound and Ozempic because they are the search terms, but never recommend a brand or tell anyone to start, stop or change a dose.
- Any regulatory claim (FDA/EMA approval, label age limits, boxed warnings) must be cited to the official label or agency page.
- Folk remedies and supplements: report the guideline/evidence position; never endorse.
