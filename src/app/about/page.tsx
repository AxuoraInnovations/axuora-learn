import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageHeroBlue } from "@/components/sections/PageHeroBlue";

export default function AboutPage() {
  return (
    <>
      <PageHeroBlue
        title="About AxuoraLearn"
        description="Get to know the background behind building AxuoraLearn."
      />
      <AnimateOnScroll className="mx-auto bg-white px-5 md:px-10 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          {/* — Opening: one line that sets the stakes — */}
          <section className="mb-20 md:mb-28">
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-neutral-dark leading-[1.25] tracking-tight max-w-2xl">
              The system was never built for you to win. So we built something that was.
            </p>
          </section>

          {/* — What we built: product as story — */}
          <section className="mb-24 md:mb-32">
            <span className="inline-block text-xs font-medium tracking-widest text-primary uppercase mb-6">
              What we built
            </span>
            <div className="space-y-8 text-theme-7 text-lg md:text-xl leading-[1.7]">
              <p>
                <strong className="text-neutral-dark font-semibold">AxuoraLearn</strong> is an AI-powered
                learning platform that turns your own material into a clear path to full marks. You
                upload <strong className="text-neutral-dark">past papers, questions, and mark
                schemes</strong>; our AI pores over them, finds the patterns examiners actually
                reward, and gives you two things most students never get: <strong className="text-neutral-dark">a
                step-by-step map to full marks</strong>, and <strong className="text-neutral-dark">predictive
                questions</strong> that could show up on your real exam — often drawn from at least
                the last two years of papers so the odds are on your side.
              </p>
              <p className="text-neutral-dark font-medium pt-2">
                In practice, that means two pillars:
              </p>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-primary/15 bg-primary/[0.03] p-6 md:p-8">
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                  Pillar one
                </span>
                <h3 className="mt-2 text-xl font-semibold text-neutral-dark md:text-2xl">
                  Full Marks Analyzer
                </h3>
                <p className="mt-3 text-theme-7 text-base leading-relaxed">
                  Every question broken down: what to write, how to structure it, and exactly where
                  the marks are. No more guessing what &quot;full marks&quot; looks like — you see it, then you
                  learn to replicate it.
                </p>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-primary/[0.03] p-6 md:p-8">
                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                  Pillar two
                </span>
                <h3 className="mt-2 text-xl font-semibold text-neutral-dark md:text-2xl">
                  Predictive mock exams
                </h3>
                <p className="mt-3 text-theme-7 text-base leading-relaxed">
                  Questions tagged by type — <span className="text-neutral-dark font-medium">key
                  question</span>, <span className="text-neutral-dark font-medium">hot topic</span>,{" "}
                  <span className="text-neutral-dark font-medium">critical thinking</span> — with a
                  <strong className="text-neutral-dark"> probability score</strong> for how likely
                  each is to appear. You prepare for what’s actually coming.
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-6 text-theme-7 text-lg leading-[1.7]">
              <p>
                Beyond that we’ve built the essentials: <strong className="text-neutral-dark">flashcards</strong>, an{" "}
                <strong className="text-neutral-dark">AI chatbot</strong>, and an agent that can
                generate <strong className="text-neutral-dark">live audio lessons</strong> you can
                talk to — with control over tone, speed, and transcripts, plus one-tap notes and
                smart flashcards. Everything is wired together inside one agent so you’re not
                juggling five apps the night before an exam.
              </p>
            </div>
          </section>

          {/* — Pull quote: the problem — */}
          <section className="mb-24 md:mb-32">
            <blockquote className="border-l-4 border-primary pl-6 md:pl-8 py-2 md:py-3">
              <p className="font-serif text-xl md:text-2xl text-neutral-dark leading-snug italic">
                Standardised tests were never meant to decide your future. Yet for millions of
                students, a handful of papers do exactly that — and the system does little to help
                you crack the code.
              </p>
            </blockquote>
          </section>

          {/* — Why we built it: story — */}
          <section className="mb-24 md:mb-32">
            <span className="inline-block text-xs font-medium tracking-widest text-primary uppercase mb-6">
              Why we built it
            </span>
            <div className="space-y-8 text-theme-7 text-lg md:text-xl leading-[1.7]">
              <p>
                Research keeps underlining the same thing: <strong className="text-neutral-dark">test anxiety</strong> is
                among the biggest barriers to performing when it matters, and too often a
                student’s path is decided by a few high-stakes exams. We wanted a tool that
                flips that script — <strong className="text-neutral-dark">study and revise whenever and wherever</strong> you
                need, at a price that doesn’t add stress, with <strong className="text-neutral-dark">no more guesswork</strong> about
                what will show up or how to answer it. That’s the promise: clarity and efficiency,
                so you can walk in prepared.
              </p>
              <p>
                School is already demanding; exam season shouldn’t feel like a trap. We built the
                tool we wished we’d had: something that <strong className="text-neutral-dark">lifts the weight</strong>, cuts
                the anxiety, and gives you a way to push back against the old model — endless
                tuition, one-size-fits-all prep, and a system that leaves too many students
                feeling that a few papers hold their future hostage. No one should have to choose
                between their wellbeing and their grades. So we built a <strong className="text-primary font-semibold">cheat code</strong>:
                prepare properly, score better, and still have room to breathe — and to become
                more than what a single exam day says you are.
              </p>
            </div>
          </section>

          {/* — The people: founder story — */}
          <section className="mb-20">
            <span className="inline-block text-xs font-medium tracking-widest text-primary uppercase mb-6">
              Who’s behind it
            </span>
            <div className="rounded-2xl border border-theme-10 bg-theme-9/30 p-6 md:p-10">
              <div className="space-y-8 text-theme-7 text-lg leading-[1.7]">
                <p>
                  We’re a team of <strong className="text-neutral-dark">teens</strong> who decided
                  not to let the education system have the last word on our future. For many of us —
                  especially in Asian households — exams are the default route; we get that. So we
                  built a tool that lets us <strong className="text-neutral-dark">explore the world</strong> and put our
                  skills to work on something we care about, without feeling locked in by the same
                  system we’re trying to outsmart.
                </p>
                <p>
                  AxuoraLearn is also our way of showing the next cohort that it’s possible: to be{" "}
                  <strong className="text-neutral-dark">courageous</strong> about what you want, to{" "}
                  <strong className="text-neutral-dark">refuse to be boxed in</strong> by other
                  people’s expectations, and to stop letting anyone tell you your dreams don’t
                  count. We hope this lands with the right people. See you on launch day.
                </p>
              </div>
            </div>
          </section>

          <div className="pt-12 border-t border-theme-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <span aria-hidden>←</span>
              Back to home
            </Link>
          </div>
        </div>
      </AnimateOnScroll>
    </>
  );
}
