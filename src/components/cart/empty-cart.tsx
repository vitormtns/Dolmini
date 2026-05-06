import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="rounded-lg border border-dashed bg-white p-10 text-center">
      <h2 className="text-lg font-semibold">Seu carrinho esta vazio</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Escolha produtos da vitrine para iniciar sua compra.
      </p>
      <Link className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" href="/produtos">
        Ver produtos
      </Link>
    </div>
  );
}
