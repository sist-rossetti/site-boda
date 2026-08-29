import { env } from './env'

const CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = env.CLOUDINARY_UPLOAD_PRESET

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp']
const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB, más que suficiente para una foto de celular

// El upload preset es "Unsigned" a propósito (así los invitados suben sin
// cuenta), pero eso significa que su nombre queda visible en el código del
// sitio y cualquiera podría intentar usarlo desde afuera. Como esta cuenta
// de Cloudinary no expone un control de formato/tamaño en el preset,
// filtramos acá: solo imágenes, con un tamaño razonable.
function assertValidImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`"${file.name}" no es una imagen admitida (solo JPG, PNG, HEIC o WEBP).`)
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`"${file.name}" pesa demasiado (máximo 25 MB por foto).`)
  }
}

// Sube el archivo original tal cual, sin comprimir. Cloudinary genera
// además una miniatura liviana para la grilla (ver getThumbUrl); el
// original nunca se toca y es el que se descarga.
export async function uploadImage(file) {
  assertValidImage(file)
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || 'No se pudo subir la imagen')
  }
  const data = await res.json()
  return { url: data.secure_url, publicId: data.public_id }
}

// Inserta transformaciones de Cloudinary en la URL para pedir una versión
// chica (usada solo en miniaturas de grilla). La URL original (sin tocar)
// es la que se usa para el visor y la descarga.
export function getThumbUrl(url, width = 480) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/w_${width},c_limit,q_auto,f_auto/`)
}

// Fuerza la descarga del archivo original, sin comprimir ni transformar
// (fl_attachment le pide a Cloudinary que mande Content-Disposition:
// attachment, así el navegador descarga en vez de abrir la imagen).
export function getDownloadUrl(url) {
  if (!url || !url.includes('/upload/')) return url
  return url.replace('/upload/', '/upload/fl_attachment/')
}
