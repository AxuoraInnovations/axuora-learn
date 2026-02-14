"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AnimatedGradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white px-4 py-1.5 text-sm font-medium text-[#0C6CFF] [--bg-size:300%]",
        className,
      )}
    >
      <div
        className="absolute inset-0 block h-full w-full animate-gradient bg-gradient-to-r from-[#0C6CFF] via-[#2580ff] to-[#0C6CFF] bg-[length:var(--bg-size)_100%] p-[1px] ![mask-composite:subtract] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]"
      />

      <span className="relative z-10">{children}</span>
    </div>
  );
}
