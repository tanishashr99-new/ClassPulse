"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile } from "./supabase";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: (role: "student" | "admin") => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string, role: string, extra?: Record<string, string>) => Promise<{ error: string | null; confirmationRequired?: boolean }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const lastFetchedUser = useRef<string | null>(null);
  const fetchingRef = useRef<string | null>(null);
  const router = useRouter();

  // Use a ref to track the last user we fetched a profile for to avoid redundant calls
  const lastFetchedUserId = React.useRef<string | null>(null);
  const isFetchingProfile = React.useRef<boolean>(false);

  // Fetch profile from Supabase
  async function fetchProfile(userId: string) {
    if (!userId || (lastFetchedUserId.current === userId && profile)) return profile;
    if (isFetchingProfile.current) return null;

    try {
      isFetchingProfile.current = true;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (data) {
        lastFetchedUserId.current = userId;
        setProfile(data as Profile);
        return data as Profile;
      }
      
      if (error && error.code !== "PGRST116") {
        // Only log if it's not a "not found" error
        console.error("Error fetching profile:", error.message || error);
      }
    } finally {
      isFetchingProfile.current = false;
    }
    return null;
  }

  useEffect(() => {
    let mounted = true;

    // Use a variable to track if we've already handled the initial load
    let initialLoadDone = false;

    // We rely on onAuthStateChange which fires INITIAL_SESSION automatically
    // This handles both the initial load and all subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return;
        
        const currentUserId = s?.user?.id || null;

        // Update session/user state
        setSession(s);
        setUser(s?.user ?? null);
        
        // Only fetch profile if there is a user
        if (currentUserId) {
          // fetchProfile internal guards (lastFetchedUserId ref) already prevent redundant calls
          await fetchProfile(currentUserId);
        } else {
          setProfile(null);
          lastFetchedUserId.current = null;
        }
        
        // Always mark loading as false once the first event (usually INITIAL_SESSION) arrives
        if (!initialLoadDone) {
          initialLoadDone = true;
          setLoading(false);
        }
      }
    );

    // Safety timeout: if onAuthStateChange doesn't fire within 2 seconds, 
    // stop the loading state anyway (this handles edge cases where auth client hangs)
    const timeout = setTimeout(() => {
      if (mounted && !initialLoadDone) {
        setLoading(false);
      }
    }, 2000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // Google OAuth
  async function signInWithGoogle(role: "student" | "admin") {
    // Store intended role in localStorage for reliable redirect in callback
    if (typeof window !== "undefined") {
      localStorage.setItem("intended_role", role);
    }

    const redirectUrl = typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?role=${role}`
      : "/auth/callback";

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });
  }

  // Email / Password sign-in
  async function signInWithEmail(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }

  // Email / Password sign-up
  async function signUpWithEmail(
    email: string,
    password: string,
    fullName: string,
    role: string,
    extra?: Record<string, string>
  ): Promise<{ error: string | null; confirmationRequired?: boolean }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (error) return { error: error.message };

    // Create profile entry
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
        department: extra?.department || null,
        student_id: extra?.student_id || null,
      });
    }

    // If session is null, it typically means email confirmation is required
    const confirmationRequired = !data.session;
    return { error: null, confirmationRequired };
  }

  // Sign out
  async function signOut() {
    await supabase.auth.signOut();
    setProfile(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
