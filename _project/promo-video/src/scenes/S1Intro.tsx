import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Background, archPath } from "../Background";
import { C, F, Glow, Wipe, easeIn, inOut, tw, useT } from "../lib";

// 0–4 s: a champagne rule, the brand arch rises from it, the wordmark appears inside, then we fly through the arch.
export const S1Intro: React.FC = () => {
  const { t, g } = useT(0);
  const lineW = tw(t, [0.25, 1.0], [0, 980]);
  const archLen = 1500;
  const draw = tw(t, [1.0, 2.0], [archLen, 0], inOut);
  const logo = tw(t, [2.0, 2.6], [0, 1]);
  const ar = tw(t, [2.5, 3.3], [0, 1]);
  const en = tw(t, [3.0, 3.5], [0, 1]);
  const fly = tw(t, [3.45, 4.0], [1, 14], easeIn);
  const fade = tw(t, [3.6, 3.9], [1, 0], easeIn);
  return (
    <AbsoluteFill>
      <Background g={g} mode="dark" ripples={0.6} />
      <AbsoluteFill style={{ transform: `scale(${fly})`, transformOrigin: "960px 470px" }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <line x1={960 - lineW / 2} x2={960 + lineW / 2} y1={710} y2={710} stroke={C.champ} strokeWidth={2} />
          <path d={archPath(380, 500)} transform="translate(960 460)" fill="none" stroke={C.champ} strokeWidth={2.5} strokeDasharray={archLen} strokeDashoffset={draw} />
        </svg>
        <div style={{ position: "absolute", left: 960 - 150, top: 330, width: 300, opacity: logo * fade,
          transform: `scale(${1.12 - 0.12 * logo})`, clipPath: `inset(${(1 - logo) * 100}% 0 0 0)` }}>
          <Img src={staticFile("brand/larose-wordmark-white.png")} style={{ width: 300, filter: `drop-shadow(0 0 ${6 + 18 * logo}px rgba(212,183,147,.55))` }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 745, width: "100%", textAlign: "center", opacity: fade }}>
        <Wipe p={ar} rtl style={{ fontFamily: F.arDisplay, fontSize: 64, color: C.onDark, direction: "rtl" }}>
          <Glow g={g}>مركز طبي متعدد التخصصات</Glow>
        </Wipe>
        <div style={{ fontFamily: F.sans, fontSize: 22, letterSpacing: 9, color: C.champ, marginTop: 14, opacity: en, transform: `translateY(${(1 - en) * 12}px)` }}>
          LA ROSE WELLNESS HUB · MULTI-SPECIALTY MEDICAL CENTRE
        </div>
      </div>
    </AbsoluteFill>
  );
};
