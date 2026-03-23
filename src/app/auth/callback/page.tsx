"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      // Get role from query params OR localStorage fallback
      let role = searchParams.get("role");
      
      if (!role && typeof window !== "undefined") {
        role = localStorage.getItem("intended_role");
      }
      
      role = role || "student";

      // Supabase handles the token exchange automatically via the URL hash
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Auth Callback - Session:", !!session, "Error:", error);

      if (error || !session) {
        console.warn("Auth Callback - Redirecting to login due to missing session");
        router.push("/login");
        return;
      }

      // DOMAIN RESTRICTION CHECK
      const userEmail = session.user.email || "";
      if (!userEmail.endsWith("@giet.edu")) {
        console.warn("Auth Callback - Unauthorized domain:", userEmail);
        await supabase.auth.signOut();
        router.push("/login?error=Only @giet.edu accounts are allowed");
        return;
      }

      // Extract roll number (everything before @giet.edu)
      const rollNumber = userEmail.split("@")[0];

      // Clear storage after successful session retrieval
      if (typeof window !== "undefined") {
        localStorage.removeItem("intended_role");
      }

      // Ensure profile exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, role, student_id")
        .eq("id", session.user.id)
        .maybeSingle();
      console.log("Auth Callback - Profile:", existingProfile);

      if (!existingProfile) {
        console.log("Auth Callback - Creating new profile for role:", role);
        // Create profile for first-time Google login
        const { error: insertError } = await supabase.from("profiles").insert({
          id: session.user.id,
          email: userEmail,
          full_name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            rollNumber ||
            "User",
          role: role === "admin" ? "admin" : "student", // use the fallback role
          student_id: rollNumber, // Fetching the roll number itself
          avatar_url: session.user.user_metadata?.avatar_url || null,
        });

        if (insertError) {
          console.error("Auth Callback - Profile creation failed:", insertError);
          // Fallback to student dashboard if creation fails but we have a session
          router.push("/student");
          return;
        }

        // Route based on selected role
        const dest = role === "admin" ? "/admin" : "/student";
        console.log("Auth Callback - New user redirecting to:", dest);
        router.push(dest);
      } else {
        // If student_id is missing for existing profile, update it
        if (existingProfile.role === "student" && !existingProfile.student_id) {
          await supabase
            .from("profiles")
            .update({ student_id: rollNumber })
            .eq("id", session.user.id);
        }

        // Route based on existing profile role
        const dest = 
          existingProfile.role === "admin" || existingProfile.role === "teacher"
            ? "/admin"
            : "/student";
        console.log("Auth Callback - Existing user redirecting to:", dest);
        router.push(dest);
      }
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
