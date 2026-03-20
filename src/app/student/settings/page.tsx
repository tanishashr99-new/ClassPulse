"use client";
import React from "react";
import { TopBar } from "@/components/dashboard/TopBar";

export default function StudentSettingsPage() {
  return (
    <>
      <TopBar title="Settings" subtitle="Manage your application preferences" />
      <div className="p-6">
        <div className="card p-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Account Settings</h2>
          <p style={{ color: "var(--text-secondary)" }}>Options for changing passwords, notifications, and personal data are coming soon.</p>
        </div>
      </div>
    </>
  );
}
