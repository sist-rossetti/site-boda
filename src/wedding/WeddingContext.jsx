import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  fetchSettings, saveSettings, fetchPhotos, fetchNotes,
  loginAdmin, logoutAdmin, uploadSlotImage,
  addGuestPhotos, replacePhoto, removePhoto, addNote, removeNote,
} from '../lib/weddingApi'
import { WeddingContext } from './wedding-context-store'

export function WeddingProvider({ children }) {
  const [content, setContent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [notes, setNotes] = useState([])
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [lightbox, setLightbox] = useState(-1)
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [c, p, n] = await Promise.all([fetchSettings(), fetchPhotos(), fetchNotes()])
        if (!mounted) return
        setContent(c)
        setPhotos(p)
        setNotes(n)
      } catch (err) {
        console.error('Error cargando el sitio:', err)
        const clean = (s) => (typeof s === 'string' && !s.includes('\n    at ') ? s : null)
        const parts = [clean(err?.message), clean(err?.details), clean(err?.hint), err?.code ? `(código ${err.code})` : null].filter(Boolean)
        if (mounted) setLoadError(parts.length ? parts.join(' — ') : String(err))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()

    supabase.auth.getSession().then(({ data }) => setAdmin(!!data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setAdmin(!!session))

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const patchContent = useCallback((patch) => {
    setContent((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
      saveSettings(next).catch((err) => alert('No se pudo guardar el cambio: ' + err.message))
      return next
    })
  }, [])

  const setSlotImage = useCallback((key, url) => {
    patchContent((prev) => ({ ...prev, images: { ...prev.images, [key]: url } }))
  }, [patchContent])

  const replaceSlot = useCallback(async (key, file) => {
    const url = await uploadSlotImage(file)
    setSlotImage(key, url)
  }, [setSlotImage])

  const login = useCallback(async (password) => {
    const { ok } = await loginAdmin(password)
    return ok
  }, [])

  const logout = useCallback(async () => {
    await logoutAdmin()
  }, [])

  const addPhotos = useCallback(async (files, author) => {
    const rows = await addGuestPhotos(files, author)
    setPhotos((prev) => [...rows, ...prev])
  }, [])

  const doReplacePhoto = useCallback(async (id, file) => {
    const src = await replacePhoto(id, file)
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, src } : p)))
  }, [])

  const doRemovePhoto = useCallback(async (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
    await removePhoto(id)
  }, [])

  const doAddNote = useCallback(async (text, author) => {
    const row = await addNote(text, author)
    setNotes((prev) => [row, ...prev])
  }, [])

  const doRemoveNote = useCallback(async (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    await removeNote(id)
  }, [])

  const value = {
    content, photos, notes, admin, loading, loadError,
    lightbox, setLightbox, formOpen, setFormOpen,
    patchContent, setSlotImage, replaceSlot,
    login, logout,
    addPhotos, replacePhoto: doReplacePhoto, removePhoto: doRemovePhoto,
    addNote: doAddNote, removeNote: doRemoveNote,
  }

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>
}
