import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY 
      ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const results: Record<string, any> = {}

  // Check each table exists
  for (const table of [
    'profiles', 
    'subjects', 
    'classes',
    'class_enrollments', 
    'attendance_records',
    'attendance',    // Added for comparison
    'enrollments'    // Added for comparison
  ]) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1)
    
    results[table] = error 
      ? `❌ ERROR: ${error.message}` 
      : `✅ EXISTS (${data?.length ?? 0} rows sampled)`
  }

  // Check env vars are present
  results['env'] = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL 
      ? '✅ set' : '❌ MISSING',
    ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? '✅ set' : '❌ MISSING',
    SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY 
      ? '✅ set' : '❌ MISSING — attendance save will fail',
  }

  return NextResponse.json(results, { status: 200 })
}
