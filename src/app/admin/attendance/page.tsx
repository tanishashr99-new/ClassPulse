"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { AttendanceTrendChart, AttendanceRateChart } from "@/components/charts/Charts";
import { supabase } from "@/lib/supabase";
import { generateAvatarGradient, getInitials } from "@/lib/utils";
import { Camera, Users, CheckCircle2, Clock, XCircle, Save, ArrowRight } from "lucide-react";

import { TableRowSkeleton, Skeleton } from "@/components/ui/Skeleton";

// Fallback toast function since sonner is not installed
const toast = {
  success: (msg: string) => alert("Success: " + msg),
  error: (msg: string) => alert("Error: " + msg)
};

const CACHE_KEY_CLASSES = "cp_classes";
const CACHE_KEY_SUBJECTS = "cp_subjects_";
const CACHE_TTL = 3600000; // 1 hour

export default function AttendancePage() {
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  
  // State for Manual Attendance
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [students, setStudents] = useState<any[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string,string>>({});
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);

  // Analytics State
  const [chartData, setChartData] = useState<any[]>([]);

  // Fetch classes with caching
  useEffect(() => {
    async function initData() {
      setFetchingOptions(true);
      try {
        // Classes Cache
        const cachedClasses = localStorage.getItem(CACHE_KEY_CLASSES);
        const classesTime = localStorage.getItem(CACHE_KEY_CLASSES + "_time");
        
        if (cachedClasses && classesTime && Date.now() - parseInt(classesTime) < CACHE_TTL) {
          setClasses(JSON.parse(cachedClasses));
        } else {
          const { data } = await supabase.from('classes').select('id, name, section');
          if (data) {
            setClasses(data);
            localStorage.setItem(CACHE_KEY_CLASSES, JSON.stringify(data));
            localStorage.setItem(CACHE_KEY_CLASSES + "_time", Date.now().toString());
          }
        }

        // Charts data
        const { data: chartRes } = await supabase.from('attendance').select('date, status').limit(1000);
        if (chartRes) {
          const byDate: Record<string, any> = {};
          chartRes.forEach(r => {
            if (!byDate[r.date]) byDate[r.date] = { present: 0, late: 0, absent: 0 };
            byDate[r.date][r.status]++;
          });
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const formatted = Object.entries(byDate).map(([date, counts]: [string, any]) => ({
            day: dayNames[new Date(date).getDay()] || "Day",
            date,
            ...counts
          })).sort((a,b) => a.date.localeCompare(b.date)).slice(-7);
          setChartData(formatted);
        }
      } catch (err) {
        console.error("Attendance init error:", err);
      } finally {
        setFetchingOptions(false);
      }
    }
    initData();
  }, []);

  // Subject selection is now handled by class selection
  useEffect(() => {
    if (selectedClass) {
      setSelectedSubject(selectedClass);
    } else {
      setSelectedSubject('');
    }
  }, [selectedClass]);

  // Load students function
  const loadStudents = async () => {
    if (!selectedClass || !selectedSubject) return;
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `/api/classes/${selectedClass}/students` +
        `?subjectId=${selectedSubject}&date=${selectedDate}`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          }
        }
      );
      const data = await res.json();
      setStudents(data.students || []);
      setAlreadyMarked(data.alreadyMarked);
      
      const map: Record<string,string> = {};
      for (const s of data.students || []) {
        if (s.currentStatus) map[s.id] = s.currentStatus;
      }
      setStatusMap(map);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // Save attendance function
  const saveAttendance = async () => {
    setSaving(true);
    const records = students.map(s => ({
      studentId: s.id,
      status: statusMap[s.id] || 'absent'
    }));
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          subjectId: selectedSubject,
          classDate: selectedDate,
          records
        })
      });
      const data = await res.json();
      if (data.success) {
        const absentCount = records.filter(r => r.status === 'absent').length;
        const presentCount = records.filter(r => r.status === 'present').length;
        
        toast.success(
          `Saved — ${presentCount} present, ${absentCount} absent. Students notified in real-time.`
        );
        setAlreadyMarked(true);
      } else {
        toast.error(data.error || "Failed to save attendance");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving attendance");
    } finally {
      setSaving(false);
    }
  };

  const statusCounts = {
    present: Object.values(statusMap).filter(s => s === 'present').length,
    late: Object.values(statusMap).filter(s => s === 'late').length,
    absent: Object.values(statusMap).filter(s => s === 'absent').length,
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
        </div>

        {mode === "manual" ? (
          <div className="space-y-6">
            {/* Selectors */}
            <div className="card p-4 flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Select Class</label>
                <select 
                  value={selectedClass} 
                  onChange={e => setSelectedClass(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Choose Class...</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}-{c.section}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject selector removed as Class = Subject in this schema */}

              <div className="flex flex-col gap-1 min-w-[150px]">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              <button 
                onClick={loadStudents}
                disabled={!selectedClass || !selectedSubject || loading}
                className="btn-primary mt-5 px-6 py-2.5 flex items-center gap-2 min-w-[140px] justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <span>Load Students</span> <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {loading && (
              <div className="card p-6 space-y-4">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                {[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}
              </div>
            )}

            {!loading && students.length > 0 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      Attendance List — {classes.find(c => c.id === selectedClass)?.name}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                      {new Date(selectedDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-green-500">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {statusCounts.present} Present
                    </span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <Clock className="w-3.5 h-3.5" /> {statusCounts.late} Late
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <XCircle className="w-3.5 h-3.5" /> {statusCounts.absent} Absent
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {students.map((student, i) => (
                    <div key={student.id} 
                      className="flex items-center justify-between p-3 rounded-xl border"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ background: generateAvatarGradient(student.full_name) }}
                        >
                          {getInitials(student.full_name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                            {student.full_name}
                          </p>
                          <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{student.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {['present','late','absent'].map(s => (
                          <button 
                            key={s}
                            onClick={() => setStatusMap(prev => ({...prev, [student.id]: s}))}
                            disabled={alreadyMarked && statusMap[student.id] === s}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                              statusMap[student.id] === s
                                ? s === 'present' 
                                  ? 'bg-green-500 text-white'
                                  : s === 'late'
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-red-500 text-white'
                                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button 
                    onClick={saveAttendance} 
                    disabled={saving || !Object.keys(statusMap).length}
                    className="w-full py-3 rounded-xl font-bold text-sm btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {alreadyMarked 
                      ? '✓ Already submitted — click to update'
                      : saving ? 'Saving...' 
                      : `Save Attendance — ${selectedDate}`}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Scanning Logic (Placeholder as requested to keep untouched) */}
            <div className="lg:col-span-2 card p-0 overflow-hidden relative aspect-video bg-black flex items-center justify-center">
               <div className="absolute inset-0 opacity-40">
                  <div className="absolute inset-0 border-2 border-indigo-500/30 animate-pulse" />
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-scan" />
               </div>
               
               <div className="relative z-10 text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-indigo-500/30 flex items-center justify-center mb-4 mx-auto">
                     <Camera className="w-10 h-10 text-indigo-500 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Continuous Room Scanning...</h3>
                  <p className="text-indigo-300/70 text-xs font-mono">Camera: Room 302 — Wide Angle Beta</p>
               </div>
            </div>

            <div className="card p-6 flex flex-col">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                     <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Live Detection Feed</h3>
                  </div>
               </div>
               <div className="text-center py-10 opacity-40 italic text-sm">
                  Initialize scanning to see live feed
               </div>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceTrendChart data={chartData} />
          <AttendanceRateChart
            data={chartData.map(d => ({
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
