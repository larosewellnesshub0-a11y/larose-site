# Arabic register rewrite brief (Egyptian colloquial)

File to edit: `content/articles-new-<TOPIC SLUG>-2026-09-27.json` (ONE article inside `articles[0]`).

Problem: the Arabic (`ar`) text is written in formal Modern Standard Arabic. La Rose's audience is Egyptian and the house rule is **everyday Egyptian Arabic** (the way a kind Egyptian doctor explains things to a patient), not MSA. Compare with the approved tone in `content/articles-new-gallbladder-polyps-ultrasound-next-steps-2026-09-27.json` and `content/articles-new-child-insulin-resistance-family-meals-2026-09-27.json`: read both before writing.

## What to do
Rewrite every Arabic string in the article into natural Egyptian Arabic:
`title.ar` (only if it is MSA), `excerpt.ar`, every `sections[].heading.ar` and every Arabic body/list/table string inside `sections`, every `faq[].q.ar` and `faq[].a.ar`, `seo.title.ar`, `seo.description.ar`, and any other `ar` value.
- Use Egyptian forms: ده/دي/دول، مش، عشان، إزاي، إيه، ليه، اللي، كده، لازم، بـ + present (بيعمل، بتاكل), هـ future (هتلاحظ). Use اللبن not الحليب, أكل not طعام where natural.
- Second person is **masculine or neutral only** (إنت، عندك، طفلك، اسأل دكتورك). Never feminine second person (إنتِ، عندِك، تاكلي، روحي). `tools/check_voice.py` fails the build on it.
- Keep medical terms clear; you may keep a standard term and explain it in simple words.
- Keep the length: the Arabic must stay at least as long as it is now (the page must keep >= 1,300 words per language).

## Must stay EXACTLY the same
- The meaning and every medical fact, number, dose, age and threshold. Do not add new facts, claims, studies or advice. Do not remove any caveat or red-flag warning.
- Every citation marker and its HTML exactly as-is (the `[n]` links, `<a ...>` tags, `href` values, classes), in bodies AND FAQs. Same count of citations per section/FAQ as before.
- Every internal link and the booking link (`href` values and count).
- All `en` strings, `sources`, `slug`, `date`, `updatedAt`, `author`, `reviewedBy`, `image`, `category`, `specialties`, `tags` structure, section `id`s, and the JSON structure. Do not add prices.
- `<bdi class="num">` wrappers around numbers if present.

## Self-check (run all, fix until they pass, then stop)
```
python _project/scratch/check_new_article.py content/articles-new-<TOPIC SLUG>-2026-09-27.json --no-net
python _project/scratch/register_score.py content/articles-new-<TOPIC SLUG>-2026-09-27.json
```
- The checker must print ALL CHECKS PASS.
- The register score (first number) must be >= 2.5 (the approved Egyptian articles score 3-4.5; MSA scores < 0.7).
- Before/after, compare the count of `[` citation markers and `href=` in the Arabic strings; they must be identical.

Rules: edit ONLY that one JSON file. No git, no build, do not touch `site/` or any other file. Write valid UTF-8 JSON (ensure_ascii=False, indent 2). At the end print: register score before -> after, citation/href counts before -> after, and the checker result.
