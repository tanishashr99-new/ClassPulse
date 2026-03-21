"use client";

import React from "react";
import { motion } from "framer-motion";
import { TopBar } from "@/components/dashboard/TopBar";
import { Sparkles, Brain, Target, BookOpen, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function RecommendationsPage() {
  const { profile } = useAuth();
  
  const recommendations = [
    {
      type: "urgent",
      title: "Improve Database Connectivity",
      description: "Based on your last 2 assignments, you are struggling with SQL joins. We recommend completing the interactive SQL module.",
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10"
    },
    {
      type: "growth",
      title: "Advanced Data Structures",
      description: "Your performance in basic arrays is 95%. It's time to start working on Trees and Graphs.",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      type: "attendance",
      title: "Attendance Warning Warning",
      description: "Your attendance in Morning Lectures has dropped to 82%. Try to attend the next 3 sessions to stabilize your grade.",
      icon: Brain,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ];

  return (
    <>
      <TopBar title="AI Recommendations" subtitle="Personalized insights based on your academic footprint" />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, i) => {
            const Icon = rec.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 relative overflow-hidden group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 \${rec.bg}`}>
                  <Icon className={`w-6 h-6 \${rec.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{rec.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {rec.description}
                </p>
                
                <button className="mt-6 w-full btn-secondary py-2 text-sm flex items-center justify-center gap-2 group-hover:bg-[rgba(59,130,246,0.1)] group-hover:text-blue-500 transition-colors">
                  <Sparkles className="w-4 h-4" /> Start Learning Strategy
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}
