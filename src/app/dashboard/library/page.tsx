"use client";

import Link from "next/link";

export default function DashboardLibraryPage() {
  return (
    <div className="min-h-screen bg-primary-bg p-6">
      <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline">← Dashboard</Link>
      <div className="mt-6 rounded-2xl border border-[#e5e7eb] bg-white p-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Library</h1>
        <p className="mt-2 text-[#666]">Your study library will go here.</p>
      </div>
    </div>
  );
}
