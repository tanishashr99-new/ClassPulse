"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
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
  XCircle,
  Upload,
  Trophy,
  ClipboardCheck,
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
    icon: ClipboardCheck,
    title: "Attendance Management",
    description: "Steamlined attendance tracking with real-time reports and analytics",
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

const problems = {
  before: [
    "Taking attendance manually wastes 10-15 minutes per class",
    "No visibility into which students are falling behind",
    "Test grading eats up hours every week",
    "Student engagement is impossible to measure",
  ],
  after: [
    "Automatic attendance updates in seconds",
    "Instant alerts when students need attention",
    "Auto-graded tests with analytics reports",
    "Gamification that drives real engagement",
  ],
};

const steps = [
  {
    icon: Upload,
    title: "Add Your Students",
    description: "Import your student list via CSV or connect your existing student database. Takes less than 5 minutes.",
  },
  {
    icon: ClipboardCheck,
    title: "Batch Marking",
    description: "Easily mark entire classes as present and adjust exceptions with a single click.",
  },
  {
    icon: BarChart3,
    title: "Get Instant Insights",
    description: "Your dashboard updates in real-time. Get alerts, weekly reports, and AI-generated risk flags automatically.",
  },
];

const differentiators = [
  {
    icon: Brain,
    title: "Advanced Student Insights",
    text: "Deep learning path analysis that shows exactly where each student excels or struggles.",
  },
  {
    icon: Trophy,
    title: "Gamification That Actually Works",
    text: "Our leaderboard and badge system has proven to increase attendance rates by up to 20% within the first month.",
  },
  {
    icon: Users,
    title: "One Platform, Every Role",
    text: "Separate dashboards for admins, faculty, and students — each showing exactly what they need.",
  },
];

const integrationsList = [
  "Google Classroom", "Zoom", "Moodle", "Microsoft Teams", "WhatsApp Alerts", "Google Sheets Export"
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
    quote: "SmartCampus AI transformed how we manage attendance. The automated workflows saved us 15 hours per week.",
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
      "Bulk Attendance Tools",
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

const Counter = ({ value }: { value: number }) => {
  const [count, setCount] = React.useState(0);
  const nodeRef = React.useRef(null);
  const isInView = useInView(nodeRef, { once: true });

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={nodeRef}>{count % 1 === 0 ? count.toLocaleString() : count.toFixed(1)}</span>;
};

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && user && profile) {
      const dest = profile.role === "admin" || profile.role === "teacher" ? "/admin" : "/student";
      router.push(dest);
    }
  }, [user, profile, loading, router]);
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
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#features" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--text-secondary)" }}>
              Features
            </a>
            <a href="#preview" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--text-secondary)" }}>
              Dashboards
            </a>
            <a href="#features" className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "var(--text-secondary)" }}>
              AI Tracking
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
              className="flex flex-col items-center gap-8"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/teacher"
                  className="btn-primary px-8 py-3 text-base flex items-center gap-2"
                >
                  Teacher
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/student"
                  className="btn-secondary px-8 py-3 text-base flex items-center gap-2"
                >
                  Student
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Proof Bullets */}
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  "No manual attendance — ever",
                  "Real-time performance tracking",
                  "Works with your existing classrooms",
                ].map((bullet, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {bullet}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-4xl mx-auto mt-20 p-6 rounded-2xl border flex flex-wrap justify-around gap-8"
            style={{ 
              background: "var(--bg-glass)", 
              borderColor: "var(--border-color)",
              backdropFilter: "blur(20px)"
            }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-tertiary)" }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problems We Solve Section */}
      <section className="py-24 relative overflow-hidden" style={{ background: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] mb-4">
               <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
               <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Problem & Solution</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
              Sound familiar?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              How SmartCampus transforms the traditional classroom experience.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch relative">
            {/* Before SmartCampus */}
            <motion.div
              {...stagger}
              className="relative group h-full"
            >
              <div className="h-full glass-card p-10 border-slate-500/10 relative z-10 hover:border-slate-500/20 transition-colors flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-slate-400">Traditional Waste</h3>
                    <p className="text-xs uppercase tracking-widest font-bold opacity-50">Before SmartCampus</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-500/10 flex items-center justify-center text-slate-400">
                    <XCircle className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="space-y-6 flex-grow">
                  {problems.before.map((problem, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-5 h-5 rounded-full bg-slate-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <XCircle className="w-3 h-3 text-slate-400" />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {problem}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* After SmartCampus */}
            <motion.div
              {...stagger}
              className="relative group h-full"
            >
              <div className="h-full glass-card p-10 border-indigo-500/10 relative z-10 hover:border-indigo-500/20 transition-colors flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-indigo-500">Smart Efficiency</h3>
                    <p className="text-xs uppercase tracking-widest font-bold opacity-50">After SmartCampus</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="space-y-6 flex-grow">
                  {problems.after.map((solution, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {solution}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 pt-8 border-t border-[var(--border-color)]">
                   <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 bg-indigo-500/5 px-4 py-2 rounded-xl w-fit">
                      <Zap className="w-3 h-3" />
                      Saves average 15+ hours/week for faculty
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How SmartCampus Works Section */}
      <section className="py-24" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label">How it works</span>
            <h2 className="text-4xl font-bold mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
              Up and running in minutes
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection lines (desktop only) */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px border-t border-dashed" style={{ borderColor: "var(--border-color)" }} />
            
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  {...stagger}
                  transition={{ delay: i * 0.2 }}
                  className="text-center relative z-10"
                >
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110"
                    style={{ background: "var(--gradient-primary)", boxShadow: "0 8px 16px rgba(59,130,246,0.2)" }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
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

      {/* Live Preview Section */}
      <section id="preview" className="py-24" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label">Live Preview</span>
            <h2 className="text-4xl font-bold mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
              See it in action
            </h2>
          </motion.div>

          {/* Live Admin Dashboard Label */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="pulse-dot" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Live Admin Dashboard</span>
            </div>
          </div>

          <motion.div
            {...fadeUp}
            className="glass-card p-1 max-w-5xl mx-auto overflow-hidden"
          >
            <div
              className="rounded-xl p-8 relative overflow-hidden"
              style={{ background: "var(--bg-card)", minHeight: 400 }}
            >
              {/* Mock dashboard preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Students", value: 1247, prefix: "", suffix: "", color: "#3b82f6" },
                  { label: "Attendance Today", value: 94.2, prefix: "", suffix: "%", color: "#10b981", live: true },
                  { label: "Active Tests", value: 3, prefix: "", suffix: "", color: "#8b5cf6" },
                  { label: "Average Score", value: 82, prefix: "", suffix: "%", color: "#f59e0b" },
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
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {item.label}
                      </p>
                      {item.live && <span className="pulse-dot" />}
                    </div>
                    <div className="text-xl font-bold flex items-baseline gap-0.5" style={{ color: "var(--text-primary)" }}>
                      <span>{item.prefix}</span>
                      <Counter value={item.value} />
                      <span className="text-sm font-medium">{item.suffix}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="rounded-xl p-6 h-64 md:h-52 border"
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
                        transition={{ delay: 0.5 + i * 0.08, duration: 0.8, ease: "easeOut" }}
                        className="flex-1 rounded-t-md relative group"
                        style={{ background: i === 6 ? "#3b82f6" : "rgba(59,130,246,0.2)" }}
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--bg-card)] text-[8px] font-bold py-1 px-1.5 rounded border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                           {h}%
                         </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div
                  className="rounded-xl p-6 h-64 md:h-52 border"
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

      {/* Why SmartCampus Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label">Why SmartCampus</span>
            <h2 className="text-4xl font-bold mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
              Built differently. For educators.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {differentiators.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  {...stagger}
                  transition={{ delay: i * 0.1 }}
                  className="card p-8 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="section-label">Integrations</span>
            <h2 className="text-4xl font-bold mt-3 mb-4" style={{ color: "var(--text-primary)" }}>
              Plays well with your existing tools
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto mb-8">
            {integrationsList.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-2.5 rounded-full border bg-[var(--bg-card)] text-sm font-medium shadow-sm"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
              >
                {tool}
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
            More integrations coming soon. <Link href="#" className="gradient-text font-bold">Request yours →</Link>
          </p>
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

          <div className="grid md:grid-cols-3 gap-6 mb-16">
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

          {/* Trust Stats Row */}
          <motion.div
            {...fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-b"
            style={{ borderColor: "var(--border-color)" }}
          >
            {[
              { value: 50000, suffix: "+", label: "Students" },
              { value: 2000, suffix: "+", label: "Institutions" },
              { value: 15, suffix: " hrs", label: "Saved/week" },
              { value: 99.9, suffix: "%", label: "Uptime" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold mb-1 flex items-baseline justify-center gap-0.5" style={{ color: "var(--text-primary)" }}>
                  <Counter value={stat.value} />
                  <span className="text-xl">{stat.suffix}</span>
                </div>
                <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--text-tertiary)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
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
            style={{ background: "var(--bg-glass)" }}
          >
            <div className="floating-orb w-48 h-48 bg-blue-500 -top-24 -left-24" />
            <div className="floating-orb w-48 h-48 bg-purple-500 -bottom-24 -right-24" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                Your students are waiting. Are you?
              </h2>
              <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                Join 2,000+ institutions already saving time with SmartCampus.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/admin" className="btn-primary px-8 py-3 text-base flex items-center gap-2">
                  Start Free — No Credit Card Needed
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#" className="btn-secondary px-8 py-3 text-base flex items-center gap-2">
                  Talk to Sales
                  <ChevronRight className="w-4 h-4" />
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
