import { supabase } from "./supabase";
import type {
  Profile, Class, Attendance, Assignment, Submission,
  Test, TestQuestion, TestResponse, Badge, StudentBadge,
  Notification, AIInsight, LeaderboardEntry,
} from "./supabase";

// ── PROFILES ──
export async function getStudents() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("full_name");
  if (error) throw error;
  return data as Profile[];
}

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Profile;
}

// ── CLASSES ──
export async function getClasses() {
  const { data, error } = await supabase
    .from("classes")
    .select("*, teacher:profiles!teacher_id(full_name, email)")
    .order("code");
  if (error) throw error;
  return data as (Class & { teacher: { full_name: string; email: string } })[];
}

export async function getClassStudentCounts() {
  const { data, error } = await supabase
    .from("enrollments")
    .select("class_id");
  if (error) throw error;
  const counts: Record<string, number> = {};
  data.forEach((e: { class_id: string }) => {
    counts[e.class_id] = (counts[e.class_id] || 0) + 1;
  });
  return counts;
}

// ── ENROLLMENTS ──
export async function getEnrollmentsByClass(classId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, student:profiles!student_id(*)")
    .eq("class_id", classId);
  if (error) throw error;
  return data;
}

export async function getEnrollmentsByStudent(studentId: string) {
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, class:classes!class_id(*)")
    .eq("student_id", studentId);
  if (error) throw error;
  return data;
}

// ── ATTENDANCE ──
export async function getAttendanceByDate(classId: string, date: string) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, student:profiles!student_id(id, full_name, email, avatar_url)")
    .eq("class_id", classId)
    .eq("date", date);
  if (error) throw error;
  return data;
}

export async function getAttendanceSummary() {
  const { data, error } = await supabase
    .from("attendance")
    .select("date, status");
  if (error) throw error;

  // Group by date for chart data
  const byDate: Record<string, { present: number; late: number; absent: number }> = {};
  data.forEach((r: { date: string; status: string }) => {
    if (!byDate[r.date]) byDate[r.date] = { present: 0, late: 0, absent: 0 };
    byDate[r.date][r.status as "present" | "late" | "absent"]++;
  });
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return Object.entries(byDate)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-7)
    .map(([date, counts]) => ({
      day: dayNames[new Date(date).getDay()],
      date,
      ...counts,
    }));
}

export async function getTodayAttendanceRate() {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("attendance")
    .select("status")
    .eq("date", today);
  if (error) return { rate: 0, present: 0, late: 0, absent: 0, total: 0 };
  const total = data.length;
  const present = data.filter((r: { status: string }) => r.status === "present").length;
  const late = data.filter((r: { status: string }) => r.status === "late").length;
  const absent = data.filter((r: { status: string }) => r.status === "absent").length;
  return { rate: total > 0 ? Math.round((present / total) * 1000) / 10 : 0, present, late, absent, total };
}

export async function markAttendance(studentId: string, classId: string, date: string, status: string, method: string = "manual") {
  const { data, error } = await supabase
    .from("attendance")
    .upsert(
      { student_id: studentId, class_id: classId, date, status, method },
      { onConflict: "student_id,class_id,date" }
    )
    .select();
  if (error) throw error;
  return data;
}

export async function getStudentAttendance(studentId: string) {
  const { data, error } = await supabase
    .from("attendance")
    .select("date, status, class:classes!class_id(name)")
    .eq("student_id", studentId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

// ── ASSIGNMENTS ──
export async function getAssignments() {
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .order("due_date");
  if (error) throw error;
  return data as Assignment[];
}

export async function getAssignmentSubmissionCounts() {
  const { data, error } = await supabase
    .from("submissions")
    .select("assignment_id");
  if (error) throw error;
  const counts: Record<string, number> = {};
  data.forEach((s: { assignment_id: string }) => {
    counts[s.assignment_id] = (counts[s.assignment_id] || 0) + 1;
  });
  return counts;
}

export async function createAssignment(assignment: Partial<Assignment>) {
  const { data, error } = await supabase
    .from("assignments")
    .insert(assignment)
    .select();
  if (error) throw error;
  return data;
}

// ── TESTS ──
export async function getTests() {
  const { data, error } = await supabase
    .from("tests")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data as Test[];
}

export async function getTestQuestions(testId: string) {
  const { data, error } = await supabase
    .from("test_questions")
    .select("*")
    .eq("test_id", testId)
    .order("order_num");
  if (error) throw error;
  return data as TestQuestion[];
}

export async function getTestAvgScores() {
  const { data, error } = await supabase
    .from("test_responses")
    .select("test_id, score");
  if (error) throw error;
  
  const scores: Record<string, { total: number; count: number }> = {};
  data.forEach((r: { test_id: string; score: number }) => {
    if (!scores[r.test_id]) scores[r.test_id] = { total: 0, count: 0 };
    scores[r.test_id].total += r.score;
    scores[r.test_id].count++;
  });

  const result: Record<string, number> = {};
  Object.entries(scores).forEach(([id, { total, count }]) => {
    result[id] = Math.round(total / count);
  });
  return result;
}

export async function getTestQuestionCount() {
  const { data, error } = await supabase
    .from("test_questions")
    .select("test_id");
  if (error) throw error;
  const counts: Record<string, number> = {};
  data.forEach((q: { test_id: string }) => {
    counts[q.test_id] = (counts[q.test_id] || 0) + 1;
  });
  return counts;
}

export async function submitTestResponse(testId: string, studentId: string, answers: Record<string, number>, score: number) {
  const { data, error } = await supabase
    .from("test_responses")
    .upsert(
      { test_id: testId, student_id: studentId, answers, score },
      { onConflict: "test_id,student_id" }
    )
    .select();
  if (error) throw error;
  return data;
}

// ── BADGES ──
export async function getBadges() {
  const { data, error } = await supabase
    .from("badges")
    .select("*")
    .order("category");
  if (error) throw error;
  return data as Badge[];
}

export async function getStudentBadges(studentId: string) {
  const { data, error } = await supabase
    .from("student_badges")
    .select("*, badge:badges!badge_id(*)")
    .eq("student_id", studentId);
  if (error) throw error;
  return data;
}

// ── NOTIFICATIONS ──
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw error;
  return data as Notification[];
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);
  if (error) throw error;
}

// ── AI INSIGHTS ──
export async function getAIInsights() {
  const { data, error } = await supabase
    .from("ai_insights")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as AIInsight[];
}

// ── LEADERBOARD ──
export async function getLeaderboard() {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*, student:profiles!student_id(id, full_name, email, avatar_url)")
    .order("score", { ascending: false });
  if (error) throw error;
  return data;
}

// ── DASHBOARD STATS ──
export async function getDashboardStats() {
  const [students, classes, todayAttendance] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact" }).eq("role", "student"),
    supabase.from("classes").select("id", { count: "exact" }),
    getTodayAttendanceRate(),
  ]);

  // Get avg test score
  const { data: testScores } = await supabase.from("test_responses").select("score");
  const avgPerformance = testScores && testScores.length > 0
    ? Math.round(testScores.reduce((sum: number, r: { score: number }) => sum + r.score, 0) / testScores.length)
    : 0;

  return {
    totalStudents: students.count || 0,
    totalClasses: classes.count || 0,
    todayAttendance: todayAttendance.rate,
    avgPerformance,
  };
}
