import { NextResponse } from "next/server";
import { z } from "zod";
import { payTable } from "@/features/billing/pay-table";
import { currentRole, forbidden, unauthorized } from "@/lib/api-auth";
import { canTakeOrders } from "@/lib/permissions";

export async function POST(_request: Request, ctx: RouteContext<"/api/tables/[id]/pay">) {
  const role = await currentRole();
  if (!role) return unauthorized();
  if (!canTakeOrders(role)) return forbidden();

  const { id } = await ctx.params;
  if (!z.string().uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  try {
    const result = await payTable(id);
    if (result === "nothing_to_pay") return NextResponse.json({ error: "Nothing to pay on this table" }, { status: 409 });
    if (result === "kitchen_busy") {
      return NextResponse.json({ error: "The kitchen is still preparing this table's order" }, { status: 409 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not take payment" }, { status: 500 });
  }
}
