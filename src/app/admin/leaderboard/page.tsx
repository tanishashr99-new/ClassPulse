"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getLeaderboard } from "@/lib/data-service";
import { generateAvatarGradient, getInitials } from "@/lib/utils";
import { Trophy, TrendingUp, TrendingDown, Minus, Flame, Award, Medal } from "lucide-react";

export default function LeaderboardPage() {
  const { data: leaderboard, loading } = useSupabaseQuery(() => getLeaderboard());

  const sorted = (leaderboard || [])
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
    .map((entry: Record<string, unknown>, i: number) => ({ ...entry, rank: i + 1 }));

  return (
    <>
      <TopBar title="Leaderboard" subtitle="Top performing students" />

      <div className="p-6 space-y-6">
        {/* Podium */}
        {sorted.length >= 3 && (
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[sorted[1], sorted[0], sorted[2]].map((entry: Record<string, unknown>, i: number) => {
              const rank = [2, 1, 3][i];
              const sizes = ["h-32", "h-44", "h-24"];
              const icons = [
                <Medal key="2" className="w-6 h-6 text-gray-400" />,
                <Trophy key="1" className="w-8 h-8 text-amber-400" />,
                <Award key="3" className="w-5 h-5 text-amber-700" />,
              ];
              const student = entry.student as { full_name: string } | undefined;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-3">{icons[i]}</div>
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
                    style={{ background: generateAvatarGradient(student?.full_name || "") }}
                  >
                    {getInitials(student?.full_name || "?")}
                  </div>
                  <p className="text-sm font-bold text-center mt-2" style={{ color: "var(--text-primary)" }}>
                    {student?.full_name || "Unknown"}
                  </p>
                  <p className="text-xl font-bold gradient-text mt-1">{entry.score as number}</p>
                  <div className={`w-full ${sizes[i]} rounded-t-xl mt-3`} style={{
                    background: rank === 1 ? "var(--gradient-primary)" : "var(--bg-tertiary)",
                    opacity: rank === 1 ? 1 : 0.5,
                  }} />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full Rankings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: "var(--border-color)" }}>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Full Rankings</h3>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
            {sorted.map((entry: Record<string, unknown>, i: number) => {
              const student = entry.student as { full_name: string } | undefined;
              const rank = entry.rank as number;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${rank <= 3 ? "text-white" : ""}`}
                    style={{
                      background: rank === 1 ? "linear-gradient(135deg,#f59e0b,#fbbf24)" : rank === 2 ? "linear-gradient(135deg,#94a3b8,#cbd5e1)" : rank === 3 ? "linear-gradient(135deg,#b45309,#d97706)" : "var(--bg-tertiary)",
                      color: rank > 3 ? "var(--text-secondary)" : undefined,
                    }}
                  >
                    {rank}
                  </span>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: generateAvatarGradient(student?.full_name || "") }}
                  >
                    {getInitials(student?.full_name || "?")}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{student?.full_name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                        <Award className="w-3 h-3" /> {entry.badges_count as number} badges
                      </span>
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                        <Flame className="w-3 h-3 text-orange-500" /> {entry.streak as number} day streak
                      </span>
                    </div>
                  </div>
                  <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{entry.score as number}</p>
                  {entry.rank_change === "up" ? <TrendingUp className="w-4 h-4 text-green-500" /> : entry.rank_change === "down" ? <TrendingDown className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </>
  );
}
