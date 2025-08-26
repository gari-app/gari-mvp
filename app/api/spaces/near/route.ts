import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lng = Number(searchParams.get('lng'))
  const lat = Number(searchParams.get('lat'))
  const radius = Number(searchParams.get('radius') ?? 500)
  if (!lng || !lat) return NextResponse.json({ error: 'lng/lat requeridos' }, { status: 400 })

  const supabase = createClient()
  const { data, error } = await supabase.rpc('spaces_nearby', { in_lng: lng, in_lat: lat, in_radius: radius })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
