"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { mockTests } from "@/lib/mock-data";
import { Clock, FileQuestion, Users, Plus, Play, BarChart3, Calendar } from "lucide-react";

export default function TestsPage() {
  return (
    <>
      <TopBar title="Tests" subtitle="Create and manage online assessments" />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>All Tests</h2>
          <button className="btn-primary flex items-center gap-2 text-xs py-2 px-4">
            <Plus className="w-3.5 h-3.5" />
            Create Test
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockTests.map((test, i) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`badge ${test.status === "completed" ? "badge-success" : "badge-primary"}`}>
                    {test.status === "completed" ? "Completed" : "Upcoming"}
                  </span>
                  <h3 className="text-base font-bold mt-2" style={{ color: "var(--text-primary)" }}>
                    {test.title}
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                    {test.subject}
                  </p>
                </div>
                {test.status === "completed" && test.avgScore > 0 && (
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: test.avgScore >= 75 ? "#10b981" : "#f59e0b" }}>
                      {test.avgScore}%
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      Avg Score
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                  <Calendar className="w-3.5 h-3.5" />
                  {test.date}
                </div>
                <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                  <Clock className="w-3.5 h-3.5" />
                  {test.duration} min
                </div>
                <div className="flex items-center gap-2 text-xs p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}>
                  <FileQuestion className="w-3.5 h-3.5" />
                  {test.questions} Qs
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                {test.status === "upcoming" ? (
                  <button className="flex-1 btn-primary flex items-center justify-center gap-2 py-2 text-xs">
                    <Play className="w-3.5 h-3.5" />
                    Start Test
                  </button>
                ) : (
                  <button className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2 text-xs">
                    <BarChart3 className="w-3.5 h-3.5" />
                    View Results
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
