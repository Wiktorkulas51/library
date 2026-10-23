"use client";

import { InfiniteCircularScroll } from "@/components/integrations/21st/infinite-circular-scroll.component";

export default function Default() {
  return (
    <div className="flex min-h-[400px] w-full items-center justify-center bg-background p-8">
      <InfiniteCircularScroll
        itemHeight={56}
        className="w-72 rounded-lg border border-border"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div
            key={i}
            className="flex w-full items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2"
          >
            <span className="font-mono font-bold">{i}</span>
            <span className="text-sm text-muted-foreground">Card {i}</span>
          </div>
        ))}
      </InfiniteCircularScroll>
    </div>
  );
}


