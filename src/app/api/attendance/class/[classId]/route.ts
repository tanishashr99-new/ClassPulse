import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: Request, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const supabase = await createServerSupabaseClient()
  
  // Try to get token from headers first
  const authHeader = request.headers.get('Authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  const isValidToken = headerToken && headerToken !== 'undefined' && headerToken !== 'null' && headerToken !== ''
  
  const { data: { user }, error: authError } = isValidToken 
    ? await supabase.auth.getUser(headerToken)
    : await supabase.auth.getUser()
  
  if (authError || !user) {
    console.error('API [Class Attendance] Auth Error:', authError)
    return NextResponse.json(
      { error: 'Unauthorized', details: authError?.message }, { status: 401 }
    )
  }
  
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const subjectId = searchParams.get('subjectId')

    if (!date || !subjectId) {
      return NextResponse.json({ error: 'Date and SubjectId are required' }, { status: 400 })
    }


    // 1. Get all enrolled students for this class
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        student:profiles!student_id(
          id,
          full_name,
          email,
          avatar_url,
          student_id
        )
      `)
      .eq('class_id', classId)

    if (enrollError) throw enrollError

    // 2. Get attendance for this date
    const { data: attendance, error: attendError } = await supabase
      .from('attendance')
      .select('student_id, status')
      .eq('class_id', classId)
      .eq('date', date)

    if (attendError) throw attendError

    const attendanceMap: Record<string, string> = {}
    attendance?.forEach(r => {
      attendanceMap[r.student_id] = r.status
    })

    const result = (enrollments || []).map((e: any) => ({
      student: e.student,
      status: attendanceMap[e.student.id] || null
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Class Attendance Fetch Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
