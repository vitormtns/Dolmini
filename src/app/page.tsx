import Link from "next/link";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/storefront/product-grid";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dolmini Model | Moda selecionada com cuidado",
  description: "Conheca a vitrine oficial da Dolmini Model."
};

export default async function HomePage() {
  const commerce = createCommerceCore(await createSupabaseServerClient());
  const [products, categories] = await Promise.all([
    commerce.products.listPublic(),
    commerce.categories.listPublic()
  ]);
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 4);
  const promotionProducts = products
    .filter((product) => product.isPromotion || product.salePrice != null)
    .slice(0, 4);

  return (
    <StorefrontShell>
      <main>
        <section className="bg-zinc-950 text-white">
          <div className="mx-auto grid min-h-[78vh] max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-zinc-300">
                Dolmini Model
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
                Uma vitrine propria para comprar com mais clareza.
              </h1>
              <p className="mt-5 max-w-xl text-zinc-300">
                Produtos selecionados, catalogo atualizado pelo painel interno e uma experiencia preparada para venda direta.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="rounded-md bg-white px-5 py-3 text-sm font-medium text-zinc-950" href="/produtos">
                  Ver produtos
                </Link>
                {categories[0] ? (
                  <Link className="rounded-md border border-white/30 px-5 py-3 text-sm font-medium" href={`/categoria/${categories[0].slug}`}>
                    Explorar categorias
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {(featuredProducts.length ? featuredProducts : products.slice(0, 4)).map((product) => {
                const image = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
                return (
                  <Link className="group overflow-hidden rounded-lg bg-white/10" href={`/produtos/${product.slug}`} key={product.id}>
                    <div className="aspect-[4/5] bg-white/10">
                      {image?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt={image.altText ?? product.name} className="h-full w-full object-cover opacity-95 transition-transform duration-300 group-hover:scale-[1.02]" src={image.url} />
                      ) : null}
                    </div>
                    <div className="p-3 text-sm font-medium">{product.name}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Destaques</h2>
              <p className="mt-1 text-sm text-muted-foreground">Itens marcados no admin como destaque.</p>
            </div>
            <Link className="text-sm font-medium" href="/produtos">Ver todos</Link>
          </div>
          {featuredProducts.length ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nenhum produto em destaque ainda.
            </p>
          )}
        </section>

        <section className="bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-semibold">Promocoes</h2>
            <p className="mt-1 text-sm text-muted-foreground">Produtos com preco promocional ou sinal de promocao.</p>
            <div className="mt-6">
              {promotionProducts.length ? (
                <ProductGrid products={promotionProducts} />
              ) : (
                <p className="rounded-lg border border-dashed bg-white p-8 text-center text-sm text-muted-foreground">
                  Nenhuma promocao ativa no momento.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-semibold">Categorias</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link className="rounded-lg border bg-white p-5 transition-colors hover:bg-muted/40" href={`/categoria/${category.slug}`} key={category.id}>
                <strong>{category.name}</strong>
                {category.description ? <p className="mt-2 text-sm text-muted-foreground">{category.description}</p> : null}
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 md:grid-cols-3">
            {["Catalogo atualizado", "Compra segura", "Entrega acompanhada"].map((benefit) => (
              <div className="rounded-lg border bg-white p-5" key={benefit}>
                <strong>{benefit}</strong>
                <p className="mt-2 text-sm text-muted-foreground">
                  Operacao propria com dados validados no servidor e acompanhamento pelo painel interno.
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}
