import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageHeroBlue } from "@/components/sections/PageHeroBlue";

export default function BlogsPage() {
  return (
    <>
      <PageHeroBlue
        title="Blog & Insights"
        description="Discover expert insights, practical guides, and actionable tips."
      />
      <AnimateOnScroll className="max-w-content mx-auto bg-white px-5 md:px-10 py-16 md:py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/blogs/sample-post"
            className="block p-6 border border-theme-10 rounded-2xl hover:border-primary/20 transition-colors"
          >
            <span className="text-sm text-theme-7">CRM · 6 min</span>
            <h2 className="font-semibold text-lg mt-2">How Customer Relationship Will Evolve in the Next.</h2>
            <p className="text-theme-7 text-sm mt-2">
              Not all CRMs are built the same. Learn what really based on your business size & needs.
            </p>
          </Link>
        </div>
        <Link href="/" className="inline-block mt-10 text-primary font-medium hover:underline">
          ← Back to home
        </Link>
      </AnimateOnScroll>
    </>
  );
}
