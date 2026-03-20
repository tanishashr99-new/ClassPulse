"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceRing } from "@/components/dashboard/AttendanceRing";
import { SubjectRadarChart } from "@/components/charts/Charts";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getEnrollmentsByStudent, getStudentAttendance, getAssignments, getBadges, getStudentBadges, getLeaderboard } from "@/lib/data-service";
import { CalendarDays, FileText, Trophy, Flame, Clock, ChevronRight, CheckCircle2, AlertCircle, Timer } from "lucide-react";

const STUDENT_ID = "00000000-0000-0000-0000-000000000010"; // Aarav Sharma

export default function StudentDashboard() {
  const { data: enrollments } = useSupabaseQuery(() => getEnrollmentsByStudent(STUDENT_ID));
  const { data: attendance } = useSupabaseQuery(() => getStudentAttendance(STUDENT_ID));
  const { data: assignments } = useSupabaseQuery(() => getAssignments());
  const { data: allBadges } = useSupabaseQuery(() => getBadges());
  const { data: earnedBadges } = useSupabaseQuery(() => getStudentBadges(STUDENT_ID));
  const { data: leaderboard } = useSupabaseQuery(() => getLeaderboard());

  const presentCount = (attendance || []).filter((a: { status: string }) => a.status === "present").length;
  const lateCount = (attendance || []).filter((a: { status: string }) => a.status === "late").length;
  const absentCount = (attendance || []).filter((a: { status: string }) => a.status === "absent").length;
  const totalAtt = presentCount + lateCount + absentCount;
  const attendancePercent = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 0;

  const myRankEntry = (leaderboard || [])
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    .findIndex((e: { student_id: string }) => e.student_id === STUDENT_ID);
  const myRank = myRankEntry >= 0 ? myRankEntry + 1 : 0;
  const myLeaderboard = (leaderboard || []).find((e: { student_id: string }) => e.student_id === STUDENT_ID);

  const performanceData = [
    { subject: "DSA", score: 88 },
    { subject: "ML", score: 82 },
    { subject: "DBMS", score: 90 },
    { subject: "Web Dev", score: 85 },
    { subject: "AI", score: 78 },
  ];

  return (
    <>
      <TopBar title="Dashboard" subtitle="Welcome back, Aarav! Here's your learning overview." />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Attendance"
            value={`${attendancePercent}%`}
            change="+2%"
            changeType="positive"
            icon={<CalendarDays className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #10b981, #34d399)"
          />
          <StatsCard
            title="Assignments"
            value={`${(assignments || []).filter((a) => a.status === "completed").length}/${(assignments || []).length}`}
            change={`${(assignments || []).filter((a) => a.status === "active" || a.status === "pending").length} pending`}
            changeType="neutral"
            icon={<FileText className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
          />
          <StatsCard
            title="Leaderboard Rank"
            value={myRank > 0 ? `#${myRank}` : "—"}
            change="↑ 2 positions"
            changeType="positive"
            icon={<Trophy className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
          />
          <StatsCard
            title="Current Streak"
            value={`${myLeaderboard?.streak || 0} days`}
            change="Keep it up!"
            changeType="positive"
            icon={<Flame className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #ef4444, #f87171)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Ring */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <h3 className="text-sm font-semibold mb-6" style={{ color: "var(--text-primary)" }}>Attendance Overview</h3>
            <div className="flex justify-center mb-6">
              <AttendanceRing percentage={attendancePercent} size={160} strokeWidth={12} label="This Semester" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-lg font-bold text-green-500">{presentCount}</p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Present</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-lg font-bold text-amber-500">{lateCount}</p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Late</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-lg font-bold text-red-500">{absentCount}</p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Absent</p>
              </div>
            </div>
          </motion.div>

          {/* Subjects */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>My Subjects</h3>
            <div className="space-y-3">
              {(enrollments || []).map((enrollment: { class: { id: string; name: string; schedule: string; color: string } }) => (
                <div
                  key={enrollment.class.id}
                  className="flex items-center gap-3 p-3 rounded-xl border hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="w-1.5 h-10 rounded-full" style={{ background: enrollment.class.color }} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{enrollment.class.name}</p>
                    <p className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                      <Clock className="w-3 h-3" /> {enrollment.class.schedule}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Assignments */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Assignments</h3>
            <div className="space-y-3">
              {(assignments || []).map((assignment) => {
                const statusIcon = assignment.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : assignment.status === "overdue" ? <AlertCircle className="w-4 h-4 text-red-500" /> : <Timer className="w-4 h-4 text-amber-500" />;
                return (
                  <div key={assignment.id} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors" style={{ borderColor: "var(--border-color)" }}>
                    {statusIcon}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{assignment.title}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{assignment.subject} • Due: {assignment.due_date}</p>
                    </div>
                    <span className={`badge text-[10px] ${assignment.status === "completed" ? "badge-success" : assignment.status === "overdue" ? "badge-danger" : "badge-warning"}`}>{assignment.status}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubjectRadarChart data={performanceData} />

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Badges & Achievements</h3>
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {(earnedBadges || []).length}/{(allBadges || []).length} earned
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(allBadges || []).map((badge) => {
                const isEarned = (earnedBadges || []).some((eb: { badge_id: string }) => eb.badge_id === badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-xl border text-center transition-all ${isEarned ? "hover:scale-105 cursor-pointer" : "opacity-40"}`}
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{badge.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{badge.description}</p>
                    {isEarned && <span className="badge badge-success mt-2 text-[9px]">Earned</span>}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
