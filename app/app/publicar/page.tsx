'use client'
import { useState } from 'react'

export default function PublicarPage() {
  const [title, setTitle] = useState('Cochera de prueba')
  const [price, setPrice] = useState(500)
  const [address, setAddress] = useState('Aguado 600, Castelar')
  const [lat, setLat] = useState(-34.6468)
  const [lng, setLng] = useState(-58.6501)
  const [msg, setMsg] = useState<string|undefined>()

  async function publicar() {
    setMsg(undefined)
    const res = await fetch('/api/spaces', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        title,
        price_per_hour: Number(price),
        location_address: address,
        lat: Number(lat),
        lng: Number(lng)
      })
    })
    const data = await res.json()
    setMsg(res.ok ? 'Guardado OK' : `Error: ${'{'}data?.error || 'desconocido'{'}'}`)
  }

  return (
    <main style={{padding:24}}>
      <h2>Publicar cochera</h2>
      <div style={{display:'grid', gap:8, maxWidth:420}}>
        <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
        <input placeholder="Dirección" value={address} onChange={e=>setAddress(e.target.value)} />
        <input type="number" placeholder="Precio/hora" value={price} onChange={e=>setPrice(parseFloat(e.target.value))} />
        <input type="number" placeholder="Lat" value={lat} onChange={e=>setLat(parseFloat(e.target.value))} />
        <input type="number" placeholder="Lng" value={lng} onChange={e=>setLng(parseFloat(e.target.value))} />
        <button onClick={publicar}>Guardar</button>
        {msg && <p>{msg}</p>}
      </div>
    </main>
  )
}
