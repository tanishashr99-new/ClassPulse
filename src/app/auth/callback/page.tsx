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
    let timeoutId: NodeJS.Timeout;

    const handleCallback = async () => {
      if (processing.current) return;
      processing.current = true;

      try {
        let role = searchParams.get("role");
        if (!role && typeof window !== "undefined") {
          role = localStorage.getItem("intended_role") || "student";
        }
        role = role || "student";

        // Wait for session to be established (either it already is, or auto-detect will do it)
        const checkSession = async () => {
          let { data: { session }, error } = await supabase.auth.getSession();
          if (session) return { session, error };
          
          // Wait briefly for onAuthStateChange if session isn't immediately ready
          return new Promise<{ session: any; error: any }>((resolve) => {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
              if (s) {
                subscription.unsubscribe();
                resolve({ session: s, error: null });
              } else if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                subscription.unsubscribe();
                resolve({ session: null, error: new Error("Auth failed") });
              }
            });
            // Fallback: check one more time if onAuthStateChange doesn't fire
            setTimeout(async () => {
              subscription.unsubscribe();
              const res = await supabase.auth.getSession();
              resolve(res);
            }, 3000);
          });
        };

        const { session, error: sessionError } = await checkSession();

        if (sessionError || !session) {
          console.error("Auth Error - No session:", sessionError);
          router.replace("/login");
          return;
        }

        // DOMAIN RESTRICTION CHECK (Case Insensitive)
        // const userEmail = (session.user.email || "").toLowerCase();
        // if (!userEmail.endsWith("@giet.edu")) {
        //   console.warn("Auth Forbidden - Non-GIET email:", userEmail);
        //   await supabase.auth.signOut();
        //   router.replace("/login?error=Only @giet.edu accounts are allowed");
        //   return;
        // }

        if (typeof window !== "undefined") localStorage.removeItem("intended_role");
        
        const finalDest = role === "admin" ? "/admin" : "/student";
        router.replace(finalDest);
      } catch (err: any) {
        console.error("Critical Auth Callback Error:", err);
        router.replace(`/login?error=${encodeURIComponent(err.message || "An unexpected authentication error occurred")}`);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    // Safety timer: If still here after 10 seconds, send back to login
    timeoutId = setTimeout(() => {
      if (processing.current) {
        console.error("Auth Timeout - Redirecting to login");
        router.replace("/login?error=Authentication timed out. Please try again.");
      }
    }, 10000);

    handleCallback();
    return () => clearTimeout(timeoutId);
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
