import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { FloorStats, FloorStatsSkeleton } from "@/features/tables/floor-stats";
import { TableMap, TableMapSkeleton } from "@/features/tables/table-map";

export default function Home() {
  return (
    <main id="main" className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
      <AppHeader current="/" />
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">The floor</h1>
      <p className="mt-1 text-muted">Pick a table to take an order or settle the bill.</p>
      <details className="group mb-6 mt-3 rounded-2xl border border-line bg-surface p-4">
        <summary className="flex min-h-11 list-none items-center justify-between gap-3 font-semibold">
          How BistroFlow works
          <span aria-hidden className="text-muted transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <ol className="mt-2 grid gap-4 text-sm sm:grid-cols-3">
          <li>
            <p className="font-display text-lg font-semibold">1 · Order</p>
            <p className="text-muted">Waiters take orders at the table. The menu shows what is really in stock, so nobody promises a dish the kitchen can&apos;t make.</p>
          </li>
          <li>
            <p className="font-display text-lg font-semibold">2 · Cook</p>
            <p className="text-muted">The ticket reaches the kitchen board instantly. The kitchen moves it from New to Preparing to Ready, and the waiter sees it.</p>
          </li>
          <li>
            <p className="font-display text-lg font-semibold">3 · Restock</p>
            <p className="text-muted">Every order deducts its ingredients automatically. Managers get a reorder list before anything runs out, and one tap records the delivery.</p>
          </li>
        </ol>
      </details>
      <Suspense fallback={<FloorStatsSkeleton />}>
        <FloorStats />
      </Suspense>
      <Suspense fallback={<TableMapSkeleton />}>
        <TableMap />
      </Suspense>
    </main>
  );
}
