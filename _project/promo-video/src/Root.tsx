import { Composition } from "remotion";
import { Promo } from "./Promo";
import { FPS } from "./lib";

export const RemotionRoot: React.FC = () => (
  <Composition id="LaRosePromo" component={Promo} durationInFrames={90 * FPS} fps={FPS} width={1920} height={1080} />
);
