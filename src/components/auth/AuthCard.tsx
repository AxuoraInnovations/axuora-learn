"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Exact colors from reference
const PAGE_BG = "#0d0d0d";
const ACCENT_BLUE = "rgb(96, 165, 250)";
const SOCIAL_BTN_BG = "rgb(40, 41, 44)";
const OR_GREY = "#666666";
const LEGAL_GREY = "#999999";
const GOOGLE_TEXT = "#1a1a1a";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24">
      <path fill="#f25022" d="M1 1h10v10H1z" />
      <path fill="#00a4ef" d="M1 13h10v10H1z" />
      <path fill="#7fba00" d="M13 1h10v10H13z" />
      <path fill="#ffb900" d="M13 13h10v10H13z" />
    </svg>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-5 w-5 shrink-0", className)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

type AuthCardMode = "signin" | "signup";

interface AuthCardProps {
  mode: AuthCardMode;
}

export function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      if (typeof window !== "undefined") {
        const value = keepSignedIn ? "1" : "0";
        window.sessionStorage.setItem("keep_signed_in", value);
        document.cookie = `keep_signed_in=${value}; path=/; max-age=3600; SameSite=Lax`;
      }
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const next = mode === "signup" ? "/onboarding" : "/dashboard/chat";
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (err) {
        setError(err.message);
        setGoogleLoading(false);
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setGoogleLoading(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "signup") {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("keep_signed_in", keepSignedIn ? "1" : "0");
      }
      const supabase = createClient();
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
        router.push("/dashboard/chat");
        router.refresh();
      } else {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
          },
        });
        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }
        router.push("/onboarding");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const transition = { type: "tween", duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] };

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center text-center overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {showEmailForm ? (
          <motion.div
            key="email-form"
            className="flex w-full flex-col items-center text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={transition}
          >
            <h1 className="mb-2 text-xl font-normal leading-tight text-white sm:text-2xl">
              <span>Your </span>
              <span className="font-bold">Go-To AI Study Agent for Exams Prep</span>
              <span style={{ color: ACCENT_BLUE }}> in Minutes</span>
            </h1>
            <p className="mb-6 text-sm text-white/70">
              {mode === "signin" ? "Sign in with your email" : "Create an account with your email"}
            </p>
            <div className="w-full rounded-2xl px-6 py-6 sm:px-8" style={{ background: SOCIAL_BTN_BG }}>
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                {error && (
                  <div className="rounded-xl border border-red-400/40 bg-red-500/20 px-4 py-2.5 text-sm text-red-200">
                    {error}
                  </div>
                )}
                <Input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="h-12 w-full rounded-full border-0 px-5 text-white placeholder:text-[#999] focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                />
                <Input
                  type="password"
                  required
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  disabled={loading}
                  className="h-12 w-full rounded-full border-0 px-5 text-white placeholder:text-[#999] focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0"
                  style={{ background: "rgba(255,255,255,0.1)" }}
                />
                {mode === "signup" && (
                  <Input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={loading}
                    className="h-12 w-full rounded-full border-0 px-5 text-white placeholder:text-[#999] focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  />
                )}
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="h-4 w-4 rounded border-white/30 bg-white/10 accent-white"
                  />
                  <span className="text-sm text-white/90">Keep me signed in</span>
                </label>
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-full bg-white text-base font-medium text-[#1a1a1a] hover:bg-white/95"
                >
                  {loading ? (mode === "signin" ? "Signing in…" : "Creating account…") : mode === "signin" ? "Sign in" : "Sign up"}
                </Button>
              </form>
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="mt-4 w-full text-sm text-white/70 hover:text-white"
              >
                ← Back to other options
              </button>
              <p className="mt-4 text-center text-sm text-white/70">
                {mode === "signin" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <Link href="/sign-up" className="font-medium text-white hover:underline">Sign up</Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link href="/sign-in" className="font-medium text-white hover:underline">Sign in</Link>
                  </>
                )}
              </p>
            </div>
            <p className="mt-6 text-center text-sm" style={{ color: LEGAL_GREY }}>
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-white/80">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-white/80">Privacy Policy</Link>.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="social-options"
            className="flex w-full flex-col items-center text-center"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={transition}
          >
            <h1 className="mb-8 text-xl font-normal leading-tight text-white sm:text-2xl">
              <span>Your </span>
              <span className="font-bold">Go-To AI Study Agent for Exams Prep</span>
              <span style={{ color: ACCENT_BLUE }}> in Minutes</span>
            </h1>

            <label className="mb-4 flex cursor-pointer items-center gap-3 self-start">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="h-4 w-4 rounded border-white/30 bg-white/10 accent-white"
              />
              <span className="text-sm text-white/90">Keep me signed in</span>
            </label>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="flex h-12 w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-3 transition-opacity hover:opacity-95 disabled:opacity-70"
              style={{ color: GOOGLE_TEXT }}
            >
              <GoogleIcon />
              <span className="text-base font-medium">
                {googleLoading ? "Redirecting…" : "Continue with Google"}
              </span>
            </button>

            <div className="mt-4 flex w-full gap-3">
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-full py-3 transition-colors hover:bg-white/5"
                style={{ background: SOCIAL_BTN_BG, border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <AppleIcon className="text-white" />
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center rounded-full py-3 transition-colors hover:bg-white/5"
                style={{ background: SOCIAL_BTN_BG, border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <MicrosoftIcon />
              </button>
            </div>

            <div className="mt-6 flex w-full items-center gap-4">
              <div className="h-px flex-1 border-b border-dashed" style={{ borderColor: OR_GREY }} />
              <span className="text-sm font-medium" style={{ color: OR_GREY }}>
                OR
              </span>
              <div className="h-px flex-1 border-b border-dashed" style={{ borderColor: OR_GREY }} />
            </div>

            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="mt-6 flex h-12 w-full items-center justify-center gap-3 rounded-full py-3 transition-colors hover:bg-white/5"
              style={{ background: SOCIAL_BTN_BG, border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <EnvelopeIcon className="text-white" />
              <span className="text-base font-medium text-white">Continue with Email</span>
            </button>

            <p className="mt-8 text-center text-sm" style={{ color: LEGAL_GREY }}>
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline hover:text-white/80">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-white/80">Privacy Policy</Link>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
