import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { FloorStats, FloorStatsSkeleton } from "@/features/tables/floor-stats";
import { TableMap, TableMapSkeleton } from "@/features/tables/table-map";

export default function FloorPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
      <AppHeader current="/floor" />
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">The floor</h1>
      <p className="mb-6 mt-1 text-muted">Pick a table to take an order or settle the bill.</p>
      <Suspense fallback={<FloorStatsSkeleton />}>
        <FloorStats />
      </Suspense>
      <Suspense fallback={<TableMapSkeleton />}>
        <TableMap />
      </Suspense>
    </main>
  );
}
