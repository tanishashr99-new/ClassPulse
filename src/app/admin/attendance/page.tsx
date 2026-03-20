"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { AttendanceTrendChart, AttendanceRateChart } from "@/components/charts/Charts";
import { mockStudents, mockAttendanceData, mockWeeklyAttendance } from "@/lib/mock-data";
import { generateAvatarGradient, getAttendanceColor } from "@/lib/utils";
import {
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  AlertTriangle,
  Scan,
  RefreshCw,
} from "lucide-react";

export default function AttendancePage() {
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "late">>({});

  const markAttendance = (id: string, status: "present" | "absent" | "late") => {
    setAttendance((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <>
      <TopBar title="Attendance" subtitle="Track and manage student attendance" />

      <div className="p-6 space-y-6">
        {/* Mode Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode("manual")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === "manual" ? "btn-primary" : "btn-secondary"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Manual Attendance
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              mode === "ai" ? "btn-primary" : "btn-secondary"
            }`}
          >
            <Camera className="w-4 h-4" />
            AI Face Recognition
          </button>
        </div>

        {mode === "ai" ? (
          /* AI Face Recognition Mode */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Camera Feed
              </h3>
              <div
                className="aspect-video rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-dashed"
                style={{
                  borderColor: "var(--border-color)",
                  background: "var(--bg-secondary)",
                }}
              >
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center"
                  style={{ background: "var(--gradient-primary)", boxShadow: "0 8px 20px rgba(59,130,246,0.3)" }}
                >
                  <Scan className="w-10 h-10 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    AI Face Recognition
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                    Click to start webcam for automated attendance
                  </p>
                </div>
                <button className="btn-primary flex items-center gap-2 text-sm">
                  <Camera className="w-4 h-4" />
                  Start Camera
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
                Recognition Results
              </h3>
              <div className="space-y-3">
                {mockStudents.slice(0, 5).map((student, i) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl border"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: generateAvatarGradient(student.name) }}
                    >
                      {student.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                        {student.name}
                      </p>
                      <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        Confidence: {(90 + Math.random() * 9).toFixed(1)}%
                      </p>
                    </div>
                    <span className="badge badge-success">
                      <CheckCircle className="w-3 h-3" /> Recognized
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          /* Manual Mode */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden"
          >
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: "var(--border-color)" }}>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  Mark Attendance — Data Structures & Algorithms
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                  March 21, 2026 • 9:00 AM
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-green-500">
                  <CheckCircle className="w-3.5 h-3.5" /> {Object.values(attendance).filter((v) => v === "present").length}
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Clock className="w-3.5 h-3.5" /> {Object.values(attendance).filter((v) => v === "late").length}
                </span>
                <span className="flex items-center gap-1 text-red-500">
                  <XCircle className="w-3.5 h-3.5" /> {Object.values(attendance).filter((v) => v === "absent").length}
                </span>
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
              {mockStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 hover:bg-[var(--bg-secondary)] transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: generateAvatarGradient(student.name) }}
                    >
                      {student.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {student.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {student.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(["present", "late", "absent"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => markAttendance(student.id, status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          attendance[student.id] === status
                            ? status === "present"
                              ? "bg-green-500/10 text-green-500 border-green-500/30"
                              : status === "late"
                              ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                              : "bg-red-500/10 text-red-500 border-red-500/30"
                            : "border-transparent"
                        }`}
                        style={
                          attendance[student.id] !== status
                            ? { color: "var(--text-tertiary)", background: "var(--bg-tertiary)" }
                            : undefined
                        }
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex justify-end gap-3" style={{ borderColor: "var(--border-color)" }}>
              <button className="btn-secondary py-2 px-6 text-sm">Reset</button>
              <button className="btn-primary py-2 px-6 text-sm">Save Attendance</button>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceTrendChart data={mockAttendanceData} />
          <AttendanceRateChart data={mockWeeklyAttendance} />
        </div>
      </div>
    </>
  );
}
