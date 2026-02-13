"use client";

import Link from "next/link";
import { motion } from "motion/react";

const blogPosts = [
  {
    category: "CRM",
    readTime: "6 min",
    title: "How Customer Relationship Will Evolve in the Next.",
    description:
      "Not all CRMs are built the same. Learn what really based on your business size & needs.",
    href: "/blogs/sample-post",
    accentColor: "rgb(255, 91, 91)",
    accentBg: "rgb(255, 242, 242)",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export function BlogSection() {
  return (
    <section className="bg-neutral-light py-16 md:py-24">
      <div className="max-w-content mx-auto px-5 md:px-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-primary font-medium text-sm tracking-wide mb-2">BLOG AND INSIGHTS</p>
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold leading-[1.1] tracking-[-0.04em] mb-4">
            Insights, Guides, and Tips to Help You Grow Smarter
          </h2>
          <p className="text-theme-7 text-base md:text-lg leading-relaxed">
            Discover expert insights, practical guides, and actionable tips to your growth intelligently.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            visible: { transition: { staggerChildren: 0.12 } },
            hidden: {},
          }}
        >
          {blogPosts.map((post, i) => (
            <motion.div key={post.title} variants={cardVariants} custom={i}>
              <Link
                href={post.href}
                className="group block bg-white border border-theme-10 rounded-2xl overflow-hidden hover:border-primary/20 transition-colors"
              >
              <div
                className="h-2 w-full"
                style={{ backgroundColor: post.accentColor }}
              />
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-theme-7 mb-2">
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-semibold text-neutral-dark group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-theme-7 text-sm leading-relaxed">{post.description}</p>
              </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-12">
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
