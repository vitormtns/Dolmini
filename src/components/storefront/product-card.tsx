import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/commerce/products/product.types";
import { formatCurrency } from "@/lib/format";

export function ProductImagePlaceholder({ label = "Dolmini Model" }: { label?: string }) {
  return (
    <div className="dolmini-placeholder flex h-full w-full items-center justify-center p-4 text-center sm:p-6">
      <div>
        <p className="text-2xl font-extrabold tracking-tight text-[#003E40] sm:text-3xl">Dolmini</p>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6B7A7C] sm:text-xs sm:tracking-[0.22em]">
          {label}
        </p>
      </div>
    </div>
  );
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
  const hasSalePrice = product.salePrice != null && product.salePrice < product.price;

  return (
    <Link className="group block min-w-0" href={`/produtos/${product.slug}`}>
      <article className="h-full overflow-hidden rounded-[0.95rem] border border-[rgba(0,62,64,0.12)] bg-white shadow-[0_18px_60px_rgba(0,62,64,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-lift sm:rounded-[1.15rem]">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F3EFE8]">
          {image?.url ? (
            <Image
              alt={image.altText ?? product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
              fill
              priority={priority}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              src={image.url}
            />
          ) : (
            <ProductImagePlaceholder label="Imagem em breve" />
          )}
          <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] flex-wrap gap-1.5 sm:left-3 sm:top-3 sm:gap-2">
            {hasSalePrice || product.isPromotion ? (
              <span className="rounded-full bg-[#00A7A7] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-white shadow-soft sm:px-3 sm:text-[11px] sm:tracking-[0.12em]">
                Promoção
              </span>
            ) : null}
            {product.isFeatured ? (
              <span className="rounded-full bg-white/92 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-primary shadow-soft sm:px-3 sm:text-[11px] sm:tracking-[0.12em]">
                Destaque
              </span>
            ) : null}
          </div>
          <span className="absolute bottom-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#003E40] shadow-soft sm:bottom-3 sm:right-3 sm:h-auto sm:w-auto sm:translate-y-2 sm:gap-2 sm:px-4 sm:py-2 sm:text-xs sm:font-extrabold sm:uppercase sm:tracking-[0.12em] sm:opacity-0 sm:transition sm:duration-300 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Ver produto</span>
          </span>
        </div>
        <div className="p-3 sm:p-5">
          <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
            <h2 className="line-clamp-2 min-w-0 text-sm font-extrabold leading-snug tracking-tight text-[#102224] sm:text-base">
              {product.name}
            </h2>
            <ArrowUpRight className="mt-0.5 hidden h-4 w-4 shrink-0 text-accent transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block" />
          </div>
          {product.shortDescription ? (
            <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#6B7A7C] sm:mt-2 sm:text-sm">{product.shortDescription}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-baseline gap-1.5 sm:mt-4 sm:gap-2">
            <strong className="text-base font-extrabold text-[#003E40] sm:text-lg">{formatCurrency(product.salePrice ?? product.price)}</strong>
            {hasSalePrice ? (
              <span className="text-xs font-semibold text-[#6B7A7C] line-through sm:text-sm">{formatCurrency(product.price)}</span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
