# -*- coding: utf-8 -*-
"""
Build COPY-EDITING.xlsx: every editable string on the site, in one sheet, with
an empty column for the client's rewrite.

The point is a round trip. The client fills in "Your new Arabic" / "Your new
English", sends the file back, and `tools/apply_copy_sheet.py` writes it
straight into the content files and templates. The `Key` column is what makes
that possible, so it must survive the round trip untouched.

Two kinds of key:
  json|<file>|<dotted path>   a bilingual {ar, en} pair inside content/*.json
  tpl|<page>|<n>              the nth long bilingual pair in build/pages/<page>.mjs

Run:  python tools/build_copy_sheet.py
"""
import json, io, os, re, glob
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
OUT = os.path.join(ROOT, "COPY-EDITING.xlsx")
SITE_URL = "http://localhost:4173"          # rewritten by the header note

OLIVE = "333524"; OLIVE_LT = "E7E6CF"; CHAMP = "D4B793"
PAPER = "FBF9F4"; LINE = "E2DECE"; FILLME = "FFF6E8"

H_FILL = PatternFill("solid", fgColor=OLIVE)
H_FONT = Font(bold=True, color="FFFFFF", size=11)
EDIT_FILL = PatternFill("solid", fgColor=FILLME)
THIN = Side(style="thin", color=LINE)
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(wrap_text=True, vertical="top")
WRAP_RTL = Alignment(wrap_text=True, vertical="top", readingOrder=2)


# ---------------------------------------------------------------- locations --
def page_for(file_key, path):
    """Page URL for a content path, so the client can see the string in context.

    Every candidate is checked against the generated site before it is printed.
    Guessing produced links like /ar/articles/clinical-nutrition.html for an
    article *category*, whose real page is category-clinical-nutrition.html, and
    a wrong link is worse than an honest section link."""
    parts = [p for p in path.split(".") if p]
    if file_key == "site":
        return "(every page)"
    if file_key == "reviews":
        return "/ar/about/reviews.html"

    folder = {"specialties": "specialties", "doctors": "doctors",
              "articles": "articles", "branches": "branches",
              "digital": "digital"}.get(file_key)
    if not folder:
        return "/ar/index.html"

    for seg in parts:                          # try each path segment as a slug
        for name in (seg, f"category-{seg}"):
            rel = f"ar/{folder}/{name}.html"
            if os.path.exists(os.path.join("site", rel)):
                return "/" + rel
    return f"/ar/{folder}/index.html"


SECTION = {
    "site": "Global (header, nav, footer, buttons)",
    "specialties": "Specialties",
    "doctors": "Doctors",
    "branches": "Branches",
    "articles": "Knowledge Centre",
    "reviews": "Reviews",
    "digital": "La Rose Digital",
}
PAGE_SECTION = {
    "about": "About La Rose", "patients": "Patient guide", "home": "Home page",
    "articles": "Knowledge Centre", "specialties": "Specialties",
    "doctors": "Doctors", "branches": "Branches", "digital": "La Rose Digital",
    "tools": "Medical tools", "home-visits": "Home visits",
    "legal": "Legal pages", "misc": "Contact and other",
}


def slug_of(node, fallback):
    """Prefer a human-readable id when walking a list of records."""
    if isinstance(node, dict):
        for k in ("slug", "id", "key"):
            if isinstance(node.get(k), str):
                return node[k]
    return fallback


def walk(node, file_key, path, rows):
    """Collect every {ar, en} pair. Those pairs are the unit the site renders,
    so they are also the unit the client should edit."""
    if isinstance(node, dict):
        if "ar" in node and isinstance(node.get("ar"), (str, list)):
            ar, en = node.get("ar"), node.get("en", "")
            if isinstance(ar, list):
                ar = "\n".join(str(x) for x in ar)
                en = "\n".join(str(x) for x in (en or []))
            if ar and len(str(ar).strip()) > 1:
                rows.append((f"json|{file_key}|{path}", file_key, path, str(ar), str(en or "")))
            return
        for k, v in node.items():
            if k.startswith("_"):
                continue                      # internal notes, never rendered
            walk(v, file_key, f"{path}.{k}" if path else k, rows)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(v, file_key, f"{path}.{slug_of(v, i)}", rows)


def template_rows(rows):
    """The long prose that lives in the page modules rather than in JSON."""
    pair = re.compile(r'ar:\s*"((?:[^"\\]|\\.)*)"\s*,\s*en:\s*"((?:[^"\\]|\\.)*)"', re.S)
    for p in sorted(glob.glob("build/pages/*.mjs")):
        page = os.path.splitext(os.path.basename(p))[0]
        s = io.open(p, encoding="utf-8").read()
        for i, m in enumerate(pair.finditer(s), 1):
            ar = m.group(1).replace('\\"', '"')
            en = m.group(2).replace('\\"', '"')
            if len(ar) < 40:
                continue                      # button labels live in site.json
            rows.append((f"tpl|{page}|{i}", f"page:{page}", page, ar, en))


def main():
    rows = []
    for p in sorted(glob.glob("content/*.json")):
        key = os.path.splitext(os.path.basename(p))[0]
        if key.startswith("_"):
            continue
        walk(json.load(io.open(p, encoding="utf-8")), key, "", rows)
    template_rows(rows)

    wb = Workbook()
    ws = wb.active
    ws.title = "Copy"

    headers = ["Key (do not edit)", "Section", "Where it appears",
               "Current Arabic", "Your new Arabic",
               "Current English", "Your new English", "Notes"]
    ws.append(headers)
    for c in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=c)
        cell.fill = H_FILL
        cell.font = H_FONT
        cell.alignment = Alignment(vertical="center", wrap_text=True)

    for key, file_key, path, ar, en in rows:
        section = SECTION.get(file_key, PAGE_SECTION.get(path, file_key))
        where = page_for(file_key, path) if not file_key.startswith("page:") \
            else f"/ar/  ({path} page)"
        ws.append([key, section, where, ar, "", en, "", ""])

    widths = [34, 22, 30, 62, 62, 62, 62, 26]
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w

    for r in range(2, ws.max_row + 1):
        for c in range(1, len(headers) + 1):
            cell = ws.cell(row=r, column=c)
            cell.border = BORDER
            # Arabic columns are laid out right to left so they read naturally
            cell.alignment = WRAP_RTL if c in (4, 5) else WRAP
            if c in (5, 7, 8):
                cell.fill = EDIT_FILL          # the columns to fill in
        ws.row_dimensions[r].height = 78

    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{ws.max_row}"

    # a short how-to, so the file explains itself without a covering email
    doc = wb.create_sheet("How to use")
    for line in [
        ["How to use this sheet"],
        [""],
        ["1. Only fill in the shaded columns: 'Your new Arabic', 'Your new English' and 'Notes'."],
        ["2. Leave a row blank if you are happy with the current text. Blank means 'no change'."],
        ["3. Never edit column A. It is how each line is put back on the right page."],
        ["4. Do not add, delete, sort or reorder rows. Use the filter instead."],
        ["5. Send the file back and it will be applied to the site automatically."],
        [""],
        ["House rules the copy must follow:"],
        ["  - Arabic is addressed to the reader in the masculine (احجز, not احجزي)."],
        ["  - No prices anywhere. Prices live in the dashboard only."],
        ["  - No em dashes. Use a comma, or a colon before a list."],
        ["  - No medical disclaimers."],
        ["  - Do not add a fact the clinic cannot stand behind."],
        [""],
        [f"Rows in this sheet: {len(rows)}"],
    ]:
        doc.append(line)
    doc.column_dimensions["A"].width = 100
    doc["A1"].font = Font(bold=True, size=14, color=OLIVE)
    doc["A9"].font = Font(bold=True, size=11, color=OLIVE)

    wb.save(OUT)
    print(f"wrote {OUT} with {len(rows)} editable strings")


if __name__ == "__main__":
    main()
