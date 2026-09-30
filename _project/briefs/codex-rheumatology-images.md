# Codex brief: rheumatology specialty images (2026-10-01)

You are in the La Rose clinic static-site repo. The user explicitly allows YOU (Codex) to generate images for the new Rheumatology specialty with your image generation tool.

## Look first
Open and study these existing specialty frames so your output matches their style, palette, lighting, crop and realism:
- site/assets/img/specialties/internal-medicine.webp
- site/assets/img/specialties/pediatrics.webp
- site/assets/img/specialties/clinical-nutrition.webp
- site/assets/img/specialties/gastroenterology-hepatology.webp

## Produce
1. `site/assets/img/specialties/rheumatology.webp`, exactly 1200x750, WebP quality ~80 and about 80–150 KB.
2. `site/assets/img/specialties/rheumatology-700.webp`, the same image resized to 700x438.

Subject: a calm, bright, modern clinic consultation scene for rheumatology and joint care. For example, a clinician gently examining an adult patient's hand or knee joint, or explaining a knee or hand model. Warm neutral and blush-rose tones like the other frames.
- Egyptian and Middle-Eastern-looking people are fine. If a female patient appears, modest dress is preferred (a hijab is fine).
- Faces should be non-identifiable or natural, not a celebrity.
- No text, no letters, no logos, no watermarks, no brand names, no X-ray lightboxes with fake writing, no syringes or needles, no blood, no nudity.
- Hands and fingers must be anatomically correct: check the result, and regenerate if a hand is malformed.
- It must NOT look like a portrait of a specific doctor, and it must not be used as a doctor portrait.

## Do NOT
- Create or touch any doctor portrait. `site/assets/img/doctors/` is off-limits. Dr. Shimaa Sherif's portrait stays empty on purpose.
- Edit any other file: no content/, build/, or other images.
- Run git commands that change state.
- Run `node build/build.mjs`.

## Self-check
Use Python PIL to print each output's size and file size. View the final image yourself and describe it in 2–3 sentences in your final report, including a hand/finger check.
Scratch files go to `_project/scratch/rheum-images/`.
