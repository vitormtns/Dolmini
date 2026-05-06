"use client";

import { useState } from "react";
import { z } from "zod";
import { useCart } from "@/components/cart/cart-provider";

const checkoutFormSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um email valido."),
  phone: z.string().min(8, "Informe um telefone."),
  document: z.string().optional(),
  postalCode: z.string().min(5, "Informe o CEP."),
  line1: z.string().min(3, "Informe o endereco."),
  number: z.string().min(1, "Informe o numero."),
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
      setError("Seu carrinho esta vazio.");
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
          ? "Checkout temporariamente indisponivel. Tente novamente mais tarde."
          : body.error ?? "Nao foi possivel iniciar o pagamento."
      );
      return;
    }

    clearCart();
    window.location.href = body.data.checkout.checkoutUrl;
  }

  return (
    <form className="grid gap-4 rounded-lg border bg-white p-5" onSubmit={submit}>
      {error ? <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Nome
          <input className="rounded-md border px-3 py-2" value={form.name} onChange={(event) => update("name", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input className="rounded-md border px-3 py-2" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Telefone
          <input className="rounded-md border px-3 py-2" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          CPF opcional
          <input className="rounded-md border px-3 py-2" value={form.document} onChange={(event) => update("document", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          CEP
          <input className="rounded-md border px-3 py-2" value={form.postalCode} onChange={(event) => update("postalCode", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Endereco
          <input className="rounded-md border px-3 py-2" value={form.line1} onChange={(event) => update("line1", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Numero
          <input className="rounded-md border px-3 py-2" value={form.number} onChange={(event) => update("number", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Complemento
          <input className="rounded-md border px-3 py-2" value={form.line2} onChange={(event) => update("line2", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Bairro
          <input className="rounded-md border px-3 py-2" value={form.neighborhood} onChange={(event) => update("neighborhood", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Cidade
          <input className="rounded-md border px-3 py-2" value={form.city} onChange={(event) => update("city", event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Estado
          <input className="rounded-md border px-3 py-2" value={form.state} onChange={(event) => update("state", event.target.value)} />
        </label>
      </div>
      <button className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60" disabled={loading} type="submit">
        {loading ? "Criando pagamento..." : "Finalizar compra"}
      </button>
    </form>
  );
}
