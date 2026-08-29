// Limpia valores de .env de errores comunes de tipeo/edición en Windows:
// comillas de más, espacios al final, el caracter invisible (BOM) que
// agregan algunos editores al guardar el archivo, y comillas "curvas" o
// espacios especiales que a veces mete el copiar y pegar (por ejemplo
// desde Word o desde el navegador) y que a simple vista se ven iguales a
// un caracter normal pero no lo son — estos valores solo pueden tener
// texto ASCII plano (letras, números, algunos símbolos comunes), así que
// cualquier otra cosa se saca directamente.
function clean(value) {
  if (!value) return { value: '', hadInvalidChars: false }
  let v = value
  if (v.charCodeAt(0) === 0xfeff) v = v.slice(1) // BOM
  v = v.trim()
  v = v.replace(/^['"]|['"]$/g, '') // comillas de más alrededor del valor
  const stripped = v.replace(/[^\x20-\x7e]/g, '') // solo ASCII imprimible
  return { value: stripped, hadInvalidChars: stripped !== v }
}

const RAW = {
  SUPABASE_URL: clean(import.meta.env.VITE_SUPABASE_URL),
  SUPABASE_ANON_KEY: clean(import.meta.env.VITE_SUPABASE_ANON_KEY),
  WEDDING_ADMIN_EMAIL: clean(import.meta.env.VITE_WEDDING_ADMIN_EMAIL),
  CLOUDINARY_CLOUD_NAME: clean(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME),
  CLOUDINARY_UPLOAD_PRESET: clean(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET),
}

export const env = Object.fromEntries(Object.entries(RAW).map(([k, v]) => [k, v.value]))

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

// Variables cuyo valor original tenía caracteres "invisibles" o especiales
// que se sacaron — si esto devuelve algo, seguramente el valor quedó
// incompleto o distinto al que realmente hay que usar, así que hay que
// volver a pegarlo en el .env con cuidado (evitando Word/autocorrección).
export function getSuspiciousEnvVars() {
  return REQUIRED.filter(([key]) => RAW[key].hadInvalidChars).map(([, envName]) => envName)
}

export function isValidSupabaseUrl(url) {
  return /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url)
}
