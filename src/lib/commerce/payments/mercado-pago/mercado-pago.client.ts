import { CommerceError } from "@/lib/commerce/shared/errors";
import { env } from "@/lib/env";
import type {
  MercadoPagoPayment,
  MercadoPagoPreferenceRequest,
  MercadoPagoPreferenceResponse
} from "@/lib/commerce/payments/mercado-pago/mercado-pago.types";

const mercadoPagoApiUrl = "https://api.mercadopago.com";

export class MercadoPagoClient {
  private get accessToken() {
    if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
      throw new CommerceError(
        "Checkout temporariamente indisponível. Tente novamente mais tarde.",
        "PAYMENT_PROVIDER_NOT_CONFIGURED",
        503
      );
    }

    return env.MERCADO_PAGO_ACCESS_TOKEN;
  }

  async createPreference(payload: MercadoPagoPreferenceRequest) {
    console.info("Mercado Pago preference payload summary", summarizePreferencePayload(payload));

    const response = await fetch(`${mercadoPagoApiUrl}/checkout/preferences`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new CommerceError(
        "Mercado Pago recusou a criacao da preferencia.",
        "PAYMENT_PROVIDER_ERROR",
        502
      );
    }

    return (await response.json()) as MercadoPagoPreferenceResponse;
  }

  async getPayment(paymentId: string | number) {
    const response = await fetch(`${mercadoPagoApiUrl}/v1/payments/${paymentId}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new CommerceError(
        "Não foi possível consultar o pagamento no Mercado Pago.",
        "PAYMENT_PROVIDER_ERROR",
        502
      );
    }

    return (await response.json()) as MercadoPagoPayment;
  }
}

function summarizePreferencePayload(payload: MercadoPagoPreferenceRequest) {
  return {
    itemCount: payload.items.length,
    items: payload.items.map((item) => ({
      id: item.id,
      hasTitle: Boolean(item.title),
      titleLength: item.title.length,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_id: item.currency_id
    })),
    payer: {
      hasName: Boolean(payload.payer.name),
      hasEmail: Boolean(payload.payer.email),
      hasPhone: Boolean(payload.payer.phone?.number)
    },
    external_reference: payload.external_reference,
    notification_url: payload.notification_url,
    back_urls: payload.back_urls,
    payment_methods: payload.payment_methods,
    hasExcludedPaymentTypes: "excluded_payment_types" in payload,
    hasExcludedPaymentMethods: "excluded_payment_methods" in payload,
    hasBinaryMode: "binary_mode" in payload,
    auto_return: payload.auto_return
  };
}
