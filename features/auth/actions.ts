"use server";

import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { getDb } from "@/db";
import { staff } from "@/db/schema";
import { homeFor } from "@/lib/permissions";
import type { StaffRole } from "@/types";
import { DEMO_STAFF } from "./demo-staff";

/** Where this person should land after signing in, or null when the id doesn't match anyone. */
async function homeForStaff(staffId: string): Promise<string | null> {
  if (!z.string().uuid().safeParse(staffId).success) return null;
  const [row] = await getDb().select({ role: staff.role }).from(staff).where(eq(staff.id, staffId)).limit(1);
  return row ? homeFor(row.role) : null;
}

export async function login(_previous: string | null, formData: FormData): Promise<string | null> {
  const staffId = String(formData.get("staffId") ?? "");
  const redirectTo = await homeForStaff(staffId);
  // An unknown id means the page was loaded before the staff list changed, not that the PIN is wrong.
  if (!redirectTo) return "This page is out of date. Refresh it and try again.";

  try {
    await signIn("credentials", { staffId, pin: formData.get("pin"), redirectTo });
    return null;
  } catch (error) {
    if (error instanceof AuthError) return "That PIN is not right. Try again.";
    throw error; // the sign-in redirect itself is thrown and must propagate
  }
}

/** One-click entry for the public demo: signs in as the demo account for the chosen role. */
export async function demoLogin(role: StaffRole): Promise<void> {
  const member = DEMO_STAFF.find((s) => s.role === role);
  if (!member) return;
  await signIn("credentials", { staffId: member.id, pin: member.pin, redirectTo: homeFor(role) });
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
