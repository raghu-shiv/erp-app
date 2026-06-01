export type BillingItemInput = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
};

export type BillingLine = BillingItemInput & {
  grossAmount: number;
  discountAmount: number;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
};

export type BillingTotals = {
  lines: BillingLine[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
};

export function toCents(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function calculateBilling(items: BillingItemInput[], discountPercent = 0): BillingTotals {
  if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    throw new Error("Discount percent must be between 0 and 100");
  }

  const lines = items.map((item) => {
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Item quantity must be a positive integer");
    }

    const grossCents = toCents(item.unitPrice) * item.quantity;
    const discountCents = Math.round((grossCents * discountPercent) / 100);
    const subtotalCents = grossCents - discountCents;
    const taxCents = Math.round((subtotalCents * item.taxRate) / 100);

    return {
      ...item,
      grossAmount: fromCents(grossCents),
      discountAmount: fromCents(discountCents),
      subtotal: fromCents(subtotalCents),
      taxAmount: fromCents(taxCents),
      totalAmount: fromCents(subtotalCents + taxCents),
    };
  });

  return lines.reduce<BillingTotals>(
    (totals, line) => ({
      lines: [...totals.lines, line],
      subtotal: fromCents(toCents(totals.subtotal) + toCents(line.subtotal)),
      taxAmount: fromCents(toCents(totals.taxAmount) + toCents(line.taxAmount)),
      discountAmount: fromCents(toCents(totals.discountAmount) + toCents(line.discountAmount)),
      totalAmount: fromCents(toCents(totals.totalAmount) + toCents(line.totalAmount)),
    }),
    { lines: [], subtotal: 0, taxAmount: 0, discountAmount: 0, totalAmount: 0 },
  );
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

