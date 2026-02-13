import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageHeroBlue } from "@/components/sections/PageHeroBlue";

export default function ContactPage() {
  return (
    <>
      <PageHeroBlue
        title="Contact us"
        description="Have questions? Reach out and we'll get back to you as soon as we can."
      />
      <AnimateOnScroll className="max-w-content mx-auto bg-white px-5 md:px-10 py-16 md:py-24">
        <div className="max-w-md space-y-4">
          <input
            type="email"
            placeholder="Your email"
            className="w-full px-4 py-3 border border-theme-10 rounded-xl"
          />
          <textarea
            placeholder="Your message"
            rows={5}
            className="w-full px-4 py-3 border border-theme-10 rounded-xl resize-none"
          />
          <button
            type="button"
            className="w-full bg-primary text-white py-3 rounded-full font-medium hover:opacity-90"
          >
            Send message
          </button>
        </div>
        <Link href="/" className="inline-block mt-8 text-primary font-medium hover:underline">
          ← Back to home
        </Link>
      </AnimateOnScroll>
    </>
  );
}
