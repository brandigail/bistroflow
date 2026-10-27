import { z } from "zod";

export const ticketStatusSchema = z.enum(["NEW", "PREPARING", "READY", "SERVED", "PAID"]);

export const placeOrderSchema = z.object({
  tableId: z.string().uuid(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().uuid(),
        quantity: z.number().int().positive().max(50),
        notes: z.string().max(200).default(""),
      }),
    )
    .min(1),
});

export const updateStatusSchema = z.object({ status: ticketStatusSchema });

export const receiveStockSchema = z.object({
  items: z
    .array(
      z.object({
        ingredientId: z.string().uuid(),
        // A delivery can only add stock; corrections would be a separate, audited action.
        quantity: z.number().positive().max(1_000_000),
      }),
    )
    .min(1)
    .max(100),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type ReceiveStockInput = z.infer<typeof receiveStockSchema>;
