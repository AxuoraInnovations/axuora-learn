import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export default function IntegrationsPage() {
  return (
    <AnimateOnScroll className="max-w-content mx-auto px-5 md:px-10 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Integrations</h1>
      <p className="text-theme-7 text-lg max-w-2xl mb-8">
        Connect Axuora Learn with the tools you already use. More integrations coming soon.
      </p>
      <Link href="/" className="text-primary font-medium hover:underline">
        ← Back to home
      </Link>
    </AnimateOnScroll>
  );
}
