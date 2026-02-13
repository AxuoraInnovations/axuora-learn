"use client";

import { cn } from "@/lib/utils";

export function MenuToggleIcon({
  open,
  className,
}: {
  open: boolean;
  className?: string;
  duration?: number;
}) {
  return (
    <span className={cn("relative block size-5", className)} aria-hidden>
      {open ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-full">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="size-full">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )}
    </span>
  );
}
