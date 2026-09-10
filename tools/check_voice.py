# -*- coding: utf-8 -*-
"""
Guard against feminine second-person address creeping back into the Arabic.
The client asked for masculine/neutral address throughout.

Run:  python tools/check_voice.py     (exits 1 if anything is found)
"""
import io, os, re, glob, sys, collections

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Forms that are ALWAYS feminine second person. Kept explicit on purpose —
# a regex on a trailing ya destroys اللي / المعادي / الجسمي / دلوقتي.
# The Egyptian negative imperative ما ت<stem>يش is the single biggest source of
# feminine address, and a word list will never keep up with it. Matched as a
# pattern instead. WEAK_ROOTS are the verbs whose ya belongs to the root, where
# the masculine keeps it (خبّى, اشترى, كفى, نفى, عنى, لغى) - excluding them is
# what stops this rule producing false positives.
WEAK_ROOTS = ('تخبيش', 'تشتريش', 'تكفيش', 'تنفيش', 'تعنيش', 'تلغيش',
              'تنسيش', 'تجريش', 'تمشيش')

PATTERNS = [
    ('كِ(?![؀-ۿ])',            'attached pronoun -ki with kasra'),
    ('تِ(?![؀-ۿ])',            'past tense -ti with kasra'),
    ('(?<![؀-ۿ])انتي(?![؀-ۿ])', 'انتي'),
    ('(?<![؀-ۿ])انتِ',                    'انتِ'),
    ('معاكي(?![؀-ۿ])', 'معاكي'),
    # Anchoring on the particle ما was wrong: it is usually written وما ("and
    # don't"), and the waw is an Arabic character, so the lookbehind killed
    # every real hit. The ت..يش suffix is the marker on its own.
    ('(?<![؀-ۿ])ت[؀-ۿ]{2,}يش(?![؀-ۿ])', 'negative imperative ت..يش'),
    ('ليكي(?![؀-ۿ])',       'ليكي'),
]
# Whole words that are feminine imperatives/verbs addressing the reader.
WORDS = """احجزي اختاري اكتبي اسألي اعرفي افتحي اتصلي كلّمي راجعي شوفي جربي
ابدئي احسبي سجّلي تقدري توصلي تشوفي تحتاجي تعرفي تفهمي تلتزمي بتاخدي بتنزلي
هتقدري هتشوفي عايزة حابة قادرة نزلتي جربتي قدرتِ عدّلي عدلي احفظي احفظيه
كمريضة للمريضة زائرة مستخدمة قارئة
ارفعي اضغطي امسحي أضيفي ابحثي انسخي الصقي تأكدي استخدمي احذفي فعّلي انشري
تعالي ابعتي ابعتيلنا حاولي تحاوليش تعمليش تشربيه اقري قولي وقولي ركزي وركزي
حضّري حضري جهّزي جهزي خدي هاتي روحي قومي اقعدي اشربي ذاكري اهتمي قيسي دوّري
تنسي تسيبي تاخدي تبدئي تكوني هاتيلي ماتقلقيش متقلقيش تقلقي
قسّمي زوّدي علّمي صوّري حددي وحددي رجعي وقفي وكلي وراقبي توقفيهوش
اتفرجي ابعدي قربي احكيلي شيلي حطي غيري نظّمي وزّني
قدمي قدّمي ناقشي راقبي قارني طلّعي طلعي وزعي وزّعي اسمحي فوتّي فوتي زوري
تتحركي تحسي تبدأي بتخسي بتحبي بتخرجي بتستلمي بتصحّيكي بتستخدميه فتتخمي""".split()

# The feminine present tense with an attached object pronoun (بتستخدميه,
# بتصحّيكي) has no fixed form a list can hold, so it is matched as a shape:
# بت + stem + ي + pronoun. Anchored on the بت prefix to keep it away from
# nouns that merely end in ya.
PATTERNS.append((
    '(?<![ء-ي])بت[ء-يّ]{3,}ي(ه|ها|هم|كي|نا)(?![ء-ي])',
    'feminine present with object pronoun'))

# Words above that are ALSO legitimate non-imperative Arabic. They are only a
# problem in the second person, so they are matched as whole words and then
# excluded when they appear inside these known-good phrases. Without this,
# المعهد القومي, المتابعة الدورية and تنسيق all trip the check.
SAFE_CONTEXT = [
    'القومي', 'الدوري', 'الدورية', 'دوري ثاني', 'تنسيق', 'المركزي', 'مركزي',
    'الشكلي', 'الكلي', 'كلية', 'مقارنة', 'فكرية', 'الفكري',
    # قسمي without shadda is the DUAL noun "the two departments"
    # (قسمي الجلدية والتغذية), and علمي is the adjective "scientific"
    # (تحديث علمي). Both are correct and must never be masculinised.
    'قسمي الجلدية', 'قسمي التغذية', 'قسمي الباطنة', 'تحديث علمي', 'مؤتمر علمي',
    'كشف فعلي', 'ومشي بسيط',
]

# The recipe guide is the clinic's own published document, reproduced verbatim.
# Its Arabic uses feminine imperatives throughout; changing them would mean
# rewriting the client's text, so it is excluded here and raised with them
# instead. Nothing else on the site is exempt.
# The RecipeGuide is the one sanctioned feminine-voice exception: it carries the
# client's own published wording and the clinic asked for it to stay that way.
# Only the landing page was exempt, so the free-guide page kept the checker red
# on 32 hits that nobody intended to fix - which made a FAIL here mean nothing.
VOICE_EXEMPT = {os.path.normpath(p) for p in (
    'site/RecipeGuide/index.html',
    'site/RecipeGuide/free/index.html',
)}

files = [f for f in glob.glob('site/**/*.html', recursive=True)
         if not os.path.basename(f).startswith('_')
         and os.path.normpath(f) not in VOICE_EXEMPT]
files += [f for f in glob.glob('dashboard/**/*.*', recursive=True)
          if f.lower().endswith(('.html', '.js'))]
files += glob.glob('site/assets/js/*.js')
ARLET = 'ء-غـ-يً-ْٰ-ۓۺ-ۿ'

found = collections.Counter()
where = {}
for f in files:
    s = io.open(f, encoding='utf-8').read()
    for pat, label in PATTERNS:
        for m in re.finditer(pat, s):
            if any(w in m.group(0) for w in WEAK_ROOTS):
                continue
            found[label] += 1
            where.setdefault(label, os.path.relpath(f, 'site'))
    for w in WORDS:
        # A word list alone kept missing the same forms, because the lookbehind
        # rejects anything preceded by an Arabic letter and the proclitics و ف
        # ب ل ك are Arabic letters: وكرري, وارفعي and واسمحي were invisible for
        # that reason alone. The waw was being patched one word at a time
        # (وقولي, وركزي, وحددي are all on the list); this handles the class.
        for m in re.finditer('(?<![' + ARLET + '])[وفبلك]?' + re.escape(w) + '(?![' + ARLET + '])', s):
            window = s[max(0, m.start() - 12):m.end() + 12]
            if any(safe in window for safe in SAFE_CONTEXT):
                continue
            found[w] += 1
            where.setdefault(w, os.path.relpath(f, 'site'))

print('\n  Arabic voice check — %d pages\n' % len(files))
if not found:
    print('  PASS — no feminine second-person address found.\n')
    sys.exit(0)
for k, n in found.most_common():
    print('  %-38s %4d   e.g. %s' % (k, n, where[k]))
print('\n  FAIL — %d occurrences\n' % sum(found.values()))
sys.exit(1)
