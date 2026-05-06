import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="store-gradient rounded-[2rem] border border-dashed border-primary/20 p-12 text-center shadow-soft">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white text-[#00A7A7] shadow-soft">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">Seu carrinho est&aacute; vazio</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Escolha produtos da vitrine para iniciar sua compra.
      </p>
      <Link className="mt-6 inline-flex min-h-12 items-center rounded-full bg-primary px-6 py-3 text-sm font-extrabold uppercase tracking-[0.12em] text-primary-foreground transition-colors hover:bg-[#002D2F]" href="/produtos">
        Ver produtos
      </Link>
    </div>
  );
}
