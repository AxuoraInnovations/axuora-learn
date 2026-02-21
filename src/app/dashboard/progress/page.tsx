"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, TrendingUp, Target, Clock, BookOpen, Award } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getUserProgress } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudyTime: 0,
    cardsReviewed: 0,
    lessonsCompleted: 0,
    analysesCount: 0,
    streak: 0,
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      setUserId(user.id);

      // Get last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const progress = await getUserProgress(user.id, startDate, endDate);
      setProgressData(progress || []);

      // Calculate totals
      const totals = (progress || []).reduce((acc, day) => ({
        totalStudyTime: acc.totalStudyTime + (day.study_time || 0),
        cardsReviewed: acc.cardsReviewed + (day.cards_reviewed || 0),
        lessonsCompleted: acc.lessonsCompleted + (day.lessons_completed || 0),
        analysesCount: acc.analysesCount + (day.analyses_count || 0),
        streak: acc.streak,
      }), {
        totalStudyTime: 0,
        cardsReviewed: 0,
        lessonsCompleted: 0,
        analysesCount: 0,
        streak: 0,
      });

      // Get user profile for streak
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("streak_count")
        .eq("id", user.id)
        .single();

      setStats({ ...totals, streak: profile?.streak_count || 0 });
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-primary-bg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-primary-bg p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Progress</h1>
          <p className="mt-2 text-[#666]">Track your study activity and achievements</p>
        </div>

        {/* Stats cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a1a1a]">{formatMinutes(stats.totalStudyTime)}</p>
                <p className="text-sm text-[#666]">Study time</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-3">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a1a1a]">{stats.cardsReviewed}</p>
                <p className="text-sm text-[#666]">Cards reviewed</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a1a1a]">{stats.analysesCount}</p>
                <p className="text-sm text-[#666]">Answers analyzed</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-3">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a1a1a]">{stats.streak}</p>
                <p className="text-sm text-[#666]">Day streak</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <motion.div
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Study time (last 30 days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#999"
                  fontSize={12}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                  formatter={(value: number | undefined) => value ? [`${value} minutes`, 'Study time'] : ['', '']}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                />
                <Line 
                  type="monotone" 
                  dataKey="study_time" 
                  stroke="rgb(4, 84, 255)" 
                  strokeWidth={2}
                  dot={{ fill: 'rgb(4, 84, 255)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-[#1a1a1a]">Activity breakdown (last 30 days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#999"
                  fontSize={12}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                />
                <Bar dataKey="cards_reviewed" fill="#10b981" name="Cards" />
                <Bar dataKey="analyses_count" fill="#3b82f6" name="Analyses" />
                <Bar dataKey="lessons_completed" fill="#f59e0b" name="Lessons" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
