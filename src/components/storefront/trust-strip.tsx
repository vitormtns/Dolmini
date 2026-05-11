import { HeartHandshake, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";

const items = [
  { icon: HeartHandshake, title: "Atendimento próximo", text: "Contato direto para dúvidas, trocas e entrega." },
  { icon: ShieldCheck, title: "Checkout seguro", text: "Pagamento preparado para provedor confiável." },
  { icon: PackageCheck, title: "Estoque validado", text: "Disponibilidade conferida antes da finalização." },
  { icon: Sparkles, title: "Produtos selecionados", text: "Curadoria casual com foco em peças reais." }
];

export function TrustStrip() {
  return (
    <section className="border-y border-[rgba(0,62,64,0.12)] bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-5 sm:px-6 lg:grid-cols-4">
        {items.map((item) => (
          <div className="rounded-xl bg-[#F8F4EF] p-3 sm:rounded-2xl sm:p-4" key={item.title}>
            <item.icon className="h-5 w-5 text-[#00A7A7]" />
            <strong className="mt-3 block text-xs font-extrabold uppercase tracking-[0.1em] text-[#003E40] sm:text-sm sm:tracking-[0.12em]">{item.title}</strong>
            <p className="mt-1 text-xs leading-5 text-[#6B7A7C] sm:text-sm">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
