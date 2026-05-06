export function normalizeMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function effectivePrice(price: number, salePrice?: number | null) {
  return salePrice != null && salePrice > 0 && salePrice < price
    ? salePrice
    : price;
}

export function moneyToCents(value: number) {
  return Math.round(value * 100);
}
