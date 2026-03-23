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
-- 1.5 TEACHERS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  department TEXT,
  subject TEXT,
  phone TEXT,
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

-- ──────────────────────────────────────────────
-- 15. TIMETABLE
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  day TEXT NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────
-- 16. TEACHER EVENTS
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teacher_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('class', 'proctor', 'discussion', 'exam')),
  created_at TIMESTAMPTZ DEFAULT now()
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
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_events ENABLE ROW LEVEL SECURITY;

-- Allow all reads for authenticated users (demo-friendly policies)
CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Anyone can read teachers" ON teachers FOR SELECT USING (true);
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
CREATE POLICY "Anyone can read timetable" ON timetable FOR SELECT USING (true);
CREATE POLICY "Anyone can read teacher_events" ON teacher_events FOR SELECT USING (true);

-- Allow inserts/updates for authenticated users
CREATE POLICY "Auth users can insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update profiles" ON profiles FOR UPDATE USING (true);
CREATE POLICY "Auth users can insert teachers" ON teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update teachers" ON teachers FOR UPDATE USING (true);
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
CREATE POLICY "Auth users can insert timetable" ON timetable FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update timetable" ON timetable FOR UPDATE USING (true);
CREATE POLICY "Auth users can insert teacher_events" ON teacher_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth users can update teacher_events" ON teacher_events FOR UPDATE USING (true);

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
-- MIGRATE EXISTING TEACHERS FROM PROFILES
-- =========================================================
-- This will copy existing teachers from `profiles` into the new `teachers` table.
-- It generates 'T1', 'T2' etc. for the teacher_code and 'teacher1', 'teacher2' etc. for the password.
INSERT INTO teachers (id, user_id, teacher_code, full_name, email, password, department, subject, phone, created_at)
SELECT 
    id AS id, 
    id AS user_id, 
    'T' || ROW_NUMBER() OVER(ORDER BY created_at) AS teacher_code, 
    full_name, 
    email, 
    'teacher' || ROW_NUMBER() OVER(ORDER BY created_at) AS password, 
    department, 
    'General' AS subject,
    '000-000-0000' AS phone,
    created_at
FROM profiles
WHERE role = 'teacher'
ON CONFLICT (id) DO NOTHING;

SELECT 'Migration of existing teachers completed!' AS result;

-- =========================================================
-- 4. INSERT DUMMY TIMETABLE DATA FOR T1 TO T10
-- =========================================================
INSERT INTO timetable (teacher_id, class_name, subject, day, start_time, end_time, room_number)
SELECT t.id, d.class_name, d.subject, d.day, d.start_time::TIME, d.end_time::TIME, d.room_number
FROM teachers t
JOIN (
  VALUES 
    -- 👨‍🏫 TEACHER T1 (Computer Science)
    ('T1', 'CS 101 - Intro', 'Computer Science', 'Monday', '09:00:00', '10:00:00', 'Lab 1'),
    ('T1', 'CS 102 - Data Structures', 'Computer Science', 'Tuesday', '14:00:00', '15:00:00', 'Lab 2'),
    ('T1', 'CS 101 - Intro', 'Computer Science', 'Wednesday', '11:00:00', '12:00:00', 'Lab 1'),
    ('T1', 'CS Project Mentoring', 'Computer Science', 'Friday', '15:00:00', '16:00:00', 'Room 304'),
    
    -- 👨‍🏫 TEACHER T2 (Mathematics)
    ('T2', 'Math 101 - Calculus', 'Mathematics', 'Monday', '10:00:00', '11:00:00', 'Room 101'),
    ('T2', 'Math 102 - Algebra', 'Mathematics', 'Wednesday', '09:00:00', '10:00:00', 'Room 102'),
    ('T2', 'Statistics', 'Mathematics', 'Thursday', '11:00:00', '12:00:00', 'Room 105'),
    ('T2', 'Math 101 - Calculus', 'Mathematics', 'Friday', '14:00:00', '15:00:00', 'Room 101'),
    ('T2', 'Remedial Math', 'Mathematics', 'Saturday', '09:00:00', '10:00:00', 'Hall A'),

    -- 👨‍🏫 TEACHER T3 (Physics)
    ('T3', 'Physics 101', 'Physics', 'Tuesday', '09:00:00', '10:00:00', 'Room 201'),
    ('T3', 'Physics 101 Lab', 'Physics', 'Tuesday', '10:00:00', '11:00:00', 'Lab 3'),
    ('T3', 'Quantum Mechanics', 'Physics', 'Thursday', '14:00:00', '15:00:00', 'Room 201'),
    ('T3', 'Astrophysics Intro', 'Physics', 'Friday', '11:00:00', '12:00:00', 'Room 205'),

    -- 👨‍🏫 TEACHER T4 (Chemistry)
    ('T4', 'Organic Chem', 'Chemistry', 'Monday', '14:00:00', '15:00:00', 'Lab 4'),
    ('T4', 'Inorganic Chem', 'Chemistry', 'Wednesday', '10:00:00', '11:00:00', 'Room 301'),
    ('T4', 'Organic Chem Lab', 'Chemistry', 'Thursday', '09:00:00', '10:00:00', 'Lab 4'),
    ('T4', 'Chem Thesis Prep', 'Chemistry', 'Saturday', '11:00:00', '12:00:00', 'Hall B'),

    -- 👨‍🏫 TEACHER T5 (English)
    ('T5', 'English Literature', 'English', 'Monday', '11:00:00', '12:00:00', 'Room 104'),
    ('T5', 'Creative Writing', 'English', 'Tuesday', '15:00:00', '16:00:00', 'Room 106'),
    ('T5', 'English Literature', 'English', 'Wednesday', '14:00:00', '15:00:00', 'Room 104'),
    ('T5', 'Modern Poetry', 'English', 'Friday', '09:00:00', '10:00:00', 'Room 108'),

    -- 👨‍🏫 TEACHER T6 (Computer Science)
    ('T6', 'AI Foundations', 'Computer Science', 'Monday', '15:00:00', '16:00:00', 'Lab 1'),
    ('T6', 'Web Development', 'Computer Science', 'Wednesday', '11:00:00', '12:00:00', 'Lab 2'),
    ('T6', 'Database Systems', 'Computer Science', 'Thursday', '10:00:00', '11:00:00', 'Lab 1'),
    ('T6', 'Web Development', 'Computer Science', 'Friday', '14:00:00', '15:00:00', 'Lab 2'),
    ('T6', 'Hackathon Prep', 'Computer Science', 'Saturday', '14:00:00', '15:00:00', 'Lab 1'),

    -- 👨‍🏫 TEACHER T7 (Mathematics)
    ('T7', 'Discrete Math', 'Mathematics', 'Tuesday', '09:00:00', '10:00:00', 'Room 103'),
    ('T7', 'Probability', 'Mathematics', 'Wednesday', '15:00:00', '16:00:00', 'Room 105'),
    ('T7', 'Linear Algebra', 'Mathematics', 'Thursday', '09:00:00', '10:00:00', 'Room 102'),
    ('T7', 'Discrete Math', 'Mathematics', 'Friday', '10:00:00', '11:00:00', 'Room 103'),
    
    -- 👨‍🏫 TEACHER T8 (Physics)
    ('T8', 'Thermodynamics', 'Physics', 'Monday', '09:00:00', '10:00:00', 'Room 203'),
    ('T8', 'Optics', 'Physics', 'Tuesday', '11:00:00', '12:00:00', 'Room 204'),
    ('T8', 'Thermodynamics Lab', 'Physics', 'Wednesday', '14:00:00', '15:00:00', 'Lab 3'),
    ('T8', 'Electromagnetism', 'Physics', 'Thursday', '15:00:00', '16:00:00', 'Room 203'),

    -- 👨‍🏫 TEACHER T9 (Chemistry)
    ('T9', 'Physical Chem', 'Chemistry', 'Monday', '11:00:00', '12:00:00', 'Room 303'),
    ('T9', 'Analytical Chem', 'Chemistry', 'Tuesday', '10:00:00', '11:00:00', 'Lab 4'),
    ('T9', 'Physical Chem Lab', 'Chemistry', 'Wednesday', '09:00:00', '10:00:00', 'Lab 4'),
    ('T9', 'Biochemistry', 'Chemistry', 'Friday', '15:00:00', '16:00:00', 'Room 305'),
    ('T9', 'Science Fair Prep', 'Chemistry', 'Saturday', '10:00:00', '11:00:00', 'Hall A'),

    -- 👨‍🏫 TEACHER T10 (English)
    ('T10', 'Technical Writing', 'English', 'Monday', '14:00:00', '15:00:00', 'Room 110'),
    ('T10', 'Public Speaking', 'English', 'Tuesday', '14:00:00', '15:00:00', 'Hall B'),
    ('T10', 'Technical Writing', 'English', 'Thursday', '11:00:00', '12:00:00', 'Room 110'),
    ('T10', 'Journalism', 'English', 'Friday', '09:00:00', '10:00:00', 'Room 111')
) AS d(tc, class_name, subject, day, start_time, end_time, room_number)
ON t.teacher_code = d.tc;

SELECT 'Timetable data populated successfully!' AS result;
