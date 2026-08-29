import { useState } from 'react'
import { useWedding } from '../../hooks/useWedding'

export default function GuestForm({ onClose }) {
  const { addPhotos, addNote } = useWedding()
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [picked, setPicked] = useState([])
  const [overflow, setOverflow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  function onFiles(e) {
    const files = Array.from(e.target.files || [])
    setPicked(files.slice(0, 15))
    setOverflow(files.length > 15)
  }

  async function submit() {
    if (busy) return
    setBusy(true)
    setError('')
    const author = name.trim() || 'Invitado'
    try {
      if (picked.length) await addPhotos(picked, author)
      if (msg.trim()) await addNote(msg.trim(), author)
      onClose(true)
    } catch {
      setError('No se pudo enviar. Probá de nuevo en un momento.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(59,48,43,.42)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} className="wedding-fade">
      <div style={{ width: 'min(560px,100%)', maxHeight: '88vh', overflow: 'auto', background: '#faf6f3', padding: 'clamp(30px,4vw,52px)' }} className="wedding-rise">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
          <div>
            <p style={{ margin: '0 0 10px', font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.26em', textTransform: 'uppercase', color: '#b0736f' }}>Para los novios</p>
            <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 34, color: '#3b302b' }}>Dejá tu recuerdo</h3>
          </div>
          <button onClick={() => onClose(false)} style={{ border: 0, background: 'none', font: '300 26px/1 Jost, sans-serif', color: '#8a7167', cursor: 'pointer' }}>×</button>
        </div>
        <label style={{ display: 'block', margin: '34px 0 8px', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: '#8a7167' }}>Tu nombre</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y apellido" style={{ width: '100%', border: 0, borderBottom: '1px solid rgba(59,48,43,.2)', background: 'none', padding: '12px 0', fontFamily: 'Jost, sans-serif', fontSize: 16, color: '#3b302b', outline: 'none' }} />
        <label style={{ display: 'block', margin: '28px 0 8px', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: '#8a7167' }}>Mensaje</label>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} placeholder="Un mensaje para Miqueas y Florencia" style={{ width: '100%', border: '1px solid rgba(59,48,43,.15)', background: 'none', padding: 14, fontFamily: 'Jost, sans-serif', fontSize: 15, lineHeight: 1.7, color: '#3b302b', outline: 'none', resize: 'vertical' }} />
        <label style={{ display: 'flex', justifyContent: 'space-between', margin: '28px 0 8px', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: '#8a7167' }}><span>Fotos</span><span>{picked.length} / 15</span></label>
        <input type="file" accept="image/*" multiple onChange={onFiles} style={{ width: '100%', fontFamily: 'Jost, sans-serif', fontSize: 13, color: '#6d5c55' }} />
        <p style={{ margin: '10px 0 0', fontSize: 12, color: '#a08d85' }}>Máximo 15 fotos por invitado.</p>
        {overflow && <p style={{ margin: '10px 0 0', fontSize: 12, color: '#b0392f' }}>Elegiste más de 15 fotos. Se subirán solo las primeras 15.</p>}
        {error && <p style={{ margin: '10px 0 0', fontSize: 12, color: '#b0392f' }}>{error}</p>}
        <div style={{ display: 'flex', gap: 12, marginTop: 34 }}>
          <button onClick={submit} disabled={busy} style={{ flex: 1, border: 0, background: '#3b302b', color: '#f6ece7', fontFamily: 'Jost, sans-serif', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', padding: 17, borderRadius: 99, cursor: 'pointer' }}>{busy ? 'Enviando…' : 'Enviar'}</button>
          <button onClick={() => onClose(false)} style={{ border: '1px solid rgba(59,48,43,.2)', background: 'none', color: '#7a655d', fontFamily: 'Jost, sans-serif', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', padding: '17px 26px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap' }}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
