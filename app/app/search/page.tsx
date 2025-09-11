'use client'
import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

type SpaceItem = {
  id: string
  title: string
  price_per_hour: number
  location_address: string
  lon?: number
  lat?: number
  meters?: number
}

export default function SearchPage() {
  // estado de búsqueda
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSug, setShowSug] = useState(false)

  // centro actual (se actualiza al elegir dirección o usar mi ubicación)
  const [lat, setLat] = useState(-34.6519)
  const [lng, setLng] = useState(-58.6525)
  const [radius, setRadius] = useState(500)

  // resultados
  const [results, setResults] = useState<SpaceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // mapa y marcadores
  const mapRef = useRef<HTMLDivElement | null>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const sugBoxRef = useRef<HTMLDivElement | null>(null)
  let sugTimer: any = null

  // init mapa 1 sola vez
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
  }, [])

  // helpers de geocoding (MapTiler)
  async function fetchSuggestions(q: string) {
    if (!q || q.length < 3) { setSuggestions([]); return }
    const url =
      `https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json` +
      `?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}&language=es&country=ar&limit=5`
    const res = await fetch(url)
    const data = await res.json()
    setSuggestions(data?.features || [])
  }

  function onType(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setQuery(v)
    setShowSug(true)
    if (sugTimer) clearTimeout(sugTimer)
    sugTimer = setTimeout(() => fetchSuggestions(v), 250)
  }

  function onPickPlace(f: any) {
    const [LNG, LAT] = f.center || []
    if (typeof LAT === 'number' && typeof LNG === 'number') {
      setLat(LAT)
      setLng(LNG)
      setQuery(f.place_name || f.text || '')
      setShowSug(false)
      map.current?.setCenter([LNG, LAT])
      buscar(LAT, LNG, radius)
    }
  }

  function handleClickOutside(e: MouseEvent) {
    if (sugBoxRef.current && !sugBoxRef.current.contains(e.target as Node)) {
      setShowSug(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  function useMyLocation() {
    if (!navigator.geolocation) return alert('Tu navegador no soporta geolocalización')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const LAT = pos.coords.latitude
        const LNG = pos.coords.longitude
        setLat(LAT); setLng(LNG)
        map.current?.setCenter([LNG, LAT])
        buscar(LAT, LNG, radius)
      },
      () => alert('No pudimos obtener tu ubicación'),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  async function buscar(latArg?: number, lngArg?: number, radiusArg?: number) {
    const LAT = typeof latArg === 'number' ? latArg : lat
    const LNG = typeof lngArg === 'number' ? lngArg : lng
    const RAD = typeof radiusArg === 'number' ? radiusArg : radius

    setLoading(true); setError(null)
    try {
      const res = await fetch(`/api/spaces/near?lat=${LAT}&lng=${LNG}&radius=${RAD}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error')
      setResults(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  // primera búsqueda al cargar
  useEffect(() => { buscar() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // pintar marcadores cuando cambian resultados o centro
  useEffect(() => {
    if (!map.current) return
    // limpiar anteriores
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
    // centrar
    map.current.setCenter([lng, lat])
    // agregar marcadores
    results.forEach((r) => {
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

  // cambio de radio (si cambia, re-buscar)
  useEffect(() => { buscar(lat, lng, radius) }, [radius]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grid-2">
      <section className="panel card">
        <h2 style={{ marginTop: 0 }}>Buscar cocheras</h2>

        {/* FORMULARIO */}
        <div className="grid" style={{ gridTemplateColumns: '1.4fr .8fr .8fr', position: 'relative' }}>
          {/* Dirección / lugar */}
          <label style={{ position: 'relative' }}>
            Destino (dirección o lugar)
            <input
              className="input"
              type="text"
              placeholder="Ej: Plaza Morón, shopping, calle y altura…"
              value={query}
              onChange={onType}
              onFocus={() => setShowSug(true)}
            />
            {showSug && suggestions.length > 0 && (
              <div
                ref={sugBoxRef}
                style={{
                  position: 'absolute', top: '64px', left: 0, right: 0, zIndex: 20,
                  background: '#0f1116', border: '1px solid rgba(255,255,255,.08)',
                  borderRadius: 12, overflow: 'hidden', boxShadow: '0 10px 24px rgba(0,0,0,.35)'
                }}>
                {suggestions.map((f: any) => (
                  <button
                    key={f.id}
                    onClick={() => onPickPlace(f)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 12px', background: 'transparent',
                      border: 'none', color: 'var(--text)', cursor: 'pointer'
                    }}>
                    {f.place_name || f.text}
                  </button>
                ))}
              </div>
            )}
          </label>

          {/* Radio */}
          <label>Radio (m)
            <select className="select" value={radius} onChange={e => setRadius(parseInt(e.target.value))}>
              <option value={300}>300</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </label>

          {/* Acciones */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <button className="button button--primary" onClick={() => buscar()} disabled={loading}>
              {loading ? 'Buscando…' : 'Buscar'}
            </button>
            <button className="button" onClick={useMyLocation}>Usar mi ubicación</button>
          </div>
        </div>

        {/* LISTA */}
        {error && <p style={{ color: 'crimson', marginTop: 12 }}>Error: {error}</p>}

        <div className="list" style={{ marginTop: 16 }}>
          {results.map((r) => (
            <div key={r.id} className="list-item">
              <div>
                <div style={{ fontWeight: 700 }}>{r.title}</div>
                <div style={{ color: 'var(--muted)' }}>{r.location_address}</div>
                {typeof r.meters === 'number' && (
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                    a {(r.meters / 100).toFixed(0)} cuadras aprox.
                  </div>
                )}
              </div>
              <div className="price">${Number(r.price_per_hour).toFixed(0)}/h</div>
            </div>
          ))}
          {results.length === 0 && !loading && <p style={{ color: 'var(--muted)' }}>No hay resultados en este radio.</p>}
        </div>
      </section>

      {/* MAPA */}
      <aside className="panel card">
        <h3 style={{ marginTop: 0 }}>Mapa</h3>
        <div ref={mapRef} className="mapbox" />
      </aside>
    </div>
  )
}
