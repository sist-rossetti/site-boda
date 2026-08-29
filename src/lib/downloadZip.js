import JSZip from 'jszip'

// Descarga todas las fotos en su calidad original y arma un .zip en el
// propio navegador (sin backend). onProgress(done, total) permite mostrar
// el avance mientras se van bajando las fotos, una por una.
export async function downloadPhotosAsZip(photos, onProgress) {
  const withPhotos = photos.filter((p) => p.src)
  if (!withPhotos.length) {
    throw new Error('Todavía no hay fotos para descargar.')
  }

  const zip = new JSZip()
  const usedNames = new Set()
  let failed = 0

  for (let i = 0; i < withPhotos.length; i++) {
    const p = withPhotos[i]
    try {
      const res = await fetch(p.src)
      if (!res.ok) throw new Error('respuesta no ok')
      const blob = await res.blob()
      const ext = (p.src.split('.').pop() || 'jpg').split('?')[0].slice(0, 4)
      let name = `${(p.author || 'invitado').replace(/[^\w\- ]/g, '')}.${ext}`
      let n = 2
      while (usedNames.has(name)) {
        name = `${(p.author || 'invitado').replace(/[^\w\- ]/g, '')}-${n}.${ext}`
        n++
      }
      usedNames.add(name)
      zip.file(name, blob)
    } catch {
      failed++
    }
    onProgress?.(i + 1, withPhotos.length)
  }

  if (failed === withPhotos.length) {
    throw new Error('No se pudo descargar ninguna foto (problema de conexión). Probá de nuevo, o descargalas una por una desde el visor.')
  }

  const content = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(content)
  const a = document.createElement('a')
  a.href = url
  a.download = 'fotos-boda-miqueas-y-florencia.zip'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)

  if (failed > 0) {
    alert(`${failed} de ${withPhotos.length} fotos no se pudieron incluir en el .zip (problema de conexión al descargarlas). El resto sí se descargó.`)
  }
}
