import { NextResponse } from "next/server";
import { receiveStock, UnknownIngredientError } from "@/features/inventory/receive-stock";
import { currentRole, forbidden, unauthorized } from "@/lib/api-auth";
import { canManageInventory } from "@/lib/permissions";
import { receiveStockSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const role = await currentRole();
  if (!role) return unauthorized();
  if (!canManageInventory(role)) return forbidden();

  const parsed = receiveStockSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid delivery" }, { status: 400 });

  try {
    await receiveStock(parsed.data);
    return NextResponse.json({ ok: true, lines: parsed.data.items.length });
  } catch (error) {
    if (error instanceof UnknownIngredientError) return NextResponse.json({ error: error.message }, { status: 422 });
    return NextResponse.json({ error: "Could not record the delivery" }, { status: 500 });
  }
}
