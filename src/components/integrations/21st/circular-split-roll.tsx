"use client";

import CircularSplitRoll from "@/components/integrations/21st/circular-split-roll.component";

// Component paints the theme background/foreground out of the box.
// Pass `background` / `titleColor` to pin it to a specific palette.
export default function CircularSplitRollDemo() {
  return (
    <CircularSplitRoll
      radius={500}
      cardSize={205}
      textSideScale={0.68}
      textSideOpacity={0.18}
    />
  );
}


