import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgePercent, ShoppingBag, Sparkles } from "lucide-react";
import { CampaignCarousel } from "@/components/storefront/campaign-carousel";
import { CategoryShowcase } from "@/components/storefront/category-showcase";
import { ProductGrid } from "@/components/storefront/product-grid";
import { ProductImagePlaceholder } from "@/components/storefront/product-card";
import { PromoBanner } from "@/components/storefront/promo-banner";
import { SectionHeading } from "@/components/storefront/section-heading";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { TrustStrip } from "@/components/storefront/trust-strip";
import { createCommerceCore } from "@/lib/commerce/factory";
import { formatCurrency } from "@/lib/format";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dolmini Model | Moda casual, jeans e peças selecionadas",
  description: "Loja virtual de moda casual com jeans, bermudas, calças e peças selecionadas para comprar com leveza."
};

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
  const heroImage = heroProduct ? [...heroProduct.images].sort((a, b) => a.sortOrder - b.sortOrder)[0] : null;

  return (
    <StorefrontShell>
      <main>
        <section className="store-gradient overflow-hidden border-b border-[rgba(0,62,64,0.12)]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:min-h-[680px] lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:py-12">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,62,64,0.12)] bg-white/78 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#003E40] shadow-soft">
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
                  <div className="rounded-2xl border border-[rgba(0,62,64,0.12)] bg-white/78 p-4 shadow-soft" key={item.title}>
                    <item.icon className="h-4 w-4 text-[#00A7A7]" />
                    <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#6B7A7C]">{item.title}</p>
                    <p className="mt-1 text-sm font-extrabold text-[#003E40]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[450px] sm:min-h-[590px]">
              <Link className="group absolute left-0 top-0 w-[70%] overflow-hidden rounded-[1.6rem] border border-white bg-white shadow-lift" href={heroProduct ? `/produtos/${heroProduct.slug}` : "/produtos"}>
                <div className="aspect-[4/5]">
                  {heroImage?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={heroImage.altText ?? heroProduct?.name ?? "Dolmini Model"} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" src={heroImage.url} />
                  ) : (
                    <ProductImagePlaceholder label="Nova coleção" />
                  )}
                </div>
              </Link>

              <div className="absolute right-0 top-12 w-[42%] overflow-hidden rounded-[1.2rem] border border-white bg-white shadow-soft">
                <div className="aspect-[4/5]">
                  {heroProducts[1]?.images[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={heroProducts[1].name} className="h-full w-full object-cover" src={heroProducts[1].images[0].url ?? ""} />
                  ) : (
                    <ProductImagePlaceholder label="Look" />
                  )}
                </div>
              </div>

              <div className="absolute bottom-6 right-0 w-[62%] rounded-[1.2rem] border border-[rgba(0,62,64,0.12)] bg-white p-4 shadow-lift sm:p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#00A7A7]">Produto em foco</p>
                <h2 className="mt-3 line-clamp-2 text-2xl font-extrabold leading-tight tracking-tight text-[#003E40] sm:text-3xl">
                  {heroProduct?.name ?? "Curadoria Dolmini"}
                </h2>
                {heroProduct ? (
                  <p className="mt-4 text-lg font-extrabold text-[#003E40]">
                    {formatCurrency(heroProduct.salePrice ?? heroProduct.price)}
                  </p>
                ) : null}
              </div>
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
