"use client";

import { useRef, useState } from "react";
import { z } from "zod";
import { useCart } from "@/components/cart/cart-provider";
import { fetchAddressByCep, formatCep, isValidCep, normalizeCep } from "@/lib/cep";

const checkoutFormSchema = z.object({
  name: z.string().min(2, "Informe seu nome."),
  email: z.string().email("Informe um e-mail válido."),
  phone: z.string().min(8, "Informe um telefone."),
  document: z.string().optional(),
  postalCode: z.string().refine(isValidCep, "Informe um CEP válido com 8 dígitos."),
  line1: z.string().min(3, "Informe o endereço."),
  number: z.string().min(1, "Informe o número."),
  line2: z.string().optional(),
  neighborhood: z.string().min(2, "Informe o bairro."),
  city: z.string().min(2, "Informe a cidade."),
  state: z.string().min(2, "Informe o estado.")
});

type CheckoutFormState = z.infer<typeof checkoutFormSchema>;
type CepLookupState = "idle" | "loading" | "found" | "not_found" | "invalid" | "error";

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
  const [cepMessage, setCepMessage] = useState<string | null>(null);
  const [cepLookupState, setCepLookupState] = useState<CepLookupState>("idle");
  const [loading, setLoading] = useState(false);
  const lastFetchedCepRef = useRef<string | null>(null);
  const activeCepRequestRef = useRef<string | null>(null);

  function update<K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updatePostalCode(value: string) {
    const normalizedCep = normalizeCep(value);
    const formattedCep = formatCep(value);

    setForm((current) => ({ ...current, postalCode: formattedCep }));

    if (!normalizedCep) {
      setCepLookupState("idle");
      setCepMessage(null);
      lastFetchedCepRef.current = null;
      return;
    }

    if (normalizedCep.length < 8) {
      setCepLookupState("idle");
      setCepMessage(null);
      lastFetchedCepRef.current = null;
      return;
    }

    void lookupCep(normalizedCep);
  }

  async function lookupCep(cep: string, options: { force?: boolean } = {}) {
    const normalizedCep = normalizeCep(cep);

    if (!normalizedCep) {
      setCepLookupState("idle");
      setCepMessage(null);
      return;
    }

    if (!isValidCep(normalizedCep)) {
      setCepLookupState("invalid");
      setCepMessage("CEP inválido. Informe 8 dígitos ou preencha o endereço manualmente.");
      return;
    }

    if (!options.force && lastFetchedCepRef.current === normalizedCep) return;

    lastFetchedCepRef.current = normalizedCep;
    activeCepRequestRef.current = normalizedCep;
    setCepLookupState("loading");
    setCepMessage("Buscando CEP...");

    try {
      const address = await fetchAddressByCep(normalizedCep);

      if (activeCepRequestRef.current !== normalizedCep) return;

      if (!address) {
        setCepLookupState("not_found");
        setCepMessage("CEP não encontrado. Preencha o endereço manualmente.");
        return;
      }

      setForm((current) => ({
        ...current,
        postalCode: formatCep(normalizedCep),
        line1: address.street || current.line1,
        neighborhood: address.neighborhood || current.neighborhood,
        city: address.city || current.city,
        state: address.state || current.state,
        number: current.number,
        line2: current.line2
      }));
      setCepLookupState("found");
      setCepMessage("Endereço preenchido automaticamente. Você pode editar se precisar.");
    } catch {
      if (activeCepRequestRef.current !== normalizedCep) return;

      setCepLookupState("error");
      setCepMessage("Não foi possível buscar o CEP agora. Preencha o endereço manualmente.");
    }
  }

  function handlePostalCodeBlur() {
    const normalizedCep = normalizeCep(form.postalCode);

    if (!normalizedCep) {
      setCepLookupState("idle");
      setCepMessage(null);
      return;
    }

    if (!isValidCep(normalizedCep)) {
      setCepLookupState("invalid");
      setCepMessage("CEP inválido. Informe 8 dígitos ou preencha o endereço manualmente.");
      return;
    }

    void lookupCep(normalizedCep);
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
      setError("Seu carrinho está vazio.");
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
            postalCode: normalizeCep(parsed.data.postalCode),
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
          ? "Checkout temporariamente indisponível. Tente novamente mais tarde."
          : body.error ?? "Não foi possível iniciar o pagamento."
      );
      return;
    }

    clearCart();
    window.location.href = body.data.checkout.checkoutUrl;
  }

  const inputClass = "min-h-12 min-w-0 rounded-[0.85rem] border border-primary/10 bg-[#F8F4EF] px-4 py-2 text-sm text-[#102224]";
  const cepMessageClass =
    cepLookupState === "invalid" || cepLookupState === "not_found" || cepLookupState === "error"
      ? "text-amber-700"
      : "text-muted-foreground";

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
          <input
            autoComplete="postal-code"
            className={inputClass}
            inputMode="numeric"
            placeholder="00000-000"
            value={form.postalCode}
            onBlur={handlePostalCodeBlur}
            onChange={(event) => updatePostalCode(event.target.value)}
          />
          {cepMessage ? (
            <span className={`text-xs font-medium ${cepMessageClass}`} aria-live="polite">
              {cepMessage}
            </span>
          ) : null}
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
