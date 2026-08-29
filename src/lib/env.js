// Limpia valores de .env de errores comunes de tipeo/edición en Windows:
// comillas de más, espacios al final, o el caracter invisible (BOM) que
// agregan algunos editores (como el Bloc de notas) al guardar el archivo.
function clean(value) {
  if (!value) return ''
  let v = value
  if (v.charCodeAt(0) === 0xfeff) v = v.slice(1) // BOM que agregan algunos editores en Windows
  v = v.trim()
  v = v.replace(/^['"]|['"]$/g, '') // comillas de más alrededor del valor
  return v
}

export const env = {
  SUPABASE_URL: clean(import.meta.env.VITE_SUPABASE_URL),
  SUPABASE_ANON_KEY: clean(import.meta.env.VITE_SUPABASE_ANON_KEY),
  WEDDING_ADMIN_EMAIL: clean(import.meta.env.VITE_WEDDING_ADMIN_EMAIL),
  CLOUDINARY_CLOUD_NAME: clean(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME),
  CLOUDINARY_UPLOAD_PRESET: clean(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET),
}

const REQUIRED = [
  ['SUPABASE_URL', 'VITE_SUPABASE_URL'],
  ['SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY'],
  ['WEDDING_ADMIN_EMAIL', 'VITE_WEDDING_ADMIN_EMAIL'],
  ['CLOUDINARY_CLOUD_NAME', 'VITE_CLOUDINARY_CLOUD_NAME'],
  ['CLOUDINARY_UPLOAD_PRESET', 'VITE_CLOUDINARY_UPLOAD_PRESET'],
]

export function getMissingEnvVars() {
  return REQUIRED.filter(([key]) => !env[key]).map(([, envName]) => envName)
}

export function isValidSupabaseUrl(url) {
  return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url)
}
