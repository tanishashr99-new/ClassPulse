import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  
  // Try to get token from headers first
  const authHeader = req.headers.get('Authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  const isValidToken = headerToken && headerToken !== 'undefined' && headerToken !== 'null' && headerToken !== ''
  
  const { data: { user }, error: authError } = isValidToken 
    ? await supabase.auth.getUser(headerToken)
    : await supabase.auth.getUser()
  
  if (authError || !user) {
    console.error('API [Mark Attendance] Auth Error:', authError)
    return NextResponse.json(
      { error: 'Unauthorized', details: authError?.message }, { status: 401 }
    )
  }

  // Verify teacher/admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!profile || !['admin','teacher'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { subjectId, classDate, records } = await req.json()
  // records = [{ studentId, status }]

  if (!subjectId || !classDate || !records) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const upsertData = records.map((r: any) => ({
    student_id: r.studentId,
    class_id: subjectId, // subjectId from frontend maps to class_id
    date: classDate,     // classDate from frontend maps to date
    status: r.status,
    marked_by: user.id
  }))

  const { error } = await supabase
    .from('attendance')
    .upsert(upsertData, { 
      onConflict: 'student_id,class_id,date' 
    })

  if (error) {
    console.error('Mark Attendance Error:', error)
    return NextResponse.json(
      { error: error.message }, { status: 500 }
    )
  }

  return NextResponse.json({ 
    success: true, 
    marked: records.length 
  })
}
