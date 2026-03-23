import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in process.env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const FIRST_NAMES = ['Arjun', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Neha', 'Amit', 'Divya', 'Suresh', 'Kavya',
  'Rohan', 'Ananya', 'Kiran', 'Pooja', 'Rajesh', 'Meera', 'Sanjay', 'Lakshmi', 'Anil', 'Deepa']
const LAST_NAMES = ['Sharma', 'Patel', 'Reddy', 'Kumar', 'Singh', 'Nair', 'Iyer', 'Rao', 'Mehta', 'Joshi',
  'Gupta', 'Desai', 'Verma', 'Mishra', 'Pillai', 'Choudhary', 'Bose', 'Kapoor', 'Das', 'Malhotra']
const DEPARTMENTS = ['Computer Science', 'Mathematics', 'Physics', 'Electronics', 'Mechanical Engineering']
const SUBJECTS = ['Data Structures', 'Algorithms', 'Linear Algebra', 'Quantum Mechanics', 'VLSI Design', 'Thermodynamics', 'Operating Systems', 'Database Systems', 'Machine Learning', 'Computer Networks']

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomName() {
  return `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`
}

async function seedTeachers() {
  console.log('--- SEEDING TEACHERS t1 to t10 ---')

  for (let i = 1; i <= 10; i++) {
    const code = `t${i}`
    const email = `${code}@giet.edu`
    const password = `Teacher@${i}23`
    const fullName = randomName()
    const department = randomItem(DEPARTMENTS)
    const subject = randomItem(SUBJECTS)

    console.log(`\nProcessing ${code} — ${fullName}`)

    // 1. Create auth user (or reuse if already exists)
    let userId
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    if (existingUser) {
      userId = existingUser.id
      console.log(`  Auth user already exists: ${userId}`)
    } else {
      const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role: 'teacher' }
      })
      if (createErr) {
        console.warn(`  Failed to create auth user: ${createErr.message}`)
        continue
      }
      userId = newUser.user.id
      console.log(`  Created auth user: ${userId}`)
    }

    // 2. Upsert into profiles
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: userId,
      email,
      full_name: fullName,
      role: 'teacher',
      department,
    }, { onConflict: 'id' })

    if (profileErr) {
      console.warn(`  Profile upsert failed: ${profileErr.message}`)
    } else {
      console.log(`  Profile saved`)
    }

    // 3. Upsert into teachers table
    const { error: teacherErr } = await supabase.from('teachers').upsert({
      teacher_code: code,
      full_name: fullName,
      password,
      department,
    }, { onConflict: 'teacher_code' })

    if (teacherErr) {
      console.warn(`  Teachers upsert failed: ${teacherErr.message}`)
    } else {
      console.log(`  Teacher record saved — ${code} / ${email} / ${fullName}`)
    }
  }

  console.log('\n--- DONE ---')
  console.log('Teachers t1–t10 are ready. Password pattern: Teacher@<N>23 (e.g. Teacher@123 for t1)')
}

seedTeachers()
