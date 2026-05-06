import Link from "next/link";
import type { Product } from "@/lib/commerce/products/product.types";
import { formatCurrency } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  const image = [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)[0];
  const hasSalePrice = product.salePrice != null && product.salePrice < product.price;

  return (
    <Link className="group block overflow-hidden rounded-lg border bg-white transition-colors hover:bg-muted/40" href={`/produtos/${product.slug}`}>
      <div className="relative aspect-[4/5] bg-muted">
        {image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={image.altText ?? product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" src={image.url} />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
            Imagem em breve
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {hasSalePrice || product.isPromotion ? (
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-red-700 shadow-sm">
              Promocao
            </span>
          ) : null}
        </div>
      </div>
      <div className="p-4">
        <h2 className="line-clamp-2 font-medium">{product.name}</h2>
        {product.shortDescription ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
        ) : null}
        <div className="mt-3 flex items-end gap-2">
          <strong>{formatCurrency(product.salePrice ?? product.price)}</strong>
          {hasSalePrice ? (
            <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
