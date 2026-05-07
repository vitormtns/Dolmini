import crypto from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CommerceError } from "@/lib/commerce/shared/errors";
import { moneyToCents } from "@/lib/commerce/shared/money";
import { InventoryService } from "@/lib/commerce/inventory/inventory.service";
import { OrderRepository } from "@/lib/commerce/orders/order.repository";
import { MercadoPagoClient } from "@/lib/commerce/payments/mercado-pago/mercado-pago.client";
import type { MercadoPagoWebhookPayload } from "@/lib/commerce/payments/mercado-pago/mercado-pago.types";
import { env } from "@/lib/env";

type Client = SupabaseClient<any, "public", any>;

export class MercadoPagoWebhookService {
  constructor(
    private readonly supabase: Client,
    private readonly client: MercadoPagoClient,
    private readonly orders: OrderRepository,
    private readonly inventory: InventoryService
  ) {}

  async handle(rawBody: string, headers: Headers, requestUrl: string) {
    let payload: MercadoPagoWebhookPayload;
    try {
      payload = JSON.parse(rawBody) as MercadoPagoWebhookPayload;
    } catch {
      throw new CommerceError("Payload JSON inválido.", "invalid_webhook_payload", 400);
    }
    const url = new URL(requestUrl);
    const queryDataId = url.searchParams.get("data.id");
    const paymentId = payload.data?.id ?? queryDataId ?? payload.id;
    this.verifySignatureWhenConfigured(headers, queryDataId ?? payload.data?.id);

    const eventKey = this.getEventKey(payload, paymentId);

    const eventStatus = await this.acquirePaymentEvent(eventKey, payload, headers);
    if (eventStatus !== "created") {
      return { ok: true, duplicate: true, eventStatus };
    }

    if (!paymentId) {
      await this.markEventProcessed(eventKey, "ignored_without_payment_id");
      return { ok: true, ignored: true };
    }

    const payment = await this.client.getPayment(paymentId);
    const orderReference = payment.external_reference;

    if (!orderReference) {
      await this.markEventProcessed(eventKey, "payment_without_reference");
      return { ok: true, approved: false, reason: "payment_without_reference" };
    }

    const order = await this.orders.findByOrderNumber(orderReference);
    if (!order) {
      await this.markEventProcessed(eventKey, "order_not_found");
      return { ok: true, approved: false, reason: "order_not_found" };
    }

    if (moneyToCents(payment.transaction_amount) !== order.totalCents) {
      await this.markEventProcessed(eventKey, "payment_amount_mismatch");
      console.error("Mercado Pago amount mismatch", {
        orderId: order.id,
        orderTotalCents: order.totalCents,
        transactionAmount: payment.transaction_amount,
        paymentId: payment.id
      });
      return { ok: true, approved: false, reason: "payment_amount_mismatch" };
    }

    if (payment.status === "approved") {
      await this.orders.updatePaymentState(order.id, {
        status: "paid",
        paymentStatus: "approved",
        mercadoPagoPaymentId: String(payment.id)
      });
      await this.inventory.decrementForOrder(order.id);
    } else if (payment.status === "rejected") {
      await this.orders.updatePaymentState(order.id, {
        status: "cancelled",
        paymentStatus: "rejected",
        mercadoPagoPaymentId: String(payment.id)
      });
    } else if (payment.status === "cancelled") {
      await this.orders.updatePaymentState(order.id, {
        status: "cancelled",
        paymentStatus: "cancelled",
        mercadoPagoPaymentId: String(payment.id)
      });
    } else if (payment.status === "refunded") {
      await this.orders.updatePaymentState(order.id, {
        status: "refunded",
        paymentStatus: "refunded",
        mercadoPagoPaymentId: String(payment.id)
      });
    }

    await this.markEventProcessed(eventKey, "processed");
    return { ok: true };
  }

  private verifySignatureWhenConfigured(headers: Headers, dataId?: string | number | null) {
    const signature = headers.get("x-signature");
    const xRequestId = headers.get("x-request-id");
    const isProduction = env.NODE_ENV === "production";

    if (!env.MERCADO_PAGO_WEBHOOK_SECRET) {
      if (isProduction) {
        throw new CommerceError(
          "Secret do webhook Mercado Pago não configurado.",
          "webhook_secret_missing",
          500
        );
      }

      console.warn("Mercado Pago webhook signature skipped: secret missing outside production.");
      return;
    }

    if (!signature || !xRequestId || !dataId) {
      if (!isProduction) {
        console.warn(
          "Mercado Pago webhook signature skipped: missing signature headers outside production."
        );
        return;
      }

      throw new CommerceError("Assinatura Mercado Pago ausente.", "webhook_signature_missing", 401);
    }

    const signatureParts = this.parseSignature(signature);
    const ts = signatureParts.get("ts");
    const received = signatureParts.get("v1");

    if (!ts || !received) {
      throw new CommerceError("Assinatura Mercado Pago malformada.", "webhook_signature_invalid", 401);
    }

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const expected = crypto
      .createHmac("sha256", env.MERCADO_PAGO_WEBHOOK_SECRET)
      .update(manifest)
      .digest("hex");

    const valid =
      received.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(received), Buffer.from(expected));

    if (!valid) {
      throw new CommerceError("Assinatura Mercado Pago invalida.", "webhook_signature_invalid", 401);
    }
  }

  private getEventKey(payload: MercadoPagoWebhookPayload, paymentId?: string | number) {
    return String(payload.id ?? `${payload.action ?? "event"}:${payload.type ?? "unknown"}:${paymentId ?? crypto.randomUUID()}`);
  }

  private parseSignature(signature: string) {
    return new Map(
      signature.split(",").map((part) => {
        const [key, ...value] = part.trim().split("=");
        return [key, value.join("=")] as const;
      })
    );
  }

  private async acquirePaymentEvent(eventKey: string, payload: MercadoPagoWebhookPayload, headers: Headers) {
    const { error } = await this.supabase.from("payment_events").insert({
      provider: "mercado_pago",
      event_key: eventKey,
      provider_event_id: eventKey,
      event_type: payload.type ?? payload.action ?? "unknown",
      payload,
      raw_payload: payload,
      headers: Object.fromEntries(headers.entries()),
      processed_at: null
    });

    if (!error) return "created";
    if (error.code !== "23505") throw error;

    const { data, error: lookupError } = await this.supabase
      .from("payment_events")
      .select("processed_at")
      .eq("provider", "mercado_pago")
      .eq("event_key", eventKey)
      .single();

    if (lookupError) throw lookupError;
    return data?.processed_at ? "duplicate_processed" : "duplicate_in_progress";
  }

  private async markEventProcessed(eventKey: string, status: string) {
    const { error } = await this.supabase
      .from("payment_events")
      .update({
        processing_status: status,
        processed_at: new Date().toISOString()
      })
      .eq("provider", "mercado_pago")
      .eq("event_key", eventKey);

    if (error) throw error;
  }
}
