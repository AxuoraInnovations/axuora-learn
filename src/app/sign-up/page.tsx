"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";

const PAGE_BG = "#0d0d0d";
const LEGAL_GREY = "#999999";

export default function SignUpPage() {
  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: PAGE_BG,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
      }}
    >
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:pl-24 lg:pr-8 xl:pl-32 xl:pr-12">
        <div className="flex w-full flex-col items-center lg:max-w-[480px] lg:shrink-0 lg:items-center lg:pl-8">
          <motion.div
            className="flex w-full flex-col items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <AuthCard mode="signup" />
          </motion.div>
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm font-medium hover:text-white transition-colors"
              style={{ color: LEGAL_GREY }}
            >
              ← Back to home
            </Link>
          </div>
        </div>

        <motion.div
          className="hidden w-full max-w-[720px] shrink-0 flex-col justify-center px-10 lg:flex xl:max-w-[800px] xl:px-14"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="-mt-6 flex flex-col gap-8 text-left">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black px-5 py-2.5">
                <Sparkles className="h-5 w-5 text-white" />
                <span className="text-base font-medium text-white">Build by Teens, for Teens</span>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold leading-tight text-white md:text-5xl xl:text-6xl">
                Where Better Study Habits Begin
                <br />
                AxuoraLearn.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/90 xl:max-w-2xl xl:text-xl">
                AxuoraLearn is an AI-powered tutoring platform that helps students prepare for exams
                with clarity and confidence through personalized, smart learning support.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
