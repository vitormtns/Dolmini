"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { CartLink } from "@/components/cart/cart-drawer";
import { AnnouncementBar } from "@/components/storefront/announcement-bar";

// Coloque a imagem em /public e ajuste somente este caminho.
// Exemplo: public/logoheader.png -> "/logoheader.png"
const logoSrc = "/logoheader.png";

const links = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/produtos?categoria=jeans", label: "Jeans" },
  { href: "/produtos?ordenar=promocoes", label: "Promoções" },
  { href: "/produtos?ordenar=novidades", label: "Novidades" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(0,62,64,0.12)] bg-white/88 backdrop-blur-xl">
      <AnnouncementBar />
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link className="group flex min-w-0 items-center" href="/" aria-label="Dolmini Model - início">
          <span className="relative block h-16 w-[230px] overflow-hidden sm:h-[70px] sm:w-[280px]">
            <Image
              alt="Dolmini Model"
              className="absolute -left-9 -top-[105px] h-[245px] w-[302px] max-w-none object-contain sm:-left-10 sm:-top-[60px] sm:h-[180px] sm:w-[345px]"
              height={280}
              priority
              width={345}
              src={logoSrc}
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-extrabold uppercase tracking-[0.14em] text-[#536A6D] lg:flex">
          {links.map((link) => (
            <Link className="transition-colors hover:text-[#003E40]" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(0,62,64,0.12)] bg-[#F8F4EF] text-[#003E40] transition hover:bg-white" href="/produtos" aria-label="Buscar produtos">
            <Search className="h-4 w-4" />
          </Link>
          <Link className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7A7C] hover:text-[#003E40]" href="/login">
            Admin
          </Link>
          <CartLink />
        </div>

        <button
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(0,62,64,0.12)] bg-white text-[#003E40] md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[rgba(0,62,64,0.12)] bg-white px-4 py-4 md:hidden">
          <nav className="grid gap-2">
            {links.map((link) => (
              <Link className="rounded-lg px-3 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-[#003E40] hover:bg-[#F8F4EF]" href={link.href} key={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-lg bg-[#F8F4EF] px-3 py-3">
              <CartLink />
              <Link className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7A7C]" href="/login" onClick={() => setOpen(false)}>
                Admin
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
