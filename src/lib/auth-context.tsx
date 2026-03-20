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
  signUpWithEmail: (email: string, password: string, fullName: string, role: string, extra?: Record<string, string>) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch or create profile from Supabase
  async function fetchProfile(userId: string, userEmail: string, userName?: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setProfile(data as Profile);
      return data as Profile;
    }

    // No profile exists yet – auto-create one
    if (error && error.code === "PGRST116") {
      const newProfile = {
        id: userId,
        email: userEmail,
        full_name: userName || userEmail.split("@")[0],
        role: "student" as const, // default role; can be changed
      };
      const { data: created } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();
      if (created) {
        setProfile(created as Profile);
        return created as Profile;
      }
    }
    return null;
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(
          s.user.id,
          s.user.email || "",
          s.user.user_metadata?.full_name || s.user.user_metadata?.name
        );
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          await fetchProfile(
            s.user.id,
            s.user.email || "",
            s.user.user_metadata?.full_name || s.user.user_metadata?.name
          );
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Google OAuth
  async function signInWithGoogle(role: "student" | "admin") {
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
  ): Promise<{ error: string | null }> {
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
    return { error: null };
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
