-- These make queries 10-100x faster on large tables
CREATE INDEX IF NOT EXISTS idx_attendance_student_id 
  ON attendance_records(student_id);
  
CREATE INDEX IF NOT EXISTS idx_attendance_date 
  ON attendance_records(class_date DESC);
  
CREATE INDEX IF NOT EXISTS idx_attendance_student_date 
  ON attendance_records(student_id, class_date DESC);
  
CREATE INDEX IF NOT EXISTS idx_profiles_role 
  ON profiles(role);
  
CREATE INDEX IF NOT EXISTS idx_enrollments_student 
  ON class_enrollments(student_id);
