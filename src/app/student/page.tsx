"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AttendanceRing } from "@/components/dashboard/AttendanceRing";
import { SubjectRadarChart } from "@/components/charts/Charts";
import {
  mockClasses,
  mockAssignments,
  mockPerformanceData,
  mockBadges,
} from "@/lib/mock-data";
import {
  CalendarDays,
  FileText,
  Trophy,
  Flame,
  BookOpen,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Timer,
  Star,
} from "lucide-react";

export default function StudentDashboard() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Welcome back, Aarav! Here's your learning overview." />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Attendance"
            value="94%"
            change="+2%"
            changeType="positive"
            icon={<CalendarDays className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #10b981, #34d399)"
          />
          <StatsCard
            title="Assignments"
            value="3/5"
            change="2 pending"
            changeType="neutral"
            icon={<FileText className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #3b82f6, #60a5fa)"
          />
          <StatsCard
            title="Leaderboard Rank"
            value="#3"
            change="↑ 2 positions"
            changeType="positive"
            icon={<Trophy className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
          />
          <StatsCard
            title="Current Streak"
            value="12 days"
            change="New record!"
            changeType="positive"
            icon={<Flame className="w-5 h-5 text-white" />}
            gradient="linear-gradient(135deg, #ef4444, #f87171)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Ring + Subjects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h3 className="text-sm font-semibold mb-6" style={{ color: "var(--text-primary)" }}>
              Attendance Overview
            </h3>
            <div className="flex justify-center mb-6">
              <AttendanceRing percentage={94} size={160} strokeWidth={12} label="This Semester" />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-lg font-bold text-green-500">89</p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Present</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-lg font-bold text-amber-500">3</p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Late</p>
              </div>
              <div className="p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-lg font-bold text-red-500">5</p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Absent</p>
              </div>
            </div>
          </motion.div>

          {/* Subjects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              My Subjects
            </h3>
            <div className="space-y-3">
              {mockClasses.slice(0, 4).map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center gap-3 p-3 rounded-xl border transition-colors hover:bg-[var(--bg-secondary)] cursor-pointer"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="w-1.5 h-10 rounded-full" style={{ background: cls.color }} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {cls.name}
                    </p>
                    <p className="text-[10px] flex items-center gap-1 mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                      <Clock className="w-3 h-3" />
                      {cls.schedule}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Assignment Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Assignments
            </h3>
            <div className="space-y-3">
              {mockAssignments.map((assignment) => {
                const statusIcon =
                  assignment.status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : assignment.status === "overdue" ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : (
                    <Timer className="w-4 h-4 text-amber-500" />
                  );
                return (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-3 p-3 rounded-xl border transition-colors hover:bg-[var(--bg-secondary)] cursor-pointer"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    {statusIcon}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                        {assignment.title}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                        {assignment.subject} • Due: {assignment.dueDate}
                      </p>
                    </div>
                    <span
                      className={`badge text-[10px] ${
                        assignment.status === "completed"
                          ? "badge-success"
                          : assignment.status === "overdue"
                          ? "badge-danger"
                          : "badge-warning"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Radar */}
          <SubjectRadarChart data={mockPerformanceData} />

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Badges & Achievements
              </h3>
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {mockBadges.filter((b) => b.earned).length}/{mockBadges.length} earned
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {mockBadges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    badge.earned ? "hover:scale-105 cursor-pointer" : "opacity-40"
                  }`}
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {badge.name}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                    {badge.description}
                  </p>
                  {badge.earned && (
                    <span className="badge badge-success mt-2 text-[9px]">Earned</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
