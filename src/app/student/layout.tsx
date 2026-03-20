"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <Sidebar
        role="student"
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
