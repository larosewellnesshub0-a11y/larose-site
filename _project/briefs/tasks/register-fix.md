# Task: raise the Egyptian register of one article (wording only)

The prompt names the target file. Its Arabic scores below 6 on `python _project/scratch/register_score.py <file>`. The target is 6.5 or higher.

Rules:
- Edit only the Arabic (`ar`) strings in that one file. Do not change the English, sources, citations [n], links, facts, numbers, author, reviewer, slug or SEO lengths.
- Rewrite stiff Modern Standard Arabic phrasing into calm, clear Egyptian Arabic (e.g. ده/دي/دول، مش، عشان، إزاي، إمتى، لازم، ممكن، بيـ verbs). Use masculine or neutral address. Keep medical terms precise. No slang that sounds unprofessional, and no hype.
- Keep every [n] citation in place in every section and FAQ.

Then run, from the repo root, until all pass:
1. `python _project/scratch/check_new_article.py <file>` (must end with ALL CHECKS PASS)
2. `python _project/scratch/register_score.py <file>` (6.5 or more)
3. `python _project/scratch/check_source_titles.py <file>` (0 mismatches)

Do not create images, run the build or edit any other file. Report the before and after scores.
