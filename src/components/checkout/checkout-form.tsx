"use client";

import { useState } from "react";
import { z } from "zod";
import { useCart } from "@/components/cart/cart-provider";

const checkoutFormSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z.string().min(8, "Informe um telefone."),
  document: z.string().optional(),
  postalCode: z.string().min(5, "Informe o CEP."),
  line1: z.string().min(3, "Informe o endere\u00e7o."),
  number: z.string().min(1, "Informe o n\u00famero."),
  line2: z.string().optional(),
  neighborhood: z.string().min(2, "Informe o bairro."),
  city: z.string().min(2, "Informe a cidade."),
  state: z.string().min(2, "Informe o estado.")
});

type CheckoutFormState = z.infer<typeof checkoutFormSchema>;

const initialState: CheckoutFormState = {
  name: "",
  email: "",
  phone: "",
  document: "",
  postalCode: "",
  line1: "",
  number: "",
  line2: "",
  neighborhood: "",
  city: "",
  state: ""
};

export function CheckoutForm() {
  const { items, clearCart, validateCart } = useCart();
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = checkoutFormSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revise os dados.");
      return;
    }

    if (items.length === 0) {
      setError("Seu carrinho est\u00e1 vazio.");
      return;
    }

    setLoading(true);
    const validCart = await validateCart();
    if (!validCart) {
      setLoading(false);
      setError("Revise o carrinho antes de finalizar.");
      return;
    }

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cart: { items },
        customer: {
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          document: parsed.data.document || null,
          address: {
            line1: `${parsed.data.line1}, ${parsed.data.number}`,
            line2: parsed.data.line2 || null,
            neighborhood: parsed.data.neighborhood,
            city: parsed.data.city,
            state: parsed.data.state,
            postalCode: parsed.data.postalCode,
            country: "BR"
          }
        }
      })
    });
    const body = await response.json();

    if (!response.ok || !body.success) {
      setLoading(false);
      setError(
        body.code === "PAYMENT_PROVIDER_NOT_CONFIGURED" || body.code === "PAYMENT_PROVIDER_ERROR"
          ? "Checkout temporariamente indispon\u00edvel. Tente novamente mais tarde."
          : body.error ?? "N\u00e3o foi poss\u00edvel iniciar o pagamento."
      );
      return;
    }

    clearCart();
    window.location.href = body.data.checkout.checkoutUrl;
  }

  const inputClass = "min-h-12 min-w-0 rounded-[0.85rem] border border-primary/10 bg-[#F8F4EF] px-4 py-2 text-sm text-[#102224]";

  return (
    <form className="grid gap-5 rounded-[1.1rem] border border-primary/10 bg-white p-4 shadow-soft sm:gap-6 sm:rounded-[1.5rem] sm:p-6" onSubmit={submit}>
      {error ? <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent sm:tracking-[0.18em]">Dados</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">Dados pessoais</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Nome
          <input className={inputClass} value={form.name} onChange={(event) => update("name", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          E-mail
          <input className={inputClass} type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Telefone
          <input className={inputClass} value={form.phone} onChange={(event) => update("phone", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          CPF (opcional)
          <input className={inputClass} value={form.document} onChange={(event) => update("document", event.target.value)} />
        </label>
      </div>
      <div className="border-t pt-5 sm:pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent sm:tracking-[0.18em]">Entrega</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">Endereço de entrega</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          CEP
          <input className={inputClass} value={form.postalCode} onChange={(event) => update("postalCode", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Endereço
          <input className={inputClass} value={form.line1} onChange={(event) => update("line1", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Número
          <input className={inputClass} value={form.number} onChange={(event) => update("number", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Complemento
          <input className={inputClass} value={form.line2} onChange={(event) => update("line2", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Bairro
          <input className={inputClass} value={form.neighborhood} onChange={(event) => update("neighborhood", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Cidade
          <input className={inputClass} value={form.city} onChange={(event) => update("city", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Estado
          <input className={inputClass} value={form.state} onChange={(event) => update("state", event.target.value)} />
        </label>
      </div>
      <div className="border-t pt-5 sm:pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent sm:tracking-[0.18em]">Pagamento</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">O checkout valida seu carrinho antes de encaminhar para o provedor configurado. Sem Mercado Pago configurado, o erro é controlado e nenhum pedido é aprovado pela URL.</p>
      </div>
      <button className="min-h-12 rounded-full bg-primary px-5 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-primary-foreground shadow-lift transition-colors hover:bg-[#002D2F] disabled:opacity-60 sm:tracking-[0.1em]" disabled={loading} type="submit">
        {loading ? "Criando pagamento..." : "Finalizar compra"}
      </button>
    </form>
  );
}
