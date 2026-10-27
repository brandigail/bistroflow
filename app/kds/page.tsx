import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { AppHeader } from "@/components/app-header";
import { KdsBoard } from "@/features/kds/kds-board";

export const metadata: Metadata = { title: "Kitchen | BistroFlow" };

async function KdsForRole() {
  const session = await auth();
  if (!session) redirect("/login");
  return <KdsBoard role={session.user.role} />;
}

export default function KdsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
      <AppHeader current="/kds" />
      <Suspense fallback={<p className="py-10 text-center text-muted">Loading…</p>}>
        <KdsForRole />
      </Suspense>
    </main>
  );
}
