import { effectivePrice, normalizeMoney } from "@/lib/commerce/shared/money";
import type { Product, ProductVariant } from "@/lib/commerce/products/product.types";

export class PricingService {
  getUnitPrice(product: Product, variant?: ProductVariant | null) {
    const basePrice = effectivePrice(product.price, product.salePrice);
    return normalizeMoney(basePrice + (variant?.priceAdjustment ?? 0));
  }

  summarize(lines: Array<{ quantity: number; unitPrice: number }>) {
    const subtotal = normalizeMoney(
      lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
    );

    const discount = 0;
    const shipping = 0;
    const total = normalizeMoney(subtotal - discount + shipping);

    return { subtotal, discount, shipping, total };
  }
}
