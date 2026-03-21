"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { MessageSquare, Calendar, ShieldAlert, CheckCircle2, User, Search, Clock } from "lucide-react";

export default function AdminProctorPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "reviewed">("pending");
  const [activeReport, setActiveReport] = useState<string | null>(null);

  const pendingReports = [
    {
      id: "REP-9921",
      studentName: "Alex Mercer",
      studentId: "STU-2918",
      date: "Today, 10:15 AM",
      issue: "I've been facing severe connectivity issues during the last two online examinations leading to auto-submissions. Could we look into granting a retake or scaling?",
      urgency: "high"
    },
    {
      id: "REP-9922",
      studentName: "Sarah Jenkins",
      studentId: "STU-8821",
      date: "Yesterday, 3:40 PM",
      issue: "I am requesting an extension on the Advanced Graph Theory assignment due to a sudden family emergency. I have attached the medical documentation in my email.",
      urgency: "medium"
    }
  ];

  const reviewedReports = [
    {
      id: "REP-9910",
      studentName: "David Chen",
      studentId: "STU-1029",
      date: "Mar 18, 2026",
      issue: "Having trouble understanding the Red-Black tree module.",
      resolution: "Scheduled a 1-on-1 mentoring session for Friday. Provided supplementary video materials."
    }
  ];

  return (
    <>
      <TopBar title="Proctor Dashboard" subtitle="Analyze student issues and manage 1-on-1 mentorship reviews" />
      <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column - Report List */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-4">
           <div className="flex bg-[var(--bg-secondary)] p-1 rounded-xl">
             <button onClick={() => setActiveTab("pending")} className={`flex-1 py-1.5 text-sm font-semibold rounded-lg \${activeTab === 'pending' ? 'bg-white shadow-sm dark:bg-[var(--bg-primary)]' : 'text-[var(--text-tertiary)]'}`}>Pending (2)</button>
             <button onClick={() => setActiveTab("reviewed")} className={`flex-1 py-1.5 text-sm font-semibold rounded-lg \${activeTab === 'reviewed' ? 'bg-white shadow-sm dark:bg-[var(--bg-primary)]' : 'text-[var(--text-tertiary)]'}`}>Reviewed (28)</button>
           </div>

           <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--text-tertiary)]" />
              <input type="text" placeholder="Search student ID..." className="input-field pl-9 text-sm py-2.5" />
           </div>

           <div className="space-y-3 mt-4 max-h-[calc(100vh-14rem)] overflow-y-auto pr-2">
             {(activeTab === "pending" ? pendingReports : reviewedReports).map((report) => (
                <div 
                  key={report.id} 
                  onClick={() => setActiveReport(report.id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all \${activeReport === report.id ? 'border-blue-500 bg-blue-500/5' : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-blue-500/50'}`}
                >
                   <div className="flex justify-between items-start mb-2">
                     <p className="font-bold text-sm">{report.studentName}</p>
                     {(report as any).urgency === "high" && <span className="w-2 h-2 rounded-full bg-red-500 mt-1" />}
                   </div>
                   <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 mb-2"><Clock className="w-3 h-3" />{report.date}</p>
                   <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">{report.issue}</p>
                </div>
             ))}
           </div>
        </motion.div>

        {/* Right Column - Analysis & Resolution */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
           {activeReport ? (
             <div className="card p-6 md:p-8 min-h-[500px] flex flex-col">
                {(() => {
                   const report = [...pendingReports, ...reviewedReports].find(r => r.id === activeReport);
                   if(!report) return null;
                   const isPending = activeTab === "pending";

                   return (
                     <>
                        <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: 'var(--border-color)' }}>
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center border border-[var(--border-color)]">
                                 <User className="w-6 h-6 text-gray-400" />
                              </div>
                              <div>
                                <h2 className="text-xl font-bold">{report.studentName} <span className="text-sm font-normal text-[var(--text-tertiary)] ml-2">({report.studentId})</span></h2>
                                <p className="text-sm text-[var(--text-secondary)]">Reported: {report.date}</p>
                              </div>
                           </div>
                           <span className={`badge \${isPending ? 'badge-warning' : 'badge-success'}`}>
                              {isPending ? 'Action Required' : 'Resolved'}
                           </span>
                        </div>

                        <div className="flex-1 mt-6">
                           <h3 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Student's Issue</h3>
                           <p className="text-[var(--text-primary)] leading-relaxed bg-[var(--bg-secondary)] p-5 rounded-xl border border-[var(--border-color)]">
                              "{report.issue}"
                           </p>

                           {isPending ? (
                             <div className="mt-8 space-y-4">
                                <h3 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Proctor Analysis & Resolution Workspace</h3>
                                <textarea 
                                  className="input-field min-h-[150px] resize-none text-sm p-4 w-full"
                                  placeholder="Type your professional resolution or feedback algorithm here. This will be securely transmitted to the student's dashboard."
                                />
                                <div className="flex items-center gap-4">
                                   <button className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2">
                                      <CheckCircle2 className="w-4 h-4" /> Mark as Resolved & Notify
                                   </button>
                                   <button className="px-6 py-2.5 bg-blue-500/10 text-blue-500 font-semibold rounded-xl hover:bg-blue-500/20 transition-colors flex items-center gap-2">
                                      <Calendar className="w-4 h-4" /> Book 1-on-1
                                   </button>
                                </div>
                             </div>
                           ) : (
                             <div className="mt-8">
                                <h3 className="text-sm font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">Your Resolution History</h3>
                                <div className="p-5 rounded-xl border border-green-500/20 bg-green-500/5">
                                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                    {("resolution" in report) ? report.resolution : "No resolution recorded."}
                                  </p>
                                </div>
                             </div>
                           )}
                        </div>
                     </>
                   )
                })()}
             </div>
           ) : (
             <div className="card p-8 h-[500px] flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mb-4">
                   <ShieldAlert className="w-10 h-10 text-[var(--text-tertiary)]" />
                </div>
                <h2 className="text-xl font-bold mb-2">No Report Selected</h2>
                <p className="text-[var(--text-secondary)] max-w-sm">
                   Select a pending generic issue from the sidebar to begin your proctor review workflow and resolve student tickets.
                </p>
             </div>
           )}
        </motion.div>
      </div>
    </>
  );
}
