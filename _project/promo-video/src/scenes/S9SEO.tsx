import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useVideoConfig } from "remotion";
import { Background } from "../Background";
import { Browser, C, Chip, F, Glow, Phone, Shot, expo, inOut, tw, useT, pulseAt } from "../lib";
import { CoverWall } from "./CoverWall";
import seo from "../seo.json";

const A = seo["ar-article"];
const short = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const Code: React.FC<{ tag: string; value: string; on: number; ltr?: boolean }> = ({ tag, value, on, ltr }) => (
  <div style={{ opacity: on, transform: `translateX(${(1 - on) * -60}px)`, background: "rgba(18,19,16,.92)", border: "1px solid rgba(212,183,147,.35)", borderRadius: 18, padding: "22px 28px", marginBottom: 22, width: 640 }}>
    <div style={{ fontFamily: "monospace", fontSize: 21, color: C.rose, letterSpacing: 0.5 }}>{tag}</div>
    <div style={{ fontFamily: ltr ? F.sans : F.arBody, fontSize: ltr ? 22 : 27, color: C.onDark, marginTop: 8, direction: ltr ? "ltr" : "rtl", lineHeight: 1.45 }}>{value}</div>
  </div>
);
const types = ["Article", "MedicalWebPage", "FAQPage", "BreadcrumbList", "MedicalOrganization", "WebSite", "reviewedBy ✓"];
const query = "إمتى مونجارو يبدأ مفعوله";
const faqs = ["امتى مونجارو يبدأ مفعوله على الشهية؟", "ليه الوزن بينزل أسبوع ويثبت أسبوع على مونجارو؟"];

// 40–54 s: the drop. How the articles are built for search: title, meta, canonical, hreflang, schema, a search preview,
// E-E-A-T signals, then an unexpected zoom out to the whole library.
export const S9SEO: React.FC = () => {
  const { t, g } = useT(40);
  const { fps } = useVideoConfig();
  const sp = (at: number) => (t < at ? 0 : spring({ frame: (t - at) * fps, fps, config: { damping: 13, stiffness: 210 } }));
  const p = pulseAt(g);
  const part = t < 1 ? "A" : t < 4 ? "B" : t < 6 ? "C" : t < 8 ? "D" : t < 10 ? "E" : t < 12 ? "F" : "G";
  const head = (ar: string, en: string) => (
    <div style={{ position: "absolute", left: 70, top: 56, display: "flex", gap: 22, alignItems: "baseline" }}>
      <span style={{ fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: C.champ }}>{en}</span>
      <span style={{ fontFamily: F.arBody, fontSize: 24, color: C.onDarkMute }}>{ar}</span>
    </div>
  );
  return (
    <AbsoluteFill>
      <Background g={g} mode={part === "E" ? "night" : "dark"} />
      {part === "A" && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", transform: `scale(${1.3 - 0.3 * tw(t, [0, 0.3], [0, 1]) + t * 0.05})` }}>
          <div style={{ fontFamily: F.arDisplay, fontSize: 230, color: C.onDark }}><Glow g={g} strength={1.6}>مبني عشان يتلاقي</Glow></div>
          <div style={{ fontFamily: F.sans, fontSize: 32, letterSpacing: 14, color: C.champ, marginTop: 10 }}>BUILT TO BE FOUND · SEO</div>
        </AbsoluteFill>
      )}
      {part === "B" && (() => {
        const z = tw(t, [1, 1.7], [1.9, 1], expo);
        return (
          <>
            {head("كل مقال له عنوان ووصف ورابط أساسي نظيف", "ON-PAGE SEO")}
            <div style={{ position: "absolute", left: 790, top: 150, transform: `scale(${z})`, transformOrigin: "60% 30%" }}>
              <Browser w={1060} h={820} url={"laroseclinics.com/ar/articles/mounjaro-results-timeline-…"}>
                <Shot name="ar-article" width={1060} scroll={tw(t, [1.6, 4], [0, 260], inOut)} />
              </Browser>
            </div>
            <div style={{ position: "absolute", left: 70, top: 160 }}>
              <Code tag="<title>" value={A.title} on={tw(t, [1.5, 1.75], [0, 1])} />
              <Code tag='<meta name="description">' value={short(A.description!, 120)} on={tw(t, [2.5, 2.75], [0, 1])} />
              <Code tag='<link rel="canonical">' value={A.canonical!.replace("https://", "")} on={tw(t, [3.5, 3.75], [0, 1])} ltr />
            </div>
          </>
        );
      })()}
      {part === "C" && (() => {
        const sw = tw(t, [5.0, 5.45], [0, 1], expo);
        const xs = [1000 - 900 * sw, 100 + 900 * sw];
        return (
          <>
            {head("نسخة عربي ونسخة إنجليزي مربوطين ببعض", "HREFLANG · BILINGUAL")}
            {[["ar-article", "/ar/articles/…", "hreflang=\"ar\""], ["en-article", "/en/articles/…", "hreflang=\"en\""]].map(([n, u, h], i) => (
              <div key={n} style={{ position: "absolute", left: xs[i] + 0, top: 200 + tw(t, [4, 4.4], [700, 0], expo) * (i ? 1.2 : 1), transform: `rotateY(${Math.sin(sw * Math.PI) * 25}deg)` }}>
                <Browser w={820} h={600} url={"laroseclinics.com" + u}><Shot name={n as never} width={820} scroll={60} /></Browser>
                <div style={{ marginTop: 22, textAlign: "center", fontFamily: "monospace", fontSize: 26, color: C.champ }}><Glow g={g} strength={0.8}>{h}</Glow></div>
              </div>
            ))}
            <div style={{ position: "absolute", top: 470, width: "100%", textAlign: "center", fontSize: 70, color: C.onDark, opacity: tw(t, [4.3, 4.5], [0, 1]) }}><Glow g={g}>⇄</Glow></div>
            <div style={{ position: "absolute", bottom: 50, width: "100%", textAlign: "center", fontFamily: "monospace", fontSize: 24, color: C.onDarkMute, opacity: tw(t, [4.5, 4.8], [0, 1]) }}>x-default → /ar/</div>
          </>
        );
      })()}
      {part === "D" && (
        <>
          {head("بيانات منظمة بتفهّم محركات البحث الصفحة", "STRUCTURED DATA · JSON-LD")}
          <div style={{ position: "absolute", left: 90, top: 190, width: 760, background: "rgba(18,19,16,.92)", border: "1px solid rgba(212,183,147,.3)", borderRadius: 20, padding: "30px 36px", fontFamily: "monospace", fontSize: 25, lineHeight: 1.65, color: C.onDarkMute, direction: "ltr" }}>
            {['{', '  "@context": "https://schema.org",', '  "@graph": [', ...types.slice(0, 6).map((ty, i) => `    { "@type": "${ty}" }${i < 5 ? "," : ""}`), '  ]', '}'].map((l, i) => (
              <div key={i} style={{ opacity: tw(t, [6 + i * 0.12, 6 + i * 0.12 + 0.08], [0, 1]), color: l.includes("@type") ? C.champ300 : undefined, whiteSpace: "pre" }}>{l}</div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 960, top: 210, width: 880, display: "flex", flexWrap: "wrap", gap: 22 }}>
            {types.map((ty, i) => {
              const s = sp(6 + i * 0.25);
              return <div key={ty} style={{ transform: `scale(${s})`, opacity: Math.min(1, s * 2), padding: "20px 34px", borderRadius: 99, background: i === 6 ? C.rose600 : i % 2 ? C.olive700 : "rgba(246,244,236,.08)",
                border: `1.5px solid ${C.champ}`, fontFamily: F.sans, fontSize: 30, color: C.onDark }}><Glow g={g} strength={0.7}>{ty}</Glow></div>;
            })}
          </div>
          <div style={{ position: "absolute", left: 960, top: 720, fontFamily: F.arBody, fontSize: 30, color: C.onDarkMute, direction: "rtl", width: 880, textAlign: "right", opacity: tw(t, [7.4, 7.7], [0, 1]) }}>
            6 أسئلة شائعة في FAQPage · كاتب ومراجع طبي في الـ schema
          </div>
        </>
      )}
      {part === "E" && (() => {
        const typed = Math.floor(tw(t, [8, 9.45], [0, query.length], (x) => x));
        const res = tw(t, [9.5, 9.8], [0, 1], expo);
        return (
          <>
            {head("معاينة توضيحية لنتيجة البحث", "SEARCH PREVIEW · ILLUSTRATIVE")}
            <div style={{ position: "absolute", left: 260, top: 150, width: 1400, height: 84, borderRadius: 42, background: "#1B1C18", border: `1.5px solid ${C.champ}`, display: "flex", alignItems: "center", padding: "0 40px", direction: "rtl", fontFamily: F.arBody, fontSize: 36, color: C.onDark, boxShadow: `0 0 ${20 + 30 * p}px rgba(212,183,147,${0.15 + 0.25 * p})` }}>
              {query.slice(0, typed)}<span style={{ color: C.champ, opacity: Math.floor(t * 4) % 2 }}>|</span>
              <span style={{ marginRight: "auto", fontSize: 30, color: C.champ }}>⌕</span>
            </div>
            <div style={{ position: "absolute", left: 260, top: 290 + (1 - res) * 60, width: 1400, opacity: res, background: "#FBF9F4", borderRadius: 26, padding: "40px 52px", direction: "rtl", boxShadow: "0 30px 80px rgba(0,0,0,.45)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <Img src={staticFile("brand/favicon.svg")} style={{ width: 54, height: 54 }} />
                <div>
                  <div style={{ fontFamily: F.arBody, fontSize: 26, color: C.ink }}>عيادات لاروز التخصصية</div>
                  <div style={{ fontFamily: F.sans, fontSize: 19, color: C.inkMuted, direction: "ltr", textAlign: "right" }}>laroseclinics.com › ar › articles › mounjaro-results-timeline…</div>
                </div>
              </div>
              <div style={{ fontFamily: F.arBody, fontSize: 40, fontWeight: 500, color: C.olive700, marginTop: 20 }}>{A.title}</div>
              <div style={{ fontFamily: F.arBody, fontSize: 27, color: C.inkMuted, marginTop: 10, lineHeight: 1.5 }}>{A.description}</div>
              {faqs.map((q, i) => (
                <div key={q} style={{ marginTop: i ? 0 : 22, borderTop: "1px solid rgba(35,36,26,.12)", padding: "16px 0", display: "flex", justifyContent: "space-between", fontFamily: F.arBody, fontSize: 27, color: C.ink, opacity: tw(t, [9.7 + i * 0.12, 9.85 + i * 0.12], [0, 1]) }}>
                  {q}<span style={{ color: C.inkMuted }}>⌄</span>
                </div>
              ))}
            </div>
          </>
        );
      })()}
      {(part === "F" || part === "G") && (() => {
        const zo = tw(t, [12, 12.6], [0, 1], expo) * 0.62 + tw(t, [13, 13.6], [0, 1], expo) * 0.2; // camera pull-back amount
        const s = 1 - zo;
        const scroll = tw(t, [10, 13], [0, 2600], inOut);
        const badges = [
          ["كتابة د. شيماء فؤاد · مراجعة طبية د. علياء سعيد أبوطالب", "AUTHOR + MEDICAL REVIEWER"],
          ["مصادر طبية مرقّمة  [1] [2] [3]", "NUMBERED MEDICAL SOURCES"],
          ["أسئلة شائعة بإجابات مختصرة", "FAQ + FAQPAGE SCHEMA"],
          ["روابط داخلية للمقالات والتخصصات والحجز", "INTERNAL LINKS + BOOKING"],
        ];
        const count = (n: number) => Math.round(tw(t, [12.5, 13.5], [0, n], inOut));
        return (
          <>
            {part === "F" && head("ثقة ومصادر في كل صفحة", "E-E-A-T · TRUST SIGNALS")}
            <AbsoluteFill style={{ transform: `translate(960px,540px) scale(${s}) translate(-960px,-540px)`, transformOrigin: "0 0" }}>
              <div style={{ position: "absolute", left: 960, top: 540 }}><CoverWall reveal={tw(t, [12, 13.2], [0, 1.4], (x) => x)} /></div>
              <Phone w={330} style={{ left: 960 - 177, top: 540 - 380 }}>
                <Shot name="m-ar-article" width={330} scroll={scroll} />
              </Phone>
            </AbsoluteFill>
            {badges.map(([ar, en], i) => {
              const s2 = sp(10 + i * 0.5);
              const side = i % 2 ? 1 : -1;
              return (
                <div key={i} style={{ position: "absolute", top: 230 + i * 170, [side < 0 ? "right" : "left"]: 90, width: 640, transform: `scale(${s2})`, opacity: Math.min(1, s2 * 2) * tw(t, [11.9, 12.2], [1, 0]),
                  textAlign: side < 0 ? "right" : "left" } as React.CSSProperties}>
                  <Chip dark style={{ fontSize: 27, direction: "rtl" }}>{ar}</Chip>
                  <div style={{ fontFamily: F.sans, fontSize: 16, letterSpacing: 5, color: C.champ, marginTop: 10 }}>{en}</div>
                </div>
              );
            })}
            {part === "G" && (
              <div style={{ position: "absolute", bottom: 70, width: "100%", textAlign: "center", opacity: tw(t, [12.4, 12.7], [0, 1]) }}>
                <div style={{ display: "inline-block", background: "rgba(18,19,16,.88)", borderRadius: 28, padding: "24px 56px", border: "1px solid rgba(212,183,147,.4)" }}>
                  <div style={{ fontFamily: F.arDisplay, fontSize: 64, color: C.onDark, direction: "rtl" }}>
                    <Glow g={g}><span style={{ fontFamily: F.display }}>{count(269)}</span> مقال عربي + <span style={{ fontFamily: F.display }}>{count(269)}</span> English</Glow>
                  </div>
                  <div style={{ fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: C.champ, marginTop: 6 }}>{count(643)} URLS IN THE SITEMAP · روابط في خريطة الموقع</div>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </AbsoluteFill>
  );
};
