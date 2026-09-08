/* Pull the long Arabic prose strings out of the page templates so they can be
   sent for rewriting in one batch. Keyed by file + index so the rewrite can be
   applied back deterministically. */
import fs from "node:fs";

const files = process.argv.slice(2);
const MIN = Number(process.env.MIN || 110);
const out = {};

for (const f of files) {
  const s = fs.readFileSync(`build/pages/${f}.mjs`, "utf8");
  const re = /ar:\s*"((?:[^"\\]|\\.)*)"/g;
  let m, i = 0;
  for (const key of []) void key;
  while ((m = re.exec(s))) {
    const raw = m[1];
    const text = raw.replace(/\\"/g, '"').replace(/\\n/g, " ");
    if (text.length < MIN) continue;
    i++;
    out[`${f}:${i}`] = text;
  }
}

fs.writeFileSync("_project/copy-in.json", JSON.stringify(out, null, 1));
console.log(`extracted ${Object.keys(out).length} strings`);
for (const [k, v] of Object.entries(out)) console.log(k, "|", v.length, "|", v.slice(0, 90));
