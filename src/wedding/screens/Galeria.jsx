import { useRef, useState } from 'react'
import { useWedding } from '../../hooks/useWedding'
import GuestForm from '../components/GuestForm'
import { getThumbUrl, getDownloadUrl } from '../../lib/cloudinary'

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'recién'
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.floor(h / 24)
  return d === 1 ? 'ayer' : `hace ${d} días`
}

export default function Galeria() {
  const { admin, photos, notes, addPhotos, replacePhoto, removePhoto, removeNote, setLightbox, formOpen, setFormOpen } = useWedding()
  const [tab, setTab] = useState('fotos')
  const adminInputRef = useRef(null)
  const replaceInputRef = useRef(null)
  const [replacingId, setReplacingId] = useState(null)

  return (
    <div style={{ paddingTop: 70, minHeight: '100vh' }} className="wedding-fade">
      <div style={{ padding: 'clamp(44px,6vw,80px) clamp(24px,5vw,64px) 0', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
        <div>
          <p style={{ margin: '0 0 12px', font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.26em', textTransform: 'uppercase', color: '#b0736f' }}>De ustedes para nosotros</p>
          <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 'clamp(38px,5vw,72px)', color: '#3b302b' }}>Galería</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => setTab('fotos')} style={{ border: '1px solid rgba(59,48,43,.18)', background: 'none', fontFamily: 'Jost, sans-serif', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap', color: '#3b302b' }}>Fotos · {photos.length}</button>
          <button onClick={() => setTab('notas')} style={{ border: '1px solid rgba(59,48,43,.18)', background: 'none', fontFamily: 'Jost, sans-serif', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap', color: '#6b7355' }}>Notas · {notes.length}</button>
          <button onClick={() => alert(`Se descargarían ${photos.length} fotos en un .zip`)} style={{ border: '1px solid rgba(59,48,43,.18)', background: 'none', fontFamily: 'Jost, sans-serif', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap', color: '#7a655d' }}>↓ Descargar todo</button>
          {admin && (
            <>
              <button onClick={() => adminInputRef.current?.click()} style={{ border: 0, background: '#3b302b', color: '#f6ece7', fontFamily: 'Jost, sans-serif', fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Agregar fotos</button>
              <input ref={adminInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => {
                const files = Array.from(e.target.files || []).slice(0, 15)
                if (files.length) addPhotos(files, 'Los novios').catch((err) => alert('No se pudieron subir las fotos: ' + err.message))
                e.target.value = ''
              }} />
            </>
          )}
        </div>
      </div>
      <div style={{ padding: '8px clamp(24px,5vw,64px) 0', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a08d85' }}>
        {tab === 'fotos' ? 'Las fotos se publican al instante' : 'Mensajes de los invitados'}
      </div>

      {tab === 'fotos' && (
        <div className="wedding-galgrid" style={{ padding: 'clamp(28px,4vw,52px) clamp(24px,5vw,64px) 160px' }}>
          {photos.map((p, i) => (
            <figure key={p.id} className="wedding-rise" style={{ margin: 0, minWidth: 0, position: 'relative' }}>
              <button onClick={() => setLightbox(i)} style={{ width: '100%', padding: 0, border: 0, cursor: 'zoom-in', aspectRatio: '1', background: 'repeating-linear-gradient(135deg,#ece0da 0 12px,#e4d4cd 12px 24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {p.src
                  ? <img src={getThumbUrl(p.src)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <span style={{ font: "9px/1 ui-monospace, Menlo, monospace", letterSpacing: '.12em', textTransform: 'uppercase', color: '#9a8178' }}>invitado</span>}
              </button>
              <figcaption style={{ display: 'flex', justifyContent: 'space-between', gap: 6, padding: '7px 2px 0', fontSize: 10, letterSpacing: '.06em', color: '#8a7167' }}>
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.author}{p.created_at ? ` · ${timeAgo(p.created_at)}` : ''}</span>
                <a href={getDownloadUrl(p.src)} onClick={(e) => e.stopPropagation()} title="Descargar" style={{ flex: 'none', color: '#8a7167', font: '11px/1 Jost, sans-serif', cursor: 'pointer', padding: 0, textDecoration: 'none' }}>↓</a>
              </figcaption>
              {admin && (
                <>
                  <button onClick={() => { setReplacingId(p.id); replaceInputRef.current?.click() }} style={{ position: 'absolute', top: 10, right: 44, border: 0, height: 28, padding: '0 11px', borderRadius: 99, background: 'rgba(59,48,43,.85)', color: '#f6ece7', font: '10px/1 Jost, sans-serif', cursor: 'pointer' }}>Reemplazar</button>
                  <button onClick={() => removePhoto(p.id).catch((err) => alert('No se pudo borrar la foto: ' + err.message))} style={{ position: 'absolute', top: 10, right: 10, border: 0, width: 28, height: 28, borderRadius: 99, background: 'rgba(59,48,43,.85)', color: '#f6ece7', font: '14px/1 Jost, sans-serif', cursor: 'pointer' }}>×</button>
                </>
              )}
            </figure>
          ))}
          <input ref={replaceInputRef} type="file" accept="image/*" hidden onChange={(e) => {
            const f = e.target.files?.[0]
            if (f && replacingId) replacePhoto(replacingId, f).catch((err) => alert('No se pudo reemplazar la foto: ' + err.message))
            e.target.value = ''
            setReplacingId(null)
          }} />
        </div>
      )}

      {tab === 'notas' && (
        <div className="wedding-notesgrid" style={{ padding: 'clamp(28px,4vw,52px) clamp(24px,5vw,64px) 160px' }}>
          {notes.map((n) => (
            <div key={n.id} className="wedding-rise" style={{ breakInside: 'avoid', margin: '0 0 16px', position: 'relative', padding: '26px 24px', background: '#7e8c54', borderRadius: 2 }}>
              <p style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: 'italic', fontSize: 18, lineHeight: 1.55, color: '#f7f4e8' }}>{n.text}</p>
              <p style={{ margin: '18px 0 0', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(247,244,232,.75)' }}>{n.author}</p>
              {admin && (
                <button onClick={() => removeNote(n.id).catch((err) => alert('No se pudo borrar la nota: ' + err.message))} style={{ position: 'absolute', top: 10, right: 10, border: 0, width: 24, height: 24, borderRadius: 99, background: 'rgba(58,66,36,.8)', color: '#f7f4e8', font: '13px/1 Jost, sans-serif', cursor: 'pointer' }}>×</button>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setFormOpen(true)}
        title="Subir fotos y dejar una nota"
        className="wedding-fab"
        style={{ position: 'fixed', right: 34, bottom: 34, zIndex: 65, width: 64, height: 64, borderRadius: 99, border: 0, background: '#6b7355', color: '#f8f2e2', font: '300 30px/1 Jost, sans-serif', cursor: 'pointer', boxShadow: '0 10px 30px rgba(59,48,43,.28)' }}
      >
        +
      </button>

      {formOpen && <GuestForm onClose={() => setFormOpen(false)} />}
    </div>
  )
}
