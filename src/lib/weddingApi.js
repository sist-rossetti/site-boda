import { supabase } from './supabase'
import { uploadImage } from './cloudinary'
import { env } from './env'

const ADMIN_EMAIL = env.WEDDING_ADMIN_EMAIL

export async function loginAdmin(password) {
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password })
  if (error) console.error('Error al iniciar sesión como administrador:', error.message)
  return { ok: !error, error }
}

export async function logoutAdmin() {
  await supabase.auth.signOut()
}

export async function fetchSettings() {
  const { data, error } = await supabase.from('wedding_settings').select('content').eq('id', 1).maybeSingle()
  if (error) throw error
  if (!data) {
    throw new Error('No se encontró la configuración del sitio en Supabase (falta la fila con id=1 en wedding_settings). Volvé a correr el SQL de supabase/migrations/0001_wedding_schema.sql en el SQL Editor.')
  }
  return data.content
}

export async function saveSettings(content) {
  const { error } = await supabase.from('wedding_settings').update({ content, updated_at: new Date().toISOString() }).eq('id', 1)
  if (error) throw error
}

export async function fetchPhotos() {
  const { data, error } = await supabase.from('wedding_photos').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function fetchNotes() {
  const { data, error } = await supabase.from('wedding_notes').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function uploadSlotImage(file) {
  const { url } = await uploadImage(file)
  return url
}

export async function addGuestPhotos(files, author) {
  const uploaded = await Promise.all(files.map((f) => uploadImage(f)))
  const rows = uploaded.map(({ url, publicId }) => ({ src: url, cloudinary_id: publicId, author }))
  const { data, error } = await supabase.from('wedding_photos').insert(rows).select()
  if (error) throw error
  return data
}

export async function replacePhoto(id, file) {
  const { data: old } = await supabase.from('wedding_photos').select('cloudinary_id').eq('id', id).single()
  const { url, publicId } = await uploadImage(file)
  const { error } = await supabase.from('wedding_photos').update({ src: url, cloudinary_id: publicId }).eq('id', id)
  if (error) throw error
  if (old?.cloudinary_id) {
    // Best-effort: si esto falla, la foto ya se reemplazó bien en el sitio,
    // solo queda un archivo viejo sin usar en Cloudinary (no rompe nada).
    deleteCloudinaryPhoto({ cloudinaryId: old.cloudinary_id }).catch(() => {})
  }
  return url
}

export async function removePhoto(id) {
  const { data: row } = await supabase.from('wedding_photos').select('cloudinary_id').eq('id', id).single()
  if (row?.cloudinary_id) {
    await deleteCloudinaryPhoto({ photoId: id, cloudinaryId: row.cloudinary_id })
  } else {
    const { error } = await supabase.from('wedding_photos').delete().eq('id', id)
    if (error) throw error
  }
}

async function deleteCloudinaryPhoto({ photoId, cloudinaryId }) {
  const { data, error } = await supabase.functions.invoke('delete-cloudinary-photo', {
    body: { photoId, cloudinaryId },
  })
  if (error) throw error
  if (data?.error) throw new Error(data.error)
}

export async function addNote(text, author) {
  const { data, error } = await supabase.from('wedding_notes').insert({ text, author }).select().single()
  if (error) throw error
  return data
}

export async function removeNote(id) {
  const { error } = await supabase.from('wedding_notes').delete().eq('id', id)
  if (error) throw error
}
