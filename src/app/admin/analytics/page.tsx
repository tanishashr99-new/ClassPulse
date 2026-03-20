"use client";

import React from "react";
import { TopBar } from "@/components/dashboard/TopBar";
import {
  AttendanceTrendChart,
  PerformanceAreaChart,
  GradeDistributionChart,
  AttendanceRateChart,
  SubjectRadarChart,
} from "@/components/charts/Charts";
import {
  mockAttendanceData,
  mockMonthlyPerformance,
  mockWeeklyAttendance,
  mockPerformanceData,
} from "@/lib/mock-data";

export default function AnalyticsPage() {
  return (
    <>
      <TopBar title="Analytics" subtitle="Comprehensive performance and attendance analytics" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceTrendChart data={mockAttendanceData} />
          <PerformanceAreaChart data={mockMonthlyPerformance} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GradeDistributionChart />
          <AttendanceRateChart data={mockWeeklyAttendance} />
          <SubjectRadarChart data={mockPerformanceData} />
        </div>
      </div>
    </>
  );
}
