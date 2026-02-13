import { PageHeroBlue } from "@/components/sections/PageHeroBlue";
import { PricingSection } from "@/components/sections/PricingSection";

export default function PricingPage() {
  return (
    <div>
      <PageHeroBlue
        title="Flexible Pricing Plans"
        description="Choose the plan that fits your needs with flexible options for every stage of growth."
      />
      <PricingSection />
    </div>
  );
}
