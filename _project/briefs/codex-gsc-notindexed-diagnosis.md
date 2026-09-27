You are working in the La Rose static site repo (this directory). Read AGENTS.md and PROJECT.md first.

TASK: diagnose why Google Search Console reports the URLs listed in `_project/GSC-NOT-INDEXED-2026-09-27.md`
(sections "Discovered - currently not indexed" and "Crawled - currently not indexed") as not indexed. READ-ONLY on content: do NOT edit content/, build/, site/ or any tracked file. Do NOT run git commands that modify state.

For EACH URL (base https://laroseclinics.com/), collect with Node (fetch) or Python (urllib) against the LIVE site:
1. HTTP status of the exact URL and of its `.html` / clean counterpart (follow redirects, record chain).
2. `<link rel="canonical">` value, `<meta name="robots">`, hreflang alternates.
3. Whether the canonical URL appears in the live https://laroseclinics.com/sitemap.xml (exact string match).
4. Inbound internal links: count of pages in local `site/` (built output) whose HTML contains an href resolving to this page (either clean or .html form). Report the count and up to 5 linking pages.
5. Main-content visible word count (strip nav/header/footer/script/style) and page type (article / qa / tip / category / legal / tool / branch / about / digital / list).
6. For articles: the source JSON file in content/ that holds it, its `date`, `updatedAt`, number of sources, `reviewedBy`.

Then classify each URL's most likely cause: (a) canonical/.html mismatch, (b) not in sitemap, (c) weak internal linking (<3 inbound), (d) thin content (<400 words for articles, <150 for tip/qa), (e) recently published/rewritten (<14 days, just wait), (f) low-value utility page (legal/tool/category/list — acceptable to stay unindexed), (g) other.

Also report site-wide: which URL form (clean vs .html) the canonicals, sitemap and internal links use, and whether they are consistent.

OUTPUT: write `_project/GSC-NOT-INDEXED-DIAGNOSIS-2026-09-27.md` with a table (URL | status | canonical | in sitemap | inbound links | words | type | cause) and a "Recommended source fixes" section grouped by cause, naming the exact content/*.json or build/*.mjs files to change. Also write the raw data to `_project/gsc-notindexed-diagnosis-2026-09-27.json`.
Self-check: every URL from both sections appears exactly once in the table. Put a scratch script, if any, under `_project/scratch/`.
