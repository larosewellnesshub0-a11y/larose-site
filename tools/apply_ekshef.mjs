/* -----------------------------------------------------------------------
   apply_ekshef.mjs — fill in the three real doctors' credentials from the
   clinic's OWN ekshef listings.

   Source, and why it is trustworthy: the clinic administers account 9956 on
   ekshef.com ("عيادات مركز/مستشفى La Rose Wellness Hub", clinics 57421 /
   56840 / 56839). These bios were written and published by the clinic itself,
   which makes them a first-party source rather than a directory's guess. Every
   line below is transcribed from those listings; nothing is inferred.

   Read on 2026-09-06 from:
     https://ekshef.com/دكتور/تخسيس-وتغذية/القاهرة/المعادي
     https://ekshef.com/دكتور/جهاز-هضمي-ومناظير/القاهرة/المعادي

   The consultation fees shown on ekshef are deliberately NOT copied — no
   prices go anywhere near the public site.

   Run:  node tools/apply_ekshef.mjs
   --------------------------------------------------------------------- */
import fs from "node:fs";

const P = "content/doctors.json";
const doc = JSON.parse(fs.readFileSync(P, "utf8"));
const SRC = "ekshef.com — the clinic's own listing (account 9956), read 2026-09-06";

const UPDATES = {
  "shimaa-fouad": {
    clinicId: 56839,
    name: { ar: "د. شيماء فؤاد", en: "Dr. Shimaa Fouad" },
    title: {
      ar: "طبيبة بشرية وأخصائية التغذية العلاجية والإكلينيكية، وعضو ESPEN الأوروبية",
      en: "Physician, Clinical & Therapeutic Nutrition Specialist, ESPEN member",
    },
    credentials: {
      ar: [
        "طبيبة بشرية، أخصائية التغذية العلاجية والإكلينيكية والتخسيس",
        "عضو الجمعية الأوروبية للتغذية الإكلينيكية والتمثيل الغذائي (ESPEN)",
        "خبرة تتجاوز ١٨ سنة",
        "متخصصة في مقاومة الإنسولين، وتكيس المبايض، وخمول الغدة الدرقية، واضطرابات التمثيل الغذائي",
        "السمنة المصاحبة لأمراض الروماتيزم والمناعة، وعلاج النحافة وزيادة الوزن الصحية",
      ],
      en: [
        "Physician; specialist in clinical and therapeutic nutrition and weight management",
        "Member of the European Society for Clinical Nutrition and Metabolism (ESPEN)",
        "Over 18 years of experience",
        "Focus on insulin resistance, PCOS, hypothyroidism and metabolic disorders",
        "Obesity alongside rheumatological and immune conditions; healthy weight gain",
      ],
    },
  },

  "alyaa-abu-taleb": {
    clinicId: 56840,
    name: { ar: "د. علياء سعيد أبوطالب", en: "Dr. Alyaa Said Abu Taleb" },
    title: {
      ar: "طبيبة بشرية وأخصائية التغذية العلاجية والإكلينيكية، المعهد القومي للتغذية",
      en: "Physician, Clinical & Therapeutic Nutrition Specialist, National Nutrition Institute",
    },
    credentials: {
      ar: [
        "طبيبة بشرية، أخصائية التغذية العلاجية والإكلينيكية والتخسيس",
        "المعهد القومي للتغذية",
        "الدبلوم المهني للجودة التطبيقية في الرعاية الصحية، كلية الطب، جامعة عين شمس",
        "خبرة تتجاوز ٧ سنين في المعادي",
        "متخصصة في تغذية الأسرة: تغذية الأطفال وضعف الشهية، وتغذية الحمل والرضاعة، وبرامج إنقاص الوزن وعلاج النحافة",
        "شاركت في المؤتمر السنوي الرابع للمعهد القومي للتغذية ٢٠٢٥",
        "شاركت في المؤتمر السنوي الثالث عشر للجمعية العربية المصرية للتغذية الصحية والعلاجية ٢٠٢٤",
      ],
      en: [
        "Physician; specialist in clinical and therapeutic nutrition and weight management",
        "National Nutrition Institute",
        "Professional Diploma in Applied Quality in Healthcare, Faculty of Medicine, Ain Shams University",
        "Over 7 years of experience in Maadi",
        "Family nutrition: children's nutrition and poor appetite, pregnancy and breastfeeding, weight-loss programmes and healthy weight gain",
        "Participant, 4th Annual Conference of the National Nutrition Institute, 2025",
        "Participant, 13th Annual Conference of the Egyptian Arab Society for Healthy and Therapeutic Nutrition, 2024",
      ],
    },
  },

  "mohab-ashraf": {
    clinicId: 57421,
    name: { ar: "د. مهاب أشرف فؤاد", en: "Dr. Mohab Ashraf Fouad" },
    title: {
      ar: "أخصائي الباطنة والسكر، وأخصائي الكبد والجهاز الهضمي والمناظير",
      en: "Specialist in Internal Medicine & Diabetes, Hepatology, Gastroenterology & Endoscopy",
    },
    credentials: {
      ar: [
        "ماجستير الباطنة العامة والكبد والجهاز الهضمي والمناظير",
        "أخصائي الأمراض الباطنية والسكر",
        "أخصائي الكبد والجهاز الهضمي والمناظير",
        "خبرة تتجاوز ٦ سنين في تشخيص وعلاج أمراض الباطنة والكبد والجهاز الهضمي",
      ],
      en: [
        "MSc in General Internal Medicine, Hepatology, Gastroenterology and Endoscopy",
        "Specialist in internal medicine and diabetes",
        "Specialist in hepatology, gastroenterology and endoscopy",
        "Over 6 years of experience in internal, hepatic and gastrointestinal medicine",
      ],
    },
  },
};

let n = 0;
for (const d of doc.doctors) {
  const u = UPDATES[d.slug];
  if (!u) continue;
  d.name = u.name;
  d.title = u.title;
  d.credentials = u.credentials;
  d.ekshefClinicId = u.clinicId;
  d._source = SRC;
  delete d._todo;
  n++;
}

/* The clinic's ekshef listing gives the street as متفرع من شارع النصر while
   content/branches.json says متفرع من شارع الجزائر. Both are the clinic's own
   wording, so neither is safe to overwrite silently — flag it instead. */
const B = "content/branches.json";
const br = JSON.parse(fs.readFileSync(B, "utf8"));
const arr = br.branches || br;
const maadi = arr.find((b) => b.isPrimary);
maadi._todoAddress =
  "Confirm the street: this file says 'متفرع من شارع الجزائر', but the clinic's " +
  "own ekshef listing says 'متفرع من شارع النصر'. Both are first-party, so the " +
  "clinic must say which is correct before either is published as the address.";
fs.writeFileSync(B, JSON.stringify(br, null, 2));

fs.writeFileSync(P, JSON.stringify(doc, null, 2));
console.log(`doctors updated from ekshef: ${n}`);
console.log("branch address discrepancy flagged for confirmation");
