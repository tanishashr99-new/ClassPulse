"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAuth } from "@/lib/auth-context";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // if (!loading && !user) {
    //   router.push("/login");
    // }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center animate-pulse" style={{ background: "var(--gradient-primary)" }}>
            <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <Sidebar
        role="teacher"
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <main
        className="transition-all duration-200"
        style={{ marginLeft: collapsed ? 72 : 260 }}
      >
        {children}
      </main>
    </div>
  );
}
