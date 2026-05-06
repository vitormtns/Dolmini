import Link from "next/link";
import type { Metadata } from "next";
import { Search, SlidersHorizontal } from "lucide-react";
import { EmptyProductsState } from "@/components/storefront/empty-products-state";
import { ProductGrid } from "@/components/storefront/product-grid";
import { SectionHeading } from "@/components/storefront/section-heading";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Produtos | Dolmini Model",
  description: "Cole\u00e7\u00e3o completa da Dolmini Model."
};

type Props = {
  searchParams?: Promise<{ busca?: string; categoria?: string; ordenar?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const commerce = createCommerceCore(await createSupabaseServerClient());
  const categories = await commerce.categories.listPublic();
  const selectedCategory = params?.categoria
    ? categories.find((category) => category.slug === params.categoria)
    : null;
  const products = await commerce.products.listPublic({
    search: params?.busca,
    categoryId: selectedCategory?.id
  });
  const orderedProducts = [...products].sort((a, b) => {
    if (params?.ordenar === "menor-preco") return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
    if (params?.ordenar === "promocoes") {
      const aPromo = a.isPromotion || (a.salePrice != null && a.salePrice < a.price);
      const bPromo = b.isPromotion || (b.salePrice != null && b.salePrice < b.price);
      return Number(bPromo) - Number(aPromo);
    }
    if (params?.ordenar === "novidades") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return Number(b.isFeatured) - Number(a.isFeatured);
  });

  return (
    <StorefrontShell>
      <main>
        <section className="store-gradient border-b border-primary/10">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
            <div className="max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#00A7A7]">Cole&ccedil;&atilde;o Dolmini</p>
              <h1 className="mt-3 text-5xl font-extrabold leading-[0.98] tracking-tight text-[#003E40] sm:text-7xl">Cole&ccedil;&atilde;o completa</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#6B7A7C]">
                Explore pe&ccedil;as selecionadas, jeans, bermudas e novidades da Dolmini.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="mb-7 grid gap-4 rounded-[1.25rem] border border-[rgba(0,62,64,0.12)] bg-white p-4 shadow-soft lg:grid-cols-[1fr_auto] lg:items-center">
            <form className="grid gap-3 md:grid-cols-[1fr_auto]" action="/produtos">
              <label className="relative block">
                <span className="sr-only">Buscar por nome</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00A7A7]" />
                <input
                  className="min-h-12 w-full rounded-full border border-[rgba(0,62,64,0.12)] bg-[#F8F4EF] py-2 pl-11 pr-4 text-sm text-[#102224] placeholder:text-[#6B7A7C]"
                  defaultValue={params?.busca ?? ""}
                  name="busca"
                  placeholder="Buscar por nome, jeans, bermuda..."
                />
              </label>
              {params?.categoria ? <input name="categoria" type="hidden" value={params.categoria} /> : null}
              {params?.ordenar ? <input name="ordenar" type="hidden" value={params.ordenar} /> : null}
              <button className="min-h-12 rounded-full bg-[#003E40] px-6 py-2 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#002D2F]" type="submit">
                Buscar
              </button>
            </form>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#6B7A7C]">
              <SlidersHorizontal className="h-4 w-4 text-[#00A7A7]" />
              {orderedProducts.length} produto(s)
            </div>
          </div>

          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            <Link className={cn("min-h-11 whitespace-nowrap rounded-full border border-[rgba(0,62,64,0.12)] bg-white px-4 py-2.5 text-sm font-extrabold uppercase tracking-[0.1em] text-[#003E40] transition-colors hover:bg-[#F8F4EF]", !params?.categoria && "border-[#003E40] bg-[#003E40] text-white hover:bg-[#002D2F]")} href="/produtos">
              Todas
            </Link>
            {categories.map((category) => (
              <Link
                className={cn("min-h-11 whitespace-nowrap rounded-full border border-[rgba(0,62,64,0.12)] bg-white px-4 py-2.5 text-sm font-extrabold uppercase tracking-[0.1em] text-[#003E40] transition-colors hover:bg-[#F8F4EF]", params?.categoria === category.slug && "border-[#003E40] bg-[#003E40] text-white hover:bg-[#002D2F]")}
                href={`/produtos?categoria=${category.slug}${params?.ordenar ? `&ordenar=${params.ordenar}` : ""}`}
                key={category.id}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
            {[
              { label: "Destaques", value: undefined },
              { label: "Menor pre\u00e7o", value: "menor-preco" },
              { label: "Promo\u00e7\u00f5es", value: "promocoes" },
              { label: "Novidades", value: "novidades" }
            ].map((option) => {
              const href = `/produtos?${new URLSearchParams({
                ...(params?.busca ? { busca: params.busca } : {}),
                ...(params?.categoria ? { categoria: params.categoria } : {}),
                ...(option.value ? { ordenar: option.value } : {})
              }).toString()}`;
              return (
                <Link className={cn("min-h-10 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-[#6B7A7C] hover:bg-white", params?.ordenar === option.value && "bg-white text-[#003E40] shadow-soft", !params?.ordenar && !option.value && "bg-white text-[#003E40] shadow-soft")} href={href} key={option.label}>
                  {option.label}
                </Link>
              );
            })}
          </div>

          <SectionHeading
            title={selectedCategory?.name ?? "Todos os produtos"}
            subtitle={selectedCategory?.description ?? "Grid premium com imagens grandes, pre\u00e7o claro e favoritos da marca."}
          />

          {orderedProducts.length ? (
            <ProductGrid products={orderedProducts} />
          ) : (
            <EmptyProductsState />
          )}
        </section>
      </main>
    </StorefrontShell>
  );
}
