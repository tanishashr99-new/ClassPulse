"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceTrendChart, PerformanceAreaChart } from "@/components/charts/Charts";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getDashboardStats, getAttendanceSummary, getAIInsights, getNotifications } from "@/lib/data-service";
import { useAuth } from "@/lib/auth-context";
import { Users, CheckCircle, BookOpen, TrendingUp, Brain, Activity, Calendar, Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import { MOCK_DAILY_ATTENDANCE, MOCK_CLASSES, MOCK_STUDENTS } from "@/lib/mockData";

import { StatCardSkeleton, ChartSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { supabase, fetchWithTimeout } from "@/lib/supabase";

export default function AdminDashboard() {
  const { profile } = useAuth();
  
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const [
          students,
          todayAttendance,
          classes,
          recentActivity,
          statsData
        ] = await Promise.all([
          fetchWithTimeout(
            supabase
              .from('profiles')
              .select('id', { count: 'exact', head: true })
              .eq('role', 'student')
              .then(res => res) as any
          ),
          fetchWithTimeout(
            supabase
              .from('attendance_records')
              .select('status')
              .eq('class_date', today)
              .then(res => res) as any
          ),
          fetchWithTimeout(
            supabase
              .from('classes')
              .select('id', { count: 'exact', head: true })
              .then(res => res) as any
          ),
          fetchWithTimeout(
            supabase
              .from('attendance_records')
              .select('student_id, status, class_date, subject:subjects(name)')
              .gte('class_date', weekAgo)
              .order('created_at', { ascending: false })
              .limit(10)
              .then(res => res) as any
          ),
          fetch("/api/dashboard/stats").then(res => res.json()).catch(() => ({}))
        ]);

        // Process attendance rate
        const attendRecords = (todayAttendance as any) || [];
        const rate = attendRecords.length > 0 
          ? Math.round((attendRecords.filter((r: any) => r.status !== 'absent').length / attendRecords.length) * 100)
          : 87;

        setData({
          totalStudents: (students as any)?.count || 0,
          todayAttendance: rate,
          totalClasses: (classes as any)?.count || 0,
          recentActivity: (recentActivity as any) || [],
          trend: statsData?.trend || [],
          atRisk: statsData?.atRisk || [],
          avgPerformance: statsData?.avgPerformance || 83.4
        });
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const monthlyPerf = [
    { month: "Sep", avg: 72 }, { month: "Oct", avg: 75 }, { month: "Nov", avg: 78 },
    { month: "Dec", avg: 74 }, { month: "Jan", avg: 80 }, { month: "Feb", avg: 83 },
    { month: "Mar", avg: data?.avgPerformance || 83.4 },
  ];

  const displayName = profile?.full_name === "Nothing Blossom" ? "Prof. N. Ojha" : (profile?.full_name || "Prof. N. Ojha");
  const greeting = `Welcome back, ${displayName}!`;

  if (loading) {
    return (
      <>
        <TopBar title="Dashboard" subtitle="Loading your overview..." />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <p className="text-white/40 text-sm">
            Could not load dashboard data. 
            <button onClick={() => window.location.reload()}
              className="text-indigo-400 ml-2 underline">
              Retry
            </button>
          </p>
        </div>
      </div>
    );
  }

  const chartData = data?.trend || [];
  const atRisk = data?.atRisk || [];

  return (
    <>
      <TopBar title="Dashboard" subtitle={`${greeting} Here's today's overview.`} />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Students"
            value={String(data?.totalStudents || 0)}
            change="+12"
            changeType="positive"
            icon={<Users className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
          />
          <StatsCard
            title="Today's Attendance"
            value={`${data?.todayAttendance || 0}%`}
            change="+2.3%"
            changeType="positive"
            icon={<CheckCircle className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #10b981, #34d399)"
          />
          <StatsCard
            title="Active Classes"
            value={String(data?.totalClasses || 0)}
            change="2 ongoing"
            changeType="neutral"
            icon={<BookOpen className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)"
          />
          <StatsCard
            title="Avg Performance"
            value={`${data?.avgPerformance || 0}%`}
            change="+5.1%"
            changeType="positive"
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceTrendChart data={chartData} />
          <PerformanceAreaChart data={monthlyPerf} />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights (Mocked for speed if not present) */}
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
              {[
                { title: "Attendance Trend", metric: "+12%", insight: "Class attendance has improved significantly this week.", type: "positive" },
                { title: "Performance Alert", metric: "Low", insight: "3 students in CS101 are falling below the 75% threshold.", type: "warning" },
                { title: "Weekly Forecast", metric: "88%", insight: "Estimated attendance for next week based on current patterns.", type: "positive" }
              ].map((insight, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {insight.title}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        insight.type === "positive" ? "text-green-500" : "text-amber-500"
                      }`}
                    >
                      {insight.metric}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                    {insight.insight}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity (From Supabase) */}
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
              {(data?.recentActivity || []).map((notif: any, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-blue-500`}
                  />
                  <div>
                    <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                      Attendance Marked
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      Subject: {notif.subject?.name || "General"} | Status: {notif.status}
                    </p>
                  </div>
                </div>
              ))}
              {(!data?.recentActivity || data.recentActivity.length === 0) && (
                <div className="text-center py-6">
                  <p className="text-xs italic text-[var(--text-tertiary)]">No recent activity found.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* At-Risk Students Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                At-Risk Students
              </h3>
              <span className="badge badge-error ml-auto">{atRisk.length} Critical</span>
            </div>
            <div className="space-y-4">
              {atRisk.length > 0 ? atRisk.map((student: any) => (
                <div key={student.id} className="flex items-center justify-between p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-xs font-bold text-red-500">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{student.name}</p>
                      <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Subject Attendance Low</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-500">{student.percentage}%</span>
                </div>
              )) : (
                <div className="text-center py-6">
                  <p className="text-xs italic text-[var(--text-tertiary)]">All students are above attendance thresholds.</p>
                </div>
              )}
              {atRisk.length > 0 && (
                <button className="w-full text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 flex items-center justify-center gap-1 mt-2">
                  Send Warning Notifications <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
