"use client";
import React from "react";
import { TopBar } from "@/components/dashboard/TopBar";

export default function AdminSettingsPage() {
  return (
    <>
      <TopBar title="System Settings" subtitle="Configure platform rules and policies" />
      <div className="p-6">
        <div className="card p-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Platform Management</h2>
          <p style={{ color: "var(--text-secondary)" }}>Advanced configuration for class limits, AI integrations, and role-based policies are located here.</p>
        </div>
      </div>
    </>
  );
}
