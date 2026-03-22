-- =============================================
-- SmartCampus AI — Complete Database Schema
-- Run this entire file in Supabase SQL Editor
-- =============================================

-- ──────────────────────────────────────────────
-- 1. PROFILES (standalone user table for demo)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
-- All tables are created empty — add data through the app UI
-- ══════════════════════════════════════════════

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

-- =========================================================
-- SEED 10 DUMMY TEACHERS
-- =========================================================
-- Creates T1 through T10 with passwords teacher1 through teacher10

DO $$ 
DECLARE
  v_uid uuid;
  i int;
  v_email text;
  v_pass text;
  v_name text;
BEGIN
  FOR i IN 1..10 LOOP
    v_email := 't' || i || '@smartcampus.edu';
    v_pass := 'teacher' || i;
    v_name := 'Teacher ' || i;
    v_uid := gen_random_uuid();
    
    -- Check if user exactly already exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
      
      -- 1. Insert into Supabase Auth primary table
      INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
        is_super_admin, is_sso_user
      ) VALUES (
        v_uid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', v_email, 
        crypt(v_pass, gen_salt('bf')), now(), now(), now(), 
        '{"provider":"email","providers":["email"]}'::jsonb, 
        jsonb_build_object('full_name', v_name, 'role', 'teacher'),
        false, false
      );

      -- 2. Insert into Auth Identities for password engine
      INSERT INTO auth.identities (
        id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), v_uid, v_uid::text, 
        jsonb_build_object('sub', v_uid, 'email', v_email, 'email_verified', true),
        'email', now(), now(), now()
      );

      -- 3. Insert into Public Profiles table securely mapped
      INSERT INTO public.profiles (
        id, email, full_name, role, department
      ) VALUES (
        v_uid, v_email, v_name, 'teacher', 'Computer Science'
      ) ON CONFLICT (email) DO NOTHING;

    END IF;
  END LOOP;
END $$;

SELECT '10 Dummy Teachers safely seeded!' AS result;
