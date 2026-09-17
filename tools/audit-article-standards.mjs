/**
 * Read-only content-standard inventory for the La Rose Knowledge Centre.
 *
 * It evaluates generated English article pages because rendered HTML is the
 * proof that citation anchors and contextual links actually reached readers.
 * It deliberately makes no changes and reports rows below the long-form
 * publishing baseline.
 */

import fs from "node:fs";
import path from "node:path";
import { ROOT, loadContent } from "../build/lib/util.mjs";

const { articles: articleData } = loadContent();
const articles = articleData.articles || [];
const rows = [];

for (const article of articles) {
  if (!article.published) continue;
  const filename = path.join(ROOT, "site", "en", "articles", `${article.slug}.html`);
  if (!fs.existsSync(filename)) continue;

  const html = fs.readFileSync(filename, "utf8").replace(/<script[\s\S]*?<\/script>/g, "");
  rows.push({
    slug: article.slug,
    type: article.type,
    sources: html.split(`id="${article.slug}-source-`).length - 1,
    citations: (html.match(/class="citation(?:-ref)?"/g) || []).length,
    bareCitationBrackets: (html.match(/\[(?:\d+(?:,\s*\d+)*)\]/g) || []).length,
    contextualLinks: (html.match(/href="\.\.\/articles\//g) || []).length,
    updated: Boolean(article.updatedAt),
  });
}

const belowLongformBaseline = rows.filter((row) =>
  row.sources < 10 || row.citations === 0 || row.contextualLinks < 3,
);

console.log(`Published article pages: ${rows.length}`);
console.log(`Below long-form baseline: ${belowLongformBaseline.length}`);
console.log("slug | type | sources | citations | bare citation brackets | contextual links | updated");
for (const row of belowLongformBaseline) {
  console.log([
    row.slug,
    row.type,
    row.sources,
    row.citations,
    row.bareCitationBrackets,
    row.contextualLinks,
    row.updated ? "yes" : "no",
  ].join(" | "));
}
