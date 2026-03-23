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
    console.error('API [Leaderboard] Auth Error:', authError)
    return NextResponse.json(
      { error: 'Unauthorized', details: authError?.message }, { status: 401 }
    )
  }
  
  try {
    // 1. Get base leaderboard from Supabase
    const { data: baseLeaderboard, error: leaderboardError } = await supabase
      .from("leaderboard")
      .select("*, student:profiles!student_id(id, full_name, email, avatar_url)")
      .order("score", { ascending: false });
    
    if (leaderboardError) throw leaderboardError;

    // 2. Fetch current week's attendance from Supabase for bonuses
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const { data: attendanceRecords, error: attendanceError } = await supabase
      .from('attendance')
      .select('student_id, status')
      .gte('date', weekAgoStr)

    if (attendanceError) {
      console.warn("Supabase attendance error in leaderboard:", attendanceError);
      return NextResponse.json(baseLeaderboard);
    }

    // 3. Calculate bonuses
    const studentStats: Record<string, { total: number; attended: number }> = {};
    (attendanceRecords || []).forEach((r: any) => {
      if (!studentStats[r.student_id]) studentStats[r.student_id] = { total: 0, attended: 0 };
      studentStats[r.student_id].total++;
      if (r.status === "present") studentStats[r.student_id].attended++;
      else if (r.status === "late") studentStats[r.student_id].attended += 0.5;
    });

    const scoresWithBonus = (baseLeaderboard as any[]).map(entry => {
      const stats = studentStats[entry.student_id];
      let bonus = 0;
      if (stats && stats.total > 0) {
        const rate = (stats.attended / stats.total) * 100;
        if (rate >= 100) bonus = 10;
        else if (rate >= 90) bonus = 5;
      }
      return { 
        ...entry, 
        score: (entry.score || 0) + bonus,
        bonus_points: bonus
      };
    });

    // 4. Re-sort by final score
    const sorted = scoresWithBonus.sort((a: any, b: any) => b.score - a.score);
    return NextResponse.json(sorted);

  } catch (error) {
    console.error('Leaderboard Fetch Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
