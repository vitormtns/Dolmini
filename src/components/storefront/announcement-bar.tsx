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
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-4 overflow-hidden px-4 text-[11px] font-bold uppercase tracking-[0.16em] sm:px-6">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#00C2C7]" />
        <div className="hide-scrollbar flex min-w-0 flex-1 items-center gap-3 overflow-x-auto whitespace-nowrap text-white/82">
          {messages.map((message, index) => (
            <span className="inline-flex items-center gap-3" key={message}>
              {message}
              {index < messages.length - 1 ? <span className="text-[#00C2C7]">•</span> : null}
            </span>
          ))}
        </div>
        <ShieldCheck className="hidden h-3.5 w-3.5 shrink-0 text-[#00C2C7] sm:block" />
      </div>
    </div>
  );
}
