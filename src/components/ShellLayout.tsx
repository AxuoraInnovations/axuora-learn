"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/Footer";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

const BARE_LAYOUT_PATHS = ["/sign-in", "/sign-up", "/onboarding", "/waitlist"];
const DASHBOARD_PREFIX = "/dashboard";

function isDashboardPath(pathname: string | null) {
  return pathname?.startsWith(DASHBOARD_PREFIX) ?? false;
}

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBarePage = BARE_LAYOUT_PATHS.includes(pathname ?? "");
  const isDashboard = isDashboardPath(pathname);

  if (isBarePage || isDashboard) {
    return <AnalyticsProvider>{children}</AnalyticsProvider>;
  }

  return (
    <AnalyticsProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <CTASection />
      <Footer />
    </AnalyticsProvider>
  );
}
