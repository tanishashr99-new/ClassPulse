"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
  const router = useRouter();

  // Fetch profile from Supabase
  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile(data as Profile);
      return data as Profile;
    }
    
    // Do not auto-create here to avoid race conditions with auth/callback
    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
    }
    return null;
  }

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session: s } }) => {
        if (!mounted) return;
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          fetchProfile(s.user.id).catch(err => {
            console.error("Initial profile fetch error:", err);
          });
        }
      })
      .catch(err => {
        if (mounted) console.error("Auth session error:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return;
        
        // Skip duplicate events if session hasn't changed meaningfully
        // This helps with "Lock broken" issues by reducing concurrent requests
        setSession(s);
        setUser(s?.user ?? null);
        
        if (s?.user) {
          await fetchProfile(s.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
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
          prompt: "consent",
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
