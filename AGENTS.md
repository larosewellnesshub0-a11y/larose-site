# Working rules

This is a generated bilingual static site. Work from source, not from output.

1. Edit `content/*.json`, `build/`, dashboard code, or hand-managed assets as
   appropriate. Never hand-edit generated HTML under `site/`.
2. Build before reviewing output:

   ```powershell
   node build/build.mjs
   node tools/validate.mjs
   node tools/audit.mjs
   python tools/check_voice.py
   ```

   All four commands must pass. The important failure mode is a correct source
   edit that never reaches a built page. Only the rebuilt output and its checks
   prove the change is live in the generated site.
3. Arabic reader-address is masculine or neutral. `check_voice.py` fails on
   feminine second-person forms. The only exception is the two RecipeGuide
   pages, which preserve the clinic's supplied wording.
4. Keep Arabic and English counterparts in sync. Do not invent medical facts,
   people, credentials, addresses, statistics, or citations. Use `UNKNOWN` or
   the existing empty state when the source is missing.
5. Never put public price figures in content or output. The save checks and
   validator reject them. One exception (user decision, 2026-09-30): the
   website-offer popup. Its copy lives in `content/site.json` under `promo`,
   with every price-bearing string under `promo.price` (the dashboard allows
   figures only under a `price` path). The build publishes it only as
   `site/assets/data/promo.json`, which robots.txt disallows, and `site.js`
   injects it after time on the site. No price may appear in any page's HTML;
   the validator still enforces that. Turn it off with `promo.enabled: false`
   or end it with `promo.endsOn`.
6. Do not use `text-align: match-parent`. Chrome does not implement it.
7. For template images, use `responsiveAttrs()` and the appropriate
   `IMAGE_SIZES` value. Use `sizeAttrs()` when dimensions are not fixed in the
   template. The audit treats missing intrinsic dimensions as blocking.
8. `site/` contains generated documents and assets. Build commands may rewrite
   generated output. Manual edits to generated HTML will be lost on the next
   build.
9. Clean URLs only. Canonicals, hreflang, sitemap entries, JSON-LD and
   internal links point to `https://laroseclinics.com/<locale>/<path>` without
   `.html` (since e84b27e for canonicals and 054614c for links). The `.html`
   files still resolve and declare the clean canonical. GSC rows for `.html`
   URLs under "Alternate page with proper canonical" or "Duplicate, Google
   chose different canonical" come from crawls before those commits. They are
   expected, so do not "Validate fix" them.
10. Content changes to existing articles go in a new
    `content/articles-p2-<slug>-<date>.json` override. Keep `date`, set
    `updatedAt`, append a `history` note, and set `reviewedBy`/`author` to the
    staffed clinician for the category (see
    `_project/briefs/phase2-rewrite-brief.md`). Do not invent a reviewer.
    Since 2026-09-27 (user decision) topics with no staffed specialty
    (dermatology, general and bariatric surgery, general) are assigned to the
    closest of the three real doctors (alyaa-abu-taleb, shimaa-fouad,
    mohab-ashraf) per `_project/briefs/phase2-unstaffed-reviewer-map-2026-09-27.md`.
    Those pages still need that doctor's own read-through.
    **Reviewer rule (user decision, 2026-09-27, applies site-wide):** the
    reviewer is never the author. Articles by mohab-ashraf are reviewed by
    shimaa-fouad, articles by shimaa-fouad by alyaa-abu-taleb, and articles by
    alyaa-abu-taleb by shimaa-fouad. Every file under `content/` was audited
    and fixed to this rule (288 fixes). Re-check it with any new file.
11. Drafts may be delegated to Codex or Antigravity. Claude re-runs every gate
    and the Phase 2 checker on the result before accepting it. Review
    Antigravity output line by line. Workers sometimes edit files outside
    their list, so diff `git status` against a pre-run snapshot before
    accepting their work.
12. Never put HTML (including `<bdi class="num">`) in `seo.title`,
    `seo.description` or `alt`. Use plain digits there.
13. Dermatology service claims: only consultation (exam, history,
    medication and lab review, local vs internal cause, written plan), the
    acne programme and hair-loss treatment, working with the nutrition and
    internal medicine teams. Do not claim dermoscopy, trichoscopy, lasers,
    peels, devices or procedures at La Rose. General education that says "a
    dermatologist may use dermoscopy" is fine. The plain-language and
    overclaim rules are in `_project/briefs/phase2-batch16-dehype-brief.md`.
14. Arabic spelling and grammar: proofread against
    `_project/briefs/arabic-proofreading-brief.md` (hamzat al-wasl, typos,
    agreement, Arabic punctuation, masculine second person) while keeping
    the Egyptian register.
15. Never put `<bdi>` (or any HTML) in content JSON string fields. The build
    HTML-escapes text fields, so it shows up on the page as literal `&lt;bdi`
    (1,751 escaped tags reached the build on 2026-09-27 before this was
    caught). The templates handle numeral direction. After any bulk edit,
    `grep -rl "&lt;bdi" site` must return nothing.
16. Never rewrite content files with `json.dumps`. It reformats some files and
    turns small edits into whole-file diffs. Edit the raw string literals,
    re-parse with `json.loads` to check, and write with `newline=""` so the
    line endings are kept.

17. **Reviewer pairs for the fourth doctor (user decision, 2026-10-01).**
    Rheumatology articles by shimaa-sherif are reviewed by mohab-ashraf.
    shimaa-sherif may review articles by mohab-ashraf or alyaa-abu-taleb.
    Leave her portrait empty until the clinic supplies a photo. Never use a
    generated image for it. New articles set `author` and `reviewedBy` to
    different clinicians from these pairs. `_project/scratch/check_new_article.py`
    enforces this (the older phase-1 brief's "author = reviewer" is superseded).
18. **Another session also pushes to `origin/main`.** Before every push, run
    `git fetch` and then `git pull --rebase --autostash`. Rebuild if the
    upstream changes touched `content/` or `build/`. Never force-push.
19. **The goal and checklist for the current round** are in
    `_project/GOAL-<date>.md` (currently `_project/GOAL-2026-10-01.md`).
    Read it first and re-read it at each milestone. The per-round log is in
    `_project/WORKPLAN-<date>.md`.
20. **A source URL that returns 200 is not a verified citation.** Workers
    (especially Antigravity) have attached real PubMed/PMC links to invented
    labels: a rat brain-injury paper labelled as an RA review, and a DNA-mixture
    study labelled as EULAR recommendations. `check_new_article.py` only checks
    HTTP status. Also run
    `python _project/scratch/check_source_titles.py <files>`. It compares each
    PubMed/PMC title and first author (NCBI esummary) with the label. BAD rows
    must be fixed. WEAK rows are usually shortened labels, so confirm them by
    hand. Spot-check numeric claims against the cited abstract or label too.

See `PROJECT.md` for the source map and `_project/LAUNCH.md` for the deployment
runbook.
