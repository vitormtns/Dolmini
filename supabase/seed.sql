-- Seed minimo para validar o fluxo real da Dolmini Model.
-- Rode este arquivo depois de supabase/schema.sql.
-- Nao cria usuario admin: o admin deve ser criado no Supabase Auth real.

insert into categories (name, slug, description, status, sort_order)
values
  ('Feminino', 'feminino', 'Selecao feminina da Dolmini Model.', 'active', 10),
  ('Jeans', 'jeans', 'Pecas jeans para o dia a dia.', 'active', 20),
  ('Promocoes', 'promocoes', 'Produtos com condicoes promocionais.', 'active', 30)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    status = excluded.status,
    sort_order = excluded.sort_order;

insert into products (
  category_id,
  name,
  slug,
  short_description,
  description,
  price,
  sale_price,
  stock_quantity,
  status,
  is_featured,
  is_promotion,
  seo_title,
  seo_description
)
values
  (
    (select id from categories where slug = 'feminino'),
    'Blusa Dolmini Essential',
    'blusa-dolmini-essential',
    'Blusa versatil para compor looks leves.',
    'Produto ativo de teste para validar vitrine, carrinho e checkout.',
    129.90,
    null,
    8,
    'active',
    true,
    false,
    'Blusa Dolmini Essential',
    'Blusa feminina ativa para testar a vitrine Dolmini Model.'
  ),
  (
    (select id from categories where slug = 'jeans'),
    'Calca Jeans Reta',
    'calca-jeans-reta',
    'Jeans com modelagem reta e acabamento limpo.',
    'Produto ativo com preco promocional para validar badges e total do checkout.',
    219.90,
    189.90,
    5,
    'active',
    true,
    true,
    'Calca Jeans Reta Dolmini',
    'Calca jeans em promocao para teste do catalogo Dolmini Model.'
  ),
  (
    (select id from categories where slug = 'promocoes'),
    'Vestido Promo Teste',
    'vestido-promo-teste',
    'Produto promocional ativo para validacao.',
    'Item ativo usado para validar categoria de promocoes e fluxo de compra.',
    179.90,
    149.90,
    3,
    'active',
    false,
    true,
    null,
    null
  ),
  (
    (select id from categories where slug = 'feminino'),
    'Produto Rascunho Teste',
    'produto-rascunho-teste',
    'Este produto nao deve aparecer publicamente.',
    'Produto em draft para validar RLS/listagem publica.',
    99.90,
    null,
    10,
    'draft',
    false,
    false,
    null,
    null
  ),
  (
    (select id from categories where slug = 'jeans'),
    'Produto Esgotado Teste',
    'produto-esgotado-teste',
    'Este produto nao aparece na vitrine publica atual.',
    'Produto out_of_stock para validar status e filtros.',
    159.90,
    null,
    0,
    'out_of_stock',
    false,
    false,
    null,
    null
  )
on conflict (slug) do update
set category_id = excluded.category_id,
    name = excluded.name,
    short_description = excluded.short_description,
    description = excluded.description,
    price = excluded.price,
    sale_price = excluded.sale_price,
    stock_quantity = excluded.stock_quantity,
    status = excluded.status,
    is_featured = excluded.is_featured,
    is_promotion = excluded.is_promotion,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description;
