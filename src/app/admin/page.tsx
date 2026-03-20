"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceTrendChart, PerformanceAreaChart } from "@/components/charts/Charts";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getDashboardStats, getAttendanceSummary, getAIInsights, getNotifications } from "@/lib/data-service";
import { useAuth } from "@/lib/auth-context";
import { Users, CheckCircle, BookOpen, TrendingUp, Brain, Activity, Calendar, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const { data: stats, loading: statsLoading } = useSupabaseQuery(() => getDashboardStats());
  const { data: attendanceData } = useSupabaseQuery(() => getAttendanceSummary());
  const { data: insights } = useSupabaseQuery(() => getAIInsights());
  const { data: notifications } = useSupabaseQuery(() =>
    profile ? getNotifications(profile.id) : Promise.resolve([])
  , [profile?.id]);

  const monthlyPerf = [
    { month: "Sep", avg: 72 }, { month: "Oct", avg: 75 }, { month: "Nov", avg: 78 },
    { month: "Dec", avg: 74 }, { month: "Jan", avg: 80 }, { month: "Feb", avg: 83 },
    { month: "Mar", avg: stats?.avgPerformance || 82 },
  ];

  const greeting = profile ? `Welcome back, ${profile.full_name}!` : "Welcome back!";

  return (
    <>
      <TopBar title="Dashboard" subtitle={`${greeting} Here's today's overview.`} />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Students"
            value={statsLoading ? "..." : String(stats?.totalStudents || 0)}
            change="+12"
            changeType="positive"
            icon={<Users className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
          />
          <StatsCard
            title="Today's Attendance"
            value={statsLoading ? "..." : `${stats?.todayAttendance || 0}%`}
            change="+2.3%"
            changeType="positive"
            icon={<CheckCircle className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #10b981, #34d399)"
          />
          <StatsCard
            title="Active Classes"
            value={statsLoading ? "..." : String(stats?.totalClasses || 0)}
            change="2 ongoing"
            changeType="neutral"
            icon={<BookOpen className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)"
          />
          <StatsCard
            title="Avg Performance"
            value={statsLoading ? "..." : `${stats?.avgPerformance || 0}%`}
            change="+5.1%"
            changeType="positive"
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceTrendChart data={attendanceData || []} />
          <PerformanceAreaChart data={monthlyPerf} />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Brain className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                AI Insights
              </h3>
              <Sparkles className="w-3 h-3 text-purple-400 ml-auto" />
            </div>
            <div className="space-y-3">
              {(insights || []).slice(0, 3).map((insight, i) => (
                <div
                  key={insight.id || i}
                  className="p-3 rounded-xl border"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {insight.title}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        insight.type === "positive"
                          ? "text-green-500"
                          : insight.type === "warning"
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    >
                      {insight.metric}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                    {insight.insight.slice(0, 80)}...
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              {(notifications || []).slice(0, 4).map((notif, i) => (
                <div key={notif.id || i} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      notif.type === "success"
                        ? "bg-green-500"
                        : notif.type === "warning"
                        ? "bg-amber-500"
                        : notif.type === "alert"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      {notif.title}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      {notif.message}
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
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="w-5 h-5 text-orange-500" />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Upcoming Deadlines
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { title: "BST Implementation Due", date: "Mar 25", tag: "DSA" },
                { title: "SQL Mastery Quiz", date: "Mar 25", tag: "DBMS" },
                { title: "SQL Query Optimization", date: "Mar 28", tag: "DBMS" },
                { title: "React Assessment", date: "Mar 28", tag: "Web" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{ background: "var(--bg-secondary)" }}
                >
                  <div className="text-center min-w-[40px]">
                    <p className="text-[10px] font-bold text-blue-500">
                      {item.date.split(" ")[0]}
                    </p>
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {item.date.split(" ")[1]}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      {item.title}
                    </p>
                  </div>
                  <span className="badge badge-primary text-[10px]">{item.tag}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
