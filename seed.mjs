import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ercoukvflthjbchglyle.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY291a3ZmbHRoamJjaGdseWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzIyMDYsImV4cCI6MjA4OTYwODIwNn0.xstDBFBPHAhqKHgyaCMXVTOaUI0wr7GEJqTdHVjV7tU";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log("Starting to seed 10 dummy teachers...");
  for (let i = 1; i <= 10; i++) {
    const id = `T${i}`;
    const email = `t${i}@smartcampus.edu`;
    const password = `teacher${i}`;
    const fullName = `Teacher ${i}`;
    const role = "teacher";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (error) {
      if (error.message.includes("User already registered") || error.message.includes("already exists")) {
        console.log(`User ${id} already exists, skipping signup.`);
        // Try to update profile just in case missing
        try {
          // If we can't get the user ID without auth schema or logging in, skip.
        } catch (e) {}
      } else {
        console.error(`Error signing up ${id}:`, error.message);
      }
      continue;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
        department: "Computer Science",
      });
      if (profileError) {
        console.error(`Error creating profile for ${id}:`, profileError.message);
      } else {
        console.log(`Successfully created ${id} (${email})`);
      }
    }
  }
  console.log("Seeding complete.");
}

seed();
