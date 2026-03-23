"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { motion } from "framer-motion";

const chartColors = {
  primary: "#3b82f6",
  accent: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  cyan: "#06b6d4",
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

function ChartCard({ title, subtitle, children, action }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 border"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-color)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <p className="text-xs font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
        {label}
      </p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          {entry.name}: <span className="font-semibold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

// Attendance Trend Chart
interface AttendanceTrendChartProps {
  data: Array<{ date: string; present: number; absent: number; late: number }>;
}

export function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  return (
    <ChartCard title="Attendance Overview" subtitle="This week's attendance breakdown">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="present" fill={chartColors.success} radius={[6, 6, 0, 0]} name="Present" />
          <Bar dataKey="late" fill={chartColors.warning} radius={[6, 6, 0, 0]} name="Late" />
          <Bar dataKey="absent" fill={chartColors.danger} radius={[6, 6, 0, 0]} name="Absent" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Performance Area Chart
interface PerformanceAreaChartProps {
  data: Array<{ month: string; avg: number }>;
}

export function PerformanceAreaChart({ data }: PerformanceAreaChartProps) {
  return (
    <ChartCard title="Performance Trend" subtitle="Monthly class average">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.3} />
              <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} domain={[60, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="avg"
            stroke={chartColors.primary}
            fill="url(#perfGradient)"
            strokeWidth={2.5}
            name="Average"
            dot={{ r: 4, fill: chartColors.primary, strokeWidth: 2, stroke: "var(--bg-card)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Subject Performance Radar
interface SubjectRadarChartProps {
  data: Array<{ subject: string; score: number; average: number }>;
}

export function SubjectRadarChart({ data }: SubjectRadarChartProps) {
  return (
    <ChartCard title="Subject Performance" subtitle="Your scores vs class average">
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--border-color)" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
          <PolarRadiusAxis tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} domain={[0, 100]} />
          <Radar name="Your Score" dataKey="score" stroke={chartColors.primary} fill={chartColors.primary} fillOpacity={0.2} strokeWidth={2} />
          <Radar name="Class Average" dataKey="average" stroke={chartColors.accent} fill={chartColors.accent} fillOpacity={0.1} strokeWidth={2} strokeDasharray="5 5" />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Attendance Rate Line Chart
interface AttendanceRateChartProps {
  data: Array<{ week: string; rate: number }>;
}

export function AttendanceRateChart({ data }: AttendanceRateChartProps) {
  return (
    <ChartCard title="Attendance Rate" subtitle="Weekly attendance percentage">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <defs>
            <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.success} stopOpacity={0.2} />
              <stop offset="100%" stopColor={chartColors.success} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-tertiary)" }} domain={[80, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="rate" stroke="transparent" fill="url(#rateGradient)" />
          <Line
            type="monotone"
            dataKey="rate"
            stroke={chartColors.success}
            strokeWidth={2.5}
            name="Rate"
            dot={{ r: 5, fill: chartColors.success, strokeWidth: 2, stroke: "var(--bg-card)" }}
            activeDot={{ r: 7, strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

// Grade Distribution Pie Chart
export function GradeDistributionChart() {
  const data = [
    { name: "A+", value: 15, color: chartColors.success },
    { name: "A", value: 25, color: chartColors.primary },
    { name: "B+", value: 20, color: chartColors.cyan },
    { name: "B", value: 18, color: chartColors.accent },
    { name: "C+", value: 12, color: chartColors.warning },
    { name: "C & Below", value: 10, color: chartColors.danger },
  ];

  return (
    <ChartCard title="Grade Distribution" subtitle="Current semester">
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span style={{ color: "var(--text-secondary)" }}>{item.name}</span>
              </div>
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
