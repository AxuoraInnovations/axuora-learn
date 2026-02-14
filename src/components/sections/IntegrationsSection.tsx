"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function IntegrationsSection() {
  return (
    <section
      className="relative w-full bg-cover bg-center bg-no-repeat py-24 md:py-32"
      style={{
        backgroundImage: "url(https://framerusercontent.com/images/Kk2qrfbXdplkIOTNSe41M9SuKI.svg)",
      }}
    >
      <div className="max-w-content mx-auto px-5 md:px-10">
        {/* Section label: pill + lines (home page only; this section is only on home) */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
        >
          <span className="h-px flex-1 max-w-20 bg-white/40" aria-hidden />
          <span className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-medium tracking-wide text-neutral-dark shadow-sm">
            Quoted by, Teens
          </span>
          <span className="h-px flex-1 max-w-20 bg-white/40" aria-hidden />
        </motion.div>
      </div>
      <div className="max-w-content mx-auto px-5 md:px-10 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-white mb-4"
          style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          &quot;Time is Money, Use AxuoraLearn to Accelerate Your Learning.&quot;
        </motion.h2>
        <motion.p
          className="text-white max-w-xl mx-auto mb-8 text-xl md:text-2xl"
          style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Stop studying for exams with uncertainty. Start exploring features that can guarantee your academic comeback.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link
            href="/about"
            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Learn more
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
