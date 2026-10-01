import React from "react";
import { Img, staticFile } from "remotion";
import covers from "../covers.json";

export const COLS = 15, ROWS = 9, CW = 320, CH = 200, GAP = 24;
/** Grid of real article covers in world space centred on (0,0). `reveal` 0..1 fades tiles in from the centre, `collapse` 0..1 pulls them into the centre. */
export const CoverWall: React.FC<{ reveal: number; collapse?: number }> = ({ reveal, collapse = 0 }) => (
  <>
    {Array.from({ length: COLS * ROWS }).map((_, i) => {
      const c = i % COLS, r = Math.floor(i / COLS);
      const x = (c - (COLS - 1) / 2) * (CW + GAP), y = (r - (ROWS - 1) / 2) * (CH + GAP);
      const d = Math.hypot(x / 2600, y / 1000) / 1.4; // 0 centre → ~1 edge
      const vis = Math.max(0, Math.min(1, (reveal - d * 0.6) / 0.4));
      const k = Math.max(0, Math.min(1, (collapse - (1 - d) * 0.5) / 0.5));
      const ke = k * k * (3 - 2 * k);
      if (c === 7 && r === 4) return null;
      return (
        <div key={i} style={{ position: "absolute", left: x * (1 - ke) - CW / 2, top: y * (1 - ke) - CH / 2, width: CW, height: CH, borderRadius: 14, overflow: "hidden",
          opacity: vis * (1 - ke), transform: `scale(${(0.85 + 0.15 * vis) * (1 - 0.8 * ke)}) rotate(${ke * (i % 2 ? 40 : -40)}deg)`, background: "#333524" }}>
          <Img src={staticFile("covers/" + covers[i % covers.length])} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      );
    })}
  </>
);
