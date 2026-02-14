import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const POSTS: Record<
  string,
  { title: string; readTime: string; category: string; date: string; author: string; intro: string; content: React.ReactNode }
> = {
  "join-the-waitlist": {
    title: "Join the Waitlist — We're Launching Soon",
    readTime: "2 min read",
    category: "Updates",
    date: "February 14, 2026",
    author: "AxuoraLearn Team",
    intro:
      "AxuoraLearn is almost here. Here's why we want you on the list — and what's waiting for you when we go live.",
    content: (
      <>
        <section className="mb-12">
          <h2 className="text-xs font-semibold tracking-widest text-primary uppercase mb-4">
            Why we want you on the list
          </h2>
          <p className="text-[#333333] text-lg leading-[1.75] mb-6">
            We're building an AI-powered exam prep platform for students who are done guessing.
            When you join the waitlist, you're not just signing up for updates — you're securing a
            spot among the first to step inside. No more last-minute scrambles, no more wondering
            whether you've covered the right material. We're giving you a place where preparation
            meets clarity.
          </p>
          <p className="text-[#333333] text-lg leading-[1.75]">
            We get it because we're in the same boat. <strong className="text-[#333333]">Built by
            teens, for teens</strong> isn't a tagline — it's the reason we're building something we
            actually wished we had when exam season hit.
          </p>
        </section>

        <blockquote className="border-l-4 border-primary pl-6 py-3 my-10">
          <p className="font-serif text-lg md:text-xl text-[#333333] italic leading-snug">
            Your seat is confirmed the moment you sign up. We'll drop you a quick note so you know
            you're on the list — and we'll be the first to tell you when the gates open.
          </p>
        </blockquote>

        <section className="mb-12">
          <h2 className="text-xs font-semibold tracking-widest text-primary uppercase mb-4">
            What's waiting for you
          </h2>
          <ul className="space-y-4">
            {[
              { title: "AI predictive exam questions", desc: "Practice with questions shaped around your subject and syllabus — so you're ready for what actually shows up." },
              { title: "Full Marks Analyzer", desc: "Step-by-step breakdowns that show you exactly how to score full marks, not just the final answer." },
              { title: "Flashcards & notes summary", desc: "Everything in one place. Study smarter, not harder." },
              { title: "AI Live Lessons", desc: "Learn at your pace, with support when you need it — voice, pace, and clarity on your terms." },
            ].map((item) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <div>
                  <strong className="text-[#333333]">{item.title}</strong>
                  <span className="text-theme-7"> — {item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-theme-10 bg-theme-9/40 p-6 md:p-8 mb-12">
          <h2 className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
            How to join
          </h2>
          <p className="text-[#333333] text-lg leading-[1.75] mb-6">
            Head to our waitlist page, enter your email, and you're in. We'll notify you the moment
            AxuoraLearn is live — and we'll send a short thank-you so you know your spot is reserved.
          </p>
          <p className="text-theme-7 text-base">
            See you on the inside.
          </p>
        </section>

        <p className="text-[#333333] font-medium mb-10">
          — The AxuoraLearn team
        </p>

        <div className="pt-8 border-t border-theme-10">
          <Link
            href="/waitlist"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary/90 transition-colors"
          >
            Join the waitlist
            <span className="ml-2" aria-hidden>→</span>
          </Link>
        </div>
      </>
    ),
  },
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const slug = params?.slug;
  if (!slug || !POSTS[slug]) notFound();

  const post = POSTS[slug];
  return (
    <AnimateOnScroll className="mx-auto max-w-3xl px-4 sm:px-6 md:px-10 py-16 md:py-24">
      <article className="bg-[#fafafa]/80 rounded-2xl md:bg-transparent">
        {/* Title: large, bold, dark grey/black */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-4" style={{ color: "#333333" }}>
          {post.title}
        </h1>

        {/* Metadata: date, read time, author with icon */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-theme-7 mb-6">
          <span>{post.date}</span>
          <span aria-hidden>·</span>
          <span>{post.readTime}</span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1.5">
            <span className="h-6 w-6 rounded-full bg-theme-9 border border-theme-10 flex items-center justify-center text-xs font-medium text-theme-7">
              {post.author.charAt(0)}
            </span>
            {post.author}
          </span>
        </div>

        {/* Introductory paragraph */}
        <p className="text-[#333333] text-lg md:text-xl leading-[1.6] mb-10">
          {post.intro}
        </p>

        {/* Large illustration below intro (like second image) */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#0f172a] mb-12 ring-1 ring-black/5 flex items-center justify-center">
          <Image
            src="/images/blog-intro.png"
            alt=""
            fill
            className="object-cover object-center"
            style={{ objectPosition: "center center" }}
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </div>

        <div className="prose prose-neutral max-w-none text-lg text-[#333333]">
          {post.content}
        </div>

        <div className="mt-12 pt-8 border-t border-theme-10 flex flex-col items-start gap-4">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <span aria-hidden>←</span>
            All posts
          </Link>
          <span className="inline-block rounded-md bg-[#333333] px-3 py-1.5 text-xs font-medium text-white">
            {post.category}
          </span>
        </div>
      </article>
    </AnimateOnScroll>
  );
}
