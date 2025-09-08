'use client'
import { useState } from 'react'
import { createClientBrowser } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <main style={{padding:24, maxWidth:420}}>
      <h2>Iniciar sesión</h2>
      {sent ? (
        <p>Enviado a {email}</p>
      ) : (
        <div style={{display:'grid', gap:8}}>
          <input 
            type="email" 
            placeholder="tu@email.com" 
            value={email}
            onChange={e=>setEmail(e.target.value)} 
          />
          <button onClick={()=>setSent(true)}>
            Enviar enlace mágico
          </button>
        </div>
      )}
    </main>
  )
}
