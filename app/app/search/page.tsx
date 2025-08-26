'use client'
import { useState } from 'react'

export default function SearchPage() {
  const [lat, setLat] = useState(-34.6519) // Castelar aprox
  const [lng, setLng] = useState(-58.6525)
  const [radius, setRadius] = useState(500)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function buscar() {
    setLoading(true); setError(null)
    try {
      const url = `/api/spaces/near?lat=${lat}&lng=${lng}&radius=${radius}`
      const res = await fetch(url)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error desconocido')
      setResults(data)
    } catch (e:any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <main style={{padding:24}}>
      <h2>Buscar cocheras</h2>
      <div style={{display:'grid', gap:8, maxWidth:420, marginBottom:16}}>
        <label>Latitud <input type="number" value={lat} onChange={e=>setLat(parseFloat(e.target.value))}/></label>
        <label>Longitud <input type="number" value={lng} onChange={e=>setLng(parseFloat(e.target.value))}/></label>
        <label>Radio (m) <input type="number" value={radius} onChange={e=>setRadius(parseInt(e.target.value))}/></label>
        <button onClick={buscar} disabled={loading}>{loading? 'Buscando…':'Buscar'}</button>
      </div>
      {error && <p style={{color:'crimson'}}>Error: {error}</p>}
      <ul>
        {results.map((r)=> (
          <li key={r.id} style={{marginBottom:8}}>
            <strong>{r.title}</strong> — ${'{'}r.price_per_hour{'}'} — {r.location_address}
          </li>
        ))}
      </ul>
    </main>
  )
}
