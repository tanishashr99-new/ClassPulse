"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { Award, Lock, CheckCircle2, Flame, Star, Target as TargetIcon, BookOpen, Trophy } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getBadges, getStudentBadges } from "@/lib/data-service";

export default function StudentBadgesPage() {
  const { user } = useAuth();
  const studentId = user?.id || "";

  const { data: allBadges } = useSupabaseQuery(() => getBadges());
  const { data: earnedBadges } = useSupabaseQuery(
    () => (studentId ? getStudentBadges(studentId) : Promise.resolve([])),
    [studentId]
  );

  const earnedBadgeIds = new Set((earnedBadges || []).map((eb: any) => eb.badge_id));
  
  const formattedBadges = (allBadges || []).map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    icon: b.icon,
    earned: earnedBadgeIds.has(b.id)
  }));

  const earned = formattedBadges.filter((b) => b.earned).length;
  const total = formattedBadges.length || 6;

  const categories = [
    {
      title: "Attendance",
      badges: formattedBadges.filter((_, i) => i < 2),
    },
    {
      title: "Performance",
      badges: formattedBadges.filter((_, i) => i >= 2 && i < 4),
    },
    {
      title: "Milestones",
      badges: formattedBadges.filter((_, i) => i >= 4),
    },
  ];

  return (
    <>
      <TopBar title="Badges" subtitle="Your achievements and milestones" />

      <div className="p-6 space-y-6">
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--gradient-accent)" }} />
          <div className="flex items-center gap-6">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center"
              style={{ background: "var(--gradient-accent)", boxShadow: "0 8px 24px rgba(139,92,246,0.3)" }}
            >
              <Award className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                {earned} of {total} Badges Earned
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                Keep going! You&apos;re {total - earned} badges away from completing your collection.
              </p>
              <div className="w-48 h-2 rounded-full mt-3 overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(earned / total) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: "var(--gradient-accent)" }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Badge Categories */}
        {categories.map((category, catIdx) => (
          <div key={catIdx}>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-tertiary)" }}>
              {category.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.badges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIdx * 0.1 + i * 0.08 }}
                  className={`card p-6 text-center relative overflow-hidden ${
                    badge.earned ? "hover:scale-[1.02] transition-transform" : "opacity-60"
                  }`}
                >
                  {badge.earned && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                  {!badge.earned && (
                    <div className="absolute top-3 right-3">
                      <Lock className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                    </div>
                  )}
                  <div className="text-5xl mb-4">{badge.icon}</div>
                  <h4 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    {badge.name}
                  </h4>
                  <p className="text-xs mt-1.5" style={{ color: "var(--text-secondary)" }}>
                    {badge.description}
                  </p>
                  {badge.earned ? (
                    <span className="badge badge-success mt-3">Earned ✓</span>
                  ) : (
                    <span className="badge mt-3" style={{ background: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}>
                      Locked
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
