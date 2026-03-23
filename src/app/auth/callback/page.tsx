"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const processing = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (processing.current) return;
      processing.current = true;

      // Get role from query params OR localStorage fallback
      let role = searchParams.get("role");
      if (!role && typeof window !== "undefined") {
        role = localStorage.getItem("intended_role") || "student";
      }
      role = role || "student";

      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        router.replace("/login");
        return;
      }

      // DOMAIN RESTRICTION CHECK (Instant)
      const userEmail = session.user.email || "";
      if (!userEmail.endsWith("@giet.edu")) {
        await supabase.auth.signOut();
        router.replace("/login?error=Only @giet.edu accounts are allowed");
        return;
      }

      // Extract roll number and name (Instant)
      const emailParts = userEmail.split("@")[0].split(".");
      const rollNumber = emailParts[0];
      const rawName = emailParts.slice(1).join(" ");
      const formattedName = rawName
        ? rawName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        : (session.user.user_metadata?.full_name || session.user.user_metadata?.name || rollNumber || "User");

      // Check if profile exists (1st DB Call)
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, role, student_id")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!existingProfile) {
        // Create profile (2nd DB Call - Only for new users)
        await supabase.from("profiles").insert({
          id: session.user.id,
          email: userEmail,
          full_name: formattedName,
          role: role === "admin" ? "admin" : "student",
          student_id: rollNumber,
          avatar_url: session.user.user_metadata?.avatar_url || null,
        });
      } else if (existingProfile.role === "student" && !existingProfile.student_id) {
        // Fix missing roll number (Optional DB Call)
        await supabase.from("profiles").update({ student_id: rollNumber }).eq("id", session.user.id);
      }

      // Cleanup and Redirect (Instant)
      if (typeof window !== "undefined") localStorage.removeItem("intended_role");
      
      const finalDest = existingProfile?.role === "admin" || existingProfile?.role === "teacher" || role === "admin"
        ? "/admin" 
        : "/student";
        
      router.replace(finalDest);
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse"
          style={{ background: "var(--gradient-primary)" }}
        >
          <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Signing you in...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  );
}
