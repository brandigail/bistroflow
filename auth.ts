import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { getDb } from "@/db";
import { staff } from "@/db/schema";
import { authConfig } from "./auth.config";

const credentialsSchema = z.object({ staffId: z.string().uuid(), pin: z.string().regex(/^\d{4}$/) });

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { staffId: {}, pin: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) {
          console.warn("[login] rejected: staffId or PIN failed validation");
          return null;
        }
        const [member] = await getDb().select().from(staff).where(eq(staff.id, parsed.data.staffId)).limit(1);
        if (!member) {
          console.warn("[login] rejected: unknown staff id (stale login page?)");
          return null;
        }
        if (!(await bcrypt.compare(parsed.data.pin, member.pinHash))) {
          console.warn(`[login] rejected: wrong PIN for ${member.role}`);
          return null;
        }
        return { id: member.id, name: member.name, role: member.role };
      },
    }),
  ],
});
