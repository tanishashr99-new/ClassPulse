"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { generateAvatarGradient } from "@/lib/utils";
import { Trophy, TrendingUp, TrendingDown, Minus, Flame, Award } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getLeaderboard } from "@/lib/data-service";

export default function StudentLeaderboardPage() {
  const { user, profile } = useAuth();
  const studentId = user?.id || "";

  const { data: leaderboardData, loading } = useSupabaseQuery(() => getLeaderboard());

  // Process leaderboard data
  const actualLeaderboard = (leaderboardData || [])
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => {
      // Provide a fallback if student join fails, though data-service does query profiles
      const studentName = (entry as any).student?.full_name || "Unknown Student";
      return {
        id: entry.student_id,
        rank: index + 1,
        name: studentName,
        avatar: studentName.substring(0, 2).toUpperCase(),
        score: entry.score,
        badges: entry.badges_count,
        streak: entry.streak,
        change: entry.rank_change // 'up', 'down', '-'
      };
    });

  const myEntry = actualLeaderboard.find((e) => e.id === studentId);
  const myRank = myEntry?.rank || 0;

  return (
    <>
      <TopBar title="Leaderboard" subtitle="See where you stand among your peers" />

      <div className="p-6 space-y-6">
        {/* My Position Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--gradient-primary)" }} />
          <div className="flex items-center gap-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white uppercase"
              style={{ background: "var(--gradient-primary)" }}
            >
              {profile?.full_name ? profile.full_name.substring(0, 2) : "ME"}
            </div>
            <div>
              <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>Your Rank</p>
              <p className="text-4xl font-bold gradient-text">{myRank > 0 ? `#${myRank}` : "—"}</p>
            </div>
            <div className="ml-auto grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{myEntry?.score || 0}</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Points</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{myEntry?.badges || 0}</p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Badges</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold flex items-center justify-center gap-1" style={{ color: "var(--text-primary)" }}>
                  <Flame className="w-5 h-5 text-orange-500" /> {myEntry?.streak || 0}
                </p>
                <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>Streak</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card overflow-hidden"
        >
          <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
            {actualLeaderboard.map((student, i) => {
              const isMe = student.id === studentId;
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                    isMe ? "" : "hover:bg-[var(--bg-secondary)]"
                  }`}
                  style={isMe ? { background: "rgba(59,130,246,0.05)" } : undefined}
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
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white uppercase"
                    style={{ background: generateAvatarGradient(student.name) }}
                  >
                    {student.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {student.name} {isMe && <span className="text-blue-500 text-xs ml-2">(You)</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                        <Award className="w-3 h-3" /> {student.badges} badges
                      </span>
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                        <Flame className="w-3 h-3 text-orange-500" /> {student.streak} streak
                      </span>
                    </div>
                  </div>
                  <p className="text-lg font-bold mr-4" style={{ color: "var(--text-primary)" }}>{student.score}</p>
                  {student.change === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : student.change === "down" ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <Minus className="w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                  )}
                </motion.div>
              );
            })}
            
            {actualLeaderboard.length === 0 && !loading && (
              <div className="p-8 text-center" style={{ color: "var(--text-tertiary)" }}>
                No leaderboard data yet!
              </div>
            )}
            {loading && (
              <div className="p-8 text-center" style={{ color: "var(--text-tertiary)" }}>
                Loading rankings...
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
