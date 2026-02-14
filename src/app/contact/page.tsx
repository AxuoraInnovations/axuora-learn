import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageHeroBlue } from "@/components/sections/PageHeroBlue";
import { ContactForm } from "@/components/ContactForm";
import { GmailLogo, InstagramLogo } from "@/components/contact-logos";

const EMAIL = "axuorainnovations@gmail.com";
const INSTAGRAM_LEARN = "https://instagram.com/axuora.learn";
const INSTAGRAM_INNOVATIONS = "https://instagram.com/axuora.innovations";

export default function ContactPage() {
  return (
    <>
      <PageHeroBlue
        title="Contact us"
        description="Have questions? Reach out and we'll get back to you as soon as we can."
      />
      <AnimateOnScroll className="max-w-content mx-auto bg-white px-5 md:px-10 py-16 md:py-24">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
          {/* Left: intro + contact channels with official logos */}
          <div className="flex flex-1 flex-col gap-8 lg:max-w-sm">
            <div className="text-center lg:text-left">
              <h2 className="mb-2 text-3xl font-semibold tracking-tight text-[#333333] md:text-4xl">
                Get in touch
              </h2>
              <p className="text-theme-7 md:text-lg leading-relaxed">
                We&apos;re available for questions, feedback, or collaboration. Message us below or
                reach out directly.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-[#333333]">Reach out</p>
              <ul className="space-y-3">
                <li>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3 transition-colors hover:border-primary/20 hover:bg-primary/5 md:p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm md:h-11 md:w-11">
                      <GmailLogo className="h-6 w-6 md:h-7 md:w-7" />
                    </span>
                    <div className="min-w-0 text-left">
                      <span className="block text-xs font-medium text-theme-7">Email</span>
                      <span className="mt-0.5 block truncate text-sm font-medium text-[#333333]">
                        {EMAIL}
                      </span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={INSTAGRAM_LEARN}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3 transition-colors hover:border-primary/20 hover:bg-primary/5 md:p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm md:h-11 md:w-11">
                      <InstagramLogo className="h-6 w-6 md:h-7 md:w-7" />
                    </span>
                    <div className="min-w-0 text-left">
                      <span className="block text-xs font-medium text-theme-7">Instagram</span>
                      <span className="mt-0.5 block font-medium text-[#333333]">@axuora.learn</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={INSTAGRAM_INNOVATIONS}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3 transition-colors hover:border-primary/20 hover:bg-primary/5 md:p-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm md:h-11 md:w-11">
                      <InstagramLogo className="h-6 w-6 md:h-7 md:w-7" />
                    </span>
                    <div className="min-w-0 text-left">
                      <span className="block text-xs font-medium text-theme-7">Team</span>
                      <span className="mt-0.5 block font-medium text-[#333333]">
                        @axuora.innovations
                      </span>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: form – left-aligned labels and content */}
          <div className="flex-1 lg:max-w-md">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:p-10">
              <h3 className="mb-1 text-xl font-semibold text-[#333333] md:text-2xl">
                Send a message
              </h3>
              <p className="mb-6 text-left text-sm text-theme-7">
                Fill in the form below. It’s sent straight to us—no need to open your email client.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
        <Link
          href="/"
          className="mt-12 inline-block text-primary font-medium hover:underline"
        >
          ← Back to home
        </Link>
      </AnimateOnScroll>
    </>
  );
}
