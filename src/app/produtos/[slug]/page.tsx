import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, HeartHandshake, PackageCheck, ShieldCheck } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ProductGalleryClient } from "@/components/storefront/product-gallery-client";
import { ProductGrid } from "@/components/storefront/product-grid";
import { SectionHeading } from "@/components/storefront/section-heading";
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
  const [product, categories, products] = await Promise.all([
    commerce.products.getPublicBySlug(slug),
    commerce.categories.listPublic(),
    commerce.products.listPublic()
  ]);
  return {
    product,
    category: categories.find((category) => category.id === product.categoryId) ?? null,
    relatedProducts: products
      .filter((item) => item.id !== product.id && item.categoryId === product.categoryId)
      .slice(0, 4)
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

  const { product, category, relatedProducts } = data;
  const images = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder);
  const hasSalePrice = product.salePrice != null && product.salePrice < product.price;

  return (
    <StorefrontShell>
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6B7A7C]">
          <Link className="hover:text-[#003E40]" href="/">In&iacute;cio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link className="hover:text-[#003E40]" href="/produtos">Produtos</Link>
          {category ? (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link className="hover:text-[#003E40]" href={`/categoria/${category.slug}`}>{category.name}</Link>
            </>
          ) : null}
        </nav>

        <div className="grid gap-9 lg:grid-cols-[1.08fr_0.92fr]">
          <ProductGalleryClient images={images} productName={product.name} />

          <section className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-[1.5rem] border border-[rgba(0,62,64,0.12)] bg-white p-5 shadow-soft sm:p-7">
              {category ? (
                <Link className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#00A7A7] hover:text-[#003E40]" href={`/categoria/${category.slug}`}>
                  {category.name}
                </Link>
              ) : null}
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight text-[#003E40] sm:text-6xl">{product.name}</h1>
              {product.shortDescription ? (
                <p className="mt-5 max-w-xl text-base leading-7 text-[#6B7A7C]">{product.shortDescription}</p>
              ) : null}
              <div className="mt-7 flex flex-wrap items-end gap-3">
                <strong className="text-4xl font-extrabold tracking-tight text-[#003E40]">{formatCurrency(product.salePrice ?? product.price)}</strong>
                {hasSalePrice ? (
                  <span className="pb-1 text-sm font-semibold text-[#6B7A7C] line-through">{formatCurrency(product.price)}</span>
                ) : null}
                {hasSalePrice || product.isPromotion ? (
                  <span className="mb-1 inline-flex rounded-full bg-[#00A7A7] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-white">
                    Promo&ccedil;&atilde;o
                  </span>
                ) : null}
              </div>

              <div className="mt-7 rounded-[1rem] border border-[rgba(0,62,64,0.12)] bg-[#F8F4EF] p-4 text-sm">
                <p className="font-extrabold text-[#003E40]">Disponibilidade</p>
                <p className="mt-1 text-[#6B7A7C]">
                  {product.stockQuantity > 0 ? `${product.stockQuantity} unidade(s) em estoque` : "Estoque indispon\u00edvel"}
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <AddToCartButton productId={product.id} disabled={product.stockQuantity <= 0} />
                <a
                  className="inline-flex min-h-12 w-full justify-center rounded-full border border-[rgba(0,62,64,0.14)] bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-[#003E40] transition-colors hover:bg-[#F8F4EF]"
                  href={`https://wa.me/?text=${encodeURIComponent(`Ola! Tenho interesse no produto ${product.name} da Dolmini Model.`)}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  Consultar pelo WhatsApp
                </a>
              </div>

              <div className="mt-7 grid gap-3 text-sm">
                {[
                  { icon: ShieldCheck, text: "Checkout recalculado e validado no servidor" },
                  { icon: PackageCheck, text: "Estoque conferido antes da finaliza\u00e7\u00e3o" },
                  { icon: HeartHandshake, text: "Atendimento direto para entrega e trocas" }
                ].map((item) => (
                  <div className="flex gap-3 rounded-xl bg-[#F8F4EF] p-3 text-[#6B7A7C]" key={item.text}>
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#00A7A7]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-12 grid gap-4 lg:grid-cols-3">
          {[
            { title: "Descri\u00e7\u00e3o", text: product.description ?? product.shortDescription ?? "Pe\u00e7a selecionada para a curadoria Dolmini Model." },
            { title: "Detalhes", text: "As informa\u00e7\u00f5es de pre\u00e7o e estoque s\u00e3o validadas antes da finaliza\u00e7\u00e3o da compra." },
            { title: "Trocas e atendimento", text: "Fale com a loja para combinar entrega, d\u00favidas de medida e orienta\u00e7\u00f5es de troca." }
          ].map((block) => (
            <div className="rounded-[1.2rem] border border-[rgba(0,62,64,0.12)] bg-white p-5 shadow-soft" key={block.title}>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#003E40]">{block.title}</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6B7A7C]">{block.text}</p>
            </div>
          ))}
        </section>

        {relatedProducts.length ? (
          <section className="mt-16 border-t border-[rgba(0,62,64,0.12)] pt-12">
            <SectionHeading
              eyebrow="Combine com"
              title="Você também pode gostar"
              subtitle="Produtos da mesma curadoria para continuar montando o look."
            />
            <ProductGrid products={relatedProducts} />
          </section>
        ) : null}
      </main>
    </StorefrontShell>
  );
}
