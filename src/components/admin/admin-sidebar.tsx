"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, ClipboardList, FolderTree, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Boxes },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/pedidos", label: "Pedidos", icon: ClipboardList }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-b bg-white p-3 md:min-h-screen md:w-64 md:flex-col md:border-b-0 md:border-r md:p-4">
      <div className="hidden px-3 pb-4 md:block">
        <p className="text-sm text-muted-foreground">Dolmini Model</p>
        <strong className="text-lg">Admin</strong>
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
            href={item.href}
            key={item.href}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
      <a
        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:mt-auto"
        href="/logout"
      >
        <LogOut className="h-4 w-4" />
        Sair
      </a>
    </nav>
  );
}
