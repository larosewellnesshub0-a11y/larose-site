import React from "react";
import { useCurrentFrame } from "remotion";
import { C, breathAt, pulseAt, barAt } from "./lib";

export const archPath = (w: number, h: number) =>
  `M ${-w / 2} ${h / 2} V ${-h / 2 + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${w / 2} ${-h / 2 + w / 2} V ${h / 2} Z`;

type Mode = "dark" | "paper" | "olive" | "black" | "night";
const BASE: Record<Mode, [string, string]> = {
  dark: [C.olive950, C.champ], paper: [C.paper, C.olive], olive: [C.olive900, C.champ], black: ["#0B0C08", C.champ], night: [C.darkPaper, C.champ],
};

/** emitters: times (global s) at which a new arch ripple is born */
const emitters = (g: number) => {
  const out: number[] = [];
  const add = (a: number, b: number, step: number) => { for (let t = a; t < b; t += step) if (t <= g && g - t < 2.2) out.push(t); };
  add(0.25, 4, 1); add(4, 29, 1); add(30, 37, 3.5); add(37, 39.75, 0.25); add(40, 56, 0.5); add(56, 60, 1.5);
  return out;
};

export const Background: React.FC<{ g: number; mode?: Mode; grid?: number; ripples?: number; dial?: boolean }> = ({ g, mode = "dark", grid = 1, ripples = 1, dial = true }) => {
  const frame = useCurrentFrame();
  const [bg, line] = BASE[mode];
  const p = pulseAt(g); const br = breathAt(g); const bar = barAt(g);
  const cell = 96;
  const off = (g * 14) % cell;
  const gridOp = (mode === "paper" ? 0.07 : 0.06) + 0.1 * p + 0.03 * br;
  const W = 1920, H = 1080;
  const lines: React.ReactNode[] = [];
  for (let x = -cell; x < W + cell; x += cell) lines.push(<line key={"x" + x} x1={x + off} y1={0} x2={x + off} y2={H} />);
  for (let y = -cell; y < H + cell; y += cell) lines.push(<line key={"y" + y} x1={0} y1={y + off * 0.5} x2={W} y2={y + off * 0.5} />);
  const ticks: React.ReactNode[] = [];
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2; const r1 = 430; const r2 = i % 10 === 0 ? 404 : 418;
    ticks.push(<line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} />);
  }
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, overflow: "hidden" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g stroke={line} strokeWidth={1} opacity={gridOp * grid} transform={`translate(${W / 2} ${H / 2}) scale(${1 + 0.012 * p}) translate(${-W / 2} ${-H / 2})`}>{lines}</g>
        {/* grid intersections light up on the bar */}
        <g fill={line} opacity={(0.1 + 0.5 * bar) * grid}>
          {Array.from({ length: 21 * 12 }).map((_, i) => {
            const cx = (i % 21) * cell + off; const cy = Math.floor(i / 21) * cell + off * 0.5;
            const on = Math.sin(i * 12.9898 + Math.floor(g * 2) * 78.233) > 0.6;
            return on ? <rect key={i} x={cx - 2} y={cy - 2} width={4} height={4} /> : null;
          })}
        </g>
        <g transform={`translate(${W / 2} ${H / 2})`} fill="none" stroke={line}>
          {emitters(g).map((t0) => {
            const age = g - t0; const s = 0.35 + age * 1.25;
            return <path key={t0} d={archPath(360, 480)} transform={`scale(${s})`} strokeWidth={1.5 / s} opacity={Math.max(0, (1 - age / 2.2)) * 0.45 * ripples} />;
          })}
          {dial && (
            <g transform={`rotate(${g * 6}) scale(${1 + 0.035 * p + 0.02 * br})`} strokeWidth={1.2} opacity={0.18 + 0.2 * p}>
              <circle r={440} strokeWidth={1} />
              {ticks}
            </g>
          )}
        </g>
      </svg>
      {/* film grain — changes every frame so the frame never sits still */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: mode === "paper" ? 0.09 : 0.14, mixBlendMode: mode === "paper" ? "multiply" : "screen" }}>
        <filter id={`n${frame % 6}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 6} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={W} height={H} filter={`url(#n${frame % 6})`} />
      </svg>
    </div>
  );
};
