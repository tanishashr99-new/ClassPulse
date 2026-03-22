import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ercoukvflthjbchglyle.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY291a3ZmbHRoamJjaGdseWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzIyMDYsImV4cCI6MjA4OTYwODIwNn0.xstDBFBPHAhqKHgyaCMXVTOaUI0wr7GEJqTdHVjV7tU";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  for (let i = 1; i <= 10; i++) {
    const id = `T${i}`;
    const email = `teacher_auth_t${i}@smart.edu`;
    const password = `teacher${i}`;
    console.log('Registering', id);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: `Teacher ${i}`, role: 'teacher' } }
    });
    if (error) {
       console.log(error.message);
    } else if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, email, full_name: `Teacher ${i}`, role: 'teacher', department: 'Computer Science' });
    }
  }
  console.log('Done mapping secure emails.');
}
run();
