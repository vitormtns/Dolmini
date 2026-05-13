alter table product_variants
  add column if not exists size text,
  add column if not exists color text,
  add column if not exists price_cents integer check (price_cents is null or price_cents > 0),
  add column if not exists is_active boolean not null default true;

update product_variants
set
  size = coalesce(size, option_values->>'size', option_values->>'tamanho'),
  color = coalesce(color, option_values->>'color', option_values->>'cor'),
  is_active = coalesce(is_active, status = 'active')
where true;

alter table order_items
  add column if not exists selected_variant_json jsonb;

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
