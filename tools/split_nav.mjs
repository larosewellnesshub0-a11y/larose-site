/* Split the Knowledge Centre.

   It held both the editorial content and the interactive calculators, which the
   client asked to separate: المركز المعرفي keeps articles, updates, Q&A, tips
   and topic FAQs; the calculators move to their own top-level item, أدوات طبية.

   No page URL changes. Only the grouping moves, so every existing link, the
   sitemap and the validator's locale-counterpart check all stay valid.

   Run:  node tools/split_nav.mjs
*/
import fs from "node:fs";

const P = "content/site.json";
const s = JSON.parse(fs.readFileSync(P, "utf8"));

const kcIndex = s.nav.findIndex((n) => String(n.label?.ar || "").includes("المعرفي"));
if (kcIndex < 0) throw new Error("Knowledge Centre nav item not found");
const kc = s.nav[kcIndex];

const isTool = (c) => String(c.href || "").startsWith("tools/");
const tools = kc.children.filter(isTool);
const editorial = kc.children.filter((c) => !isTool(c));
if (!tools.length) {
  console.log("already split, nothing to do");
  process.exit(0);
}

kc.children = editorial;

/* The tools item goes immediately after the Knowledge Centre, so the two
   related-but-distinct sections read as a pair in the header. */
s.nav.splice(kcIndex + 1, 0, {
  key: "tools",
  label: { ar: "أدوات طبية", en: "Medical Tools" },
  href: "tools/index.html",
  mega: false,
  children: tools.map((c) =>
    // the old landing item becomes the section's own overview link
    String(c.href) === "tools/index.html"
      ? { ...c, label: { ar: "كل الأدوات", en: "All tools" },
          desc: { ar: "حاسبات ومتتبعات بسيطة تساعدك تفهم أرقامك",
                  en: "Simple calculators and trackers to help you read your own numbers" } }
      : c
  ),
});

/* Seven top-level items plus the booking button overflowed the header at laptop
   widths once before. About moves to the utility bar, which already carries the
   secondary links, rather than shrinking the CTA. */
const aboutIdx = s.nav.findIndex((n) => n.key === "about" ||
  String(n.label?.ar || "").trim() === "عن لاروز");
if (s.nav.length > 6 && aboutIdx >= 0) {
  const [about] = s.nav.splice(aboutIdx, 1);
  s.utility = s.utility || {};
  s.utility.links = s.utility.links || [];
  if (!s.utility.links.some((l) => l.href === about.href)) {
    s.utility.links.unshift({ label: about.label, href: about.href });
  }
  console.log("moved 'About' into the utility bar to keep the header from overflowing");
}

fs.writeFileSync(P, JSON.stringify(s, null, 2));
console.log(`Knowledge Centre: ${editorial.length} editorial items`);
console.log(`Medical Tools:    ${tools.length} items`);
console.log("nav now:", s.nav.map((n) => n.label.ar).join(" | "));
