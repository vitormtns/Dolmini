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
