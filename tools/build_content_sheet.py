#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Builds CONTENT-REQUIREMENTS.xlsx from the live content files and the generated
site, so the sheet can never drift from the build.

Run:  python tools/build_content_sheet.py
"""

import json, io, os, re, glob, datetime
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(ROOT, "content")
SITE = os.path.join(ROOT, "site")
OUT = os.path.join(ROOT, "CONTENT-REQUIREMENTS.xlsx")

# ---- brand styling ---------------------------------------------------------
OLIVE = "333524"; OLIVE_LT = "E7E6CF"; CHAMP = "D4B793"; ROSE = "CB8587"
PAPER = "FBF9F4"; LINE = "E2DECE"

H_FILL = PatternFill("solid", fgColor=OLIVE)
H_FONT = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
SUB_FILL = PatternFill("solid", fgColor=OLIVE_LT)
SUB_FONT = Font(name="Calibri", size=11, bold=True, color=OLIVE)
BODY = Font(name="Calibri", size=10)
WRAP = Alignment(wrap_text=True, vertical="top")
TOP = Alignment(vertical="top")
THIN = Side(style="thin", color=LINE)
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

PRIORITY_FILL = {
    "عاجل / Urgent":   PatternFill("solid", fgColor="F7D9D9"),
    "مهم / Important": PatternFill("solid", fgColor="F4EBDD"),
    "لاحقاً / Later":  PatternFill("solid", fgColor="EFEFE6"),
}


def load(name):
    with io.open(os.path.join(CONTENT, name), encoding="utf-8") as f:
        return json.load(f)


def sheet(wb, title, headers, widths):
    ws = wb.create_sheet(title)
    ws.sheet_view.rightToLeft = True
    ws.append(headers)
    for i, h in enumerate(headers, 1):
        c = ws.cell(row=1, column=i)
        c.fill = H_FILL; c.font = H_FONT; c.alignment = WRAP; c.border = BOX
        ws.column_dimensions[get_column_letter(i)].width = widths[i - 1]
    ws.row_dimensions[1].height = 30
    ws.freeze_panes = "A2"
    return ws


def add(ws, row, fill=None):
    ws.append(row)
    r = ws.max_row
    for i in range(1, len(row) + 1):
        c = ws.cell(row=r, column=i)
        c.font = BODY; c.alignment = WRAP; c.border = BOX
        if fill:
            c.fill = fill
    return r


def walk_todos(obj, path=""):
    """Every _todo / empty required field, with its exact JSON path."""
    found = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            p = f"{path}.{k}" if path else k
            if k == "_todo" and isinstance(v, str):
                found.append((path, v))
            elif k == "_note" or k == "_evidence" or k == "_source":
                continue
            else:
                found.extend(walk_todos(v, p))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            found.extend(walk_todos(v, f"{path}[{i}]"))
    return found


def main():
    site = load("site.json")
    specs = load("specialties.json")["specialties"]
    docs = load("doctors.json")["doctors"]
    branches = load("branches.json")["branches"]
    arts = load("articles.json")
    reviews = load("reviews.json")
    digital = load("digital.json")

    wb = Workbook(); wb.remove(wb.active)

    # ================= 1. OVERVIEW =====================================
    ws = sheet(wb, "نظرة عامة Overview",
               ["البند / Item", "العدد / Count", "الحالة / Status", "ملاحظات / Notes"],
               [34, 12, 22, 74])
    pages = [p for p in glob.glob(os.path.join(SITE, "**", "*.html"), recursive=True)
             if not os.path.basename(p).startswith("_")]
    ar_pages = [p for p in pages if os.sep + "ar" + os.sep in p]
    staffed = [s for s in specs if s.get("staffed")]
    real_docs = [d for d in docs if not d.get("sample")]
    sample_docs = [d for d in docs if d.get("sample")]

    rows = [
        ("إجمالي الصفحات / Total pages", len(pages), "تم / Done",
         "كل صفحة موجودة بالعربي والإنجليزي / Every page exists in both Arabic and English"),
        ("صفحات لكل لغة / Pages per language", len(ar_pages), "تم / Done", ""),
        ("التخصصات / Specialties", len(specs), "تم / Done",
         f"{len(staffed)} بأطباء، {len(specs)-len(staffed)} في انتظار الطبيب / {len(staffed)} staffed, {len(specs)-len(staffed)} awaiting a doctor"),
        ("الأطباء / Doctors", len(docs),
         "يحتاج مراجعة / Needs review",
         f"{len(real_docs)} حقيقي، {len(sample_docs)} مثال توضيحي لازم يتستبدل / {len(real_docs)} real, {len(sample_docs)} sample cards to replace"),
        ("الفروع / Branches", len(branches), "يحتاج بيانات / Needs data",
         "المعادي مكتمل، التجمع والشيخ زايد محتاجين عنوان وموعد افتتاح / Maadi complete; the other two need an address and an opening date"),
        ("مقالات المركز المعرفي / Knowledge Centre entries", len(arts.get("articles", [])),
         "تم / Done", "مقالات، مستجدات علمية، أسئلة وأجوبة، نصائح يومية / articles, scientific updates, Q&A, daily tips"),
        ("آراء المرضى المنشورة / Published reviews", len(reviews.get("reviews", [])),
         "يحتاج إدخال / Needs input",
         "التقييم الإجمالي ٥.٠ من ١٣٨ حقيقي ومتحقق منه. نصوص المراجعات تتضاف من لوحة التحكم / The 5.0 from 138 aggregate is real and verified; review text is added from the dashboard"),
        ("المنتجات الرقمية / Digital products", len(digital.get("products", [])),
         "يحتاج سعر وصور / Needs price and imagery", ""),
    ]
    for r in rows:
        add(ws, list(r))

    # ================= 2. MISSING DATA =================================
    ws = sheet(wb, "النواقص Missing data",
               ["الأولوية / Priority", "الملف / File", "المكان / Location",
                "المطلوب / What is needed"],
               [18, 20, 34, 86])

    files = {"site.json": site, "specialties.json": {"specialties": specs},
             "doctors.json": {"doctors": docs}, "branches.json": {"branches": branches},
             "articles.json": arts, "reviews.json": reviews, "digital.json": digital}

    def priority(text):
        t = text.lower()
        if "urgent" in t or "عاجل" in t:
            return "عاجل / Urgent"
        if any(k in t for k in ["address", "opening", "price", "portrait", "photograph", "lawyer"]):
            return "مهم / Important"
        return "لاحقاً / Later"

    todo_rows = []
    for fname, data in files.items():
        for path, text in walk_todos(data):
            todo_rows.append((priority(text), fname, path or "—", text))

    order = {"عاجل / Urgent": 0, "مهم / Important": 1, "لاحقاً / Later": 2}
    todo_rows.sort(key=lambda r: order[r[0]])
    for r in todo_rows:
        add(ws, list(r), PRIORITY_FILL[r[0]])

    # ================= 3. PAGES ========================================
    ws = sheet(wb, "الصفحات Pages",
               ["الصفحة / Page", "المسار / Path", "القسم / Section",
                "حالة المحتوى / Content status", "المطلوب كتابته / Writing needed"],
               [34, 40, 20, 24, 66])

    def describe(rel):
        parts = rel.split("/")
        section = parts[1] if len(parts) > 2 else "root"
        return section

    seen = set()
    for p in sorted(ar_pages):
        rel = os.path.relpath(p, SITE).replace("\\", "/")
        key = rel.replace("ar/", "")
        if key in seen:
            continue
        seen.add(key)
        section = describe(rel)
        html = io.open(p, encoding="utf-8").read()
        title = re.search(r"<title>(.*?)</title>", html)
        title = title.group(1).split("|")[0].strip() if title else key
        has_todo = "TODO(clinic)" in html
        status = "يحتاج بيانات / Needs data" if has_todo else "جاهز / Ready"
        need = ""
        if has_todo:
            m = re.findall(r"TODO\(clinic\):\s*([^-]*?)-->", html)
            need = "; ".join(x.strip() for x in m)[:220]
        add(ws, [title, key, section, status, need],
            PRIORITY_FILL["مهم / Important"] if has_todo else None)

    # ================= 4. IMAGES =======================================
    ws = sheet(wb, "الصور Images",
               ["المكان / Where", "الملف المتوقع / Expected file", "المقاس / Size",
                "الحالة / Status", "ملاحظات / Notes"],
               [34, 42, 18, 22, 60])

    img_rows = [
        ("الشعار / Logo", "assets/img/logo/larose-wordmark.png", "984×849", "موجود / Present",
         "نسخة SVG مطلوبة للجودة على كل المقاسات / An SVG version is needed so it stays crisp at every size"),
        ("أيقونة الموقع / Favicon", "assets/img/logo/favicon.svg", "64×64", "موجود / Present", ""),
        ("صورة الهيرو / Home hero", "assets/img/clinic/maadi-reception.webp", "1200×675 +",
         "مؤقت / Interim",
         "الصورة الحالية لقطة موبايل تم تحسينها. صورة احترافية للاستقبال هتفرق كتير / The current image is a graded phone snapshot; a professional photograph of reception would make a real difference"),
    ]
    for b in branches:
        n = len(b.get("photos", []))
        img_rows.append((f"فرع {b['name']['ar']} / {b['name']['en']}",
                         f"assets/img/clinic/{b['slug']}-*.webp", "1600×900",
                         f"{n} صورة / {n} photos" if n else "مفقود / Missing",
                         "" if n else "محتاج صور للفرع / Photographs of this branch are needed"))
    for d in docs:
        img_rows.append((f"صورة {d['name']['ar']} / {d['name']['en']}",
                         d.get("portrait") or f"assets/img/doctors/{d['slug']}.jpg", "900×1125",
                         "موجود / Present" if d.get("portrait") else "مفقود / Missing",
                         "" if d.get("portrait") else "بورتريه بخلفية الأرش زي تصميمات العيادة / A portrait on the clinic's arch backdrop"))
    for s in specs:
        img_rows.append((f"تخصص {s['name']['ar']} / {s['name']['en']}",
                         f"assets/img/specialties/{s['slug']}.webp", "1200×750",
                         "مفقود / Missing",
                         "اختياري — الصفحة شغالة برسم الأيقونة / Optional: the page works with the icon treatment"))
    img_rows.append(("قبل وبعد / Before & after", "assets/img/before-after/*.webp", "1200×900",
                     "مفقود / Missing",
                     "لا تُنشر إلا بموافقة كتابية من المريض / Never published without written patient consent"))
    for r in img_rows:
        add(ws, list(r),
            PRIORITY_FILL["مهم / Important"] if "مفقود" in r[3] else None)

    # ================= 5. DOCTORS ======================================
    ws = sheet(wb, "الأطباء Doctors",
               ["الاسم / Name", "النوع / Type", "التخصصات / Specialties",
                "الأيام / Days", "صورة / Portrait", "المطلوب / What is needed"],
               [26, 20, 30, 22, 16, 56])
    for d in docs:
        typ = "مثال توضيحي / Sample" if d.get("sample") else "حقيقي / Real"
        need = d.get("_todo", "")
        if not d.get("credentials", {}).get("ar"):
            need = (need + " " if need else "") + "المؤهلات فاضية / Credentials are empty"
        add(ws, [d["name"]["ar"] + " / " + d["name"]["en"], typ,
                 ", ".join(d.get("specialties", [])),
                 d.get("days", {}).get("ar", "") or "—",
                 "نعم / Yes" if d.get("portrait") else "لا / No", need.strip()],
            PRIORITY_FILL["عاجل / Urgent"] if "URGENT" in need
            else PRIORITY_FILL["مهم / Important"] if (d.get("sample") or need) else None)

    # ================= 6. SPECIALTIES ==================================
    ws = sheet(wb, "التخصصات Specialties",
               ["التخصص / Specialty", "طبيب؟ / Staffed?", "الحالات / Conditions",
                "العلاجات / Treatments", "أسئلة / FAQs", "قبل وبعد / Before-after",
                "المطلوب / What is needed"],
               [32, 18, 14, 14, 12, 16, 52])
    for s in specs:
        need = "" if s.get("staffed") else "محتاج طبيب — الكارت الحالي مثال توضيحي / Needs a doctor; the current card is a sample"
        add(ws, [s["name"]["ar"] + " / " + s["name"]["en"],
                 "نعم / Yes" if s.get("staffed") else "لا / No",
                 len(s.get("treats", {}).get("ar", [])),
                 len(s.get("treatments", [])),
                 len(s.get("faq", [])),
                 "نعم / Yes" if s.get("hasBeforeAfter") else "لا / No",
                 need],
            None if s.get("staffed") else PRIORITY_FILL["مهم / Important"])

    # ================= 7. HOW TO USE ===================================
    ws = sheet(wb, "طريقة الاستخدام How to use",
               ["الخطوة / Step", "الشرح / Explanation"], [26, 108])
    steps = [
        ("١. افتحي الموقع / Open the site",
         "افتحي الملف site/index.html بالضغط عليه مرتين. الموقع شغال من غير أي سيرفر. / "
         "Double-click site/index.html. The site runs with no server at all."),
        ("٢. شغّلي لوحة التحكم / Start the dashboard",
         "من مجلد المشروع شغّلي الأمر: node server/serve.mjs — بعدها افتحي "
         "http://localhost:4173/dashboard/ / From the project folder run node server/serve.mjs, "
         "then open http://localhost:4173/dashboard/"),
        ("٣. عدّلي البيانات / Edit the content",
         "كل حاجة قابلة للتعديل من لوحة التحكم: الأطباء، التخصصات، الفروع، المقالات، "
         "الآراء، والصور. كل حقل ليه خانة بالعربي وخانة بالإنجليزي جنب بعض. / "
         "Everything is editable from the dashboard: doctors, specialties, branches, articles, "
         "reviews and images. Every field has an Arabic and an English box side by side."),
        ("٤. احفظي / Save",
         "زرار الحفظ بيكتب التغيير ويعيد بناء الموقع كله تلقائياً. آخر ٢٠ نسخة من كل ملف "
         "محفوظة في content/_backups/ / Saving writes the change and rebuilds the whole site "
         "automatically. The last 20 versions of each file are kept in content/_backups/"),
        ("٥. راجعي / Check",
         "شغّلي: node tools/validate.mjs — لازم يطلع صفر أخطاء قبل أي نشر / "
         "Run node tools/validate.mjs — it must report zero errors before any publish."),
        ("ملاحظة مهمة / Important note",
         "الأسعار مش بتظهر على الموقع نهائياً حسب قرارك. الأرقام الحقيقية محفوظة في لوحة "
         "التحكم ورا مفتاح إظهار مقفول، وفيه فحص بيمنع أي سعر إنه يوصل لصفحة عامة. / "
         "Prices never appear on the public site, per your decision. The real figures are held "
         "in the dashboard behind an off switch, and a check blocks any price from reaching a "
         "public page."),
    ]
    for s in steps:
        add(ws, list(s))

    wb.save(OUT)
    print("wrote", OUT)
    print("sheets:", wb.sheetnames)
    print("todos:", len(todo_rows), "| pages:", len(seen), "| images:", len(img_rows))


if __name__ == "__main__":
    main()
