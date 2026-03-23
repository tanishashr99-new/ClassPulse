"use client";

import React from "react";
import { motion } from "framer-motion";
import { getAttendanceColor } from "@/lib/utils";

interface AttendanceRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function AttendanceRing({ percentage, size = 140, strokeWidth = 10, label }: AttendanceRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  const color = getAttendanceColor(percentage);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="progress-ring">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-color)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {percentage}%
          </span>
          {label && (
            <span className="text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
