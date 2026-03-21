"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  FileText,
  BarChart3,
  Trophy,
  Settings,
  LogOut,
  Brain,
  Bell,
  GraduationCap,
  CalendarDays,
  Award,
  ChevronLeft,
  ChevronRight,
  Activity,
  Lightbulb,
  Map,
  MessageSquare,
  ScrollText
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface SidebarProps {
  role: "admin" | "student";
  collapsed: boolean;
  onToggle: () => void;
}

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/classes", label: "Classes", icon: BookOpen },
  { href: "/admin/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/admin/assignments", label: "Assignments", icon: FileText },
  { href: "/admin/tests", label: "Tests", icon: GraduationCap },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/admin/ai-insights", label: "AI Insights", icon: Brain },
];

const studentLinks = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/attendance", label: "Attendance", icon: CalendarDays },
  { href: "/student/assignments", label: "Assignments", icon: FileText },
  { href: "/student/tests", label: "Tests", icon: GraduationCap },
  { href: "/student/exams", label: "Exams", icon: ScrollText },
  { href: "/student/analytics", label: "Analytics", icon: Activity },
  { href: "/student/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/student/roadmap", label: "Roadmap", icon: Map },
  { href: "/student/proctor", label: "Mentorship", icon: MessageSquare },
  { href: "/student/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/student/badges", label: "Badges", icon: Award },
];

export function Sidebar({ role, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r"
      style={{
        background: "var(--bg-sidebar)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b" style={{ borderColor: "var(--border-color)" }}>
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Brain className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="text-sm font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                SmartCampus
              </span>
              <span className="text-[10px] font-semibold gradient-text">AI PLATFORM</span>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
            Navigation
          </p>
        )}
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${isActive ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 w-[3px] h-6 rounded-r-full"
                  style={{ background: "var(--gradient-primary)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 space-y-1 border-t" style={{ borderColor: "var(--border-color)" }}>
        <Link
          href="/settings"
          className={`sidebar-link ${collapsed ? "justify-center px-0" : ""}`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <Link
          href="/login"
          className={`sidebar-link ${collapsed ? "justify-center px-0" : ""}`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </Link>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center border z-50 transition-colors"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border-color)",
          color: "var(--text-secondary)",
        }}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </motion.aside>
  );
}
