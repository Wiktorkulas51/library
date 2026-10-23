"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface InfiniteCircularScrollProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
  itemHeight?: number;
}

export function InfiniteCircularScroll({
  children,
  className,
  itemClassName,
  itemHeight = 64,
}: InfiniteCircularScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const items = React.Children.toArray(children);
  const count = Math.max(1, items.length);
  const totalHeight = count * itemHeight;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      const { scrollTop } = container;
      if (scrollTop < totalHeight * 0.5) {
        container.scrollTop = scrollTop + totalHeight;
      } else if (scrollTop > totalHeight * 2.5) {
        container.scrollTop = scrollTop - totalHeight;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    container.addEventListener("scroll", handleScroll);
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.scrollTop = totalHeight;

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [totalHeight]);

  return (
    <div
      ref={containerRef}
      data-infinite-scroll={true}
      className={cn(
        "overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden",
        className,
      )}
      style={{
        height: itemHeight * 3,
        msOverflowStyle: "none",
        overscrollBehavior: "contain",
        scrollbarWidth: "none",
      }}
    >
      <div className="flex flex-col">
        {[1, 2, 3].map((copy) => (
          <React.Fragment key={copy}>
            {items.map((child, i) => {
              const key =
                React.isValidElement(child) && child.key != null
                  ? String(child.key)
                  : `item-${copy}-${i}`;
              return (
                <div
                  key={key}
                  className={cn("flex shrink-0 items-center", itemClassName)}
                  style={{ height: itemHeight }}
                >
                  {child}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default InfiniteCircularScroll;

