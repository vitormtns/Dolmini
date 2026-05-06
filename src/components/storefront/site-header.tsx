import Link from "next/link";
import { CartLink } from "@/components/cart/cart-drawer";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link className="text-lg font-semibold tracking-tight" href="/">
          Dolmini Model
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <Link className="hover:text-foreground" href="/produtos">Produtos</Link>
          <CartLink />
          <Link className="hidden hover:text-foreground sm:inline" href="/login">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
