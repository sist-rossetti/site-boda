import { useNavigate } from 'react-router-dom'
import { useWedding } from '../../hooks/useWedding'
import PhotoSlot from '../components/PhotoSlot'
import EditableText from '../components/EditableText'

export default function Pedacito() {
  const { content, admin, patchContent } = useWedding()
  const navigate = useNavigate()

  function updateSection(id, patch) {
    patchContent((prev) => ({ ...prev, pedacito: prev.pedacito.map((s) => (s.id === id ? { ...s, ...patch } : s)) }))
  }
  function removeSection(id) {
    patchContent((prev) => ({ ...prev, pedacito: prev.pedacito.filter((s) => s.id !== id) }))
  }
  function addSection() {
    patchContent((prev) => ({ ...prev, pedacito: [...prev.pedacito, { id: 'p' + Date.now(), kicker: 'Nueva sección', title: 'Título editable', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }] }))
  }

  return (
    <div style={{ paddingTop: 70 }} className="wedding-fade">
      <div style={{ padding: 'clamp(48px,7vw,96px) clamp(24px,5vw,72px) 0', textAlign: 'center' }}>
        <p style={{ margin: '0 0 16px', font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.26em', textTransform: 'uppercase', color: '#b0736f' }}>Capítulo tres</p>
        <EditableText
          as="h2"
          value={content.pedacitoHeader.title}
          onSave={(v) => patchContent((prev) => ({ ...prev, pedacitoHeader: { title: v } }))}
          style={{ margin: '0 0 clamp(40px,5vw,72px)', fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 'clamp(36px,5.2vw,76px)', color: '#3b302b' }}
        />
      </div>
      <div style={{ position: 'relative', height: 'clamp(340px,52vw,660px)', background: 'repeating-linear-gradient(135deg,#e9dcd6 0 14px,#e1d1ca 14px 28px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PhotoSlot slotKey="pedHero" label="foto grande a sangre · 2400×1200" replaceStyle={{ bottom: 14, left: 14 }} />
      </div>
      <div style={{ margin: '0 auto', maxWidth: 1100, padding: 'clamp(56px,7vw,110px) clamp(24px,5vw,72px) 0', display: 'flex', flexDirection: 'column', gap: 'clamp(56px,7vw,104px)' }}>
        {content.pedacito.map((s) => (
          <div key={s.id} className="wedding-twocol" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'center' }}>
            {admin && (
              <button onClick={() => removeSection(s.id)} style={{ position: 'absolute', top: -14, right: 0, zIndex: 6, border: '1px solid rgba(163,68,80,.4)', background: '#faf6f3', color: '#a34450', font: "10px/1 Jost, sans-serif", letterSpacing: '.14em', textTransform: 'uppercase', padding: '8px 13px', borderRadius: 99, cursor: 'pointer' }}>Eliminar sección</button>
            )}
            <div className="wedding-twocol-photo" style={{ position: 'relative', aspectRatio: '5/4', background: 'repeating-linear-gradient(135deg,#ece0da 0 12px,#e4d4cd 12px 24px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PhotoSlot slotKey={`ped-${s.id}`} label={s.kicker} replaceStyle={{ bottom: 10, left: 10 }} />
            </div>
            <div>
              <p style={{ margin: '0 0 14px', font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.26em', textTransform: 'uppercase', color: '#b0736f' }}>{s.kicker}</p>
              <EditableText as="h3" value={s.title} onSave={(v) => updateSection(s.id, { title: v })} style={{ margin: '0 0 18px', fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 'clamp(26px,2.9vw,38px)', color: '#3b302b' }} />
              <EditableText as="p" value={s.body} onSave={(v) => updateSection(s.id, { body: v })} style={{ margin: 0, fontSize: 15, lineHeight: 1.95, color: '#6d5c55', textWrap: 'pretty' }} />
            </div>
          </div>
        ))}
        {admin && (
          <button onClick={addSection} style={{ border: '1px dashed rgba(59,48,43,.3)', background: 'none', color: '#8a7167', fontFamily: 'Jost, sans-serif', fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', padding: 34, cursor: 'pointer' }}>+ Agregar sección foto + texto</button>
        )}
      </div>
      <footer style={{ marginTop: 'clamp(72px,9vw,130px)', padding: 'clamp(56px,7vw,96px) 24px', textAlign: 'center', background: 'linear-gradient(to bottom,#faf6f3,#f2d9d8)' }}>
        <button onClick={() => { navigate('/'); window.scrollTo(0, 0) }} className="wedding-back-btn" style={{ border: '1px solid #5c433e', background: 'none', color: '#5c433e', fontFamily: 'Jost, sans-serif', fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', padding: '15px 44px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap' }}>Volver al inicio</button>
      </footer>
    </div>
  )
}
