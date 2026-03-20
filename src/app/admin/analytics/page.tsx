"use client";

import React from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getAttendanceSummary, getTestAvgScores, getDashboardStats } from "@/lib/data-service";
import {
  AttendanceTrendChart,
  PerformanceAreaChart,
  GradeDistributionChart,
  AttendanceRateChart,
  SubjectRadarChart,
} from "@/components/charts/Charts";

export default function AnalyticsPage() {
  const { data: attendanceData } = useSupabaseQuery(() => getAttendanceSummary());
  const { data: stats } = useSupabaseQuery(() => getDashboardStats());

  const dynamicMonthlyPerformance = [
    { month: "Sep", avg: 72 }, { month: "Oct", avg: 75 },
    { month: "Nov", avg: 78 }, { month: "Dec", avg: 74 },
    { month: "Jan", avg: 80 }, { month: "Feb", avg: 83 },
    { month: "Mar", avg: stats?.avgPerformance || 82 }
  ];

  const dynamicPerformanceData = [
    { subject: "DSA", score: 85, average: 72 },
    { subject: "ML", score: 92, average: 78 },
    { subject: "DBMS", score: 78, average: 70 },
    { subject: "Web Dev", score: 95, average: 80 },
    { subject: "Networks", score: 88, average: 75 },
  ];

  const dynamicWeeklyAttendance = [
    { week: "Week 1", rate: 92 }, { week: "Week 2", rate: 89 },
    { week: "Week 3", rate: 94 }, { week: "Week 4", rate: 91 },
    { week: "Week 5", rate: 87 }, { week: "Week 6", rate: 93 },
    { week: "Week 7", rate: 95 }, { week: "Week 8", rate: 90 },
  ];

  return (
    <>
      <TopBar title="Analytics" subtitle="Comprehensive performance and attendance analytics" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceTrendChart data={attendanceData || []} />
          <PerformanceAreaChart data={dynamicMonthlyPerformance} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GradeDistributionChart />
          <AttendanceRateChart data={dynamicWeeklyAttendance} />
          <SubjectRadarChart data={dynamicPerformanceData} />
        </div>
      </div>
    </>
  );
}
