import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, expo, gloss, inOut, tw } from "../lib";
import { Phone } from "../lib";
import covers from "../covers.json";
import { AbsoluteFill, BG, Counter, Headline, K, PW, PX, PY, PhoneShot, RGlow, Tap, useG, sx, sy } from "./kit";

// 24 reviews · 28 offer · 31 WhatsApp · 33 articles · 38 FAQ · 41 tools · 45–48 prep (music starts to fall away)
const faqs = ["الكشف بيشمل إيه بالظبط؟", "لازم أجيب تحاليل قبل الكشف؟", "حقن التخسيس دي آمنة؟"];
const prep = [["التحضير للكشف", "CONSULTATION PREP"], ["تحضير السونار", "ULTRASOUND PREP"], ["أول زيارة", "FIRST VISIT"]];

const BMIScreen: React.FC<{ t: number }> = ({ t }) => {
  const h = "170".slice(0, t < 0.5 ? 0 : Math.min(3, 1 + Math.floor((t - 0.5) / 0.125)));
  const w = "68".slice(0, t < 1.0 ? 0 : Math.min(2, 1 + Math.floor((t - 1.0) / 0.125)));
  const res = tw(t, [1.65, 1.85], [0, 1], expo);
  const mark = tw(t, [2.5, 2.9], [0, (23.5 - 15) / 30], expo);
  const press = Math.max(tw(t, [1.6, 1.65], [0, 1]) - tw(t, [1.7, 1.8], [0, 1]), 0);
  return (
    <div style={{ position: "absolute", width: 390, height: 844, transform: `scale(${K})`, transformOrigin: "0 0", background: "#F4F1E8", direction: "rtl", fontFamily: F.arBody, color: C.ink }}>
      <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 18px", background: "#FBF9F4", borderBottom: "1px solid rgba(35,36,26,.08)" }}><Img src={staticFile("brand/larose-wordmark.png")} style={{ height: 38 }} /></div>
      <div style={{ margin: 16, padding: 20, borderRadius: 22, background: "#FFFDF9", boxShadow: "0 10px 30px rgba(60,54,32,.1)" }}>
        <div style={{ fontSize: 12.5, color: C.champ700 }}>أدوات طبية</div>
        <div style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>حاسبة مؤشر كتلة الجسم</div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {[["الطول (سم)", h], ["الوزن (كجم)", w]].map(([l, v]) => (
            <div key={l} style={{ flex: 1 }}><div style={{ fontSize: 12, color: C.inkMuted, marginBottom: 5 }}>{l}</div>
              <div style={{ height: 44, borderRadius: 12, background: "#fff", border: "1.5px solid rgba(35,36,26,.16)", display: "flex", alignItems: "center", padding: "0 12px", fontFamily: F.graphik, fontSize: 18 }}>{v}</div></div>
          ))}
        </div>
        <div style={{ marginTop: 14, height: 44, borderRadius: 99, background: "#454832", color: C.onDark, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, transform: `scale(${1 - 0.05 * press})` }}>احسب</div>
        <div style={{ marginTop: 18, opacity: res }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div><div style={{ fontFamily: F.graphik, fontWeight: 600, fontSize: 52, lineHeight: 1 }}><Counter t={t} from={0} to={23.5} at={1.7} dur={0.75} dec={1} /></div>
              <div style={{ fontSize: 12.5, color: C.inkMuted, marginTop: 4 }}>مؤشر كتلة الجسم</div></div>
            <div style={{ padding: "6px 14px", borderRadius: 99, background: C.olive050, border: `1.5px solid ${C.olive}`, color: C.olive700, fontSize: 14, transform: `scale(${tw(t, [2.45, 2.6], [0, 1], expo)})` }}>الوزن الطبيعي</div>
          </div>
          <div style={{ position: "relative", marginTop: 14, height: 8, display: "flex", direction: "ltr", borderRadius: 4, overflow: "hidden" }}>
            {[[3.5, C.champ], [6.5, C.olive], [5, C.rose300], [15, C.rose600]].map(([wd, c], i) => <div key={i} style={{ width: `${(Number(wd) / 30) * 100}%`, background: String(c) }} />)}
          </div>
          <div style={{ position: "relative", direction: "ltr" }}><div style={{ position: "absolute", left: `${mark * 100}%`, top: -15, width: 16, height: 16, marginLeft: -8, borderRadius: 99, background: "#fff", border: `2.5px solid ${C.ink}` }} /></div>
        </div>
      </div>
    </div>
  );
};

export const R3Features: React.FC = () => {
  const { t, g } = useG(24);
  return (
    <AbsoluteFill>
      <BG g={g} mode="paper" />
      {/* reviews 0–4 */}
      {t < 4 && (
        <>
          <Headline g={g} t={t} at={0} ar="شوف تجارب عملائنا قبل ما تحجز" en="See our patients' experiences before you book" size={74} />
          <PhoneShot name="m-ar-weight" scroll={tw(t, [0, 4], [420, 500], inOut)} />
          {/* the site's own rating box lifts out of the page as glass (and covers its review count) */}
          <div style={{ position: "absolute", left: 120, right: 120, top: sy(600 - tw(t, [0, 4], [420, 500], inOut)) - 40, ...gloss(false, 36), padding: "28px 34px", textAlign: "center", transform: `scale(${tw(t, [0.2, 0.5], [0.85, 1.08], expo)})`, opacity: tw(t, [0.2, 0.4], [0, 1]) }}>
            <div style={{ fontSize: 58, letterSpacing: 6 }}>{[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ color: t >= 0.6 + i * 0.15 ? "#E2A93B" : "rgba(35,36,26,.15)", display: "inline-block", transform: `scale(${t >= 0.6 + i * 0.15 ? 1 + 0.3 * Math.exp(-(t - 0.6 - i * 0.15) * 8) : 1})` }}>★</span>)}</div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 16, direction: "rtl", marginTop: 6 }}>
              <span style={{ fontFamily: F.graphik, fontWeight: 700, fontSize: 76, color: C.ink }}><RGlow g={g} strength={0.5}><Counter t={t} from={0} to={5} at={0.5} dur={0.8} dec={1} /></RGlow></span>
              <span style={{ fontFamily: F.arDisplay, fontSize: 40, color: C.ink }}>على Google</span>
            </div>
          </div>
        </>
      )}
      {/* offer 4–7 */}
      {t >= 4 && t < 7 && (() => {
        const c = tw(t, [4.05, 4.4], [0, 1], expo);
        const sweep = tw(t, [4.5, 5.2], [-0.3, 1.3], inOut);
        return (
          <>
            <Headline g={g} t={t} at={4} ar="عرض خاص لحجوزات الموقع" en="Website-only booking offer" size={80} />
            <PhoneShot name="m-ar-home" scroll={180} dim={0.25 * c} />
            <div style={{ position: "absolute", left: 110, right: 110, top: 960, ...gloss(false, 40), padding: "44px 46px", direction: "rtl", textAlign: "center", overflow: "hidden", transform: `scale(${0.8 + 0.2 * c})`, opacity: c }}>
              <div style={{ position: "absolute", top: -50, bottom: -50, width: 60, left: `${sweep * 100}%`, background: "rgba(255,255,255,.55)", transform: "skewX(-18deg)" }} />
              <div style={{ fontFamily: F.arBody, fontSize: 30, color: C.champ700 }}>لأن صحتك تهمنا</div>
              <div style={{ fontFamily: F.arDisplay, fontSize: 62, color: C.ink, marginTop: 8, lineHeight: 1.25 }}><RGlow g={g} strength={0.6}>عرض خاص لزوار الموقع</RGlow></div>
              <div style={{ fontFamily: F.arBody, fontSize: 36, color: C.inkMuted, marginTop: 14 }}>وخصومات على خدماتنا في كل الفروع</div>
              <div style={{ margin: "30px auto 0", width: 330, padding: "20px 0", borderRadius: 99, background: C.rose600, color: "#fff", fontFamily: F.arBody, fontSize: 34 }}>احجز الآن</div>
            </div>
          </>
        );
      })()}
      {/* WhatsApp 7–9 */}
      {t >= 7 && t < 9 && (
        <>
          <Headline g={g} t={t} at={7} lead="en" en="Got a question?" ar="كلّمنا واتساب" size={100} />
          <PhoneShot name="m-ar-home" scroll={0} />
          <Tap t={t} at={7.6} x={sx(241)} y={sy(807)} />
          <div style={{ position: "absolute", left: sx(241) - 260, top: sy(807) - 250, ...gloss(false, 30), padding: "20px 30px", display: "flex", gap: 16, alignItems: "center", direction: "rtl",
            transform: `scale(${tw(t, [7.65, 7.9], [0, 1], expo)})`, transformOrigin: "50% 100%" }}>
            <div style={{ width: 64, height: 64, borderRadius: 99, background: C.whatsapp, color: "#fff", fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>✆</div>
            <div style={{ fontFamily: F.arDisplay, fontSize: 40, color: C.ink }}>واتساب</div>
            <div style={{ fontFamily: F.graphik, fontSize: 28, color: C.inkMuted, direction: "ltr" }}>010 4066 1893</div>
          </div>
        </>
      )}
      {/* articles 9–14 */}
      {t >= 9 && t < 14 && (
        <>
          {[0, 1, 2, 3].map((col) => (
            <div key={col} style={{ position: "absolute", left: 20 + col * 265, top: 0, width: 245, transform: `translateY(${-((t - 9) * (col % 2 ? 160 : 110)) - col * 70}px)`, opacity: 0.55 }}>
              {Array.from({ length: 14 }).map((_, i) => <Img key={i} src={staticFile("covers/" + covers[(col * 14 + i) % covers.length])} style={{ width: 245, height: 155, objectFit: "cover", borderRadius: 16, marginBottom: 16, display: "block" }} />)}
            </div>
          ))}
          <div style={{ position: "absolute", top: 220, left: 0, right: 0, textAlign: "center", opacity: tw(t, [9, 9.2], [0, 1]) }}>
            <div style={{ display: "inline-block", ...gloss(false, 44), padding: "18px 60px 26px" }}>
              <div style={{ fontFamily: F.graphik, fontWeight: 700, fontSize: 190, lineHeight: 1, color: C.ink, letterSpacing: -6 }}><RGlow g={g} strength={0.7}><Counter t={t} from={0} to={500} at={9.2} dur={0.9} suffix="+" /></RGlow></div>
              <div style={{ fontFamily: F.arDisplay, fontSize: 50, color: C.ink, direction: "rtl" }}>مقال طبي، وبيزيدوا كل أسبوع</div>
              <div style={{ fontFamily: F.graphik, fontWeight: 500, fontSize: 24, letterSpacing: 3, color: C.champ700, marginTop: 6 }}>MEDICAL ARTICLES · GROWING EVERY WEEK</div>
            </div>
          </div>
          <PhoneShot name="m-ar-articles" scroll={tw(t, [9, 14], [0, 1800], inOut)} style={{ top: PY + 120 }} />
          <div style={{ position: "absolute", left: 90, right: 90, top: 1580, display: "flex", gap: 18, justifyContent: "center", direction: "rtl", opacity: tw(t, [10.8, 11.1], [0, 1]), transform: `translateY(${tw(t, [10.8, 11.1], [40, 0], expo)}px)` }}>
            {["يكتبها ويراجعها أطباؤنا", "بمصادر علمية"].map((x) => <div key={x} style={{ ...gloss(false, 99), padding: "18px 30px", fontFamily: F.arDisplay, fontSize: 38, color: C.ink }}>{x}</div>)}
          </div>
        </>
      )}
      {/* FAQ 14–17 */}
      {t >= 14 && t < 17 && (
        <>
          <Headline g={g} t={t} at={14} ar="إجابات واضحة لأسئلتك من أطباء متخصصين" en="Clear answers from specialist doctors" size={70} />
          <PhoneShot name="m-ar-faq" scroll={tw(t, [14, 17], [150, 600], inOut)} dim={0.15} />
          <div style={{ position: "absolute", left: 100, right: 100, top: 960, ...gloss(false, 36), padding: "18px 0", direction: "rtl" }}>
            {faqs.map((q, i) => {
              const open = tw(t, [14.3 + i * 0.7, 14.55 + i * 0.7], [0, 1], expo) * (i < 2 ? tw(t, [15.0 + i * 0.7, 15.2 + i * 0.7], [1, 0.35]) : 1);
              return (
                <div key={q} style={{ padding: "22px 34px", borderBottom: i < 2 ? "1px solid rgba(35,36,26,.08)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: F.arDisplay, fontSize: 36, color: C.ink }}>{q}<span style={{ color: C.olive, fontFamily: F.graphik }}>{open > 0.5 ? "−" : "+"}</span></div>
                  <div style={{ height: open * 64, overflow: "hidden" }}>
                    <div style={{ height: 14, borderRadius: 7, background: "rgba(35,36,26,.12)", marginTop: 16, width: "92%" }} />
                    <div style={{ height: 14, borderRadius: 7, background: "rgba(35,36,26,.08)", marginTop: 12, width: "70%" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {/* tools 17–21 */}
      {t >= 17 && t < 21 && (
        <>
          <Headline g={g} t={t} at={17} lead="en" en="Free medical tools" ar="أدوات طبية مجانية" size={98} />
          <Phone w={PW} style={{ left: PX, top: PY + 80 }}><BMIScreen t={t - 17} /></Phone>
          <Tap t={t} at={18.6} x={sx(195)} y={sy(260) + 80} />
          <div style={{ position: "absolute", top: 1650, left: 40, right: 40, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", direction: "rtl" }}>
            {["كتلة الجسم", "السعرات", "المياه", "متابعة الوزن"].map((x, i) => (
              <div key={x} style={{ ...gloss(false, 99), padding: "14px 28px", fontFamily: F.arDisplay, fontSize: 34, color: C.ink, transform: `scale(${tw(t, [19.6 + i * 0.25, 19.8 + i * 0.25], [0, 1], expo)})` }}>{x}</div>
            ))}
          </div>
        </>
      )}
      {/* prep 21–24 */}
      {t >= 21 && (
        <>
          <Headline g={g} t={t} at={21} ar="اعرف تجهّز إزاي قبل ميعادك" en="Know how to prepare before your visit" size={78} />
          <PhoneShot name="m-ar-prep" scroll={tw(t, [21, 24], [0, 500], inOut)} />
          <div style={{ position: "absolute", left: 130, right: 130, top: 1150, ...gloss(false, 36), padding: "14px 0", direction: "rtl" }}>
            {prep.map(([a, e], i) => {
              const on = t >= 21.5 + i * 0.7;
              return (
                <div key={a} style={{ display: "flex", alignItems: "center", gap: 22, padding: "20px 34px", borderBottom: i < 2 ? "1px solid rgba(35,36,26,.08)" : "none" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, border: `2.5px solid ${C.olive}`, background: on ? C.olive : "transparent", color: "#fff", fontSize: 32, textAlign: "center", lineHeight: "44px",
                    transform: `scale(${on ? 1 + 0.25 * Math.exp(-(t - 21.5 - i * 0.7) * 8) : 1})` }}>{on ? "✓" : ""}</div>
                  <div><div style={{ fontFamily: F.arDisplay, fontSize: 40, color: C.ink }}>{a}</div><div style={{ fontFamily: F.graphik, fontSize: 20, letterSpacing: 3, color: C.champ700 }}>{e}</div></div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
