import { Composition } from "remotion";
import { Promo } from "./Promo";
import { FPS } from "./lib";
import { Reel, REEL_SECONDS } from "./reel/Reel";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="LaRosePromo" component={Promo} durationInFrames={90 * FPS} fps={FPS} width={1920} height={1080} />
    <Composition id="LaRoseReel" component={Reel} durationInFrames={REEL_SECONDS * FPS} fps={FPS} width={1080} height={1920} />
  </>
);
