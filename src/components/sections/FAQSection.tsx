"use client";

import { useState } from "react";
import { motion } from "motion/react";

const faqs = [
  {
    q: "What is AxuoraLearn and who is it for?",
    a: "AxuoraLearn is an AI-powered exam preparation platform built by teens for teens. It helps students prepare for exams with AI-generated practice questions, step-by-step answer breakdowns, and performance tracking.",
  },
  {
    q: "How does the AI exam question generator work?",
    a: "Our AI analyzes past papers and your subjects to generate predictive exam-style questions. You get unlimited practice tailored to your syllabus, with full-marks breakdowns that show you how to approach each answer.",
  },
  {
    q: "Is AxuoraLearn free to use?",
    a: "We offer a free Starter plan with limited questions and features. Pro and Pro Plus plans unlock unlimited AI questions, all subjects, weekly performance tracking, and more. Check our Pricing page for details.",
  },
  {
    q: "Can I use AxuoraLearn for any subject or exam board?",
    a: "Yes. AxuoraLearn supports multiple subjects and exam boards. The Pro plan includes access to all subjects so you can prepare for every exam in one place.",
  },
  {
    q: "What kind of support do you offer?",
    a: "We offer email support and in-app help. You'll also find guides and tips on how to get the most out of AI practice questions and the full-marks analyzer.",
  },
  {
    q: "How does the full-marks analyzer help me?",
    a: "The full-marks analyzer breaks down model answers step by step, so you see exactly how to get full marks. It highlights key points, working, and marking criteria so you can learn the method, not just the answer.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-neutral-light py-16 md:py-24">
      <div className="max-w-content mx-auto px-5 md:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold leading-[1.1] tracking-[-0.04em] mb-4">
              Your Questions
              <br />
              Answered
            </h2>
            <p className="text-theme-7 text-base leading-relaxed">
              Find clear answers and solutions to all your questions quickly.
            </p>
          </motion.div>
          <motion.div
            className="lg:col-span-8 space-y-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              visible: { transition: { staggerChildren: 0.06 } },
              hidden: {},
            }}
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                }}
                className="border border-theme-10 rounded-xl overflow-hidden bg-white"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between text-left px-6 py-4 font-medium text-neutral-dark hover:bg-theme-9/50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  {faq.q}
                  <span className="text-theme-7 ml-2 shrink-0">
                    {openIndex === i ? "−" : "+"}
                  </span>
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-4 text-theme-7 text-sm leading-relaxed border-t border-theme-10 pt-2">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
