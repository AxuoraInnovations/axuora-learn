"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function AboutSection() {
  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="max-w-content mx-auto px-5 md:px-20">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-primary font-medium text-sm tracking-wide mb-3">ABOUT AXUORALEARN</p>
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold leading-[1.15] tracking-tight text-neutral-dark mb-6">
            The education system is broken. We built the cheat code.
          </h2>
          <p className="text-theme-7 text-lg md:text-xl leading-relaxed mb-8">
            <strong className="text-neutral-dark">AxuoraLearn</strong> is an AI learning platform that
            analyzes past papers to break down how to get <strong className="text-neutral-dark">full
            marks</strong> and <strong className="text-neutral-dark">predicts exam questions</strong>.
            Full Marks Analyzer + predictive mock exams, flashcards, and an AI agent that can even
            generate live audio lessons. Study anytime, anywhere — super affordable, less anxiety,
            more confidence.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Why we built it — and who we are
            <span className="ml-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
