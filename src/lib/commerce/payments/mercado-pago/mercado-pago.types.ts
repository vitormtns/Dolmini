export type MercadoPagoPreferenceItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: "BRL";
};

export type MercadoPagoPreferenceRequest = {
  items: MercadoPagoPreferenceItem[];
  payer: {
    name: string;
    email: string;
    phone?: {
      number: string;
    };
  };
  external_reference: string;
  notification_url: string;
  back_urls: {
    success: string;
    failure: string;
    pending: string;
  };
  auto_return: "approved";
};

export type MercadoPagoErrorResponse = {
  error?: unknown;
  message?: unknown;
  cause?: unknown;
};

export type MercadoPagoPreferenceResponse = {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
};

export type MercadoPagoPayment = {
  id: number;
  status: "pending" | "approved" | "rejected" | "cancelled" | "refunded" | string;
  transaction_amount: number;
  external_reference: string | null;
  preference_id: string | null;
  currency_id: string;
};

export type MercadoPagoWebhookPayload = {
  id?: string | number;
  action?: string;
  type?: string;
  data?: {
    id?: string | number;
  };
};
