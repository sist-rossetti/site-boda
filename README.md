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

### 3. Variables de entorno

Copiá `.env.example` a `.env` y completá los valores de Cloudinary y
Supabase de los pasos anteriores.

### 4. Instalar y correr

```bash
npm install
npm run dev
```

### 5. Publicar

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
- `supabase/migrations/` — esquema de base de datos.

## Notas

- Borrar una foto desde el modo administrador la saca del sitio, pero no
  borra el archivo de Cloudinary (borrar ahí requiere una clave secreta que
  no puede vivir en el navegador). Con el plan gratuito de 25 GB no debería
  ser un problema para una boda.
- El botón "Descargar todo" de la Galería es un aviso, no descarga un
  `.zip` real todavía — armar ese empaquetado queda pendiente si hace
  falta más adelante.
