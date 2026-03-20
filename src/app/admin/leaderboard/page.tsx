"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { mockLeaderboard } from "@/lib/mock-data";
import { generateAvatarGradient } from "@/lib/utils";
import { Trophy, TrendingUp, TrendingDown, Minus, Flame, Award, Medal } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <>
      <TopBar title="Leaderboard" subtitle="Top performing students" />

      <div className="p-6 space-y-6">
        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]].map((student, i) => {
            const rank = [2, 1, 3][i];
            const sizes = ["h-32", "h-44", "h-24"];
            const icons = [
              <Medal key="2" className="w-6 h-6 text-gray-400" />,
              <Trophy key="1" className="w-8 h-8 text-amber-400" />,
              <Award key="3" className="w-5 h-5 text-amber-700" />,
            ];
            return (
              <motion.div
                key={student.rank}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center"
              >
                <div className="mb-3">{icons[i]}</div>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold text-white ring-4 ring-offset-2 mb-3"
                  style={{
                    background: generateAvatarGradient(student.name),
                    ringColor: rank === 1 ? "rgba(251,191,36,0.5)" : "transparent",
                    ringOffsetColor: "var(--bg-secondary)",
                  }}
                >
                  {student.avatar}
                </div>
                <p className="text-sm font-bold text-center" style={{ color: "var(--text-primary)" }}>
                  {student.name}
                </p>
                <p className="text-xl font-bold gradient-text mt-1">{student.score}</p>
                <div className={`w-full ${sizes[i]} rounded-t-xl mt-3`} style={{
                  background: rank === 1 ? "var(--gradient-primary)" : "var(--bg-tertiary)",
                  opacity: rank === 1 ? 1 : 0.5,
                }} />
              </motion.div>
            );
          })}
        </div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden"
        >
          <div className="p-5 border-b" style={{ borderColor: "var(--border-color)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Full Rankings</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
            {mockLeaderboard.map((student, i) => (
              <motion.div
                key={student.rank}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                    student.rank <= 3 ? "text-white" : ""
                  }`}
                  style={{
                    background:
                      student.rank === 1
                        ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
                        : student.rank === 2
                        ? "linear-gradient(135deg, #94a3b8, #cbd5e1)"
                        : student.rank === 3
                        ? "linear-gradient(135deg, #b45309, #d97706)"
                        : "var(--bg-tertiary)",
                    color: student.rank > 3 ? "var(--text-secondary)" : undefined,
                  }}
                >
                  {student.rank}
                </span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: generateAvatarGradient(student.name) }}
                >
                  {student.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {student.name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                      <Award className="w-3 h-3" /> {student.badges} badges
                    </span>
                    <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                      <Flame className="w-3 h-3 text-orange-500" /> {student.streak} day streak
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {student.score}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>points</p>
                </div>
                <div className="w-6">
                  {student.change === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : student.change === "down" ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <Minus className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
