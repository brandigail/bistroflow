import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { z } from "zod";
import { getTableBill } from "@/features/billing/queries";
import { getMenu, getTable } from "@/features/menu/queries";
import { OrderBuilder } from "@/features/pos/order-builder";
import { requireAccess } from "@/lib/access";

async function TableOrder({ params }: { params: Promise<{ tableId: string }> }) {
  await connection();
  await requireAccess("/pos");
  const { tableId } = await params;
  if (!z.string().uuid().safeParse(tableId).success) notFound();
  const [table, menu, bill] = await Promise.all([getTable(tableId), getMenu(), getTableBill(tableId)]);
  if (!table) notFound();
  return <OrderBuilder table={table} menu={menu} bill={bill} />;
}

export default function PosPage({ params }: PageProps<"/pos/[tableId]">) {
  return (
    <Suspense fallback={<main id="main" className="flex-1 p-6 text-muted">Loading…</main>}>
      <TableOrder params={params} />
    </Suspense>
  );
}
