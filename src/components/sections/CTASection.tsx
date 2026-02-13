"use client";

import { motion } from "motion/react";

export function CTASection() {
  return (
    <section className="relative w-full min-h-[480px] sm:min-h-[520px] md:min-h-[560px] lg:min-h-[420px] flex items-center justify-center overflow-hidden bg-neutral-dark">
      {/* Responsive backgrounds – desktop uses wide, short banner size */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:hidden"
        style={{ backgroundImage: "url(/cta-bg-mobile.png)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block lg:hidden"
        style={{ backgroundImage: "url(/cta-bg-tablet.png)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 hidden lg:block bg-no-repeat bg-center"
        style={{
          backgroundImage: "url(/cta-bg-desktop.png)",
          backgroundSize: "cover",
        }}
        aria-hidden
      />

      {/* Content overlay – layout and sizing to match reference */}
      <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 sm:px-8 py-20 sm:py-24 md:py-28 text-center flex flex-col items-center">
        {/* Announcement: pill badge with star + text (use img to avoid Next/Image errors) */}
        <motion.div
          className="mb-8 sm:mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <img
            src="/cta-announcement.png"
            alt="Build by Teens, for Teens"
            className="h-auto w-auto max-w-[260px] sm:max-w-[300px] lg:max-w-[340px] object-contain"
            width={340}
            height={52}
          />
        </motion.div>

        {/* Main title – exactly 2 lines: line 1 + line 2 */}
        <motion.h2
          className="text-white font-bold leading-[1.12] tracking-tight text-center max-w-2xl mx-auto mb-5 sm:mb-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl whitespace-nowrap">
            Where Better Study Habits Begin
          </span>
          <span className="block text-2xl sm:text-3xl md:text-[3rem] lg:text-[3.25rem] mt-1">
            AxuoraLearn.
          </span>
        </motion.h2>

        {/* Description – one period, lighter weight */}
        <motion.p
          className="text-white/90 text-base sm:text-lg md:text-xl font-normal max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, delay: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          AxuoraLearn is an AI-powered tutoring platform that helps students
          prepare for exams with clarity and confidence through personalized,
          smart learning support.
        </motion.p>
      </div>
    </section>
  );
}
