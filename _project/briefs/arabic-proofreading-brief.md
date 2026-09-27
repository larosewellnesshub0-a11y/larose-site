# Arabic proofreading brief (site-wide, 2026-09-27)

You proofread the **Arabic** text of the article/Q&A/tip/science-update files listed in your prompt.
The client caught real spelling and grammar mistakes (أخطاء الكتابة اللغوية) on the live site. Your job is
to find and fix them, and only them.

## Scope — what you may touch
- Only the files named in your prompt, under `content/`. Do NOT create, edit, rename or format any other file
  (not `articles.json` unless it is in your list, not `site/`, not `build/`, not `tools/`, not other workers' files).
- Inside each file, only string values under an `"ar"` key (body, sections, FAQ, excerpt, title, seo, alt, captions).
- Never touch: `en` text, `sources`, `history`, `slug`, `date`, `updatedAt`, `author`, `reviewedBy`, URLs, hrefs,
  citation markers like `[1, 2]`, HTML tag structure, JSON key order, indentation or line endings.

## What counts as an error — fix these
1. Real typos: missing/extra/swapped letters, wrong letter (e.g. ض/ظ, ذ/ز where the word is plainly misspelled), a word
   that simply is not a word.
2. Hamzat al-wasl written as hamzat al-qat' in verb-noun forms: إستشارة→استشارة، إلتهاب→التهاب، إختبار→اختبار،
   إنتظام→انتظام، إستخدام→استخدام، إسم→اسم، إبن→ابن، إثنين→اتنين/اثنين (keep the text's register). الأن→الآن.
   إنشاء الله→إن شاء الله. لاكن→لكن، هاذا→هذا، ذالك→ذلك.
3. Clear hamza errors on words that only have one correct form (مسؤول، سؤال، أسئلة، يقرأ، بطء، شيء، جزء، مبدئياً).
4. ة/ه confusion where it changes the word (e.g. `الصحه` → `الصحة`; a pronoun `ـه` must stay `ـه`).
5. Doubled words (`في في`), glued words (`عشانالمشكلة`), broken words (`الت هاب`), double spaces, space before
   `،` `؟` `.` or missing space after them.
6. Latin punctuation inside Arabic sentences: `,` → `،`, `?` → `؟`, `;` → `؛`. (Keep `,` inside `[1, 2]` citations and inside numbers.)
7. Gender/number agreement mistakes (`المرضى بيحتاج` → `المرضى بيحتاجوا`, `الحالة دي بيكون` → `الحالة دي بتكون`,
   `ده الأعراض` → `دي الأعراض`), wrong preposition that breaks the meaning, obviously wrong word choice from a
   bad translation that makes the sentence meaningless.
8. **Second person must be masculine or neutral.** Any feminine second person addressed to the reader
   (`تقدري`، `محتاجة تعرفي`، `روحي`، `إنتي`) → masculine form. A sentence *about* a woman in third person
   (`الست الحامل بتحتاج`) is fine — do not change it.
9. Numerals in running Arabic body text should be wrapped as `<bdi class="num">12</bdi>`. **Never** add
   HTML in `seo.title`, `seo.description`, `title` used as a meta tag, or `alt` — plain digits there.
   Do not wrap numbers inside citation brackets.

## What is NOT an error — do not change
- The register is **everyday Egyptian Arabic** on purpose (`عشان`، `إزاي`، `دلوقتي`، `مش`، `بتاع`، `كده`، `اللي`).
  Never convert it to formal MSA and never "correct" Egyptian words to MSA ones.
- Final `ى`/`ي` variation (`في`/`فى`) and optional hamza on initial alef in common Egyptian spelling
  (`اكل`، `احسن`) — leave them unless the word is plainly misspelled. Do not mass-normalize.
- Medical terms, drug names, English terms in brackets, brand names.
- Style or tone preferences, sentence rewrites for elegance, adding or removing information.
- Facts, numbers, doses, dates, citations: **never** change meaning. If a sentence looks factually wrong,
  do not fix it — list it under "Flags for Claude" in your report.

## How to edit safely
1. Before editing a file, check that `json.dumps(json.load(f), ensure_ascii=False, indent=2) + "\n"` equals the
   raw file text (LF). If it does, you may load → edit strings → dump the same way and write with `newline="\n"`.
   If it does not (compact or CRLF file), edit by **exact substring replacement on the raw text** and keep its
   line endings. Always `json.loads` the result before writing.
2. Write your edit scripts under `_project/scratch/proofread/` (create it). Do not run shell loops that delete files.
3. Make each fix as a small exact replacement (old → new) so it is reviewable.

## Self-check (required, per file you changed)
```
python _project/scratch/check_new_article.py content/<file>     # must end with ALL CHECKS PASS
python _project/scratch/register_score.py content/<file>        # must stay >= 2.5
```
Then once at the end: `node build/build.mjs` then `node tools/validate.mjs` (0 errors, 0 warnings) and
`python tools/check_voice.py`. Set `PYTHONIOENCODING=utf-8`. If a gate fails because of your edit, fix it;
if it failed before your edit, say so.

## Report (required)
Write `_project/scratch/proofread/report-<WORKER>.md` with, per file: every change as
`slug | field path | old → new | error type`, then a "Flags for Claude" list (possible factual problems,
sentences you could not repair safely), then the gate results. Also print a one-line summary per file.
Finish with `git status --short` output so any file you touched outside your list is visible.
