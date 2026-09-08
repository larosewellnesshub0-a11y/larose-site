# -*- coding: utf-8 -*-
"""
Switch the Arabic voice from feminine second person to masculine/neutral
second person across all content and page modules.

Deliberately an EXPLICIT include-list rather than a regex on trailing ya.
A blanket rule destroys اللي / المعادي / الجسمي / متابعة / خطة جاهزة, which
are not addressing the reader at all.

Run:  python tools/degender.py            (apply)
      python tools/degender.py --dry      (report only)
"""
import io, os, re, glob, sys, collections

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DRY = "--dry" in sys.argv

# --- 1. whole-word map: imperatives -----------------------------------------
IMPERATIVES = """
أضيفي:أضِف أكدي:أكّد ابحثي:ابحث ابدئي:ابدأ ابعتي:ابعت اتبعي:اتبع اتصلي:اتصل
اتعرّفي:اتعرّف اتفقي:اتفق احتفظي:احتفظ احجزي:احجز احسبي:احسب احفظي:احفظ
اختاري:اختار ادخلي:ادخل اذكري:اذكر ارجعي:ارجع اسألي:اسأل استخدمي:استخدم
استكشفي:استكشف اشرحي:اشرح اضغطي:اضغط اطلبي:اطلب اعرفي:اعرف افتحي:افتح
اقري:اقرا اكتبي:اكتب التزمي:التزم امسحي:امسح املّي:املا هاتي:هات
وابعتي:وابعت تابعي:تابع وتابعي:وتابع تجنّبي:تجنّب راجعي:راجع وراجعي:وراجع
شوفي:شوف وشوفي:وشوف قوليلي:قوللي كلّمينا:كلّمنا كلمينا:كلمنا
"""

# --- 2. past tense, 2nd person feminine -------------------------------------
PAST = """
بدأتي:بدأت زرتي:زرت فشلتي:فشلت فقدتي:فقدت قستي:قست نزلتي:نزلت نسيتي:نسيت
تبعتي:تبعت اتفقتِ:اتفقت اخترتِ:اخترت جرّبتِ:جرّبت قدرتِ:قدرت ورجعتِ:ورجعت
جربتي:جربت اتفقتي:اتفقت اخترتي:اخترت حسيتي:حسيت
"""

# --- 3. pronouns and attached pronouns --------------------------------------
PRONOUNS = """
انتِ:انت إنتِ:إنت انتي:انتي_MASC وانتِ:وانت وإنتِ:وإنت
معاكي:معاك ليكي:ليك بيكي:بيك مانعاكي:مانعاك وشكواكي:وشكواك
يناسبوكي:يناسبوك بتحميكي:بتحميك بتديكي:بتديك وتديكي:وتديك
مدايقاكي:مدايقك بتدايقكي:بتدايقك عندكي:عندك جسمكي:جسمك حالتكي:حالتك
"""

# --- 4. present tense, 2nd person feminine ----------------------------------
#      Only forms that genuinely address the reader. Third-person feminine
#      verbs (بتتبني، بتغطي، تعني، تحمي) are NOT here on purpose.
PRESENT = """
بتاخدي بتتابعي بتجربي بتحبي بتحتاجي بتختاري بتخرجي بتخسّي بترجعي بترضعي
بتفكري بتنزلي تاخدي تبدأي تبلغي تتبعي تتجنبي تتحمّلي تتفرجي تتواصلي
تحافظي تحاولي تحتاجي تحتفظي تحجزي تحصلي تحضري تختاري تخرجي تخسي
تراجعي تربطي ترتاحي ترتبي ترفضي تروحي تزيدي تسألي تستعدي تسيبي
تشوفي تشيلي تضغطي تضيفي تطلبي تظهري تعتمدي تعرفي تعملي تعوضي تعيشي
تغيري تفتحي تفقدي تفهمي تقدري تقري تقومي تكملي تكمّلي تكوني تلاحظي
تلتزمي تمنعي تنوّعي تواصلي توافقي توصلي توضّحي هتخرجي هتقدري
وتأكلي وتبلغي وتتفقي وتحاولي وتحجزي وتخسري وتذكري وترجعي وتسألي
وتستخدمي وتسجّلي وتشاركي وتطلبي وتقدري
"""

# --- 5. phrase-level fixes, where a bare word would be ambiguous -------------
PHRASES = [
    ("لو محتاجة", "لو محتاج"),
    ("مش محتاجة", "مش محتاج"),
    ("انت محتاجة", "انت محتاج"),
    ("لو عايزة", "لو عايز"),
    ("مش عايزة", "مش عايز"),
    ("عايزة نشتغل", "عايز نشتغل"),
    ("لو حابة", "لو حابب"),
    ("حابة تجربي", "حابب تجرب"),
    ("مش قادرة", "مش قادر"),
    ("لو قادرة", "لو قادر"),
    ("لو ماشية على", "لو ماشي على"),
    ("انتِ ماشية", "انت ماشي"),
    ("لو انتِ", "لو انت"),
    ("وانتِ قدامه", "وانت قدامه"),
    ("وانتِ قدامك", "وانت قدامك"),
    ("اللي مدايقاكي", "اللي مدايقك"),
    ("المدايقاكي", "المدايقك"),
    ("يا فندم", "يا فندم"),
    ("أهلاً بيكي", "أهلاً بيك"),
    ("نورتينا", "نورتنا"),
    ("بتاعتك", "بتاعك"),
    ("حضرتك", "حضرتك"),
]

def build_map():
    m = {}
    for block in (IMPERATIVES, PAST):
        for pair in block.split():
            a, b = pair.split(":")
            m[a] = b
    for pair in PRONOUNS.split():
        a, b = pair.split(":")
        m[a] = b.replace("_MASC", "")
    for w in PRESENT.split():
        m[w] = w[:-1]          # drop the final ya
    return m

MAP = build_map()
FILES = sorted(glob.glob("content/*.json") + glob.glob("build/pages/*.mjs") +
               glob.glob("build/lib/*.mjs") + glob.glob("build/*.mjs"))

word_re = re.compile("|".join(
    r"(?<![؀-ۿ])" + re.escape(k) + r"(?![؀-ۿ])"
    for k in sorted(MAP, key=len, reverse=True)))

total = collections.Counter()
for path in FILES:
    src = io.open(path, encoding="utf-8").read()
    out = src
    for a, b in PHRASES:
        if a != b and a in out:
            total[a] += out.count(a)
            out = out.replace(a, b)
    def sub(mo):
        w = mo.group(0)
        total[w] += 1
        return MAP[w]
    out = word_re.sub(sub, out)
    if out != src and not DRY:
        io.open(path, "w", encoding="utf-8").write(out)

print(("DRY RUN — " if DRY else "") + "replacements: %d occurrences, %d distinct forms"
      % (sum(total.values()), len(total)))
for w, n in total.most_common(30):
    print("   %-16s %3d  ->  %s" % (w, n, MAP.get(w, dict(PHRASES).get(w, "?"))))
