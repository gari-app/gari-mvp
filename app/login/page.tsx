'use client'
import { useState } from 'react'
import { createClientBrowser } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendMagic() {
    setError(null)
    const supabase = createClientBrowser()
    const { error } = await supabase.auth.signInWithOtp({ 
      email, 
      options: { emailRedirectTo: `${window.location.origin}/app` } 
    })
    if (error) setError(error.message)
    else setSent(true)
  }

  return (
    <main style={{padding:24, maxWidth:420}}>
      <h2>Iniciar sesión</h2>
      {sent ? (
        <p>Te enviamos un enlace mágico a <strong>{email}</strong>. Revisá tu correo.</p>
      ) : (
        <div style={{display:'grid', gap:8}}>
          <input 
            type="email" 
            placeholder="tu@email.com" 
            value={email}
            onChange={e=>setEmail(e.target.value)} 
          />
          <button onClick={sendMagic} disabled={!email}>
            Enviar enlace mágico
          </button>
          {error && <p style={{color:'crimson'}}>Error: {error}</p>}
        </div>
      )}
    </main>
  )
}
