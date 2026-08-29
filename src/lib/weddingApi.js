import { supabase } from './supabase'
import { uploadImage } from './cloudinary'

const ADMIN_EMAIL = import.meta.env.VITE_WEDDING_ADMIN_EMAIL

export async function loginAdmin(password) {
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password })
  return { ok: !error }
}

export async function logoutAdmin() {
  await supabase.auth.signOut()
}

export async function fetchSettings() {
  const { data, error } = await supabase.from('wedding_settings').select('content').eq('id', 1).single()
  if (error) throw error
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
  const { url, publicId } = await uploadImage(file)
  const { error } = await supabase.from('wedding_photos').update({ src: url, cloudinary_id: publicId }).eq('id', id)
  if (error) throw error
  return url
}

export async function removePhoto(id) {
  const { error } = await supabase.from('wedding_photos').delete().eq('id', id)
  if (error) throw error
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
