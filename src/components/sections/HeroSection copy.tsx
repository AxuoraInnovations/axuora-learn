import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section
      className="relative w-full bg-cover bg-center bg-no-repeat py-20 md:py-24"
      style={{
        backgroundImage: "url(https://framerusercontent.com/images/LTzUgqhBMU0fYD8l2vHeGvu8dQI.jpg)",
      }}
    >
      <div className="max-w-content mx-auto px-5 md:px-10 flex flex-col items-center gap-12 text-center">
        <div className="flex flex-col items-center gap-6 max-w-[700px]">
          <span className="inline-block bg-primary text-white text-sm font-normal rounded-full px-4 py-2">
            Built by Teens for teens
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[48px] font-bold leading-[1.1] tracking-[-0.04em] text-center">
            Speed Up Your Exams Preparation
            <br />
            with AxuoraLearn
          </h1>
          <p className="text-theme-4 text-base md:text-lg leading-[1.4] max-w-[700px]">
            Take your exams with full confidence. No more skill issues and crashouts. Generate AI
            predictive exam questions alongside with advanced full marks analyzer that breaks down
            steps for you.
          </p>
        </div>
        <Link
          href="/waitlist"
          className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Get started
        </Link>
        <div className="w-full max-w-[1440px] flex justify-center mt-4">
          <div className="relative w-full aspect-[2.057] max-h-[700px] rounded-lg overflow-hidden bg-theme-9">
            <Image
              src="https://framerusercontent.com/images/iNqHkj9JE19lMFT6vXbow1lDNM.png"
              alt="Axuora Learn dashboard"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  );
}
