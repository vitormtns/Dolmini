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
    <header className="sticky left-0 right-0 top-0 z-40 w-screen max-w-full overflow-x-clip border-b border-[rgba(0,62,64,0.12)] bg-white/88 backdrop-blur-xl">
      <AnnouncementBar />
      <div className="mx-auto flex h-[76px] w-full max-w-[100vw] items-center justify-between gap-5 px-4 sm:h-[78px] sm:px-6 xl:max-w-7xl">
        <Link className="group flex shrink-0 items-center" href="/" aria-label="Dolmini Model - início">
          <span className="relative block h-12 w-[146px] shrink-0 overflow-hidden sm:h-[52px] sm:w-[176px]">
            <Image
              alt="Dolmini Model"
              className="object-cover object-center"
              fill
              priority
              sizes="(max-width: 639px) 146px, 176px"
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
            Área admin
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
                Área admin
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
