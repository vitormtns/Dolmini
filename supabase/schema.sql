create extension if not exists "pgcrypto";

create type app_role as enum ('customer', 'admin');
create type category_status as enum ('active', 'draft', 'archived');
create type product_status as enum ('active', 'draft', 'archived', 'out_of_stock');
create type order_status as enum (
  'draft',
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);
create type payment_status as enum ('pending', 'approved', 'rejected', 'cancelled', 'refunded');
create type banner_status as enum ('active', 'draft', 'archived');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  status category_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_description text,
  description text,
  price numeric(12, 2) not null check (price >= 0),
  sale_price numeric(12, 2) check (sale_price is null or sale_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  status product_status not null default 'draft',
  is_featured boolean not null default false,
  is_promotion boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sale_price_below_price check (sale_price is null or sale_price < price)
);

create table banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  link_url text,
  status banner_status not null default 'draft',
  sort_order integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  url text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text,
  color text,
  sku text unique,
  name text not null,
  option_values jsonb not null default '{}'::jsonb,
  price_cents integer check (price_cents is null or price_cents > 0),
  price_adjustment numeric(12, 2) not null default 0,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  status product_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_variant_has_option check (
    nullif(trim(coalesce(size, '')), '') is not null
    or nullif(trim(coalesce(color, '')), '') is not null
    or jsonb_object_length(option_values) > 0
  )
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  phone text,
  document text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references customers(id) on delete set null,
  status order_status not null default 'draft',
  payment_status payment_status not null default 'pending',
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  discount numeric(12, 2) not null default 0 check (discount >= 0),
  shipping numeric(12, 2) not null default 0 check (shipping >= 0),
  total numeric(12, 2) not null check (total >= 0),
  total_cents integer generated always as ((round(total * 100))::integer) stored,
  currency text not null default 'BRL',
  customer_snapshot jsonb not null,
  mercado_pago_preference_id text,
  mercado_pago_payment_id text,
  stock_deducted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name text not null,
  variant_name text,
  selected_variant_json jsonb,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  subtotal numeric(12, 2) not null check (subtotal >= 0),
  image_url text,
  created_at timestamptz not null default now()
);

create table payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_key text not null,
  provider_event_id text not null,
  event_type text not null,
  payload jsonb not null,
  raw_payload jsonb not null,
  headers jsonb not null default '{}'::jsonb,
  processing_status text not null default 'received',
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, event_key)
);

create table store_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_status_idx on categories(status);
create index banners_status_idx on banners(status);
create index products_status_idx on products(status);
create index products_category_id_idx on products(category_id);
create index product_images_product_id_idx on product_images(product_id);
create index product_variants_product_id_idx on product_variants(product_id);
create index orders_order_number_idx on orders(order_number);
create index orders_payment_status_idx on orders(payment_status);
create index order_items_order_id_idx on order_items(order_id);
create index payment_events_provider_event_key_idx on payment_events(provider, event_key);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on profiles
for each row execute function set_updated_at();
create trigger categories_set_updated_at before update on categories
for each row execute function set_updated_at();
create trigger banners_set_updated_at before update on banners
for each row execute function set_updated_at();
create trigger products_set_updated_at before update on products
for each row execute function set_updated_at();
create trigger product_variants_set_updated_at before update on product_variants
for each row execute function set_updated_at();
create trigger customers_set_updated_at before update on customers
for each row execute function set_updated_at();
create trigger orders_set_updated_at before update on orders
for each row execute function set_updated_at();
create trigger store_settings_set_updated_at before update on store_settings
for each row execute function set_updated_at();

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function decrement_product_stock(p_product_id uuid, p_quantity integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update products
  set stock_quantity = stock_quantity - p_quantity,
      status = case when stock_quantity - p_quantity <= 0 then 'out_of_stock'::product_status else status end
  where id = p_product_id
    and stock_quantity >= p_quantity;

  if not found then
    raise exception 'insufficient product stock';
  end if;
end;
$$;

create or replace function decrement_variant_stock(p_variant_id uuid, p_quantity integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update product_variants
  set stock_quantity = stock_quantity - p_quantity,
      status = case when stock_quantity - p_quantity <= 0 then 'out_of_stock'::product_status else status end,
      is_active = case when stock_quantity - p_quantity <= 0 then false else is_active end
  where id = p_variant_id
    and is_active = true
    and stock_quantity >= p_quantity;

  if not found then
    raise exception 'insufficient variant stock';
  end if;
end;
$$;

alter table profiles enable row level security;
alter table categories enable row level security;
alter table banners enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table payment_events enable row level security;
alter table store_settings enable row level security;

-- Profiles: users can read themselves; admins can inspect and manage all profiles.
create policy "Profiles read own or admin" on profiles
for select using (id = auth.uid() or is_admin());

create policy "Admins manage profiles" on profiles
for all using (is_admin()) with check (is_admin());

-- Public catalog: anonymous clients can only read active categories, banners and products.
create policy "Public read active categories" on categories
for select using (status = 'active');

create policy "Admins manage categories" on categories
for all using (is_admin()) with check (is_admin());

create policy "Public read active banners" on banners
for select using (
  status = 'active'
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

create policy "Admins manage banners" on banners
for all using (is_admin()) with check (is_admin());

create policy "Public read active products" on products
for select using (status = 'active');

create policy "Admins manage products" on products
for all using (is_admin()) with check (is_admin());

create policy "Public read images from active products" on product_images
for select using (
  exists (
    select 1 from products
    where products.id = product_images.product_id
      and products.status = 'active'
  )
);

create policy "Admins manage product images" on product_images
for all using (is_admin()) with check (is_admin());

create policy "Public read variants from active products" on product_variants
for select using (
  status = 'active'
  and is_active = true
  and exists (
    select 1 from products
    where products.id = product_variants.product_id
      and products.status = 'active'
  )
);

create policy "Admins manage product variants" on product_variants
for all using (is_admin()) with check (is_admin());

-- Sensitive commerce data: public anon clients get no direct order/customer writes.
-- Checkout and webhook writes go through server routes using the service role key.
create policy "Admins manage customers" on customers
for all using (is_admin()) with check (is_admin());

create policy "Admins manage orders" on orders
for all using (is_admin()) with check (is_admin());

create policy "Admins manage order items" on order_items
for all using (is_admin()) with check (is_admin());

create policy "Admins manage payment events" on payment_events
for all using (is_admin()) with check (is_admin());

create policy "Admins manage store settings" on store_settings
for all using (is_admin()) with check (is_admin());

-- Storage: bucket usado pelo admin para imagens de produto.
-- As rotas server-side usam service role, mas as policies abaixo tambem permitem
-- leitura publica e escrita por usuarios autenticados com role admin.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read product images" on storage.objects
for select using (bucket_id = 'product-images');

create policy "Admins upload product images" on storage.objects
for insert with check (bucket_id = 'product-images' and is_admin());

create policy "Admins update product images" on storage.objects
for update using (bucket_id = 'product-images' and is_admin())
with check (bucket_id = 'product-images' and is_admin());

create policy "Admins delete product images" on storage.objects
for delete using (bucket_id = 'product-images' and is_admin());
