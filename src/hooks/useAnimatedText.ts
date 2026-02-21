"use client";

import { useEffect, useState } from "react";

export function useAnimatedText(text: string, delimiter: string = "") {
  const [cursor, setCursor] = useState(0);
  const [startingCursor, setStartingCursor] = useState(0);
  const [prevText, setPrevText] = useState(text);

  if (prevText !== text) {
    setPrevText(text);
    setStartingCursor(text.startsWith(prevText) ? cursor : 0);
  }

  useEffect(() => {
    const parts = text.split(delimiter);
    const target = parts.length;
    if (startingCursor >= target) {
      setCursor(target);
      return;
    }
    const durationSec =
      delimiter === ""
        ? 8
        : delimiter === " "
          ? 4
          : 2;
    const startTime = performance.now();
    const startVal = startingCursor;

    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const t = Math.min(1, elapsed / durationSec);
      const eased = 1 - (1 - t) * (1 - t);
      const current = Math.floor(startVal + (target - startVal) * eased);
      setCursor(current);
      if (current < target) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [startingCursor, text, delimiter]);

  return text.split(delimiter).slice(0, cursor).join(delimiter);
}
