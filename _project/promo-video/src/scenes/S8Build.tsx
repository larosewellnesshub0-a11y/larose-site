import React from "react";
import { AbsoluteFill } from "remotion";
import { Background } from "../Background";
import { C, F, Glow, tw, useT } from "../lib";

const words = ["الموقع", "ده", "معمول", "عشان", "يتلاقي"];
// 37–40 s: the plot twist builds on the snare roll.
export const S8Build: React.FC = () => {
  const { t, g } = useT(37);
  const wIdx = t < 1 ? -1 : Math.min(words.length - 1, Math.floor((t - 1) / 0.25));
  const lt = t < 1 ? t : t - 1 - wIdx * 0.25;
  const pop = tw(lt, [0, 0.12], [0, 1]);
  const shake = t > 2.4 && t < 2.75 ? Math.sin(t * 160) * 6 : 0;
  const black = t >= 2.75;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${-shake * 0.6}px) scale(${1 + Math.max(0, t - 2) * 0.08})` }}>
      <Background g={g} mode="black" ripples={1.2} />
      {!black && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontFamily: F.arDisplay, fontSize: wIdx < 0 ? 260 : 300, color: C.onDark, direction: "rtl", transform: `scale(${1.25 - 0.25 * pop})`, opacity: pop }}>
            <Glow g={g} strength={1.6}>{wIdx < 0 ? "استنى." : words[wIdx]}</Glow>
          </div>
          <div style={{ fontFamily: F.sans, fontSize: 28, letterSpacing: 10, color: C.champ, marginTop: 50, opacity: wIdx < 0 ? pop : tw(t, [2.25, 2.35], [0, 1]) }}>
            {wIdx < 0 ? "WAIT." : "BUILT TO BE FOUND"}
          </div>
        </AbsoluteFill>
      )}
      {black && <AbsoluteFill style={{ background: "#000" }} />}
    </AbsoluteFill>
  );
};
