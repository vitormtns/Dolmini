import { ShieldCheck, Sparkles } from "lucide-react";

const messages = [
  "Novidades selecionadas toda semana",
  "Atendimento próximo",
  "Compra segura",
  "Estoque validado"
];

export function AnnouncementBar() {
  return (
    <div className="bg-[#003E40] text-white">
      <div className="relative mx-auto flex h-9 max-w-7xl items-center justify-center overflow-hidden px-4 text-[11px] font-bold uppercase tracking-[0.16em] sm:px-6">
        <Sparkles className="pointer-events-none absolute left-4 hidden h-3.5 w-3.5 text-[#00C2C7] sm:left-6 sm:block" />
        <div className="hide-scrollbar flex max-w-full items-center gap-3 overflow-x-auto whitespace-nowrap text-white/82 sm:max-w-[calc(100%-5rem)] sm:justify-center">
          {messages.map((message, index) => (
            <span className="inline-flex items-center gap-3" key={message}>
              {message}
              {index < messages.length - 1 ? <span className="text-[#00C2C7]">•</span> : null}
            </span>
          ))}
        </div>
        <ShieldCheck className="pointer-events-none absolute right-4 hidden h-3.5 w-3.5 text-[#00C2C7] sm:right-6 lg:block" />
      </div>
    </div>
  );
}
