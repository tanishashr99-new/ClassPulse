"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceTrendChart, PerformanceAreaChart, GradeDistributionChart } from "@/components/charts/Charts";
import {
  mockAttendanceData,
  mockMonthlyPerformance,
  mockActivityFeed,
  mockAIInsights,
  mockAssignments,
} from "@/lib/mock-data";
import {
  Users,
  ClipboardCheck,
  BookOpen,
  TrendingUp,
  FileText,
  CheckCircle,
  UserPlus,
  Award,
  MessageSquare,
  Brain,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

const activityIcons: Record<string, React.ReactNode> = {
  file: <FileText className="w-3.5 h-3.5" />,
  check: <CheckCircle className="w-3.5 h-3.5" />,
  plus: <UserPlus className="w-3.5 h-3.5" />,
  award: <Award className="w-3.5 h-3.5" />,
  message: <MessageSquare className="w-3.5 h-3.5" />,
};

export default function AdminDashboard() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Welcome back, Prof. Verma! Here's today's overview." />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Students"
            value="1,247"
            change="+12"
            changeType="positive"
            icon={<Users className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
          />
          <StatsCard
            title="Today's Attendance"
            value="94.2%"
            change="+2.3%"
            changeType="positive"
            icon={<ClipboardCheck className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #10b981, #34d399)"
          />
          <StatsCard
            title="Active Classes"
            value="5"
            change="2 ongoing"
            changeType="neutral"
            icon={<BookOpen className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)"
          />
          <StatsCard
            title="Avg Performance"
            value="82.5%"
            change="+5.1%"
            changeType="positive"
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceTrendChart data={mockAttendanceData} />
          <PerformanceAreaChart data={mockMonthlyPerformance} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 lg:col-span-1"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-accent)" }}>
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  AI Insights
                </h3>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                  Powered by SmartCampus AI
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {mockAIInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-3.5 rounded-xl border transition-colors hover:bg-[var(--bg-secondary)]"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {insight.title}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        insight.type === "positive"
                          ? "bg-green-500/10 text-green-500"
                          : insight.type === "warning"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {insight.metric}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {insight.insight}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h3 className="text-sm font-semibold mb-5" style={{ color: "var(--text-primary)" }}>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {mockActivityFeed.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
                  >
                    {activityIcons[activity.icon]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        {activity.user}
                      </span>{" "}
                      {activity.action}{" "}
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                        {activity.target}
                      </span>
                    </p>
                    <p className="text-[10px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Deadlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-sm font-semibold mb-5" style={{ color: "var(--text-primary)" }}>
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {mockAssignments
                .filter((a) => a.status !== "completed")
                .map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-colors hover:bg-[var(--bg-secondary)]"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div
                      className="w-1.5 h-10 rounded-full flex-shrink-0"
                      style={{
                        background:
                          assignment.status === "overdue"
                            ? "#ef4444"
                            : assignment.status === "pending"
                            ? "#f59e0b"
                            : "#3b82f6",
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {assignment.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                          {assignment.subject}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                          •
                        </span>
                        <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                          <Clock className="w-3 h-3" />
                          {assignment.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                        {assignment.submissions}/{assignment.total}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        submitted
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
