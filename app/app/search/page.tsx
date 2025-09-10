'use client'
import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css' // estilos del mapa

export default function SearchPage() {
  const [lat, setLat] = useState(-34.6519)
  const [lng, setLng] = useState(-58.6525)
  const [radius, setRadius] = useState(500)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mapRef = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])

  async function buscar() {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`/api/spaces/near?lat=${lat}&lng=${lng}&radius=${radius}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error')
      setResults(data || [])
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Inicializar mapa 1 sola vez
  useEffect(() => {
    if (!mapRef.current || map.current) return
    map.current = new maplibregl.Map({
      container: mapRef.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      center: [lng, lat],
      zoom: 13
    })
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
    return () => { map.current?.remove(); map.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-centrar y pintar marcadores cuando cambian los resultados
  useEffect(() => {
    if (!map.current) return
    // limpiar marcadores previos
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    // centrar en el punto buscado
    map.current.setCenter([lng, lat])

    // agregar marcadores para cada resultado (requiere que el API devuelva lon/lat)
    results.forEach((r: any) => {
      if (typeof r.lon === 'number' && typeof r.lat === 'number') {
        const el = document.createElement('div')
        el.style.width = '12px'
        el.style.height = '12px'
        el.style.borderRadius = '50%'
        el.style.background = '#6ee7b7'
        el.style.boxShadow = '0 0 0 4px rgba(110,231,183,.2)'
        const mk = new maplibregl.Marker({ element: el })
          .setLngLat([r.lon, r.lat])
          .addTo(map.current!)
        markersRef.current.push(mk)
      }
    })
  }, [results, lat, lng])

  // primera búsqueda al cargar
  useEffect(() => { buscar() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid-2">
      <section className="panel card">
        <h2 style={{ marginTop: 0 }}>Buscar cocheras</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <label>Latitud
            <input className="input" type="number" value={lat} onChange={e => setLat(parseFloat(e.target.value))} />
          </label>
          <label>Longitud
            <input className="input" type="number" value={lng} onChange={e => setLng(parseFloat(e.target.value))} />
          </label>
          <label>Radio (m)
            <select className="select" value={radius} onChange={e => setRadius(parseInt(e.target.value))}>
              <option value={300}>300</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <button className="button button--primary" onClick={buscar} disabled={loading}>
            {loading ? 'Buscando…' : 'Buscar'}
          </button>
        </div>

        {error && <p style={{ color: 'crimson', marginTop: 12 }}>Error: {error}</p>}

        <div className="list" style={{ marginTop: 16 }}>
          {results.map((r: any) => (
            <div key={r.id} className="list-item">
              <div>
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                <div style={{ color: 'var(--muted)' }}>{r.location_address}</div>
              </div>
              <div className="price">${Number(r.price_per_hour).toFixed(0)}/h</div>
            </div>
          ))}
          {results.length === 0 && !loading && <p style={{ color: 'var(--muted)' }}>No hay resultados en este radio.</p>}
        </div>
      </section>

      <aside className="panel card">
        <h3 style={{ marginTop: 0 }}>Mapa</h3>
        <div ref={mapRef} className="mapbox" />
      </aside>
    </div>
  )
}
