import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F4EF] text-foreground">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
