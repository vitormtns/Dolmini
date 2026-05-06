import { AdminShell } from "@/components/admin/admin-shell";
import { CommerceError } from "@/lib/commerce/shared/errors";
import { requireAdmin } from "@/lib/commerce/shared/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof CommerceError && error.code === "unauthorized") {
      redirect("/login");
    }

    if (error instanceof CommerceError && error.code === "forbidden") {
      redirect("/acesso-negado");
    }

    throw error;
  }

  return <AdminShell>{children}</AdminShell>;
}
