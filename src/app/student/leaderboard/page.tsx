"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { generateAvatarGradient } from "@/lib/utils";
import { Trophy, TrendingUp, TrendingDown, Minus, Flame, Award, CheckCircle2 } from "lucide-react";
import { MOCK_LEADERBOARD } from "@/lib/mockData";
import { useAuth } from "@/lib/auth-context";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { getLeaderboard } from "@/lib/data-service";
import { Skeleton, TableRowSkeleton, StatCardSkeleton } from "@/components/ui/Skeleton";

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  score: number;
  badges: number;
  streak: number;
  change: "up" | "down" | "neutral";
  attendance: number;
  bonusPoints: number;
}

export default function StudentLeaderboardPage() {
  const { user, profile } = useAuth();
  const studentId = user?.id || "";

  const { data: apiLeaderboard, loading, error } = useSupabaseQuery(getLeaderboard);
  const leaderboard = (apiLeaderboard && apiLeaderboard.length > 0) ? apiLeaderboard : [];
  const useMock = !loading && leaderboard.length === 0 && !error;
  const displayData = useMock ? MOCK_LEADERBOARD : leaderboard;

  // Process leaderboard data
  const actualLeaderboard: LeaderboardEntry[] = (displayData as any[] || [])
    .sort((a: any, b: any) => ((b.score || b.points || 0) - (a.score || a.points || 0)))
    .map((entry: any, i: number): LeaderboardEntry => {
      const studentName = entry.student?.full_name || entry.name || "Unknown Student";
      const score = entry.score || entry.points || 0;
      return {
        id: entry.student_id || entry.id || entry.name || `mock-${i}`,
        rank: i + 1,
        name: studentName,
        avatar: studentName.substring(0, 1).toUpperCase(),
        score: score,
        badges: entry.badges_count || entry.badges || 0,
        streak: entry.streak || 0,
        change: entry.rank_change || 'neutral',
        attendance: entry.attendance_percentage || entry.attendance || 0,
        bonusPoints: entry.bonus_points || 0
      };
    });

  const myEntry = actualLeaderboard.find((e: { id: string; name: string; }) => e.id === studentId || e.name === "Khushi Sarkar");
  const myRank = myEntry?.rank || 0;

  return (
    <>
      <TopBar title="Leaderboard" subtitle="See where you stand among your peers" />

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm mb-6">
            Error loading leaderboard: {error}. Using cached/mock data.
          </div>
        )}

        {/* My Position Banner */}
        {loading ? (
          <div className="card p-6 flex items-center gap-6">
            <Skeleton className="w-16 h-16 rounded-2xl" />
            <div>
              <Skeleton className="h-3 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="ml-auto flex gap-8">
              <div className="text-center space-y-2"><Skeleton className="h-6 w-12" /><Skeleton className="h-3 w-10" /></div>
              <div className="text-center space-y-2"><Skeleton className="h-6 w-12" /><Skeleton className="h-3 w-10" /></div>
              <div className="text-center space-y-2"><Skeleton className="h-6 w-12" /><Skeleton className="h-3 w-10" /></div>
            </div>
          </div>
        ) : (
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
        )}

        {/* Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card overflow-hidden"
        >
          <div className="divide-y" style={{ borderColor: "var(--border-color)" }}>
            {actualLeaderboard.map((student: LeaderboardEntry, i: number) => {
              const isKhushi = student.name === "Khushi Sarkar";
              const isMe = student.id === studentId || isKhushi;
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                    isMe ? "bg-indigo-500/10 border-l-4 border-indigo-500" : "hover:bg-[var(--bg-secondary)]"
                  }`}
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
                      {student.name} {isMe && <span className="text-indigo-500 text-xs ml-2 font-bold">(Ranked)</span>}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                        <Award className="w-3 h-3" /> {student.badges} badges
                      </span>
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                         <CheckCircle2 className="w-3 h-3 text-green-500" /> {student.attendance}% attendance
                      </span>
                      <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                        <Flame className="w-3 h-3 text-orange-500" /> {student.streak} streak
                      </span>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                     <p className="text-lg font-bold gradient-text">{student.score}</p>
                     <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Points</p>
                  </div>
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
              <div className="p-3 space-y-2">
                {[1, 2, 3, 4, 5].map((i) => <TableRowSkeleton key={i} />)}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
