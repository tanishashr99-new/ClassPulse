"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { ScrollText, Award, Calendar } from "lucide-react";

export default function ExamsPage() {
  const previousExams = [
    { name: "Midterm: Data Structures", date: "Oct 15, 2025", score: 92, total: 100, status: "High Distinction" },
    { name: "Quiz: Relational Databases", date: "Nov 02, 2025", score: 85, total: 100, status: "Distinction" },
    { name: "Final: Intro to AI", date: "Dec 18, 2025", score: 96, total: 100, status: "High Distinction" },
  ];

  return (
    <>
      <TopBar title="Exam Marks" subtitle="Your official transcript and academic assessment scores" />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Banner */}
        <div className="card p-8 bg-[var(--bg-glass)]" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))" }}>
          <h2 className="text-2xl font-bold mb-2">Cumulative GPA: 3.82 / 4.0</h2>
          <p className="text-[var(--text-secondary)] mb-6">You are in the top 10% of your current academic cohort.</p>
          <div className="flex items-center gap-4">
             <div className="bg-white/10 px-4 py-2 rounded-xl text-blue-500 font-semibold border border-blue-500/20">Dean's List Expected</div>
          </div>
        </div>

        {/* Exam List */}
        <div className="grid grid-cols-1 gap-4">
           {previousExams.map((exam, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="card p-6 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors group"
             >
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-color)]">
                      <ScrollText className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                   </div>
                   <div>
                     <h3 className="text-lg font-semibold">{exam.name}</h3>
                     <p className="text-xs flex items-center gap-2 mt-1 text-[var(--text-tertiary)]"><Calendar className="w-3 h-3" /> {exam.date}</p>
                   </div>
                </div>

                <div className="flex items-center gap-8">
                   <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-medium text-[var(--text-secondary)]">{exam.status}</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-green-500">{exam.score}<span className="text-sm text-[var(--text-tertiary)]">/{exam.total}</span></span>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </>
  );
}
