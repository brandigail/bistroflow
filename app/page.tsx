import Link from "next/link";
import { Suspense } from "react";
import { BrandMark } from "@/components/brand-mark";
import { TableMap, TableMapSkeleton } from "@/features/tables/table-map";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
      <header className="mb-8 flex items-center justify-between gap-3">
        <BrandMark />
        <nav className="flex gap-2">
          <Link
            href="/inventory"
            className="flex min-h-11 items-center rounded-xl border border-line px-4 text-sm font-semibold"
          >
            Inventory
          </Link>
          <Link
            href="/kds"
            className="flex min-h-11 items-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground"
          >
            Kitchen display
          </Link>
        </nav>
      </header>
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">The floor</h1>
      <p className="mb-6 mt-1 text-muted">Pick a table to take an order or settle the bill.</p>
      <Suspense fallback={<TableMapSkeleton />}>
        <TableMap />
      </Suspense>
    </main>
  );
}
