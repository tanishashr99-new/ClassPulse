"use client";
import React from "react";
import { TopBar } from "@/components/dashboard/TopBar";

export default function StudentProfilePage() {
  return (
    <>
      <TopBar title="My Profile" subtitle="View and edit your personal information" />
      <div className="p-6">
        <div className="card p-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Profile Details</h2>
          <p style={{ color: "var(--text-secondary)" }}>Your profile management features are coming soon.</p>
        </div>
      </div>
    </>
  );
}
