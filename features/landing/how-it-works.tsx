import { ChefHat, PackagePlus, ReceiptText } from "lucide-react";

function StepCard({
  step,
  title,
  icon: Icon,
  children,
  visual,
}: {
  step: string;
  title: string;
  icon: typeof ChefHat;
  children: React.ReactNode;
  visual: React.ReactNode;
}) {
  return (
    <li className="relative flex flex-col rounded-3xl border border-line bg-surface p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-accent/12 text-accent">
          <Icon aria-hidden className="size-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Step {step}</p>
          <h3 className="font-display text-2xl font-semibold">{title}</h3>
        </div>
      </div>
      <p className="mb-5 text-muted">{children}</p>
      <div aria-hidden className="mt-auto rounded-2xl border border-line bg-background p-4">
        {visual}
      </div>
    </li>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-y border-line bg-surface-2/50 py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-5xl">One loop, from the table to the stockroom</h2>
          <p className="mt-4 text-lg text-muted">
            Most restaurants run orders, the kitchen and stock as three separate things. BistroFlow connects them, so each step
            updates the next.
          </p>
        </div>

        <ol className="grid gap-6 lg:grid-cols-3">
          <StepCard
            step="1"
            title="Order"
            icon={ReceiptText}
            visual={
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                  <span>Classic Burger</span>
                  <span className="text-muted">$14.95</span>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                  <span>Fresh Lemonade</span>
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300">Only 4 left</span>
                </li>
                <li className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 opacity-60">
                  <span>Caesar Salad</span>
                  <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-700 dark:text-red-300">Sold out</span>
                </li>
              </ul>
            }
          >
            The waiter builds the order at the table. The menu already shows what the kitchen can really make, so nobody promises a dish
            that is gone.
          </StepCard>

          <StepCard
            step="2"
            title="Cook"
            icon={ChefHat}
            visual={
              <div className="rounded-xl border border-line bg-surface p-3 text-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-display text-lg font-semibold">Table 6</span>
                  <span className="relative h-6 w-24">
                    <span className="status-cycle absolute inset-0 flex items-center justify-center rounded-full bg-sky-500/15 text-xs font-semibold text-sky-700 dark:text-sky-300" style={{ animationDelay: "0s" }}>New</span>
                    <span className="status-cycle absolute inset-0 flex items-center justify-center rounded-full bg-amber-500/15 text-xs font-semibold text-amber-800 dark:text-amber-300" style={{ animationDelay: "2s" }}>Preparing</span>
                    <span className="status-cycle absolute inset-0 flex items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-800 dark:text-emerald-300" style={{ animationDelay: "4s" }}>Ready</span>
                  </span>
                </div>
                <p className="text-muted">1× Margherita Pizza</p>
                <p className="text-muted">2× Caesar Salad</p>
              </div>
            }
          >
            The ticket lands on the kitchen board within about two seconds. The cooks move it along, and the waiter sees the moment it is
            ready.
          </StepCard>

          <StepCard
            step="3"
            title="Restock"
            icon={PackagePlus}
            visual={
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cream</span>
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300">Reorder 2,500 ml</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
                  <div className="stock-drain h-full rounded-full bg-accent" />
                </div>
                <p className="text-muted">Affects Chocolate Mousse, Tomato Soup</p>
              </div>
            }
          >
            Every order deducts its ingredients automatically. Before anything runs out, the reorder list names the shortage, the dishes it
            affects and a quantity to buy.
          </StepCard>
        </ol>
      </div>
    </section>
  );
}
