import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { BlogCard } from "@/components/BlogCard";

const posts = [
  {
    slug: "join-the-waitlist",
    category: "Product",
    date: "February 14, 2026",
    readTime: "2 min read",
    title: "Join the Waitlist — We're Launching Soon",
    description:
      "AxuoraLearn is almost here. Join the waitlist to be first in line for AI-powered exam prep built by teens, for teens.",
    image: "/images/blog-intro.png",
  },
];

function getTodayFormatted() {
  const d = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const timelineItems = [
  {
    title: "Join waitlist opens",
    date: getTodayFormatted(),
    description: "Waitlist is now open. Sign up to be first in line for AI-powered exam prep.",
  },
  {
    title: "Launching AxuoraLearn V1.0",
    date: "Apr 1, 2026",
    description: "Official launch of AxuoraLearn V1.0 — smarter tools to accelerate your exam prep.",
  },
];

export default function BlogsPage() {
  return (
    <>
      <AnimateOnScroll className="mx-auto bg-white px-4 sm:px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark tracking-tight mb-4">
              Our Blog
            </h1>
            <p className="text-theme-7 text-base md:text-lg leading-relaxed">
              Learn more about AxuoraLearn, get product updates, and see our approach to exam prep
              that actually works.
            </p>
          </div>

          {posts.map((post) => (
            <AnimateOnScroll key={post.slug} className="mb-16">
              <Link
                href={`/blogs/${post.slug}`}
                className="group block w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <article className="relative w-full aspect-[2.4/1] min-h-[280px] md:min-h-[320px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c2d6a] via-[#0454ff] to-[#86b9ff]">
                  <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 lg:p-10">
                    <div className="flex flex-wrap items-center gap-3 text-white/95">
                      <span className="rounded-md bg-neutral-dark/90 px-3 py-1 text-xs font-medium text-white">
                        {post.category}
                      </span>
                      <span className="text-sm">{post.date}</span>
                      <span className="text-sm">{post.readTime}</span>
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight max-w-2xl mb-6">
                        {post.title}
                      </h2>
                      <span className="inline-flex items-center gap-2 rounded-lg bg-neutral-dark px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-dark/90 transition-colors">
                        Read Full Article
                        <span aria-hidden>&rarr;</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </AnimateOnScroll>
          ))}

          <section className="mt-20 bg-white rounded-2xl overflow-hidden border border-white">
            <div className="px-5 md:px-10 py-10 md:py-14">
              <div className="flex items-center justify-center gap-4 mb-12">
                <span className="h-px flex-1 min-w-8 max-w-48 md:max-w-64 bg-neutral-300" aria-hidden />
                <span className="rounded-full bg-white px-4 py-1.5 text-sm font-medium tracking-wide text-neutral-dark shadow-sm border border-theme-10">
                  Timeline
                </span>
                <span className="h-px flex-1 min-w-8 max-w-48 md:max-w-64 bg-neutral-300" aria-hidden />
              </div>
              <div className="space-y-6 md:space-y-8">
                {timelineItems.map((item) => (
                  <BlogCard
                    key={item.title}
                    title={item.title}
                    date={item.date}
                    description={item.description}
                  />
                ))}
              </div>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-theme-10">
            <Link href="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              <span aria-hidden>←</span>
              Back to home
            </Link>
          </div>
        </div>
      </AnimateOnScroll>
    </>
  );
}
