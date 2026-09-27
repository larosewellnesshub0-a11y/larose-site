# Batch 16 — accuracy and register pass on agy drafts (2026-09-27)

You edit ONLY the files listed in your prompt: `content/articles-p2-<slug>-2026-09-27.json`.
Do not touch any other file. Do not run git. Do not edit `site/`.

## Goal
These drafts were written by a weaker model. The facts and sources are mostly right, but the
prose overclaims and reads like a textbook. Fix EN **and** the matching AR in the same
section/FAQ so both languages say the same thing.

## Rules
1. **No absolutes the sources do not support.** Replace "without causing adverse effects",
   "remarkably safe", "unequivocally", "gold standard", "fundamentally inadequate",
   "doomed to failure", "eliminates guesswork", "always", "never" (when not strictly true),
   "absolute emergency" with calibrated wording: "low risk when used as directed",
   "often recommended", "may", "can help", "usually".
2. **Urgent care wording:** state what to do plainly, e.g. "needs same-day urgent medical care;
   some people need hospital admission". Keep every red flag; do not remove safety content.
3. **Speculative mechanisms:** if a mechanism is still being researched (e.g. heat and mast
   cells in melasma, hormone receptor effects), say "researchers think" / "may", or remove it.
   Remove the claim that screens/digital devices emit meaningful HEV light that worsens
   melasma unless the cited source explicitly says so (say "visible light, mainly from the sun").
4. **La Rose service claims:** the clinic's dermatology page lists only: dermatology
   consultation (skin/scalp examination, history/medicines/labs review, local vs internal cause,
   written plan), an acne treatment programme, and hair-loss treatment. Dermatology works with
   the nutrition and internal-medicine teams. Do NOT claim dermoscopy, trichoscopy,
   lasers, peels, devices, "advanced" equipment, "in-clinic procedures", or anything else.
   Rewrite any such sentence to the real consultation content above.
5. **Register.** English: plain, clear, patient-facing (aim for a 15-year-old reader); swap
   Latinate jargon ("pruritus", "cutaneous", "pharmacotherapy", "dermal", "neoplasm",
   "phototype") for plain words, keeping one technical term in brackets when useful.
   Arabic: everyday Egyptian (عامية مصرية مهذبة), not MSA. No "إنتِ/تقدري/محتاجة" feminine
   second person: masculine or neutral only. Numbers inside Arabic text in `<bdi class="num">`.
6. **Keep:** every `[n]` citation (each section and each FAQ answer must still contain at least
   one), all `<a href>` internal links and the booking link, `sources`, `date`, `updatedAt`,
   `history`, `author`, `reviewedBy`, slugs, the JSON structure. No prices. No new facts
   without an existing citation that supports them. Do not shorten a section below ~70% of its
   current length.
7. Save as UTF-8 JSON, `ensure_ascii=False`, indent 2, LF line endings.

## Self-check (required, for each file)
```
python _project/scratch/check_new_article.py content/articles-p2-<slug>-2026-09-27.json
python _project/scratch/register_score.py content/articles-p2-<slug>-2026-09-27.json
python tools/check_voice.py
```
The first must print ALL CHECKS PASS. register_score's first number must be >= 2.5. Fix and re-run
until both pass. At the end print one line per file: slug, what you changed (short), check results.
