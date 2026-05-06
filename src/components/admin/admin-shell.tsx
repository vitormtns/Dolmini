import { AdminSidebar } from "@/components/admin/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40 md:flex">
      <AdminSidebar />
      <main className="w-full p-4 md:p-8">{children}</main>
    </div>
  );
}
