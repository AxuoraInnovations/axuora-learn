"use client";

import { useState } from "react";
import { motion } from "motion/react";

interface JoinTheWaitlistProps {
  title?: string;
  subtitle?: string;
  emailPlaceholder?: string;
  buttonText?: string;
  successMessage?: string;
  onSubmit?: (email: string) => void;
  compact?: boolean;
  className?: string;
}

export function JoinTheWaitlist({
  title = "Join Our Waitlist",
  subtitle = "Be the first to know when AxuoraLearn goes live.",
  emailPlaceholder = "you@example.com",
  buttonText = "Join",
  successMessage = "Thanks! We'll be in touch.",
  onSubmit,
  compact = false,
  className = "",
}: JoinTheWaitlistProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) return;
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
    } catch {
      // still show success locally
    }
    onSubmit?.(value);
    setSubmitted(true);
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Card container – platform style (rounded-2xl, border, shadow like Features/Pricing) */}
      <div className="w-full max-w-[440px] rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-8 sm:px-8 sm:py-10 shadow-[0_0_40px_-10px_rgba(4,84,255,0.25)]">
        {!compact && (
          <div className="mb-6 flex flex-col items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              {title}
            </h2>
            <p className="text-white/80 text-sm sm:text-base max-w-[320px]">
              {subtitle}
            </p>
          </div>
        )}

        {/* Platform tagline – aligns with "Build by Teens, for Teens" / exam prep messaging */}
        <p className="mb-6 text-xs font-medium uppercase tracking-wider text-primary-light/90">
          AI-powered exam prep · Built by teens, for teens
        </p>

        <div className="w-full">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-center text-white font-medium">{successMessage}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 sm:flex-row sm:gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={emailPlaceholder}
                required
                className="flex-1 min-w-0 rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-white placeholder:text-white/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-[0_2px_8px_rgba(4,84,255,0.4)] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent transition-colors"
              >
                {buttonText}
              </button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}
