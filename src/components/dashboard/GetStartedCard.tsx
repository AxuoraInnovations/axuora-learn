"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_ITEMS = [
  { id: 1, text: "Complete your profile", done: false },
  { id: 2, text: "Explore the dashboard", done: false },
  { id: 3, text: "Start your first study session", done: false },
  { id: 4, text: "Check out learning resources", done: false },
  { id: 5, text: "You're all set!", done: false },
];

const STORAGE_KEY_PREFIX = "axuora_get_started_";
const CONFETTI_COLORS = ["#10b981", "#f59e0b", "#6366f1", "#ef4444", "#06b6d4"];

function loadItems(userId: string | null): typeof DEFAULT_ITEMS {
  if (typeof window === "undefined" || !userId) return DEFAULT_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + userId);
    if (!raw) return DEFAULT_ITEMS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === DEFAULT_ITEMS.length) {
      return parsed.map((item: { id: number; text: string; done: boolean }, i: number) => ({
        id: item.id ?? DEFAULT_ITEMS[i].id,
        text: item.text ?? DEFAULT_ITEMS[i].text,
        done: Boolean(item.done),
      }));
    }
  } catch {
    // ignore
  }
  return DEFAULT_ITEMS;
}

function saveItems(userId: string | null, items: typeof DEFAULT_ITEMS) {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + userId, JSON.stringify(items));
  } catch {
    // ignore
  }
}

interface GetStartedCardProps {
  userId: string | null;
}

export function GetStartedCard({ userId }: GetStartedCardProps) {
  const [items, setItems] = useState<typeof DEFAULT_ITEMS>(DEFAULT_ITEMS);
  const [dateInfo, setDateInfo] = useState({ date: "", time: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setItems(loadItems(userId));
  }, [userId, mounted]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const time = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setDateInfo({ date, time });
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleItem = (id: number) => {
    setItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i));
      saveItems(userId, next);
      return next;
    });
  };

  const resetList = () => {
    setItems(DEFAULT_ITEMS);
    saveItems(userId, DEFAULT_ITEMS);
  };

  const allDone = useMemo(() => items.length > 0 && items.every((i) => i.done), [items]);

  const [celebrating, setCelebrating] = useState(false);
  const wasAllDoneRef = useRef(false);

  useEffect(() => {
    if (allDone && !wasAllDoneRef.current) {
      setCelebrating(true);
      wasAllDoneRef.current = true;
      const t = setTimeout(() => setCelebrating(false), 4000);
      return () => clearTimeout(t);
    }
    if (!allDone) {
      wasAllDoneRef.current = false;
      setCelebrating(false);
    }
  }, [allDone]);

  const Header = (
    <div
      className={`flex items-center justify-between px-4 py-3 ${
        allDone
          ? "bg-gradient-to-b from-emerald-400 to-emerald-300"
          : "bg-gradient-to-b from-yellow-300 to-yellow-200"
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-sm font-semibold text-gray-900">{dateInfo.date}</span>
        <span className="rounded-md bg-black/10 px-2 py-1 text-xs font-medium text-gray-800">
          {dateInfo.time}
        </span>
      </div>

      {allDone ? (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">All done!</span>
          <button
            type="button"
            onClick={resetList}
            className="rounded-md bg-white/60 px-2 py-1 text-xs font-semibold text-gray-900 transition hover:bg-white/80"
          >
            Reset
          </button>
        </div>
      ) : (
        <span className="text-sm font-semibold text-gray-900 hover:text-gray-700">Get started</span>
      )}
    </div>
  );

  return (
    <div
      className={`w-full max-w-[380px] overflow-hidden rounded-2xl border bg-white shadow-lg transition-all duration-500 ${
        allDone ? "scale-[1.01] border-emerald-200 ring-2 ring-emerald-200" : "border-slate-100"
      }`}
    >
      {Header}

      <div
        className={`relative p-5 ${
          allDone
            ? "bg-[radial-gradient(circle,rgba(16,185,129,0.08)_1px,transparent_1px)] [background-size:10px_10px]"
            : "bg-[radial-gradient(circle,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:10px_10px]"
        }`}
      >
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          {allDone ? "You crushed it today" : "How to get started"}
        </h3>

        {!allDone && (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className={`flex items-center gap-3 rounded-lg px-2 py-1 transition ${
                  item.done ? "bg-slate-100" : ""
                }`}
              >
                <label className="relative inline-flex h-6 w-6 cursor-pointer items-center justify-center">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleItem(item.id)}
                    className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-200 ease-out ${
                      item.done
                        ? "scale-95 border-gray-900 bg-gray-900"
                        : "scale-100 border-gray-300 bg-white"
                    }`}
                  >
                    <svg
                      className={`h-3 w-3 text-white transition-opacity duration-200 ${
                        item.done ? "opacity-100" : "opacity-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 12 9"
                    >
                      <path d="M1 4.2L4 7L11 1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </label>

                <span
                  className={`text-sm transition-all duration-200 ${
                    item.done ? "translate-x-[2px] font-semibold text-gray-900" : "text-gray-900"
                  }`}
                >
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        )}

        {allDone && (
          <div className="relative">
            <p className="mt-1 text-sm font-medium text-gray-700">Take a breather and celebrate!</p>
            {celebrating && <ConfettiOverlay />}
          </div>
        )}

        {!allDone && (
          <p className="mt-4 text-sm font-medium text-gray-700">Keep up the great work today!</p>
        )}
      </div>
    </div>
  );
}

function ConfettiOverlay() {
  const pieces = Array.from({ length: 36 });
  return (
    <>
      <style>
        {`
        @keyframes confetti-fall {
          0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(80vh) rotate(720deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .confetti-piece { animation: none !important; }
        }
      `}
      </style>
      <div className="pointer-events-none fixed inset-0">
        {pieces.map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 0.5;
          const duration = 2.5 + Math.random() * 1.2;
          const size = 6 + Math.random() * 6;
          const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
          return (
            <span
              key={i}
              className="confetti-piece absolute rounded-sm"
              style={{
                left: `${left}%`,
                top: "-10px",
                width: `${size}px`,
                height: `${size * 0.4}px`,
                backgroundColor: color,
                transform: "translateY(0)",
                animation: `confetti-fall ${duration}s ease-in forwards`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
    </>
  );
}
