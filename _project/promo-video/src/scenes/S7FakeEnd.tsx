import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Background } from "../Background";
import { C, F, inOut, tw, useT } from "../lib";

// 30–37 s: it looks like the end card. The music has stopped; only a pad. Everything slowly dims.
export const S7FakeEnd: React.FC = () => {
  const { t, g } = useT(30);
  const a = tw(t, [0.3, 1.4], [0, 1], inOut);
  const dim = tw(t, [4.0, 6.8], [1, 0.08], inOut);
  const caret = Math.floor(t * 2) % 2 === 0 ? 1 : 0;
  const url = "laroseclinics.com";
  const typed = Math.floor(tw(t, [1.0, 1.6], [0, url.length], inOut));
  return (
    <AbsoluteFill style={{ opacity: dim }}>
      <Background g={g} mode="black" grid={0.6} ripples={0.5} dial={false} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", opacity: a, transform: `scale(${1.04 - 0.04 * a + t * 0.004})` }}>
        <Img src={staticFile("brand/larose-wordmark-white.png")} style={{ width: 260, opacity: 0.92 }} />
        <div style={{ fontFamily: F.sans, fontSize: 30, letterSpacing: 6, color: C.onDarkMute, marginTop: 40, direction: "ltr" }}>
          {url.slice(0, typed)}<span style={{ opacity: caret, color: C.champ }}>|</span>
        </div>
        <div style={{ fontFamily: F.arBody, fontSize: 28, color: C.champ, marginTop: 22, direction: "rtl", opacity: tw(t, [3.2, 3.8], [0, 1]) }}>
          المعادي · التجمع الخامس
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
