import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Background, archPath } from "../Background";
import { C, F, Glow, Shot, Wipe, easeIn, expo, inOut, tw, useT, pulseAt } from "../lib";

// Arch window, centred. 0–2 s: a real piece of the site flashes in it on every 16th-note pair (match cuts through
// the same arch). 2 s: the arch fills with olive and the logo lands. Then the arch shrinks, the tagline arrives,
// and the snare fill flies us through the arch into the homepage.
const AW = 620, AH = 800;
const flashes: [string, number, number, number][] = [ // shot, css centre x, centre y, css width shown
  ["ar-home", 760, 470, 720],
  ["ar-home", 960, 782, 430],
  ["ar-doctor", 1024, 600, 560],
  ["ar-article", 720, 860, 760],
  ["ar-specialties", 1112, 1100, 470],
  ["ar-bmi", 720, 700, 820],
  ["ar-weight", 720, 330, 800],
  ["ar-home", 1365, 93, 230],
];

export const S1Intro: React.FC = () => {
  const { t, g } = useT(0);
  const p = pulseAt(g);
  const i = Math.min(7, Math.floor(t / 0.25));
  const lt = t - i * 0.25;
  const flashPop = tw(lt, [0, 0.12], [1.12, 1]);
  const logoIn = tw(t, [2.0, 2.35], [0, 1], expo);
  const shrink = tw(t, [2.35, 2.85], [0, 1], expo);
  const fly = tw(t, [3.5, 4.0], [1, 16], easeIn);
  const textOut = tw(t, [3.5, 3.75], [1, 0]);
  const scale = (1 - 0.42 * shrink) * (t < 2 ? flashPop : 1) * (1 + 0.02 * p);
  const cy = 540 - 120 * shrink;
  const lineW = tw(t, [2.5, 3.0], [0, 900], expo);
  const [shot, cx, ccy, cw] = flashes[i];
  const k = AW / cw; // display px per css px
  return (
    <AbsoluteFill>
      <Background g={g} mode="brand" />
      <AbsoluteFill style={{ transform: `scale(${fly})`, transformOrigin: `960px ${cy}px` }}>
        <div style={{ position: "absolute", left: 960 - AW / 2, top: cy - AH / 2, width: AW, height: AH, transform: `scale(${scale})`,
          borderRadius: `${AW / 2}px ${AW / 2}px 22px 22px`, overflow: "hidden", background: C.olive,
          boxShadow: `0 0 ${20 + 60 * p}px rgba(212,183,147,${0.15 + 0.35 * p})` }}>
          {t < 2 && <Shot name={shot as never} width={1440 * k} style={{ left: AW / 2 - cx * k, top: AH / 2 - ccy * k }} />}
          {t >= 2 && (
            <AbsoluteFill style={{ background: C.olive900, alignItems: "center", justifyContent: "center" }}>
              <Img src={staticFile("brand/larose-wordmark-white.png")} style={{ width: 380, opacity: logoIn, transform: `scale(${1.3 - 0.3 * logoIn})`,
                filter: `drop-shadow(0 0 ${6 + 24 * p}px rgba(212,183,147,.6))` }} />
            </AbsoluteFill>
          )}
        </div>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d={archPath(AW + 36, AH + 36)} transform={`translate(960 ${cy}) scale(${scale})`} fill="none" stroke={C.champ} strokeWidth={2} opacity={0.5 + 0.5 * p} />
          <line x1={960 - lineW / 2} x2={960 + lineW / 2} y1={cy + (AH / 2) * scale + 40} y2={cy + (AH / 2) * scale + 40} stroke={C.champ} strokeWidth={2} />
        </svg>
      </AbsoluteFill>
      {/* frame counter — a tiny UI detail that ticks with the flashes */}
      {t < 2 && (
        <div style={{ position: "absolute", left: 70, bottom: 60, fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: C.champ }}>
          LAROSECLINICS.COM · 0{i + 1}/08
        </div>
      )}
      <div style={{ position: "absolute", top: 805, width: "100%", textAlign: "center", opacity: textOut }}>
        <Wipe p={tw(t, [2.55, 3.1], [0, 1], inOut)} rtl style={{ fontFamily: F.arDisplay, fontSize: 76, color: C.onDark, direction: "rtl" }}>
          <Glow g={g}>مركز طبي متعدد التخصصات</Glow>
        </Wipe>
        <div style={{ fontFamily: F.sans, fontSize: 22, letterSpacing: 9, color: C.champ, marginTop: 16, opacity: tw(t, [2.9, 3.2], [0, 1]) }}>
          LA ROSE WELLNESS HUB · MULTI-SPECIALTY MEDICAL CENTRE
        </div>
      </div>
    </AbsoluteFill>
  );
};
