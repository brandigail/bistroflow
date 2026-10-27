import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { TableMap, TableMapSkeleton } from "@/features/tables/table-map";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
      <AppHeader current="/" />
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">The floor</h1>
      <p className="mb-6 mt-1 text-muted">Pick a table to take an order or settle the bill.</p>
      <Suspense fallback={<TableMapSkeleton />}>
        <TableMap />
      </Suspense>
    </main>
  );
}
