create table if not exists checkout_cta (
  id int primary key default 1 check (id = 1),
  title text not null,
  compare_price text not null,
  price text not null,
  note text not null,
  items_label text not null,
  items text not null,
  button_label text not null,
  checkout_url text not null default '',
  pending_message text not null,
  delay_seconds int not null default 10,
  updated_at timestamptz not null default now()
);

insert into checkout_cta (
  id, title, compare_price, price, note, items_label, items, button_label, checkout_url, pending_message, delay_seconds
) values (
  1,
  'Ritual de la Llama Eterna',
  '$150',
  '$17.85',
  'Pago único, sin cuotas mensuales',
  'Recibirás:',
  '["Tu ritual 100% personalizado","3 regalos especiales","1 regalo secreto","Garantía incondicional de 30 días","Acceso de por vida"]',
  'Continuar al pago',
  '',
  'El enlace de pago está pendiente. No se realizó ningún cobro.',
  10
) on conflict (id) do nothing;

create table if not exists admin_secret (
  id int primary key default 1 check (id = 1),
  password_hash text not null,
  updated_at timestamptz not null default now()
);

create table if not exists admin_session (
  token text primary key,
  expires_at timestamptz not null
);

create table if not exists admin_attempt (
  id bigserial primary key,
  created_at timestamptz not null default now()
);
