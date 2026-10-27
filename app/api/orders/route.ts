import { NextResponse } from "next/server";
import { OrderRejectedError, placeOrder } from "@/features/orders/place-order";
import { placeOrderSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = placeOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    const { orderId } = await placeOrder(parsed.data);
    return NextResponse.json({ orderId }, { status: 201 });
  } catch (error) {
    if (error instanceof OrderRejectedError) {
      const status = error.code === "INSUFFICIENT_STOCK" ? 409 : 422;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }
    // Unknown table (FK violation) or database failure.
    return NextResponse.json({ error: "Could not place order" }, { status: 500 });
  }
}
