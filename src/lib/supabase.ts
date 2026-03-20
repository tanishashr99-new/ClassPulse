import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Database Types ──
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "teacher" | "student";
  avatar_url: string | null;
  department: string | null;
  student_id: string | null;
  created_at: string;
}

export interface Class {
  id: string;
  code: string;
  name: string;
  description: string | null;
  schedule: string;
  color: string;
  teacher_id: string;
  created_at: string;
  teacher?: Profile;
  student_count?: number;
}

export interface Enrollment {
  id: string;
  student_id: string;
  class_id: string;
  enrolled_at: string;
  student?: Profile;
  class?: Class;
}

export interface Attendance {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: "present" | "absent" | "late";
  marked_by: string | null;
  method: "manual" | "ai";
  created_at: string;
  student?: Profile;
}

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  class_id: string;
  subject: string;
  due_date: string;
  total_marks: number;
  status: "active" | "pending" | "overdue" | "completed";
  created_by: string;
  created_at: string;
  class?: Class;
  submission_count?: number;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  submitted_at: string;
  marks: number | null;
  grade: string | null;
  file_url: string | null;
  student?: Profile;
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  class_id: string;
  date: string;
  duration: number;
  total_marks: number;
  status: "upcoming" | "completed";
  created_by: string;
  created_at: string;
  class?: Class;
  question_count?: number;
  avg_score?: number;
}

export interface TestQuestion {
  id: string;
  test_id: string;
  question: string;
  options: string[];
  correct_option: number;
  marks: number;
  order_num: number;
}

export interface TestResponse {
  id: string;
  test_id: string;
  student_id: string;
  answers: Record<string, number>;
  score: number;
  submitted_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  criteria: string | null;
}

export interface StudentBadge {
  id: string;
  student_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  read: boolean;
  created_at: string;
}

export interface AIInsight {
  id: string;
  title: string;
  insight: string;
  metric: string;
  type: "positive" | "warning" | "negative";
  class_id: string | null;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  student_id: string;
  score: number;
  badges_count: number;
  streak: number;
  rank_change: "up" | "down" | "same";
  updated_at: string;
  student?: Profile;
}
