import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";

/** Edge-safe half of the Auth.js config (no database or hashing), shared with proxy.ts. */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 }, // one shift
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.staffId = user.id;
      }
      return token;
    },
    session({ session, token }) {
      // With the JWT strategy `token` is always our JWT, but the callback types it as a union.
      const { role, staffId } = token as JWT;
      if (role && staffId) {
        session.user.role = role;
        session.user.id = staffId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
