You are working in the La Rose static site repo (this directory). Read AGENTS.md, PROJECT.md and `../google search console data/SKILL.md` + `../google search console data/AGENTS.md` first. READ-ONLY on content/, build/, site/. Do not run git commands that change state. Put scratch scripts under `_project/scratch/`.

TASK: produce a shortlist of 30 candidate NEW article topics (we will publish the best 20) for an Egyptian Arabic-first clinic blog, driven by Egyptian Arabic search intent.

HARD CONSTRAINTS
- Only topics a real on-staff clinician can medically review. Staff (see content/doctors.json):
  - shimaa-fouad: clinical nutrition, weight management, body contouring
  - alyaa-abu-taleb: clinical nutrition, weight management, paediatric nutrition
  - mohab-ashraf: internal medicine, gastroenterology/hepatology, abdominal ultrasound
  Assign exactly one reviewer slug per topic.
- NO cannibalisation: build an inventory of every existing article/qa/tip/update (all content/articles*.json: slug, AR+EN title, tags/keywords, category). For each candidate name the 1-3 closest existing entries and state concretely why the search intent differs. Reject anything whose primary intent an existing page already answers.
- No price/cost/offer topics. No topics needing a specialty the clinic lacks (dermatology procedures, surgery how-to, gynaecology, psychiatry, etc.) unless framed wholly within the staff scope above.

INPUTS (use all)
- `../google search console data/laroseclinics.com-Performance-on-Search-2026-09-16/Queries.csv` and `_project/GSC-SNAPSHOT-2026-09-16.json`: queries with impressions where our ranking page is a poor match or missing -> strong candidates.
- `_project/KEYWORD-RESEARCH-2026-09-10.xlsx` and `_project/SEO-CONTENT-CLUSTER-PLAN-2026-09-18.xlsx` (unpublished rows, volumes, clusters). Use Python openpyxl if available.
- `_project/WHOLE-SITE-PUBLISHING-COMPLETION-2026-09-18.md` for what is already done.
- If you have web search, you MAY sanity-check Egyptian Arabic phrasing; do not invent search volumes — only report numbers present in the inputs, else "n/a".

OUTPUT
1. `_project/PHASE1-TOPIC-SHORTLIST-2026-09-27.md`: ranked table of 30: rank | proposed slug (English kebab) | primary Arabic keyword (Egyptian phrasing) | 3-5 secondary Arabic keywords | English keyword | intent | evidence (GSC impressions/workbook volume + source row) | category | reviewer | closest existing entries + differentiation | suggested 2-5 internal-link targets (existing slugs) | risk notes.
   Then a "Recommended 20" list with one-line reasoning, balanced across the three reviewers and categories.
2. `_project/phase1-topic-shortlist-2026-09-27.json` with the same data.
Self-check: every slug is unique and does not already exist in content/; every internal-link target exists; every reviewer is one of the three slugs.
