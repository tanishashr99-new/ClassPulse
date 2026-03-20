"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  GraduationCap,
  BarChart3,
  Shield,
  Zap,
  Users,
  Camera,
  ChevronRight,
  Star,
  ArrowRight,
  CheckCircle2,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const features = [
  {
    icon: Camera,
    title: "AI Face Recognition",
    description: "Automated attendance using real-time facial recognition powered by TensorFlow.js",
    gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Deep insights into student performance with predictive analytics and trend detection",
    gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Instant attendance tracking and live performance dashboards with WebSocket integration",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade security with role-based access control and encrypted data storage",
    gradient: "linear-gradient(135deg, #10b981, #3b82f6)",
  },
  {
    icon: GraduationCap,
    title: "Smart Testing",
    description: "Timer-based online tests with auto-grading, plagiarism detection, and score analytics",
    gradient: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
  },
  {
    icon: Users,
    title: "Gamification",
    description: "Leaderboards, badges, and streaks to motivate students and boost engagement",
    gradient: "linear-gradient(135deg, #ec4899, #f59e0b)",
  },
];

const stats = [
  { value: "50K+", label: "Students" },
  { value: "2K+", label: "Institutions" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "Rating" },
];

const testimonials = [
  {
    name: "Dr. Priya Sharma",
    role: "Dean of CS, IIT Delhi",
    quote: "SmartCampus AI transformed how we manage attendance. The face recognition feature alone saved us 15 hours per week.",
    avatar: "PS",
  },
  {
    name: "Prof. Rajesh Kumar",
    role: "HOD, NIT Trichy",
    quote: "The analytics dashboard gives us unprecedented insights into student engagement. It's like having an AI teaching assistant.",
    avatar: "RK",
  },
  {
    name: "Ananya Iyer",
    role: "Student, BITS Pilani",
    quote: "I love the gamification features! The leaderboard and badges keep me motivated. My attendance went from 75% to 95%.",
    avatar: "AI",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for small classrooms",
    features: ["Up to 50 students", "Manual attendance", "Basic analytics", "Email support"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/mo",
    description: "For growing institutions",
    features: [
      "Up to 500 students",
      "AI Face Recognition",
      "Advanced analytics",
      "Online testing",
      "Priority support",
      "Export reports",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large universities",
    features: [
      "Unlimited students",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "On-premise option",
      "API access",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Navigation */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "var(--bg-glass)",
          backdropFilter: "blur(20px)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              SmartCampus <span className="gradient-text">AI</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--text-secondary)" }}>
              Features
            </a>
            <a href="#testimonials" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--text-secondary)" }}>
              Testimonials
            </a>
            <a href="#pricing" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--text-secondary)" }}>
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]"
              style={{ color: "var(--text-secondary)" }}
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]" style={{ color: "var(--text-primary)" }}>
              Log in
            </Link>
            <Link href="/login" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden hero-grid">
        {/* Background orbs */}
        <div className="floating-orb w-96 h-96 bg-blue-500 top-20 -left-48" />
        <div className="floating-orb w-80 h-80 bg-purple-500 top-40 right-0" style={{ animationDelay: "3s" }} />
        <div className="floating-orb w-64 h-64 bg-pink-500 bottom-20 left-1/3" style={{ animationDelay: "6s" }} />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8"
              style={{
                background: "rgba(59,130,246,0.08)",
                borderColor: "rgba(59,130,246,0.2)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-semibold text-blue-500">
                Powered by Advanced AI
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              The Future of
              <br />
              <span className="gradient-text">Campus Management</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              AI-powered attendance tracking, smart analytics, and gamified learning — all in one beautiful platform designed for modern educational institutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/admin"
                className="btn-primary px-8 py-3 text-base flex items-center gap-2"
              >
                Admin Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/student"
                className="btn-secondary px-8 py-3 text-base flex items-center gap-2"
              >
                Student Demo
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 glass-card p-8 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest gradient-text">Features</span>
            <h2 className="text-4xl font-bold mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
              Everything you need to
              <br />
              <span className="gradient-text">transform education</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              A comprehensive suite of tools designed to make campus management effortless and data-driven.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  {...stagger}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="card p-7 group cursor-default"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: feature.gradient,
                      boxShadow: `0 4px 14px ${feature.gradient.includes("#3b82f6") ? "rgba(59,130,246,0.25)" : "rgba(139,92,246,0.25)"}`,
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-24" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest gradient-text">Live Preview</span>
            <h2 className="text-4xl font-bold mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
              See it in action
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Explore real-time dashboards with AI-powered insights, beautiful charts, and seamless interactions.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            className="glass-card p-1 max-w-5xl mx-auto overflow-hidden"
          >
            <div
              className="rounded-xl p-8 relative overflow-hidden"
              style={{ background: "var(--bg-card)", minHeight: 400 }}
            >
              {/* Mock dashboard preview */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Students", value: "1,247", color: "#3b82f6" },
                  { label: "Attendance Today", value: "94.2%", color: "#10b981" },
                  { label: "Active Tests", value: "3", color: "#8b5cf6" },
                  { label: "Pending Reviews", value: "12", color: "#f59e0b" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="p-5 rounded-xl border relative overflow-hidden"
                    style={{
                      background: "var(--bg-secondary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px]"
                      style={{ background: item.color }}
                    />
                    <p className="text-xs mb-1" style={{ color: "var(--text-tertiary)" }}>
                      {item.label}
                    </p>
                    <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                      {item.value}
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-6 h-52 border"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      Weekly Attendance
                    </p>
                    <span className="badge badge-success text-[10px]">+5.2%</span>
                  </div>
                  {/* Fake chart bars */}
                  <div className="flex items-end gap-3 h-28">
                    {[72, 88, 95, 78, 92, 85, 96].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                        className="flex-1 rounded-t-md"
                        style={{ background: i === 6 ? "#3b82f6" : "rgba(59,130,246,0.2)" }}
                      />
                    ))}
                  </div>
                </div>
                <div
                  className="rounded-xl p-6 h-52 border"
                  style={{ background: "var(--bg-secondary)", borderColor: "var(--border-color)" }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      AI Insights
                    </p>
                    <span className="badge badge-primary text-[10px]">3 new</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { text: "Performance improved by 8% this week", type: "positive" },
                      { text: "3 students need attention — low attendance", type: "warning" },
                      { text: "ML Quiz average predicted: 82%", type: "info" },
                    ].map((insight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.15 }}
                        className="flex items-start gap-2 p-2.5 rounded-lg"
                        style={{ background: "var(--bg-tertiary)" }}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                            insight.type === "positive" ? "bg-green-500" : insight.type === "warning" ? "bg-amber-500" : "bg-blue-500"
                          }`}
                        />
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {insight.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest gradient-text">Testimonials</span>
            <h2 className="text-4xl font-bold mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
              Loved by educators
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="card p-7"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-widest gradient-text">Pricing</span>
            <h2 className="text-4xl font-bold mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
              Simple, transparent pricing
            </h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Choose the plan that works for your institution
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`card p-8 relative ${plan.popular ? "ring-2 ring-blue-500" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  {plan.name}
                </h3>
                <p className="text-xs mb-5" style={{ color: "var(--text-tertiary)" }}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${plan.popular ? "btn-primary" : "btn-secondary"}`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="glass-card p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="floating-orb w-48 h-48 bg-blue-500 -top-24 -left-24" />
            <div className="floating-orb w-48 h-48 bg-purple-500 -bottom-24 -right-24" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Ready to transform your campus?
              </h2>
              <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                Join 2,000+ institutions already using SmartCampus AI to revolutionize education management.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/admin" className="btn-primary px-8 py-3 text-base flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#features" className="btn-secondary px-8 py-3 text-base">
                  Learn More
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: "var(--border-color)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                SmartCampus AI
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              © 2026 SmartCampus AI. All rights reserved. Built with ❤️ for education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
