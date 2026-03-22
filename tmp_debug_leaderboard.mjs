
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkLeaderboard() {
  console.log('--- Leaderboard Table Check ---')
  
  // 1. Check if table exists
  const { data: tables, error: tableError } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(1)

  if (tableError) {
    console.error('Leaderboard table error:', tableError.message)
    if (tableError.message.includes('not found')) {
      console.log('CRITICAL: leaderboard table is MISSING!')
    }
  } else {
    console.log('Leaderboard table exists.')
    console.log('Sample data:', tables)
  }

  // 2. Check profiles
  const { count: profileCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  console.log('Total profiles:', profileCount)

  // 3. Check attendance for calculation
  const { count: attendCount } = await supabase.from('attendance').select('*', { count: 'exact', head: true })
  console.log('Total attendance records:', attendCount)
}

checkLeaderboard()
