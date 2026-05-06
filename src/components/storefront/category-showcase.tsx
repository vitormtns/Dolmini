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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link className="group rounded-[1.2rem] border border-[rgba(0,62,64,0.12)] bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1" href={item.href} key={item.name}>
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#003E40] text-white">
                  <item.icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-5 w-5 text-[#00A7A7] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <h3 className="mt-7 text-2xl font-extrabold tracking-tight text-[#003E40]">{item.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B7A7C]">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
