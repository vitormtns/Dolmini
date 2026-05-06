import { AdminHeader } from "@/components/admin/admin-header";
import { OrderDetailCard } from "@/components/admin/order-detail-card";
import { createCommerceCore } from "@/lib/commerce/factory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const commerce = createCommerceCore(createSupabaseAdminClient());
  const order = await commerce.orders.getAdminById(id);

  return (
    <>
      <AdminHeader
        title="Detalhe do pedido"
        description={order.orderNumber}
      />
      <OrderDetailCard order={order} />
    </>
  );
}
