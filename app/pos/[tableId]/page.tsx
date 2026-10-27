import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { z } from "zod";
import { getMenu, getTable } from "@/features/menu/queries";
import { OrderBuilder } from "@/features/pos/order-builder";

async function TableOrder({ params }: { params: Promise<{ tableId: string }> }) {
  await connection();
  const { tableId } = await params;
  if (!z.string().uuid().safeParse(tableId).success) notFound();
  const [table, menu] = await Promise.all([getTable(tableId), getMenu()]);
  if (!table) notFound();
  return <OrderBuilder table={table} menu={menu} />;
}

export default function PosPage({ params }: PageProps<"/pos/[tableId]">) {
  return (
    <Suspense fallback={<main className="flex-1 p-6 opacity-60">Loading…</main>}>
      <TableOrder params={params} />
    </Suspense>
  );
}
