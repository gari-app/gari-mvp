'use client'
import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'

export default function Map({ center = [-58.6525, -34.6519], zoom = 14 }: { center?: [number, number]; zoom?: number }) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center,
      zoom
    })
    new maplibregl.NavigationControl() && map.addControl(new maplibregl.NavigationControl())
    return () => map.remove()
  }, [center, zoom])

  return <div ref={mapRef} className="h-[400px] w-full rounded-xl" />
}
