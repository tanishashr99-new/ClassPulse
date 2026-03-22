import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim()
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim()
const serviceKey = env.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim()

if (!url || !serviceKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(url, key)

async function check() {
  const tables = ['attendance', 'attendance_records', 'classes', 'subjects', 'enrollments', 'profiles']
  let report = '\n--- SCHEMA REPORT ---\n'
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1)
    if (error) {
      report += `Table '${t}': MISSING or ERROR (${error.message})\n`
    } else {
      const cols = data.length > 0 ? Object.keys(data[0]).join(', ') : 'EMPTY (ID ok)'
      report += `Table '${t}': EXISTS. Columns: ${cols}\n`
    }
  }
  fs.writeFileSync('tmp_schema_report_utf8.txt', report, 'utf8')
  console.log('Report written to tmp_schema_report_utf8.txt')
}

check()
