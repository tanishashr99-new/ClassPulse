"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { mockClasses } from "@/lib/mock-data";
import { Users, Clock, BookOpen, Plus, MoreVertical, ExternalLink } from "lucide-react";

export default function ClassesPage() {
  return (
    <>
      <TopBar title="Classes" subtitle="Manage your classes and schedules" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Your Classes
          </h2>
          <button className="btn-primary flex items-center gap-2 text-xs py-2 px-4">
            <Plus className="w-3.5 h-3.5" />
            Create Class
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockClasses.map((cls, i) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card overflow-hidden group cursor-pointer"
            >
              <div className="h-2" style={{ background: cls.color }} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: `${cls.color}15`, color: cls.color }}>
                      {cls.code}
                    </span>
                    <h3 className="text-base font-bold mt-2" style={{ color: "var(--text-primary)" }}>
                      {cls.name}
                    </h3>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)]">
                    <MoreVertical className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <Users className="w-3.5 h-3.5" />
                    {cls.students} students
                  </div>
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <Clock className="w-3.5 h-3.5" />
                    {cls.schedule}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                  <div className="flex -space-x-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div
                        key={j}
                        className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[8px] font-bold text-white"
                        style={{
                          background: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"][j],
                          borderColor: "var(--bg-card)",
                        }}
                      >
                        {["AS", "PP", "RK", "SG"][j]}
                      </div>
                    ))}
                    <div
                      className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[8px] font-bold"
                      style={{
                        background: "var(--bg-tertiary)",
                        borderColor: "var(--bg-card)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      +{cls.students - 4}
                    </div>
                  </div>
                  <button className="text-xs font-semibold text-blue-500 flex items-center gap-1 hover:underline">
                    View <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
