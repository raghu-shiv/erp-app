import { z } from "zod";

export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.coerce.number().int().positive().max(999),
      }),
    )
    .min(1),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  payments: z
    .array(
      z.object({
        method: z.enum(["CASH", "UPI"]),
        amount: z.coerce.number().positive(),
        reference: z.string().trim().min(1).max(120).optional().nullable(),
      }),
    )
    .min(1),
  notes: z.string().trim().max(500).optional().nullable(),
});
