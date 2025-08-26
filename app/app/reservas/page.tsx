'use client'
import { useEffect, useState } from 'react'

export default function MisReservas() {
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/reservations/mine')
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Error')
        setItems(data)
      } catch (e:any) {
        setError(e.message)
      }
    }
    load()
  }, [])

  return (
    <main style={{padding:24}}>
      <h2>Mis reservas</h2>
      {error && <p style={{color:'crimson'}}>Error: {error}</p>}
      <ul>
        {items.map((it)=> (
          <li key={it.id}>
            {it.spaces?.title} — {new Date(it.starts_at).toLocaleString()} → {new Date(it.ends_at).toLocaleString()} — {it.status}
          </li>
        ))}
      </ul>
    </main>
  )
}
