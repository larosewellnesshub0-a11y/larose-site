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
  "articles.json", "branches.json", "digital.json", "doctors.json",
  "pages.json", "recipe-guide.json", "reviews.json", "site.json",
  "specialties.json", "tips.json",
]);

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
