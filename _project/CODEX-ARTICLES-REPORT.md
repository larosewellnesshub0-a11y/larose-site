# Knowledge Centre expansion report

Date: 2026-09-07

## Coverage used to choose the topics

Before this expansion, the 12 long-form articles tagged the live specialties as follows (an article can count under more than one specialty): clinical nutrition 12, weight management 8, internal medicine 4, gastroenterology and hepatology 2, body contouring 2, bariatric surgery 1, dermatology 1, paediatrics 1, ultrasound 0, and general surgery 0. The new long-form set therefore starts with ultrasound and general surgery, then adds depth to bariatric surgery, paediatrics, dermatology, body contouring, digestive health, and internal medicine.

## New articles

- `abdominal-ultrasound-what-it-shows` — Ultrasound; Gastroenterology & Hepatology; Internal Medicine. Chosen because ultrasound had no tagged article and readers need a plain explanation of what a scan can and cannot rule out.
- `gallstones-symptoms-and-surgery` — General Surgery; Gastroenterology & Hepatology; Ultrasound. Chosen to give the previously empty general-surgery category a high-search topic with clear urgent symptoms and an honest explanation of when silent stones need no treatment.
- `kidney-stones-symptoms-and-tests` — Internal Medicine; Ultrasound. Chosen because kidney-stone searches often mix routine pain with infection or obstruction that needs prompt care.
- `abdominal-hernia-warning-signs` — General Surgery. Chosen to add a second standalone surgical decision guide and explain the difference between an uncomplicated bulge and a possible emergency.
- `preparing-for-bariatric-surgery` — Bariatric Surgery; General Surgery; Clinical Nutrition. Chosen because bariatric surgery had no primary-category article and the preoperative and lifelong follow-up obligations deserve more space than a procedure comparison.
- `child-short-height-growth-curve` — Paediatrics; Clinical Nutrition. Chosen because paediatrics had one article and parents commonly search by comparison with classmates rather than by growth trajectory.
- `iron-deficiency-in-children` — Paediatrics; Clinical Nutrition; Internal Medicine. Chosen to cover a common appetite, fatigue, and concentration concern without encouraging untested iron supplementation.
- `dark-neck-acanthosis-insulin-resistance` — Dermatology; Internal Medicine; Clinical Nutrition; Weight Management. Chosen to strengthen thin dermatology coverage and correct the common belief that velvety neck pigmentation is dirt or proves insulin resistance by itself.
- `loose-skin-or-localised-fat` — Body Contouring; Dermatology; Weight Management. Chosen to help readers distinguish fat, skin, muscle, bloating, and hernia before seeking a contouring procedure, while setting realistic limits.
- `ibs-colon-symptoms-red-flags` — Gastroenterology & Hepatology; Internal Medicine; Clinical Nutrition. Chosen because IBS and “colon” symptoms are high-search topics in Egypt and need a clear split between a functional pattern and warning signs.
- `acid-reflux-when-to-see-doctor` — Gastroenterology & Hepatology; Internal Medicine; Clinical Nutrition. Chosen to answer when habits may help, when medicine needs review, and when swallowing difficulty or bleeding changes the plan.
- `high-cholesterol-results-and-next-steps` — Internal Medicine; Clinical Nutrition; Weight Management. Chosen because internal medicine had only one primary-category article and lipid decisions depend on total cardiovascular risk, not one result.

## New Q&A entries

- `qa-insulin-resistance-single-test` — Clinical Nutrition; Internal Medicine; Weight Management. Chosen to answer directly that no single symptom or insulin result proves insulin resistance for everyone.
- `qa-fatty-liver-without-overweight` — Gastroenterology & Hepatology; Internal Medicine; Clinical Nutrition. Chosen to explain honestly that fatty liver can occur at a normal body weight and still needs risk assessment.
- `qa-h-pylori-test-after-treatment` — Gastroenterology & Hepatology. Chosen because symptom change does not confirm eradication and medication timing can affect the follow-up test.
- `qa-ibs-need-colonoscopy` — Gastroenterology & Hepatology; Internal Medicine. Chosen to give a clear “not everyone” answer and identify the features that make colonoscopy more relevant.
- `qa-vitamin-d-fatigue` — Internal Medicine; Clinical Nutrition. Chosen to counter automatic high-dose supplementation for a nonspecific symptom.
- `qa-low-ferritin-normal-cbc` — Internal Medicine; Clinical Nutrition. Chosen to distinguish iron deficiency from iron-deficiency anaemia and keep attention on the cause of low stores.
- `qa-child-refuses-meat-iron` — Paediatrics; Clinical Nutrition. Chosen to address a common parental worry without equating one refused food with deficiency.
- `qa-reflux-long-term-medicine` — Gastroenterology & Hepatology; Internal Medicine. Chosen because the honest answer depends on the diagnosis and abrupt stopping or indefinite unreviewed use can both be unhelpful.
- `qa-gallstone-bloating-only` — General Surgery; Gastroenterology & Hepatology; Ultrasound. Chosen to prevent an incidental gallstone being blamed automatically for nonspecific bloating.
- `qa-kidney-stone-pass-at-home` — Internal Medicine; Ultrasound. Chosen to explain that size alone does not make waiting safe when infection, obstruction, or kidney risk is present.
- `qa-prediabetes-need-medicine` — Internal Medicine; Clinical Nutrition; Weight Management. Chosen to frame prediabetes as a risk state with an individual plan, not an automatic prescription or a guaranteed cure.
- `qa-sleep-weight-plateau` — Weight Management; Clinical Nutrition; Internal Medicine. Chosen to connect sleep with appetite and activity without presenting it as the sole cause of a plateau, and to surface sleep-apnoea clues.
- `qa-stress-eating-willpower` — Clinical Nutrition; Weight Management. Chosen to replace blame with a practical behavioural explanation and identify when eating-disorder support matters.
- `qa-protein-needs-more-is-better` — Clinical Nutrition; Weight Management; Internal Medicine. Chosen to answer a common search question with an individual-needs approach and clarify that powder is optional.
- `qa-eight-glasses-water` — Clinical Nutrition; Internal Medicine. Chosen to correct the universal eight-glass rule and note that climate, activity, illness, and prescribed fluid limits change the answer.

## File-level checks completed without running the project

- `content/articles.json` parses as valid JSON and now contains 69 entries: the original 42 plus 12 articles and 15 Q&A entries.
- Every new long-form article has 5 sections and 3 FAQ entries.
- Every specialty slug is present in `content/specialties.json`; no new specialty was invented.
- Every new image path was already used by one of the original 42 entries.
- No duplicate slugs, missing required fields, price/currency terms, named drug brands, retired services, or feminine second-person forms were found in the appended records during read-only checks.
- The project, build, validator, Node, npm, and Python were not run, as requested.
