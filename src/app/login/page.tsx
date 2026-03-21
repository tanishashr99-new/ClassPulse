"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Brain, Mail, Lock, Eye, EyeOff, Sparkles, GraduationCap, ShieldCheck,
  ArrowLeft, BookOpen, Users, BarChart3, Camera, ClipboardCheck, Trophy, Loader2,
} from "lucide-react";

type SelectedRole = null | "student" | "teacher";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<SelectedRole>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("Computer Science");
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setError(null);
    const role = selectedRole === "teacher" ? "admin" : "student";
    await signInWithGoogle(role as "student" | "admin");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error: err } = await signInWithEmail(email, password);
        if (err) { setError(err); setLoading(false); return; }
        // Redirect based on role selection
        router.push(selectedRole === "teacher" ? "/admin" : "/student");
      } else {
        const role = selectedRole === "teacher" ? "admin" : "student";
        const extra: Record<string, string> = {};
        if (selectedRole === "teacher") extra.department = department;
        if (selectedRole === "student") extra.student_id = studentId;

        const { error: err } = await signUpWithEmail(email, password, fullName, role, extra);
        if (err) { setError(err); setLoading(false); return; }
        // After signup, redirect
        router.push(selectedRole === "teacher" ? "/admin" : "/student");
      }
    } catch {
      setError("An unexpected error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        
        {/* Dynamic Image Layer for Student Portal */}
        <div 
          className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-700 \${selectedRole === "student" ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: "url('/Gemini_Generated_Image_5x1qit5x1qit5x1q.png')" }}
        />

        {/* Dynamic Gradient Overlay */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background:
              selectedRole === "teacher"
                ? "linear-gradient(135deg, #3b82f6, #6d28d9)"
                : selectedRole === "student"
                ? "linear-gradient(135deg, rgba(8, 145, 178, 0.65), rgba(30, 58, 138, 0.85))"
                : "var(--gradient-primary)",
            transition: "background 0.5s ease",
          }}
        />

        <div className="floating-orb w-96 h-96 bg-white/20 -top-32 -left-32 z-0" />
        <div className="floating-orb w-80 h-80 bg-white/10 bottom-0 right-0 z-0" style={{ animationDelay: "4s" }} />

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedRole ?? "default"}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-md"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SmartCampus</h1>
                <span className="text-xs font-semibold text-white/70">AI PLATFORM</span>
              </div>
            </div>

            {selectedRole === null && (
              <>
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                  Intelligent Campus Management for the Future
                </h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  AI-powered attendance, smart analytics, and gamified learning — all in one beautiful platform.
                </p>
                <div className="mt-12 space-y-4">
                  {["Face Recognition Attendance", "Real-time Performance Analytics", "Smart Insights & Predictions"].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15 }} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><Sparkles className="w-3 h-3 text-white" /></div>
                      <span className="text-white/90 text-sm font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {selectedRole === "teacher" && (
              <>
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Teacher & Admin Portal</h2>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  Manage classes, track attendance with AI, create tests, and view real-time analytics.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Camera, text: "AI Face Recognition Attendance" },
                    { icon: Users, text: "Student Management & Analytics" },
                    { icon: ClipboardCheck, text: "Assignments & Test Creation" },
                    { icon: BarChart3, text: "Performance Insights Dashboard" },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12 }} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center"><item.icon className="w-4 h-4 text-white" /></div>
                      <span className="text-white/90 text-sm font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {selectedRole === "student" && (
              <>
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Student Portal</h2>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  Track your attendance, attempt tests, submit assignments, and climb the leaderboard.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: BookOpen, text: "Subjects & Assignment Tracker" },
                    { icon: GraduationCap, text: "Timer-based Online Tests" },
                    { icon: Trophy, text: "Leaderboard & Badge Achievements" },
                    { icon: BarChart3, text: "Performance & Attendance Analytics" },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12 }} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center"><item.icon className="w-4 h-4 text-white" /></div>
                      <span className="text-white/90 text-sm font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <AnimatePresence mode="wait">
          {selectedRole === null ? (
            <motion.div key="role-select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="w-full max-w-md">
              <div className="lg:hidden flex items-center gap-2.5 mb-10">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  SmartCampus <span className="gradient-text">AI</span>
                </span>
              </div>

              <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Welcome to SmartCampus</h2>
              <p className="mb-10" style={{ color: "var(--text-secondary)" }}>Select your portal to get started</p>

              <div className="space-y-4">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedRole("student")} className="w-full card p-6 text-left group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }} />
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)", boxShadow: "0 6px 20px rgba(16,185,129,0.3)" }}>
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Student Portal</h3>
                      <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>View attendance, take tests, track performance & earn badges</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setSelectedRole("teacher")} className="w-full card p-6 text-left group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(135deg, #3b82f6, #6d28d9)" }} />
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: "linear-gradient(135deg, #3b82f6, #6d28d9)", boxShadow: "0 6px 20px rgba(59,130,246,0.3)" }}>
                      <ShieldCheck className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Teacher / Admin Portal</h3>
                      <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>Manage students, take attendance, create tests & view analytics</p>
                    </div>
                  </div>
                </motion.button>
              </div>

              <p className="text-xs text-center mt-8" style={{ color: "var(--text-tertiary)" }}>
                By continuing you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          ) : (
            <motion.div key="login-form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }} className="w-full max-w-md">
              <button
                onClick={() => { setSelectedRole(null); setIsLogin(true); setEmail(""); setPassword(""); setFullName(""); setError(null); }}
                className="flex items-center gap-2 mb-6 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                <ArrowLeft className="w-4 h-4" /> Back to portal selection
              </button>

              <div className="mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold" style={{
                  background: selectedRole === "teacher" ? "rgba(59,130,246,0.1)" : "rgba(16,185,129,0.1)",
                  color: selectedRole === "teacher" ? "#3b82f6" : "#10b981",
                }}>
                  {selectedRole === "teacher" ? <ShieldCheck className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                  {selectedRole === "teacher" ? "Teacher / Admin" : "Student"} Portal
                </span>
              </div>

              <h2 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                {isLogin ? "Welcome back" : "Create account"}
              </h2>
              <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
                {isLogin
                  ? `Sign in to your ${selectedRole === "teacher" ? "teacher" : "student"} account`
                  : `Register as a ${selectedRole === "teacher" ? "teacher / admin" : "student"}`}
              </p>

              {/* Error message */}
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-500 font-medium">{error}</p>
                </motion.div>
              )}

              {/* Google Sign In */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full btn-secondary flex items-center justify-center gap-3 mb-6 py-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
                <span className="text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Full Name</label>
                    <input type="text" className="input-field" placeholder={selectedRole === "teacher" ? "Prof. John Doe" : "John Doe"} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                    <input type="email" className="input-field pl-10" placeholder={selectedRole === "teacher" ? "professor@campus.edu" : "student@campus.edu"} value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-tertiary)" }} />
                    <input type={showPassword ? "text" : "password"} className="input-field pl-10 pr-10" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-tertiary)" }}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span style={{ color: "var(--text-secondary)" }}>Remember me</span>
                    </label>
                    <a href="#" className="text-blue-500 font-medium hover:underline">Forgot password?</a>
                  </div>
                )}

                {!isLogin && selectedRole === "teacher" && (
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Department</label>
                    <select className="input-field" value={department} onChange={(e) => setDepartment(e.target.value)}>
                      <option>Computer Science</option>
                      <option>Mathematics</option>
                      <option>Physics</option>
                      <option>Electronics</option>
                    </select>
                  </div>
                )}

                {!isLogin && selectedRole === "student" && (
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Student ID</label>
                    <input type="text" className="input-field" placeholder="e.g. CS2024001" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-base mt-2 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  style={{
                    background: selectedRole === "teacher"
                      ? "linear-gradient(135deg, #3b82f6, #6d28d9)"
                      : "linear-gradient(135deg, #10b981, #3b82f6)",
                    boxShadow: selectedRole === "teacher"
                      ? "0 4px 14px rgba(59,130,246,0.35)"
                      : "0 4px 14px rgba(16,185,129,0.35)",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLogin ? "Sign In" : "Create Account"}
                </button>
              </form>

              <p className="text-sm text-center mt-6" style={{ color: "var(--text-secondary)" }}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-blue-500 font-semibold hover:underline">
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
