import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/cart-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dolmini Model",
  description: "Commerce Core reutilizavel para lojas Dolmini."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
