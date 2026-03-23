"use client";
import React from "react";
import { TopBar } from "@/components/dashboard/TopBar";

export default function AdminProfilePage() {
  return (
    <>
      <TopBar title="Admin Profile" subtitle="Your staff credentials and roles" />
      <div className="p-6">
        <div className="card p-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Faculty Details</h2>
          <p style={{ color: "var(--text-secondary)" }}>Your profile management features are securely managed.</p>
        </div>
      </div>
    </>
  );
}
