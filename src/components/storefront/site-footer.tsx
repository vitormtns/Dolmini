import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 text-sm text-muted-foreground sm:grid-cols-2">
        <div>
          <strong className="text-foreground">Dolmini Model</strong>
          <p className="mt-2 max-w-md">
            Loja em preparacao com catalogo proprio, pagamentos seguros e operacao independente.
          </p>
        </div>
        <div className="flex gap-4 sm:justify-end">
          <Link href="/produtos">Produtos</Link>
          <Link href="/login">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
