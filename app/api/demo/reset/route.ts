import { NextResponse } from "next/server";
import { seedDemoData } from "@/db/seed";
import { currentRole, forbidden, unauthorized } from "@/lib/api-auth";
import { canResetDemo } from "@/lib/permissions";

export async function POST() {
  const role = await currentRole();
  if (!role) return unauthorized();
  if (!canResetDemo(role)) return forbidden();

  try {
    const summary = await seedDemoData();
    return NextResponse.json({ ok: true, ...summary });
  } catch {
    return NextResponse.json({ error: "Could not reset the demo data" }, { status: 500 });
  }
}
