# Task: inbound links to orphan articles + verbatim link labels (2026-10-01)

Twelve published articles receive no in-text link from any other article. Several older articles also carry
link labels that never occur in their section text, so the builder can only show them in a small "Read also"
line instead of inline. You fix both, for the group named in your prompt only.

## Hard limits

- Edit ONLY section `links` arrays, plus `updatedAt` and `history` of the articles whose links you change,
  in the files of your group. No headings, bodies, FAQs, sources, citations, SEO, tags, authors, reviewers.
- Never edit `content/articles.json`, any `articles-new-*-2026-10-01.json` file, or
  `content/articles-p2-silent-gallstones-usually-need-no-treatment-2026-09-27.json`.
- Do not run the site build or git commands that change state (add, commit, checkout, reset, stash, pull, push).
- Edit the JSON text in place with small targeted replacements. Never re-dump a file with json.dump or
  JSON.stringify. Keep indentation and line endings, write UTF-8 without BOM, confirm it parses.

## A. Inbound links (each target gets exactly 2 new inbound links)

For each TARGET of your group, add a link to it from 2 different SOURCE articles chosen from its candidate
list. Choose the sources where a reader would naturally want the target next. Rules:
- The source must still have 2-5 distinct article targets per language after the edit (if a source already
  has 5, pick another source). A source receives at most one new link in this task.
- Add the link in BOTH languages, in the same section, with the same target.
- The `label` is a 2-6 word phrase copied EXACTLY (letters, hamzas, spaces, case) from the body of that
  section in that language, and it must name the target topic (e.g. `body fat percentage`, `فيتامين د`).
  Never a generic anchor (here, read more, اضغط هنا), never text inside a citation like [3]. If no
  section of a candidate has a fitting phrase, use another candidate.
- URL: `../articles/<target-slug>.html`. Do not add a second booking link.

## B. Verbatim labels in the label-fix files of your group

For every article link in those files whose label is not found verbatim in its section body, either change
the label to a fitting 2-6 word phrase copied exactly from that section body, or move the link (both
languages) to another section whose body has a fitting phrase. Keep the same set of targets. If no section
has any fitting phrase for a target, replace that target with another existing article that fits and does
have a phrase (AR and EN sets must stay identical).

## History, for every article whose links you change

Set `updatedAt` to `2026-10-01` and append ONE entry to the end of its `history` array (create it if missing):
`{"date": "2026-10-01", "note": {"ar": "<short Egyptian Arabic note>", "en": "<short English note>"}}`
saying that internal links to related articles were added or updated, with no change to the medical content.

## Self-check, iterate until it passes

```
set PYTHONIOENCODING=utf-8
python _project/scratch/check_link_edit.py <every file you changed plus every label-fix file of your group>
```
It must end with ALL CHECKS PASS. Then write `_project/briefs/tasks/inbound-links-2026-10-01-<group>-report.md`:
per target the 2 sources and labels used; per label-fix file what changed.

## Groups

### Group `bodypeds`
Targets (candidate sources in the `_project/briefs/tasks/inbound-plan-2026-10-01.md` list):
body-composition-change-over-time, body-fat-percentage-context-men-women, cellulite-home-care-and-safety,
inbody-test-first-visit-guide, hair-loss-in-children-when-to-check, vitamin-d-in-children-when-to-assess.
Do not use `articles-new-*-2026-10-01.json` files as sources (they are frozen for this task).
Label-fix files: content/articles-p2-cellulite-is-a-skin-structure-feature-2026-09-27.json,
content/articles-p2-diabetes-remission-is-not-cure-2026-09-27.json,
content/articles-p2-qa-gallstone-bloating-only-2026-09-27.json

### Group `dermgi`
Targets: eczema-flare-when-to-check, melasma-and-sun-protection, h-pylori-symptoms-and-testing-pathway,
ibs-symptoms-in-pregnancy-when-to-check, ibs-symptoms-men-assessment-guide, ibs-symptoms-women-assessment-guide.
Label-fix files: content/articles-p2-acne-in-pregnancy-safe-assessment-2026-09-27.json,
content/articles-p2-eczema-flare-when-to-check-2026-09-27.json,
content/articles-p2-folliculitis-vs-acne-itchy-bumps-2026-09-27.json,
content/articles-p2-hair-loss-blood-tests-first-2026-09-27.json,
content/articles-p2-melasma-and-sun-protection-2026-09-27.json
