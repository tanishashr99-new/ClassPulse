
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ercoukvflthjbchglyle.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY291a3ZmbHRoamJjaGdseWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzIyMDYsImV4cCI6MjA4OTYwODIwNn0.xstDBFBPHAhqKHgyaCMXVTOaUI0wr7GEJqTdHVjV7tU'
)

async function checkTables() {
  const tables = ['profiles', 'subjects', 'classes', 'class_enrollments', 'attendance_records', 'attendance', 'enrollments'];
  const results = {};
  
  for (const t of tables) {
    const { error } = await supabase.from(t).select('id').limit(1);
    results[t] = error ? `❌ ${error.message}` : '✅ EXISTS';
  }
  
  console.log(JSON.stringify(results, null, 2));
}

checkTables();
