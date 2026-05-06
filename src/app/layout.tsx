import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Dolmini Model",
  description: "Loja virtual de moda casual, jeans, bermudas e peças selecionadas."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${sans.variable} font-sans antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
