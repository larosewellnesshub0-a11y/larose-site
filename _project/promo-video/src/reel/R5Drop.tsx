import React from "react";
import { C, F, Shot, expo, gloss, inOut, tw } from "../lib";
import { Browser, Tablet } from "../lib";
import { AbsoluteFill, BG, Counter, Headline, PY, Photo, PhoneShot, RGlow, Tap, useG, sx, sy } from "./kit";

// 51 integrated consultation · 57 doctors · 61 free recipe book · 64 full book (key change) · 68 online · 71 screens · 74 branches · 78 words
const parts: [string, string, number, number][] = [ // ar, en, x, y
  ["تغذية علاجية", "CLINICAL NUTRITION", 560, 600], ["باطنة وجهاز هضمي", "INTERNAL MEDICINE & GI", 80, 760], ["تحليل InBody", "INBODY ANALYSIS", 560, 1100], ["سونار", "ULTRASOUND", 120, 1250],
];
const docs: [string, string, string][] = [
  ["brand/shimaa-fouad@2x.webp", "د. شيماء فؤاد", "التغذية العلاجية والإكلينيكية"],
  ["brand/alyaa-abu-taleb@2x.webp", "د. علياء سعيد أبوطالب", "التغذية العلاجية والإكلينيكية"],
  ["brand/mohab-ashraf@2x.webp", "د. مهاب أشرف فؤاد", "الباطنة والكبد والجهاز الهضمي"],
];
const words: [string, string][] = [["اقرا", "READ"], ["اسأل", "ASK"], ["احجز دلوقتي", "BOOK NOW"]];

export const R5Drop: React.FC = () => {
  const { t, g } = useG(51);
  return (
    <AbsoluteFill>
      <BG g={g} mode="paper" />
      <AbsoluteFill style={{ background: C.champ300, opacity: tw(t, [0, 0.35], [0.9, 0]), zIndex: 50 }} />
      {/* integrated 0–6 */}
      {t < 6 && (() => {
        const merge = tw(t, [3.0, 3.6], [0, 1], inOut);
        return (
          <>
            <Headline g={g} t={t} at={0} ar="الكشف المتكامل" en="The integrated consultation" size={110} />
            <Photo src="photos/integrated-consultation.webp" t={t} style={{ left: 240, top: 640, width: 600, height: 760, transform: `scale(${1 - 0.15 * merge}) translateY(${-merge * 80}px)` }} />
            {parts.map(([ar, en, x, y], i) => {
              const s = tw(t, [0.5 + i * 0.5, 0.75 + i * 0.5], [0, 1], expo);
              const tx = x + (130 - x) * merge, ty = y + (1290 + i * 0 - y) * merge;
              return merge < 0.98 ? (
                <div key={ar} style={{ position: "absolute", left: tx, top: ty, ...gloss(false, 30), padding: "18px 30px", direction: "rtl", transform: `scale(${s * (1 - 0.6 * merge)})`, opacity: 1 - merge }}>
                  <div style={{ fontFamily: F.arDisplay, fontSize: 42, color: C.ink }}>{ar}</div>
                  <div style={{ fontFamily: F.graphik, fontSize: 18, letterSpacing: 3, color: C.champ700 }}>{en}</div>
                </div>
              ) : null;
            })}
            {merge > 0 && (
              <div style={{ position: "absolute", left: 80, right: 80, top: 1290, ...gloss(false, 40), padding: "34px 40px", direction: "rtl", textAlign: "center", opacity: merge, transform: `scale(${0.9 + 0.1 * merge})` }}>
                <div style={{ fontFamily: F.arDisplay, fontSize: 46, color: C.ink, lineHeight: 1.35 }}><RGlow g={g} strength={0.5}>زيارة واحدة، ومتابعة من أكتر من زاوية وتخصص</RGlow></div>
                <div style={{ fontFamily: F.arBody, fontSize: 30, color: C.inkMuted, marginTop: 14 }}>تغذية علاجية + باطنة وجهاز هضمي + تحليل InBody + سونار</div>
              </div>
            )}
          </>
        );
      })()}
      {/* doctors 6–10 */}
      {t >= 6 && t < 10 && (() => {
        const grow = tw(t, [7.85, 8.35], [0, 1], inOut);
        return (
          <>
            <Headline g={g} t={t} at={6} ar="اعرف دكتورك قبل ما تحجز" en="Meet your doctor before you book" size={86} />
            <div style={{ position: "absolute", top: 640, width: "100%", display: "flex", justifyContent: "center", gap: 30, direction: "rtl", opacity: 1 - grow }}>
              {docs.map(([img, name, sp], i) => {
                const s = tw(t, [6.2 + i * 0.25, 6.45 + i * 0.25], [0, 1], expo);
                return (
                  <div key={name} style={{ width: 300, textAlign: "center", transform: `scale(${s})`, opacity: s }}>
                    <Photo src={img} t={t} style={{ position: "relative", width: 300, height: 400 }} />
                    <div style={{ fontFamily: F.arDisplay, fontSize: 34, color: C.ink, marginTop: 20 }}>{name}</div>
                    <div style={{ fontFamily: F.arBody, fontSize: 22, color: C.champ700, marginTop: 6 }}>{sp}</div>
                  </div>
                );
              })}
            </div>
            <Tap t={t} at={7.8} x={540 + 330} y={840} />
            {grow > 0 && (
              <div style={{ position: "absolute", inset: 0, opacity: grow, transform: `scale(${0.6 + 0.4 * grow})`, transformOrigin: "870px 840px" }}>
                <PhoneShot name="m-ar-doctor" scroll={tw(t, [8.3, 10], [0, 700], inOut)} />
              </div>
            )}
          </>
        );
      })()}
      {/* free recipe book 10–13 */}
      {t >= 10 && t < 13 && (() => {
        const book = tw(t, [10.9, 11.3], [0, 1], expo);
        return (
          <>
            <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center" }}>
              <div style={{ fontFamily: F.arDisplay, fontSize: 84, color: C.ink }}><RGlow g={g} strength={0.6}>كتاب وصفات مجاني</RGlow></div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 20, direction: "rtl", marginTop: 6, opacity: book }}>
                <span style={{ fontFamily: F.graphik, fontWeight: 700, fontSize: 120, color: C.ink, lineHeight: 1 }}><RGlow g={g} strength={0.6}><Counter t={t} from={0} to={60} at={11.0} dur={0.6} /></RGlow></span>
                <span style={{ fontFamily: F.arDisplay, fontSize: 50, color: C.champ700 }}>وصفة صحية من الموقع</span>
              </div>
            </div>
            <PhoneShot name="m-ar-recipe" scroll={tw(t, [10, 10.6], [700, 1100], inOut)} dim={0.3 * book} />
            <Tap t={t} at={10.7} x={sx(195)} y={sy(437)} />
            <Photo src="photos/recipe-book-open.webp" arch={false} t={t} style={{ left: 120, right: 120, top: 900, height: 560, transform: `scale(${0.5 + 0.5 * book}) rotate(${(1 - book) * -8}deg)`, opacity: book }} />
          </>
        );
      })()}
      {/* full book 13–17 */}
      {t >= 13 && t < 17 && (() => {
        const c = tw(t, [13.05, 13.45], [0, 1], expo);
        const tag = tw(t, [14.2, 14.5], [0, 1], expo);
        return (
          <>
            <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", direction: "rtl" }}>
              <div style={{ fontFamily: F.arDisplay, fontSize: 70, color: C.ink }}>والكتاب الكامل:</div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 20 }}>
                <span style={{ fontFamily: F.graphik, fontWeight: 700, fontSize: 150, color: C.ink, lineHeight: 1 }}><RGlow g={g} strength={0.7}><Counter t={t} from={0} to={250} at={13.3} dur={0.8} /></RGlow></span>
                <span style={{ fontFamily: F.arDisplay, fontSize: 56, color: C.ink }}>وصفة صحية</span>
              </div>
            </div>
            <Photo src="photos/recipe-book-cover.webp" arch={false} t={t} style={{ left: 250, top: 640, width: 580, height: 760, transform: `scale(${0.7 + 0.3 * c}) rotate(${(1 - c) * 6}deg)`, opacity: c }} />
            <div style={{ position: "absolute", left: 610, top: 600, ...gloss(true, 99), background: C.rose600, padding: "16px 34px", fontFamily: F.arDisplay, fontSize: 44, color: "#fff", transform: `rotate(${8 - 8 * tag}deg) scale(${tag})` }}>🎁 هدية</div>
            <div style={{ position: "absolute", left: 80, right: 80, top: 1460, ...gloss(false, 40), padding: "30px 30px", textAlign: "center", direction: "rtl", opacity: tw(t, [14.6, 14.9], [0, 1]) }}>
              <div style={{ fontFamily: F.arDisplay, fontSize: 56, color: C.ink }}><RGlow g={g} strength={0.7}>هدية مع أي كشف من الموقع</RGlow></div>
              <div style={{ fontFamily: F.graphik, fontWeight: 500, fontSize: 24, letterSpacing: 2, color: C.champ700, marginTop: 6 }}>FREE WITH ANY CONSULTATION BOOKED ONLINE</div>
            </div>
          </>
        );
      })()}
      {/* online follow-up 17–20 */}
      {t >= 17 && t < 20 && (
        <>
          <Headline g={g} t={t} at={17} ar="متابعة تغذية أونلاين" en="Online nutrition follow-up" size={92} sub="من أي مكان · From anywhere" />
          <PhoneShot name="m-ar-online" scroll={tw(t, [17, 20], [0, 900], inOut)} style={{ top: PY + 60 }} />
        </>
      )}
      {/* screens 20–23 */}
      {t >= 20 && t < 23 && (() => {
        const shot = t < 20.75 ? "m-ar-home" : t < 21.5 ? "m-en-home" : "m-ar-home-dark";
        const flipAt = [20.75, 21.5].find((f) => Math.abs(t - f) < 0.12);
        const flipS = flipAt !== undefined ? Math.abs(t - flipAt) / 0.12 : 1;
        const zo = tw(t, [22.0, 22.6], [0, 1], expo);
        return (
          <>
            <Headline g={g} t={t} at={20} ar={zo > 0.5 ? "على أي شاشة" : "عربي و English · نهاري وليلي"} en={zo > 0.5 ? "Any screen" : "Arabic & English · Light & dark"} size={zo > 0.5 ? 110 : 76} />
            <div style={{ position: "absolute", left: 40, top: 760, width: 1000, height: 600, transform: `scale(${zo})`, transformOrigin: "50% 50%", opacity: zo }}>
              <Browser w={1000} h={600} url="laroseclinics.com/ar/"><Shot name={"ar-home" as never} width={1000} scroll={0} /></Browser>
            </div>
            <Tablet w={300} style={{ left: 60, top: 1180, transform: `scale(${zo})`, opacity: zo }}><Shot name={"t-ar-home" as never} width={300} scroll={0} /></Tablet>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${zo * 300}px, ${zo * 380}px) scale(${1 - 0.55 * zo}) scaleX(${flipS})`, transformOrigin: "540px 1300px" }}>
              <PhoneShot name={shot} scroll={0} />
            </div>
          </>
        );
      })()}
      {/* branches 23–27 */}
      {t >= 23 && t < 27 && (
        <>
          <Headline g={g} t={t} at={23} ar="المعادي · التجمع الخامس" en="Maadi · Fifth Settlement" size={84} />
          {[["brand/branch-maadi.webp", "فرع المعادي"], ["brand/branch-fifth-settlement.webp", "فرع التجمع الخامس"]].map(([img, n], i) => {
            const s = tw(t, [23.2 + i * 0.3, 23.5 + i * 0.3], [0, 1], expo);
            return (
              <div key={n} style={{ position: "absolute", top: 600, [i ? "left" : "right"]: 70, width: 440, transform: `scale(${s})`, opacity: s } as React.CSSProperties}>
                <Photo src={img} t={t} style={{ position: "relative", width: 440, height: 600 }} />
                <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, ...gloss(true, 24), padding: "16px 0", textAlign: "center", fontFamily: F.arDisplay, fontSize: 38, color: C.onDark }}>{n}</div>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 80, right: 80, top: 1300, ...gloss(false, 40), padding: "34px 36px", textAlign: "center", direction: "rtl", opacity: tw(t, [24.6, 24.9], [0, 1]), transform: `translateY(${tw(t, [24.6, 24.9], [40, 0], expo)}px)` }}>
            <div style={{ fontFamily: F.arDisplay, fontSize: 52, color: C.ink, lineHeight: 1.3 }}><RGlow g={g} strength={0.6}>بنتوسع وبنزود خدماتنا علشان نكون أقرب ليك</RGlow></div>
            <div style={{ fontFamily: F.graphik, fontWeight: 500, fontSize: 24, letterSpacing: 2, color: C.champ700, marginTop: 8 }}>GROWING TO BE CLOSER TO YOU</div>
          </div>
        </>
      )}
      {/* words 27–29 */}
      {t >= 27 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
          {words.map(([ar, en], i) => {
            const on = tw(t, [27 + i * 0.5, 27.15 + i * 0.5], [0, 1], expo);
            const last = i === 2;
            return (
              <div key={ar} style={{ textAlign: "center", opacity: on, transform: `scale(${1.3 - 0.3 * on})` }}>
                <div style={{ fontFamily: F.arDisplay, fontSize: last ? 170 : 130, color: last ? C.olive700 : C.ink, ...(last ? { ...gloss(false, 99), padding: "6px 60px" } : {}) }}><RGlow g={g} strength={last ? 1.3 : 0.6}>{ar}</RGlow></div>
                <div style={{ fontFamily: F.graphik, fontWeight: 600, fontSize: 30, letterSpacing: 8, color: C.champ700, marginTop: 6 }}>{en}</div>
              </div>
            );
          })}
          <Tap t={t} at={28.4} x={540} y={1150} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

