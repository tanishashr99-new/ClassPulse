import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  
  // Try to get token from headers first
  const authHeader = req.headers.get('Authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  const isValidToken = headerToken && headerToken !== 'undefined' && headerToken !== 'null' && headerToken !== ''
  
  const { data: { user }, error: authError } = isValidToken 
    ? await supabase.auth.getUser(headerToken)
    : await supabase.auth.getUser()
  
  if (authError || !user) {
    console.error('API [Students] Auth Error:', authError)
    return NextResponse.json(
      { error: 'Unauthorized', details: authError?.message }, { status: 401 }
    )
  }
  
  try {
    // Get students from profiles (limit to top 100 for performance)
    const { data: students, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email, student_id, avatar_url, role')
      .eq('role', 'student')
      .order('full_name')
      .limit(100)

    if (profilesError) throw profilesError

    // Get recent attendance stats (last 30 days) for these students
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const { data: attendance, error: attendanceError } = await supabase
      .from('attendance')
      .select('student_id, status')
      .gte('date', lastMonth)
      .limit(2000)

    if (attendanceError) throw attendanceError

    // Map to include attendance percentage
    const attendanceMap: Record<string, { total: number; present: number; late: number }> = {}
    attendance?.forEach(r => {
      if (!attendanceMap[r.student_id]) {
        attendanceMap[r.student_id] = { total: 0, present: 0, late: 0 }
      }
      attendanceMap[r.student_id].total++
      if (r.status === 'present') attendanceMap[r.student_id].present++
      else if (r.status === 'late') attendanceMap[r.student_id].late++
    })

    const mapped = students.map(s => {
      const stats = attendanceMap[s.id] || { total: 0, present: 0, late: 0 }
      const percentage = stats.total > 0 
        ? Math.round(((stats.present + stats.late * 0.5) / stats.total) * 100) 
        : 0
      
      return {
        id: s.id,
        full_name: s.full_name,
        email: s.email,
        student_id: s.student_id,
        avatar_url: s.avatar_url,
        attendance: percentage
      }
    })

    return NextResponse.json(mapped)
  } catch (error) {
    console.error('Students Fetch Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
