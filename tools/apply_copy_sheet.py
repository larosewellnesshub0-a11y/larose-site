# -*- coding: utf-8 -*-
"""
Apply a returned COPY-EDITING.xlsx back into the content files and templates.

Pairs with tools/build_copy_sheet.py. Reads the two shaded columns, ignores
every blank one (blank means "no change"), and writes the rest back using the
Key column.

Safety, in order:
  * every content file is backed up to content/_backups/ before anything writes
  * a row whose "Current" text no longer matches the file is REPORTED and
    SKIPPED, not applied. That is the case where the site moved on after the
    sheet was sent, and blindly applying would silently revert newer copy.
  * house rules are enforced on the incoming text: no em dash, no price, no
    medical disclaimer, no feminine second-person address. A row that breaks
    one is skipped and listed.
  * nothing is written at all unless --write is passed, so the default run is
    a dry-run report.

Run:  python tools/apply_copy_sheet.py COPY-EDITING.xlsx           (dry run)
      python tools/apply_copy_sheet.py COPY-EDITING.xlsx --write
"""
import json, io, os, re, sys, glob, shutil, datetime
from openpyxl import load_workbook

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

FEM = ["احجزي", "جهّزي", "جهزي", "اختاري", "حضّري", "حضري", "تعالي", "ابعتي",
       "اكتبي", "اسألي", "سجّلي", "سجلي", "تابعي", "راجعي", "ابدئي", "اشربي",
       "قيسي", "تشخّصي", "تشخصي", "بتحسي", "معاكي", "ليكي", "انتي"]
PRICE = re.compile(r"\d[\d,\.]*\s*(جنيه|ج\.?م|EGP|LE\b)", re.I)
DISCLAIM = re.compile(r"(بديل عن الكشف|مش بديل عن|إخلاء مسؤولية|not a substitute for)", re.I)


def house_rules(text):
    """Return a list of reasons this text may not go on the site."""
    bad = []
    if "—" in text:
        bad.append("em dash")
    if PRICE.search(text):
        bad.append("price")
    if DISCLAIM.search(text):
        bad.append("medical disclaimer")
    hits = [w for w in FEM if w in text]
    if hits:
        bad.append("feminine address: " + ", ".join(hits))
    return bad


# ------------------------------------------------------------------- json ---
def get_path(obj, path):
    for seg in [p for p in path.split(".") if p]:
        if isinstance(obj, list):
            match = None
            for i, item in enumerate(obj):
                if isinstance(item, dict) and item.get("slug") == seg:
                    match = item
                    break
            if match is None:
                try:
                    match = obj[int(seg)]
                except (ValueError, IndexError):
                    return None
            obj = match
        elif isinstance(obj, dict):
            if seg not in obj:
                return None
            obj = obj[seg]
        else:
            return None
    return obj


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    path = sys.argv[1]
    write = "--write" in sys.argv

    ws = load_workbook(path)["Copy"]
    jsons = {}
    for p in glob.glob("content/*.json"):
        jsons[os.path.splitext(os.path.basename(p))[0]] = json.load(io.open(p, encoding="utf-8"))
    templates = {}

    applied, skipped, rejected = [], [], []

    for r in range(2, ws.max_row + 1):
        key = ws.cell(row=r, column=1).value
        if not key:
            continue
        cur_ar = ws.cell(row=r, column=4).value or ""
        new_ar = (ws.cell(row=r, column=5).value or "").strip()
        cur_en = ws.cell(row=r, column=6).value or ""
        new_en = (ws.cell(row=r, column=7).value or "").strip()
        if not new_ar and not new_en:
            continue

        for text, lang in ((new_ar, "ar"), (new_en, "en")):
            if not text:
                continue
            bad = house_rules(text) if lang == "ar" else (["em dash"] if "—" in text else [])
            if PRICE.search(text):
                bad.append("price")
            if bad:
                rejected.append((r, key, lang, "; ".join(sorted(set(bad)))))

        if any(x[0] == r for x in rejected):
            continue

        kind = key.split("|")[0]
        if kind == "json":
            _, fkey, jpath = key.split("|", 2)
            node = get_path(jsons.get(fkey), jpath)
            if not isinstance(node, dict):
                skipped.append((r, key, "path not found"))
                continue
            live_ar = node.get("ar", "")
            live_ar = "\n".join(live_ar) if isinstance(live_ar, list) else live_ar
            if str(live_ar).strip() != str(cur_ar).strip():
                skipped.append((r, key, "site text changed since the sheet was made"))
                continue
            if new_ar:
                node["ar"] = new_ar
            if new_en:
                node["en"] = new_en
            applied.append((r, key))
        elif kind == "tpl":
            _, page, n = key.split("|")
            p = f"build/pages/{page}.mjs"
            if p not in templates:
                templates[p] = io.open(p, encoding="utf-8").read()
            pair = re.compile(r'ar:\s*"((?:[^"\\]|\\.)*)"\s*,\s*en:\s*"((?:[^"\\]|\\.)*)"', re.S)
            matches = [m for m in pair.finditer(templates[p])
                       if len(m.group(1).replace('\\"', '"')) >= 40]
            idx = int(n) - 1
            if idx >= len(matches):
                skipped.append((r, key, "template string no longer present"))
                continue
            m = matches[idx]
            if m.group(1).replace('\\"', '"').strip() != str(cur_ar).strip():
                skipped.append((r, key, "template text changed since the sheet was made"))
                continue
            esc = lambda s: s.replace("\\", "\\\\").replace('"', '\\"')
            ar = esc(new_ar) if new_ar else m.group(1)
            en = esc(new_en) if new_en else m.group(2)
            templates[p] = templates[p][:m.start()] + f'ar: "{ar}", en: "{en}"' + templates[p][m.end():]
            applied.append((r, key))
        else:
            skipped.append((r, key, "unknown key type"))

    print(f"rows to apply : {len(applied)}")
    print(f"rows skipped  : {len(skipped)}")
    print(f"rows rejected : {len(rejected)}")
    for r, key, lang, why in rejected:
        print(f"  REJECT row {r} [{lang}] {key}: {why}")
    for r, key, why in skipped:
        print(f"  SKIP   row {r} {key}: {why}")

    if not write:
        print("\ndry run. re-run with --write to apply.")
        return 0

    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    os.makedirs("content/_backups", exist_ok=True)
    for f in glob.glob("content/*.json"):
        shutil.copy2(f, os.path.join("content/_backups",
                                     f"{stamp}-{os.path.basename(f)}"))
    for fkey, data in jsons.items():
        io.open(f"content/{fkey}.json", "w", encoding="utf-8").write(
            json.dumps(data, ensure_ascii=False, indent=2))
    for p, s in templates.items():
        io.open(p, "w", encoding="utf-8").write(s)
    print(f"\nwritten. backups in content/_backups/{stamp}-*")
    print("now run: node build/build.mjs && node tools/validate.mjs")
    return 0


if __name__ == "__main__":
    sys.exit(main())
