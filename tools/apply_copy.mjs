/* Apply a rewrite batch back into the page templates.

   Pairs with tools/extract_copy.mjs and MUST use the identical selection rule
   (same regex, same MIN length, same counter), otherwise the nth match here is
   not the nth match there and copy lands in the wrong place. The script
   verifies that the string it is about to replace is byte-identical to what
   was extracted, and refuses the whole file if any one of them has drifted. */
import fs from "node:fs";

const MIN = Number(process.env.MIN || 110);
const batch = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const source = JSON.parse(fs.readFileSync("_project/copy-in.json", "utf8"));

/* With --en the batch holds English counterparts. Selection still walks the
   `ar:` strings, because that is the index the batch keys were built from; the
   `en:` that belongs to the same object is the first one after it. Keying off
   `en:` directly would drift, since plenty of short en strings have no long
   Arabic partner. */
const EN = process.argv.includes("--en");

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const unesc = (s) => s.replace(/\\"/g, '"').replace(/\\n/g, " ");

const byFile = {};
for (const key of Object.keys(batch)) {
  const [f] = key.split(":");
  (byFile[f] = byFile[f] || []).push(key);
}

/* Plan every file first and only write once the whole batch validates. Writing
   file by file left one file rewritten and the rest untouched the first time a
   later file failed the drift check, which is the worst possible outcome. */
const plan = [];
for (const f of Object.keys(byFile)) {
  const p = `build/pages/${f}.mjs`;
  let s = fs.readFileSync(p, "utf8");
  const re = /ar:\s*"((?:[^"\\]|\\.)*)"/g;
  let m, i = 0;
  const edits = [];
  while ((m = re.exec(s))) {
    const text = unesc(m[1]);
    if (text.length < MIN) continue;
    i++;
    const key = `${f}:${i}`;
    if (!batch[key]) continue;
    if (source[key] !== text) {
      console.error(`REFUSED ${key}: source drifted since extraction; nothing written`);
      process.exit(1);
    }
    if (EN) {
      // the en: that belongs to this object is the first one after the ar:
      const tail = s.slice(m.index + m[0].length);
      const en = /en:\s*"((?:[^"\\]|\\.)*)"/.exec(tail);
      if (!en) {
        console.error(`REFUSED ${key}: no en counterpart found; nothing written`);
        process.exit(1);
      }
      const abs = m.index + m[0].length + en.index;
      edits.push({ start: abs, end: abs + en[0].length, key, en: true });
    } else {
      edits.push({ start: m.index, end: m.index + m[0].length, key });
    }
  }
  // replace back to front so earlier offsets stay valid
  for (const e of edits.slice().reverse()) {
    const repl = `${e.en ? "en" : "ar"}: "${esc(batch[e.key])}"`;
    s = s.slice(0, e.start) + repl + s.slice(e.end);
  }
  plan.push({ p, s, n: edits.length });
}
let applied = 0;
for (const { p, s, n } of plan) { fs.writeFileSync(p, s); applied += n; }
console.log(`applied ${applied} rewritten strings across ${plan.length} files`);
