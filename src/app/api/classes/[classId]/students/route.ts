import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  const { classId } = await params;
  const supabase = await createServerSupabaseClient()
  
  // Try to get token from headers first
  const authHeader = req.headers.get('Authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  const isValidToken = headerToken && headerToken !== 'undefined' && headerToken !== 'null' && headerToken !== ''
  
  const { data: { user }, error: authError } = isValidToken 
    ? await supabase.auth.getUser(headerToken)
    : await supabase.auth.getUser()
  
  if (authError || !user) {
    console.error('API [Students Lookup] Auth Error:', authError)
    return NextResponse.json(
      { error: 'Unauthorized', details: authError?.message }, { status: 401 }
    )
  }

  const { searchParams } = new URL(req.url)
  const subjectId = searchParams.get('subjectId')
  const date = searchParams.get('date') // YYYY-MM-DD

  if (!subjectId) return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 })

  // Get enrolled students via enrollments
  const { data: enrollments, error: enrollError } = await supabase
    .from('enrollments')
    .select('student_id, profiles(id, full_name, email, role, student_id)')
    .eq('class_id', classId)

  if (enrollError) return NextResponse.json({ error: enrollError.message }, { status: 500 })

  // Get existing attendance for this date
  const { data: existing, error: attendError } = date ? await supabase
    .from('attendance')
    .select('student_id, status')
    .eq('class_id', classId)
    .eq('date', date) : { data: [], error: null }

  if (attendError) return NextResponse.json({ error: attendError.message }, { status: 500 })

  const existingMap: Record<string, string> = {}
  for (const r of existing || []) {
    existingMap[r.student_id] = r.status
  }

  const students = (enrollments || []).map((e: any) => ({
    ...e.profiles,
    currentStatus: existingMap[e.student_id] || null
  }))

  return NextResponse.json({ 
    students,
    alreadyMarked: existing && (existing as any[]).length > 0
  })
}
