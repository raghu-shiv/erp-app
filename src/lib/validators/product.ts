import { z } from "zod";

const optionalText = z.string().trim().min(1).optional().nullable();

export const productInputSchema = z.object({
  name: z.string().trim().min(1).max(160),
  sku: z.string().trim().min(1).max(80),
  barcode: optionalText,
  description: optionalText,
  price: z.coerce.number().nonnegative(),
  costPrice: z.coerce.number().nonnegative().optional().nullable(),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  hsnCode: optionalText,
  unit: z.string().trim().min(1).max(24).default("PCS"),
  stockQuantity: z.coerce.number().int().nonnegative().default(0),
  minStockAlert: z.coerce.number().int().nonnegative().default(10),
  batchNumber: optionalText,
  expiryDate: z.coerce.date().optional().nullable(),
  supplierId: optionalText,
  categoryId: optionalText,
  isActive: z.boolean().default(true),
});

export const productUpdateSchema = productInputSchema.omit({ stockQuantity: true }).partial();

export const stockAdjustmentSchema = z
  .object({
    transactionType: z.enum(["IN", "OUT", "ADJUSTMENT"]),
    quantity: z.coerce.number().int().refine((quantity) => quantity !== 0, {
      message: "Quantity must not be zero",
    }),
    reason: z.string().trim().min(1).max(240),
    referenceId: optionalText,
  })
  .refine(
    ({ quantity, transactionType }) => transactionType === "ADJUSTMENT" || quantity > 0,
    {
      message: "Inbound and outbound quantities must be positive",
      path: ["quantity"],
    },
  );
