import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { GeometricPattern } from "@/components/GeometricPattern";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { IntegrationsSection } from "@/components/sections/IntegrationsSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { FAQSection } from "@/components/sections/FAQSection";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Vertical gradient: deep blue → sky blue → light blue/white (matches reference image) */}
      <div
        className="absolute inset-0 z-0 min-h-full w-full"
        style={{
          background:
            "linear-gradient(180deg, #0F62FE 0%, #1E78FF 25%, #76B3F9 55%, #A9D4FF 80%, #EBF5FF 100%)",
        }}
        aria-hidden
      />
      {/* Subtle geometric dashed line pattern overlay */}
      <div className="absolute inset-0 z-0 min-h-full w-full overflow-hidden">
        <GeometricPattern />
      </div>
      <div className="relative z-10 flex flex-col">
        <AnimateOnScroll amount={0.15} delay={0}>
          <HeroSection />
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.05}>
          <FeaturesSection />
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.05}>
          <PricingSection />
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.05}>
          <IntegrationsSection />
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.05}>
          <BlogSection />
        </AnimateOnScroll>
        <AnimateOnScroll delay={0.05}>
          <FAQSection />
        </AnimateOnScroll>
      </div>
    </div>
  );
}
