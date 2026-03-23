"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getAssignments, getAssignmentSubmissionCounts } from "@/lib/data-service";
import { FileText, Clock, Plus, Users, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { MOCK_ASSIGNMENTS } from "@/lib/mockData";

export default function AssignmentsPage() {
  const { data: apiAssignments, loading, refetch } = useSupabaseQuery(() => getAssignments());
  const { data: subCounts } = useSupabaseQuery(() => getAssignmentSubmissionCounts());
  const [activeTab, setActiveTab] = useState("all");

  const assignments = ((apiAssignments && apiAssignments.length > 0) ? apiAssignments : MOCK_ASSIGNMENTS) as any[];

  const tabs = ["all", "active", "pending", "overdue", "completed"];

  const filtered = assignments.filter(
    (a) => activeTab === "all" || a.status === activeTab
  );

  const statusColors: Record<string, string> = {
    active: "badge-primary",
    pending: "badge-warning",
    overdue: "badge-danger",
    completed: "badge-success",
  };

  return (
    <>
      <TopBar title="Assignments" subtitle="Manage assignments and submissions" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  activeTab === tab ? "btn-primary" : "btn-secondary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="btn-primary flex items-center gap-2 text-xs py-2 px-4">
            <Plus className="w-3.5 h-3.5" /> New Assignment
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6">
                <div className="flex justify-between mb-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-2 w-full" />
                  <div className="flex justify-end">
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((assignment, i) => {
              const subs = (subCounts || {})[assignment.id] || 0;
              const totalStudents = 8;
              const progress = Math.round((subs / totalStudents) * 100);

              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="card p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                          {assignment.title}
                        </h3>
                        <span className={`badge text-[10px] ${statusColors[assignment.status]}`}>
                          {assignment.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
                        <span className="badge badge-primary text-[10px]">{assignment.subject}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {assignment.due_date}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {subs}/{totalStudents} submitted</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {assignment.total_marks} pts
                    </span>
                  </div>

                  {assignment.status !== "completed" && (
                    <div className="mt-4 flex flex-col gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[10px] mb-1" style={{ color: "var(--text-tertiary)" }}>
                          <span>Submissions</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full rounded-full"
                            style={{ background: "var(--gradient-primary)" }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button className="text-[10px] font-bold text-blue-500 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                          Review <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
