import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock3, ShoppingBag } from "lucide-react";

export function CheckoutStatusCard({
  title,
  description,
  tone = "neutral"
}: {
  title: string;
  description: string;
  tone?: "success" | "warning" | "danger" | "neutral";
}) {
  const color =
    tone === "success"
      ? "border-emerald-200 bg-white"
      : tone === "danger"
        ? "border-red-200 bg-white"
        : tone === "warning"
          ? "border-amber-200 bg-white"
          : "border-zinc-200 bg-white";
  const Icon = tone === "success" ? CheckCircle2 : tone === "danger" ? AlertTriangle : tone === "warning" ? Clock3 : ShoppingBag;
  const iconColor = tone === "success" ? "text-emerald-600" : tone === "danger" ? "text-red-600" : tone === "warning" ? "text-amber-600" : "text-accent";

  return (
    <section className={`mx-auto max-w-xl rounded-[2rem] border p-8 text-center shadow-lift ${color}`}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-background">
        <Icon className={`h-7 w-7 ${iconColor}`} />
      </div>
      <h1 className="mt-5 text-4xl font-extrabold leading-[1.02] tracking-tight text-primary sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link className="inline-flex min-h-12 items-center rounded-full bg-primary px-5 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-[#002D2F]" href="/produtos">
          Ver produtos
        </Link>
        <Link className="inline-flex min-h-12 items-center rounded-full border bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-[0.1em] transition-colors hover:bg-muted" href="/carrinho">
          Voltar ao carrinho
        </Link>
      </div>
    </section>
  );
}
