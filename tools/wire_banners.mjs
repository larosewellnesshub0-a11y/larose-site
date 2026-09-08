/* Give every interior page hero its banner photograph.

   pageHero() now takes an `art` name. Rather than hand-editing 31 call sites,
   this walks each page module and inserts the right one, chosen by the page
   file and, where a file renders several different pages, by which words appear
   in the call itself.

   Idempotent: a call that already has `art:` is left alone.

   Run:  node tools/wire_banners.mjs
*/
import fs from "node:fs";

/* file -> [ [regex tested against the pageHero call, banner name], ... ]
   The first match wins; the last entry is the file's default. */
const RULES = {
  about: [
    [/technology|التقنيات|الأجهزة/i, "about-technology"],
    [/results|النتائج|قبل وبعد/i, "about-results"],
    [/reviews|آراء|تقييم/i, "about-results"],
    [/./, "about"],
  ],
  articles: [[/./, "articles"]],
  branches: [[/./, "branches"]],
  digital: [[/./, "digital"]],
  doctors: [[/./, "doctors"]],
  "home-visits": [[/./, "home-visits"]],
  patients: [[/./, "patients"]],
  specialties: [[/./, "specialties"]],
  tools: [[/./, "tools"]],
  misc: [[/./, "contact"]],
  // legal pages stay plain: a photograph behind a privacy policy is noise
};

let total = 0;
for (const [file, rules] of Object.entries(RULES)) {
  const p = `build/pages/${file}.mjs`;
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, "utf8");
  let out = "";
  let i = 0;
  let n = 0;

  while (true) {
    const at = s.indexOf("pageHero({", i);
    if (at < 0) { out += s.slice(i); break; }

    // Find the matching close brace only to READ the call; the insert itself
    // goes in at the front. Appending before the closing brace produced a
    // double comma wherever the last property already had a trailing one.
    let depth = 0, end = -1;
    for (let k = s.indexOf("{", at); k < s.length; k++) {
      if (s[k] === "{") depth++;
      else if (s[k] === "}") { depth--; if (depth === 0) { end = k; break; } }
    }
    if (end < 0) { out += s.slice(i); break; }

    const call = s.slice(at, end + 1);
    if (/\bart\s*:/.test(call)) {          // already wired
      out += s.slice(i, end + 1);
      i = end + 1;
      continue;
    }
    const rule = rules.find(([re]) => re.test(call));
    const open = at + "pageHero({".length;
    out += s.slice(i, open) + ` art: "${rule[1]}",` + s.slice(open, end + 1);
    i = end + 1;
    n++;
  }

  if (n) { fs.writeFileSync(p, out); total += n; console.log(`${file}: ${n} heroes`); }
}
console.log(`wired ${total} page heroes`);
