'use client'
import { useEffect, useState } from 'react'
import { createClientBrowser } from '@/lib/supabase'

export default function HeaderApp(){
  const supabase = createClientBrowser()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=> setEmail(data.user?.email ?? null))
  },[])

  async function signOut(){ await supabase.auth.signOut(); window.location.href='/' }

  return (
    <div style={{display:'flex', gap:12, alignItems:'center', padding:12, borderBottom:'1px solid #eee'}}>
      <a href="/app" style={{fontWeight:600}}>GARI</a>
      <div style={{marginLeft:'auto'}}>
        {email ? (<>
          <span style={{marginRight:8}}>{email}</span>
          <button onClick={signOut}>Salir</button>
        </>) : (<a href="/login">Iniciar sesión</a>)}
      </div>
    </div>
  )
}
