import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { StaffRole } from "@/types";
import { canAccessPath, homeFor } from "./permissions";

export interface AccessUser {
  id: string;
  name?: string | null;
  role: StaffRole;
}

/**
 * Page-level authorization. Call it first in any server component that reads data: it redirects
 * to the login screen when signed out, or to the user's own home when their role can't see the page,
 * and it does so before any query runs. (API handlers do the same check with their own responses.)
 */
export async function requireAccess(pathname: string): Promise<AccessUser> {
  const session = await auth();
  if (!session) redirect("/login");
  const { role } = session.user;
  if (!canAccessPath(role, pathname)) redirect(homeFor(role));
  return session.user;
}
