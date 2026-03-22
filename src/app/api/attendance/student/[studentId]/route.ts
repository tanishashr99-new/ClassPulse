import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;
  const supabase = await createServerSupabaseClient()
  
  // Try to get token from headers first
  const authHeader = req.headers.get('Authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  const isValidToken = headerToken && headerToken !== 'undefined' && headerToken !== 'null' && headerToken !== ''
  
  const { data: { user }, error: authError } = isValidToken 
    ? await supabase.auth.getUser(headerToken)
    : await supabase.auth.getUser()
  
  if (authError || !user) {
    console.error('API [Student Attendance] Auth Error:', authError)
    return NextResponse.json(
      { error: 'Unauthorized', details: authError?.message }, { status: 401 }
    )
  }

  // Students can only see their own data
  const { data: profile, error: profileError } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  
  if (profileError) {
    console.error('API [Student Attendance] Profile Error:', profileError)
  }

  if (profile?.role === 'student' && user.id !== studentId) {
    console.warn(`API [Student Attendance] Forbidden: Auth User ID (${user.id}) !== Requested ID (${studentId}). Role: ${profile.role}`);
    return NextResponse.json({ 
      error: `Forbidden: ID mismatch (Your ID: ${user.id.substring(0,8)}... != Requested: ${studentId?.substring(0,8)}...)` 
    }, { status: 403 })
  }

  // Get all attendance records for this student with class details
  const { data: records, error } = await supabase
    .from('attendance')
    .select(`
      id, 
      date, 
      status,
      classes (id, name, code, color)
    `)
    .eq('student_id', studentId)
    .order('date', { ascending: false })

  if (error) {
    console.error('Student Attendance Fetch Error:', error)
    return NextResponse.json(
      { error: error.message }, { status: 500 }
    )
  }

  // Aggregation logic
  const classMap: Record<string, any> = {}
  for (const r of (records || [])) {
    const cls = r.classes as any
    if (!cls) continue
    
    if (!classMap[cls.id]) {
      classMap[cls.id] = {
        subjectId: cls.id, // Keeping subjectId key for frontend compatibility
        subjectName: cls.name,
        subjectCode: cls.code,
        present: 0, late: 0, absent: 0, total: 0
      }
    }
    const s = classMap[cls.id]
    s[r.status]++
    s.total++
  }

  const bySubject = Object.values(classMap).map((s: any) => ({
    ...s,
    percentage: s.total > 0 
      ? Math.round(((s.present + (s.late * 0.5)) / s.total) * 100) 
      : 0
  }))

  // Overall stats
  const total = (records || []).length
  const present = (records || []).filter(r => r.status === 'present').length
  const late = (records || []).filter(r => r.status === 'late').length
  const absent = (records || []).filter(r => r.status === 'absent').length

  return NextResponse.json({
    overall: {
      percentage: total > 0 
        ? Math.round(((present + (late * 0.5)) / total) * 100) : 0,
      present, late, absent, total
    },
    bySubject,
    recentRecords: (records || []).map(r => ({
      id: r.id,
      classDate: r.date,
      status: r.status,
      subjectName: (r.classes as any)?.name
    })).slice(0, 90)
  })
}
