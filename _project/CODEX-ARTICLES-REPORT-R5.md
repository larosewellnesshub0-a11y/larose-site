# Knowledge Centre expansion report, R5

Date: 2026-09-11

## Coverage used to choose the topics

The raw list contained 316 literal misses. It was clustered before selection: location and provider searches were removed, as were variants already answered by the existing long-form work on IBS, H. pylori, fatty liver, gallstones, InBody interpretation, local-fat injections, adult hair loss, and general insulin resistance. The remaining topics below add a different patient group, a distinct clinical decision, or a practical gap that the existing entry only touches briefly.

## New articles

- `insulin-resistance-in-children`: Paediatrics; Internal Medicine; Clinical Nutrition. Captures the child-specific insulin-resistance cluster, which is not answered by the existing adult-focused insulin-resistance article or the dark-neck guide.
- `hair-loss-in-children-when-to-check`: Paediatrics; Dermatology; Clinical Nutrition. Captures child hair-loss searches; the existing hair articles address adult female and male patterns rather than a child's scalp, growth, and nutrition assessment.
- `telogen-effluvium-sudden-hair-shedding`: Dermatology; Clinical Nutrition; Internal Medicine. Captures sudden and telogen shedding after illness, weight change, or physical stress, a distinct diffuse pattern not given its own decision guide in the sex-specific hair-loss articles.
- `acne-safe-home-care-and-when-to-check`: Dermatology. Captures home acne-treatment searches with a complete safe baseline and escalation guide, rather than duplicating the short scientific update about avoiding harsh scrubbing.
- `acne-marks-and-scars-what-is-the-difference`: Dermatology. Captures acne-mark and scar searches; it separates colour change from textural scars and is distinct from active-acne treatment.
- `hormonal-acne-clues-and-assessment`: Dermatology; Internal Medicine; Clinical Nutrition. Captures hormonal-acne queries with an assessment pathway, which is different from the basic acne routine and avoids diagnosing hormones from spot location alone.
- `cellulite-realistic-options-and-limits`: Body Contouring; Dermatology; Weight Management. Captures the cellulite treatment cluster with an expanded decision guide on home claims, procedures, and red flags; the earlier entry is a short scientific update only.
- `sleeve-gastrectomy-what-to-know`: Bariatric Surgery; General Surgery; Clinical Nutrition. Captures sleeve-gastrectomy procedure and risk searches; the existing bariatric article concentrates on preoperative preparation across procedures.
- `hernia-in-children-when-to-assess`: Paediatrics; General Surgery. Captures child abdominal-hernia searches, which require a different urgency and follow-up frame from the adult abdominal-hernia article.
- `inbody-preparation-for-reliable-follow-up`: Clinical Nutrition; Weight Management; Internal Medicine. Captures InBody preparation and repeatability searches, distinct from the existing guide to reading the report itself.

## File-level checks

- Ten long-form articles were appended to `content/articles.json`.
- Every new article has exactly five sections, including a concrete “when to see a doctor” section, and exactly three FAQ entries.
- Each specialty slug is present in `content/specialties.json`.
- Each image path is already used by an existing article and exists under `site/assets/img/articles/`.
- Author and reviewer fields follow the file’s existing `PROVISIONAL` byline convention.
