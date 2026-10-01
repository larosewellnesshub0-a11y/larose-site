# Task: internal-link pass on the new article clusters (2026-10-01)

You edit ONLY the section `links` arrays of the files listed for your cluster at the bottom of this brief.
Nothing else in those files may change: no headings, bodies, FAQs, sources, citations, SEO fields, dates,
authors, reviewers or tags. Do not touch any other file. Do not run the site build (`build/build.mjs`) or
git commands that change state (add, commit, checkout, reset, stash, pull, push).

## Why

The site groups articles into SERP keyword clusters (`_project/PHASE3-TOPIC-SHORTLIST-2026-10-01.md`,
`_project/SEO-CONTENT-CLUSTER-PLAN-2026-09-18.xlsx`). The new articles were written before their siblings existed, so
they link only to older pages and almost none of them link to each other. In addition most link labels are
full article titles that never occur in the section text. The builder places a link inline only where its label
appears word for word in that section's body; any other link falls back to a small "Read also" line. Inline
links in prose are what we want.

## What to do, per article in your files

1. Read the article (both languages) and the shortlist row for its slug, if it has one.
2. Choose 2-5 distinct article targets per language, the SAME set in Arabic and English:
   - at least 2 must be SIBLINGS: other `content/articles-new-*.json` articles (list them with
     `dir content\articles-new-*.json`), chosen because a reader of that section would naturally want them
     next (same keyword cluster first; a closely related new article from another cluster is fine, e.g.
     HbA1c <-> child insulin resistance, Mounjaro + thyroid <-> TSH results);
   - keep the strongest existing older-page links (the shortlist's suggested links) for the remaining slots;
   - inside YOUR cluster, every article must end up receiving at least 2 sibling links from the other articles
     in your cluster (plan the whole cluster first, then edit);
   - every target must exist as `site/en/articles/<slug>.html`; never link an article to itself.
3. Each link sits in the section whose text it fits, and its `label` must be a phrase of 2-6 words copied
   EXACTLY (same letters, hamzas, spacing, case) from the body of THAT section in THAT language. Choose a
   descriptive noun phrase that names the target topic (for example `سونار البطن`, `تحليل السكر التراكمي`,
   `uric acid level`, `dose escalation`). Never use generic anchors (here, this article, اضغط هنا, اقرأ).
   Do not choose a phrase that sits inside a citation like `[3]`. The Arabic and English links of a pair go in
   the same section. If no section contains a fitting phrase for a target, choose a different target.
4. Keep exactly one booking link per language, `{"label": ..., "url": "../patients/booking.html"}`, in the
   FINAL section only, keeping its current label.
5. URLs are `../articles/<slug>.html` exactly as the files already use them.

## How to edit safely

- Edit the JSON text in place. Do NOT load and re-dump the file with json.dump / JSON.stringify (that
  reformats the file). Replace only the `"links": {...}` value of the sections you change, keep the file's
  existing indentation style and line endings, write UTF-8 without BOM, and confirm the file still parses.
- The `links` shape is `"links": {"ar": [{"label": "...", "url": "..."}], "en": [...]}`.

## Self-check, iterate until it passes

```
set PYTHONIOENCODING=utf-8
python _project/scratch/check_cluster_links.py <all files of your cluster>
python _project/scratch/check_new_article.py <each file>      (must still pass; it also checks 2-5 links + booking)
```

`check_cluster_links.py` also compares each file with git HEAD and fails if anything other than section
links changed. If `check_new_article.py` fails only on a source URL fetch (HTTP 403/5xx/timeout) that is a
network issue, not yours: note it in your report and move on. Never change sources.

## Report

Finish by writing `_project/briefs/tasks/internal-links-2026-10-01-<cluster>-report.md`: per article, the final
link targets with their AR and EN labels and section ids, plus the final output of both checkers.

## Clusters

- `weight`: content/articles-new-mounjaro-*-2026-10-01.json, articles-new-weight-loss-injections-and-fasting-2026-10-01.json,
  articles-new-who-can-take-weight-loss-injections-2026-10-01.json, articles-new-ozempic-mounjaro-blindness-facts-2026-09-27.json,
  articles-new-ozempic-wegovy-mounjaro-differences-2026-09-27.json, articles-new-retatrutide-weight-loss-what-is-known-2026-09-27.json,
  articles-new-saxenda-vs-weekly-weight-loss-injections-2026-09-27.json, articles-new-visceral-fat-score-waist-and-inbody-2026-09-27.json,
  articles-new-weight-loss-medicines-before-pregnancy-2026-09-27.json  (16 files)
- `meso`: content/articles-new-mesotherapy-*-2026-10-01.json, articles-new-double-chin-fat-dissolving-injections-2026-10-01.json,
  articles-new-face-mesotherapy-skin-boosters-2026-10-01.json, articles-new-who-should-not-have-mesotherapy-2026-10-01.json,
  articles-new-non-surgical-body-contouring-technologies-compared-2026-09-27.json  (11 files)
- `rheum`: content/articles-new-{ankylosing-spondylitis-inflammatory-back-pain, fibromyalgia-widespread-pain, gout-symptoms-and-attacks,
  knee-osteoarthritis-symptoms-and-grades, knee-osteoarthritis-treatment-options, lupus-sle-symptoms-and-tests,
  osteoporosis-bone-density-who-to-test, rheumatism-blood-tests-explained, rheumatoid-arthritis-early-signs,
  uric-acid-levels-and-gout-diet}-2026-10-01.json  (10 files)
- `gi`: content/articles-new-{anal-fissure-pain-and-bleeding, crohns-and-ulcerative-colitis-signs, haemorrhoids-symptoms-when-to-check,
  hepatitis-b-and-c-testing, peptic-ulcer-symptoms-and-causes}-2026-10-01.json and
  content/articles-new-{abdominal-ultrasound-for-children, after-colonoscopy-food-bloating-warning-signs, can-abdominal-ultrasound-detect-colon-cancer,
  colonoscopy-procedure-pain-sedation-duration, gallbladder-polyps-ultrasound-next-steps, gallbladder-sludge-vs-stones-ultrasound,
  gastroscopy-and-colonoscopy-same-day, gastroscopy-procedure-biopsy-sedation, incidental-kidney-cyst-ultrasound,
  prostate-urinary-tract-ultrasound-preparation}-2026-09-27.json  (15 files)
- `im`: content/articles-new-{anaemia-symptoms-and-cbc, constant-fatigue-which-tests, hba1c-test-what-it-means,
  leg-swelling-causes-when-to-worry, tsh-thyroid-test-results}-2026-10-01.json and
  content/articles-new-{child-insulin-resistance-family-meals, child-overweight-family-habits-without-dieting,
  child-too-much-milk-iron-appetite, iron-rich-first-foods-6-to-12-months, underweight-child-calorie-dense-meals,
  vegetarian-child-protein-iron-b12}-2026-09-27.json  (11 files)
