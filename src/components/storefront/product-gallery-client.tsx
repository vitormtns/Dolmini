"use client";

import { useMemo, useState } from "react";
import type { ProductImage } from "@/lib/commerce/products/product.types";
import { cn } from "@/lib/utils";
import { ProductImagePlaceholder } from "@/components/storefront/product-card";

type ProductGalleryClientProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGalleryClient({ images, productName }: ProductGalleryClientProps) {
  const availableImages = useMemo(() => images.filter((image) => Boolean(image.url)), [images]);
  const [activeImageId, setActiveImageId] = useState(availableImages[0]?.id ?? null);
  const [origin, setOrigin] = useState("50% 50%");
  const activeImage = availableImages.find((image) => image.id === activeImageId) ?? availableImages[0] ?? null;

  return (
    <section className="grid gap-3">
      <div
        className="group relative aspect-[4/5] overflow-hidden rounded-[1.4rem] border border-[rgba(0,62,64,0.12)] bg-[#EFE7DC] shadow-lift"
        onMouseLeave={() => setOrigin("50% 50%")}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
        }}
      >
        {activeImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={activeImage.altText ?? productName}
            className="h-full w-full object-cover transition duration-500 ease-out md:group-hover:scale-[1.1] md:group-hover:cursor-zoom-in"
            src={activeImage.url}
            style={{ transformOrigin: origin }}
          />
        ) : (
          <ProductImagePlaceholder label="Imagem em breve" />
        )}
      </div>

      {availableImages.length > 1 ? (
        <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-1">
          {availableImages.map((image, index) => {
            const active = image.id === activeImage?.id;

            return (
              <button
                aria-label={`Ver imagem ${index + 1} do produto`}
                aria-pressed={active}
                className={cn(
                  "relative h-20 w-20 shrink-0 overflow-hidden rounded-[0.9rem] border bg-[#EFE7DC] transition sm:h-24 sm:w-24",
                  active
                    ? "border-[#003E40] opacity-100 shadow-[0_12px_32px_rgba(0,62,64,0.18)] ring-2 ring-[#00A7A7]/45"
                    : "border-[rgba(0,62,64,0.12)] opacity-70 hover:border-[#00A7A7] hover:opacity-100"
                )}
                key={image.id}
                onClick={() => setActiveImageId(image.id)}
                type="button"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={image.altText ?? productName} className="h-full w-full object-cover" src={image.url ?? ""} />
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
