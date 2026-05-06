import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/storefront/product-grid";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { CommerceError } from "@/lib/commerce/shared/errors";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getCategoryPageData(slug: string) {
  const commerce = createCommerceCore(await createSupabaseServerClient());
  const category = await commerce.categories.getPublicBySlug(slug);
  const products = await commerce.products.listPublic({ categoryId: category.id });
  return { category, products };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { category } = await getCategoryPageData(slug);
    return {
      title: `${category.name} | Dolmini Model`,
      description: category.description ?? `Produtos da categoria ${category.name}.`
    };
  } catch {
    return {
      title: "Categoria | Dolmini Model"
    };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  let data: Awaited<ReturnType<typeof getCategoryPageData>>;

  try {
    data = await getCategoryPageData(slug);
  } catch (error) {
    if (error instanceof CommerceError && error.code === "category_not_found") notFound();
    throw error;
  }

  return (
    <StorefrontShell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Categoria</p>
          <h1 className="mt-2 text-3xl font-semibold">{data.category.name}</h1>
          {data.category.description ? (
            <p className="mt-3 max-w-2xl text-muted-foreground">{data.category.description}</p>
          ) : null}
        </div>

        {data.products.length ? (
          <ProductGrid products={data.products} />
        ) : (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <h2 className="font-semibold">Categoria sem produtos ativos</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Produtos publicados nesta categoria aparecerao aqui automaticamente.
            </p>
          </div>
        )}
      </main>
    </StorefrontShell>
  );
}
