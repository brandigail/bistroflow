import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { auth } from "@/auth";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { getStaff } from "@/features/auth/queries";
import { LoginForm } from "@/features/auth/login-form";
import { homeFor } from "@/lib/permissions";

export const metadata: Metadata = { title: "Sign in | BistroFlow" };

async function StaffLogin() {
  await connection();
  const session = await auth();
  if (session) redirect(homeFor(session.user.role)); // already signed in
  return <LoginForm staff={await getStaff()} />;
}

export default function LoginPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-md flex-1 p-4 pt-10 sm:p-6 sm:pt-16">
      <div className="flex items-center justify-between">
        <BrandMark />
        <ThemeToggle />
      </div>
      <h1 className="font-display mt-8 text-3xl font-semibold">Welcome back</h1>
      <p className="mb-6 mt-1 text-muted">Pick your name and enter your PIN to start your shift.</p>
      <Suspense fallback={<div aria-busy="true" className="h-72 animate-pulse rounded-2xl bg-surface-2" />}>
        <StaffLogin />
      </Suspense>
    </main>
  );
}
