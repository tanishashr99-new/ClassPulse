"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Users, GraduationCap, ClipboardCheck, ArrowRight, Clock, Award, BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import { generateAvatarGradient, getInitials } from "@/lib/utils";
import { MyTimetable } from "@/components/dashboard/MyTimetable";

export default function TeacherDashboard() {
  const { user, profile } = useAuth();
  const [teacher, setTeacher] = useState<any>(null);

  useEffect(() => {
    async function fetchTeacher() {
      if (!user) return;
      
      // 1. Try to fetch by user_id first
      let { data, error } = await supabase
        .from("teachers")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      const defaultCode = user.email?.split('_auth_')[1]?.split('@')[0]?.toUpperCase() || "T_NEW";

      // 2. If not found by user_id, try to fetch by teacher_code (in case of old migrations)
      if (!data && defaultCode !== "T_NEW") {
        const { data: existingByCode } = await supabase
          .from("teachers")
          .select("*")
          .eq("teacher_code", defaultCode)
          .maybeSingle();
          
        if (existingByCode) {
          // Update the existing teacher record with the new user.id so it remembers next time
          await supabase
            .from("teachers")
            .update({ user_id: user.id })
            .eq("id", existingByCode.id);
            
          data = { ...existingByCode, user_id: user.id };
        }
      }
      
      if (data) {
        setTeacher(data);
      } else {
        // Automatically create a dummy teacher profile if absolutely none exists
        // Exclude the fixed 'id' field so Supabase auto-generates the UUID
        const newTeacher = {
          user_id: user.id,
          teacher_code: defaultCode,
          full_name: profile?.full_name || "New Teacher",
          email: user.email || "new_teacher@campus.edu",
          password: "dummy_password",
          department: profile?.department || "General",
        };
        const { data: insertedTeacher, error: insertError } = await supabase
          .from("teachers")
          .insert([newTeacher])
          .select()
          .maybeSingle();

        if (insertedTeacher) setTeacher(insertedTeacher);
        else console.error("Could not auto-create teacher profile:", insertError);
      }
    }
    fetchTeacher();
  }, [user, profile]);

  const quickStats = [
    { label: "My Classes", value: "4", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Students", value: "142", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Tests", value: "2", icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Attendance Rate", value: "92%", icon: ClipboardCheck, color: "text-purple-500", bg: "bg-purple-500/10" }
  ];

  return (
    <>
      <TopBar title="Teacher Dashboard" subtitle={`Welcome back, ${profile?.full_name || "Teacher"}`} />
      
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] p-8 text-white flex items-center justify-between shadow-lg"
          style={{ background: "linear-gradient(135deg, #3b82f6, #6d28d9)" }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 max-w-xl">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {teacher?.full_name || profile?.full_name || "Teacher"}</h1>
            {teacher && (
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold font-mono text-white shadow-sm border border-white/10">ID: {teacher.teacher_code}</span>
                {teacher.department && (
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm border border-white/10">{teacher.department} Department</span>
                )}
              </div>
            )}
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              You have 2 upcoming lectures today, and attendance needs to be marked for CS 301. Track student progress directly from here.
            </p>
            <Link 
              href="/teacher/attendance"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition shadow-sm backdrop-blur-md px-6 py-2.5 rounded-xl font-semibold text-sm"
            >
              Mark Attendance Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="hidden lg:flex relative z-10 items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl w-48 h-48 border border-white/20">
            <GraduationCap className="w-24 h-24 text-white opacity-90" />
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass-card p-5 rounded-2xl flex items-center gap-4 transition-transform hover:scale-105"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  {stat.label}
                </p>
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Schedule & Tasks */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Today's Schedule</h3>
              <button className="text-xs text-blue-500 font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { time: "09:00 AM", class: "CS 301 - Data Structures", type: "Lecture", status: "Completed" },
                { time: "11:30 AM", class: "CS 405 - Machine Learning", type: "Lab", status: "Ongoing" },
                { time: "02:00 PM", class: "CS 201 - Discrete Math", type: "Lecture", status: "Upcoming" }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start relative p-3 rounded-xl transition hover:bg-black/5 dark:hover:bg-white/5">
                  <div className="w-16 flex-shrink-0 text-right font-bold text-xs pt-1" style={{ color: "var(--text-tertiary)" }}>
                    {item.time}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{item.class}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{item.type}</p>
                  </div>
                  <div className="pt-1">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                      item.status === 'Ongoing' ? 'bg-blue-500/10 text-blue-500' :
                      item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Items */}
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="card p-6">
            <h3 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>Action Items</h3>
            <div className="space-y-4">
              <Link href="/teacher/attendance" className="block group">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 transition-all hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Mark Attendance</h4>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>For CS 405 - Machine Learning</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-50 transition-opacity group-hover:opacity-100 group-hover:translate-x-1" style={{ color: "var(--text-secondary)" }} />
                </div>
              </Link>
              
              <Link href="/teacher/assignments" className="block group">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 transition-all hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Grade Submissions</h4>
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>12 ungraded submissions for CS 301</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-50 transition-opacity group-hover:opacity-100 group-hover:translate-x-1" style={{ color: "var(--text-secondary)" }} />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Timetable Section */}
        {teacher?.id && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <MyTimetable teacherId={teacher.id} />
          </motion.div>
        )}
      </div>
    </>
  );
}
