import Link from "next/link";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/storefront/product-grid";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Produtos | Dolmini Model",
  description: "Catalogo ativo da Dolmini Model."
};

type Props = {
  searchParams?: Promise<{ busca?: string; categoria?: string }>;
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

  return (
    <StorefrontShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Produtos</p>
          <h1 className="mt-2 text-3xl font-semibold">Catalogo Dolmini Model</h1>
        </div>

        <form className="mb-5 grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-[1fr_auto]" action="/produtos">
          <input
            className="rounded-md border px-3 py-2 text-sm"
            defaultValue={params?.busca ?? ""}
            name="busca"
            placeholder="Buscar por nome"
          />
          {params?.categoria ? <input name="categoria" type="hidden" value={params.categoria} /> : null}
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" type="submit">
            Buscar
          </button>
        </form>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          <Link className={cn("whitespace-nowrap rounded-full border px-3 py-2 text-sm font-medium", !params?.categoria && "bg-primary text-primary-foreground")} href="/produtos">
            Todas
          </Link>
          {categories.map((category) => (
            <Link
              className={cn("whitespace-nowrap rounded-full border px-3 py-2 text-sm font-medium", params?.categoria === category.slug && "bg-primary text-primary-foreground")}
              href={`/produtos?categoria=${category.slug}`}
              key={category.id}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <h2 className="font-semibold">Nenhum produto encontrado</h2>
            <p className="mt-2 text-sm text-muted-foreground">Tente limpar os filtros ou voltar mais tarde.</p>
          </div>
        )}
      </main>
    </StorefrontShell>
  );
}
