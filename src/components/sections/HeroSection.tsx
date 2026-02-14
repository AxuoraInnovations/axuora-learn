"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Typewriter } from "@/components/ui/typewriter";
import { WaitlistCountBlock } from "@/components/WaitlistCountBlock";

function HeroDashboardMockup() {
  return (
    <div className="h-full min-w-[320px] w-full flex bg-primary/5">
      {/* Sidebar: proportional for mobile / tablet; desktop (lg) scaled up to match main content */}
      <aside className="w-11 min-w-[44px] sm:w-12 md:w-14 lg:w-52 flex-shrink-0 flex flex-col border-r border-primary/10 bg-white shadow-[2px_0_12px_rgba(4,84,255,0.06)] overflow-hidden">
        <div className="p-1 sm:p-1.5 md:p-2 lg:p-3 border-b border-primary/10 shrink-0">
          <div className="rounded-md lg:rounded-lg bg-primary/10 px-1 py-1.5 md:py-2 lg:px-3 lg:py-3 text-center ring-1 ring-primary/5">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-sm font-bold text-primary leading-tight block truncate">AxuoraLearn</span>
            <span className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-xs text-primary/80 block mt-0.5 lg:mt-1">V1.0</span>
          </div>
        </div>
        <nav className="flex-1 py-1 sm:py-1.5 md:py-2 lg:py-3 min-h-0 flex flex-col gap-0.5 overflow-y-auto overflow-x-visible justify-center lg:justify-start">
          {[
            { label: "Dashboard", active: true, icon: "grid" },
            { label: "New Chat", icon: "doc" },
            { label: "Chat History", icon: "clock" },
            { label: "Library", icon: "stack" },
            { label: "Stats", icon: "chart" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-1 sm:px-1.5 md:px-2 lg:px-3 py-1.5 md:py-2 lg:py-2.5 rounded-md lg:rounded-lg text-[9px] md:text-[10px] lg:text-sm font-medium shrink-0 ${item.active ? "bg-primary text-white" : "text-gray-600"}`}
            >
              {item.icon === "grid" && <GridIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5 shrink-0" />}
              {item.icon === "doc" && <DocIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5 shrink-0" />}
              {item.icon === "clock" && <ClockIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5 shrink-0" />}
              {item.icon === "stack" && <StackIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5 shrink-0" />}
              {item.icon === "chart" && <ChartIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5 shrink-0" />}
              <span className="hidden lg:inline truncate">{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="p-1 sm:p-1.5 md:p-2 lg:p-3 border-t border-primary/10 shrink-0 space-y-0.5">
          <div className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-1 sm:px-1.5 md:px-2 lg:px-3 py-1.5 lg:py-2.5 rounded-md lg:rounded-lg text-gray-600">
            <SettingsIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-5 lg:h-5 shrink-0" />
            <span className="hidden lg:inline text-sm">Settings</span>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 px-1 sm:px-1.5 md:px-2 lg:px-3 py-1.5 lg:py-2.5 rounded-md lg:rounded-lg bg-primary/10 text-primary">
            <span className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-8 lg:h-8 rounded-full bg-primary/20 flex items-center justify-center text-[8px] md:text-[9px] lg:text-xs font-semibold shrink-0">JP</span>
            <span className="hidden lg:inline text-sm font-medium">Profile</span>
          </div>
        </div>
      </aside>
      {/* Main content: desktop (lg) scaled up so details fill space – professional density */}
      <main className="flex-1 min-w-0 flex flex-col p-2 sm:p-2.5 md:p-3 lg:p-5 xl:p-6 gap-1.5 md:gap-2 lg:gap-4 overflow-auto">
        <div className="flex items-center justify-between gap-2 shrink-0 lg:mb-1">
          <h2 className="text-[11px] sm:text-xs md:text-sm lg:text-xl font-semibold text-gray-800 truncate">Hello, John Pork 👋</h2>
          <div className="rounded-full bg-primary/10 text-primary px-1.5 py-0.5 md:px-2 md:py-1 lg:px-4 lg:py-2 text-[8px] sm:text-[9px] md:text-[10px] lg:text-base font-medium shrink-0">1:20 PM</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-1.5 md:gap-2 lg:gap-4 flex-1 min-h-0 content-stretch">
          {/* Mock Exams */}
          <div className="lg:col-span-4 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 border border-primary/20 p-2 md:p-2.5 lg:p-4 xl:p-5 flex flex-col justify-between min-h-[64px] md:min-h-0 lg:min-h-[100px] shadow-[0_2px_8px_rgba(4,84,255,0.08)]">
            <span className="text-[9px] md:text-[10px] lg:text-base font-semibold text-primary uppercase tracking-wide">Mock Exams</span>
            <div className="rounded-md md:rounded-lg bg-white/95 border border-primary/10 p-1.5 md:p-2 lg:p-3 xl:p-4 flex items-center gap-1.5 md:gap-2 lg:gap-3 mt-0.5 md:mt-1 lg:mt-2">
              <BookIcon className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-6 lg:h-6 text-primary shrink-0" />
              <span className="text-[9px] md:text-[10px] lg:text-base font-medium text-gray-700 truncate">IGCSE Business Studies</span>
            </div>
          </div>
          {/* Calendar */}
          <div className="lg:col-span-3 rounded-lg md:rounded-xl bg-white border border-primary/10 shadow-[0_2px_8px_rgba(4,84,255,0.06)] p-1.5 md:p-2 lg:p-4 xl:p-5 min-h-0 lg:min-h-[100px] flex flex-col">
            <div className="flex items-center justify-between mb-0.5 md:mb-1 lg:mb-2">
              <span className="text-[9px] md:text-[10px] lg:text-base font-medium text-gray-600">June 2026</span>
              <span className="text-[8px] md:text-[9px] lg:text-sm text-gray-400">‹ ›</span>
            </div>
            <div className="grid grid-cols-7 gap-px text-[7px] md:text-[8px] lg:text-xs text-gray-500 text-center">
              {["S","M","T","W","T","F","S"].map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-px mt-0.5 md:mt-1 lg:mt-2 text-[7px] md:text-[8px] lg:text-xs flex-1 content-start">
              {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map((n) => (
                <span key={n} className={`rounded p-0.5 lg:p-1.5 ${n === 10 ? "bg-primary text-white" : "text-gray-600"}`}>{n}</span>
              ))}
            </div>
          </div>
          {/* Quick Analytics + User profile row */}
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-1.5 md:gap-2 lg:gap-4 min-h-0">
            <div className="rounded-lg md:rounded-xl bg-white border border-primary/10 shadow-[0_2px_8px_rgba(4,84,255,0.06)] p-1.5 md:p-2 lg:p-4 xl:p-5 lg:min-h-[88px]">
              <p className="text-[8px] md:text-[9px] lg:text-sm text-gray-500 uppercase tracking-wide">Questions done</p>
              <p className="text-xs md:text-sm lg:text-xl xl:text-2xl font-bold text-primary mt-0.5 lg:mt-2">127</p>
            </div>
            <div className="rounded-lg md:rounded-xl bg-white border border-primary/10 shadow-[0_2px_8px_rgba(4,84,255,0.06)] p-1.5 md:p-2 lg:p-4 xl:p-5 lg:min-h-[88px]">
              <p className="text-[8px] md:text-[9px] lg:text-sm text-gray-500 uppercase tracking-wide">Streak</p>
              <p className="text-xs md:text-sm lg:text-xl xl:text-2xl font-bold text-primary mt-0.5 lg:mt-2">5 days</p>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 p-1.5 md:p-2 lg:p-4 xl:p-5 flex items-center gap-1.5 md:gap-2 lg:gap-4 min-h-0 lg:min-h-[88px] shadow-[0_2px_8px_rgba(4,84,255,0.08)]">
              <span className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-12 lg:h-12 rounded-full bg-primary/20 flex items-center justify-center text-[9px] md:text-xs lg:text-sm font-bold shrink-0 text-primary">JP</span>
              <div className="min-w-0">
                <p className="text-[9px] md:text-[10px] lg:text-base font-semibold text-gray-800 truncate">John Pork</p>
                <p className="text-[8px] md:text-[9px] lg:text-sm text-primary font-medium">Pro</p>
              </div>
            </div>
          </div>
          {/* To do */}
          <div className="lg:col-span-5 rounded-lg md:rounded-xl bg-white border border-primary/10 shadow-[0_2px_8px_rgba(4,84,255,0.06)] p-1.5 md:p-2 lg:p-4 xl:p-5 min-h-0 lg:min-h-[100px] flex flex-col">
            <h3 className="text-[9px] md:text-[10px] lg:text-base font-semibold text-gray-800 mb-1 lg:mb-2">To do 📌</h3>
            <ul className="space-y-0.5 md:space-y-1 lg:space-y-2 text-[8px] md:text-[9px] lg:text-base text-gray-600 flex-1">
              <li className="flex items-center gap-1.5 md:gap-2 lg:gap-3"><span className="rounded border border-gray-300 w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 shrink-0" /><span className="truncate">Maths test — Tue, 12 Mar</span></li>
              <li className="flex items-center gap-1.5 md:gap-2 lg:gap-3"><span className="rounded bg-primary w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 shrink-0 flex items-center justify-center text-white text-[7px] md:text-[8px] lg:text-[10px]">✓</span><span className="truncate line-through">Accounting — Fri, 21 Feb</span></li>
            </ul>
          </div>
          {/* Study Screen Time */}
          <div className="lg:col-span-4 rounded-lg md:rounded-xl bg-white border border-primary/10 shadow-[0_2px_8px_rgba(4,84,255,0.06)] p-1.5 md:p-2 lg:p-4 xl:p-5 flex flex-col min-h-[56px] md:min-h-0 lg:min-h-[100px]">
            <h3 className="text-[9px] md:text-[10px] lg:text-base font-semibold text-gray-800 mb-1 lg:mb-2">Study Time 📚</h3>
            <div className="flex-1 flex items-end gap-0.5 min-h-[24px] md:min-h-[28px] lg:min-h-[44px]">
              {[35, 50, 45, 60, 55, 40, 45, 50].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col gap-px justify-end max-w-[18px] lg:max-w-[32px]">
                  <div className="rounded-t bg-primary/70 min-h-[2px]" style={{ height: `${(h / 80) * 100}%` }} />
                  <div className="rounded-t bg-primary/20 min-h-[2px]" style={{ height: `${((80 - h) / 80) * 100}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-0.5 md:mt-1 lg:mt-2 text-[7px] md:text-[8px] lg:text-sm text-gray-500">
              <span>Revision</span>
              <span>Break</span>
            </div>
          </div>
          {/* Quick Insights */}
          <div className="lg:col-span-3 rounded-lg md:rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 p-2 md:p-2.5 lg:p-5 xl:p-6 flex flex-col items-center justify-center min-h-0 lg:min-h-[100px] shadow-[0_2px_8px_rgba(4,84,255,0.1)]">
            <h3 className="text-[9px] md:text-[10px] lg:text-base font-semibold text-gray-800 mb-1 lg:mb-2">Quick Insights</h3>
            <div className="rounded-full border-2 border-primary/30 w-8 h-8 md:w-9 md:h-9 lg:w-14 lg:h-14 flex items-center justify-center">
              <span className="text-xs md:text-sm lg:text-lg font-bold text-primary">9.0</span>
            </div>
            <p className="text-[8px] md:text-[9px] lg:text-sm text-gray-600 mt-0.5 md:mt-1 lg:mt-2">Your Grade</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}
function DocIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function StackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  );
}
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

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
          <motion.div
            variants={stagger}
            custom={3}
            className="flex justify-center"
          >
            <Link
              href="/waitlist"
              className="inline-flex w-[min(90%,280px)] min-w-[200px] items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900 transition-colors md:text-base md:py-3.5"
            >
              Join the Waitlist
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="w-full max-w-[1440px] flex justify-center mt-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <div className="relative w-full aspect-[2.057] max-h-[700px] min-h-[280px] md:min-h-[320px] rounded-xl overflow-hidden bg-white shadow-2xl shadow-black/20 border border-white/20">
            <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
              <HeroDashboardMockup />
            </div>
          </div>
        </motion.div>
        <WaitlistCountBlock />
      </div>
    </section>
  );
}
