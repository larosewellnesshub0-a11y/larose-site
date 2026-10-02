import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { FPS } from "../lib";
import { R1Open } from "./R1Open";
import { R2Book } from "./R2Book";
import { R3Features } from "./R3Features";
import { R4Twist } from "./R4Twist";
import { R5Drop } from "./R5Drop";
import { R6End } from "./R6End";

const scenes: [number, number, React.FC][] = [[0, 11, R1Open], [11, 24, R2Book], [24, 48, R3Features], [48, 51, R4Twist], [51, 80, R5Drop], [80, 84, R6End]];
export const REEL_SECONDS = 84;
export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: "#FBF9F4" }}>
    {scenes.map(([a, b, S]) => (
      <Sequence key={a} from={a * FPS} durationInFrames={(b - a) * FPS} premountFor={FPS}><S /></Sequence>
    ))}
    <Audio src={staticFile("reel-soundtrack.wav")} />
  </AbsoluteFill>
);
