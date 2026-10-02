import React from "react";
import { AbsoluteFill, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { FPS } from "./lib";
import { S1Intro } from "./scenes/S1Intro";
import { S2Home } from "./scenes/S2Home";
import { S3Type } from "./scenes/S3Type";
import { S4Color } from "./scenes/S4Color";
import { S5UI } from "./scenes/S5UI";
import { S6Pages } from "./scenes/S6Pages";
import { S7FakeEnd } from "./scenes/S7FakeEnd";
import { S8Build } from "./scenes/S8Build";
import { S9SEO } from "./scenes/S9SEO";
import { S10Outro } from "./scenes/S10Outro";
import { STools } from "./scenes/STools";
import { SPeople } from "./scenes/SPeople";
import { SBreak } from "./scenes/SBreak";
import { SFinale } from "./scenes/SFinale";

const scenes: [number, number, React.FC][] = [
  [0, 4, S1Intro], [4, 8, S2Home], [8, 14, S3Type], [14, 18, S4Color], [18, 24, S5UI],
  [24, 28, STools], [28, 35, S6Pages], [35, 40, SPeople], [40, 47, S7FakeEnd], [47, 50, S8Build], [50, 72, S9SEO],
  [72, 76, SBreak], [76, 84, SFinale], [84, 90, S10Outro],
];

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {scenes.map(([a, b, S]) => (
      <Sequence key={a} from={a * FPS} durationInFrames={(b - a) * FPS} premountFor={FPS}>
        <S />
      </Sequence>
    ))}
    <Audio src={staticFile("soundtrack.wav")} />
  </AbsoluteFill>
);
