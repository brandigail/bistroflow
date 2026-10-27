import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { KdsBoard } from "@/features/kds/kds-board";
import { requireAccess } from "@/lib/access";

export const metadata: Metadata = { title: "Kitchen | BistroFlow" };

async function KdsForRole() {
  await connection();
  const user = await requireAccess("/kds");
  return <KdsBoard role={user.role} />;
}

export default function KdsPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
      <AppHeader current="/kds" />
      <Suspense fallback={<p className="py-10 text-center text-muted">Loading…</p>}>
        <KdsForRole />
      </Suspense>
    </main>
  );
}
