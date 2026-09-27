# Article cover image brief (La Rose Knowledge Centre)

Generate ONE photographic cover image for the article named by TOPIC SLUG, using your image-generation tool.
First read `content/articles-new-<TOPIC SLUG>-2026-09-27.json` (or `content/articles-p2-<TOPIC SLUG>-2026-09-27.json`) for the title and scope.

House style (match `site/assets/img/articles/bloating-cover.webp`): warm editorial lifestyle photograph, soft natural window light, cream / blush-pink / sage palette, calm and reassuring, Egyptian people in a modern Cairo home or a clean bright clinic, modest clothing (women may wear a hijab), landscape 3:2.
Hard rules: NO text, letters, logos, watermarks or numbers anywhere in the image; no blood, needles in skin, surgery, nudity, graphic anatomy, before/after bodies or weight-scale shaming; no medication brand names or packaging; no identifiable real person; children only fully clothed and in a normal family setting; medical devices shown realistically and generically.

Output: save the image as `_project/scratch/covers/<TOPIC SLUG>.png` (any size ≥ 1200 px wide). Do NOT write into `site/` or `content/`, do not run git or the build.
Then print: the prompt you used, the output path and the pixel size. If your tools cannot generate images, print exactly `NO IMAGE TOOL` and stop.
