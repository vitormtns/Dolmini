import Link from "next/link";
import { ArrowUpRight, BadgePercent, Gem, Shirt, Sparkles } from "lucide-react";
import type { Category } from "@/lib/commerce/categories/category.types";

const fallbackItems = [
  { name: "Feminino", slug: "feminino", description: "Moda casual selecionada.", icon: Shirt },
  { name: "Jeans", slug: "jeans", description: "Calças, bermudas e favoritos.", icon: Gem },
  { name: "Promoções", slug: "promocoes", description: "Peças com preço especial.", icon: BadgePercent },
  { name: "Novidades", slug: "novidades", description: "Entradas recentes na vitrine.", icon: Sparkles }
];

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  const items = fallbackItems.map((item) => {
    const realCategory = categories.find((category) => category.slug === item.slug || category.name.toLowerCase().includes(item.name.toLowerCase()));
    return {
      ...item,
      href: realCategory ? `/categoria/${realCategory.slug}` : item.slug === "promocoes" ? "/produtos?ordenar=promocoes" : "/produtos",
      description: realCategory?.description ?? item.description
    };
  });

  return (
    <section className="bg-[#F8F4EF]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {items.map((item) => (
            <Link className="group rounded-[1rem] border border-[rgba(0,62,64,0.12)] bg-white p-4 shadow-soft transition duration-300 hover:-translate-y-1 sm:rounded-[1.2rem] sm:p-5" href={item.href} key={item.name}>
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#003E40] text-white sm:h-11 sm:w-11">
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-[#00A7A7] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-5 sm:w-5" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold tracking-tight text-[#003E40] sm:mt-7 sm:text-2xl">{item.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[#6B7A7C] sm:mt-2 sm:text-sm sm:leading-6">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
