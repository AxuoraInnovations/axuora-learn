"use client";

import { useState } from "react";
import Link from "next/link";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top section: same blue hero background as Features / PageHeroBlue */}
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-20 md:py-28"
        style={{ backgroundImage: "url(/hero-bg-blue.png)" }}
      >
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Join Our Waitlist
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/95 md:text-xl">
            Be the first to know when AxuoraLearn goes live.
          </p>
        </div>
      </section>

      {/* Main content: space background + form */}
      <section
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden bg-neutral-dark py-16 md:py-24"
        style={{
          backgroundImage: "url(/waitlist-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-[395px]">
            {submitted ? (
              <p className="text-center text-white/90 font-medium text-lg">
                Thanks! We&apos;ll be in touch.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-row gap-2.5 w-full"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="flex-1 min-w-0 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-colors"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>

          <Link
            href="/"
            className="mt-10 text-white/70 text-sm font-medium hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
