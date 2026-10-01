# Task: fix unsupported claims in C9 (fibromyalgia-widespread-pain)

Target file: `content/articles-new-fibromyalgia-widespread-pain-2026-10-01.json`. Edit only this file. Make each fix in AR and EN. Follow `_project/briefs/phase3-article-brief.md`.

Open each cited source: Wolfe 2016 [1], Macfarlane/EULAR 2017 [2], Clauw 2014 [3], Bhargava StatPearls [5], Choy 2015 [6], Bidonde [7], Bernardy [8], Goldenberg 2016 [9], Bair 2020 [10], Arnold 2016 [11], NHS [12], NIAMS [13], NICE NG193 [14]. Keep a claim only if the cited source states it. Otherwise remove it or rewrite it generally. Do not add numbers that are not in a cited source.

1. Medications section: delete "reduce pain severity by 30% to 50%" and its AR equivalent.
2. "Opioids strongly advised against across EULAR, NICE, ACR": ACR has no fibromyalgia management guideline. State what EULAR 2017 says (it recommends against strong opioids; check what it says about tramadol) and what NICE NG193 says. "Frequently trigger opioid-induced hyperalgesia" becomes "can", worded as Goldenberg [9] puts it.
3. Pregabalin, duloxetine and amitriptyline: give EULAR's actual strength (weak for, in selected patients). Add, citing [14], that NICE NG193 advises against starting gabapentinoids for chronic primary pain but allows certain antidepressants (check the exact wording). Keep it calm and short.
4. Corticosteroids and NSAIDs: match EULAR's wording.
5. Tender points: the reason ACR moved away from them must match [1] or the ACR 2010 criteria as described in [1] and [5]. Remove "pain sensitivity varies from day to day" unless a cited source says it.
6. Sleep: remove specifics that no cited source states (screens one hour before bed, caffeine after midday, "8 or 9 hours"). The rest can stay general. Keep alpha-wave intrusion only if [6] or [13] states it. Keep "substantially lowering pain thresholds the following day" only if [3] or [6] states it; otherwise generalize.
7. Exercise: replace "10 minutes of walking" with general wording unless [7] or [2] gives a starting duration.
8. FAQ "most individuals achieve meaningful pain reduction": change to "many people", or to whatever the source supports.
9. Lab tests (CK, calcium, vitamin D, ANA advice): keep only what [5], [10] or [11] state. Re-cite to the source that actually says it.
10. Red flags (GCA/PMR, bowel or bladder, weakness): keep only what the cited sources support. Re-cite if needed.

Write the Arabic in calm Egyptian Arabic (register 6.5 or more). Do not use fear language.

Run these until they all pass:
- `check_new_article.py` (ALL CHECKS PASS)
- `register_score.py` (6.5 or more)
- `check_source_titles.py` (0 mismatches)

No images, no build, and no other files. Report each change (old → new) in EN.