"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getStudents, getStudentAttendance } from "@/lib/data-service";
import { supabase } from "@/lib/supabase";
import { generateAvatarGradient, getInitials } from "@/lib/utils";
import { Search, Filter, Plus, X, UserPlus, Mail, Award, Flame, TrendingUp } from "lucide-react";

export default function StudentsPage() {
  const { data: students, loading, refetch } = useSupabaseQuery(() => getStudents());
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ full_name: "", email: "", student_id: "" });

  const filtered = (students || []).filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.student_id && s.student_id.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddStudent = async () => {
    if (!newStudent.full_name || !newStudent.email) return;
    const newId = crypto.randomUUID();
    await supabase.from("profiles").insert({
      id: newId,
      full_name: newStudent.full_name,
      email: newStudent.email,
      role: "student",
      student_id: newStudent.student_id || null,
    });
    setNewStudent({ full_name: "", email: "", student_id: "" });
    setShowModal(false);
    refetch();
  };

  return (
    <>
      <TopBar title="Students" subtitle="Manage enrolled students" />

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
            <input
              className="input-field pl-10"
              placeholder="Search by name, email, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4"
          >
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-6">
                <div className="skeleton h-12 w-12 rounded-2xl mb-4" />
                <div className="skeleton h-4 w-32 mb-2" />
                <div className="skeleton h-3 w-48" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((student, i) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-6 group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: generateAvatarGradient(student.full_name) }}
                  >
                    {getInitials(student.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>
                      {student.full_name}
                    </h3>
                    <p className="text-[11px] truncate" style={{ color: "var(--text-tertiary)" }}>
                      {student.email}
                    </p>
                    {student.student_id && (
                      <span className="badge badge-primary text-[10px] mt-1.5">
                        {student.student_id}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                  <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                    <Mail className="w-3 h-3" /> {student.email.split("@")[0]}
                  </span>
                  {student.department && (
                    <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                      {student.department}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>No students found</p>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Add Student</h3>
                </div>
                <button onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5" style={{ color: "var(--text-tertiary)" }} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Full Name *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Aarav Sharma"
                    value={newStudent.full_name}
                    onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Email *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. student@campus.edu"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Student ID</label>
                  <input
                    className="input-field"
                    placeholder="e.g. CS2024009"
                    value={newStudent.student_id}
                    onChange={(e) => setNewStudent({ ...newStudent, student_id: e.target.value })}
                  />
                </div>
                <button onClick={handleAddStudent} className="w-full btn-primary py-3 mt-2">
                  Add Student
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
