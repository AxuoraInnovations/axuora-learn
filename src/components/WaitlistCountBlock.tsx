"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NumberFlow from "@number-flow/react";
import { motion, useInView } from "motion/react";

const DEFAULT_COUNT = 0;

export function WaitlistCountBlock() {
  const [count, setCount] = useState(0);
  const [targetCount, setTargetCount] = useState<number | null>(null);
  const pathname = usePathname();
  const blockRef = useRef<HTMLDivElement>(null);
  const inView = useInView(blockRef, { amount: 0.2, once: true });

  // Fetch count when on home (data ready for when user scrolls to block)
  useEffect(() => {
    if (pathname !== "/") return;
    let cancelled = false;
    fetch("/api/waitlist-count?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const target = typeof data.count === "number" ? data.count : DEFAULT_COUNT;
        if (!cancelled) setTargetCount(target);
      })
      .catch(() => {
        if (!cancelled) setTargetCount(DEFAULT_COUNT);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // When block scrolls into view, run the count-up animation (short delay so 0 is visible first)
  useEffect(() => {
    if (!inView || targetCount === null) return;
    const id = setTimeout(() => setCount(targetCount), 100);
    return () => clearTimeout(id);
  }, [inView, targetCount]);

  return (
    <motion.div
      ref={blockRef}
      className="flex flex-col items-center justify-center gap-6 py-10 px-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.45 }}
    >
      <p className="text-center text-neutral-dark text-lg sm:text-xl md:text-2xl font-medium select-none">
        Join{" "}
        <span className="inline-flex items-baseline font-semibold tabular-nums text-primary [&_number-flow-react]:pointer-events-none">
          <NumberFlow
            value={count}
            format={{ useGrouping: true }}
            trend={1}
            transformTiming={{ duration: 800, easing: "ease-out" }}
            spinTiming={{ duration: 800, easing: "ease-out" }}
            opacityTiming={{ duration: 400, easing: "ease-out" }}
          />
        </span>{" "}
        others on the waitlist.
      </p>
      <Link
        href="/waitlist"
        className="inline-flex items-center justify-center gap-2 min-w-[172px] rounded-full bg-neutral-dark px-8 py-2.5 text-base font-medium text-white shadow-sm hover:bg-neutral-800 transition-colors"
      >
        Join now
        <span className="text-white/90" aria-hidden>→</span>
      </Link>
    </motion.div>
  );
}
