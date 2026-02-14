"use client";

import Link from "next/link";
import { motion } from "motion/react";

const blogPosts = [
  {
    category: "Product",
    date: "February 14, 2026",
    readTime: "2 min read",
    title: "Join the Waitlist — We're Launching Soon",
    description:
      "AxuoraLearn is almost here. Join the waitlist to be first in line for AI-powered exam prep built by teens, for teens.",
    href: "/blogs/join-the-waitlist",
    image: "/images/blog-intro.png",
  },
];

export function BlogSection() {
  return (
    <section className="bg-neutral-light py-16 md:py-24">
      <div className="max-w-content mx-auto px-4 sm:px-6 md:px-10 lg:px-20">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark tracking-tight mb-4">
            Our Blog
          </h2>
          <p className="text-theme-7 text-base md:text-lg leading-relaxed">
            Learn more about AxuoraLearn, get product updates, and see our approach to exam prep
            that actually works.
          </p>
        </div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {blogPosts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
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
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight max-w-2xl mb-6">
                      {post.title}
                    </h3>
                    <span className="inline-flex items-center gap-2 rounded-lg bg-neutral-dark px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-dark/90 transition-colors">
                      Read Full Article
                      <span aria-hidden>&rarr;</span>
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link
            href="/blogs"
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            View all posts
            <span className="ml-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
