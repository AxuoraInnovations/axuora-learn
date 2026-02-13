import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  if (!params.slug) notFound();
  return (
    <AnimateOnScroll className="max-w-2xl mx-auto px-5 md:px-10 py-16 md:py-24">
      <article>
        <Link href="/blogs" className="text-primary font-medium hover:underline mb-8 inline-block">
          ← All posts
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          How Customer Relationship Will Evolve in the Next.
        </h1>
        <p className="text-theme-7 mb-8">6 min read</p>
        <div className="prose prose-neutral max-w-none">
          <p>
            Not all CRMs are built the same. Learn what really based on your business size & needs.
          </p>
          <p>
            This is a placeholder post. Replace with your CMS or markdown content.
          </p>
        </div>
      </article>
    </AnimateOnScroll>
  );
}
