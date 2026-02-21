"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight, Play, Pause, SkipBack, SkipForward, ListTodo, X, BookOpen, FileText, Youtube } from "lucide-react";
import { GetStartedCard } from "@/components/dashboard/GetStartedCard";
import { ScreenTimeCard } from "@/components/dashboard/ScreenTimeCard";

const MOCK_EXAM = { title: "IGCSE Business Studies", practice: "16", total: "10", progress: 0.6 };
const TODO_ITEMS = [
  { text: "Maths test", date: "Monday, April 17, 10:30 PM", done: true },
  { text: "Biology quiz on Thursday, Apr 21", date: "Thursday Apr 21, 9:33 AM", done: true },
  { text: "Introduction to Accounting", date: "Friday, April 25, 9:00 AM", done: true },
  { text: "Revision on Quadratic Equations", date: "Monday, April 25, 11:00 AM", done: true },
];
const STUDY_HOURS = [4, 7, 5, 6, 8, 5, 6, 4];
const MONTHS = ["Feb", "Mar", "Apr", "Apr", "May", "Jun", "Jul", "Aug"];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string; email?: string; displayName?: string } | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 5, 1));
  const [isPlaying, setIsPlaying] = useState(false);
  const [todoPanelOpen, setTodoPanelOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return;
      setUser({
        id: session.user.id,
        email: session.user.email ?? undefined,
        displayName: session.user.user_metadata?.full_name ?? session.user.user_metadata?.name ?? undefined,
      });
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  };

  const displayName = user?.displayName || user?.email?.split("@")[0] || "there";
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();

  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white px-6 py-4 md:px-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Hello, {displayName} 👋</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#333] hover:bg-[#f9f9f9]"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-[#e0e0e0] bg-white px-4 py-2 text-sm font-medium text-[#333] hover:bg-[#f9f9f9]"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Start with AI – chat is the hub for flashcards, Full Marks, YouTube, lessons, notes */}
          <Link href="/dashboard/chat">
            <motion.section
              className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-6 shadow-sm transition-shadow hover:shadow-md"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-[#1a1a1a]">Start studying with AI</h2>
              <p className="mt-1 text-sm text-[#666]">
                Flashcards, Full Marks, YouTube transcripts, lessons & notes — all in one chat.
              </p>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
                Open chat
                <ChevronRight className="h-4 w-4" />
              </span>
            </motion.section>
          </Link>

          {/* Mock Exams */}
          <motion.section
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Mock Exams</h2>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-primary-bg p-4">
              <span className="font-medium text-[#333]">{MOCK_EXAM.title}</span>
              <span className="text-sm text-[#666]">Practice: {MOCK_EXAM.practice} / {MOCK_EXAM.total}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${MOCK_EXAM.progress * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.section>

          {/* To Do List */}
          <motion.section
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <h2 className="text-lg font-semibold text-[#1a1a1a]">To Do List 📌</h2>
            <ul className="mt-4 space-y-3">
              {TODO_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border border-[#eee] p-3">
                  <span className={`mt-0.5 h-5 w-5 shrink-0 rounded border ${item.done ? "border-primary bg-primary" : "border-[#ccc]"}`} />
                  <div>
                    <p className={`text-sm font-medium ${item.done ? "text-[#666] line-through" : "text-[#333]"}`}>{item.text}</p>
                    <p className="text-xs text-[#888]">{item.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Study Screen Time */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ScreenTimeCard
              totalHours={6}
              totalMinutes={30}
              barData={STUDY_HOURS}
              timeLabels={MONTHS}
              topApps={[
                { icon: <BookOpen className="h-4 w-4" />, name: "Study", duration: "2h 10m" },
                { icon: <FileText className="h-4 w-4" />, name: "Notes", duration: "1h 45m" },
                { icon: <Youtube className="h-4 w-4" />, name: "Video", duration: "1h 05m" },
              ]}
            />
          </motion.div>
        </div>

        {/* Right widgets */}
        <div className="space-y-6">
          {/* Calendar */}
          <motion.section
            className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#1a1a1a]">
                {calendarMonth.toLocaleString("default", { month: "long" })} {calendarMonth.getFullYear()}
              </h3>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                  className="rounded p-1 hover:bg-[#f0f0f0]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                  className="rounded p-1 hover:bg-[#f0f0f0]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-[#888]">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
              {Array.from({ length: firstDay }, (_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => (
                <span
                  key={i}
                  className={`rounded py-1 ${i + 1 === 12 ? "bg-primary text-white" : "hover:bg-[#f0f0f0]"}`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Music for Your Focus */}
          <motion.section
            className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <h3 className="font-semibold text-[#1a1a1a]">Music for Your Focus</h3>
            <p className="text-xs text-[#666]">Study Mode - Lo-Fi</p>
            <div className="mt-3 flex flex-col items-center">
              <div className="h-24 w-24 rounded-full bg-primary/20" />
              <p className="mt-2 text-sm font-medium text-[#333]">Always</p>
              <p className="text-xs text-[#666]">Daniel Caesar</p>
              <div className="mt-2 w-full">
                <div className="h-1 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
                  <div className="h-full w-1/2 rounded-full bg-primary" />
                </div>
                <div className="mt-1 flex justify-between text-xs text-[#888]">
                  <span>5:33</span>
                  <span>05:17</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button type="button" className="rounded p-1 hover:bg-[#f0f0f0]">
                  <SkipBack className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="rounded-full bg-primary p-2 text-white hover:bg-primary/90"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
                </button>
                <button type="button" className="rounded p-1 hover:bg-[#f0f0f0]">
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-1 text-xs text-[#888]">Now Playing</p>
            </div>
          </motion.section>

          {/* Quick Insights */}
          <motion.section
            className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="font-semibold text-[#1a1a1a]">Quick Insights</h3>
            <div className="mt-3 flex flex-col items-center">
              <div className="relative h-24 w-24 rounded-full border-4 border-primary/30">
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#1a1a1a]">8.5</span>
              </div>
              <p className="mt-2 text-sm text-[#666]">Your Grade: 3.5</p>
            </div>
          </motion.section>
        </div>
      </div>

      {/* Get started todo – slide-out panel on the right */}
      <AnimatePresence>
        {todoPanelOpen ? (
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 z-40 flex h-full w-[380px] max-w-[100vw] flex-col border-l border-[#e5e7eb] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
              <span className="text-sm font-semibold text-[#1a1a1a]">Get started</span>
              <button
                type="button"
                onClick={() => setTodoPanelOpen(false)}
                className="rounded-lg p-1.5 text-[#666] hover:bg-[#f0f0f0] hover:text-[#1a1a1a]"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <GetStartedCard userId={user?.id ?? null} />
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="tab"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            type="button"
            onClick={() => setTodoPanelOpen(true)}
            className="fixed right-0 top-1/2 z-30 flex -translate-y-1/2 items-center gap-2 rounded-l-lg border border-r-0 border-[#e5e7eb] bg-white py-3 pl-3 pr-2 shadow-[-2px_0_12px_rgba(0,0,0,0.06)] hover:bg-[#fafafa]"
            aria-label="Open get started list"
          >
            <ListTodo className="h-5 w-5 text-[#333]" />
            <span className="text-xs font-medium text-[#333]">Get started</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
