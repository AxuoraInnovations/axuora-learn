"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type MotionVariants = React.ComponentProps<typeof motion.span>["variants"];

interface GradualSpacingProps {
  text: string;
  duration?: number;
  delayMultiple?: number;
  framerProps?: MotionVariants;
  className?: string;
}

function GradualSpacing({
  text,
  duration = 0.5,
  delayMultiple = 0.04,
  framerProps = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  className,
}: GradualSpacingProps) {
  return (
    <div className={cn("flex justify-center flex-nowrap gap-x-1 gap-y-0 whitespace-nowrap", className)}>
      <AnimatePresence>
        {text.split("").map((char, i) => (
          <motion.span
            key={`${i}-${char}`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={framerProps}
            transition={{ duration, delay: i * delayMultiple }}
            className="inline-block drop-shadow-sm [font-family:inherit] [font-size:inherit] [font-weight:inherit] [letter-spacing:inherit] [color:inherit]"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}

export { GradualSpacing };
