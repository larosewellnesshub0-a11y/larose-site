#!/usr/bin/env node
/* Writes the dashboard's read-only content snapshot.
   --------------------------------------------------------------------------
   The dashboard is published to GitHub Pages, so THIS FILE IS PUBLIC. Its
   login gate is cosmetic (dashboard/js/auth.js says so itself) and cannot keep
   anyone out of a URL. The only thing standing between content/ and the open
   internet is the allowlist below.

   It is an allowlist on purpose. The previous filter excluded two known names
   and swept in everything else, so a new content/pricing.json would have been
   published the moment it was created, silently and with no build failure.
   Adding a content file now forces a decision: name it in PUBLIC, or name it
   in PRIVATE. Anything unlisted stops the build. */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(ROOT, "content");
const destination = path.join(ROOT, "site", "dashboard", "content", "index.json");

/* Already visible in the built HTML, so publishing it again costs nothing. */
const PUBLIC = new Set([
  "articles.json", "articles-expansion-2026-09-11.json", "articles-bariatric-vitamin-rewrite-2026-09-14.json", "articles-body-composition-rewrite-2026-09-14.json", "articles-dark-neck-rewrite-2026-09-14.json", "articles-dark-neck-pregnancy-rewrite-2026-09-16.json", "articles-h-pylori-bloating-rewrite-2026-09-16.json", "articles-h-pylori-reflux-ibs-rewrite-2026-09-18.json", "articles-prediabetes-medicine-rewrite-2026-09-18.json", "articles-insulin-resistance-rewrite-2026-09-16.json", "articles-teen-eating-concern-rewrite-2026-09-16.json", "articles-gastroscopy-colonoscopy-rewrite-2026-09-17.json", "articles-fatty-liver-rewrite-2026-09-14.json", "articles-gallbladder-pregnancy-rewrite-2026-09-15.json", "articles-gallbladder-recovery-rewrite-2026-09-14.json", "articles-gallbladder-surgery-rewrite-2026-09-14.json", "articles-gallstones-rewrite-2026-09-14.json", "articles-ibs-rewrite-2026-09-14.json", "articles-mesotherapy-rewrite-2026-09-14.json", "articles-ultrasound-rewrite-2026-09-14.json", "articles-abdominal-ultrasound-preparation-rewrite-2026-09-17.json", "articles-liver-tests-rewrite-2026-09-17.json", "articles-gerd-rewrite-2026-09-17.json", "articles-colonoscopy-preparation-rewrite-2026-09-17.json", "articles-normal-ultrasound-rewrite-2026-09-17.json", "articles-fatty-liver-fibrosis-rewrite-2026-09-17.json", "articles-hypothyroidism-weight-rewrite-2026-09-17.json", "articles-kidney-stones-rewrite-2026-09-17.json", "articles-diabetes-review-rewrite-2026-09-17.json", "articles-blood-pressure-rewrite-2026-09-17.json", "articles-ultrasound-safety-rewrite-2026-09-17.json", "articles-longform-2026-09-12.json", "branches.json", "digital.json", "doctors.json",
  "pages.json", "recipe-guide.json", "reviews.json", "site.json",
  "specialties.json", "tips.json",
]);
PUBLIC.add("articles-food-intolerance-allergy-rewrite-2026-09-18.json");
PUBLIC.add("articles-low-ferritin-normal-cbc-rewrite-2026-09-18.json");
PUBLIC.add("articles-gallstones-symptoms-surgery-rewrite-2026-09-18.json");
PUBLIC.add("articles-silent-gallstones-rewrite-2026-09-20.json");
PUBLIC.add("articles-h-pylori-children-symptoms-rewrite-2026-09-20.json");
PUBLIC.add("articles-responsive-complementary-feeding-rewrite-2026-09-20.json");
PUBLIC.add("articles-inbody-results-explained-rewrite-2026-09-20.json");
PUBLIC.add("articles-diabetes-remission-rewrite-2026-09-20.json");
PUBLIC.add("articles-body-composition-not-scale-rewrite-2026-09-20.json");
PUBLIC.add("articles-pcos-and-weight-rewrite-2026-09-20.json");
PUBLIC.add("articles-preparing-for-bariatric-surgery-rewrite-2026-09-20.json");
PUBLIC.add("articles-insulin-resistance-children-rewrite-2026-09-21.json");
PUBLIC.add("articles-childrens-appetite-rewrite-2026-09-21.json");
PUBLIC.add("articles-protecting-muscle-while-losing-weight-rewrite-2026-09-21.json");
PUBLIC.add("articles-vitamin-b12-plant-based-rewrite-2026-09-21.json");
PUBLIC.add("articles-glp1-medication-guide-rewrite-2026-09-21.json");
PUBLIC.add("articles-bariatric-assessment-multidisciplinary-rewrite-2026-09-21.json");
PUBLIC.add("articles-inbody-preparation-rewrite-2026-09-21.json");
PUBLIC.add("articles-muscle-assessment-nutrition-rewrite-2026-09-21.json");
PUBLIC.add("articles-body-contouring-safety-rewrite-2026-09-21.json");
PUBLIC.add("articles-iron-deficiency-children-rewrite-2026-09-21.json");
PUBLIC.add("articles-hair-loss-children-rewrite-2026-09-21.json");
PUBLIC.add("articles-weight-management-first-visit-rewrite-2026-09-21.json");

/* Must never reach the published tree. Anything starting with "_" is private
   by convention too (content/_submissions.json, content/_private/). */
const PRIVATE = new Set(["campaigns.json", "pricing.json"]);

const files = {};
const unlisted = [];

for (const entry of (await fs.readdir(source, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
  if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
  if (entry.name.startsWith("_") || PRIVATE.has(entry.name)) continue;
  if (!PUBLIC.has(entry.name)) { unlisted.push(entry.name); continue; }
  files[entry.name] = JSON.parse(await fs.readFile(path.join(source, entry.name), "utf8"));
}

if (unlisted.length) {
  console.error(
    `\nsnapshot-content: ${unlisted.join(", ")} ${unlisted.length === 1 ? "is" : "are"} not listed in this file.\n` +
    `The dashboard snapshot is served publicly, so nothing is published by default.\n` +
    `Add each name to PUBLIC (safe to publish) or PRIVATE (never publish) in tools/snapshot-content.mjs.\n`,
  );
  process.exit(1);
}

for (const name of PRIVATE) {
  if (Object.hasOwn(files, name)) throw new Error(`snapshot-content: ${name} is private and must not be published.`);
}

await fs.mkdir(path.dirname(destination), { recursive: true });
await fs.writeFile(destination, JSON.stringify({ files, builtAt: new Date().toISOString() }, null, 2) + "\n");
console.log(`Dashboard snapshot: ${Object.keys(files).length} public content files.`);
