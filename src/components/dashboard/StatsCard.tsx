"use client";

import React from "react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  gradient?: string;
  onClick?: () => void;
}

export function StatsCard({ title, value, change, changeType = "neutral", icon, gradient, onClick }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`stat-card group ${onClick ? "cursor-pointer hover:shadow-lg transition-all" : "cursor-default"}`}
    >
      {gradient && (
        <div
          className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl"
          style={{ background: gradient }}
        />
      )}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  changeType === "positive"
                    ? "bg-green-500/10 text-green-500"
                    : changeType === "negative"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-blue-500/10 text-blue-500"
                }`}
              >
                {change}
              </span>
              <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                vs last week
              </span>
            </div>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          style={{
            background: gradient || "var(--gradient-primary)",
            boxShadow: "0 4px 14px rgba(59,130,246,0.25)",
          }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
