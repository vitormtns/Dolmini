import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock3, ShoppingBag } from "lucide-react";

export function CheckoutStatusCard({
  title,
  description,
  secondaryDescription,
  tone = "neutral"
}: {
  title: string;
  description: string;
  secondaryDescription?: string;
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
    <section className={`mx-auto max-w-xl rounded-[1.2rem] border p-5 text-center shadow-lift sm:rounded-[2rem] sm:p-8 ${color}`}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background sm:h-16 sm:w-16">
        <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${iconColor}`} />
      </div>
      <h1 className="mt-5 text-[clamp(2rem,9vw,2.75rem)] font-extrabold leading-[1.04] tracking-tight text-primary sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      {secondaryDescription ? (
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{secondaryDescription}</p>
      ) : null}
      <div className="mx-auto mt-6 grid max-w-xs grid-cols-1 justify-center gap-3 sm:flex sm:max-w-none sm:flex-wrap">
        <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-[#002D2F] sm:tracking-[0.1em]" href="/produtos">
          Ver produtos
        </Link>
        <Link className="inline-flex min-h-12 items-center justify-center rounded-full border bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] transition-colors hover:bg-muted sm:tracking-[0.1em]" href="/carrinho">
          Voltar ao carrinho
        </Link>
      </div>
    </section>
  );
}
