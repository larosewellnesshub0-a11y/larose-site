import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { Background } from "../Background";
import { C, F, Glow, expo, inOut, tw, useT, pulseAt } from "../lib";

const sw = [
  { ar: "زيتوني", en: "OLIVE", hex: "#8E8B63", fg: C.onDark },
  { ar: "وردي", en: "ROSE", hex: "#CB8587", fg: C.onDark },
  { ar: "شامبانيا", en: "CHAMPAGNE", hex: "#D4B793", fg: C.ink },
  { ar: "ورقي", en: "PAPER", hex: "#FBF9F4", fg: C.ink },
  { ar: "حبر", en: "INK", hex: "#23241A", fg: C.onDark },
  { ar: "مريمية", en: "SAGE", hex: "#D6D4AD", fg: C.ink },
];
const W = 230, H = 400, GAP = 40;
const xOf = (i: number) => 1920 - 170 - W - i * (W + GAP);
const Y = 250;

// 14–18 s: the palette as brand arches. The rose dot lands as the rose swatch; we exit by diving into "paper".
export const S4Color: React.FC = () => {
  const { t, g } = useT(14);
  const { fps } = useVideoConfig();
  const m = tw(t, [0, 0.45], [0, 1], expo); // rose morph
  const dive = tw(t, [3.4, 4.0], [0, 1], inOut);
  const p = pulseAt(g);
  const PX = xOf(3) + W / 2, PY = Y + H / 2;
  const camS = 1 + dive * 9;
  return (
    <AbsoluteFill>
      <Background g={g} mode="paper" />
      <div style={{ position: "absolute", left: 70, top: 60, fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: C.champ700 }}>COLOUR · الألوان</div>
      <AbsoluteFill style={{ transform: `translate(${PX}px,${PY}px) scale(${camS}) translate(${-PX}px,${-PY}px)`, transformOrigin: "0 0" }}>
        {sw.map((s, i) => {
          const at = i === 1 ? 0 : i === 0 ? 0.5 : i * 0.5;
          const sp = spring({ frame: (t - at) * fps, fps, config: { damping: 14, stiffness: 180 } });
          if (t < at) return null;
          const breathe = 1 + 0.05 * pulseAt(g - i * 0.06);
          let left = xOf(i), top = Y, w = W, h = H, r = W / 2;
          if (i === 1) { left = interpolate(m, [0, 1], [-100, left]); top = interpolate(m, [0, 1], [-100, top]); w = interpolate(m, [0, 1], [2120, W]); h = interpolate(m, [0, 1], [1280, H]); r = interpolate(m, [0, 1], [0, W / 2]); }
          const sc = i === 1 ? 1 : sp;
          return (
            <div key={i} style={{ position: "absolute", left, top, width: w }}>
              <div style={{ width: w, height: h, background: s.hex, borderRadius: `${r}px ${r}px 18px 18px`, transform: `scaleY(${sc * breathe})`, transformOrigin: "bottom",
                border: i === 3 ? "1.5px solid rgba(126,99,64,.45)" : "none", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", bottom: 20, width: "100%", textAlign: "center", fontFamily: F.sans, fontSize: 16, letterSpacing: 2, color: s.fg, opacity: 0.85 * sc }}>{s.hex}</div>
              </div>
              <div style={{ textAlign: "center", marginTop: 26, opacity: tw(t, [at + 0.1, at + 0.3], [0, 1]) * (1 - dive) }}>
                <div style={{ fontFamily: F.arDisplay, fontSize: 46, color: C.ink }}><Glow g={g} strength={0.6}>{s.ar}</Glow></div>
                <div style={{ fontFamily: F.sans, fontSize: 17, letterSpacing: 6, color: C.champ700, marginTop: 6 }}>{s.en}</div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", bottom: 70, width: "100%", textAlign: "center", fontFamily: F.arBody, fontSize: 26, color: C.inkMuted, direction: "rtl", opacity: tw(t, [2.8, 3.1], [0, 1]) * (1 - dive) }}>
        ألوان هادية مستوحاة من الطبيعة — <span style={{ fontFamily: F.sans, fontSize: 20, letterSpacing: 3 }}>calm, natural, warm</span>
        <span style={{ opacity: p }} />
      </div>
    </AbsoluteFill>
  );
};
