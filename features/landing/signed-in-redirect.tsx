import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";
import { homeFor } from "@/lib/permissions";

/** Sends someone who is already signed in from the landing page straight to their own home. */
export async function SignedInRedirect() {
  await connection(); // depends on the visitor's cookies, so never prerendered
  const session = await auth();
  if (session) redirect(homeFor(session.user.role));
  return null;
}
