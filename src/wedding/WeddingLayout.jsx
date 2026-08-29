import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { WeddingProvider } from './WeddingContext'
import { useWedding } from '../hooks/useWedding'
import LoginModal from './components/LoginModal'
import CardEditModal from './components/CardEditModal'
import Lightbox from './components/Lightbox'
import './wedding.css'

const ROUTE_LABELS = {
  '/nuestra-historia': '+ Sección historia',
  '/un-pedacito': '+ Sección pedacito',
  '/dijo-que-si': '+ Foto',
  '/galeria': '+ Fotos',
}

function NavLink({ to, onNavigate, children }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => { navigate(to); window.scrollTo(0, 0); onNavigate?.() }}
      style={{ border: 0, background: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: '#6d5c55' }}
    >
      {children}
    </button>
  )
}

function WeddingChrome() {
  const { admin, logout, content, patchContent, loading } = useWedding()
  const navigate = useNavigate()
  const location = useLocation()
  const [loginOpen, setLoginOpen] = useState(false)
  const [cardEditing, setCardEditing] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  function goHome() { navigate('/'); window.scrollTo(0, 0); setMobileNavOpen(false) }

  function addHere() {
    if (location.pathname === '/nuestra-historia') {
      patchContent((prev) => ({ ...prev, historia: [...prev.historia, { id: 'h' + Date.now(), kicker: 'Nueva sección', title: 'Título editable', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }] }))
    } else if (location.pathname === '/un-pedacito') {
      patchContent((prev) => ({ ...prev, pedacito: [...prev.pedacito, { id: 'p' + Date.now(), kicker: 'Nueva sección', title: 'Título editable', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }] }))
    } else if (location.pathname === '/dijo-que-si') {
      patchContent((prev) => ({ ...prev, dijoTiles: [...prev.dijoTiles, { id: 'dt' + Date.now() }] }))
    } else {
      patchContent((prev) => ({ ...prev, homeTiles: [...prev.homeTiles, { id: 'ht' + Date.now() }] }))
    }
  }

  if (loading || !content) {
    return <div className="wedding-app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Jost, sans-serif', color: '#8a7167', fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase' }}>Cargando…</div>
  }

  const navLinks = [
    ['/nuestra-historia', 'Nuestra historia'],
    ['/dijo-que-si', 'Dijo que sí'],
    ['/un-pedacito', 'Un pedacito'],
    ['/galeria', 'Galería'],
  ]

  return (
    <div className="wedding-app">
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '18px 34px', background: 'rgba(250,246,243,.82)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(59,48,43,.07)' }}>
        <button onClick={goHome} style={{ border: 0, background: 'none', cursor: 'pointer', padding: 0, fontFamily: "'Playfair Display', serif", fontSize: 19, letterSpacing: '.3em', textTransform: 'uppercase', color: '#3b302b' }}>M &amp; F</button>
        <div className="wedding-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}>
          {navLinks.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}
          <button
            onClick={() => admin ? logout() : setLoginOpen(true)}
            style={{ border: '1px solid rgba(59,48,43,.18)', background: 'none', cursor: 'pointer', padding: '7px 13px', borderRadius: 99, font: 'inherit', fontSize: 10, color: '#8a7167', whiteSpace: 'nowrap' }}
          >
            Admin
          </button>
        </div>
        <button
          className="wedding-nav-burger"
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="Menú"
          aria-expanded={mobileNavOpen}
          style={{ border: 0, background: 'none', cursor: 'pointer', padding: 8, color: '#3b302b' }}
        >
          <svg width="22" height="15" viewBox="0 0 22 15"><rect width="22" height="2" fill="currentColor" /><rect y="6.5" width="22" height="2" fill="currentColor" /><rect y="13" width="22" height="2" fill="currentColor" /></svg>
        </button>
      </nav>

      {mobileNavOpen && (
        <div className="wedding-rise" style={{ position: 'fixed', top: 57, left: 0, right: 0, zIndex: 59, background: '#faf6f3', borderBottom: '1px solid rgba(59,48,43,.1)', boxShadow: '0 12px 24px rgba(59,48,43,.12)', display: 'flex', flexDirection: 'column', padding: '8px 34px 20px' }}>
          {navLinks.map(([to, label]) => (
            <NavLink key={to} to={to} onNavigate={() => setMobileNavOpen(false)}>
              <span style={{ display: 'block', borderBottom: '1px solid rgba(59,48,43,.08)', padding: '16px 0', fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}>{label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => { setMobileNavOpen(false); admin ? logout() : setLoginOpen(true) }}
            style={{ alignSelf: 'flex-start', marginTop: 16, border: '1px solid rgba(59,48,43,.18)', background: 'none', cursor: 'pointer', padding: '8px 14px', borderRadius: 99, font: '10px/1 Jost, sans-serif', textTransform: 'uppercase', color: '#8a7167' }}
          >
            Admin
          </button>
        </div>
      )}

      <Outlet context={{ setCardEditing }} />

      {admin && (
        <div className="wedding-rise" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 70, display: 'flex', alignItems: 'center', gap: 18, padding: '14px 34px', background: '#6b7355', color: '#f8f2e2', fontSize: 12, letterSpacing: '.08em', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', opacity: 0.6 }}>Modo administrador</span>
          <span style={{ opacity: 0.75 }}>Los textos con borde punteado son editables. Las fotos muestran «Reemplazar».</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button onClick={addHere} style={{ border: '1px solid rgba(246,236,231,.3)', background: 'none', color: 'inherit', font: 'inherit', padding: '7px 14px', borderRadius: 99, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {ROUTE_LABELS[location.pathname] || '+ Foto inicio'}
            </button>
            <button onClick={logout} style={{ border: 0, background: '#f8f2e2', color: '#4a5139', font: 'inherit', padding: '7px 16px', borderRadius: 99, cursor: 'pointer' }}>Salir</button>
          </div>
        </div>
      )}

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      {cardEditing && <CardEditModal cardKey={cardEditing} onClose={() => setCardEditing(null)} />}
      <Lightbox />
    </div>
  )
}

export default function WeddingLayout() {
  return (
    <WeddingProvider>
      <WeddingChrome />
    </WeddingProvider>
  )
}
