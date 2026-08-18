'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendReset() {
    setMessage('')
    setError('')
    if (!email.trim()) {
      setError('Introduza o seu email.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback?next=/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setMessage('Se existir uma conta com este email, receberá uma mensagem para definir uma nova password. Verifique também a pasta de spam.')
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand-kicker" style={{ color: 'var(--petrol)' }}>Academia</div>
        <h1>Recuperar password</h1>
        <p className="muted">Introduza o email associado à sua conta.</p>

        <label className="field">
          Email
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" autoComplete="email" />
        </label>

        <button className="btn" onClick={sendReset} disabled={loading} style={{ width: '100%', marginTop: 18 }}>
          {loading ? 'A enviar…' : 'Enviar email de recuperação'}
        </button>

        {message && <p style={{ color: '#285b49', fontSize: 13, marginTop: 14 }}>{message}</p>}
        {error && <p style={{ color: '#8a2a2a', fontSize: 13, marginTop: 14 }}>{error}</p>}

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link href="/login" style={{ color: 'var(--petrol)', fontSize: 13, fontWeight: 600 }}>Voltar ao login</Link>
        </div>
      </div>
    </div>
  )
}
