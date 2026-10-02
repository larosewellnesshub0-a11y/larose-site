import React from "react";
import { Img, staticFile } from "remotion";
import { C, F, expo, gloss, inOut, tw } from "../lib";
import { AbsoluteFill, BG, RGlow, useG } from "./kit";

// 80–84: the logo lands; La Rose Wellness Hub leads, the Arabic name supports.
export const R6End: React.FC = () => {
  const { t, g } = useG(80);
  const land = tw(t, [0, 0.45], [0, 1], expo);
  const url = "laroseclinics.com";
  const typed = Math.floor(tw(t, [1.0, 1.6], [0, url.length], inOut));
  return (
    <AbsoluteFill style={{ opacity: tw(t, [3.6, 4.0], [1, 0.85]) }}>
      <BG g={g} mode="paper" />
      <div style={{ position: "absolute", left: 540 - 220, top: 300, width: 440, height: 570, ...gloss(true, "220px 220px 32px 32px"), background: C.olive800, transform: `scale(${1.25 - 0.25 * land})`, opacity: land,
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile("brand/larose-wordmark-white.png")} style={{ width: 310, filter: `drop-shadow(0 0 ${8 + 30 * Math.exp(-t * 2)}px rgba(212,183,147,.75))` }} />
      </div>
      <div style={{ position: "absolute", top: 930, width: "100%", textAlign: "center", opacity: tw(t, [0.3, 0.6], [0, 1]) }}>
        <div style={{ fontFamily: F.display, fontSize: 90, color: C.ink, lineHeight: 1, whiteSpace: "nowrap" }}><RGlow g={g} strength={0.7}>La Rose Wellness Hub</RGlow></div>
        <div style={{ fontFamily: F.arDisplay, fontSize: 40, color: C.champ700, marginTop: 16 }}>عيادات لاروز التخصصية</div>
      </div>
      <div style={{ position: "absolute", left: 110, right: 110, top: 1170, ...gloss(false, 40), padding: "30px 30px", textAlign: "center", opacity: tw(t, [0.6, 0.9], [0, 1]), transform: `translateY(${tw(t, [0.6, 0.9], [40, 0], expo)}px)` }}>
        <div style={{ fontFamily: F.arDisplay, fontSize: 64, color: C.ink, direction: "rtl" }}><RGlow g={g} strength={0.8}>إحنا معاك طول الوقت</RGlow></div>
        <div style={{ fontFamily: F.graphik, fontWeight: 500, fontSize: 30, color: C.champ700, marginTop: 6 }}>We're with you, always</div>
      </div>
      <div style={{ position: "absolute", top: 1420, width: "100%", textAlign: "center", fontFamily: F.graphik, fontWeight: 600, fontSize: 52, letterSpacing: 2, color: C.ink }}>
        {url.slice(0, typed)}<span style={{ color: C.champ700, opacity: Math.floor(t * 4) % 2 }}>|</span>
      </div>
    </AbsoluteFill>
  );
};
