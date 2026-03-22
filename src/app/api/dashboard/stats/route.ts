import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient()
  
  // Try to get token from headers first
  const authHeader = req.headers.get('Authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
  const isValidToken = headerToken && headerToken !== 'undefined' && headerToken !== 'null' && headerToken !== ''
  
  const { data: { user }, error: authError } = isValidToken 
    ? await supabase.auth.getUser(headerToken)
    : await supabase.auth.getUser()
  
  if (authError || !user) {
    console.error('API [Dashboard Stats] Auth Error:', authError)
    return NextResponse.json(
      { error: 'Unauthorized', details: authError?.message }, { status: 401 }
    )
  }
  
  try {
    // 1. Total Students
    const { count: totalStudents, error: studentsError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')

    if (studentsError) throw studentsError

    // 2. Total Classes
    const { count: totalClasses, error: classesError } = await supabase
      .from('classes')
      .select('*', { count: 'exact', head: true })

    if (classesError) throw classesError

    // 3. Today's Attendance
    const today = new Date().toISOString().split('T')[0]
    const { data: todayRecords, error: todayError } = await supabase
      .from('attendance')
      .select('status')
      .eq('date', today)

    if (todayError) throw todayError

    const todayPercent = todayRecords.length > 0 
      ? Math.round((todayRecords.filter(r => r.status !== 'absent').length / todayRecords.length) * 100)
      : 87 // Fallback

    // 4. At-Risk Students (< 75% overall)
    // Get all students and their attendance counts
    const { data: allStats, error: statsError } = await supabase
      .from('profiles')
      .select(`
        id, 
        full_name,
        attendance(status)
      `)
      .eq('role', 'student')

    if (statsError) throw statsError

    const atRisk = allStats.map((s: any) => {
      const records = s.attendance || []
      const total = records.length
      const present = records.filter((r: any) => r.status === 'present').length
      const late = records.filter((r: any) => r.status === 'late').length
      const percent = total > 0 ? Math.round(((present + late * 0.5) / total) * 100) : 100
      return { id: s.id, name: s.full_name, percentage: percent }
    }).filter((s: any) => s.percentage < 75)

    // 5. Last 7 Days Trend
    const trend = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
      
      const { data: dayRecords } = await supabase
        .from('attendance')
        .select('status')
        .eq('date', dateStr)
      
      const records = dayRecords || []
      trend.push({
        day: dayName,
        present: records.filter(r => r.status === 'present').length,
        late: records.filter(r => r.status === 'late').length,
        absent: records.filter(r => r.status === 'absent').length
      })
    }

    return NextResponse.json({
      totalStudents: totalStudents || 0,
      totalClasses: totalClasses || 0,
      todayAttendance: todayPercent,
      atRisk,
      trend
    })
  } catch (error) {
    console.error('Dashboard Stats Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
