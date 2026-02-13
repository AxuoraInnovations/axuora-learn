"use client";

import { motion } from "motion/react";

export function WhoAreWe() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-content mx-auto px-5 md:px-10 text-center">
        <motion.h2
          className="text-4xl md:text-5xl lg:text-[64px] font-semibold leading-[1.1] tracking-[-0.04em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          Who are We?
        </motion.h2>
      </div>
    </section>
  );
}
