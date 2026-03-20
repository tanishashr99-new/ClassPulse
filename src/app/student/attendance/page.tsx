"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { AttendanceRing } from "@/components/dashboard/AttendanceRing";
import { AttendanceRateChart } from "@/components/charts/Charts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getStudentAttendance } from "@/lib/data-service";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const statusColors: Record<string, string> = {
  present: "#10b981",
  absent: "#ef4444",
  late: "#f59e0b",
  holiday: "var(--bg-tertiary)",
  none: "transparent",
};

export default function StudentAttendancePage() {
  const { user } = useAuth();
  const studentId = user?.id || "";

  const { data: rawAttendance } = useSupabaseQuery(
    () => (studentId ? getStudentAttendance(studentId) : Promise.resolve([])),
    [studentId]
  );
  
  const presentCount = (rawAttendance || []).filter((a: any) => a.status === "present").length;
  const lateCount = (rawAttendance || []).filter((a: any) => a.status === "late").length;
  const absentCount = (rawAttendance || []).filter((a: any) => a.status === "absent").length;
  const totalAtt = presentCount + lateCount + absentCount;
  const attendancePercent = totalAtt > 0 ? Math.round((presentCount / totalAtt) * 100) : 0;

  // Placeholder generation for UI calendar visual
  const dynamicCalendarEvents = Array.from({ length: 35 }).map((_, i) => {
    // Just a placeholder distribution based on real API percentages
    let status = "none";
    if (i < totalAtt) {
         if (i < presentCount) status = "present";
         else if (i < presentCount + lateCount) status = "late";
         else status = "absent";
    }
    return { day: (i % 31) + 1, status };
  });

  const dynamicWeeklyAttendance = [
    { week: "Week 1", rate: 92 },
    { week: "Week 2", rate: 89 },
    { week: "Week 3", rate: 94 },
    { week: "Week 4", rate: 91 },
    { week: "Week 5", rate: attendancePercent || 87 },
  ];

  return (
    <>
      <TopBar title="Attendance" subtitle="Your attendance history and calendar" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 flex flex-col items-center"
          >
            <h3 className="text-sm font-semibold mb-6 self-start" style={{ color: "var(--text-primary)" }}>
              Overall Attendance
            </h3>
            <AttendanceRing percentage={attendancePercent} size={180} strokeWidth={14} label="This Semester" />
            <div className="grid grid-cols-3 gap-4 mt-8 w-full">
              <div className="text-center p-3 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-xl font-bold text-green-500">{presentCount}</p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Present</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-xl font-bold text-amber-500">{lateCount}</p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Late</p>
              </div>
              <div className="text-center p-3 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                <p className="text-xl font-bold text-red-500">{absentCount}</p>
                <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Absent</p>
              </div>
            </div>
          </motion.div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                March 2026
              </h3>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)]">
                  <ChevronLeft className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)]">
                  <ChevronRight className="w-4 h-4" style={{ color: "var(--text-secondary)" }} />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold py-2"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for starting day (March 2026 starts on Sunday) */}
              {dynamicCalendarEvents.map((event: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.01 }}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium border transition-all cursor-pointer hover:scale-105 ${
                    event.day === 21 ? "ring-2 ring-blue-500" : ""
                  }`}
                  style={{
                    borderColor: event.status !== "none" ? "var(--border-color)" : "transparent",
                    background:
                      event.status === "present"
                        ? "rgba(16,185,129,0.1)"
                        : event.status === "absent"
                        ? "rgba(239,68,68,0.1)"
                        : event.status === "late"
                        ? "rgba(245,158,11,0.1)"
                        : event.status === "holiday"
                        ? "var(--bg-tertiary)"
                        : "transparent",
                    color:
                      event.status === "present"
                        ? "#10b981"
                        : event.status === "absent"
                        ? "#ef4444"
                        : event.status === "late"
                        ? "#f59e0b"
                        : "var(--text-secondary)",
                  }}
                >
                  {event.day}
                  {event.status !== "none" && event.status !== "holiday" && (
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-0.5"
                      style={{ background: statusColors[event.status] }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 justify-center">
              {[
                { label: "Present", color: "#10b981" },
                { label: "Late", color: "#f59e0b" },
                { label: "Absent", color: "#ef4444" },
                { label: "Holiday", color: "var(--text-tertiary)" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <AttendanceRateChart data={dynamicWeeklyAttendance} />
      </div>
    </>
  );
}
