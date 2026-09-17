"""Build the maintained SEO content-cluster workbook from live source content.

The workbook intentionally preserves empty Keyword Planner and Search Console
columns.  Populate those only from the authorised Google accounts; this script
never invents search volume, competition, clicks or rankings.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter


ROOT = Path(__file__).resolve().parents[1]
BASE = "https://laroseclinics.com"
ARTICLE_FILES = (
    "articles.json",
    "articles-fatty-liver-rewrite-2026-09-14.json",
    "articles-ultrasound-rewrite-2026-09-14.json",
    "articles-abdominal-ultrasound-preparation-rewrite-2026-09-17.json",
    "articles-liver-tests-rewrite-2026-09-17.json",
    "articles-gerd-rewrite-2026-09-17.json",
    "articles-colonoscopy-preparation-rewrite-2026-09-17.json",
    "articles-normal-ultrasound-rewrite-2026-09-17.json",
    "articles-fatty-liver-fibrosis-rewrite-2026-09-17.json",
    "articles-hypothyroidism-weight-rewrite-2026-09-17.json",
    "articles-kidney-stones-rewrite-2026-09-17.json",
    "articles-diabetes-review-rewrite-2026-09-17.json",
    "articles-dark-neck-rewrite-2026-09-14.json",
    "articles-dark-neck-pregnancy-rewrite-2026-09-16.json",
    "articles-h-pylori-bloating-rewrite-2026-09-16.json",
    "articles-insulin-resistance-rewrite-2026-09-16.json",
    "articles-teen-eating-concern-rewrite-2026-09-16.json",
    "articles-gastroscopy-colonoscopy-rewrite-2026-09-17.json",
    "articles-mesotherapy-rewrite-2026-09-14.json",
    "articles-ibs-rewrite-2026-09-14.json",
    "articles-body-composition-rewrite-2026-09-14.json",
    "articles-bariatric-vitamin-rewrite-2026-09-14.json",
    "articles-gallstones-rewrite-2026-09-14.json",
    "articles-gallbladder-surgery-rewrite-2026-09-14.json",
    "articles-gallbladder-recovery-rewrite-2026-09-14.json",
    "articles-gallbladder-pregnancy-rewrite-2026-09-15.json",
    "articles-expansion-2026-09-11.json",
    "articles-longform-2026-09-12.json",
)
SERVICE_CATEGORY = {
    "Bariatric surgery": "bariatric-surgery",
    "Body contouring": "body-contouring",
    "Body composition/InBody": "clinical-nutrition",
    "Clinical nutrition": "clinical-nutrition",
    "Dermatology": "dermatology",
    "Gastro / liver / endoscopy": "gastroenterology-hepatology",
    "General surgery": "general-surgery",
    "Internal medicine": "internal-medicine",
    "Paediatrics": "pediatrics",
    "Ultrasound": "ultrasound",
    "Weight management": "weight-management",
}
STOP = {"the", "and", "for", "with", "what", "when", "from", "this", "that", "your", "الى", "على", "في", "من", "عن", "هل", "ما", "اي", "إيه"}


def value(obj, lang):
    return (obj or {}).get(lang, "") if isinstance(obj, dict) else str(obj or "")


def tokens(text):
    return {x for x in re.findall(r"[\w]+", str(text).casefold(), flags=re.UNICODE)
            if len(x) > 2 and x not in STOP}


def canonical(slug, lang="en"):
    return f"{BASE}/{lang}/articles/{slug}"


def category_url(category, lang="en"):
    return f"{BASE}/{lang}/articles/category-{category}"


def read_articles():
    articles = []
    for filename in ARTICLE_FILES:
        with (ROOT / "content" / filename).open(encoding="utf-8") as handle:
            articles.extend(json.load(handle).get("articles", []))
    # A targeted editorial replacement keeps the pre-existing canonical slug;
    # retain the final record so the readiness sheet describes published output.
    by_slug = {}
    for article in articles:
        by_slug[article.get("slug")] = article
    return list(by_slug.values())


def words(article):
    text = " ".join(value(section.get("body"), "en") for section in article.get("sections", []))
    return len(re.findall(r"\b\w+\b", text))


def best_article(keyword, category, by_category):
    needle = tokens(keyword)
    candidates = by_category.get(category, [])
    scored = []
    for article in candidates:
        haystack = tokens(" ".join([
            value(article.get("title"), "en"), value(article.get("title"), "ar"),
            " ".join(value(article.get("tags"), "en")),
            " ".join(value(article.get("tags"), "ar")),
        ]))
        overlap = len(needle & haystack)
        if overlap:
            scored.append((overlap / max(1, len(needle)), overlap, article))
    if not scored:
        return None, 0
    scored.sort(key=lambda item: (item[0], item[1], words(item[2])), reverse=True)
    score, _, article = scored[0]
    return article, score


def proposed_url(keyword, category):
    digest = hashlib.sha1(f"{category}|{keyword.casefold()}".encode("utf-8")).hexdigest()[:8]
    return f"{BASE}/en/articles/{category}-topic-{digest}"


def style_sheet(ws, widths):
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = ws.dimensions
    for cell in ws[1]:
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill("solid", fgColor="556B5B")
        cell.alignment = Alignment(wrap_text=True, vertical="center")
    ws.row_dimensions[1].height = 32
    for i, width in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = width
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(vertical="top", wrap_text=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--keywords", type=Path, default=ROOT / "_project" / "KEYWORD-RESEARCH-2026-09-10.xlsx")
    parser.add_argument("--output", type=Path, default=ROOT / "_project" / f"SEO-CONTENT-CLUSTER-PLAN-{date.today():%Y-%m-%d}.xlsx")
    parser.add_argument("--gsc-snapshot", type=Path, default=ROOT / "_project" / "GSC-SNAPSHOT-2026-09-14.json")
    args = parser.parse_args()

    articles = read_articles()
    by_category = defaultdict(list)
    for article in articles:
        by_category[article.get("category", "general")].append(article)

    source = load_workbook(args.keywords, read_only=True, data_only=True)["All keywords (ranked)"]
    keywords = list(source.iter_rows(min_row=2, values_only=True))
    wb = Workbook()
    overview = wb.active
    overview.title = "Read me"
    overview.append(["SEO content cluster plan", f"Generated {date.today():%Y-%m-%d}"])
    overview.append(["Purpose", "One canonical target URL per keyword intent, based on the live 177-record Knowledge Centre inventory."])
    overview.append(["Data rule", "Keyword Planner and Search Console fields are intentionally blank until exported from the authorised Google accounts. Do not estimate them."])
    overview.append(["Cannibalisation rule", "Only one row may be marked Primary per keyword family. Reuse its target URL; link supporting pages to it instead of creating a near-duplicate."])
    overview.append(["Internal-link rule", "Each new or revised article links to its cluster hub, its primary target (when different), and 2–5 contextually relevant sibling pages. Link only where it answers the reader's next question."])
    overview.append(["URL rule", "Existing targets are locked. Proposed URLs are stable placeholders only; approve a readable slug before publishing, then update every row in the same keyword family."])
    overview.append(["Refresh cadence", "Monthly: import GSC query/page data, update Planner metrics when strategy changes, review low-confidence assignments, and re-check planned URLs before writing."])
    overview.column_dimensions["A"].width = 25
    overview.column_dimensions["B"].width = 120
    for row in overview.iter_rows():
        for cell in row:
            cell.alignment = Alignment(vertical="top", wrap_text=True)
    overview["A1"].font = Font(bold=True, color="FFFFFF")
    overview["A1"].fill = PatternFill("solid", fgColor="556B5B")
    overview["B1"].font = Font(bold=True, color="FFFFFF")
    overview["B1"].fill = PatternFill("solid", fgColor="556B5B")

    if args.gsc_snapshot.exists():
        snapshot = json.loads(args.gsc_snapshot.read_text(encoding="utf-8"))
        gsc = wb.create_sheet("GSC snapshot")
        gsc.append(["Search Console snapshot", snapshot.get("observedOn", "")])
        for label, key in (("Property", "property"), ("Source", "source"), ("Report range", "reportRange"), ("Last update", "lastUpdate"), ("Indexing observation", "indexingObservation"), ("Keyword Planner observation", "keywordPlannerObservation")):
            gsc.append([label, snapshot.get(key, "")])
        gsc.append(["Clicks", "Impressions", "CTR", "Average position"])
        totals = snapshot.get("totals", {})
        gsc.append([totals.get("clicks", ""), totals.get("impressions", ""), totals.get("ctr", ""), totals.get("averagePosition", "")])
        gsc.append([])
        gsc.append(["Query", "Clicks", "Impressions"])
        for query, clicks, impressions in snapshot.get("queries", []):
            gsc.append([query, clicks, impressions])
        style_sheet(gsc, [50, 24, 18, 20])

    inventory = wb.create_sheet("Current URL inventory")
    inventory.append(["Type", "Cluster", "Sub-cluster", "Slug", "Title (EN)", "Title (AR)", "Canonical EN", "Canonical AR", "Published", "English words", "Source count", "Long-form readiness", "Internal-link role"])
    for article in sorted(articles, key=lambda a: (a.get("category", ""), a.get("slug", ""))):
        cat = article.get("category", "general")
        tags = value(article.get("tags"), "en")
        source_count = len(article.get("sources", []))
        is_long_form = article.get("type") in {"article", "update"}
        readiness = ("Not in long-form scope" if not is_long_form else
                     "Ready" if words(article) >= 1200 and source_count >= 10 else
                     f"Needs {max(0, 1200 - words(article))} words; {max(0, 10 - source_count)} sources")
        inventory.append([
            article.get("type"), cat, ", ".join(tags[:3]) if isinstance(tags, list) else "",
            article.get("slug"), value(article.get("title"), "en"), value(article.get("title"), "ar"),
            canonical(article.get("slug"), "en"), canonical(article.get("slug"), "ar"),
            article.get("published"), words(article), source_count, readiness,
            "Hub" if article.get("slug", "").startswith("category-") else "Supporting page",
        ])
    style_sheet(inventory, [12, 25, 30, 42, 54, 54, 58, 58, 12, 14, 14, 30, 20])

    readiness_sheet = wb.create_sheet("Editorial readiness")
    readiness_sheet.append(["Priority", "Type", "Cluster", "Slug", "Title (EN)", "Canonical EN", "English words", "Source count", "Required words", "Required sources", "Status", "Next action"])
    long_form = [a for a in articles if a.get("type") in {"article", "update"}]
    long_form.sort(key=lambda a: (words(a) >= 1200 and len(a.get("sources", [])) >= 10, a.get("category", ""), a.get("slug", "")))
    for article in long_form:
        count = words(article)
        source_count = len(article.get("sources", []))
        complete = count >= 1200 and source_count >= 10
        readiness_sheet.append([
            "Completed" if complete else "Rewrite queue", article.get("type"), article.get("category"), article.get("slug"),
            value(article.get("title"), "en"), canonical(article.get("slug")), count, source_count, 1200, 10,
            "Ready" if complete else "Incomplete", "Keep canonical URL; run SERP review, write original update, add numbered citations and contextual internal links." if not complete else "Monitor GSC and refresh when evidence or SERP intent changes.",
        ])
    style_sheet(readiness_sheet, [16, 12, 25, 42, 54, 58, 15, 14, 15, 16, 16, 76])

    plan = wb.create_sheet("Keyword allocation")
    headers = ["Priority", "Keyword", "Language", "Intent", "Cluster", "Sub-cluster / seed", "Local", "Keyword type", "Words", "Target status", "Locked canonical EN", "Locked canonical AR", "Assignment confidence", "Keyword Planner avg monthly searches", "Keyword Planner competition", "Keyword Planner low bid", "Keyword Planner high bid", "GSC clicks", "GSC impressions", "GSC CTR", "GSC average position", "Decision"]
    plan.append(headers)
    gaps = {}
    for rank, keyword, lang, intent, service, local, kind, word_count, priority, seed in keywords:
        category = SERVICE_CATEGORY.get(service, "general")
        intent = intent or ""
        if intent in {"Transactional", "Commercial", "Local"}:
            en_url = f"{BASE}/en/specialties/{category}"
            ar_url = f"{BASE}/ar/specialties/{category}"
            status, confidence = "Existing service page", "High"
        else:
            article, score = best_article(keyword, category, by_category)
            if article and score >= 0.34:
                en_url, ar_url = canonical(article["slug"], "en"), canonical(article["slug"], "ar")
                status = "Existing article"
                confidence = "High" if score >= 0.67 else "Review"
            else:
                en_url = proposed_url(keyword, category)
                ar_url = en_url.replace("/en/", "/ar/")
                status, confidence = "Proposed: confirm before writing", "Review"
                gaps.setdefault((category, str(seed or keyword).casefold()), (keyword, service, en_url, ar_url))
        decision = "Primary target: do not create a competing page" if status.startswith("Existing") else "Check SERP + Planner/GSC before approving this new URL"
        plan.append([priority, keyword, lang, intent, service, seed, local, kind, word_count, status, en_url, ar_url, confidence, "", "", "", "", "", "", "", "", decision])
    style_sheet(plan, [10, 42, 10, 16, 28, 34, 10, 14, 9, 28, 58, 58, 20, 19, 18, 16, 16, 13, 15, 12, 18, 48])

    clusters = wb.create_sheet("Clusters and gaps")
    clusters.append(["Cluster", "Existing records", "Keyword count", "Informational gaps needing review", "Cluster hub EN", "Cluster hub AR", "Editorial guardrail"])
    count_by_service = Counter(row[4] for row in keywords)
    for service, category in sorted(SERVICE_CATEGORY.items()):
        listed_gaps = [value for key, value in gaps.items() if key[0] == category]
        clusters.append([service, len(by_category.get(category, [])), count_by_service[service], len(listed_gaps), category_url(category, "en"), category_url(category, "ar"), "Assign every proposed topic to an existing primary target or approve one new canonical URL before drafting."])
    style_sheet(clusters, [28, 16, 15, 27, 58, 58, 72])

    proposed = wb.create_sheet("Proposed URLs")
    proposed.append(["Cluster", "Seed / keyword family", "Representative keyword", "Proposed canonical EN", "Proposed canonical AR", "Status", "SERP review", "Duplicate check", "Next action"])
    for category, seed in sorted(gaps):
        keyword, service, en_url, ar_url = gaps[(category, seed)]
        proposed.append([service, seed, keyword, en_url, ar_url, "Do not publish yet", "Required: inspect top 10 results", "Required: compare with existing inventory", "Approve a readable slug, then update all rows in this family."])
    style_sheet(proposed, [28, 36, 42, 58, 58, 20, 28, 30, 54])

    links = wb.create_sheet("Internal linking queue")
    links.append(["Source page EN", "Source title", "Cluster hub EN", "Suggested sibling links", "Rule"])
    for article in sorted(articles, key=lambda a: a.get("slug", "")):
        cat = article.get("category", "general")
        siblings = [canonical(x["slug"]) for x in by_category[cat] if x["slug"] != article["slug"]][:5]
        links.append([canonical(article["slug"]), value(article.get("title"), "en"), category_url(cat), "\n".join(siblings), "Use only contextual anchors that help the reader continue the same journey."])
    style_sheet(links, [58, 54, 58, 76, 55])

    args.output.parent.mkdir(parents=True, exist_ok=True)
    wb.save(args.output)
    print(f"Wrote {args.output}")
    print(f"Inventory rows: {len(articles)}; keyword rows: {len(keywords)}; proposed URL families: {len(gaps)}")


if __name__ == "__main__":
    main()
