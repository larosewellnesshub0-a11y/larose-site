import React from "react";
import { AbsoluteFill, Img, spring, staticFile, useVideoConfig } from "remotion";
import { Background } from "../Background";
import { C, F, Glow, expo, glass, inOut, tw, useT, pulseAt } from "../lib";

// 24–28 s: the site's BMI calculator, rebuilt in glass. Values are typed, «احسب» is clicked, the result counts up
// (digital counter SFX 25.6–26.4). Same maths and WHO bands as site/assets/js/tools.js: 170 cm, 68 kg → 23.5.
const BANDS: [number, string][] = [[18.5, C.champ], [25, C.olive], [30, C.rose300], [45, C.rose600]];
export const STools: React.FC = () => {
  const { t, g } = useT(24);
  const { fps } = useVideoConfig();
  const p = pulseAt(g);
  const cardIn = spring({ frame: t * fps, fps, config: { damping: 15, stiffness: 160 } });
  const h = "170".slice(0, t < 0.5 ? 0 : Math.min(3, 1 + Math.floor((t - 0.5) / 0.125)));
  const w = "68".slice(0, t < 1.0 ? 0 : Math.min(2, 1 + Math.floor((t - 1.0) / 0.125)));
  const press = Math.max(tw(t, [1.5, 1.55], [0, 1]) - tw(t, [1.58, 1.68], [0, 1]), 0);
  const cnt = tw(t, [1.6, 2.4], [0, 1], (x) => x);
  const bmi = (23.5 * cnt).toFixed(1);
  const lo = (53.5 * cnt).toFixed(1), hi = (72.0 * cnt).toFixed(1);
  const res = tw(t, [1.55, 1.75], [0, 1], expo);
  const marker = tw(t, [2.5, 2.9], [0, (23.5 - 15) / 30], expo);
  const exit = tw(t, [3.5, 4.0], [1, 0.85], inOut);
  const cx = tw(t, [1.1, 1.45], [1500, 1200], inOut), cy = tw(t, [1.1, 1.45], [980, 505], inOut);
  const field = (label: string, val: string, active: boolean) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: F.arBody, fontSize: 24, color: C.inkMuted, marginBottom: 10 }}>{label}</div>
      <div style={{ height: 72, borderRadius: 14, background: "#fff", border: `1.5px solid ${active ? C.olive : "rgba(35,36,26,.18)"}`, display: "flex", alignItems: "center", padding: "0 22px", fontFamily: F.graphik, fontSize: 34, color: C.ink }}>
        {val}{active && <span style={{ color: C.olive, opacity: Math.floor(t * 6) % 2 }}>|</span>}
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Background g={g} mode="paper" />
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: C.champ700 }}>HEALTH TOOLS · أدوات طبية</div>
      <AbsoluteFill style={{ transform: `scale(${exit})` }}>
        <div style={{ position: "absolute", left: 1180, top: 150, width: 620, height: 820, borderRadius: "310px 310px 28px 28px", overflow: "hidden", opacity: cardIn }}>
          <Img src={staticFile("brand/branch-fifth-settlement.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.12 - t * 0.02})` }} />
        </div>
        <div style={{ position: "absolute", left: 230, top: 190 + (1 - cardIn) * 120, width: 1100, opacity: Math.min(1, cardIn * 1.5), ...glass(false, 30), padding: "44px 56px", direction: "rtl" }}>
          <div style={{ fontFamily: F.arBody, fontSize: 22, color: C.champ700 }}>أدوات طبية</div>
          <div style={{ fontFamily: F.arDisplay, fontSize: 58, color: C.ink, marginTop: 4 }}>حاسبة مؤشر كتلة الجسم</div>
          <div style={{ display: "flex", gap: 24, marginTop: 30 }}>
            {field("الطول (سم)", h, t >= 0.4 && t < 0.95)}
            {field("الوزن (كجم)", w, t >= 0.95 && t < 1.5)}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 26 }}>
            <div style={{ padding: "18px 44px", borderRadius: 99, background: "#454832", color: C.ink, fontFamily: F.arBody, fontSize: 28, transform: `scale(${1 - 0.07 * press})` }}>احسب</div>
            <div style={{ padding: "18px 40px", borderRadius: 99, border: "1.5px solid rgba(35,36,26,.3)", color: C.ink, fontFamily: F.arBody, fontSize: 28 }}>إعادة</div>
          </div>
          <div style={{ marginTop: 34, opacity: res, transform: `translateY(${(1 - res) * 20}px)` }}>
            <div style={{ display: "flex", gap: 70, alignItems: "flex-end" }}>
              <div>
                <div style={{ fontFamily: F.graphik, fontWeight: 600, fontSize: 104, color: C.ink, direction: "ltr", textAlign: "right", lineHeight: 1 }}><Glow g={g} strength={0.35}>{bmi}</Glow></div>
                <div style={{ fontFamily: F.arBody, fontSize: 24, color: C.inkMuted, marginTop: 8 }}>مؤشر كتلة الجسم</div>
              </div>
              <div>
                <div style={{ fontFamily: F.graphik, fontWeight: 500, fontSize: 52, color: C.ink, direction: "rtl" }}><span style={{ direction: "ltr", unicodeBidi: "isolate" }}>{lo} – {hi}</span> كجم</div>
                <div style={{ fontFamily: F.arBody, fontSize: 24, color: C.inkMuted, marginTop: 8 }}>النطاق الصحي لطولك</div>
              </div>
              <div style={{ marginRight: "auto", padding: "12px 26px", borderRadius: 99, background: C.olive050, border: `1.5px solid ${C.olive}`, fontFamily: F.arBody, fontSize: 26, color: C.olive700,
                transform: `scale(${tw(t, [2.45, 2.65], [0, 1], expo)})` }}>الوزن الطبيعي</div>
            </div>
            <div style={{ position: "relative", marginTop: 28, height: 14, display: "flex", direction: "ltr", borderRadius: 7, overflow: "hidden" }}>
              {BANDS.map(([max], i) => { const min = i ? BANDS[i - 1][0] : 15; return <div key={i} style={{ width: `${((max - min) / 30) * 100}%`, background: BANDS[i][1], opacity: 0.85 }} />; })}
            </div>
            <div style={{ position: "relative", height: 0, direction: "ltr" }}>
              <div style={{ position: "absolute", left: `${marker * 100}%`, top: -27, width: 26, height: 26, marginLeft: -13, borderRadius: 99, background: "#fff", border: `3px solid ${C.ink}`, boxShadow: `0 0 ${8 + 16 * p}px rgba(212,183,147,.8)` }} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <svg width={40} height={40} viewBox="0 0 24 24" style={{ position: "absolute", left: cx, top: cy, opacity: tw(t, [1.0, 1.1], [0, 1]) * tw(t, [2.0, 2.2], [1, 0]), transform: `scale(${1 - 0.18 * press})`, filter: "drop-shadow(0 4px 6px rgba(0,0,0,.3))" }}>
        <path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.4 L18 13.4 Z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    </AbsoluteFill>
  );
};
