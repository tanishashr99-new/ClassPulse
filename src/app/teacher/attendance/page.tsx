"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getEnrollmentsByClass, getAttendanceByDate, markAttendance, getClasses } from "@/lib/data-service";
import { generateAvatarGradient, getInitials } from "@/lib/utils";
import { Camera, Users, CheckCircle2, Clock, XCircle, Save, Lock, Unlock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function TeacherAttendancePage() {
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const today = new Date().toISOString().split("T")[0];

  const { data: classes, loading: classesLoading } = useSupabaseQuery(() => getClasses());

  useEffect(() => {
    if (classes && classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  const { data: enrollments, loading: studentsLoading } = useSupabaseQuery(
    () => getEnrollmentsByClass(selectedClassId),
    [selectedClassId]
  );
  
  const students = enrollments ? enrollments.map((e: any) => e.student).filter(Boolean) : [];

  const { data: existingAttendance, refetch: refetchAttendance } = useSupabaseQuery(
    () => getAttendanceByDate(selectedClassId, today),
    [selectedClassId]
  );

  const [localStatus, setLocalStatus] = useState<Record<string, string>>({});

  // Initialize localStatus when existingAttendance changes
  useEffect(() => {
    if (existingAttendance) {
      const statusMap: Record<string, string> = {};
      existingAttendance.forEach((a: any) => {
        if (a.student?.id) {
          statusMap[a.student.id] = a.status;
        }
      });
      setLocalStatus(statusMap);
    }
  }, [existingAttendance]);

  // Check lock status from localStorage when class changes
  useEffect(() => {
    if (selectedClassId) {
      const locked = localStorage.getItem(`attendance_locked_${selectedClassId}_${today}`);
      setIsLocked(locked === "true");
    }
  }, [selectedClassId, today]);

  const handleMark = async (studentId: string, status: string) => {
    if (isLocked) return;

    // Optimistic UI update
    setLocalStatus((prev) => ({ ...prev, [studentId]: status }));

    // Save to Supabase immediately
    try {
      await markAttendance(studentId, selectedClassId, today, status, mode, user?.id);
    } catch (error) {
      console.error("Failed to mark attendance", error);
      // Revert on failure (simple implementation)
      refetchAttendance();
    }
  };

  const handleLockSession = () => {
    const isComplete = (students || []).every(s => localStatus[s.id]);
    if (!isComplete) {
      if (!window.confirm("Some students are not marked. Lock session anyway?")) {
        return;
      }
    }
    
    setIsLocked(true);
    localStorage.setItem(`attendance_locked_${selectedClassId}_${today}`, "true");
  };

  const statusCounts = {
    present: Object.values(localStatus).filter(s => s === "present").length,
    late: Object.values(localStatus).filter(s => s === "late").length,
    absent: Object.values(localStatus).filter(s => s === "absent").length,
  };

  if (classesLoading || studentsLoading) {
    return (
      <div className="flex items-center justify-center p-20 text-sm text-gray-500">
        Loading attendance dashboard...
      </div>
    );
  }

  return (
    <>
      <TopBar title="Mark Attendance" subtitle="Track daily student presence easily" />

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Controls Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 glass-card rounded-2xl"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode("manual")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === "manual" ? "btn-primary shadow-lg shadow-blue-500/25" : "btn-secondary"
              }`}
            >
              <Users className="w-4 h-4" /> Manual
            </button>
            <button
              onClick={() => setMode("ai")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === "ai" ? "btn-primary shadow-lg shadow-purple-500/25" : "btn-secondary"
              }`}
            >
              <Camera className="w-4 h-4" /> AI Scanning
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-semibold mr-2" style={{ color: "var(--text-secondary)" }}>
              Select Class:
            </div>
            <select
              className="input-field max-w-[200px] text-sm"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={isLocked}
            >
              {(classes || []).map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.code} — {cls.name}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {mode === "manual" ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="card p-6 overflow-hidden relative"
          >
            {isLocked && (
              <div 
                className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center bg-black/5"
                style={{ backdropFilter: "grayscale(50%)" }}
              />
            )}
            
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                  {isLocked && <Lock className="w-4 h-4 text-emerald-500" />}
                  Class Attendance
                </h3>
                <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>

              <div className="flex items-center gap-6 glass-card px-5 py-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-emerald-500 tracking-wider">Present</span>
                    <span className="text-base font-bold leading-none">{statusCounts.present}</span>
                  </div>
                </div>
                
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-amber-500 tracking-wider">Late</span>
                    <span className="text-base font-bold leading-none">{statusCounts.late}</span>
                  </div>
                </div>
                
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-rose-500 tracking-wider">Absent</span>
                    <span className="text-base font-bold leading-none">{statusCounts.absent}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-20">
              <AnimatePresence>
                {(students || []).map((student, i) => {
                  const status = localStatus[student.id];
                  return (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                        status === 'present' ? 'border-emerald-500/50 bg-emerald-500/5' :
                        status === 'late' ? 'border-amber-500/50 bg-amber-500/5' :
                        status === 'absent' ? 'border-rose-500/50 bg-rose-500/5' :
                        'border-gray-200 dark:border-gray-800 hover:border-blue-500/30'
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0"
                        style={{ background: generateAvatarGradient(student.full_name) }}
                      >
                        {getInitials(student.full_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{student.full_name}</p>
                        <p className="text-xs truncate opacity-70" style={{ color: "var(--text-secondary)" }}>{student.student_id || student.email}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          disabled={isLocked}
                          onClick={() => handleMark(student.id, "present")}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            status === "present"
                              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-500"
                          } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                          title="Present"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button
                          disabled={isLocked}
                          onClick={() => handleMark(student.id, "late")}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            status === "late"
                              ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-amber-500/20 hover:text-amber-500"
                          } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                          title="Late"
                        >
                          <Clock className="w-5 h-5" />
                        </button>
                        <button
                          disabled={isLocked}
                          onClick={() => handleMark(student.id, "absent")}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            status === "absent"
                              ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-rose-500/20 hover:text-rose-500"
                          } ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
                          title="Absent"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex items-center justify-between border-t pt-6"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                {Object.keys(localStatus).length} / {(students || []).length} marked
              </div>
              <button
                onClick={handleLockSession}
                disabled={isLocked || Object.keys(localStatus).length === 0}
                className={`flex items-center gap-2 py-3 px-8 rounded-xl font-bold transition-all ${
                  isLocked 
                    ? "bg-emerald-500/10 text-emerald-500 cursor-default" 
                    : "btn-primary hover:scale-105"
                }`}
              >
                {isLocked ? (
                  <>
                    <Lock className="w-4 h-4" />
                    Session Locked
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Submit Attendance
                  </>
                )}
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-12 text-center">
            <div className="w-32 h-32 rounded-[2rem] bg-purple-500/10 flex items-center justify-center mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-[2rem] border-2 border-purple-500 border-dashed animate-spin-slow" />
              <Camera className="w-16 h-16 text-purple-500 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>AI Face Recognition</h3>
            <p className="text-sm max-w-md mx-auto mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Start the camera to automatically detect students in the classroom and mark them present in real-time.
            </p>
            <button className="btn-primary py-3.5 px-10 text-base shadow-lg shadow-purple-500/30">
              Initialize Camera Matrix
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
}
