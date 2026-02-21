"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  blue: "text-[#0C6CFF]",
  grey: "text-slate-500",
} as const;

const borderVariants = {
  blue: "bg-gradient-to-r from-[#0C6CFF] via-[#2580ff] to-[#0C6CFF]",
  grey: "bg-gradient-to-r from-[#94a3b8] via-[#cbd5e1] to-[#94a3b8]",
} as const;

export function AnimatedGradientText({
  children,
  className,
  variant = "blue",
}: {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof variants;
}) {
  return (
    <div
      className={cn(
        "group relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-2xl bg-white px-4 py-1.5 text-sm font-medium [--bg-size:300%]",
        variants[variant],
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 block h-full w-full animate-gradient bg-[length:var(--bg-size)_100%] p-[1px] ![mask-composite:subtract] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]",
          borderVariants[variant],
        )}
      />

      <span className="relative z-10">{children}</span>
    </div>
  );
}
