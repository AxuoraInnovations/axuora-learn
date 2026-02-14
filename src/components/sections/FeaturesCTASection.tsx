"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function FeaturesCTASection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.99) 40%, rgba(4, 84, 255, 0.04) 85%, rgba(4, 84, 255, 0.08) 100%)",
        }}
      />

      <motion.div
        className="relative max-w-content mx-auto px-5 md:px-20"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="text-center max-w-3xl mx-auto">
          <motion.p
            className="text-primary font-medium text-sm tracking-wide mb-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            FEATURES
          </motion.p>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold leading-[1.15] tracking-[-0.04em] mb-4 text-neutral-dark"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Smarter Tools to Accelerate Your Exam Prep with AxuoraLearn
          </motion.h2>
          <motion.p
            className="text-neutral-dark text-base md:text-lg leading-relaxed mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, delay: 0.25 }}
          >
            AI-powered exam prep built by teens, for teens. Get full-marks breakdowns and
            practice with confidence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              Learn more about our features
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
