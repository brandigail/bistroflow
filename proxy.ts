import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { canAccessPath, homeFor } from "@/lib/permissions";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

/** Pages anyone can open. Signed-in staff are sent on to their own home instead. */
const PUBLIC_PATHS = new Set(["/", "/login"]);

// Optimistic redirects only. Every page and API handler re-checks the session itself.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (PUBLIC_PATHS.has(pathname)) {
    return role ? NextResponse.redirect(new URL(homeFor(role), req.url)) : NextResponse.next();
  }
  if (!role) return NextResponse.redirect(new URL("/login", req.url));
  if (!canAccessPath(role, pathname)) return NextResponse.redirect(new URL(homeFor(role), req.url));
  return NextResponse.next();
});

// Static assets under /public (screenshots, icons) must bypass auth so the landing page can show them.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|screens/|.*\\.(?:png|jpg|jpeg|webp|svg|ico|txt|xml)$).*)"],
};
