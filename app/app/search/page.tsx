'use client'
import { useState, useEffect, useRef } from 'react'
import Map from '@/components/Map' // lo integramos en el paso 3

export default function SearchPage() {
  const [lat, setLat] = useState(-34.6519)
  const [lng, setLng] = useState(-58.6525)
  const [radius, setRadius] = useState(500)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function buscar() {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`/api/spaces/near?lat=${lat}&lng=${lng}&radius=${radius}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error')
      setResults(data)
    } catch (e:any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  useEffect(()=>{ buscar() }, []) // primera carga

  return (
    <div className="grid-2">
      <section className="panel card">
        <h2 style={{marginTop:0}}>Buscar cocheras</h2>
        <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          <label>Latitud <input className="input" type="number" value={lat} onChange={e=>setLat(parseFloat(e.target.value))}/></label>
          <label>Longitud <input className="input" type="number" value={lng} onChange={e=>setLng(parseFloat(e.target.value))}/></label>
          <label>Radio (m)
            <select className="select" value={radius} onChange={e=>setRadius(parseInt(e.target.value))}>
              <option value={300}>300</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </label>
        </div>
        <div style={{display:'flex', gap:12, marginTop:12}}>
          <button className="button button--primary" onClick={buscar} disabled={loading}>{loading?'Buscando…':'Buscar'}</button>
        </div>

        {error && <p style={{color:'crimson', marginTop:12}}>Error: {error}</p>}

        <div className="list" style={{marginTop:16}}>
          {results.map((r)=>(
            <div key={r.id} className="list-item">
              <div>
                <div style={{fontWeight:700}}>{r.title}</div>
                <div style={{color:'var(--muted)'}}>{r.location_address}</div>
              </div>
              <div className="price">${Number(r.price_per_hour).toFixed(0)}/h</div>
            </div>
          ))}
          {results.length===0 && !loading && <p style={{color:'var(--muted)'}}>No hay resultados en este radio.</p>}
        </div>
      </section>

      <aside className="panel card">
        <h3 style={{marginTop:0}}>Mapa</h3>
        {/* Paso 3: reemplazamos este div por <Map .../> con marcadores */}
        <div className="mapbox" id="mapbox-placeholder" />
      </aside>
    </div>
  )
}
