import { useState } from 'react'
import { useWedding } from '../../hooks/useWedding'

export default function LoginModal({ onClose }) {
  const { login } = useWedding()
  const [pass, setPass] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  async function attempt() {
    if (busy) return
    setBusy(true)
    const ok = await login(pass)
    setBusy(false)
    if (ok) { setPass(''); setError(false); onClose() }
    else setError(true)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 92, background: 'rgba(59,48,43,.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} className="wedding-fade">
      <div style={{ width: 'min(400px,100%)', background: '#faf6f3', padding: 'clamp(28px,4vw,44px)' }} className="wedding-rise">
        <p style={{ margin: '0 0 10px', font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.26em', textTransform: 'uppercase', color: '#b0736f' }}>Acceso restringido</p>
        <h3 style={{ margin: '0 0 6px', fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 30, color: '#3b302b' }}>Modo administrador</h3>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: '#8a7167' }}>Solo Miqueas y Florencia pueden editar el sitio.</p>
        <input
          type="password"
          value={pass}
          onChange={(e) => { setPass(e.target.value); setError(false) }}
          onKeyDown={(e) => { if (e.key === 'Enter') attempt() }}
          placeholder="Contraseña"
          style={{ width: '100%', marginTop: 26, border: 0, borderBottom: '1px solid rgba(59,48,43,.2)', background: 'none', padding: '12px 0', fontFamily: 'Jost, sans-serif', fontSize: 16, color: '#3b302b', outline: 'none' }}
        />
        {error && <p style={{ margin: '10px 0 0', fontSize: 12, color: '#a34450' }}>Contraseña incorrecta.</p>}
        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          <button onClick={attempt} disabled={busy} style={{ flex: 1, border: 0, background: '#6b7355', color: '#f8f2e2', fontFamily: 'Jost, sans-serif', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', padding: 16, borderRadius: 99, cursor: 'pointer' }}>Entrar</button>
          <button onClick={onClose} style={{ border: '1px solid rgba(59,48,43,.2)', background: 'none', color: '#7a655d', fontFamily: 'Jost, sans-serif', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', padding: '16px 24px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap' }}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
