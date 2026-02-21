"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function DashboardProfilePage() {
  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <Link href="/dashboard" className="text-sm font-medium text-primary hover:underline">
          ← Dashboard
        </Link>
        <motion.div
          className="mt-6 rounded-2xl border border-white bg-white p-8 shadow-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Profile & preferences</h1>
          <p className="mt-2 text-[#666]">
            Update your profile, subjects, time commitment, and preferred languages. This section will be expanded soon.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
