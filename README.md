# Dolmini Model Commerce Core

Base técnica reutilizável para e-commerce próprio em Next.js App Router, TypeScript, Supabase e Mercado Pago Checkout Pro. A primeira loja é a Dolmini Model, mas os módulos em `src/lib/commerce` foram separados para poder clonar/adaptar o core para outros pequenos negócios.

## Status Atual

Supabase real conectado e validado para o fluxo mínimo da Dolmini Model:

- `schema.sql` rodando no Supabase real;
- `seed.sql` rodando no Supabase real;
- usuário admin criado no Supabase Auth;
- profile admin em `profiles` com `role = admin`;
- `.env.local` conectado ao Supabase real;
- login em `/login` funcionando;
- acesso a `/admin` funcionando;
- banco real respondendo para admin e vitrine.

Ainda depende de configuração do Mercado Pago:

- `MERCADO_PAGO_ACCESS_TOKEN`;
- `MERCADO_PAGO_WEBHOOK_SECRET`;
- `NEXT_PUBLIC_SITE_URL` com HTTPS público para webhook/back URLs reais.

Enquanto o Mercado Pago não estiver configurado, `POST /api/checkout` retorna o erro limpo `PAYMENT_PROVIDER_NOT_CONFIGURED` e não cria pedido.

## Princípio Central

O frontend nunca é fonte da verdade para preço, estoque ou status de pagamento.

O carrinho público envia apenas:

```json
{
  "items": [
    { "productId": "uuid", "variantId": "uuid-opcional", "quantity": 1 }
  ]
}
```

A API busca produtos/variações no banco, valida status e estoque, recalcula subtotal/desconto/frete/total e só então cria pedido e preferência de pagamento.

## Estrutura

```txt
src/lib/commerce/
  products/        tipos, schemas, repository e service de produtos
  categories/      categorias públicas/admin
  cart/            validação server-side do carrinho
  pricing/         cálculo centralizado de preço
  inventory/       validação e baixa idempotente de estoque
  orders/          criação de pedidos e snapshots de itens
  payments/        camada genérica de pagamento
    mercado-pago/  client, service e webhook do Mercado Pago
```

Rotas principais:

- `GET /login`: login do admin com Supabase Auth.
- `GET|POST /logout`: encerra a sessão e redireciona para login.
- `GET /acesso-negado`: feedback para usuário autenticado sem role admin.
- `GET /admin`: painel admin protegido por Supabase Auth + `profiles.role = admin`.
- `GET /admin/produtos`: gestão de catálogo.
- `GET /admin/categorias`: gestão de categorias.
- `GET /admin/pedidos`: acompanhamento de pedidos.
- `GET /api/products`: lista produtos ativos.
- `GET /api/categories`: lista categorias ativas.
- `POST /api/cart/validate`: valida carrinho no servidor sem confiar em preço do client.
- `POST /api/checkout`: valida carrinho, cria pedido `pending_payment`, cria preferência Mercado Pago e retorna checkout URL.
- `POST /api/webhooks/mercado-pago`: registra evento, aplica idempotência, consulta pagamento na API do Mercado Pago, valida valor e atualiza pedido/estoque.
- `GET|POST|PATCH|DELETE /api/admin/products`: exige profile `admin`.
- `GET|PATCH /api/admin/orders`: exige profile `admin`.

Todas as APIs respondem no formato:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "code": null
}
```

Em erro, a resposta publica continua limpa:

```json
{
  "success": false,
  "data": null,
  "error": "Mensagem segura para o frontend.",
  "code": "error_code"
}
```

## Variaveis de Ambiente

Use `.env.example` como base.

```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_WEBHOOK_SECRET=
```

`SUPABASE_SERVICE_ROLE_KEY`, `MERCADO_PAGO_ACCESS_TOKEN` e `MERCADO_PAGO_WEBHOOK_SECRET` nunca devem ir para componentes client ou variaveis `NEXT_PUBLIC_`.

O helper `src/lib/env.ts` importa `server-only`, entao imports acidentais de secrets em componentes client falham no build.

## Como Configurar Supabase

1. Crie um projeto no Supabase.
2. Copie `Project URL` para `NEXT_PUBLIC_SUPABASE_URL`.
3. Copie `anon public` para `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copie `service_role` para `SUPABASE_SERVICE_ROLE_KEY`.
5. No SQL Editor do Supabase, rode o conteudo de `supabase/schema.sql`.
6. Depois rode `supabase/seed.sql` para criar categorias e produtos de teste.
7. O `schema.sql` cria o bucket `product-images` e policies básicas de Storage.
8. Confirme no painel Storage se o bucket existe e está público para leitura.

Para teste local do admin, catálogo e checkout até a criação de preferência:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Para teste real de Mercado Pago com `back_urls` e webhook, use HTTPS público:

```env
NEXT_PUBLIC_SITE_URL=https://sua-url-publica.example
```

## Como Criar Usuário Admin

1. Crie um usuário pelo Supabase Auth.
2. Pegue o `id` do usuário criado.
3. Insira ou atualize o profile:

```sql
insert into profiles (id, email, full_name, role)
values ('USER_ID_AQUI', 'admin@dolmini.com', 'Admin Dolmini', 'admin')
on conflict (id)
do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;
```

As rotas admin validam a sessão via Supabase Auth e depois exigem `profiles.role = 'admin'`.

## Fluxo de Login Admin

1. Acesse `/login`.
2. Entre com e-mail e senha de um usuário criado no Supabase Auth.
3. A rota `/api/auth/login` autentica com Supabase Auth.
4. Depois do login, o servidor consulta `profiles.role`.
5. Se `role = admin`, o usuário é redirecionado para `/admin`.
6. Se não for admin, a sessão é encerrada e o usuário vai para `/acesso-negado`.
7. O botão `Sair` no admin chama `/logout` e encerra a sessão.

Não existe cadastro público nesta etapa.

## Admin Mínimo

O admin fica em:

```txt
/admin
/admin/produtos
/admin/produtos/novo
/admin/produtos/[id]/editar
/admin/categorias
/admin/pedidos
/admin/pedidos/[id]
```

Funcionalidades atuais:

- listar, criar, editar e arquivar produtos;
- alterar status `draft`, `active`, `archived`, `out_of_stock`;
- editar preço normal, preço promocional, estoque, destaque, promoção e SEO;
- validar slug único de produto e categoria;
- listar, criar e editar categorias;
- ativar/desativar categorias sem remover produtos existentes;
- upload múltiplo de imagens de produto via servidor;
- definir imagem principal;
- remover imagem do produto e do Storage;
- listar pedidos e filtrar por status;
- ver detalhe de pedido;
- atualizar apenas status operacional do pedido.

O admin não permite marcar pagamento como aprovado manualmente. `payment_status = approved` continua sendo responsabilidade do webhook Mercado Pago.

## Rotas Publicas da Loja

```txt
/
/produtos
/produtos/[slug]
/categoria/[slug]
/carrinho
/checkout
/checkout/sucesso
/checkout/pendente
/checkout/erro
```

A vitrine pública consome o Commerce Core:

- home exibe hero, produtos em destaque, promoções, categorias e benefícios;
- `/produtos` exibe grid de produtos ativos com busca simples e filtro por categoria;
- `/produtos/[slug]` exibe galeria, descrição, preço, estoque, categoria e CTA temporário de WhatsApp;
- `/categoria/[slug]` exibe categoria ativa e seus produtos ativos.

Regras atuais da vitrine:

- produtos `draft` e `archived` não aparecem;
- categorias inativas não aparecem;
- produtos `out_of_stock` não aparecem na listagem pública porque `listPublic()` filtra `status = active`;
- o badge "Esgotado" fica pendente até decidirmos se produto esgotado deve continuar público.

## Carrinho Público

O carrinho fica em `localStorage` e guarda apenas:

```json
{
  "productId": "uuid",
  "variantId": "uuid-opcional",
  "quantity": 1
}
```

O frontend não salva nem envia preço como fonte da verdade. Ao abrir `/carrinho` ou `/checkout`, a UI chama:

```txt
POST /api/cart/validate
```

Essa rota usa o Commerce Core para buscar produtos no banco, validar status/estoque e recalcular subtotal, desconto, frete e total. O resumo exibido no carrinho é apenas visual; o checkout recalcula novamente.

## Checkout Mercado Pago Sandbox

Fluxo atual:

1. Cliente adiciona produto público ao carrinho.
2. `/carrinho` valida itens no servidor.
3. `/checkout` coleta dados do cliente e endereço.
4. O frontend envia para `POST /api/checkout`:
   - itens do carrinho com `productId`, `variantId`, `quantity`;
   - dados do cliente;
   - endereço.
5. A API valida tudo no servidor.
6. A API cria `customers`, `orders` com `status = pending_payment` e `payment_status = pending`.
7. A API cria preferência Mercado Pago Checkout Pro.
8. A API salva `mercado_pago_preference_id`.
9. O frontend redireciona para `checkout.checkoutUrl`.

Estoque não baixa na criação do pedido. Estoque só baixa no webhook quando o Mercado Pago confirmar pagamento `approved`.

Para testar em sandbox:

1. Configure `MERCADO_PAGO_ACCESS_TOKEN` com token sandbox.
2. Configure `NEXT_PUBLIC_SITE_URL` com uma URL HTTPS publica.
3. Configure `MERCADO_PAGO_WEBHOOK_SECRET`.
4. Se estiver local, use um tunel HTTPS, por exemplo ngrok ou similar.
5. Garanta que a URL publica aponte para sua aplicacao local.
6. Finalize o checkout e acompanhe a ordem no banco.

Back URLs usadas na preferencia:

```txt
success: ${NEXT_PUBLIC_SITE_URL}/checkout/sucesso
pending: ${NEXT_PUBLIC_SITE_URL}/checkout/pendente
failure: ${NEXT_PUBLIC_SITE_URL}/checkout/erro
```

Notification URL:

```txt
${NEXT_PUBLIC_SITE_URL}/api/webhooks/mercado-pago
```

Avisos importantes:

- Mercado Pago pode rejeitar ou limitar URLs `localhost` em fluxos reais.
- Use HTTPS público para testar `back_urls` e webhook de ponta a ponta.
- A página `/checkout/sucesso` não aprova pagamento.
- A aprovação real do pedido depende da consulta ao Mercado Pago dentro do webhook.

## Testar Produto do Admin na Loja

1. Entre em `/login` com um usuário admin.
2. Crie uma categoria em `/admin/categorias` e marque como `active`.
3. Crie um produto em `/admin/produtos/novo`.
4. Preencha nome, slug, categoria, preço e estoque.
5. Marque status `active`.
6. Opcionalmente marque `Destaque` ou `Promoção`.
7. Salve e envie imagens em `/admin/produtos/[id]/editar`.
8. Abra `/`, `/produtos` ou `/categoria/[slug]`.
9. O produto deve aparecer automaticamente se estiver ativo.

## Banco e RLS

O SQL inicial está em `supabase/schema.sql` e cria:

- `profiles`
- `categories`
- `banners`
- `products`
- `product_images`
- `product_variants`
- `customers`
- `orders`
- `order_items`
- `payment_events`
- `store_settings`

Também inclui enums, índices, triggers de `updated_at`, funções `decrement_product_stock` e `decrement_variant_stock`, além de RLS básico:

- Produtos ativos podem ser lidos publicamente.
- Categorias ativas podem ser lidas publicamente.
- Banners ativos podem ser lidos publicamente.
- Admin gerencia catálogo, pedidos, eventos e configurações.
- Pedidos, clientes e eventos não possuem policy pública de escrita direta pelo client.
- Checkout e webhook escrevem pelo servidor usando service role.

Pedidos possuem `stock_deducted_at` para garantir que estoque não seja baixado duas vezes. Também possuem `total_cents` gerado no banco para comparação financeira sem depender de ponto flutuante.

## Storage de Imagens

Bucket sugerido e usado pelo código:

```txt
product-images
```

Limites:

- tipos aceitos: `image/jpeg`, `image/png`, `image/webp`;
- tamanho maximo por imagem: `5MB`;
- caminho usado: `{productId}/{uuid}.{ext}`;
- alt text padrao: nome do produto.

As rotas de upload ficam em:

```txt
POST /api/admin/products/[id]/images
PATCH /api/admin/products/[id]/images
DELETE /api/admin/products/[id]/images
```

Todas exigem usuario autenticado com role admin. O upload e feito no servidor com service role; a chave nunca vai para o client.

No Supabase real:

1. Rode `supabase/schema.sql`; ele tenta criar o bucket `product-images`.
2. No painel Storage, confirme:
   - bucket: `product-images`;
   - publico: sim;
   - limite: `5MB`;
   - MIME types: `image/jpeg`, `image/png`, `image/webp`.
3. As policies esperadas sao:
   - leitura publica para `product-images`;
   - insert/update/delete apenas admin;
   - upload do app via rota server-side usando `SUPABASE_SERVICE_ROLE_KEY`.
4. Nunca use `SUPABASE_SERVICE_ROLE_KEY` no client.

## Mercado Pago Sandbox

1. Crie ou acesse sua conta Mercado Pago Developers.
2. Ative credenciais de teste/sandbox.
3. Configure `MERCADO_PAGO_ACCESS_TOKEN` com o access token sandbox.
4. Configure `NEXT_PUBLIC_SITE_URL` com a URL publica HTTPS do ambiente. Para teste local com webhook, use um tunel HTTPS.
5. Configure `MERCADO_PAGO_WEBHOOK_SECRET` com o secret do webhook.

A criacao de preferencia fica em:

- `src/lib/commerce/payments/mercado-pago/mercado-pago.client.ts`
- `src/lib/commerce/payments/mercado-pago/mercado-pago.service.ts`

A preferencia usa os itens reais do pedido, `external_reference = order.orderNumber`, `notification_url = ${NEXT_PUBLIC_SITE_URL}/api/webhooks/mercado-pago`, `back_urls` de sucesso/falha/pendente e salva `mercado_pago_preference_id` no pedido.

## Webhook Mercado Pago

Endpoint:

```txt
POST /api/webhooks/mercado-pago
```

O webhook:

- valida `x-signature`, `x-request-id`, `data.id` e `MERCADO_PAGO_WEBHOOK_SECRET`;
- monta o manifest `id:{dataID};request-id:{xRequestId};ts:{ts};`;
- extrai `ts` e `v1` de `x-signature`;
- compara HMAC SHA256 com `timingSafeEqual`;
- permite ausência de assinatura apenas fora de production, com warning no servidor;
- registra payload e headers em `payment_events`;
- usa `provider + event_key` para idempotencia;
- consulta o pagamento na API do Mercado Pago antes de confiar no payload;
- compara `transaction_amount` com `orders.total_cents`;
- aprova pedido e baixa estoque apenas se o pagamento estiver `approved`.

## Como Testar Checkout

1. Cadastre categoria ativa, produto ativo, imagem e estoque no admin.
2. Abra `/produtos/[slug]`.
3. Clique em `Adicionar ao carrinho`.
4. Abra `/carrinho`.
5. Confirme que o carrinho foi validado pelo servidor.
6. Abra `/checkout`.
7. Preencha cliente e endereço.
8. Clique em `Finalizar compra`.
9. O navegador deve redirecionar para o Mercado Pago.

Para testar a API diretamente, envie:

```http
POST /api/checkout
Content-Type: application/json
```

```json
{
  "cart": {
    "items": [
      { "productId": "PRODUCT_ID", "quantity": 1 }
    ]
  },
  "customer": {
    "name": "Cliente Teste",
    "email": "cliente@example.com",
    "phone": "11999999999",
    "document": null,
    "address": {
      "line1": "Rua Teste, 123",
      "city": "São Paulo",
      "state": "SP",
      "postalCode": "01001000",
      "country": "BR"
    }
  }
}
```

No fluxo real, a resposta retorna `data.checkout.checkoutUrl`.

Complete o pagamento no sandbox e confirme em `orders` que, após o webhook:

- `payment_status` mudou para `approved`;
- `status` mudou para `paid`;
- `stock_deducted_at` foi preenchido.

## Checklist de Validação Supabase Real

### A. Banco/Auth

- Criar projeto no Supabase.
- Rodar `supabase/schema.sql` no SQL Editor.
- Rodar `supabase/seed.sql` no SQL Editor.
- Criar usuário admin em Authentication > Users.
- Copiar o UUID do usuário Auth.
- Inserir profile admin em `profiles` usando `full_name`, não `name`:

```sql
insert into profiles (id, email, full_name, role)
values (
  'UUID_DO_USUARIO_AUTH',
  'email@exemplo.com',
  'Administrador',
  'admin'
)
on conflict (id)
do update
set email = excluded.email,
    full_name = excluded.full_name,
    role = excluded.role;
```

- Criar `.env.local` com:

```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
MERCADO_PAGO_ACCESS_TOKEN=SEU_ACCESS_TOKEN_SANDBOX
MERCADO_PAGO_WEBHOOK_SECRET=SEU_WEBHOOK_SECRET
```

- Reiniciar o dev server depois de alterar `.env.local`.

### B. Admin

- Acessar `/login`.
- Entrar com o admin criado no Supabase Auth.
- Confirmar acesso a `/admin`.
- Criar categoria.
- Criar produto ativo.
- Editar produto.
- Arquivar produto.
- Criar produto com estoque positivo.

### C. Storage

- Entrar no editor do produto.
- Enviar imagem JPEG, PNG ou WebP.
- Definir imagem principal.
- Remover imagem.
- Conferir se a imagem aparece na vitrine.
- Conferir no bucket `product-images` se o arquivo foi criado/removido.

### D. Loja Pública

- Abrir `/`.
- Abrir `/produtos`.
- Abrir `/produtos/[slug]`.
- Abrir `/categoria/[slug]`.
- Confirmar que produtos `draft` e `archived` não aparecem.
- Confirmar que categorias inativas não aparecem.

### E. Carrinho/Checkout

- Adicionar produto ativo ao carrinho.
- Abrir `/carrinho` e confirmar validação server-side.
- Abrir `/checkout`.
- Finalizar pedido.
- Confirmar em `orders`:
  - `status = pending_payment`;
  - `payment_status = pending`;
  - `mercado_pago_preference_id` preenchido.
- Confirmar em `order_items` que os itens foram salvos.
- Confirmar que `stock_deducted_at` continua nulo antes do pagamento aprovado.
- Confirmar que o estoque ainda não baixou antes do webhook aprovado.

### F. Mercado Pago

- Confirmar que a preferência foi criada.
- Confirmar redirecionamento para Mercado Pago.
- Confirmar `external_reference = order.order_number`.
- Confirmar `back_urls`:
  - `/checkout/sucesso`;
  - `/checkout/pendente`;
  - `/checkout/erro`.
- Confirmar `notification_url = ${NEXT_PUBLIC_SITE_URL}/api/webhooks/mercado-pago`.
- Para teste real de webhook, trocar `NEXT_PUBLIC_SITE_URL` para HTTPS público e reiniciar o app.
- Lembrar que a página de sucesso não aprova o pedido; aprovação depende do webhook.

## Checklist de Regressão Rápida

- Login:
  - acessar `/login`;
  - entrar com admin real;
  - confirmar redirect para `/admin`;
  - clicar em `Sair`;
  - confirmar redirect para `/login`.
- Admin:
  - criar categoria;
  - editar categoria;
  - criar produto ativo;
  - editar produto;
  - arquivar produto.
- Produto:
  - confirmar produto ativo na vitrine;
  - confirmar `draft` e `archived` fora da vitrine;
  - confirmar `out_of_stock` fora da vitrine pública atual.
- Imagem:
  - enviar imagem JPEG/PNG/WebP até 5 MB;
  - definir principal;
  - remover imagem;
  - confirmar arquivo no bucket `product-images`.
- Vitrine:
  - abrir `/`;
  - abrir `/produtos`;
  - abrir `/produtos/[slug]`;
  - abrir `/categoria/[slug]`.
- Carrinho:
  - adicionar produto;
  - alterar quantidade;
  - remover item;
  - validar `/carrinho`;
  - confirmar mensagem amigável se produto ficar indisponível.
- Checkout sem Mercado Pago:
  - abrir `/checkout`;
  - preencher dados;
  - finalizar;
  - confirmar mensagem "Checkout temporariamente indisponível";
  - confirmar que nenhum pedido novo foi criado por falta de `MERCADO_PAGO_ACCESS_TOKEN`.

## Comandos de Validação

```bash
npm install
npm run typecheck
npm run build
npm audit
```

## Checklist Antes de Produção

- Rodar `npm audit` sem vulnerabilidades.
- Rodar `npm run typecheck` e `npm run build`.
- Confirmar `NODE_ENV=production` no deploy.
- Confirmar que nenhuma secret está exposta como `NEXT_PUBLIC_`.
- Testar webhook com assinatura real do Mercado Pago.
- Testar idempotência reenviando o mesmo evento.
- Testar divergência de valor e garantir que pedido não aprova.
- Testar estoque insuficiente no checkout e no webhook.
- Configurar policies do Supabase Storage.
- Testar upload, remoção e definição de imagem principal no bucket `product-images`.
- Revisar expiração/sessão do admin e fluxo de login.
- Adicionar backups e observabilidade de erros.
- Adicionar testes automatizados para carrinho, pricing, webhook e estoque.
