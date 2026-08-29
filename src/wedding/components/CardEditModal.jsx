import { useState } from 'react'
import { useWedding } from '../../hooks/useWedding'

export default function CardEditModal({ cardKey, onClose }) {
  const { content, patchContent } = useWedding()
  const card = content.cards[cardKey]
  const [title, setTitle] = useState(card.title)
  const [desc, setDesc] = useState(card.desc)

  function save() {
    patchContent((prev) => ({ ...prev, cards: { ...prev.cards, [cardKey]: { title, desc } } }))
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 94, background: 'rgba(59,48,43,.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} className="wedding-fade">
      <div style={{ width: 'min(480px,100%)', background: '#faf6f3', padding: 'clamp(28px,4vw,44px)' }} className="wedding-rise">
        <p style={{ margin: '0 0 10px', font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.26em', textTransform: 'uppercase', color: '#b0736f' }}>Editar bloque</p>
        <h3 style={{ margin: '0 0 24px', fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 28, color: '#3b302b' }}>Título y texto</h3>
        <label style={{ display: 'block', margin: '0 0 8px', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: '#8a7167' }}>Título</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', border: 0, borderBottom: '1px solid rgba(59,48,43,.2)', background: 'none', padding: '11px 0', fontFamily: 'Jost, sans-serif', fontSize: 16, color: '#3b302b', outline: 'none' }} />
        <label style={{ display: 'block', margin: '24px 0 8px', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: '#8a7167' }}>Texto</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} style={{ width: '100%', border: '1px solid rgba(59,48,43,.15)', background: 'none', padding: 13, fontFamily: 'Jost, sans-serif', fontSize: 15, lineHeight: 1.7, color: '#3b302b', outline: 'none', resize: 'vertical' }} />
        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          <button onClick={save} style={{ flex: 1, border: 0, background: '#6b7355', color: '#f8f2e2', fontFamily: 'Jost, sans-serif', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', padding: 16, borderRadius: 99, cursor: 'pointer' }}>Guardar</button>
          <button onClick={onClose} style={{ border: '1px solid rgba(59,48,43,.2)', background: 'none', color: '#7a655d', fontFamily: 'Jost, sans-serif', fontSize: 12, letterSpacing: '.2em', textTransform: 'uppercase', padding: '16px 24px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap' }}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}
