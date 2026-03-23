"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SubjectRadarChart, PerformanceAreaChart, GradeDistributionChart } from "@/components/charts/Charts";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getTestAvgScores, getLeaderboard } from "@/lib/data-service";
import { useAuth } from "@/lib/auth-context";
import { TrendingUp, Award, Brain, Target, BookOpen } from "lucide-react";

export default function StudentPerformancePage() {
  const { user } = useAuth();
  const studentId = user?.id || "";

  // Dynamic Supabase data
  const { data: testStats } = useSupabaseQuery(() => getTestAvgScores());
  const { data: leaderboard } = useSupabaseQuery(() => getLeaderboard());

  const myRankEntry = (leaderboard || [])
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    .findIndex((e: { student_id: string }) => e.student_id === studentId);
  const myRank = myRankEntry >= 0 ? myRankEntry + 1 : 0;

  // Placeholder static values shaped like actual API calls
  const mockPerformanceData = [
    { subject: "DSA", score: 85, average: 72 },
    { subject: "ML", score: 92, average: 78 },
    { subject: "DBMS", score: 78, average: 70 },
    { subject: "Web Dev", score: 95, average: 80 },
    { subject: "Networks", score: 88, average: 75 },
    { subject: "AI", score: 81, average: 65 },
  ];

  const mockMonthlyPerformance = [
    { month: "Sep", avg: 72 },
    { month: "Oct", avg: 75 },
    { month: "Nov", avg: 78 },
    { month: "Dec", avg: 74 },
    { month: "Jan", avg: 80 },
    { month: "Feb", avg: 83 },
    { month: "Mar", avg: 85 },
  ];

  return (
    <>
      <TopBar title="Performance" subtitle="Your academic performance analytics" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Overall GPA"
            value="3.72"
            change="+0.15"
            changeType="positive"
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #3b82f6, #8b5cf6)"
          />
          <StatsCard
            title="Class Rank"
            value="#3"
            change="of 45"
            changeType="neutral"
            icon={<Award className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
          />
          <StatsCard
            title="Avg Score"
            value="87.6%"
            change="+4.2%"
            changeType="positive"
            icon={<Target className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #10b981, #34d399)"
          />
          <StatsCard
            title="Courses"
            value="5"
            change="All active"
            changeType="neutral"
            icon={<BookOpen className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubjectRadarChart data={mockPerformanceData} />
          <PerformanceAreaChart data={mockMonthlyPerformance} />
        </div>

        <GradeDistributionChart />
      </div>
    </>
  );
}
