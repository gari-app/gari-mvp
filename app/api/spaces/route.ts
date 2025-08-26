import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { z } from 'zod'

const SpaceSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  price_per_hour: z.number().nonnegative(),
  location_address: z.string().min(5),
  lng: z.number(),
  lat: z.number()
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parse = SpaceSchema.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: parse.error.format() }, { status: 400 })

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description, price_per_hour, location_address, lng, lat } = parse.data

  const { error } = await supabase.from('spaces').insert({
    owner_id: user.id,
    title,
    description,
    price_per_hour,
    location_address,
    location_point: `SRID=4326;POINT(${lng} ${lat})`
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
