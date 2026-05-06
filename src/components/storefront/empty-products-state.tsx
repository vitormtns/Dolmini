import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function EmptyProductsState({
  title = "Nenhum produto encontrado",
  description = "Tente limpar os filtros ou voltar mais tarde."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-[rgba(0,62,64,0.2)] bg-white p-10 text-center shadow-soft">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#F8F4EF] text-[#00A7A7]">
        <ShoppingBag className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-[#003E40]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6B7A7C]">{description}</p>
      <Link className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#003E40] px-5 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-white hover:bg-[#002D2F]" href="/produtos">
        Continuar comprando
      </Link>
    </div>
  );
}
