"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { mockAssignments } from "@/lib/mock-data";
import { FileText, Clock, Users, Plus, Upload, ChevronRight, AlertCircle, CheckCircle2, Timer } from "lucide-react";

export default function AssignmentsPage() {
  const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    active: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: <Timer className="w-3 h-3" /> },
    pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: <Clock className="w-3 h-3" /> },
    overdue: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: <AlertCircle className="w-3 h-3" /> },
    completed: { color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: <CheckCircle2 className="w-3 h-3" /> },
  };

  return (
    <>
      <TopBar title="Assignments" subtitle="Create and manage assignments" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {["All", "Active", "Pending", "Overdue", "Completed"].map((tab) => (
              <button
                key={tab}
                className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
                  tab === "All" ? "text-blue-500 border-blue-500" : "border-transparent"
                }`}
                style={tab !== "All" ? { color: "var(--text-tertiary)" } : undefined}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="btn-primary flex items-center gap-2 text-xs py-2 px-4">
            <Plus className="w-3.5 h-3.5" />
            New Assignment
          </button>
        </div>

        <div className="space-y-4">
          {mockAssignments.map((assignment, i) => {
            const config = statusConfig[assignment.status];
            const progress = Math.round((assignment.submissions / assignment.total) * 100);
            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5 flex items-center gap-5 group cursor-pointer"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: config.bg }}
                >
                  <FileText className="w-5 h-5" style={{ color: config.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {assignment.title}
                    </p>
                    <span
                      className="badge flex items-center gap-1"
                      style={{ background: config.bg, color: config.color }}
                    >
                      {config.icon}
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
                    <span>{assignment.subject}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due: {assignment.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {assignment.submissions}/{assignment.total} submissions
                    </span>
                  </div>
                </div>

                <div className="w-32 flex-shrink-0">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span style={{ color: "var(--text-tertiary)" }}>Progress</span>
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.05 }}
                      className="h-full rounded-full"
                      style={{ background: config.color }}
                    />
                  </div>
                </div>

                <ChevronRight
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--text-tertiary)" }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
