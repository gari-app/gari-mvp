import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { z } from 'zod'

const ReservationSchema = z.object({
  space_id: z.string().uuid(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime()
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parse = ReservationSchema.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: parse.error.format() }, { status: 400 })

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { space_id, starts_at, ends_at } = parse.data
  const { error } = await supabase
    .from('reservations')
    .insert({ space_id, user_id: user.id, starts_at, ends_at, status: 'reserved' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
