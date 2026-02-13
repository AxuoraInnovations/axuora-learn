import Link from "next/link";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

export default function NotFound() {
  return (
    <AnimateOnScroll
      className="max-w-content mx-auto px-5 py-24 min-h-[60vh] flex flex-col items-center justify-center text-center"
      variant="scaleUp"
    >
      <h1 className="text-6xl font-bold text-primary/20">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page not found</h2>
      <p className="text-theme-7 mt-2 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="mt-8 text-primary font-medium hover:underline">
        Go back home
      </Link>
    </AnimateOnScroll>
  );
}
