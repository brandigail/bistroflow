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

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
