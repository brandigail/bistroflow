import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { canAccessPath, homeFor } from "@/lib/permissions";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

// Optimistic redirects only. Every page and API handler re-checks the session itself.
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (pathname === "/login") {
    return role ? NextResponse.redirect(new URL(homeFor(role), req.url)) : NextResponse.next();
  }
  if (!role) return NextResponse.redirect(new URL("/login", req.url));
  if (!canAccessPath(role, pathname)) return NextResponse.redirect(new URL(homeFor(role), req.url));
  return NextResponse.next();
});

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
