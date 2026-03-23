import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in process.env')
  console.log('Got URL:', supabaseUrl ? 'Set' : 'Missing')
  console.log('Got Key:', supabaseServiceKey ? 'Set' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function clearAll() {
  console.log('--- CLEARING ALL DATA FROM SUPABASE ---')
  
  // List of tables in dependency order (children first)
  const tables = [
    'test_responses',
    'test_questions',
    'submissions',
    'student_badges',
    'attendance',
    'enrollments',
    'notifications',
    'leaderboard',
    'timetable',
    'teacher_events',
    'ai_insights',
    'tests',
    'assignments',
    'classes',
    'teachers',
    'badges',
    'profiles'
  ]

  for (const table of tables) {
    try {
      console.log(`Clearing table: ${table}...`)
      // Use delete and a condition that's always true to clear data using service key
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (error) {
        console.warn(`Could not clear ${table}: ${error.message}`)
      } else {
        console.log(`Table ${table} cleared!`)
      }
    } catch (e) {
      console.warn(`Exception clearing ${table}: ${e.message}`)
    }
  }

  console.log('--- ALL DONE ---')
}

clearAll()
