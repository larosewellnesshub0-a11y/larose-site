/* Make the article bylines defensible.

   Two problems with what was auto-assigned:

   1. 38 of 42 articles named the SAME doctor as author and reviewer. A medical
      review byline means a second clinician checked the piece; naming one
      person as both makes the claim meaningless and looks careless.

   2. Nothing about these attributions came from the clinic. Putting a real
      doctor's name on an article she did not write is a claim about a real
      person, which is exactly what the project's first rule forbids. The
      feature was asked for, so it stays, but every byline is now explicitly
      marked provisional and has to be confirmed before launch.

   Reviewers are chosen from the three doctors whose credentials are verified.
   Where no suitable real clinician is on staff (dermatology, the surgical
   specialties) the reviewer is LEFT EMPTY rather than filled with the nearest
   available name, and the article carries a _todo instead.

   Run:  node tools/fix_bylines.mjs
*/
import fs from "node:fs";

const P = "content/articles.json";
const doc = JSON.parse(fs.readFileSync(P, "utf8"));

const REAL = ["shimaa-fouad", "alyaa-abu-taleb", "mohab-ashraf"];

/* Preferred reviewer order per category, most relevant competence first.
   Empty means the clinic has nobody on staff who can honestly review it. */
const REVIEWERS = {
  "clinical-nutrition": ["alyaa-abu-taleb", "shimaa-fouad", "mohab-ashraf"],
  "weight-management": ["mohab-ashraf", "shimaa-fouad"],
  "body-contouring": ["shimaa-fouad", "mohab-ashraf"],
  "internal-medicine": ["mohab-ashraf", "shimaa-fouad"],
  "pediatrics": ["alyaa-abu-taleb", "shimaa-fouad"],
  "dermatology": [],
  "general-surgery": [],
  "bariatric-surgery": [],
};

let paired = 0, cleared = 0, unchanged = 0;

for (const a of doc.articles) {
  const author = a.author;
  const options = (REVIEWERS[a.category] || []).filter(
    (slug) => slug !== author && REAL.includes(slug)
  );

  if (!options.length) {
    if (a.reviewedBy) { delete a.reviewedBy; cleared++; }
    a._todoReview =
      `No clinician on staff can review a ${a.category} article. Assign a real ` +
      `reviewer, or leave this article unpublished.`;
    continue;
  }

  if (a.reviewedBy && a.reviewedBy !== author && REAL.includes(a.reviewedBy)) {
    unchanged++;
  } else {
    a.reviewedBy = options[0];
    paired++;
  }
  delete a._todoReview;
}

/* One standing note, so the provisional status is impossible to miss in the
   dashboard, the requirements sheet or a diff. */
doc._todoBylines =
  "PROVISIONAL. Every `author` and `reviewedBy` on this file was assigned " +
  "during the build, not supplied by the clinic. Each one names a real doctor, " +
  "so the clinic must confirm who actually wrote and who actually reviewed " +
  "each article before the site goes live. Until then these are placeholders.";

fs.writeFileSync(P, JSON.stringify(doc, null, 2));
console.log(`reviewer reassigned : ${paired}`);
console.log(`reviewer cleared    : ${cleared} (no suitable clinician on staff)`);
console.log(`already valid       : ${unchanged}`);
