-- Safe to run multiple times (idempotent)

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  code        TEXT NOT NULL,
  semester    INTEGER DEFAULT 4,
  type        TEXT DEFAULT 'theory' 
              CHECK (type IN ('theory', 'lab', 'tutorial')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Classes table  
CREATE TABLE IF NOT EXISTS classes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  section     TEXT DEFAULT 'A',
  teacher_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Class enrollments (which students are in which class+subject)
CREATE TABLE IF NOT EXISTS class_enrollments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id  UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, class_id, subject_id)
);

-- Attendance records — THE core table
CREATE TABLE IF NOT EXISTS attendance_records (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id   UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_date   DATE NOT NULL,
  status       TEXT NOT NULL 
               CHECK (status IN ('present', 'late', 'absent')),
  marked_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject_id, class_date)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_attendance_student 
  ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_subject 
  ON attendance_records(subject_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date 
  ON attendance_records(class_date);
CREATE INDEX IF NOT EXISTS idx_enrollment_student 
  ON class_enrollments(student_id);

-- Row Level Security (keeps data safe)
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Enable realtime for attendance_records
ALTER PUBLICATION supabase_realtime 
  ADD TABLE attendance_records;

-- Policies: authenticated users can read all
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone authenticated can read subjects') THEN
        CREATE POLICY "Anyone authenticated can read subjects" ON subjects FOR SELECT TO authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone authenticated can read classes') THEN
        CREATE POLICY "Anyone authenticated can read classes" ON classes FOR SELECT TO authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students see own enrollments') THEN
        CREATE POLICY "Students see own enrollments" ON class_enrollments FOR SELECT TO authenticated USING (student_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Teachers see all enrollments') THEN
        CREATE POLICY "Teachers see all enrollments" ON class_enrollments FOR SELECT TO authenticated
        USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students see own attendance') THEN
        CREATE POLICY "Students see own attendance" ON attendance_records FOR SELECT TO authenticated USING (student_id = auth.uid());
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Teachers see all attendance') THEN
        CREATE POLICY "Teachers see all attendance" ON attendance_records FOR SELECT TO authenticated
        USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Teachers can insert attendance') THEN
        CREATE POLICY "Teachers can insert attendance" ON attendance_records FOR INSERT TO authenticated
        WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Teachers can update attendance') THEN
        CREATE POLICY "Teachers can update attendance" ON attendance_records FOR UPDATE TO authenticated
        USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher')));
    END IF;
END $$;
