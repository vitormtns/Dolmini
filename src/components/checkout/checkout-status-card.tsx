import Link from "next/link";

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
      ? "border-emerald-200 bg-emerald-50"
      : tone === "danger"
        ? "border-red-200 bg-red-50"
        : tone === "warning"
          ? "border-amber-200 bg-amber-50"
          : "border-zinc-200 bg-white";

  return (
    <section className={`mx-auto max-w-xl rounded-lg border p-8 text-center ${color}`}>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" href="/produtos">
          Ver produtos
        </Link>
        <Link className="rounded-md border bg-white px-4 py-2 text-sm font-medium" href="/carrinho">
          Voltar ao carrinho
        </Link>
      </div>
    </section>
  );
}
