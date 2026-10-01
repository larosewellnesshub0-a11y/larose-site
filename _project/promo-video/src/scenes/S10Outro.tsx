import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Background, archPath } from "../Background";
import { C, F, Glow, expo, inOut, tw, useT } from "../lib";
import { CoverWall } from "./CoverWall";

// 54–60 s: the library collapses into the centre; on the final hit the logo lands.
export const S10Outro: React.FC = () => {
  const { t, g } = useT(54);
  const s = 0.18 - t * 0.006;
  const collapse = tw(t, [0.6, 2.0], [0, 1], inOut);
  const land = tw(t, [2.0, 2.5], [0, 1], expo);
  const out = tw(t, [5.2, 6.0], [1, 0], inOut);
  const arch = tw(t, [2.0, 2.9], [1400, 0], inOut);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Background g={g} mode="dark" />
      {t < 2.1 && (
        <AbsoluteFill style={{ transform: `translate(960px,540px) scale(${s})`, transformOrigin: "0 0" }}>
          <CoverWall reveal={1.4} collapse={collapse} />
        </AbsoluteFill>
      )}
      {t >= 1.9 && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d={archPath(420, 560)} transform="translate(960 395)" fill="none" stroke={C.champ} strokeWidth={2.5} strokeDasharray={1400} strokeDashoffset={arch} />
            <line x1={960 - 520 * land} x2={960 + 520 * land} y1={675} y2={675} stroke={C.champ} strokeWidth={2} />
          </svg>
          <div style={{ position: "absolute", top: 230, left: 960 - 170, width: 340, transform: `scale(${1.6 - 0.6 * land})`, opacity: land }}>
            <Img src={staticFile("brand/larose-wordmark-white.png")} style={{ width: 340, filter: `drop-shadow(0 0 ${8 + 30 * Math.exp(-(t - 2) * 2)}px rgba(212,183,147,.7))` }} />
          </div>
          <div style={{ position: "absolute", top: 705, width: "100%", textAlign: "center", opacity: tw(t, [2.4, 2.8], [0, 1]), transform: `translateY(${tw(t, [2.4, 2.8], [20, 0])}px)` }}>
            <div style={{ fontFamily: F.arDisplay, fontSize: 70, color: C.onDark, direction: "rtl" }}><Glow g={g} strength={1.2}>عيادات لاروز التخصصية</Glow></div>
            <div style={{ fontFamily: F.sans, fontSize: 24, letterSpacing: 10, color: C.champ, marginTop: 12 }}>LA ROSE WELLNESS HUB</div>
          </div>
          <div style={{ position: "absolute", top: 905, width: "100%", textAlign: "center", opacity: tw(t, [3.0, 3.4], [0, 1]) }}>
            <span style={{ fontFamily: F.sans, fontSize: 34, letterSpacing: 4, color: C.onDark }}>laroseclinics.com</span>
            <div style={{ fontFamily: F.arBody, fontSize: 24, color: C.onDarkMute, marginTop: 12 }}>المعادي · التجمع الخامس  <span style={{ fontFamily: F.sans, fontSize: 18, letterSpacing: 4 }}>— MAADI · FIFTH SETTLEMENT</span></div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
