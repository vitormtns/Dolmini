import type { Metadata } from "next";
import { CheckoutStatusCard } from "@/components/checkout/checkout-status-card";
import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Pagamento em processamento | Dolmini Model"
};

export const dynamic = "force-dynamic";

type CheckoutPendingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type OrderPaymentSnapshot = {
  status: string;
  payment_status: string;
};

export default async function CheckoutPendingPage({ searchParams }: CheckoutPendingPageProps) {
  const params = await searchParams;
  const order = await findReturnedOrderStatus(params);
  const isPaid =
    order?.payment_status === "approved" ||
    ["paid", "processing", "shipped", "delivered"].includes(order?.status ?? "");

  return (
    <StorefrontShell>
      <main className="px-4 py-10 sm:py-16">
        <CheckoutStatusCard
          tone={isPaid ? "success" : "warning"}
          title={isPaid ? "Pagamento confirmado" : "Pagamento em processamento"}
          description={
            isPaid
              ? "Seu pagamento foi aprovado e o pedido já está registrado como pago."
              : "Recebemos seu pedido e estamos aguardando a confirmação do Mercado Pago. Em pagamentos por Pix, isso geralmente acontece em instantes."
          }
          secondaryDescription={
            isPaid
              ? "A confirmação foi feita pelo webhook do Mercado Pago."
              : "Se você já concluiu o pagamento, pode acompanhar a atualização pelo status do pedido."
          }
        />
      </main>
    </StorefrontShell>
  );
}

async function findReturnedOrderStatus(
  params?: Record<string, string | string[] | undefined>
): Promise<OrderPaymentSnapshot | null> {
  const orderReference = getParam(params, "order") ?? getParam(params, "external_reference");
  const preferenceId = getParam(params, "preference_id");

  if (!orderReference && !preferenceId) return null;

  try {
    const supabase = createSupabaseAdminClient();

    if (orderReference) {
      const { data, error } = await supabase
        .from("orders")
        .select("status,payment_status")
        .eq("order_number", orderReference)
        .maybeSingle();

      if (!error && data) return data as OrderPaymentSnapshot;
    }

    if (preferenceId) {
      const { data, error } = await supabase
        .from("orders")
        .select("status,payment_status")
        .eq("mercado_pago_preference_id", preferenceId)
        .maybeSingle();

      if (!error && data) return data as OrderPaymentSnapshot;
    }
  } catch (error) {
    console.warn("Não foi possível consultar o status do pedido no retorno do checkout.", error);
  }

  return null;
}

function getParam(params: Record<string, string | string[] | undefined> | undefined, key: string) {
  const value = params?.[key];
  return Array.isArray(value) ? value[0] : value;
}
