import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const FIRST_NAMES = ['Arjun', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Neha', 'Amit', 'Divya', 'Suresh', 'Kavya']
const LAST_NAMES = ['Sharma', 'Patel', 'Reddy', 'Kumar', 'Singh', 'Nair', 'Iyer', 'Rao', 'Mehta', 'Joshi']
const DEPARTMENTS = ['Computer Science', 'Mathematics', 'Physics', 'Electronics', 'Mechanical Engineering']

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// The login page transforms Teacher ID input -> teacher_auth_<code>@smart.edu
// So user types "T1" -> auth email becomes "teacher_auth_t1@smart.edu"
function getAuthEmail(code) {
  return `teacher_auth_${code.toLowerCase()}@smart.edu`
}

async function fixTeacherAuth() {
  console.log('--- FIXING TEACHER AUTH EMAILS ---')

  // Step 1: Delete old wrong auth users (t1@giet.edu ... t10@giet.edu)
  console.log('\nStep 1: Removing old auth users...')
  const { data: allUsers } = await supabase.auth.admin.listUsers({ perPage: 200 })
  const oldUsers = allUsers?.users?.filter(u => u.email?.match(/^t\d+@giet\.edu$/)) || []
  for (const u of oldUsers) {
    await supabase.auth.admin.deleteUser(u.id)
    console.log(`  Deleted: ${u.email}`)
  }

  // Step 2: Create correct auth users + update profiles + teachers
  console.log('\nStep 2: Creating correctly-formatted auth users...')

  // Keep names from teachers table if already there
  const { data: existingTeachers } = await supabase.from('teachers').select('*')
  const teacherMap = {}
  for (const t of existingTeachers || []) {
    teacherMap[t.teacher_code] = t
  }

  for (let i = 1; i <= 10; i++) {
    const code = `t${i}`
    const authEmail = getAuthEmail(code)  // teacher_auth_t1@smart.edu
    const displayEmail = `${code}@giet.edu`
    const password = `Teacher@${i}23`
    const fullName = teacherMap[code]?.full_name || `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`
    const department = teacherMap[code]?.department || randomItem(DEPARTMENTS)

    console.log(`\n${code} — ${fullName}`)
    console.log(`  Auth email: ${authEmail}`)

    // Create auth user with teacher_auth_t<N>@smart.edu
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: authEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role: 'teacher' }
    })
    if (createErr) {
      console.warn(`  Auth create failed: ${createErr.message}`)
      continue
    }
    const userId = newUser.user.id
    console.log(`  Auth user created: ${userId}`)

    // Upsert profile with display email
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: userId,
      email: displayEmail,
      full_name: fullName,
      role: 'teacher',
      department,
    }, { onConflict: 'id' })
    if (profileErr) console.warn(`  Profile failed: ${profileErr.message}`)
    else console.log(`  Profile saved`)

    // Upsert teachers table
    const { error: teacherErr } = await supabase.from('teachers').upsert({
      teacher_code: code,
      full_name: fullName,
      password,
      department,
    }, { onConflict: 'teacher_code' })
    if (teacherErr) console.warn(`  Teachers table failed: ${teacherErr.message}`)
    else console.log(`  Teachers table saved`)
  }

  console.log('\n--- DONE ---')
  console.log('Login with Teacher ID = T1 (or t1, t2, ... t10) and password = Teacher@123')
}

fixTeacherAuth()
