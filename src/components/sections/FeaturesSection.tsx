"use client";

import Link from "next/link";
import { motion } from "motion/react";

const features = [
  {
    title: "AI Exam Questions Generator",
    description:
      "Turn past papers pdf into analyzed prediction of practice questions in seconds.",
    icon: "89",
  },
  {
    title: "Weekly Performance Tracker",
    description:
      "Tracks your progress on a weekly basis, to check if you're locked in. Monthly reports to conclude your performance.",
    icon: "55",
  },
  {
    title: "Smart and Effortless Data Analysis",
    description:
      "Experience smart and effortless data analysis with advanced AI tools that simplify insights, visualize patterns.",
    icon: "26",
  },
  {
    title: "Intelligent Automated Task Planner",
    description:
      "Boost efficiency with an intelligent automated task planner — effortlessly schedule, prioritize and manage.",
    icon: "55",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export function FeaturesSection() {
  return (
    <section className="bg-neutral-light py-16 md:py-24">
      <div className="max-w-content mx-auto px-5 md:px-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary font-medium text-sm tracking-wide mb-2">FEATURES</p>
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold leading-[1.1] tracking-[-0.04em] mb-4">
            Smarter Tools to
            <br />
            Accelerate Your Preparation
          </h2>
          <p className="text-theme-7 text-base md:text-lg leading-relaxed">
            Explore features that create flow-state for you, with ease. Fumble is not in our
            dictionary
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {},
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              custom={i}
              className="bg-primary border border-theme-10 rounded-2xl p-6 md:p-8 hover:border-primary/20 transition-colors"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="text-4xl font-bold text-primary/20 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-neutral-dark mb-2">{feature.title}</h3>
              <p className="text-theme-7 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-12">
          <Link
            href="/features"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            Explore all features
            <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
