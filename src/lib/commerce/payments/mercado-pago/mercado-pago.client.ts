import { CommerceError } from "@/lib/commerce/shared/errors";
import { env } from "@/lib/env";
import type {
  MercadoPagoErrorResponse,
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
      await logMercadoPagoPreferenceError(response, payload);
      throw new CommerceError(
        "Não foi possível iniciar o pagamento. Tente novamente em instantes.",
        "PAYMENT_PROVIDER_ERROR",
        400
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
    hasPaymentMethods: "payment_methods" in payload,
    hasExcludedPaymentTypes: "excluded_payment_types" in payload,
    hasExcludedPaymentMethods: "excluded_payment_methods" in payload,
    hasBinaryMode: "binary_mode" in payload,
    auto_return: payload.auto_return
  };
}

async function logMercadoPagoPreferenceError(
  response: Response,
  payload: MercadoPagoPreferenceRequest
) {
  const errorBody = await readMercadoPagoErrorBody(response);

  console.error("Mercado Pago preference creation failed", {
    status: response.status,
    error: errorBody.parsed?.error,
    message: errorBody.parsed?.message,
    cause: errorBody.parsed?.cause,
    payload: summarizePreferencePayload(payload)
  });
}

async function readMercadoPagoErrorBody(response: Response) {
  const raw = await response.text();

  try {
    return {
      raw,
      parsed: JSON.parse(raw) as MercadoPagoErrorResponse
    };
  } catch {
    return {
      raw,
      parsed: { message: raw } satisfies MercadoPagoErrorResponse
    };
  }
}
