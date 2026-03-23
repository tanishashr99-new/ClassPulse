"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { AttendanceRing } from "@/components/dashboard/AttendanceRing";
import { AttendanceRateChart } from "@/components/charts/Charts";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Wifi, WifiOff } from "lucide-react";

import { Skeleton, TableRowSkeleton, ChartSkeleton } from "@/components/ui/Skeleton";

export default function StudentAttendancePage() {
  const { user } = useAuth();
  const studentId = user?.id || "";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'error'>('connected');

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    console.log("Fetching attendance for studentId:", studentId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Client session user ID:", session?.user?.id);
      const res = await fetch(`/api/attendance/student/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const d = await res.json();
      if (!res.ok) {
        throw new Error(d.error || `Server error (${res.status})`);
      }
      setData(d);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // REAL-TIME SUBSCRIPTION
    const channel = supabase
      .channel('attendance_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'attendance',
          filter: `student_id=eq.${studentId}` 
        },
        () => {
          console.log("Real-time update received!");
          fetchStats();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtimeStatus('connected');
        if (status === 'CHANNEL_ERROR') setRealtimeStatus('error');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId]);

  if (loading) {
    return (
      <>
        <TopBar title="My Attendance" subtitle="Loading your statistics..." />
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartSkeleton />
            <div className="lg:col-span-2 card p-6"><TableRowSkeleton /></div>
          </div>
          <ChartSkeleton />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar title="My Attendance" subtitle="Error loading data" />
        <div className="p-6 text-center py-20">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <button onClick={fetchStats} className="btn-primary px-6 py-2">Retry</button>
        </div>
      </>
    );
  }

  const { 
    overall = { percentage: 0, present: 0, late: 0, absent: 0, total: 0 }, 
    bySubject = [], 
    recentRecords = [] 
  } = (data && !data.error) ? data : {};

  // Calendar logic for Current Month (March 2026)
  const currentMonth = 2; // March
  const currentYear = 2026;
  const daysInMonth = 31;
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calendarMap: Record<number, string> = {};
  (recentRecords || []).forEach((r: any) => {
    if (!r?.classDate) return;
    const d = new Date(r.classDate);
    if (d.getMonth() === currentMonth) {
      calendarMap[d.getDate()] = r.status;
    }
  });

  const lowAttendanceSubjects = (bySubject || []).filter((s: any) => s && s.percentage < 75);

  return (
    <>
      <TopBar title="My Attendance" subtitle="View your class attendance and statistics" />

      <div className="p-6 space-y-6">
        {/* Real-time Indicator */}
        <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-widest">
          {realtimeStatus === 'connected' ? (
            <span className="text-green-500 flex items-center gap-1">
              <Wifi className="w-3 h-3" /> Live Updates Active
            </span>
          ) : (
            <span className="text-red-500 flex items-center gap-1">
              <WifiOff className="w-3 h-3" /> Real-time Offline
            </span>
          )}
        </div>

        {lowAttendanceSubjects.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border border-red-500/50 bg-red-500/10 flex items-center gap-3"
          >
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-bold text-red-500">Low Attendance Warning</p>
              <p className="text-xs text-red-400">
                You are below 75% in: {lowAttendanceSubjects.map((s: any) => s.subjectName).join(", ")}
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6 flex flex-col items-center">
             <h3 className="text-sm font-semibold mb-6 self-start" style={{ color: "var(--text-primary)" }}>Overall Attendance</h3>
             <AttendanceRing percentage={overall.percentage} size={180} strokeWidth={14} label="This Semester" />
             <div className="grid grid-cols-3 gap-4 mt-8 w-full text-center">
                <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                   <p className="text-lg font-bold text-green-500">{overall.present}</p>
                   <p className="text-[10px] text-[var(--text-tertiary)] uppercase">Present</p>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                   <p className="text-lg font-bold text-amber-500">{overall.late}</p>
                   <p className="text-[10px] text-[var(--text-tertiary)] uppercase">Late</p>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bg-secondary)]">
                   <p className="text-lg font-bold text-red-500">{overall.absent}</p>
                   <p className="text-[10px] text-[var(--text-tertiary)] uppercase">Absent</p>
                </div>
             </div>
          </motion.div>

          {/* Subject Breakdown Table */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 card p-6">
             <h3 className="text-sm font-semibold mb-6" style={{ color: "var(--text-primary)" }}>Subject-wise Breakdown</h3>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold uppercase text-[var(--text-tertiary)] border-b border-[var(--border-color)]">
                      <th className="pb-3">Subject</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Held</th>
                      <th className="pb-3">Attended</th>
                      <th className="pb-3 text-right">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {bySubject.map((s: any) => (
                      <tr key={s.subjectId} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-secondary)] transition-colors">
                        <td className="py-4">
                          <p className="font-bold" style={{ color: "var(--text-primary)" }}>{s.subjectName}</p>
                          <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{s.subjectCode}</p>
                        </td>
                        <td className="py-4 capitalize" style={{ color: "var(--text-secondary)" }}>{s.type}</td>
                        <td className="py-4 font-medium" style={{ color: "var(--text-primary)" }}>{s.total}</td>
                        <td className="py-4 font-medium" style={{ color: "var(--text-primary)" }}>{s.present + s.late}</td>
                        <td className="py-4 text-right">
                          <span className={`px-2 py-1 rounded font-bold ${
                            s.percentage >= 85 ? 'text-green-500 bg-green-500/10' :
                            s.percentage >= 75 ? 'text-amber-500 bg-amber-500/10' :
                            'text-red-500 bg-red-500/10'
                          }`}>
                            {s.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </motion.div>
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 card p-6">
              <h3 className="text-sm font-semibold mb-6" style={{ color: "var(--text-primary)" }}>Attendance Calendar — March 2026</h3>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(d => <div key={d} className="text-center text-[10px] font-bold text-[var(--text-tertiary)] uppercase">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }).map((_, i) => {
                  const day = i + 1;
                  const status = calendarMap[day] || 'none';
                  const dateObj = new Date(2026, 2, day);
                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                  
                  return (
                    <div key={i} className="aspect-square rounded-xl flex flex-col items-center justify-center border text-xs font-bold transition-all"
                      style={{
                        background: status === 'present' ? 'rgba(16,185,129,0.1)' : 
                                    status === 'absent' ? 'rgba(239,68,68,0.1)' :
                                    status === 'late' ? 'rgba(245,158,11,0.1)' : 
                                    isWeekend ? 'var(--bg-tertiary)' : 'transparent',
                        borderColor: status !== 'none' ? 'var(--border-color)' : 'transparent',
                        color: status === 'present' ? '#10b981' :
                                status === 'absent' ? '#ef4444' :
                                status === 'late' ? '#f59e0b' : 'var(--text-secondary)'
                      }}
                    >
                      {day}
                      {status !== 'none' && <div className="w-1.5 h-1.5 rounded-full mt-1" style={{ background: status === 'present' ? '#10b981' : status === 'absent' ? '#ef4444' : '#f59e0b' }} />}
                    </div>
                  );
                })}
              </div>
           </motion.div>

           <div className="space-y-6">
              <AttendanceRateChart data={[
                { week: "W1", rate: 92 },
                { week: "W2", rate: 89 },
                { week: "W3", rate: 94 },
                { week: "W4", rate: overall.percentage },
              ]} />
              <div className="card p-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                 <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Insight</p>
                 <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    You have maintained a consistent 90%+ attendance this week. Keep it up to earn the "Consistent Learner" badge!
                 </p>
              </div>
           </div>
        </div>
      </div>
    </>
  );
}
