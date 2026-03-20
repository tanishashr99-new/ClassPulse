"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { mockAIInsights, mockStudents } from "@/lib/mock-data";
import { generateAvatarGradient, getAttendanceColor } from "@/lib/utils";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  Sparkles,
  ArrowRight,
  BarChart3,
  Users,
  BookOpen,
} from "lucide-react";

export default function AIInsightsPage() {
  const predictions = [
    { student: "Meera Reddy", predicted: "A+", confidence: 96, trend: "up" as const },
    { student: "Sneha Gupta", predicted: "A", confidence: 92, trend: "up" as const },
    { student: "Aarav Sharma", predicted: "A-", confidence: 88, trend: "same" as const },
    { student: "Arjun Singh", predicted: "C", confidence: 78, trend: "down" as const },
  ];

  const suggestions = [
    {
      title: "Schedule Extra Tutorial",
      description: "3 students in DSA are consistently scoring below 60%. Schedule a remedial session.",
      priority: "high" as const,
      icon: BookOpen,
    },
    {
      title: "Attendance Intervention",
      description: "Arjun Singh has missed 5 classes this month. Consider a one-on-one meeting.",
      priority: "high" as const,
      icon: Users,
    },
    {
      title: "Optimize Test Difficulty",
      description: "ML Quiz scores have a high variance (σ=18). Consider adjusting difficulty balance.",
      priority: "medium" as const,
      icon: BarChart3,
    },
    {
      title: "Reward Top Performers",
      description: "5 students have maintained 90%+ attendance for 4 weeks. Consider recognition.",
      priority: "low" as const,
      icon: Target,
    },
  ];

  return (
    <>
      <TopBar title="AI Insights" subtitle="Smart analytics and predictions powered by AI" />

      <div className="p-6 space-y-6">
        {/* AI Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-8"
          style={{ background: "var(--gradient-accent)" }}
        >
          <div className="floating-orb w-40 h-40 bg-white/20 -top-20 -right-20" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">SmartCampus AI Engine</h2>
              <p className="text-white/70 text-sm">
                Analyzing 1,247 students across 5 classes. Last updated 2 minutes ago.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white/70" />
              <span className="text-xs font-semibold text-white/70">Live</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAIInsights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      insight.type === "positive" ? "bg-green-500/10" : insight.type === "warning" ? "bg-amber-500/10" : "bg-red-500/10"
                    }`}
                  >
                    {insight.type === "positive" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : insight.type === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {insight.title}
                  </h3>
                </div>
                <span
                  className={`text-lg font-bold ${
                    insight.type === "positive" ? "text-green-500" : insight.type === "warning" ? "text-amber-500" : "text-red-500"
                  }`}
                >
                  {insight.metric}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {insight.insight}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Predictions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Target className="w-5 h-5 text-blue-500" />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Grade Predictions
              </h3>
            </div>
            <div className="space-y-3">
              {predictions.map((pred, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl border"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: generateAvatarGradient(pred.student) }}
                  >
                    {pred.student.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {pred.student}
                    </p>
                    <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      Confidence: {pred.confidence}%
                    </p>
                  </div>
                  <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {pred.predicted}
                  </span>
                  {pred.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : pred.trend === "down" ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : null}
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Smart Suggestions
              </h3>
            </div>
            <div className="space-y-3">
              {suggestions.map((sug, i) => {
                const Icon = sug.icon;
                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border transition-colors hover:bg-[var(--bg-secondary)] cursor-pointer group"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                            {sug.title}
                          </p>
                          <span
                            className={`badge text-[10px] ${
                              sug.priority === "high"
                                ? "badge-danger"
                                : sug.priority === "medium"
                                ? "badge-warning"
                                : "badge-success"
                            }`}
                          >
                            {sug.priority}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {sug.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" style={{ color: "var(--text-tertiary)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
