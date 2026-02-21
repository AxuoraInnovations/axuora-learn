"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DashboardSidebar, DashboardSidebarTrigger } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const openSidebar = useCallback(() => setMobileMenuOpen(true), []);
  const closeSidebar = useCallback(() => setMobileMenuOpen(false), []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.replace("/sign-in");
        return;
      }
      setReady(true);
    });
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F7F7]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen h-screen bg-[#F7F7F7] overflow-hidden">
      <DashboardSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={closeSidebar}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div className="flex min-h-0 flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-gray-200 bg-[#F7F7F7] px-4 py-3">
          <div className="lg:hidden">
            <DashboardSidebarTrigger onClick={openSidebar} />
          </div>
          <div className="flex-1 min-w-0 lg:min-w-0" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 shrink-0" aria-hidden />
            <Link
              href="/dashboard/upgrade"
              className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
              Get Pro
            </Link>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
