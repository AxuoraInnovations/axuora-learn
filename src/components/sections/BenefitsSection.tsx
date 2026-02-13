"use client";

import { motion } from "motion/react";

const benefits = [
  {
    title: "Clear visibility into interaction",
    description:
      "Flowsuite centralizes all your contacts, communication history, notes, activities, and tasks.",
  },
  {
    title: "Smoother sales pipelines",
    description:
      "Track leads, automate follow-ups, and move deals forward with a faster, more organized sales flow.",
  },
  {
    title: "Increased team productivity",
    description:
      "Automate repetitive tasks like reminders, follow-ups, email sends, task assignments",
  },
  {
    title: "Flexible & Remote-Friendly",
    description:
      "Work from anywhere with ease. Stay connected and productive no matter where you are.",
  },
  {
    title: "Smart Workflow Automation",
    description:
      "Work your way — from home or on the go — with tools that keep you connected and productive.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export function BenefitsSection() {
  return (
    <section className="bg-neutral-light py-16 md:py-24">
      <div className="max-w-content mx-auto px-5 md:px-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary font-medium text-sm tracking-wide mb-2">BENEFITS</p>
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold leading-[1.1] tracking-[-0.04em] mb-4">
            The Powerful Advantages Your Team Gets
          </h2>
          <p className="text-theme-7 text-base md:text-lg leading-relaxed">
            Unlock key benefits that boost your team's productivity and performance.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
            hidden: {},
          }}
        >
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              variants={cardVariants}
              custom={i}
              className="bg-white border border-theme-10 rounded-2xl p-6 hover:border-primary/20 transition-colors"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <h3 className="text-lg font-semibold text-neutral-dark mb-2">{benefit.title}</h3>
              <p className="text-theme-7 text-sm leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
