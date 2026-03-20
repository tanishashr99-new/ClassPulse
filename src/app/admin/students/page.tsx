"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { mockStudents } from "@/lib/mock-data";
import { getAttendanceColor, generateAvatarGradient } from "@/lib/utils";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  TrendingUp,
  TrendingDown,
  Flame,
  Download,
  UserPlus,
  X,
} from "lucide-react";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = mockStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <TopBar title="Students" subtitle={`${mockStudents.length} students enrolled`} />

      <div className="p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
              <input
                type="text"
                placeholder="Search students..."
                className="input-field pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              {["all", "active", "warning", "danger"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filterStatus === status
                      ? "bg-blue-500/10 text-blue-500"
                      : ""
                  }`}
                  style={filterStatus !== status ? { color: "var(--text-secondary)" } : undefined }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary flex items-center gap-2 text-xs py-2 px-4">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Student
            </button>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: generateAvatarGradient(student.name) }}
                  >
                    {student.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {student.name}
                    </p>
                    <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                      <Mail className="w-3 h-3" />
                      {student.email}
                    </p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)]">
                  <MoreVertical className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                  <p className="text-lg font-bold" style={{ color: getAttendanceColor(student.attendance) }}>
                    {student.attendance}%
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Attendance</p>
                </div>
                <div className="text-center p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                  <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {student.grade}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Grade</p>
                </div>
                <div className="text-center p-2.5 rounded-xl" style={{ background: "var(--bg-secondary)" }}>
                  <p className="text-lg font-bold flex items-center justify-center gap-1" style={{ color: "var(--text-primary)" }}>
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    {student.streak}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Streak</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`badge ${
                    student.status === "active"
                      ? "badge-success"
                      : student.status === "warning"
                      ? "badge-warning"
                      : "badge-danger"
                  }`}
                >
                  {student.status === "active" ? "Active" : student.status === "warning" ? "Warning" : "At Risk"}
                </span>
                <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                  {student.attendance >= 85 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  Performance
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Student Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.5)" }}
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="card p-6 w-full max-w-md"
                style={{ background: "var(--bg-card)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Add New Student</h3>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)]">
                    <X className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                  </button>
                </div>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAddModal(false); }}>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Full Name</label>
                    <input type="text" className="input-field" placeholder="Enter student name" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Email</label>
                    <input type="email" className="input-field" placeholder="student@campus.edu" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Class</label>
                    <select className="input-field">
                      <option>Data Structures & Algorithms</option>
                      <option>Machine Learning</option>
                      <option>Database Systems</option>
                      <option>Web Development</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary py-2.5">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 btn-primary py-2.5">
                      Add Student
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
