import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { CommerceError } from "@/lib/commerce/shared/errors";
import { createCommerceCore } from "@/lib/commerce/factory";
import { formatCurrency } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  const commerce = createCommerceCore(await createSupabaseServerClient());
  const [product, categories] = await Promise.all([
    commerce.products.getPublicBySlug(slug),
    commerce.categories.listPublic()
  ]);
  return {
    product,
    category: categories.find((category) => category.id === product.categoryId) ?? null
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { product } = await getProduct(slug);
    return {
      title: product.seoTitle ?? `${product.name} | Dolmini Model`,
      description: product.seoDescription ?? product.shortDescription ?? "Produto Dolmini Model."
    };
  } catch {
    return {
      title: "Produto | Dolmini Model"
    };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let data: Awaited<ReturnType<typeof getProduct>>;

  try {
    data = await getProduct(slug);
  } catch (error) {
    if (error instanceof CommerceError && error.code === "product_not_found") notFound();
    throw error;
  }

  const { product, category } = data;
  const images = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const hasSalePrice = product.salePrice != null && product.salePrice < product.price;

  return (
    <StorefrontShell>
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="grid gap-3">
          <div className="overflow-hidden rounded-lg border bg-muted">
            <div className="aspect-[4/5]">
              {images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={images[0].altText ?? product.name} className="h-full w-full object-cover" src={images[0].url} />
              ) : null}
            </div>
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1).map((image) => (
                <div className="aspect-square overflow-hidden rounded-md border bg-muted" key={image.id}>
                  {image.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={image.altText ?? product.name} className="h-full w-full object-cover" src={image.url} />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section>
          {category ? (
            <Link className="text-sm font-medium text-muted-foreground hover:text-foreground" href={`/categoria/${category.slug}`}>
              {category.name}
            </Link>
          ) : null}
          <h1 className="mt-3 text-3xl font-semibold">{product.name}</h1>
          {product.shortDescription ? (
            <p className="mt-4 text-muted-foreground">{product.shortDescription}</p>
          ) : null}
          <div className="mt-6 flex items-end gap-3">
            <strong className="text-2xl">{formatCurrency(product.salePrice ?? product.price)}</strong>
            {hasSalePrice ? (
              <span className="text-muted-foreground line-through">{formatCurrency(product.price)}</span>
            ) : null}
          </div>
          {hasSalePrice || product.isPromotion ? (
            <span className="mt-3 inline-flex rounded-full border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700">
              Promocao
            </span>
          ) : null}

          <div className="mt-6 rounded-lg border bg-white p-4 text-sm">
            <p className="font-medium">Disponibilidade</p>
            <p className="mt-1 text-muted-foreground">
              {product.stockQuantity > 0 ? `${product.stockQuantity} unidade(s) em estoque` : "Estoque indisponivel"}
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            <AddToCartButton productId={product.id} disabled={product.stockQuantity <= 0} />
            <a
              className="inline-flex w-full justify-center rounded-md border px-5 py-3 text-sm font-medium sm:w-auto"
              href={`https://wa.me/?text=${encodeURIComponent(`Ola! Tenho interesse no produto ${product.name} da Dolmini Model.`)}`}
              rel="noreferrer"
              target="_blank"
            >
              Consultar pelo WhatsApp
            </a>
          </div>

          {product.description ? (
            <div className="mt-8 border-t pt-6">
              <h2 className="font-semibold">Descricao</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">{product.description}</p>
            </div>
          ) : null}
        </section>
      </main>
    </StorefrontShell>
  );
}
