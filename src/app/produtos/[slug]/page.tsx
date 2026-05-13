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
  const activeVariants = product.variants.filter((variant) => variant.isActive);
  const hasVariants = activeVariants.length > 0;
  const totalVariantStock = activeVariants.reduce((sum, variant) => sum + variant.stockQuantity, 0);
  const availableStock = hasVariants ? totalVariantStock : product.stockQuantity;

  return (
    <StorefrontShell>
      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-7 lg:py-10">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B7A7C] sm:mb-6 sm:text-xs sm:tracking-[0.14em]">
          <Link className="hover:text-[#003E40]" href="/">Início</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link className="hover:text-[#003E40]" href="/produtos">Produtos</Link>
          {category ? (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link className="hover:text-[#003E40]" href={`/categoria/${category.slug}`}>{category.name}</Link>
            </>
          ) : null}
        </nav>

        <div className="grid min-w-0 gap-6 sm:gap-9 lg:grid-cols-[1.08fr_0.92fr]">
          <ProductGalleryClient images={images} productName={product.name} />

          <section className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-[1rem] border border-[rgba(0,62,64,0.12)] bg-white p-4 shadow-soft sm:rounded-[1.5rem] sm:p-7">
              {category ? (
                <Link className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#00A7A7] hover:text-[#003E40] sm:tracking-[0.22em]" href={`/categoria/${category.slug}`}>
                  {category.name}
                </Link>
              ) : null}
              <h1 className="mt-3 break-words text-[clamp(2rem,9vw,3rem)] font-extrabold leading-[1.04] tracking-tight text-[#003E40] sm:mt-4 sm:text-6xl">{product.name}</h1>
              {product.shortDescription ? (
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#6B7A7C] sm:mt-5 sm:text-base sm:leading-7">{product.shortDescription}</p>
              ) : null}
              <div className="mt-6 flex flex-wrap items-end gap-3 sm:mt-7">
                <strong className="text-3xl font-extrabold tracking-tight text-[#003E40] sm:text-4xl">{formatCurrency(product.salePrice ?? product.price)}</strong>
                {hasSalePrice ? (
                  <span className="pb-1 text-sm font-semibold text-[#6B7A7C] line-through">{formatCurrency(product.price)}</span>
                ) : null}
                {hasSalePrice || product.isPromotion ? (
                  <span className="mb-1 inline-flex rounded-full bg-[#00A7A7] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-white">
                    Promoção
                  </span>
                ) : null}
              </div>

              <div className="mt-6 rounded-[0.9rem] border border-[rgba(0,62,64,0.12)] bg-[#F8F4EF] p-4 text-sm sm:mt-7 sm:rounded-[1rem]">
                <p className="font-extrabold text-[#003E40]">Disponibilidade</p>
                <p className="mt-1 text-[#6B7A7C]">
                  {availableStock > 0 ? `${availableStock} unidade(s) em estoque` : "Estoque indisponível"}
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <AddToCartButton
                  basePrice={product.salePrice ?? product.price}
                  productId={product.id}
                  variants={activeVariants}
                  disabled={availableStock <= 0}
                />
                <a
                  className="inline-flex min-h-12 w-full justify-center rounded-full border border-[rgba(0,62,64,0.14)] bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-[#003E40] transition-colors hover:bg-[#F8F4EF]"
                  href={`https://wa.me/?text=${encodeURIComponent(`Ola! Tenho interesse no produto ${product.name} da Dolmini Model.`)}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  Consultar pelo WhatsApp
                </a>
              </div>

              <div className="mt-6 grid gap-2.5 text-sm sm:mt-7 sm:gap-3">
                {[
                  { icon: ShieldCheck, text: "Checkout recalculado e validado no servidor" },
                  { icon: PackageCheck, text: "Estoque conferido antes da finalização" },
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

        <section className="mt-9 grid gap-3 sm:mt-12 sm:gap-4 lg:grid-cols-3">
          {[
            { title: "Descrição", text: product.description ?? product.shortDescription ?? "Peça selecionada para a curadoria Dolmini Model." },
            { title: "Detalhes", text: "As informações de preço e estoque são validadas antes da finalização da compra." },
            { title: "Trocas e atendimento", text: "Fale com a loja para combinar entrega, dúvidas de medida e orientações de troca." }
          ].map((block) => (
            <div className="rounded-[1rem] border border-[rgba(0,62,64,0.12)] bg-white p-4 shadow-soft sm:rounded-[1.2rem] sm:p-5" key={block.title}>
              <h2 className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#003E40]">{block.title}</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6B7A7C]">{block.text}</p>
            </div>
          ))}
        </section>

        {relatedProducts.length ? (
          <section className="mt-12 border-t border-[rgba(0,62,64,0.12)] pt-9 sm:mt-16 sm:pt-12">
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

