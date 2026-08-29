import { useEffect } from 'react'
import { useWedding } from '../../hooks/useWedding'
import { getDownloadUrl } from '../../lib/cloudinary'

export default function Lightbox() {
  const { photos, lightbox, setLightbox } = useWedding()
  const photo = photos[lightbox]
  const open = lightbox >= 0 && !!photo

  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') setLightbox(-1)
      if (e.key === 'ArrowLeft') setLightbox((lightbox - 1 + photos.length) % photos.length)
      if (e.key === 'ArrowRight') setLightbox((lightbox + 1) % photos.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, lightbox, photos.length, setLightbox])

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(40,33,29,.94)', display: 'flex', flexDirection: 'column' }} className="wedding-fade">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 26px', color: '#f6ece7' }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', opacity: 0.75 }}>{photo.author} · {lightbox + 1} / {photos.length}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href={getDownloadUrl(photo.src)} style={{ border: '1px solid rgba(246,236,231,.35)', color: '#f6ece7', font: '11px/1 Jost, sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', padding: '10px 16px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none' }}>↓ Descargar</a>
          <button onClick={() => setLightbox(-1)} style={{ border: 0, background: 'none', color: '#f6ece7', font: '300 26px/1 Jost, sans-serif', cursor: 'pointer' }}>×</button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '0 18px 40px', minHeight: 0 }}>
        <button onClick={() => setLightbox((lightbox - 1 + photos.length) % photos.length)} style={{ flex: 'none', border: '1px solid rgba(246,236,231,.3)', background: 'none', color: '#f6ece7', width: 46, height: 46, borderRadius: 99, font: '300 20px/1 Jost, sans-serif', cursor: 'pointer' }}>‹</button>
        <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src={photo.src} alt="" style={{ maxWidth: '100%', maxHeight: '78vh', objectFit: 'contain', display: 'block' }} />
        </div>
        <button onClick={() => setLightbox((lightbox + 1) % photos.length)} style={{ flex: 'none', border: '1px solid rgba(246,236,231,.3)', background: 'none', color: '#f6ece7', width: 46, height: 46, borderRadius: 99, font: '300 20px/1 Jost, sans-serif', cursor: 'pointer' }}>›</button>
      </div>
    </div>
  )
}
