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
    console.error('API [Subjects Lookup] Auth Error:', authError)
    return NextResponse.json(
      { error: 'Unauthorized', details: authError?.message }, { status: 401 }
    )
  }

  // In original schema, Class = Subject. Return the class details.
  const { data: cls, error } = await supabase
    .from('classes')
    .select('id, name, code')
    .eq('id', classId)
    .single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ 
    subjects: [
      { id: cls.id, name: cls.name, code: cls.code }
    ] 
  })
}
