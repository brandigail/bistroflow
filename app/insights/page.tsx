import type { Metadata } from "next";
import { Suspense } from "react";
import { AppHeader } from "@/components/app-header";
import { InsightsSkeleton, InsightsView } from "@/features/insights/insights-view";

export const metadata: Metadata = { title: "Insights" };

export default function InsightsPage() {
  return (
    <main id="main" className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6">
      <AppHeader current="/insights" />
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Insights</h1>
      <p className="mb-8 mt-1 text-muted">What sells, when you are busy, and how this week compares with last.</p>
      <Suspense fallback={<InsightsSkeleton />}>
        <InsightsView />
      </Suspense>
    </main>
  );
}
