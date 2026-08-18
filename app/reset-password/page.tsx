'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setError('A ligação de recuperação não é válida ou já expirou. Peça um novo email de recuperação.')
      }
      setReady(true)
    })
  }, [])

  async function updatePassword() {
    setError('')
    setMessage('')

    if (password.length < 8) {
      setError('A nova password deve ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As passwords não coincidem.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    await supabase.auth.signOut()
    setMessage('Password alterada com sucesso. A encaminhar para o login…')
    setTimeout(() => { window.location.href = '/login?reset=success' }, 1000)
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand-kicker" style={{ color: 'var(--petrol)' }}>Academia</div>
        <h1>Definir nova password</h1>
        <p className="muted">Escolha uma nova password para a sua conta.</p>

        {!ready ? <p className="muted">A validar ligação…</p> : (
          <>
            <label className="field">
              Nova password
              <input value={password} onChange={e => setPassword(e.target.value)} type="password" autoComplete="new-password" disabled={!!error && !message} />
            </label>

            <label className="field">
              Confirmar password
              <input value={confirm} onChange={e => setConfirm(e.target.value)} type="password" autoComplete="new-password" disabled={!!error && !message && !password} />
            </label>

            <button className="btn" onClick={updatePassword} disabled={loading || !ready} style={{ width: '100%', marginTop: 18 }}>
              {loading ? 'A guardar…' : 'Guardar nova password'}
            </button>
          </>
        )}

        {message && <p style={{ color: '#285b49', fontSize: 13, marginTop: 14 }}>{message}</p>}
        {error && <p style={{ color: '#8a2a2a', fontSize: 13, marginTop: 14 }}>{error}</p>}
      </div>
    </div>
  )
}
