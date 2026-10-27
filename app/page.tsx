import Link from "next/link";
import { Suspense } from "react";
import { TableMap, TableMapSkeleton } from "@/features/tables/table-map";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">BistroFlow</h1>
          <p className="text-sm opacity-70">Floor overview. Pick a table to take an order.</p>
        </div>
        <Link href="/kds" className="flex min-h-11 items-center rounded-lg border border-foreground/25 px-4 text-sm font-medium">
          Kitchen display
        </Link>
      </header>
      <Suspense fallback={<TableMapSkeleton />}>
        <TableMap />
      </Suspense>
    </main>
  );
}
