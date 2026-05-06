import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/commerce/products/product.types";
import { formatCurrency } from "@/lib/format";

export function ProductImagePlaceholder({ label = "Dolmini Model" }: { label?: string }) {
  return (
    <div className="dolmini-placeholder flex h-full w-full items-center justify-center p-6 text-center">
      <div>
        <p className="text-3xl font-extrabold tracking-tight text-[#003E40]">Dolmini</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-[#6B7A7C]">
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
    <Link className="group block" href={`/produtos/${product.slug}`}>
      <article className="overflow-hidden rounded-[1.15rem] border border-[rgba(0,62,64,0.12)] bg-white shadow-[0_18px_60px_rgba(0,62,64,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-lift">
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
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {hasSalePrice || product.isPromotion ? (
              <span className="rounded-full bg-[#00A7A7] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white shadow-soft">
                Promoção
              </span>
            ) : null}
            {product.isFeatured ? (
              <span className="rounded-full bg-white/92 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-primary shadow-soft">
                Destaque
              </span>
            ) : null}
          </div>
          <span className="absolute bottom-3 right-3 inline-flex translate-y-2 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#003E40] opacity-0 shadow-soft transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ShoppingBag className="h-3.5 w-3.5" />
            Ver produto
          </span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-base font-extrabold leading-snug tracking-tight text-[#102224]">
              {product.name}
            </h2>
            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-accent transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          {product.shortDescription ? (
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#6B7A7C]">{product.shortDescription}</p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            <strong className="text-lg font-extrabold text-[#003E40]">{formatCurrency(product.salePrice ?? product.price)}</strong>
            {hasSalePrice ? (
              <span className="text-sm font-semibold text-[#6B7A7C] line-through">{formatCurrency(product.price)}</span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
