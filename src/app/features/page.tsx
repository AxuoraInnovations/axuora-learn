import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { PageHeroBlue } from "@/components/sections/PageHeroBlue";
import { FeaturesSection } from "@/components/sections/FeaturesSection";

export default function FeaturesPage() {
  return (
    <div>
      <PageHeroBlue
        title="Features"
        description="Smarter tools to accelerate your preparation."
      />
      <FeaturesSection />
    </div>
  );
}
