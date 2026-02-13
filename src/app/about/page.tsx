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
      <AnimateOnScroll className="max-w-content mx-auto bg-white px-5 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-[2.5rem]">
              Why did we build AxuoraLearn?
            </h2>
          </div>
          <div className="space-y-6 lg:col-span-7">
            <p className="text-theme-7 text-lg leading-relaxed">
              AxuoraLearn is designed to help students prepare for exams with clarity and confidence.
              We believe that great results come from practice, feedback, and understanding your
              weaknesses — and AxuoraLearn brings all of that together in one powerful platform.
            </p>
            <p className="text-theme-7 text-lg leading-relaxed">
              Our mission is to make exam prep simple, flexible, and genuinely useful for students
              of all levels. Whether you&apos;re tackling your first major exams or aiming for full
              marks, we&apos;re here to help you speed up your preparation with AI-powered
              questions and step-by-step breakdowns.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8">
          <Link href="/" className="text-primary font-medium hover:underline">
            ← Back to home
          </Link>
        </div>
      </AnimateOnScroll>
    </>
  );
}
