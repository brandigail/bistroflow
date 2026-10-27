import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";

export async function GET() {
  try {
    const result = await getDb().execute<{ now: string }>(sql`select now() as now`);
    return NextResponse.json({ ok: true, dbTime: result.rows[0].now });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
