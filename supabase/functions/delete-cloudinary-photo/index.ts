// Edge Function: borra un archivo real de Cloudinary (y de paso, si se le
// pasa un id de fila, también la fila en wedding_photos).
//
// Por qué existe: borrar en Cloudinary requiere firmar el pedido con la
// API Secret de la cuenta, que nunca puede vivir en el navegador (cualquiera
// podría leerla y borrar cualquier cosa de la cuenta). Esta función corre
// en el servidor de Supabase: primero confirma que quien llama tiene una
// sesión de administrador válida (su propio JWT), y recién ahí firma el
// pedido a Cloudinary con las claves guardadas como secrets de la función.
//
// Deploy: Supabase Dashboard → Edge Functions → Deploy a new function
// (pegar este código), o `supabase functions deploy delete-cloudinary-photo`
// si se usa la CLI.
//
// Secrets necesarios (Edge Functions → Manage secrets):
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// (SUPABASE_URL, SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY ya los
// pone Supabase solo, no hace falta cargarlos a mano)

import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sha1(message: string) {
  const data = new TextEncoder().encode(message)
  const hash = await crypto.subtle.digest('SHA-1', data)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? ''

    // Cliente "de usuario": confirma que quien llama tiene sesión válida.
    // En este sitio, cualquier sesión autenticada es la de los novios
    // (el único usuario de Supabase Auth que existe es el admin).
    const callerClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user }, error: userError } = await callerClient.auth.getUser()
    if (userError || !user) {
      return json({ error: 'No autenticado' }, 401)
    }

    const { photoId, cloudinaryId } = await req.json()
    if (!cloudinaryId) {
      return json({ error: 'Falta cloudinaryId' }, 400)
    }

    const apiKey = Deno.env.get('CLOUDINARY_API_KEY')!
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')!
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')!
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = await sha1(`public_id=${cloudinaryId}&timestamp=${timestamp}${apiSecret}`)

    const form = new URLSearchParams()
    form.set('public_id', cloudinaryId)
    form.set('api_key', apiKey)
    form.set('timestamp', String(timestamp))
    form.set('signature', signature)

    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form,
    })
    const cloudData = await cloudRes.json()
    if (cloudData.result !== 'ok' && cloudData.result !== 'not found') {
      return json({ error: 'Cloudinary no pudo borrar el archivo: ' + JSON.stringify(cloudData) }, 502)
    }

    if (photoId) {
      const adminClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      )
      await adminClient.from('wedding_photos').delete().eq('id', photoId)
    }

    return json({ ok: true })
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Error inesperado' }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
