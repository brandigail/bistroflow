"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import type { StaffRole } from "@/types";
import { DEMO_STAFF } from "./demo-staff";

export async function login(_previous: string | null, formData: FormData): Promise<string | null> {
  try {
    await signIn("credentials", {
      staffId: formData.get("staffId"),
      pin: formData.get("pin"),
      redirectTo: "/", // the proxy sends kitchen staff on to /kds
    });
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
  await signIn("credentials", { staffId: member.id, pin: member.pin, redirectTo: "/" });
}

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/" });
}
