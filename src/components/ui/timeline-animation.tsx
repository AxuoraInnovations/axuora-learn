"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TimelineContentProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "span" | "h2" | "p";
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLDivElement | null>;
  customVariants?: {
    visible: (i: number) => object;
    hidden: object;
  };
};

/**
 * Wrapper for scroll-triggered timeline animations.
 * Renders the given element with className; integrate with your preferred
 * scroll/animation library for full effect.
 */
export function TimelineContent({
  as = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
  ...props
}: TimelineContentProps) {
  return React.createElement(
    as,
    { className: cn(className), ...props },
    children
  );
}
