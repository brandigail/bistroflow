"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="mx-auto flex w-full max-w-md flex-1 flex-col items-start gap-4 p-6 pt-16">
      <p className="font-display text-6xl font-semibold text-accent">Oops</p>
      <h1 className="font-display text-3xl font-semibold">The kitchen dropped something</h1>
      <p className="text-muted">Something went wrong loading this page. Your orders are safe. Try again in a moment.</p>
      <div className="flex gap-3">
        <button onClick={reset} className="min-h-12 rounded-xl bg-accent px-5 font-semibold text-accent-foreground">
          Try again
        </button>
        <Link href="/" className="flex min-h-12 items-center rounded-xl border border-line px-5 font-semibold">
          Back to the floor
        </Link>
      </div>
    </main>
  );
}
