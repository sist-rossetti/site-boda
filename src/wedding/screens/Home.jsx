import { useNavigate, useOutletContext } from 'react-router-dom'
import { useWedding } from '../../hooks/useWedding'
import PhotoSlot from '../components/PhotoSlot'
import EditableText from '../components/EditableText'
import BloomField from '../components/BloomField'

export default function Home() {
  const { content, admin, patchContent } = useWedding()
  const { setCardEditing } = useOutletContext()
  const navigate = useNavigate()

  function go(path) { navigate(path); window.scrollTo(0, 0) }

  function addHomeTile() {
    patchContent((prev) => ({ ...prev, homeTiles: [...prev.homeTiles, { id: 'ht' + Date.now() }] }))
  }
  function removeHomeTile(id) {
    patchContent((prev) => ({ ...prev, homeTiles: prev.homeTiles.filter((t) => t.id !== id) }))
  }

  const cardTargets = { '01': '/nuestra-historia', '02': '/dijo-que-si', '03': '/un-pedacito' }

  return (
    <div className="wedding-fade">
      <header style={{ position: 'relative', height: '100vh', minHeight: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(135deg,#e9dcd6 0 14px,#e1d1ca 14px 28px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '96px 30px 0' }}>
          <PhotoSlot slotKey="cover" label="foto de portada · 2400×1600" replaceStyle={{ position: 'absolute', top: 88, left: 30, zIndex: 5 }} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '46%', background: 'linear-gradient(to bottom,rgba(250,240,240,0) 0%,rgba(250,236,236,.55) 45%,rgba(249,231,232,.92) 78%,#faf6f3 100%)' }} />
        <div style={{ position: 'relative', width: '100%', maxWidth: 1100, margin: '0 auto', textAlign: 'center', padding: '0 24px' }}>
          <EditableText
            as="p"
            value={content.hero.kicker}
            onSave={(v) => patchContent((prev) => ({ ...prev, hero: { ...prev.hero, kicker: v } }))}
            style={{ margin: '0 0 22px', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: 'clamp(20px,2.2vw,28px)', color: '#ffffff', textShadow: '0 2px 14px rgba(40,30,26,.45),0 1px 3px rgba(40,30,26,.35)' }}
          />
          <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 400, lineHeight: 1.02, color: '#ffffff', textShadow: '0 2px 14px rgba(40,30,26,.45),0 1px 3px rgba(40,30,26,.35)' }}>
            <EditableText
              as="span"
              value={content.hero.name1}
              onSave={(v) => patchContent((prev) => ({ ...prev, hero: { ...prev.hero, name1: v } }))}
              style={{ display: 'block', whiteSpace: 'nowrap', fontSize: 'clamp(44px,8vw,124px)' }}
            />
            <span style={{ display: 'block', whiteSpace: 'nowrap', fontSize: 'clamp(44px,8vw,124px)' }}>
              <span style={{ opacity: 0.85 }}>&amp;</span>{' '}
              <EditableText
                as="span"
                value={content.hero.name2}
                onSave={(v) => patchContent((prev) => ({ ...prev, hero: { ...prev.hero, name2: v } }))}
                style={{ display: 'inline' }}
              />
            </span>
          </h1>
          <div style={{ width: 64, height: 1, background: 'rgba(255,255,255,.75)', margin: '34px auto 26px' }} />
          <EditableText
            as="p"
            value={content.hero.date}
            onSave={(v) => patchContent((prev) => ({ ...prev, hero: { ...prev.hero, date: v } }))}
            style={{ margin: 0, fontSize: 12, letterSpacing: '.34em', textTransform: 'uppercase', color: '#ffffff', textShadow: '0 2px 14px rgba(40,30,26,.45),0 1px 3px rgba(40,30,26,.35)' }}
          />
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(24px,5vw,72px)' }}>
        <section className="wedding-cardgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(59,48,43,.1)', borderTop: '1px solid rgba(59,48,43,.1)', borderBottom: '1px solid rgba(59,48,43,.1)' }}>
          {['01', '02', '03'].map((k) => (
            <div key={k} style={{ position: 'relative', background: '#faf6f3' }}>
              {admin && (
                <span
                  onClick={() => setCardEditing(k)}
                  title="Editar textos"
                  style={{ position: 'absolute', top: 16, right: 16, zIndex: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 99, background: '#6b7355', color: '#f8f2e2', fontSize: 14, cursor: 'pointer' }}
                >
                  ✎
                </span>
              )}
              <button onClick={() => go(cardTargets[k])} className="wedding-card" style={{ width: '100%', height: '100%', border: 0, cursor: 'pointer', textAlign: 'left', background: 'none', padding: '54px 38px 50px', display: 'flex', flexDirection: 'column', gap: 16, font: 'inherit' }}>
                <span style={{ font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.18em', color: '#b0736f' }}>{k}</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 400, color: '#3b302b' }}>{content.cards[k].title}</span>
                <span style={{ fontSize: 13, lineHeight: 1.7, color: '#7a655d', maxWidth: '28ch' }}>{content.cards[k].desc}</span>
                <span style={{ marginTop: 'auto', paddingTop: 8, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: '#6b7355' }}>Ver →</span>
              </button>
            </div>
          ))}
        </section>
      </div>

      <div style={{ maxWidth: 1100, margin: 'clamp(48px,7vw,96px) auto 0', padding: '0 clamp(24px,5vw,72px)' }}>
        <section className="wedding-twocol" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'clamp(420px,46vw,560px)' }}>
          <div className="wedding-twocol-photo" style={{ position: 'relative', background: 'repeating-linear-gradient(135deg,#e9dcd6 0 12px,#e1d1ca 12px 24px)', display: 'flex', alignItems: 'flex-end', padding: 26 }}>
            <PhotoSlot slotKey="split" label="foto vertical · 1200×1500" replaceStyle={{ top: 18, right: 18 }} />
          </div>
          <div style={{ position: 'relative', background: '#e8cdc9', display: 'flex', alignItems: 'center', padding: 'clamp(36px,5vw,78px)', overflow: 'hidden' }}>
            <BloomField />
            <div style={{ position: 'relative', maxWidth: '44ch' }}>
              <p style={{ margin: '0 0 22px', font: "10px/1 ui-monospace, Menlo, monospace", letterSpacing: '.22em', textTransform: 'uppercase', color: '#8d5652' }}>Los novios</p>
              <EditableText
                as="p"
                value={content.novios.lead}
                onSave={(v) => patchContent((prev) => ({ ...prev, novios: { ...prev.novios, lead: v } }))}
                style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: 'clamp(22px,2.3vw,33px)', lineHeight: 1.4, color: '#4a352f' }}
              />
              <EditableText
                as="p"
                value={content.novios.body}
                onSave={(v) => patchContent((prev) => ({ ...prev, novios: { ...prev.novios, body: v } }))}
                style={{ margin: '26px 0 0', fontSize: 14, lineHeight: 1.85, color: '#6b4b46' }}
              />
            </div>
          </div>
        </section>
      </div>

      <section style={{ padding: 'clamp(64px,8vw,120px) 0 clamp(56px,7vw,96px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(24px,5vw,72px)' }}>
          <div className="wedding-phototiles" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {content.homeTiles.map((tile, i) => (
              <div key={tile.id} style={{ position: 'relative', aspectRatio: '4/5', background: 'repeating-linear-gradient(135deg,#ece0da 0 12px,#e4d4cd 12px 24px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PhotoSlot slotKey={`home-tile-${tile.id}`} label={`foto ${i + 1}`} replaceStyle={{ bottom: 10, left: 10 }} />
                {admin && (
                  <button onClick={() => removeHomeTile(tile.id)} style={{ position: 'absolute', top: 10, right: 10, zIndex: 5, border: 0, width: 26, height: 26, borderRadius: 99, background: 'rgba(163,68,80,.9)', color: '#f6ece7', font: '13px/1 Jost, sans-serif', cursor: 'pointer' }}>×</button>
                )}
              </div>
            ))}
            {admin && (
              <button onClick={addHomeTile} style={{ aspectRatio: '4/5', border: '1px dashed rgba(59,48,43,.3)', background: 'none', color: '#8a7167', fontFamily: 'Jost, sans-serif', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', cursor: 'pointer' }}>+ Foto</button>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
            <button onClick={() => go('/galeria')} className="wedding-gallery-btn" style={{ border: '1px solid #6b7355', background: 'none', color: '#6b7355', fontFamily: 'Jost, sans-serif', fontSize: 12, letterSpacing: '.24em', textTransform: 'uppercase', padding: '17px 52px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap' }}>Galería</button>
          </div>
        </div>
      </section>

      <footer style={{ padding: 'clamp(72px,10vw,140px) 24px clamp(56px,7vw,96px)', textAlign: 'center', background: 'linear-gradient(to bottom,#faf6f3 0%,rgba(249,231,232,.85) 55%,#f2d9d8 100%)' }}>
        <EditableText
          as="p"
          value={content.footerThanks}
          onSave={(v) => patchContent((prev) => ({ ...prev, footerThanks: v }))}
          style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(28px,4.4vw,56px)', color: '#5c433e' }}
        />
        <p style={{ margin: '28px 0 0', fontSize: 11, letterSpacing: '.3em', textTransform: 'uppercase', color: '#96706c' }}>Miqueas &amp; Florencia · 09.10.2026</p>
      </footer>
    </div>
  )
}
