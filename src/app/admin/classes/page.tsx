"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getClasses, getClassStudentCounts } from "@/lib/data-service";
import { Users, Clock, Plus } from "lucide-react";

export default function ClassesPage() {
  const { data: classes, loading } = useSupabaseQuery(() => getClasses());
  const { data: studentCounts } = useSupabaseQuery(() => getClassStudentCounts());

  return (
    <>
      <TopBar title="Classes" subtitle="Manage your classes and courses" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            All Classes ({(classes || []).length})
          </h2>
          <button className="btn-primary flex items-center gap-2 text-xs py-2 px-4">
            <Plus className="w-3.5 h-3.5" /> Create Class
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-4 w-16 mb-3" />
                <div className="skeleton h-5 w-48 mb-2" />
                <div className="skeleton h-3 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(classes || []).map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card p-6 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: cls.color }} />

                <div className="flex items-start justify-between mb-3">
                  <span className="badge text-[10px]" style={{ background: `${cls.color}15`, color: cls.color }}>
                    {cls.code}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: cls.color }}
                  />
                </div>

                <h3 className="text-base font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  {cls.name}
                </h3>
                {cls.description && (
                  <p className="text-xs mb-4 line-clamp-2" style={{ color: "var(--text-tertiary)" }}>
                    {cls.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs pt-4 border-t" style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {(studentCounts || {})[cls.id] || 0} students
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {cls.schedule}
                  </span>
                </div>

                {cls.teacher && (
                  <p className="text-[10px] mt-3" style={{ color: "var(--text-tertiary)" }}>
                    Instructor: {cls.teacher.full_name}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
