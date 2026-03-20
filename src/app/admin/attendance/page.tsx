"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { AttendanceTrendChart, AttendanceRateChart } from "@/components/charts/Charts";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getStudents, getAttendanceByDate, markAttendance, getAttendanceSummary } from "@/lib/data-service";
import { getClasses } from "@/lib/data-service";
import { generateAvatarGradient, getInitials } from "@/lib/utils";
import { Camera, Users, CheckCircle2, Clock, XCircle, Save } from "lucide-react";

export default function AttendancePage() {
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [selectedClassId, setSelectedClassId] = useState("00000000-0000-0000-0000-000000000100");
  const today = new Date().toISOString().split("T")[0];

  const { data: students } = useSupabaseQuery(() => getStudents());
  const { data: classes } = useSupabaseQuery(() => getClasses());
  const { data: existingAttendance, refetch: refetchAttendance } = useSupabaseQuery(
    () => getAttendanceByDate(selectedClassId, today),
    [selectedClassId]
  );
  const { data: chartData } = useSupabaseQuery(() => getAttendanceSummary());

  const [localStatus, setLocalStatus] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Merge existing attendance with local state
  const getStatus = (studentId: string) => {
    if (localStatus[studentId]) return localStatus[studentId];
    const existing = (existingAttendance || []).find(
      (a: { student: { id: string } }) => a.student?.id === studentId
    );
    return existing?.status || null;
  };

  const handleMark = (studentId: string, status: string) => {
    setLocalStatus((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    setSaving(true);
    const entries = Object.entries(localStatus);
    for (const [studentId, status] of entries) {
      await markAttendance(studentId, selectedClassId, today, status, mode);
    }
    setLocalStatus({});
    await refetchAttendance();
    setSaving(false);
  };

  const statusCounts = {
    present: (students || []).filter((s) => getStatus(s.id) === "present").length,
    late: (students || []).filter((s) => getStatus(s.id) === "late").length,
    absent: (students || []).filter((s) => getStatus(s.id) === "absent").length,
  };

  return (
    <>
      <TopBar title="Attendance" subtitle="Track and manage student attendance" />

      <div className="p-6 space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode("manual")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === "manual" ? "btn-primary" : "btn-secondary"
            }`}
          >
            <Users className="w-4 h-4" /> Manual Attendance
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === "ai" ? "btn-primary" : "btn-secondary"
            }`}
          >
            <Camera className="w-4 h-4" /> AI Face Recognition
          </button>

          {/* Class selector */}
          <select
            className="input-field ml-auto max-w-xs text-sm"
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setLocalStatus({});
            }}
          >
            {(classes || []).map((cls) => (
              <option key={cls.id} value={cls.id}>{cls.code} — {cls.name}</option>
            ))}
          </select>
        </div>

        {mode === "manual" ? (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  Mark Attendance — {(classes || []).find((c) => c.id === selectedClassId)?.name || ""}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                  {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1 text-green-500">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {statusCounts.present}
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Clock className="w-3.5 h-3.5" /> {statusCounts.late}
                </span>
                <span className="flex items-center gap-1 text-red-500">
                  <XCircle className="w-3.5 h-3.5" /> {statusCounts.absent}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {(students || []).map((student, i) => {
                const status = getStatus(student.id);
                return (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 p-3 rounded-xl border"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: generateAvatarGradient(student.full_name) }}
                    >
                      {getInitials(student.full_name)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{student.full_name}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{student.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {["present", "late", "absent"].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleMark(student.id, s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            status === s
                              ? s === "present"
                                ? "bg-green-500 text-white"
                                : s === "late"
                                ? "bg-amber-500 text-white"
                                : "bg-red-500 text-white"
                              : ""
                          }`}
                          style={
                            status !== s
                              ? { background: "var(--bg-tertiary)", color: "var(--text-secondary)" }
                              : undefined
                          }
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {Object.keys(localStatus).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-end"
              >
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 py-2.5 px-6"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : `Save Attendance (${Object.keys(localStatus).length} changes)`}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
            <div className="text-center">
              <div className="w-24 h-24 rounded-3xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>AI Face Recognition</h3>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Start the camera to automatically recognize and mark attendance using AI
              </p>
              <button className="btn-primary py-3 px-8">Start Camera</button>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceTrendChart data={chartData || []} />
          <AttendanceRateChart
            data={(chartData || []).map((d: { day: string; present: number; late: number; absent: number }) => ({
              week: d.day,
              rate: d.present + d.late + d.absent > 0
                ? Math.round((d.present / (d.present + d.late + d.absent)) * 100)
                : 0,
            }))}
          />
        </div>
      </div>
    </>
  );
}
