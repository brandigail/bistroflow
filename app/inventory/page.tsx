import type { Metadata } from "next";
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { InventorySkeleton, InventoryView } from "@/features/inventory/inventory-view";

export const metadata: Metadata = { title: "Inventory | BistroFlow" };

export default function InventoryPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
      <AppHeader current="/inventory" />
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Inventory</h1>
      <p className="mb-8 mt-1 text-muted">Stock drops automatically as orders are sent to the kitchen. Anything running low lands in the reorder list.</p>
      <Suspense fallback={<InventorySkeleton />}>
        <InventoryView />
      </Suspense>
    </main>
  );
}
