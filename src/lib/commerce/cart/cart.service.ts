import { ProductRepository } from "@/lib/commerce/products/product.repository";
import { InventoryService } from "@/lib/commerce/inventory/inventory.service";
import { PricingService } from "@/lib/commerce/pricing/pricing.service";
import { CommerceError } from "@/lib/commerce/shared/errors";
import { normalizeMoney } from "@/lib/commerce/shared/money";
import type { CartInput } from "@/lib/commerce/cart/cart.schema";
import type { ValidatedCart } from "@/lib/commerce/cart/cart.types";

export class CartService {
  constructor(
    private readonly products: ProductRepository,
    private readonly pricing: PricingService,
    private readonly inventory: InventoryService
  ) {}

  async validate(input: CartInput): Promise<ValidatedCart> {
    const productIds = [...new Set(input.items.map((item) => item.productId))];
    const products = await this.products.findManyByIds(productIds);
    const productMap = new Map(products.map((product) => [product.id, product]));

    const items = input.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new CommerceError("Produto nao encontrado.", "PRODUCT_NOT_FOUND", 404);
      }

      const variant = item.variantId
        ? product.variants.find((candidate) => candidate.id === item.variantId)
        : null;

      if (item.variantId && !variant) {
        throw new CommerceError(
          `Variacao nao encontrada para ${product.name}.`,
          "PRODUCT_NOT_FOUND",
          404
        );
      }

      this.inventory.assertAvailable(product, item.quantity, variant);
      const unitPrice = this.pricing.getUnitPrice(product, variant);

      return {
        productId: product.id,
        variantId: variant?.id ?? null,
        name: product.name,
        variantName: variant?.name ?? null,
        quantity: item.quantity,
        unitPrice,
        subtotal: normalizeMoney(unitPrice * item.quantity),
        imageUrl: product.images[0]?.url ?? null
      };
    });

    return {
      items,
      ...this.pricing.summarize(items)
    };
  }
}
