# Miqueas & Florencia — web de boda

Sitio de una sola aplicación con cinco pantallas (Inicio, Nuestra historia,
Dijo que sí, Un pedacito de nosotros, Galería). Los invitados suben fotos y
dejan notas sin necesidad de cuenta; los novios entran con contraseña a un
modo administrador para editar textos, fotos y secciones.

Todo el almacenamiento es gratuito, sin tarjeta de crédito ni prueba con
vencimiento:

- **Cloudinary** guarda las fotos (25 GB gratis, de sobra para una boda). Las
  fotos se suben en su calidad original — Cloudinary genera además una
  miniatura liviana solo para que la grilla cargue rápido; la miniatura no
  reemplaza al original, y tanto la descarga como el visor usan siempre el
  archivo completo, sin comprimir.
- **Supabase** guarda los textos editables, las notas de los invitados y el
  login de administrador (500 MB de base de datos gratis, alcanza sobrado
  para esto).

## Puesta en marcha

### 1. Cloudinary

1. Creá una cuenta gratis en [cloudinary.com](https://cloudinary.com).
2. Copiá tu **Cloud name** (arriba a la izquierda del dashboard).
3. Andá a **Settings → Upload → Upload presets → Add upload preset**, poné
   **Signing Mode: Unsigned** y guardalo. Copiá el nombre del preset.
4. Como el preset queda visible en el código del sitio (cualquiera podría
   verlo e intentar subir archivos con él), conviene restringirlo — es la
   recomendación oficial de Cloudinary para presets "Unsigned"
   ([ver documentación](https://cloudinary.com/documentation/upload_presets)):
   entrá a editar el preset que creaste y completá:
   - **Folder**: `site-boda` (así todo queda ordenado y separado)
   - **Allowed formats**: `jpg,jpeg,png,heic,heif,webp` (solo imágenes)
   Guardá de nuevo.

### 2. Supabase

1. Creá un proyecto gratis en [supabase.com](https://supabase.com).
2. Andá a **SQL Editor**, pegá el contenido de
   `supabase/migrations/0001_wedding_schema.sql` y ejecutalo.
3. Andá a **Authentication → Users → Add user**, creá un usuario con un
   email cualquiera (por ejemplo `novios@sitiodeboda.com`) y la contraseña
   que van a usar Miqueas y Florencia para el modo administrador. Ese email
   va en `VITE_WEDDING_ADMIN_EMAIL` (ver abajo) y la contraseña queda
   validada en el servidor de Supabase, nunca en el código del sitio.
4. Copiá la **Project URL** y la **anon public key** desde
   **Settings → API**.

### 3. Función para borrar fotos de Cloudinary de verdad

Cuando los novios borran o reemplazan una foto desde el modo administrador,
además de sacarla del sitio se borra el archivo real en Cloudinary (si no,
se van acumulando archivos sueltos sin usar). Borrar en Cloudinary necesita
una clave secreta que nunca puede estar en el navegador, así que esto corre
como una función en el servidor de Supabase.

1. En Cloudinary, andá a **Settings → Access Keys** (a veces aparece como
   "API Keys") y copiá tu **API Key** y **API Secret**.
2. En Supabase, andá a **Edge Functions** → **Deploy a new function**,
   ponele de nombre `delete-cloudinary-photo`, y pegá el contenido de
   `supabase/functions/delete-cloudinary-photo/index.ts` de este repo.
   Desplegala.
3. En la misma sección de **Edge Functions**, buscá **Manage secrets** (o
   **Settings → Edge Functions → Secrets**) y agregá estos tres, con tus
   valores reales:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

   Estos tres nunca van en el `.env` del sitio ni en ningún lado del
   código — solo viven en los secrets de la función, del lado del
   servidor.

### 4. Variables de entorno

Copiá `.env.example` a `.env` y completá los valores de Cloudinary y
Supabase de los pasos anteriores.

### 5. Instalar y correr

```bash
npm install
npm run dev
```

### 6. Publicar

Cualquier hosting de sitios estáticos gratis sirve (Netlify, Vercel,
GitHub Pages). Build de producción:

```bash
npm run build
```

Sube la carpeta `dist/`, con las mismas variables de entorno configuradas
en el panel del hosting elegido.

## Estructura

- `src/wedding/` — toda la lógica del sitio (layout, pantallas, componentes).
- `src/lib/supabase.js` — cliente de Supabase.
- `src/lib/cloudinary.js` — subida y URLs de descarga/miniatura de Cloudinary.
- `src/lib/weddingApi.js` — funciones que combinan ambos (fotos, notas,
  textos editables, login).
- `src/lib/downloadZip.js` — arma el `.zip` de "Descargar todo" en el propio
  navegador, sin backend.
- `supabase/migrations/` — esquema de base de datos.
- `supabase/functions/delete-cloudinary-photo/` — función que borra el
  archivo real de Cloudinary al reemplazar o eliminar una foto.

## Notas

- Las fotos que van en las secciones del sitio (portada, bloques, etc. —
  no las de la Galería de invitados) no borran el archivo viejo de
  Cloudinary al reemplazarlas, porque no se llevan registro individual de
  cada una. Son pocas fotos (menos de 20 en total), así que el espacio que
  ocupan de más es insignificante frente a los 25 GB gratis.
