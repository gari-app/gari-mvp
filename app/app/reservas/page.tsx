'use client'
import { useEffect, useState } from 'react'

export default function MisReservas() {
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async ()=>{
      try{
        const res = await fetch('/api/reservations/mine')
        const data = await res.json()
        if(!res.ok) throw new Error(data?.error || 'Error')
        setItems(data)
      }catch(e:any){ setError(e.message) }
    })()
  }, [])

  return (
    <section className="panel card">
      <h2 style={{marginTop:0}}>Mis reservas</h2>
      {error && <p style={{color:'var(--danger)'}}>Error: {error}</p>}
      <div className="list">
        {items.map((it)=>(
          <div key={it.id} className="list-item">
            <div>
              <div style={{fontWeight:700}}>{it.spaces?.title}</div>
              <div style={{color:'var(--muted)'}}>
                {new Date(it.starts_at).toLocaleString()} → {new Date(it.ends_at).toLocaleString()}
              </div>
            </div>
            <span>{it.status}</span>
          </div>
        ))}
        {items.length===0 && !error && <p style={{color:'var(--muted)'}}>No tenés reservas todavía.</p>}
      </div>
    </section>
  )
}
