-- Esquema de la web de boda (Miqueas y Florencia): contenido editable del
-- sitio, fotos y notas de invitados. Las imágenes en sí se guardan en
-- Cloudinary (gratis, sin tarjeta); acá solo se guarda la URL. La
-- autenticación de administrador usa Supabase Auth: hay que crear a mano,
-- una sola vez, un usuario en Authentication → Users con el email fijo
-- `VITE_WEDDING_ADMIN_EMAIL` (ver .env.example) y la contraseña que van a
-- usar los novios para entrar en modo administrador. Esa contraseña se
-- valida en el servidor (Supabase Auth), nunca en el cliente.
--
-- Deploy: pegar en el SQL Editor de Supabase y correr.

create table if not exists public.wedding_settings (
  id integer primary key default 1 check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.wedding_settings (id, content)
values (1, '{
  "hero": {"kicker": "Nos casamos", "name1": "Miqueas", "name2": "Florencia", "date": "09 · 10 · 2026"},
  "novios": {
    "lead": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "body": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit."
  },
  "footerThanks": "Gracias por acompañarnos",
  "historiaHeader": {"title": "Nuestra historia"},
  "pedacitoHeader": {"title": "Un pedacito de nosotros"},
  "dijo": {
    "title": "Dijo que sí",
    "lead": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "quote": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    "body": "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."
  },
  "cards": {
    "01": {"title": "Nuestra historia", "desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod."},
    "02": {"title": "Dijo que sí", "desc": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."},
    "03": {"title": "Un pedacito de nosotros", "desc": "Duis aute irure dolor in reprehenderit in voluptate velit esse."}
  },
  "historia": [
    {"id": "h0", "kicker": "Infancia", "title": "Dos veredas distintas", "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
    {"id": "h1", "kicker": "Familia", "title": "Los que nos hicieron", "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
    {"id": "h2", "kicker": "El encuentro", "title": "Un martes cualquiera", "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
  ],
  "pedacito": [
    {"id": "p0", "kicker": "La casa", "title": "Domingos lentos", "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
    {"id": "p1", "kicker": "Viajes", "title": "Kilómetros juntos", "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
  ],
  "homeTiles": [{"id": "ht1"}, {"id": "ht2"}, {"id": "ht3"}, {"id": "ht4"}, {"id": "ht5"}, {"id": "ht6"}],
  "dijoTiles": [{"id": "dt1"}, {"id": "dt2"}, {"id": "dt3"}, {"id": "dt4"}, {"id": "dt5"}, {"id": "dt6"}, {"id": "dt7"}, {"id": "dt8"}],
  "images": {}
}'::jsonb)
on conflict (id) do nothing;

create table if not exists public.wedding_photos (
  id uuid primary key default gen_random_uuid(),
  src text not null,
  cloudinary_id text,
  author text not null default 'Invitado',
  created_at timestamptz not null default now()
);

create table if not exists public.wedding_notes (
  id uuid primary key default gen_random_uuid(),
  author text not null default 'Invitado',
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.wedding_settings enable row level security;
alter table public.wedding_photos enable row level security;
alter table public.wedding_notes enable row level security;

create policy "Lectura pública de configuración de boda" on public.wedding_settings for select using (true);
create policy "Novios editan configuración de boda" on public.wedding_settings for update to authenticated using (true) with check (true);

create policy "Lectura pública de fotos de boda" on public.wedding_photos for select using (true);
create policy "Cualquiera sube fotos de boda" on public.wedding_photos for insert with check (true);
create policy "Novios reemplazan fotos de boda" on public.wedding_photos for update to authenticated using (true) with check (true);
create policy "Novios borran fotos de boda" on public.wedding_photos for delete to authenticated using (true);

create policy "Lectura pública de notas de boda" on public.wedding_notes for select using (true);
create policy "Cualquiera deja notas de boda" on public.wedding_notes for insert with check (true);
create policy "Novios borran notas de boda" on public.wedding_notes for delete to authenticated using (true);

grant select on public.wedding_settings, public.wedding_photos, public.wedding_notes to anon;
grant insert on public.wedding_photos, public.wedding_notes to anon;
grant select, insert, update, delete on public.wedding_settings, public.wedding_photos, public.wedding_notes to authenticated;
