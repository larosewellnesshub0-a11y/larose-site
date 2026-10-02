import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, Shot, expo, gloss, inOut, tw } from "../lib";
import { AbsoluteFill, BG, Counter, Headline, PW, PX, PY, Photo, RGlow, Tap, useG, sx, sy } from "./kit";
import { Phone } from "../lib";

// 0–3 hook: a generic group chat scrolls · 3 the link is tapped and its bubble grows into the site (match cut)
// 5 logo on the hit (unexpected zoom out of the phone) · 8–11 counters
const msgs: [string, boolean][] = [
  ["حد يعرف دكتور تغذية كويس؟", false], ["مين جرّب حقن التخسيس؟ 🤔", false], ["عايز دكتور باطنة قريب من التجمع", false],
  ["حد عنده رقم عيادة كويسة؟", false], ["أحجز فين؟ 😩", false], ["جرّب ده 👇", true],
];
const Chat: React.FC<{ t: number }> = ({ t }) => {
  const scroll = Math.max(0, (Math.min(t, 2.6) - 0.6) * 190);
  return (
    <AbsoluteFill style={{ background: "#F4F1E8", direction: "rtl" }}>
      <div style={{ height: 110, background: "#FBF9F4", borderBottom: "1px solid rgba(35,36,26,.08)", display: "flex", alignItems: "flex-end", padding: "0 28px 18px", fontFamily: F.arBody, fontSize: 30, color: C.ink, gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 99, background: C.sage }} />جروب الحي <span style={{ fontSize: 22, color: C.inkMuted }}>· 248 عضو</span>
      </div>
      <div style={{ position: "absolute", top: 130, left: 0, right: 0, transform: `translateY(${-scroll}px)` }}>
        {msgs.map(([m, link], i) => {
          const on = tw(t, [i * 0.38, i * 0.38 + 0.15], [0, 1], expo);
          const mine = i % 2 === 1;
          return (
            <div key={i} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", padding: "10px 24px", opacity: on, transform: `translateY(${(1 - on) * 30}px)` }}>
              <div style={{ maxWidth: 440, padding: "18px 24px", borderRadius: 26, background: mine ? "#E7E6CF" : "#fff", fontFamily: F.arBody, fontSize: 30, color: C.ink, boxShadow: "0 2px 6px rgba(0,0,0,.06)" }}>
                {m}
                {link && <div style={{ marginTop: 12, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(35,36,26,.12)", background: "#FBF9F4" }}>
                  <div style={{ height: 150, background: C.olive800, display: "flex", alignItems: "center", justifyContent: "center" }}><Img src={staticFile("brand/larose-wordmark-white.png")} style={{ height: 110 }} /></div>
                  <div style={{ padding: "12px 16px", fontFamily: F.graphik, fontSize: 24, color: C.olive700, direction: "ltr", textAlign: "left" }}>laroseclinics.com</div>
                </div>}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const R1Open: React.FC = () => {
  const { t, g } = useG(0);
  // link bubble position on screen (css px) once scrolled; it grows into the site at 3.0
  const grow = tw(t, [3.05, 3.45], [0, 1], inOut);
  const glitch = t > 2.7 && t < 2.95 ? Math.sin(t * 220) * 8 : 0;
  const phoneOut = tw(t, [5.0, 5.55], [0, 1], expo);
  const archIn = tw(t, [5.0, 5.45], [0, 1], expo);
  const toStats = tw(t, [8.0, 8.35], [0, 1], expo);
  return (
    <AbsoluteFill>
      <BG g={g} mode="paper" />
      {t < 3 && <Headline g={g} t={t} at={0.1} ar="لسه بتسأل في الجروبات على دكتور؟" en="Still asking group chats for a doctor?" size={76} />}
      {t >= 3 && t < 5 && <Headline g={g} t={t} at={3.0} lead="en" en="Try this." ar="جرّب ده." size={120} />}
      {t < 5.6 && (
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${glitch}px) scale(${1 - 0.72 * phoneOut}) translateY(${-phoneOut * 260}px)`, transformOrigin: "540px 1200px", opacity: 1 - tw(t, [5.0, 5.25], [0, 1]) }}>
          <Phone w={PW} style={{ left: PX, top: PY }}>
            <Chat t={t} />
            {t >= 3.0 && (
              <div style={{ position: "absolute", left: (1 - grow) * 60, right: (1 - grow) * 100, top: (1 - grow) * 760, bottom: (1 - grow) * 200, borderRadius: (1 - grow) * 26, overflow: "hidden", background: "#fff" }}>
                <div style={{ position: "absolute", inset: 0, opacity: tw(t, [3.15, 3.4], [0, 1]) }}>
                  <Shot name={"m-ar-home" as never} width={PW} scroll={tw(t, [3.5, 5], [0, 260], inOut)} />
                </div>
              </div>
            )}
          </Phone>
          <Tap t={t} at={3.0} x={sx(170)} y={sy(560)} />
        </div>
      )}
      {t >= 5 && (
        <AbsoluteFill style={{ opacity: 1 - toStats, transform: `scale(${1 + toStats * 0.4})` }}>
          <div style={{ position: "absolute", left: 540 - 230, top: 330, width: 460, height: 600, ...gloss(true, "230px 230px 32px 32px"), background: C.olive800,
            transform: `scale(${0.6 + 0.4 * archIn})`, opacity: archIn, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <Img src={staticFile("brand/larose-wordmark-white.png")} style={{ width: 330, filter: `drop-shadow(0 0 ${8 + 26 * Math.exp(-(t - 5) * 2)}px rgba(212,183,147,.7))` }} />
          </div>
          <div style={{ position: "absolute", top: 985, width: "100%", textAlign: "center", opacity: tw(t, [5.3, 5.6], [0, 1]) }}>
            <div style={{ fontFamily: F.display, fontSize: 88, color: C.ink, lineHeight: 1, whiteSpace: "nowrap" }}><RGlow g={g} strength={0.6}>La Rose Wellness Hub</RGlow></div>
            <div style={{ fontFamily: F.arDisplay, fontSize: 40, color: C.champ700, marginTop: 18 }}>عيادات لاروز التخصصية</div>
          </div>
          <div style={{ position: "absolute", top: 1240, left: 110, right: 110, ...gloss(false, 34), padding: "30px 34px", textAlign: "center", opacity: tw(t, [5.8, 6.1], [0, 1]), transform: `translateY(${tw(t, [5.8, 6.1], [40, 0], expo)}px)` }}>
            <div style={{ fontFamily: F.arDisplay, fontSize: 52, color: C.ink, direction: "rtl" }}><RGlow g={g} strength={0.5}>مستوى جديد من الرعاية الصحية</RGlow></div>
            <div style={{ fontFamily: F.graphik, fontWeight: 500, fontSize: 28, letterSpacing: 2, color: C.champ700, marginTop: 8 }}>A NEW LEVEL OF HEALTHCARE</div>
          </div>
        </AbsoluteFill>
      )}
      {t >= 8 && (
        <AbsoluteFill style={{ opacity: toStats }}>
          <Photo src="photos/maadi-treatment.webp" t={t} style={{ left: 190, top: 380, width: 700, height: 1080, opacity: 0.9 }} />
          <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center", fontFamily: F.display, fontSize: 54, color: C.ink }}>La Rose Wellness Hub</div>
          {[{ at: 8.2, to: 18, ar: "سنة خبرة", en: "YEARS OF EXPERIENCE", pre: "" }, { at: 9.0, to: 5, ar: "تخصصات طبية", en: "MEDICAL SPECIALTIES", pre: "أكتر من" }].map((s, i) => {
            const pop = tw(t, [s.at - 0.15, s.at + 0.15], [0, 1], expo);
            return (
              <div key={i} style={{ position: "absolute", left: 120, right: 120, top: 520 + i * 470, height: 400, ...gloss(false, 40), padding: "40px 56px", direction: "rtl", transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop }}>
                {s.pre && <div style={{ fontFamily: F.arDisplay, fontSize: 40, color: C.champ700 }}>{s.pre}</div>}
                <div style={{ fontFamily: F.graphik, fontWeight: 700, fontSize: s.pre ? 170 : 200, lineHeight: 1, color: C.ink, letterSpacing: -4 }}>
                  <RGlow g={g} strength={0.6}><Counter t={t} from={0} to={s.to} at={s.at} dur={0.7} suffix="+" /></RGlow>
                </div>
                <div style={{ fontFamily: F.arDisplay, fontSize: 56, color: C.ink, marginTop: 10 }}>{s.ar}</div>
                <div style={{ fontFamily: F.graphik, fontWeight: 500, fontSize: 24, letterSpacing: 4, color: C.champ700, marginTop: 6 }}>{s.en}</div>
              </div>
            );
          })}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
