You are extending the Knowledge Centre of a bilingual (Arabic + English) Egyptian
medical clinic website. Work only inside this repository. Do NOT run git.

## What already exists

- `content/articles.json` holds 117 entries: long-form articles, Q&A entries and short tips,
  under `articles`, with `categories` above them. READ IT FIRST and copy the exact schema of
  an existing long-form article. Do not invent fields.
- `content/specialties.json` holds the only valid specialty slugs. Never invent one.
- `_project/uncovered-informational.json` is a naive keyword list: every informational keyword
  from the research sheet whose literal text does not appear in articles.json. Most of these
  are long-tail variants of topics that ARE already covered. Treat it as raw input, not a
  to-do list.
- `_project/CODEX-ARTICLES-REPORT.md` is the report from the previous round. Match its style.

## Your job

1. Cluster the keywords in `_project/uncovered-informational.json` into topics.
2. For each cluster, check whether an existing entry in `content/articles.json` already
   answers it. Judge by meaning, not by string match. Discard every cluster that is covered.
3. Discard anything the clinic does not offer. The live specialties are exactly the slugs in
   `content/specialties.json`. Discard keywords that are really location queries
   ("دكتور تغذية في المعادي") - those belong to branch pages, not articles.
4. From what survives, pick the **10 strongest genuinely uncovered topics** and write 10 new
   long-form articles into `content/articles.json`, appended to the `articles` array.
5. Write `_project/CODEX-ARTICLES-REPORT-R5.md` listing each new slug, the specialties it is
   tagged with, the keyword cluster it captures, and one sentence on why it is not a duplicate.

## Hard rules for the copy

- Both `ar` and `en` for every user-visible string. Arabic is the primary language.
- Arabic register is **everyday Egyptian**, not formal MSA. Write the way a doctor speaks to a
  patient in a Cairo clinic.
- **Arabic second person is MASCULINE throughout.** `tools/check_voice.py` fails the build on
  feminine second-person address. This is not optional.
- Wrap numerals that appear inside Arabic prose in `<bdi class="num">...</bdi>`.
- **No em dashes anywhere**, in either language.
- No prices, no currency, no cost claims of any kind.
- No named drug brands. Generic mechanism descriptions only.
- No guarantees, no "cure", no before/after promises.
- Every article needs a "when to see a doctor" section with concrete warning signs.
- Structure: exactly 5 sections and 3 FAQ entries, same as the existing long-form articles.
- Reuse an image path that an existing article already uses. Do NOT reference an image file
  that does not exist on disk.
- Mark the byline `PROVISIONAL` exactly as the existing entries do.

## Self-check before you finish (do run these)

```
python -c "import json;d=json.load(open('content/articles.json',encoding='utf-8'));print(len(d['articles']))"
node build/build.mjs
node tools/validate.mjs
python tools/check_voice.py
```

All three of build, validate and check_voice must pass: validate must report 0 errors and
0 warnings, check_voice must print PASS. If any fails, fix your own copy until it passes.
Do not edit the validator or the voice checker to make them pass.

Report what you changed and paste the final output of all three commands.
