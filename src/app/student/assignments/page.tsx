"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getAssignments } from "@/lib/data-service";
import { FileText, Clock, Upload, CheckCircle2, AlertCircle, Timer, ChevronRight } from "lucide-react";
import { Skeleton, TableRowSkeleton, StatCardSkeleton } from "@/components/ui/Skeleton";
import { MOCK_ASSIGNMENTS } from "@/lib/mockData";

export default function StudentAssignmentsPage() {
  const router = useRouter();
  const { data: apiAssignments, loading } = useSupabaseQuery(() => getAssignments());
  const assignments = ((apiAssignments && apiAssignments.length > 0) ? apiAssignments : MOCK_ASSIGNMENTS) as any[];

  return (
    <>
      <TopBar title="Assignments" subtitle="Your assignments and submissions" />

      <div className="p-6 space-y-6">
        {loading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="card p-6"><TableRowSkeleton /></div>)}
            </div>
          </>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Total", value: (assignments || []).length, color: "#3b82f6" },
                { label: "Completed", value: (assignments || []).filter((a: any) => a.status === "completed").length, color: "#10b981" },
                { label: "Pending", value: (assignments || []).filter((a: any) => a.status === "active" || a.status === "pending").length, color: "#f59e0b" },
                { label: "Overdue", value: (assignments || []).filter((a: any) => a.status === "overdue").length, color: "#ef4444" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card p-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: item.color }} />
                  <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{item.value}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>{item.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Assignment List */}
            <div className="space-y-4">
              {assignments.map((assignment: any, i: number) => {
            const isCompleted = assignment.status === "completed";
            const isOverdue = assignment.status === "overdue";
            return (
              <motion.div
                key={assignment.id}
                onClick={() => router.push(`/student/assignments/${isCompleted ? assignment.id : 'pending'}`)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? "bg-green-500/10"
                        : isOverdue
                        ? "bg-red-500/10"
                        : "bg-blue-500/10"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isOverdue ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                        {assignment.title}
                      </h3>
                      <span
                        className={`badge text-[10px] ${
                          isCompleted ? "badge-success" : isOverdue ? "badge-danger" : "badge-warning"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-tertiary)" }}>
                      <span>{assignment.subject}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Due: {assignment.date || assignment.dueDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isCompleted && (
                      <button className="btn-primary flex items-center gap-2 text-xs py-2 px-4">
                        <Upload className="w-3.5 h-3.5" />
                        Submit
                      </button>
                    )}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-tertiary)" }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
