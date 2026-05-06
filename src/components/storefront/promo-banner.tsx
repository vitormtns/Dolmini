import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/commerce/products/product.types";
import { ProductImagePlaceholder } from "@/components/storefront/product-card";

export function PromoBanner({
  product,
  href = "/produtos"
}: {
  product?: Product;
  href?: string;
}) {
  const image = product ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)[0] : null;

  return (
    <section className="petrol-panel overflow-hidden text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#00C2C7]">Jeans em foco</p>
          <h2 className="mt-3 text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">
            O jeans certo muda o ritmo do look.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/74 sm:text-base">
            Modelagens versáteis, bermudas e calças selecionadas para vestir o dia com leveza, presença e praticidade.
          </p>
          <Link className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#003E40] transition hover:bg-[#00C2C7]" href={href}>
            Explorar jeans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="relative">
          <div className="ml-auto grid max-w-xl grid-cols-[0.8fr_1fr] gap-4">
            <div className="mt-12 rounded-[1.2rem] border border-white/15 bg-white/10 p-5">
              <p className="text-4xl font-extrabold text-[#00C2C7]">4:5</p>
              <p className="mt-2 text-sm leading-6 text-white/72">Fotos em destaque, cards maiores e navegação pensada para compra mobile.</p>
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/10 shadow-lift">
              {image?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={image.altText ?? product?.name ?? "Jeans Dolmini"} className="h-full w-full object-cover" src={image.url} />
              ) : (
                <ProductImagePlaceholder label="Jeans" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
