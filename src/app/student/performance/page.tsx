"use client";

import React from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SubjectRadarChart, PerformanceAreaChart, GradeDistributionChart } from "@/components/charts/Charts";
import { mockPerformanceData, mockMonthlyPerformance } from "@/lib/mock-data";
import { TrendingUp, Award, Target, BookOpen } from "lucide-react";

export default function StudentPerformancePage() {
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
