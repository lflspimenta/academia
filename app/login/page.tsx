'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setMsg('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setMsg(error.message)
      return
    }
    window.location.href = '/dashboard'
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand-kicker" style={{ color: 'var(--petrol)' }}>Academia</div>
        <h1>Imobiliária</h1>
        <p className="muted">Entre na sua área de formação.</p>

        <label className="field">
          Email
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" />
        </label>

        <label className="field">
          Password
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="current-password" />
        </label>

        <button className="btn" onClick={submit} disabled={loading} style={{ width: '100%', marginTop: 18 }}>
          {loading ? 'A entrar…' : 'Entrar'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <Link href="/forgot-password" style={{ color: 'var(--petrol)', fontSize: 13, fontWeight: 600 }}>
            Esqueceu-se da password?
          </Link>
        </div>

        {msg && <p style={{ color: '#8a2a2a', fontSize: 13 }}>{msg}</p>}
        <p className="muted" style={{ fontSize: 12, marginTop: 18 }}>Na V1 os utilizadores são criados pelo administrador.</p>
      </div>
    </div>
  )
}
