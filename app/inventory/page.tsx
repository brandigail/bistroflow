import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandMark } from "@/components/brand-mark";
import { InventorySkeleton, InventoryView } from "@/features/inventory/inventory-view";

export const metadata: Metadata = { title: "Inventory | BistroFlow" };

export default function InventoryPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
      <header className="mb-8">
        <BrandMark />
      </header>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Inventory</h1>
      <p className="mb-8 mt-1 text-muted">Stock drops automatically as orders are sent to the kitchen.</p>
      <Suspense fallback={<InventorySkeleton />}>
        <InventoryView />
      </Suspense>
    </main>
  );
}
