"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

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

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
