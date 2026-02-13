"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

type Variant = "fadeUp" | "fadeIn" | "scaleUp";

const baseVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.97 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  },
};

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  delay?: number;
  amount?: number;
}

export function AnimateOnScroll({
  children,
  className,
  variant = "fadeUp",
  delay = 0,
  amount = 0.12,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });

  const v = baseVariants[variant];
  const variants = {
    hidden: v.hidden,
    visible: {
      ...v.visible,
      transition: {
        ...(typeof v.visible.transition === "object" ? v.visible.transition : {}),
        delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
