"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatedGradientText } from "@/components/AnimatedGradientText";
import Link from "next/link";

export default function WaitlistPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
    } catch {
      // still show success locally
    }

    setStatus("success");
    setEmail("");
    fireConfetti();
  };

  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
    }> = [];
    const colors = ["#ffffff", "#94a3b8", "#64748b", "#475569"];

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const createParticle = () => {
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 2) * 10,
        life: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
      };
    };

    for (let i = 0; i < 50; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5;
        p.life -= 2;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life / 100);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  };

  return (
    <AnimatePresence mode="wait">
      {showIntro ? (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="relative min-h-screen w-full overflow-hidden bg-white"
        >
          <div className="absolute inset-0 bg-white" />

          <div className="relative z-10 flex min-h-screen items-center justify-center px-4 waitlist-intro">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative cursor-pointer text-center"
              onClick={() => setShowIntro(false)}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = mousePosition.x - rect.left;
                const y = mousePosition.y - rect.top;
                e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
              }}
            >
              <div className="intro-container">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="mb-8"
                >
                  <AnimatedGradientText>
                    Now open for early access
                  </AnimatedGradientText>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="intro-text mb-6 text-7xl font-bold tracking-tight md:text-8xl lg:text-9xl"
                >
                  Join Our
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="intro-text text-7xl font-bold tracking-tight md:text-8xl lg:text-9xl"
                >
                  Waitlist
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="mt-8 text-lg text-slate-500"
                >
                  Click to continue
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative min-h-screen w-full overflow-hidden bg-white waitlist-form"
        >
          <div className="absolute inset-0 bg-white" />

          <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-md text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-8 text-xl text-slate-600 md:text-2xl"
              >
                Be the first to know when AxuoraLearn goes live.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="relative"
              >
                <canvas
                  ref={canvasRef}
                  className="pointer-events-none absolute left-1/2 top-1/2 z-50 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2"
                />

                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                    status === "success"
                      ? "scale-100 opacity-100 animate-slide-up"
                      : "pointer-events-none scale-95 opacity-0"
                  }`}
                >
                  <div className="flex items-center gap-2 text-lg font-semibold text-emerald-600">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span>You&apos;re on the list!</span>
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className={`relative flex gap-2 transition-all duration-500 ${
                    status === "success" ? "pointer-events-none scale-95 opacity-0" : "scale-100 opacity-100"
                  }`}
                >
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    disabled={status === "loading"}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 flex-1 rounded-xl border-2 border-slate-200 bg-white px-6 text-base text-black shadow-sm transition-all placeholder:text-slate-400 hover:border-slate-300 focus-visible:border-black focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="h-14 rounded-xl bg-black px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95"
                  >
                    {status === "loading" ? (
                      <svg
                        className="h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      "Join"
                    )}
                  </Button>
                </form>
              </motion.div>
            </motion.div>

            <Link
              href="/"
              className="mt-10 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
