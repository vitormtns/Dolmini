import Link from "next/link";

const footerLogoSrc = "/logofooter.png";

export function SiteFooter() {
  return (
    <footer className="petrol-panel text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="h-40 w-110">
            <img alt="Dolmini Model" className="h-full w-full object-contain object-left" src={footerLogoSrc} />
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/72">
            Loja virtual de moda casual, jeans, bermudas e peças selecionadas com curadoria visual e compra direta.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Loja</p>
          <div className="mt-4 grid gap-3 text-sm text-white/78">
            <Link href="/produtos">Produtos</Link>
            <Link href="/produtos?categoria=jeans">Jeans</Link>
            <Link href="/produtos?ordenar=promocoes">Promoções</Link>
            <Link href="/carrinho">Carrinho</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Atendimento</p>
          <p className="mt-4 text-sm leading-6 text-white/78">
            Atendimento próximo, peças selecionadas e checkout seguro preparado para Mercado Pago.
          </p>
          <Link className="mt-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold" href="/login">
            Área admin
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© 2026 Dolmini Model. Todos os direitos reservados.</span>
          <span>Compra segura • Estoque validado • Atendimento próximo</span>
        </div>
      </div>
    </footer>
  );
}
