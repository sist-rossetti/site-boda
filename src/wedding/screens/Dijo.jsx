import { useNavigate } from 'react-router-dom'
import { useWedding } from '../../hooks/useWedding'
import PhotoSlot from '../components/PhotoSlot'
import EditableText from '../components/EditableText'
import BloomField from '../components/BloomField'

export default function Dijo() {
  const { content, admin, patchContent } = useWedding()
  const navigate = useNavigate()

  function addTile() {
    patchContent((prev) => ({ ...prev, dijoTiles: [...prev.dijoTiles, { id: 'dt' + Date.now() }] }))
  }
  function removeTile(id) {
    patchContent((prev) => ({ ...prev, dijoTiles: prev.dijoTiles.filter((t) => t.id !== id) }))
  }

  return (
    <div style={{ paddingTop: 70 }} className="wedding-fade">
      <div style={{ padding: 'clamp(48px,7vw,96px) clamp(24px,5vw,72px) 0', textAlign: 'center' }}>
        <p style={{ margin: '0 0 16px', font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.26em', textTransform: 'uppercase', color: '#b0736f' }}>Capítulo dos</p>
        <EditableText
          as="h2"
          value={content.dijo.title}
          onSave={(v) => patchContent((prev) => ({ ...prev, dijo: { ...prev.dijo, title: v } }))}
          style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 'clamp(40px,5.6vw,80px)', color: '#3b302b' }}
        />
      </div>

      <div style={{ maxWidth: 1100, margin: 'clamp(40px,6vw,72px) auto 0', padding: '0 clamp(24px,5vw,72px)' }}>
        <section className="wedding-twocol" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'clamp(420px,46vw,560px)' }}>
          <div className="wedding-twocol-photo" style={{ position: 'relative', background: 'repeating-linear-gradient(135deg,#e9dcd6 0 12px,#e1d1ca 12px 24px)', display: 'flex', alignItems: 'flex-end', padding: 26 }}>
            <PhotoSlot slotKey="dijoPhoto" label="la propuesta · 1200×1500" replaceStyle={{ top: 18, right: 18 }} />
          </div>
          <div style={{ position: 'relative', overflow: 'hidden', background: '#e8cdc9', display: 'flex', alignItems: 'center', padding: 'clamp(36px,5vw,78px)' }}>
            <BloomField />
            <div style={{ position: 'relative', maxWidth: '40ch' }}>
              <p style={{ margin: '0 0 18px', font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.26em', textTransform: 'uppercase', color: '#8d5652' }}>Los novios</p>
              <EditableText
                as="p"
                value={content.dijo.lead}
                onSave={(v) => patchContent((prev) => ({ ...prev, dijo: { ...prev.dijo, lead: v } }))}
                style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 'clamp(22px,2.3vw,33px)', lineHeight: 1.4, color: '#4a352f' }}
              />
            </div>
          </div>
        </section>
      </div>

      <section style={{ margin: '0 auto', maxWidth: 1100, padding: 'clamp(64px,8vw,120px) clamp(24px,5vw,72px)' }}>
        <EditableText
          as="p"
          value={content.dijo.quote}
          onSave={(v) => patchContent((prev) => ({ ...prev, dijo: { ...prev.dijo, quote: v } }))}
          style={{ margin: '0 0 30px', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(26px,3vw,40px)', lineHeight: 1.45, color: '#4a352f' }}
        />
        <EditableText
          as="p"
          value={content.dijo.body}
          onSave={(v) => patchContent((prev) => ({ ...prev, dijo: { ...prev.dijo, body: v } }))}
          style={{ margin: 0, fontSize: 17, lineHeight: 2, color: '#6d5c55', textWrap: 'pretty' }}
        />
      </section>

      <section className="wedding-phototiles" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(24px,5vw,72px) clamp(64px,8vw,110px)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {content.dijoTiles.map((tile, i) => (
          <div key={tile.id} style={{ position: 'relative', aspectRatio: '1', background: 'repeating-linear-gradient(135deg,#ece0da 0 12px,#e4d4cd 12px 24px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PhotoSlot slotKey={`dijo-tile-${tile.id}`} label={String(i + 1).padStart(2, '0')} replaceStyle={{ bottom: 9, left: 9 }} />
            {admin && (
              <button onClick={() => removeTile(tile.id)} style={{ position: 'absolute', top: 9, right: 9, zIndex: 5, border: 0, width: 24, height: 24, borderRadius: 99, background: 'rgba(163,68,80,.9)', color: '#f6ece7', font: '12px/1 Jost, sans-serif', cursor: 'pointer' }}>×</button>
            )}
          </div>
        ))}
        {admin && (
          <button onClick={addTile} style={{ aspectRatio: '1', border: '1px dashed rgba(59,48,43,.3)', background: 'none', color: '#8a7167', fontFamily: 'Jost, sans-serif', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', cursor: 'pointer' }}>+ Foto</button>
        )}
      </section>

      <footer style={{ padding: 'clamp(56px,7vw,96px) 24px', textAlign: 'center', background: 'linear-gradient(to bottom,#faf6f3,#f2d9d8)' }}>
        <button onClick={() => { navigate('/'); window.scrollTo(0, 0) }} className="wedding-back-btn" style={{ border: '1px solid #5c433e', background: 'none', color: '#5c433e', fontFamily: 'Jost, sans-serif', fontSize: 11, letterSpacing: '.24em', textTransform: 'uppercase', padding: '15px 44px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap' }}>Volver al inicio</button>
      </footer>
    </div>
  )
}
