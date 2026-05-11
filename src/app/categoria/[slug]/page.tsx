import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { EmptyProductsState } from "@/components/storefront/empty-products-state";
import { ProductGrid } from "@/components/storefront/product-grid";
import { SectionHeading } from "@/components/storefront/section-heading";
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
  const [category, categories] = await Promise.all([
    commerce.categories.getPublicBySlug(slug),
    commerce.categories.listPublic()
  ]);
  const products = await commerce.products.listPublic({ categoryId: category.id });
  return { category, categories, products };
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
      <main>
        <section className="petrol-panel overflow-hidden text-white">
          <div className="mx-auto grid max-w-7xl gap-7 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#00C2C7] sm:tracking-[0.24em]">Categoria</p>
              <h1 className="mt-3 max-w-[20rem] break-words text-[clamp(2.15rem,9.5vw,2.8rem)] font-extrabold leading-[1.04] tracking-tight sm:max-w-none sm:text-7xl">{data.category.name}</h1>
              {data.category.description ? (
                <p className="mt-4 max-w-2xl text-sm leading-6 text-white/72 sm:mt-5">{data.category.description}</p>
              ) : null}
            </div>
            <div className="grid gap-2 rounded-[1rem] border border-white/12 bg-white/8 p-3 sm:grid-cols-2 sm:gap-3 sm:rounded-[1.3rem] sm:p-4">
              {data.categories
                .filter((category) => category.id !== data.category.id)
                .slice(0, 4)
                .map((category) => (
                  <Link className="group flex min-h-11 items-center justify-between gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-bold text-white/82 transition hover:bg-white hover:text-[#003E40] sm:rounded-2xl sm:px-4" href={`/categoria/${category.slug}`} key={category.id}>
                    <span className="min-w-0 truncate">{category.name}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition group-hover:translate-x-0.5" />
                  </Link>
                ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <SectionHeading
            eyebrow="Vitrine da categoria"
            title="Produtos selecionados"
            subtitle="Cards visuais com imagem dominante, preço claro e navegação direta para compra."
          />
          {data.products.length ? (
            <>
              <ProductGrid products={data.products} />
              {data.products.length > 4 ? (
                <div className="petrol-panel mt-8 rounded-[1rem] p-5 text-white sm:mt-10 sm:rounded-[1.4rem] sm:p-8">
                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#00C2C7] sm:tracking-[0.2em]">Dolmini Model</p>
                  <h2 className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-3xl">Continue explorando a curadoria completa da loja.</h2>
                  <Link className="mt-6 inline-flex min-h-12 rounded-full bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-[#003E40]" href="/produtos">
                    Ver todos os produtos
                  </Link>
                </div>
              ) : null}
            </>
          ) : (
            <EmptyProductsState
              title="Categoria sem produtos ativos"
              description="Produtos publicados nesta categoria aparecerão aqui automaticamente."
            />
          )}
        </section>
      </main>
    </StorefrontShell>
  );
}
