"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import NumberFlow from "@number-flow/react";
import { AnimatedGradientText } from "@/components/AnimatedGradientText";
import Link from "next/link";

export default function WaitlistPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [targetCount, setTargetCount] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (showIntro) return;
    let cancelled = false;
    fetch("/api/waitlist-count?t=" + Date.now(), { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const n = typeof data.count === "number" ? data.count : 0;
        if (!cancelled) setTargetCount(n);
      })
      .catch(() => {
        if (!cancelled) setTargetCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [showIntro]);

  // Delay applying count so NumberFlow can animate from 0 to target
  useEffect(() => {
    if (!showIntro && targetCount !== null) {
      const id = setTimeout(() => setWaitlistCount(targetCount), 120);
      return () => clearTimeout(id);
    }
  }, [showIntro, targetCount]);

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
          className="relative min-h-screen w-full overflow-hidden bg-black"
        >
          <div className="absolute inset-0 bg-black" />
          <div
            className="absolute inset-x-0 bottom-0 h-[38%] min-h-[280px]"
            style={{
              background: "radial-gradient(ellipse 120% 100% at 50% 100%, #1e3a8a 0%, #2563eb 25%, #60a5fa 45%, #93c5fd 65%, transparent 85%)",
            }}
          />

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
                  <AnimatedGradientText variant="grey">
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
                  className="mt-8 text-lg text-white"
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
          className="relative min-h-screen w-full overflow-hidden waitlist-form bg-black"
        >
          {/* Black top, glowing blue arc at bottom (match reference image) */}
          <div className="absolute inset-0 bg-black" />
          <div
            className="absolute inset-x-0 bottom-0 h-[38%] min-h-[280px]"
            style={{
              background: "radial-gradient(ellipse 120% 100% at 50% 100%, #1e3a8a 0%, #2563eb 25%, #60a5fa 45%, #93c5fd 65%, transparent 85%)",
            }}
          />

          <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-lg text-center"
            >
              {/* Heading: single line, centered */}
              <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
                Study smarter with AxuoraLearn
              </h1>

              {/* Paragraph */}
              <p className="mt-12 text-center text-lg text-slate-200 md:text-xl leading-relaxed">
                Be the first to know when AxuoraLearn goes live.
              </p>

              {/* Form area — WaitlistHero layout & animations, light mode */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative mt-12 w-full max-w-md mx-auto h-[60px]"
              >
                <canvas
                  ref={canvasRef}
                  className="pointer-events-none absolute left-1/2 top-1/2 z-50 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2"
                />

                {/* Success state: green pill, rings, checkmark, same animation as WaitlistHero */}
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    status === "success"
                      ? "opacity-100 scale-100 animate-waitlist-success-pulse animate-waitlist-success-glow"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                  style={{ backgroundColor: "#10b981" }}
                >
                  {status === "success" && (
                    <>
                      <div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-400 animate-waitlist-ring" style={{ animationDelay: "0s" }} />
                      <div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-300 animate-waitlist-ring" style={{ animationDelay: "0.15s" }} />
                      <div className="absolute top-1/2 left-1/2 w-full h-full rounded-full border-2 border-emerald-200 animate-waitlist-ring" style={{ animationDelay: "0.3s" }} />
                    </>
                  )}
                  <div className={`flex items-center gap-2 text-white font-semibold text-lg ${status === "success" ? "animate-waitlist-bounce-in" : ""}`}>
                    <div className="bg-white/20 p-1 rounded-full">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          className={status === "success" ? "animate-waitlist-checkmark" : ""}
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

                {/* Form state: input full width, button absolute right (WaitlistHero layout), light mode */}
                <form
                  onSubmit={handleSubmit}
                  className={`relative w-full h-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                    status === "success" ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
                  }`}
                >
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={email}
                    disabled={status === "loading"}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-[60px] pl-6 pr-[150px] rounded-full outline-none transition-all duration-200 border-2 border-slate-200 bg-white text-gray-900 placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                  <div className="absolute top-[6px] right-[6px] bottom-[6px]">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="h-full px-6 rounded-full font-medium text-white transition-all active:scale-95 hover:brightness-110 disabled:hover:brightness-100 disabled:active:scale-100 disabled:cursor-wait flex items-center justify-center min-w-[130px] bg-primary hover:bg-primary/90"
                    >
                      {status === "loading" ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        "Join Waitlist"
                      )}
                    </button>
                  </div>
                </form>
                <p className="mt-6 text-center text-slate-200 text-lg font-medium sm:text-xl md:text-2xl select-none">
                  Join{" "}
                  <span className="inline-flex items-baseline font-semibold tabular-nums text-blue-400 [&_number-flow-react]:pointer-events-none">
                    <NumberFlow
                      value={waitlistCount}
                      format={{ useGrouping: true }}
                      trend={1}
                      transformTiming={{ duration: 800, easing: "ease-out" }}
                      spinTiming={{ duration: 800, easing: "ease-out" }}
                      opacityTiming={{ duration: 400, easing: "ease-out" }}
                    />
                  </span>{" "}
                  others on the waitlist.
                </p>
              </motion.div>
            </motion.div>

            <Link href="/" className="mt-20 text-sm font-medium text-white transition-colors hover:text-white/80">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
