import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ercoukvflthjbchglyle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY291a3ZmbHRoamJjaGdseWxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAzMjIwNiwiZXhwIjoyMDg5NjA4MjA2fQ.pBSvWguWXtFaUNhWdXlPZncYi4tsU_CzrNg6_pUiK1I';
const supabase = createClient(supabaseUrl, supabaseKey);

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  for (let i = 1; i <= 10; i++) {
    const email = `t${i}@giet.edu`;
    const password = `teacher@${i}`;
    console.log(`Creating teacher: ${email} with password: ${password} ...`);

    let userId = null;
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });

      if (authError) {
        console.error(`- Error auth user ${i}:`, authError.message);

        if (authError.message.includes("already registered") || authError.message.includes("already exists")) {
            const { data: profiles, error: listError } = await supabase.from('profiles').select('id, email').like('email', email);
            if (!listError) {
                const existingUser = profiles.find(u => u.email === email);
                if (existingUser) {
                    userId = existingUser.id;
                    await supabase.auth.admin.updateUserById(userId, { password: password });
                }
            }
        }
      } else {
          userId = authData.user.id;
      }
      
      if (userId) {
          // Upsert the profile
          const { error: profileError } = await supabase.from('profiles').upsert({
             id: userId,
             email: email,
             full_name: `Teacher ${i}`,
             role: 'teacher'
          });
          if (profileError) {
             console.error(`- Error profile ${i}:`, profileError.message);
          } else {
             console.log(`- Created ${email} successfully! (password: ${password})`);
          }
      }

    } catch (e) {
      console.error(e);
    }
    
    await delay(300);
  }
}

main();
