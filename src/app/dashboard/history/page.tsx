"use client";

import Link from "next/link";

export default function DashboardHistoryPage() {
  return (
    <div className="min-h-screen bg-primary-bg p-6">
      <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline">← Dashboard</Link>
      <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white p-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Chat History</h1>
        <p className="mt-2 text-[#666]">Economics Chp1, Literature Summary, Quadratic Equations – history will go here.</p>
      </div>
    </div>
  );
}
