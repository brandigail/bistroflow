import { NextResponse } from "next/server";
import { z } from "zod";
import { advanceOrder } from "@/features/orders/advance-order";
import { updateStatusSchema } from "@/lib/schemas";

export async function PATCH(request: Request, ctx: RouteContext<"/api/orders/[id]">) {
  const { id } = await ctx.params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const parsed = updateStatusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  try {
    const result = await advanceOrder(id, parsed.data.status);
    if (result === "not_found") return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (result === "invalid_transition") {
      return NextResponse.json({ error: "Order is not in the expected state" }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not update order" }, { status: 500 });
  }
}
