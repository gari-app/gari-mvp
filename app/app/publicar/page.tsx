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
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ title, price_per_hour: Number(price), location_address: address, lat: Number(lat), lng: Number(lng) })
    })
    const data = await res.json()
    setMsg(res.ok ? 'Guardado OK' : `Error: ${data?.error || 'desconocido'}`)
  }

  return (
    <section className="panel card">
      <h2 style={{marginTop:0}}>Publicar cochera</h2>
      <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
        <input className="input" placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="input" placeholder="Dirección" value={address} onChange={e=>setAddress(e.target.value)} />
        <input className="input" type="number" placeholder="Precio/hora" value={price} onChange={e=>setPrice(parseFloat(e.target.value))} />
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}}>
          <input className="input" type="number" placeholder="Lat" value={lat} onChange={e=>setLat(parseFloat(e.target.value))} />
          <input className="input" type="number" placeholder="Lng" value={lng} onChange={e=>setLng(parseFloat(e.target.value))} />
        </div>
      </div>
      <div style={{marginTop:12, display:'flex', gap:12}}>
        <button className="button button--primary" onClick={publicar}>Guardar</button>
        {msg && <span style={{opacity:.9}}>{msg}</span>}
      </div>
    </section>
  )
}
