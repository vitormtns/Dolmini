import type { Metadata } from "next";
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
  const promotionsCategory = categories.find(
    (category) => category.slug === "promocoes" || category.name.toLowerCase().includes("promo")
  );
  const jeansHref = jeansCategory ? `/categoria/${jeansCategory.slug}` : "/produtos?categoria=jeans";
  const promotionsHref = promotionsCategory ? `/categoria/${promotionsCategory.slug}` : "/produtos?ordenar=promocoes";
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
      title: "Peças que acompanham seu ritmo",
      description: "Jeans, bermudas e moda casual selecionada para vestir o dia com leveza, presença e praticidade.",
      href: "/produtos",
      ctaLabel: "Ver coleção",
      secondaryHref: "/produtos",
      secondaryLabel: "Comprar agora",
      imageUrl: "/hero/nova-colecao.png",
      imageAlt: getProductImage(heroProduct)?.altText ?? heroProduct?.name ?? "Nova coleção Dolmini Model",
      priceLabel: heroProduct ? formatCurrency(heroProduct.salePrice ?? heroProduct.price) : "Nova curadoria",
      badge: "Nova curadoria casual",
      detailLabel: "Nova coleção"
    },
    {
      eyebrow: "Jeans em foco",
      title: "Jeans em destaque para todos os momentos",
      description: "Modelagens versáteis, visual moderno e peças que entram com facilidade na rotina.",
      href: jeansHref,
      ctaLabel: "Explorar jeans",
      secondaryHref: "/produtos",
      secondaryLabel: "Ver produtos",
      imageUrl: "/hero/jeans-em-foco.png",
      imageAlt: getProductImage(jeansHeroProduct)?.altText ?? jeansHeroProduct?.name ?? "Jeans em foco Dolmini Model",
      priceLabel: jeansHeroProduct ? formatCurrency(jeansHeroProduct.salePrice ?? jeansHeroProduct.price) : null,
      badge: "Jeans",
      detailLabel: "Jeans em foco"
    },
    {
      eyebrow: "Promoções ativas",
      title: "Ofertas para entrar no radar",
      description: "Peças selecionadas com condições especiais para renovar a vitrine com estilo.",
      href: promotionsHref,
      ctaLabel: "Ver promoções",
      secondaryHref: "/produtos",
      secondaryLabel: "Comprar agora",
      imageUrl: "/hero/promocoes-ativas.png",
      imageAlt: getProductImage(promotionProducts[0])?.altText ?? promotionProducts[0]?.name ?? "Promoções selecionadas Dolmini Model",
      priceLabel: promotionProducts[0] ? formatCurrency(promotionProducts[0].salePrice ?? promotionProducts[0].price) : "Ofertas em destaque",
      badge: promotionProducts.length ? "Oferta" : "Em breve",
      detailLabel: "Promoções ativas"
    },
    {
      eyebrow: "Destaques da vitrine",
      title: "Curadoria casual da Dolmini",
      description: "Uma seleção pensada para unir praticidade, presença e estilo no dia a dia.",
      href: "/produtos",
      ctaLabel: "Ver destaques",
      secondaryHref: "/produtos",
      secondaryLabel: "Mais vendidos",
      imageUrl: "/hero/destaques-vitrine.png",
      imageAlt: getProductImage(heroProducts[2])?.altText ?? heroProducts[2]?.name ?? "Destaques da vitrine Dolmini Model",
      priceLabel: heroProducts[2] ? formatCurrency(heroProducts[2].salePrice ?? heroProducts[2].price) : "Curadoria Dolmini",
      badge: "Destaque",
      detailLabel: "Destaques da vitrine"
    }
  ];

  return (
    <StorefrontShell>
      <main>
        <section className="overflow-x-clip bg-[#F8F4EF]">
          <div>
            <HeroShowcaseCarousel slides={heroSlides} />
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
            href={promotionsHref}
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
              <a className="inline-flex min-h-12 items-center rounded-full bg-[#003E40] px-7 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white shadow-lift hover:bg-[#002D2F]" href="/produtos">
                Ver produtos
              </a>
              <a className="inline-flex min-h-12 items-center rounded-full border border-[rgba(0,62,64,0.14)] bg-white px-7 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-[#003E40] hover:bg-[#F8F4EF]" href={promotionsHref}>
                Ir para promoções
              </a>
            </div>
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}
