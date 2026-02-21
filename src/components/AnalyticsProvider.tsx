"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initAmplitude, trackEvent, EVENTS } from '@/lib/analytics';
import { initSentry } from '@/lib/sentry';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize on mount
    initAmplitude();
    initSentry();
  }, []);

  useEffect(() => {
    // Track page views
    if (pathname?.includes('/dashboard')) {
      trackEvent(EVENTS.DASHBOARD_VIEWED, { path: pathname });
    }
    if (pathname?.includes('/progress')) {
      trackEvent(EVENTS.PROGRESS_VIEWED);
    }
  }, [pathname]);

  return <>{children}</>;
}
