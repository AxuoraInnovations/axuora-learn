"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Typewriter } from "@/components/ui/typewriter";

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export function HeroSection() {
  return (
    <section
      className="relative w-full bg-cover bg-center bg-no-repeat py-20 md:py-24"
      style={{
        backgroundImage: "url(https://framerusercontent.com/images/LTzUgqhBMU0fYD8l2vHeGvu8dQI.jpg)",
      }}
    >
      <div className="max-w-content mx-auto px-5 md:px-10 flex flex-col items-center gap-12 text-center">
        <motion.div
          className="flex flex-col items-center gap-6 max-w-[700px]"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            hidden: {},
          }}
        >
          <motion.div
            variants={stagger}
            custom={0}
            className="inline-block"
          >
            <Image
              src="/built-by-teens-badge.png"
              alt="Built by Teens for teens"
              width={180}
              height={36}
              className="h-auto w-auto max-h-8 object-contain md:max-h-9"
              unoptimized
            />
          </motion.div>
          <motion.h1
            variants={stagger}
            custom={1}
            className="text-4xl md:text-5xl lg:text-[48px] font-bold leading-[1.1] tracking-[-0.04em] text-center text-white"
          >
            <Typewriter
              text={["Speed Up Your Exams Preparation\nwith AxuoraLearn"]}
              speed={60}
              cursor="|"
              loop={false}
              className="inline-block whitespace-pre-line"
            />
          </motion.h1>
          <motion.p
            variants={stagger}
            custom={2}
            className="text-base md:text-lg leading-[1.4] max-w-[700px] text-[var(--neutral-light)]"
          >
            Take your exams with full confidence. No more skill issues and crashouts. Generate AI
            predictive exam questions alongside with advanced full marks analyzer that breaks down
            steps for you.
          </motion.p>
        </motion.div>
        <motion.div
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className="flex w-full bg-white rounded-full overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
            <input
              type="email"
              placeholder="Enter your Email"
              className="flex-1 min-w-0 px-5 py-3.5 text-base text-gray-800 bg-transparent border-0 outline-none placeholder:text-gray-500 focus:ring-0"
              aria-label="Email address"
            />
            <Link
              href="/waitlist"
              className="shrink-0 bg-black text-white px-6 py-3.5 text-sm font-medium rounded-r-full hover:bg-gray-900 transition-colors"
            >
              Get started
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="w-full max-w-[1440px] flex justify-center mt-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <div className="relative w-full aspect-[2.057] max-h-[700px] rounded-lg overflow-hidden bg-theme-9">
            <Image
              src="https://framerusercontent.com/images/iNqHkj9JE19lMFT6vXbow1lDNM.png"
              alt="Axuora Learn dashboard"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
