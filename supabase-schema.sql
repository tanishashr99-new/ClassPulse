-- =============================================
-- SmartCampus AI — Complete Database Schema
-- Run this entire file in Supabase SQL Editor
-- =============================================

-- ──────────────────────────────────────────────
-- 1. PROFILES (extends Supabase auth.users)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  avatar_url TEXT,
  department TEXT,
  student_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────
-- 2. CLASSES
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  schedule TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────
-- 3. ENROLLMENTS (student ↔ class)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, class_id)
);

-- ──────────────────────────────────────────────
-- 4. ATTENDANCE
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  marked_by UUID REFERENCES profiles(id),
  method TEXT DEFAULT 'manual' CHECK (method IN ('manual', 'ai')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, class_id, date)
);

-- ──────────────────────────────────────────────
-- 5. ASSIGNMENTS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  due_date DATE NOT NULL,
  total_marks INTEGER DEFAULT 100,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'overdue', 'completed')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────
-- 6. SUBMISSIONS (student assignment submissions)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  marks INTEGER,
  grade TEXT,
  file_url TEXT,
  UNIQUE(assignment_id, student_id)
);

-- ──────────────────────────────────────────────
-- 7. TESTS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 60,
  total_marks INTEGER DEFAULT 100,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────
-- 8. TEST QUESTIONS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_option INTEGER NOT NULL DEFAULT 0,
  marks INTEGER DEFAULT 1,
  order_num INTEGER DEFAULT 0
);

-- ──────────────────────────────────────────────
-- 9. TEST RESPONSES (student answers)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  answers JSONB DEFAULT '{}',
  score INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(test_id, student_id)
);

-- ──────────────────────────────────────────────
-- 10. BADGES
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  category TEXT NOT NULL DEFAULT 'general',
  criteria TEXT
);

-- ──────────────────────────────────────────────
-- 11. STUDENT BADGES (earned badges)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, badge_id)
);

-- ──────────────────────────────────────────────
-- 12. NOTIFICATIONS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'alert')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────
-- 13. AI INSIGHTS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  insight TEXT NOT NULL,
  metric TEXT NOT NULL,
  type TEXT DEFAULT 'positive' CHECK (type IN ('positive', 'warning', 'negative')),
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────
-- 14. LEADERBOARD
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  badges_count INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  rank_change TEXT DEFAULT 'same' CHECK (rank_change IN ('up', 'down', 'same')),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════
-- INDEXES for performance
-- ══════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_class ON attendance(class_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class ON enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_test_questions_test ON test_questions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_responses_test ON test_responses(test_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);

-- ══════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow all reads for authenticated users (demo-friendly policies)
CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can read classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Anyone can read enrollments" ON enrollments FOR SELECT USING (true);
CREATE POLICY "Anyone can read attendance" ON attendance FOR SELECT USING (true);
CREATE POLICY "Anyone can read assignments" ON assignments FOR SELECT USING (true);
CREATE POLICY "Anyone can read submissions" ON submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can read tests" ON tests FOR SELECT USING (true);
CREATE POLICY "Anyone can read test_questions" ON test_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can read test_responses" ON test_responses FOR SELECT USING (true);
CREATE POLICY "Anyone can read badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Anyone can read student_badges" ON student_badges FOR SELECT USING (true);
CREATE POLICY "Anyone can read notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Anyone can read ai_insights" ON ai_insights FOR SELECT USING (true);
CREATE POLICY "Anyone can read leaderboard" ON leaderboard FOR SELECT USING (true);

-- Allow inserts/updates for authenticated users
CREATE POLICY "Auth users can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update profiles" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Auth users can insert classes" ON classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update classes" ON classes FOR UPDATE USING (true);
CREATE POLICY "Auth users can insert enrollments" ON enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can insert attendance" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update attendance" ON attendance FOR UPDATE USING (true);
CREATE POLICY "Auth users can insert assignments" ON assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update assignments" ON assignments FOR UPDATE USING (true);
CREATE POLICY "Auth users can insert submissions" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can insert tests" ON tests FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update tests" ON tests FOR UPDATE USING (true);
CREATE POLICY "Auth users can insert test_questions" ON test_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can insert test_responses" ON test_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can insert student_badges" ON student_badges FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update notifications" ON notifications FOR UPDATE USING (true);
CREATE POLICY "Auth users can insert ai_insights" ON ai_insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can insert leaderboard" ON leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update leaderboard" ON leaderboard FOR UPDATE USING (true);

-- ══════════════════════════════════════════════
-- SEED DATA — Populated so the app works immediately
-- ══════════════════════════════════════════════

-- ── Teacher Profile ──
INSERT INTO profiles (id, email, full_name, role, department) VALUES
  ('00000000-0000-0000-0000-000000000001', 'prof.verma@campus.edu', 'Prof. Rakesh Verma', 'admin', 'Computer Science');

-- ── Student Profiles ──
INSERT INTO profiles (id, email, full_name, role, student_id) VALUES
  ('00000000-0000-0000-0000-000000000010', 'aarav@campus.edu',  'Aarav Sharma',  'student', 'CS2024001'),
  ('00000000-0000-0000-0000-000000000011', 'priya@campus.edu',  'Priya Patel',   'student', 'CS2024002'),
  ('00000000-0000-0000-0000-000000000012', 'rahul@campus.edu',  'Rahul Kumar',   'student', 'CS2024003'),
  ('00000000-0000-0000-0000-000000000013', 'sneha@campus.edu',  'Sneha Gupta',   'student', 'CS2024004'),
  ('00000000-0000-0000-0000-000000000014', 'arjun@campus.edu',  'Arjun Singh',   'student', 'CS2024005'),
  ('00000000-0000-0000-0000-000000000015', 'meera@campus.edu',  'Meera Reddy',   'student', 'CS2024006'),
  ('00000000-0000-0000-0000-000000000016', 'vikram@campus.edu', 'Vikram Joshi',  'student', 'CS2024007'),
  ('00000000-0000-0000-0000-000000000017', 'ananya@campus.edu', 'Ananya Iyer',   'student', 'CS2024008');

-- ── Classes ──
INSERT INTO classes (id, code, name, description, schedule, color, teacher_id) VALUES
  ('00000000-0000-0000-0000-000000000100', 'CS301', 'Data Structures & Algorithms', 'Fundamental data structures and algorithm design', 'Mon, Wed, Fri 9:00 AM', '#3b82f6', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000101', 'CS401', 'Machine Learning',             'Introduction to ML concepts and neural networks',  'Tue, Thu 10:30 AM',     '#8b5cf6', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000102', 'CS302', 'Database Systems',              'Relational databases, SQL, and NoSQL',             'Mon, Wed 2:00 PM',      '#10b981', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000103', 'CS303', 'Web Development',               'Full-stack web development with modern frameworks','Tue, Thu 3:30 PM',      '#f59e0b', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000104', 'CS501', 'Artificial Intelligence',       'AI fundamentals, search, and knowledge systems',   'Fri 11:00 AM',          '#ef4444', '00000000-0000-0000-0000-000000000001');

-- ── Enrollments (all students enrolled in first 4 classes) ──
INSERT INTO enrollments (student_id, class_id) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000100'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000103'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000100'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000100'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000103'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000100'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000103'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000100'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000100'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000103'),
  ('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000100'),
  ('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000102'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000100'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000101'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000103');

-- ── Attendance Records (past 2 weeks, DSA class) ──
INSERT INTO attendance (student_id, class_id, date, status, method) VALUES
  -- March 10 (Mon)
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000100', '2026-03-10', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000100', '2026-03-10', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000100', '2026-03-10', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000100', '2026-03-10', 'late',    'manual'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000100', '2026-03-10', 'absent',  'manual'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000100', '2026-03-10', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000100', '2026-03-10', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000100', '2026-03-10', 'present', 'manual'),
  -- March 12 (Wed)
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000100', '2026-03-12', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000100', '2026-03-12', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000100', '2026-03-12', 'absent',  'manual'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000100', '2026-03-12', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000100', '2026-03-12', 'absent',  'manual'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000100', '2026-03-12', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000100', '2026-03-12', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000100', '2026-03-12', 'late',    'manual'),
  -- March 14 (Fri)
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000100', '2026-03-14', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000100', '2026-03-14', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000100', '2026-03-14', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000100', '2026-03-14', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000100', '2026-03-14', 'late',    'ai'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000100', '2026-03-14', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000100', '2026-03-14', 'absent',  'ai'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000100', '2026-03-14', 'present', 'ai'),
  -- March 17 (Mon)
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000100', '2026-03-17', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000100', '2026-03-17', 'late',    'manual'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000100', '2026-03-17', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000100', '2026-03-17', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000100', '2026-03-17', 'absent',  'manual'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000100', '2026-03-17', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000100', '2026-03-17', 'present', 'manual'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000100', '2026-03-17', 'present', 'manual'),
  -- March 19 (Wed)
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000100', '2026-03-19', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000100', '2026-03-19', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000100', '2026-03-19', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000100', '2026-03-19', 'absent',  'ai'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000100', '2026-03-19', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000100', '2026-03-19', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000016', '00000000-0000-0000-0000-000000000100', '2026-03-19', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000100', '2026-03-19', 'late',    'ai'),
  -- March 21 (Fri — today)
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000100', '2026-03-21', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000100', '2026-03-21', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000100', '2026-03-21', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000100', '2026-03-21', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000100', '2026-03-21', 'present', 'ai'),
  ('00000000-0000-0000-0000-000000000017', '00000000-0000-0000-0000-000000000100', '2026-03-21', 'late',    'ai');

-- ── Assignments ──
INSERT INTO assignments (id, title, description, class_id, subject, due_date, total_marks, status, created_by) VALUES
  ('00000000-0000-0000-0000-000000000200', 'Binary Search Tree Implementation', 'Implement BST with insert, delete, and search operations', '00000000-0000-0000-0000-000000000100', 'DSA',  '2026-03-25', 100, 'active',    '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000201', 'Neural Network from Scratch',       'Build a 3-layer neural network using NumPy only',         '00000000-0000-0000-0000-000000000101', 'ML',   '2026-03-22', 100, 'overdue',   '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000202', 'SQL Query Optimization',            'Optimize the provided set of 10 slow queries',            '00000000-0000-0000-0000-000000000102', 'DBMS', '2026-03-28', 80,  'active',    '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000203', 'React Portfolio Website',           'Build a responsive portfolio using React and Tailwind',    '00000000-0000-0000-0000-000000000103', 'Web',  '2026-03-15', 100, 'completed', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000204', 'Graph Algorithms Worksheet',        'Implement BFS, DFS, Dijkstra, and Kruskal algorithms',    '00000000-0000-0000-0000-000000000100', 'DSA',  '2026-03-30', 80,  'pending',   '00000000-0000-0000-0000-000000000001');

-- ── Submissions ──
INSERT INTO submissions (assignment_id, student_id, marks, grade) VALUES
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000010', 92, 'A'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000011', 88, 'A'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000012', 75, 'B'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000013', 95, 'A+'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000015', 90, 'A'),
  ('00000000-0000-0000-0000-000000000200', '00000000-0000-0000-0000-000000000010', NULL, NULL),
  ('00000000-0000-0000-0000-000000000200', '00000000-0000-0000-0000-000000000013', NULL, NULL),
  ('00000000-0000-0000-0000-000000000200', '00000000-0000-0000-0000-000000000015', NULL, NULL);

-- ── Tests ──
INSERT INTO tests (id, title, subject, class_id, date, duration, total_marks, status, created_by) VALUES
  ('00000000-0000-0000-0000-000000000300', 'DSA Mid-Term Quiz',     'Data Structures & Algorithms', '00000000-0000-0000-0000-000000000100', '2026-03-10', 45,  50,  'completed', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000301', 'ML Fundamentals Test',  'Machine Learning',             '00000000-0000-0000-0000-000000000101', '2026-03-18', 60,  100, 'completed', '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000302', 'SQL Mastery Quiz',      'Database Systems',              '00000000-0000-0000-0000-000000000102', '2026-03-25', 30,  40,  'upcoming',  '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000303', 'React & Next.js Assessment', 'Web Development',          '00000000-0000-0000-0000-000000000103', '2026-03-28', 60,  100, 'upcoming',  '00000000-0000-0000-0000-000000000001');

-- ── Test Questions (DSA Mid-Term) ──
INSERT INTO test_questions (test_id, question, options, correct_option, marks, order_num) VALUES
  ('00000000-0000-0000-0000-000000000300', 'What is the time complexity of binary search?',
   '["O(n)", "O(log n)", "O(n²)", "O(1)"]', 1, 10, 1),
  ('00000000-0000-0000-0000-000000000300', 'Which data structure uses LIFO principle?',
   '["Queue", "Stack", "Array", "Linked List"]', 1, 10, 2),
  ('00000000-0000-0000-0000-000000000300', 'What is the worst-case time complexity of quicksort?',
   '["O(n log n)", "O(n)", "O(n²)", "O(log n)"]', 2, 10, 3),
  ('00000000-0000-0000-0000-000000000300', 'Which traversal visits the root node first?',
   '["Inorder", "Preorder", "Postorder", "Level order"]', 1, 10, 4),
  ('00000000-0000-0000-0000-000000000300', 'DFS internally uses which data structure?',
   '["Queue", "Stack", "Heap", "Hash Table"]', 1, 10, 5);

-- ── Test Questions (SQL Quiz) ──
INSERT INTO test_questions (test_id, question, options, correct_option, marks, order_num) VALUES
  ('00000000-0000-0000-0000-000000000302', 'Which SQL clause is used to filter groups?',
   '["WHERE", "HAVING", "GROUP BY", "ORDER BY"]', 1, 10, 1),
  ('00000000-0000-0000-0000-000000000302', 'What type of JOIN returns all rows from both tables?',
   '["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "CROSS JOIN"]', 2, 10, 2),
  ('00000000-0000-0000-0000-000000000302', 'Which normal form eliminates transitive dependency?',
   '["1NF", "2NF", "3NF", "BCNF"]', 2, 10, 3),
  ('00000000-0000-0000-0000-000000000302', 'What does ACID stand for in databases?',
   '["Atomicity, Consistency, Isolation, Durability", "Access, Control, Integrity, Data", "Atomicity, Control, Isolation, Data", "Access, Consistency, Integrity, Durability"]', 0, 10, 4);

-- ── Test Responses (DSA Mid-Term scores) ──
INSERT INTO test_responses (test_id, student_id, answers, score) VALUES
  ('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000010', '{"0":1,"1":1,"2":2,"3":1,"4":1}', 50),
  ('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000011', '{"0":1,"1":1,"2":0,"3":1,"4":1}', 40),
  ('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000012', '{"0":0,"1":1,"2":2,"3":0,"4":1}', 30),
  ('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000013', '{"0":1,"1":1,"2":2,"3":1,"4":0}', 40),
  ('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000014', '{"0":0,"1":0,"2":0,"3":1,"4":1}', 20),
  ('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000015', '{"0":1,"1":1,"2":2,"3":1,"4":1}', 50),
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000010', '{}', 82),
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000011', '{}', 91),
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000013', '{}', 78),
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000015', '{}', 95);

-- ── Badges ──
INSERT INTO badges (id, name, description, icon, category) VALUES
  ('00000000-0000-0000-0000-000000000400', 'Perfect Week',     '100% attendance for a full week',     '🎯', 'attendance'),
  ('00000000-0000-0000-0000-000000000401', 'Early Bird',       'Arrived on time every day this month','🌅', 'attendance'),
  ('00000000-0000-0000-0000-000000000402', 'Quiz Master',      'Score 90%+ on 3 consecutive tests',   '🧠', 'performance'),
  ('00000000-0000-0000-0000-000000000403', 'Rising Star',      'Improved grade by 2 levels',          '⭐', 'performance'),
  ('00000000-0000-0000-0000-000000000404', 'Team Player',      'Helped 5 classmates this semester',   '🤝', 'milestones'),
  ('00000000-0000-0000-0000-000000000405', 'Code Warrior',     'Completed all coding assignments',    '⚔️', 'milestones');

-- ── Student Badges (earned) ──
INSERT INTO student_badges (student_id, badge_id) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000400'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000402'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000404'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000400'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000401'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000402'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000403'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000404'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000405'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000400'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000401'),
  ('00000000-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000402');

-- ── Notifications ──
INSERT INTO notifications (user_id, title, message, type, read) VALUES
  ('00000000-0000-0000-0000-000000000001', 'New Enrollment',        'Ananya Iyer has enrolled in Web Development',       'info',    false),
  ('00000000-0000-0000-0000-000000000001', 'Assignment Submitted',  'Aarav Sharma submitted BST Implementation',         'success', false),
  ('00000000-0000-0000-0000-000000000001', 'Low Attendance Alert',  'Arjun Singh attendance dropped below 75%',          'warning', false),
  ('00000000-0000-0000-0000-000000000001', 'Test Completed',        'DSA Mid-Term Quiz has been completed by all',       'success', true),
  ('00000000-0000-0000-0000-000000000010', 'Assignment Due Soon',   'BST Implementation is due in 4 days',              'warning', false),
  ('00000000-0000-0000-0000-000000000010', 'Badge Earned!',         'You earned the Quiz Master badge!',                'success', false),
  ('00000000-0000-0000-0000-000000000010', 'New Test Scheduled',    'SQL Mastery Quiz scheduled for March 25',          'info',    true);

-- ── AI Insights ──
INSERT INTO ai_insights (title, insight, metric, type, class_id) VALUES
  ('Attendance Improvement',     'Overall attendance improved by 12% this month. DSA class shows the highest improvement. Consider continuing the gamification approach.', '+12%', 'positive', '00000000-0000-0000-0000-000000000100'),
  ('Consistent High Performers', '4 students maintain 90%+ attendance and above-average test scores. Consider nominating them for the Dean''s list.', '4 students', 'positive', NULL),
  ('At-Risk Student Detected',   'Arjun Singh has missed 5 out of last 10 classes and scores are declining. Recommend intervention meeting.', '50% drop', 'negative', '00000000-0000-0000-0000-000000000100'),
  ('Test Difficulty Variance',   'ML Fundamentals Test had high score variance (σ=18). Some students found it too easy while others struggled. Review difficulty balance.', 'σ=18', 'warning', '00000000-0000-0000-0000-000000000101'),
  ('Assignment Completion Rate',  'React Portfolio assignment had 62% completion — lowest this semester. Consider extending deadlines for similar projects.', '62%', 'warning', '00000000-0000-0000-0000-000000000103'),
  ('Engagement Up After Badges', 'Student engagement increased 23% after introducing the badge system. Quiz participation up by 35%.', '+23%', 'positive', NULL);

-- ── Leaderboard ──
INSERT INTO leaderboard (student_id, score, badges_count, streak, rank_change) VALUES
  ('00000000-0000-0000-0000-000000000015', 980, 3, 15, 'up'),
  ('00000000-0000-0000-0000-000000000013', 965, 4, 18, 'up'),
  ('00000000-0000-0000-0000-000000000010', 920, 3, 12, 'same'),
  ('00000000-0000-0000-0000-000000000011', 890, 2, 10, 'down'),
  ('00000000-0000-0000-0000-000000000017', 845, 0, 8,  'up'),
  ('00000000-0000-0000-0000-000000000012', 780, 0, 5,  'same'),
  ('00000000-0000-0000-0000-000000000016', 720, 0, 3,  'down'),
  ('00000000-0000-0000-0000-000000000014', 580, 0, 1,  'down');

-- ══════════════════════════════════════════════
-- VIEWS FOR DASHBOARD STATS
-- ══════════════════════════════════════════════

-- Today's attendance rate
CREATE OR REPLACE VIEW today_attendance_summary AS
SELECT
  COUNT(*) FILTER (WHERE status = 'present') AS present_count,
  COUNT(*) FILTER (WHERE status = 'late') AS late_count,
  COUNT(*) FILTER (WHERE status = 'absent') AS absent_count,
  COUNT(*) AS total,
  ROUND(COUNT(*) FILTER (WHERE status = 'present') * 100.0 / NULLIF(COUNT(*), 0), 1) AS attendance_rate
FROM attendance
WHERE date = CURRENT_DATE;

-- Weekly attendance breakdown for charts
CREATE OR REPLACE VIEW weekly_attendance AS
SELECT
  TO_CHAR(date, 'Dy') AS day_name,
  date,
  COUNT(*) FILTER (WHERE status = 'present') AS present,
  COUNT(*) FILTER (WHERE status = 'late') AS late,
  COUNT(*) FILTER (WHERE status = 'absent') AS absent
FROM attendance
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY date
ORDER BY date;

-- Student performance summary
CREATE OR REPLACE VIEW student_performance AS
SELECT
  p.id AS student_id,
  p.full_name,
  ROUND(AVG(tr.score)::numeric, 1) AS avg_score,
  COUNT(DISTINCT sb.badge_id) AS badges_earned,
  l.score AS leaderboard_score,
  l.streak,
  RANK() OVER (ORDER BY l.score DESC) AS rank
FROM profiles p
LEFT JOIN test_responses tr ON tr.student_id = p.id
LEFT JOIN student_badges sb ON sb.student_id = p.id
LEFT JOIN leaderboard l ON l.student_id = p.id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, l.score, l.streak;

SELECT 'SmartCampus AI schema created successfully! 🎉' AS result;
