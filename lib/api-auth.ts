import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { StaffRole } from "@/types";

export async function currentRole(): Promise<StaffRole | null> {
  const session = await auth();
  return session?.user?.role ?? null;
}

export const unauthorized = () => NextResponse.json({ error: "Sign in required" }, { status: 401 });
export const forbidden = () => NextResponse.json({ error: "Your role cannot do this" }, { status: 403 });
