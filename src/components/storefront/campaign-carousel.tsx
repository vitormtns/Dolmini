import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/commerce/products/product.types";
import { ProductImagePlaceholder } from "@/components/storefront/product-card";

type Campaign = {
  title: string;
  subtitle: string;
  href: string;
  label: string;
  imageUrl?: string | null;
};

function firstImage(product?: Product) {
  return product ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url : null;
}

export function CampaignCarousel({
  featured,
  promotions,
  jeansHref
}: {
  featured: Product[];
  promotions: Product[];
  jeansHref: string;
}) {
  const campaigns: Campaign[] = [
    {
      title: "Nova coleção",
      subtitle: "Peças casuais para a semana ganhar presença.",
      href: "/produtos",
      label: "Comprar",
      imageUrl: firstImage(featured[0])
    },
    {
      title: "Jeans em destaque",
      subtitle: "Modelagens práticas para usar muito.",
      href: jeansHref,
      label: "Explorar",
      imageUrl: firstImage(featured[1])
    },
    {
      title: "Promoções",
      subtitle: "Achados selecionados com preço especial.",
      href: "/produtos?ordenar=promocoes",
      label: "Ver ofertas",
      imageUrl: firstImage(promotions[0])
    },
    {
      title: "Peças casuais",
      subtitle: "Bermudas, calças e favoritos para o dia.",
      href: "/produtos",
      label: "Ver coleção",
      imageUrl: firstImage(featured[2])
    }
  ];

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2 [scroll-snap-type:x_mandatory]">
          {campaigns.map((campaign) => (
            <Link className="group relative min-h-[280px] w-[82vw] shrink-0 overflow-hidden rounded-[1.4rem] border border-[rgba(0,62,64,0.12)] bg-[#EFE7DC] p-5 shadow-soft transition duration-300 hover:-translate-y-1 sm:w-[410px] [scroll-snap-align:start]" href={campaign.href} key={campaign.title}>
              <div className="absolute inset-0">
                {campaign.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={campaign.title} className="h-full w-full object-cover opacity-82 transition duration-500 group-hover:scale-[1.04]" src={campaign.imageUrl} />
                ) : (
                  <ProductImagePlaceholder label={campaign.title} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#002D2F]/82 via-[#003E40]/26 to-transparent" />
              </div>
              <div className="relative flex h-full min-h-[240px] flex-col justify-end text-white">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#00C2C7]">{campaign.label}</p>
                <h3 className="mt-2 text-3xl font-extrabold tracking-tight">{campaign.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/82">{campaign.subtitle}</p>
                <span className="mt-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#003E40] transition group-hover:bg-[#00C2C7]">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
