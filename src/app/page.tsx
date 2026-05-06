import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgePercent, ShoppingBag, Sparkles } from "lucide-react";
import { CampaignCarousel } from "@/components/storefront/campaign-carousel";
import { CategoryShowcase } from "@/components/storefront/category-showcase";
import { HeroShowcaseCarousel, type HeroShowcaseSlide } from "@/components/storefront/hero-showcase-carousel";
import { ProductGrid } from "@/components/storefront/product-grid";
import { PromoBanner } from "@/components/storefront/promo-banner";
import { SectionHeading } from "@/components/storefront/section-heading";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { TrustStrip } from "@/components/storefront/trust-strip";
import { createCommerceCore } from "@/lib/commerce/factory";
import type { Product } from "@/lib/commerce/products/product.types";
import { formatCurrency } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dolmini Model | Moda casual, jeans e peças selecionadas",
  description: "Loja virtual de moda casual com jeans, bermudas, calças e peças selecionadas para comprar com leveza."
};

function getProductImage(product: Product | undefined) {
  return product ? [...product.images].sort((a, b) => a.sortOrder - b.sortOrder)[0] : null;
}

export default async function HomePage() {
  const commerce = createCommerceCore(await createSupabaseServerClient());
  const [products, categories] = await Promise.all([
    commerce.products.listPublic(),
    commerce.categories.listPublic()
  ]);
  const featuredProducts = products.filter((product) => product.isFeatured).slice(0, 8);
  const promotionProducts = products
    .filter((product) => product.isPromotion || (product.salePrice != null && product.salePrice < product.price))
    .slice(0, 8);
  const jeansCategory = categories.find((category) => category.slug === "jeans" || category.name.toLowerCase().includes("jeans"));
  const jeansHref = jeansCategory ? `/categoria/${jeansCategory.slug}` : "/produtos?categoria=jeans";
  const jeansProducts = jeansCategory
    ? products.filter((product) => product.categoryId === jeansCategory.id).slice(0, 4)
    : [];
  const weeklyProducts = (featuredProducts.length ? featuredProducts : products).slice(0, 8);
  const heroProducts = (featuredProducts.length ? featuredProducts : products).slice(0, 3);
  const heroProduct = heroProducts[0];
  const jeansHeroProduct = jeansProducts[0] ?? heroProducts[1];

  const heroSlides: HeroShowcaseSlide[] = [
    {
      eyebrow: "Nova coleção",
      title: heroProduct?.name ?? "Peças selecionadas Dolmini",
      description: "Uma curadoria casual para vestir o dia com leveza, presença e praticidade.",
      href: heroProduct ? `/produtos/${heroProduct.slug}` : "/produtos",
      ctaLabel: "Comprar agora",
      imageUrl: getProductImage(heroProduct)?.url,
      imageAlt: getProductImage(heroProduct)?.altText ?? heroProduct?.name ?? "Nova coleção Dolmini Model",
      priceLabel: heroProduct ? formatCurrency(heroProduct.salePrice ?? heroProduct.price) : "Nova curadoria",
      badge: "Novo"
    },
    {
      eyebrow: "Jeans em foco",
      title: jeansHeroProduct?.name ?? "Jeans para o dia a dia",
      description: "Modelagens versáteis para combinações reais, com acabamento visual de boutique.",
      href: jeansHeroProduct ? `/produtos/${jeansHeroProduct.slug}` : jeansHref,
      ctaLabel: "Ver jeans",
      imageUrl: getProductImage(jeansHeroProduct)?.url,
      imageAlt: getProductImage(jeansHeroProduct)?.altText ?? jeansHeroProduct?.name ?? "Jeans em foco Dolmini Model",
      priceLabel: jeansHeroProduct ? formatCurrency(jeansHeroProduct.salePrice ?? jeansHeroProduct.price) : null,
      badge: "Jeans"
    },
    {
      eyebrow: "Promoções selecionadas",
      title: promotionProducts[0]?.name ?? "Achados com preço especial",
      description: "Ofertas ativas da vitrine, escolhidas para facilitar uma compra bonita e inteligente.",
      href: promotionProducts[0] ? `/produtos/${promotionProducts[0].slug}` : "/produtos?ordenar=promocoes",
      ctaLabel: "Ver promoções",
      imageUrl: getProductImage(promotionProducts[0])?.url,
      imageAlt: getProductImage(promotionProducts[0])?.altText ?? promotionProducts[0]?.name ?? "Promoções selecionadas Dolmini Model",
      priceLabel: promotionProducts[0] ? formatCurrency(promotionProducts[0].salePrice ?? promotionProducts[0].price) : "Ofertas em destaque",
      badge: promotionProducts.length ? "Oferta" : "Em breve"
    },
    {
      eyebrow: "Destaques da vitrine",
      title: heroProducts[2]?.name ?? "Mais vendidos da semana",
      description: "Produtos em destaque para entrar no radar e montar a próxima combinação.",
      href: heroProducts[2] ? `/produtos/${heroProducts[2].slug}` : "/produtos",
      ctaLabel: "Ver produto",
      imageUrl: getProductImage(heroProducts[2])?.url,
      imageAlt: getProductImage(heroProducts[2])?.altText ?? heroProducts[2]?.name ?? "Destaques da vitrine Dolmini Model",
      priceLabel: heroProducts[2] ? formatCurrency(heroProducts[2].salePrice ?? heroProducts[2].price) : "Curadoria Dolmini",
      badge: "Destaque"
    }
  ];

  return (
    <StorefrontShell>
      <main>
        <section className="hero-premium-bg overflow-hidden border-b border-[rgba(0,62,64,0.12)]">
          <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:min-h-[700px] lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-12">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,62,64,0.12)] bg-white/90 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#003E40] shadow-soft backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-[#00A7A7]" />
                Nova curadoria casual
              </span>
              <h1 className="mt-6 max-w-2xl text-5xl font-extrabold leading-[0.94] tracking-tight text-[#003E40] sm:text-7xl lg:text-8xl">
                Peças que acompanham seu ritmo
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#536A6D] sm:text-lg">
                Jeans, bermudas e moda casual selecionada para vestir o dia com leveza, presença e praticidade.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#003E40] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-lift transition hover:bg-[#002D2F]" href="/produtos">
                  Comprar agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link className="inline-flex min-h-12 items-center rounded-full border border-[rgba(0,62,64,0.14)] bg-white/82 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-[#003E40] transition hover:bg-white" href={jeansHref}>
                  Ver jeans
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Sparkles, title: "Nova coleção", value: `${products.length} peças ativas` },
                  { icon: BadgePercent, title: "Promoções ativas", value: `${promotionProducts.length} ofertas` },
                  { icon: ShoppingBag, title: "Mais vendidos", value: featuredProducts.length ? "Destaques da vitrine" : "Curadoria Dolmini" }
                ].map((item) => (
                  <div className="rounded-2xl border border-[rgba(0,62,64,0.12)] bg-white/88 p-4 shadow-soft backdrop-blur" key={item.title}>
                    <item.icon className="h-4 w-4 text-[#00A7A7]" />
                    <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#6B7A7C]">{item.title}</p>
                    <p className="mt-1 text-sm font-extrabold text-[#003E40]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pl-4">
              <HeroShowcaseCarousel slides={heroSlides} />
            </div>
          </div>
        </section>

        <CampaignCarousel featured={heroProducts} promotions={promotionProducts} jeansHref={jeansHref} />
        <CategoryShowcase categories={categories} />

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeading
            eyebrow="Vitrine da semana"
            title="Peças selecionadas para entrar no seu radar."
            subtitle="Uma seleção com imagem forte, compra direta e curadoria casual para o dia a dia."
            href="/produtos"
            actionLabel="Ver coleção"
          />
          <ProductGrid products={weeklyProducts} />
        </section>

        <PromoBanner product={(jeansProducts.length ? jeansProducts : weeklyProducts)[0]} href={jeansHref} />

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeading
            eyebrow="Promoções selecionadas"
            title="Achados com preço especial"
            subtitle="Quando houver ofertas ativas, elas aparecem aqui com destaque para facilitar a escolha."
            href="/produtos?ordenar=promocoes"
            actionLabel="Ver promoções"
          />
          {promotionProducts.length ? (
            <ProductGrid products={promotionProducts.slice(0, 4)} />
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-[rgba(0,62,64,0.2)] bg-white p-10 text-center shadow-soft">
              <h3 className="text-2xl font-extrabold tracking-tight text-[#003E40]">Novas promoções em breve</h3>
              <p className="mt-2 text-sm text-[#6B7A7C]">A vitrine será atualizada assim que houver ofertas ativas.</p>
            </div>
          )}
        </section>

        <TrustStrip />

        <section className="store-gradient">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#00A7A7]">Dolmini Model</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-[1.02] tracking-tight text-[#003E40] sm:text-6xl">
              Monte sua próxima combinação com a Dolmini
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link className="inline-flex min-h-12 items-center rounded-full bg-[#003E40] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-lift hover:bg-[#002D2F]" href="/produtos">
                Ver produtos
              </Link>
              <Link className="inline-flex min-h-12 items-center rounded-full border border-[rgba(0,62,64,0.14)] bg-white px-7 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-[#003E40] hover:bg-[#F8F4EF]" href="/produtos?ordenar=promocoes">
                Ir para promoções
              </Link>
            </div>
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}
