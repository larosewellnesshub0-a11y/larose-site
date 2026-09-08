#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(ROOT, "content");
const destination = path.join(ROOT, "site", "dashboard", "content", "index.json");
const files = {};

for (const entry of (await fs.readdir(source, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
  if (!entry.isFile() || !entry.name.endsWith(".json") || entry.name === "campaigns.json" || entry.name.startsWith("_")) continue;
  files[entry.name] = JSON.parse(await fs.readFile(path.join(source, entry.name), "utf8"));
}

await fs.mkdir(path.dirname(destination), { recursive: true });
await fs.writeFile(destination, JSON.stringify({ files, builtAt: new Date().toISOString() }, null, 2) + "\n");
console.log(`Dashboard snapshot: ${Object.keys(files).length} public content files.`);
