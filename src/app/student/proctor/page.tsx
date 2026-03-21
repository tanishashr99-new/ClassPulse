"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { MessageSquare, Calendar, Send, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function ProctorPage() {
  const [issue, setIssue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(issue.trim()) setSubmitted(true);
  };

  return (
    <>
      <TopBar title="Mentorship & Proctor" subtitle="Schedule reviews and report issues to your assigned faculty proctor" />
      <div className="p-6 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Proctor Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="card p-8">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                   DR
                </div>
                <div>
                   <h2 className="text-xl font-bold">Dr. Robert Smith</h2>
                   <p className="text-[var(--text-secondary)]">Assigned Faculty Proctor</p>
                </div>
             </div>
             
             <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-color)]">
                <h3 className="font-semibold mb-2 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /> Upcoming Scheduled Review</h3>
                <p className="text-sm text-[var(--text-secondary)]">You are scheduled for a 1-on-1 proctor review session.</p>
                <div className="mt-4 flex items-center justify-between">
                   <span className="text-sm font-bold">March 28, 2026</span>
                   <span className="badge badge-warning">2 Slots Remaining Today</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Right Column - Report Issue */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-8">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-red-500" /> Report an Issue</h2>
           </div>

           {submitted ? (
             <div className="flex flex-col items-center justify-center h-[250px] text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                   <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-green-500">Issue Reported</h3>
                <p className="text-sm text-[var(--text-secondary)]">Dr. Smith has been notified and will review your issue before your next scheduled session.</p>
                <button onClick={() => {setIssue(""); setSubmitted(false)}} className="mt-4 text-sm text-blue-500 hover:underline">Submit another report</button>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                   If you are facing academic, personal, or administrative issues, describe them below. Your proctor will analyze this securely.
                </p>
                <textarea 
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  className="input-field min-h-[150px] resize-none text-sm p-4"
                  placeholder="Describe your issue entirely..."
                  required
                />
                <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 group transition-all">
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Submit to Proctor
                </button>
             </form>
           )}
        </motion.div>
      </div>
    </>
  );
}
